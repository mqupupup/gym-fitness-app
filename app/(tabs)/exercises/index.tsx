import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystemLegacy from "expo-file-system/legacy";
import * as VideoThumbnails from "expo-video-thumbnails"; // 新增导入
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

// === 类型定义 ===
type TrainingRecord = {
  id: string;
  date: string;
  duration: string;
  image?: string | null;
  isProcessing?: boolean;
  score?: number;
  exercise?: string;
};

// 后端 API 配置
const API_BASE_URL = "http://192.168.1.78:8000";

export default function exercises() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleEdit = (id: string) => console.log("Edit:", id);

  const showDeleteConfirmation = (id: string) => {
    Alert.alert("确认删除", "您确定要删除这条训练记录吗？此操作无法撤销。", [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "删除",
        style: "destructive",
        onPress: () => handleDelete(id),
      },
    ]);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== id),
      );
      setDeletingId(null);
      console.log("Delete:", id);
    }, 300);
  };

  // 提取视频第一帧作为缩略图（使用 expo-video-thumbnails）
  const extractVideoThumbnail = async (
    videoUri: string,
  ): Promise<string | null> => {
    try {
      console.log("Attempting to extract thumbnail from:", videoUri);

      // 使用 expo-video-thumbnails 提取第一帧
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 0, // 第一帧
        height: 80,
        width: 120,
        format: VideoThumbnails.ThumbnailFormat.JPEG,
      });

      console.log("Thumbnail extracted successfully:", uri);
      return uri;
    } catch (error) {
      console.error("Failed to extract video thumbnail:", error);

      // 如果提取失败，尝试返回视频 URI
      if (Platform.OS === "ios") {
        return videoUri;
      }

      return null;
    }
  };

  // 初始化上传会话
  const initUploadSession = async (fileName: string, fileSize: number) => {
    const response = await fetch(`${API_BASE_URL}/init-upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName,
        fileSize,
        totalChunks: Math.ceil(fileSize / (5 * 1024 * 1024)), // 5MB 每块
      }),
    });

    if (!response.ok) {
      throw new Error(`初始化失败: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  };

  // 获取已上传的分块
  const getUploadedChunks = async (sessionId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/get-uploaded-chunks/${sessionId}`,
    );
    if (!response.ok) {
      throw new Error(
        `获取分块状态失败: ${response.status} ${response.statusText}`,
      );
    }
    return await response.json();
  };

  // 上传单个分块
  const uploadChunk = async (
    sessionId: string,
    chunkIndex: number,
    chunkData: string,
  ) => {
    const response = await fetch(`${API_BASE_URL}/upload-chunk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        chunkIndex,
        chunkData,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `分块 ${chunkIndex} 上传失败: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  };

  // 合并分块并分析
  const mergeAndAnalyze = async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/merge-and-analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error(
        `合并分析失败: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  };

  // 断点上传主函数
  const handleUploadVideoWithChunking = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/mp4", "video/quicktime"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      console.log("选择的视频:", file);

      // 验证文件大小
      let fileSize = file.size || 0;
      if (fileSize === 0 && file.uri) {
        try {
          const fileInfo = await FileSystemLegacy.getInfoAsync(file.uri);
          fileSize = fileInfo.size;
        } catch (statError) {
          console.warn("无法获取文件大小");
        }
      }

      if (fileSize > 100 * 1024 * 1024) {
        Alert.alert("视频太大", "请上传小于100MB的视频文件");
        return;
      }

      setUploading(true);
      setUploadProgress(0);
      setUploadStatus("初始化上传...");

      // 不提取前端缩略图，直接使用 null
      const newRecord: TrainingRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("zh-CN").replace(/\//g, "-"),
        duration: "0:00",
        image: null, // 暂时不设置缩略图，等待后端返回
        isProcessing: true,
      };
      setRecords((prev) => [newRecord, ...prev]);

      // 初始化上传会话
      const initResult = await initUploadSession(
        file.name || `video-${Date.now()}.mp4`,
        fileSize,
      );

      if (!initResult.success) {
        throw new Error(initResult.error || "初始化上传失败");
      }

      const { sessionId, fileName: uniqueFileName } = initResult;
      const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

      console.log(`开始上传 ${totalChunks} 个分块`);

      // 获取已上传的分块（断点续传）
      let uploadedChunks: number[] = [];
      try {
        const chunksResult = await getUploadedChunks(sessionId);
        if (chunksResult.success) {
          uploadedChunks = chunksResult.uploadedChunks;
          console.log(`已上传分块: ${uploadedChunks.length}/${totalChunks}`);
        }
      } catch (error) {
        console.warn("获取已上传分块失败，从头开始:", error);
        uploadedChunks = [];
      }

      // 上传未完成的分块
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        if (uploadedChunks.includes(chunkIndex)) {
          console.log(`跳过分块 ${chunkIndex} (已上传)`);
          continue;
        }

        setUploadStatus(`上传分块 ${chunkIndex + 1}/${totalChunks}...`);

        // 计算分块位置和大小
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileSize);
        const chunkLength = end - start;

        // 读取分块数据
        const chunkBase64 = await FileSystemLegacy.readAsStringAsync(file.uri, {
          encoding: FileSystemLegacy.EncodingType.Base64,
          length: chunkLength,
          position: start,
        });

        // 上传分块（带重试机制）
        let retryCount = 0;
        const maxRetries = 3;
        while (retryCount < maxRetries) {
          try {
            await uploadChunk(sessionId, chunkIndex, chunkBase64);
            uploadedChunks.push(chunkIndex);
            break;
          } catch (error) {
            retryCount++;
            console.warn(
              `分块 ${chunkIndex} 上传失败，重试 ${retryCount}/${maxRetries}:`,
              error,
            );
            if (retryCount >= maxRetries) {
              throw error;
            }
            // 等待后重试
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount),
            );
          }
        }

        // 更新进度
        const progress = Math.round(
          (uploadedChunks.length / totalChunks) * 100,
        );
        setUploadProgress(progress);
        console.log(`上传进度: ${progress}%`);
      }

      setUploadStatus("合并文件并分析...");

      // 合并分块并分析
      const analysisResult = await mergeAndAnalyze(sessionId);

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || "分析失败");
      }

      // 使用后端返回的缩略图
      const thumbnailUriReturn = analysisResult.thumbnailUrl
        ? `${API_BASE_URL}${analysisResult.thumbnailUrl}`
        : null;

      setRecords((prev) =>
        prev.map((record) =>
          record.id === newRecord.id
            ? {
                ...record,
                isProcessing: false,
                duration: "0:45",
                score: analysisResult.score,
                exercise: analysisResult.exercise_type,
                image: thumbnailUriReturn,
              }
            : record,
        ),
      );

      Alert.alert(
        "AI分析完成！",
        `动作类型: ${analysisResult.exercise_type}\nAI评分: ${analysisResult.score}分\n稳定性: ${analysisResult.stability}\n偏移: ${analysisResult.offset}`,
        [{ text: "确定" }],
      );
    } catch (error: any) {
      console.error("上传错误:", error);

      let errorMessage = "视频上传或分析过程中出现错误，请重试";
      if (error.message.includes("Network request failed")) {
        errorMessage = "无法连接到服务器，请检查网络连接和后端服务是否运行";
      } else if (error.message.includes("只允许上传视频文件")) {
        errorMessage = "请选择有效的视频文件（MP4 或 MOV 格式）";
      } else if (error.message.includes("文件太大")) {
        errorMessage = "视频文件太大，请上传小于100MB的文件";
      } else if (
        error.message.includes("超时") ||
        error.message.includes("timeout")
      ) {
        errorMessage = "上传超时，请检查网络连接或稍后重试";
      } else if (
        error.message.includes("初始化失败") ||
        error.message.includes("HTTP 404")
      ) {
        errorMessage = "服务器连接失败，请确认后端服务运行在端口8000";
      }

      Alert.alert("上传失败", errorMessage);

      setRecords((prev) =>
        prev.filter(
          (record) =>
            !(
              record.isProcessing &&
              record.date ===
                new Date().toLocaleDateString("zh-CN").replace(/\//g, "-")
            ),
        ),
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadStatus("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部紫色导航栏 */}
      <View style={styles.topBar}>
        <Text style={styles.title}>训练动作分析</Text>
        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={handleUploadVideoWithChunking}
            disabled={uploading}
            style={[
              styles.uploadButton,
              uploading && styles.uploadButtonDisabled,
            ]}
          >
            {uploading ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={[styles.uploadButtonText, { marginLeft: 8 }]}>
                  {uploadProgress > 0 ? `${uploadProgress}%` : "上传中..."}
                </Text>
              </View>
            ) : (
              <Text style={styles.uploadButtonText}>上传视频</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {records.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暂无训练记录</Text>
            <Text style={styles.emptySubtext}>
              点击上方按钮上传视频开始分析
            </Text>
          </View>
        ) : (
          records.map((item) => (
            <Animated.View
              key={item.id}
              style={[
                styles.itemCard,
                deletingId === item.id && {
                  opacity: 0,
                  transform: [{ scale: 0.8 }],
                },
              ]}
            >
              <View style={styles.thumbnailWrapper}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.thumbnail}
                    onError={(error) =>
                      console.log("Image load error:", error.nativeEvent.error)
                    }
                  />
                ) : item.isProcessing ? (
                  <View style={styles.loadingPlaceholder}>
                    <ActivityIndicator size="small" color="#6a4c93" />
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                ) : (
                  <View style={styles.emptyThumbnail}>
                    <Ionicons name="videocam" size={24} color="#999" />
                    <Text style={styles.noThumbnailText}>无缩略图</Text>
                  </View>
                )}
              </View>

              <View style={styles.infoSection}>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={18} color="#333" />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
                {item.exercise && (
                  <View style={styles.metaRow}>
                    <Ionicons name="barbell-outline" size={18} color="#333" />
                    <Text style={styles.metaText}>{item.exercise}</Text>
                  </View>
                )}
                {item.score && (
                  <View style={styles.metaRow}>
                    <Ionicons name="star-outline" size={18} color="#333" />
                    <Text style={styles.metaText}>AI评分: {item.score}分</Text>
                  </View>
                )}
                {!item.exercise && !item.score && (
                  <>
                    <View style={styles.metaRow}>
                      <Ionicons name="barbell-outline" size={18} color="#333" />
                      <Text style={styles.metaText}>-</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color="#333"
                      />
                      <Text style={styles.metaText}>-</Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEdit(item.id)}>
                  <Ionicons name="create-outline" size={22} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => showDeleteConfirmation(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60 + getStatusBarHeight(),
    backgroundColor: "#fafafa",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#6a4c93",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  title: { fontSize: 20, fontWeight: "600", color: "#fff" },
  topActions: { flexDirection: "row", alignItems: "center", gap: 16 },
  uploadButton: {
    backgroundColor: "#8e6ca9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  uploadButtonDisabled: {
    backgroundColor: "#7a5a8f",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: { paddingBottom: 20 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  thumbnailWrapper: { width: 120, height: 80, justifyContent: "flex-end" },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loadingPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  emptyThumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  noThumbnailText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  infoSection: { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
  dateRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  dateText: { marginLeft: 8, fontSize: 16, fontWeight: "500", color: "#333" },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  metaText: { marginLeft: 8, fontSize: 14, color: "#666" },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 80,
    paddingHorizontal: 12,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
  },
});
