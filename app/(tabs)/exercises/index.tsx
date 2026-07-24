import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystemLegacy from "expo-file-system/legacy";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  Modal,
  Platform,
  Animated as RNAnimated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ================================================================
// 类型定义
// ================================================================
type TrainingRecord = {
  id: string;
  date: string;
  duration: string;
  image?: string | null;
  isProcessing?: boolean;
  score?: number;
  exercise?: string;
  analysisDetails?: AnalysisResult;
};

type StickingPoint = {
  x: number;
  y: number;
  frame_pct: number;
  description: string;
};

type AnalysisResult = {
  analysis_id: string;
  exercise_type: string;
  exercise_type_zh: string;
  confidence: number;
  score: number;
  stability: string;
  offset: string;
  avg_speed: string;
  max_speed: string;
  path_smoothness: string;
  sticking_point: StickingPoint | null;
  rpe: number;
  feedback: string[];
  thumbnailUrl: string;
  videoUrl: string;
  trajectory: number[][];
};

const API_BASE_URL = "http://192.168.1.78:8000";

const EXERCISE_ZH_MAP: Record<string, string> = {
  Squat: "深蹲",
  "Bench Press": "卧推",
  Deadlift: "硬拉",
  "Overhead Press": "过头推举",
  Unknown: "未知动作",
};

const SUPPORTED_EXERCISES = ["卧推", "深蹲", "硬拉"];

const analyzingProgressAnim = React.useRef(new RNAnimated.Value(0)).current;

export default function ExercisesScreen() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(
    null,
  );
  const [showUploadLockModal, setShowUploadLockModal] = useState(false);
  const [isAnalyzingPhase, setIsAnalyzingPhase] = useState(false);

  const handleEdit = (id: string) => console.log("Edit:", id);

  const showDeleteConfirmation = (id: string) => {
    Alert.alert("确认删除", "您确定要删除这条训练记录吗？此操作无法撤销。", [
      { text: "取消", style: "cancel" },
      { text: "删除", style: "destructive", onPress: () => handleDelete(id) },
    ]);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setDeletingId(null);
    }, 300);
  };

  const showAnalysisDetails = (analysis: AnalysisResult) => {
    setCurrentAnalysis(analysis);
    setShowAnalysisModal(true);
  };

  const hideAnalysisDetails = () => {
    setShowAnalysisModal(false);
    setCurrentAnalysis(null);
  };

  const validateAnalysisData = (data: any): AnalysisResult => {
    let safeTrajectory: number[][] = [];
    if (Array.isArray(data.trajectory)) {
      safeTrajectory = data.trajectory.filter(
        (p: any) =>
          Array.isArray(p) &&
          p.length >= 2 &&
          typeof p[0] === "number" &&
          typeof p[1] === "number",
      );
    }

    let safeSticking: StickingPoint | null = null;
    if (data.sticking_point && typeof data.sticking_point === "object") {
      safeSticking = {
        x:
          typeof data.sticking_point.x === "number" ? data.sticking_point.x : 0,
        y:
          typeof data.sticking_point.y === "number" ? data.sticking_point.y : 0,
        frame_pct:
          typeof data.sticking_point.frame_pct === "number"
            ? data.sticking_point.frame_pct
            : 0,
        description:
          typeof data.sticking_point.description === "string"
            ? data.sticking_point.description
            : "",
      };
    }

    let safeFeedback: string[] = [];
    if (Array.isArray(data.feedback)) {
      safeFeedback = data.feedback.filter((f: any) => typeof f === "string");
    } else if (typeof data.feedback === "string" && data.feedback) {
      safeFeedback = [data.feedback];
    }
    if (safeFeedback.length === 0) {
      safeFeedback = ["📋 本次训练已完成分析，继续保持！"];
    }

    const exType =
      typeof data.exercise_type === "string" ? data.exercise_type : "Unknown";
    const exZh =
      typeof data.exercise_type_zh === "string"
        ? data.exercise_type_zh
        : EXERCISE_ZH_MAP[exType] || exType;

    let confidence = 0;
    if (typeof data.confidence === "number") confidence = data.confidence;
    else if (typeof data.confidence_score === "number")
      confidence = data.confidence_score;
    else if (typeof data.accuracy === "number") confidence = data.accuracy;
    if (confidence === 0 && typeof data.score === "number" && data.score > 0) {
      confidence = Math.min(data.score, 100);
    }

    let pathSmoothness = "数据暂不可用";
    if (typeof data.path_smoothness === "string")
      pathSmoothness = data.path_smoothness;
    else if (typeof data.smoothness === "string")
      pathSmoothness = data.smoothness;
    else if (typeof data.path_smoothness === "number")
      pathSmoothness = `${data.path_smoothness.toFixed(1)}%`;
    else if (typeof data.smoothness === "number")
      pathSmoothness = `${data.smoothness.toFixed(1)}%`;

    return {
      analysis_id: typeof data.analysis_id === "string" ? data.analysis_id : "",
      exercise_type: exType,
      exercise_type_zh: exZh,
      confidence,
      score: typeof data.score === "number" ? data.score : 0,
      stability:
        typeof data.stability === "string" ? data.stability : "数据暂不可用",
      offset: typeof data.offset === "string" ? data.offset : "数据暂不可用",
      avg_speed:
        typeof data.avg_speed === "string" ? data.avg_speed : "数据暂不可用",
      max_speed:
        typeof data.max_speed === "string" ? data.max_speed : "数据暂不可用",
      path_smoothness: pathSmoothness,
      sticking_point: safeSticking,
      rpe: typeof data.rpe === "number" ? data.rpe : 0,
      feedback: safeFeedback,
      thumbnailUrl:
        typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : "",
      videoUrl: typeof data.videoUrl === "string" ? data.videoUrl : "",
      trajectory: safeTrajectory,
    };
  };

  // ================== 分块上传相关函数 ==================
  const initUploadSession = async (fileName: string, fileSize: number) => {
    const res = await fetch(`${API_BASE_URL}/init-upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName,
        fileSize,
        totalChunks: Math.ceil(fileSize / (5 * 1024 * 1024)),
      }),
    });
    if (!res.ok) throw new Error(`初始化失败: ${res.status}`);
    return await res.json();
  };

  const getUploadedChunks = async (sessionId: string) => {
    const res = await fetch(`${API_BASE_URL}/get-uploaded-chunks/${sessionId}`);
    if (!res.ok) throw new Error(`获取分块状态失败: ${res.status}`);
    return await res.json();
  };

  const uploadChunk = async (
    sessionId: string,
    chunkIndex: number,
    chunkData: string,
  ) => {
    const res = await fetch(`${API_BASE_URL}/upload-chunk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, chunkIndex, chunkData }),
    });
    if (!res.ok) throw new Error(`分块 ${chunkIndex} 上传失败`);
    return await res.json();
  };

  const mergeAndAnalyze = async (sessionId: string) => {
    const res = await fetch(`${API_BASE_URL}/merge-and-analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) throw new Error(`合并分析失败: ${res.status}`);
    return await res.json();
  };

  const handleUploadVideoWithChunking = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/mp4", "video/quicktime"],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const file = result.assets[0];
      let fileSize = file.size || 0;
      if (fileSize === 0 && file.uri) {
        try {
          const info = await FileSystemLegacy.getInfoAsync(file.uri);
          fileSize = info.size ?? 0;
        } catch {
          // ignore
        }
      }
      if (fileSize > 100 * 1024 * 1024) {
        Alert.alert("视频太大", "请上传小于100MB的视频文件");
        return;
      }

      setUploading(true);
      setUploadProgress(0);
      setIsAnalyzingPhase(false);
      setShowUploadLockModal(true);
      setUploadStatus("初始化上传...");

      const todayStr = new Date()
        .toLocaleDateString("zh-CN")
        .replace(/\//g, "-");
      const newRecord: TrainingRecord = {
        id: Date.now().toString(),
        date: todayStr,
        duration: "0:00",
        image: null,
        isProcessing: true,
      };
      setRecords((prev) => [newRecord, ...prev]);

      const initResult = await initUploadSession(
        file.name || `video-${Date.now()}.mp4`,
        fileSize,
      );
      if (!initResult.success)
        throw new Error(initResult.error || "初始化上传失败");

      const { sessionId } = initResult;
      const CHUNK_SIZE = 5 * 1024 * 1024;
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

      let uploadedChunks: number[] = [];
      try {
        const cr = await getUploadedChunks(sessionId);
        if (cr.success) uploadedChunks = cr.uploadedChunks;
      } catch {
        uploadedChunks = [];
      }

      for (let ci = 0; ci < totalChunks; ci++) {
        if (uploadedChunks.includes(ci)) continue;
        setUploadStatus(`上传分块 ${ci + 1}/${totalChunks}...`);

        const start = ci * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileSize);
        const chunkBase64 = await FileSystemLegacy.readAsStringAsync(file.uri, {
          encoding: FileSystemLegacy.EncodingType.Base64,
          length: end - start,
          position: start,
        });

        let retries = 0;
        while (retries < 3) {
          try {
            await uploadChunk(sessionId, ci, chunkBase64);
            uploadedChunks.push(ci);
            break;
          } catch (e) {
            retries++;
            if (retries >= 3) throw e;
            await new Promise((r) => setTimeout(r, 1000 * retries));
          }
        }
        setUploadProgress(
          Math.round((uploadedChunks.length / totalChunks) * 100),
        );
      }

      setIsAnalyzingPhase(true);
      setUploadStatus("正在生成AI分析报告，请耐心等待...");

      const analysisResult = await mergeAndAnalyze(sessionId);
      if (!analysisResult.success)
        throw new Error(analysisResult.error || "分析失败");

      if (analysisResult.exercise_type === "Unknown") {
        setRecords((prev) =>
          prev.filter((r) => !(r.isProcessing && r.date === todayStr)),
        );
        Alert.alert(
          "动作识别失败",
          `未检测到标准动作。\n\n当前仅支持：${SUPPORTED_EXERCISES.join("、")}\n\n请确保：\n• 全身入镜\n• 光线充足\n• 侧面拍摄`,
          [{ text: "知道了" }],
        );
        return;
      }

      const thumbUri = analysisResult.thumbnailUrl
        ? `${API_BASE_URL}${analysisResult.thumbnailUrl}`
        : null;
      const fullAnalysis = validateAnalysisData(analysisResult);

      setRecords((prev) =>
        prev.map((r) =>
          r.id === newRecord.id
            ? {
                ...r,
                isProcessing: false,
                duration: "0:45",
                score: fullAnalysis.score,
                exercise: fullAnalysis.exercise_type_zh,
                image: thumbUri,
                analysisDetails: JSON.parse(JSON.stringify(fullAnalysis)),
              }
            : r,
        ),
      );

      showAnalysisDetails(fullAnalysis);
    } catch (error: any) {
      console.error("上传错误:", error);
      let msg = "视频上传或分析过程中出现错误，请重试";
      if (error.message?.includes("Network request failed"))
        msg = "无法连接到服务器，请检查网络";
      else if (error.message?.includes("初始化失败"))
        msg = "服务器连接失败，请确认后端运行在端口8000";
      Alert.alert("上传失败", msg);

      const todayStr = new Date()
        .toLocaleDateString("zh-CN")
        .replace(/\//g, "-");
      setRecords((prev) =>
        prev.filter((r) => !(r.isProcessing && r.date === todayStr)),
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadStatus("");
      setIsAnalyzingPhase(false);
      setShowUploadLockModal(false);
    }
  };

  const viewAnalysisDetails = (record: TrainingRecord) => {
    if (record.analysisDetails && record.analysisDetails.analysis_id) {
      showAnalysisDetails(validateAnalysisData(record.analysisDetails));
    } else if (record.isProcessing) {
      Alert.alert("提示", "视频正在分析中，请稍候...");
    } else {
      Alert.alert("提示", "该记录暂无有效的AI分析数据，请尝试重新上传");
    }
  };

  const getRPEText = (rpe: number): string => {
    if (rpe <= 3) return "非常轻松";
    if (rpe <= 5) return "适中";
    if (rpe <= 7) return "较困难";
    if (rpe <= 9) return "困难";
    return "极限";
  };
  React.useEffect(() => {
    let animation: RNAnimated.CompositeAnimation | null = null;
    if (isAnalyzingPhase && showUploadLockModal) {
      // ✅ 分析阶段：无限循环的从左到右滑动动画
      animation = RNAnimated.loop(
        RNAnimated.timing(analyzingProgressAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false, // width 动画不能用 native driver
        }),
      );
      animation.start();
    } else {
      analyzingProgressAnim.setValue(0);
    }
    return () => {
      animation?.stop();
    };
  }, [isAnalyzingPhase, showUploadLockModal]);

  // ================================================================
  // 上传进度弹窗 百分比+线性进度条
  // ================================================================
  const renderUploadLockModal = () => {
    if (!showUploadLockModal) return null;

    // 分析阶段显示脉冲动画效果的文字，上传阶段显示实时百分比
    const progressDisplay = isAnalyzingPhase ? "..." : `${uploadProgress}%`;
    const titleText = isAnalyzingPhase ? "🤖 AI分析中" : "📤 视频上传中";
    const descText = isAnalyzingPhase
      ? "分析过程通常需要10-30秒 \n请勿切换到其他App或锁屏\n否则可能导致上传中断"
      : "请勿切换到其他App或锁屏\n否则可能导致上传中断";

    return (
      <Modal visible transparent animationType="fade" statusBarTranslucent>
        <View style={styles.lockModalOverlay}>
          <View style={styles.lockModalContainer}>
            {isAnalyzingPhase ? (
              <Text style={styles.lockAnalyzingIcon}>⚙️</Text>
            ) : (
              <Text style={styles.lockProgressNumber}>{uploadProgress}%</Text>
            )}

            <Text style={styles.lockModalTitle}>{titleText}</Text>

            <View style={styles.lockProgressBarBg}>
              {isAnalyzingPhase ? (
                <RNAnimated.View
                  style={[
                    styles.lockProgressBarIndeterminate,
                    {
                      left: analyzingProgressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["-40%", "100%"],
                      }),
                    },
                  ]}
                />
              ) : (
                <View
                  style={[
                    styles.lockProgressBarFill,
                    { width: `${uploadProgress}%` },
                  ]}
                />
              )}
            </View>

            <Text style={styles.lockModalStatus}>{uploadStatus}</Text>
            <Text style={styles.lockModalDesc}>{descText}</Text>
          </View>
        </View>
      </Modal>
    );
  };

  // ================================================================
  // 分析详情 Modal
  // ================================================================
  const renderAnalysisModal = () => {
    if (!currentAnalysis) return null;
    const trajCount = currentAnalysis.trajectory.length;

    const trajStats = (() => {
      if (trajCount === 0) return null;
      const ys = currentAnalysis.trajectory.map((p) => p[1]);
      const xs = currentAnalysis.trajectory.map((p) => p[0]);
      return {
        yRange: Math.round(Math.max(...ys) - Math.min(...ys)),
        xRange: Math.round(Math.max(...xs) - Math.min(...xs)),
      };
    })();

    const samplePoints = (() => {
      if (trajCount === 0) return [];
      const step = Math.max(1, Math.floor(trajCount / 5));
      const points: { index: number; point: number[]; pct: number }[] = [];
      for (let i = 0; i < trajCount; i += step) {
        if (points.length >= 5) break;
        points.push({
          index: i,
          point: currentAnalysis.trajectory[i],
          pct: Math.round((i / Math.max(trajCount - 1, 1)) * 100),
        });
      }
      if (
        points.length > 0 &&
        points[points.length - 1].index !== trajCount - 1
      ) {
        points.push({
          index: trajCount - 1,
          point: currentAnalysis.trajectory[trajCount - 1],
          pct: 100,
        });
      }
      return points;
    })();

    const stabilityText = currentAnalysis.stability || "数据暂不可用";
    const offsetText = currentAnalysis.offset || "数据暂不可用";
    const smoothnessText = currentAnalysis.path_smoothness || "数据暂不可用";
    const avgSpeedText = currentAnalysis.avg_speed || "数据暂不可用";
    const maxSpeedText = currentAnalysis.max_speed || "数据暂不可用";
    const stickingDesc =
      currentAnalysis.sticking_point?.description || "未检测到明显卡点 ✅";
    const hasStickingPoint = currentAnalysis.sticking_point !== null;

    return (
      <Modal
        visible={showAnalysisModal}
        animationType="slide"
        transparent
        onRequestClose={hideAnalysisDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI分析详情</Text>
              <TouchableOpacity onPress={hideAnalysisDetails}>
                <Ionicons name="close" size={28} color="#6a4c93" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* 基础信息 */}
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>📊 基础信息</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="barbell-outline" size={20} color="#6a4c93" />
                  <Text style={styles.infoLabel}>动作类型:</Text>
                  <Text style={styles.infoValue}>
                    {currentAnalysis.exercise_type_zh}
                    <Text style={{ color: "#999", fontSize: 12 }}>
                      {" "}
                      ({currentAnalysis.exercise_type})
                    </Text>
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="speedometer-outline"
                    size={20}
                    color="#6a4c93"
                  />
                  <Text style={styles.infoLabel}>识别置信度:</Text>
                  <Text style={styles.infoValue}>
                    {currentAnalysis.confidence.toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <Text style={styles.infoLabel}>AI评分:</Text>
                  <Text style={[styles.infoValue, styles.scoreText]}>
                    {currentAnalysis.score} / 100
                  </Text>
                </View>
              </View>

              {/* 稳定性分析 */}
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>🎯 稳定性分析</Text>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>
                      杠铃轨迹分析 (水平稳定性)
                    </Text>
                    <Text style={styles.featureDesc}>{stabilityText}</Text>
                  </View>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>左右偏移检测</Text>
                    <Text style={styles.featureDesc}>{offsetText}</Text>
                  </View>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>路径平滑度</Text>
                    <Text style={styles.featureDesc}>{smoothnessText}</Text>
                  </View>
                </View>
              </View>

              {/* 速度分析 */}
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>⚡ 速度分析</Text>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>平均 / 最大速度</Text>
                    <Text style={styles.featureDesc}>
                      {"平均: "}
                      {avgSpeedText}
                      {"\n"}
                      {"最大: "}
                      {maxSpeedText}
                    </Text>
                  </View>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons
                    name={hasStickingPoint ? "warning" : "checkmark-circle"}
                    size={20}
                    color={hasStickingPoint ? "#FF5722" : "#4CAF50"}
                  />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>
                      卡点检测 (速度最低点)
                    </Text>
                    <Text style={styles.featureDesc}>{stickingDesc}</Text>
                  </View>
                </View>
              </View>

              {/* RPE */}
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>💪 训练强度</Text>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>
                      RPE推测 (基于稳定性)
                    </Text>
                    <Text style={styles.featureDesc}>
                      {"RPE "}
                      {currentAnalysis.rpe}
                      {"/10 — "}
                      {getRPEText(currentAnalysis.rpe)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* AI智能反馈 */}
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>🤖 AI智能反馈</Text>
                {currentAnalysis.feedback.map((item, idx) => (
                  <View key={`feedback-${idx}`} style={styles.feedbackItem}>
                    <View style={styles.feedbackBullet}>
                      <View style={styles.bulletDot} />
                    </View>
                    <Text style={[styles.featureDesc, styles.feedbackText]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>

              {/* 动作识别 */}
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>🔍 动作识别</Text>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>动作类型识别</Text>
                    <Text style={styles.featureDesc}>
                      {currentAnalysis.exercise_type_zh}
                      {"\n"}
                      {"采集点数: "}
                      {trajCount}
                      {" 个"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 轨迹可视化 */}
              {trajCount > 0 && trajStats !== null && (
                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>📈 杠铃运动轨迹</Text>
                  <View style={styles.trajSummaryRow}>
                    <Text style={styles.trajSummaryLabel}>采集点数</Text>
                    <Text style={styles.trajSummaryValue}>{trajCount} 个</Text>
                  </View>
                  <View style={styles.trajSummaryRow}>
                    <Text style={styles.trajSummaryLabel}>垂直运动范围</Text>
                    <Text style={styles.trajSummaryValue}>
                      {trajStats.yRange} px
                    </Text>
                  </View>
                  <View style={styles.trajSummaryRow}>
                    <Text style={styles.trajSummaryLabel}>水平偏移范围</Text>
                    <Text style={styles.trajSummaryValue}>
                      {trajStats.xRange} px
                    </Text>
                  </View>
                  <View style={styles.trajectoryContainer}>
                    <Text style={styles.trajectoryLabel}>
                      轨迹关键节点预览:
                    </Text>
                    {samplePoints.map((sp, idx) => (
                      <View key={`traj-${idx}`} style={styles.trajectoryPoint}>
                        <View style={styles.trajProgressRow}>
                          <View style={styles.trajProgressBarBg}>
                            <View
                              style={[
                                styles.trajProgressBarFill,
                                { width: `${sp.pct}%` },
                              ]}
                            />
                          </View>
                          <Text style={styles.trajProgressText}>{sp.pct}%</Text>
                        </View>
                        <Text style={styles.trajectoryText}>
                          {"位置 ("}
                          {sp.point[0].toFixed(0)}
                          {", "}
                          {sp.point[1].toFixed(0)}
                          {")"}
                        </Text>
                      </View>
                    ))}
                    {trajCount > 5 && (
                      <Text style={styles.trajectoryMore}>
                        ... 共 {trajCount} 个采样点，仅展示关键节点
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={hideAnalysisDetails}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // ================================================================
  // 主渲染
  // ================================================================
  const supportExercisesText = SUPPORTED_EXERCISES.join(" · ");

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* 顶部标题栏 */}
      <View style={styles.topBar}>
        <Text style={styles.title}>动作分析</Text>
      </View>

      {/* ✅ 重构：支持动作+拍摄要求提示横幅 */}
      <View style={styles.supportBanner}>
        <View style={styles.bannerRow}>
          <Ionicons name="information-circle" size={18} color="#6a4c93" />
          <Text style={styles.bannerTitle}>
            {"仅支持 "}
            <Text style={styles.supportHighlight}>卧推 · 深蹲 · 硬拉</Text>
          </Text>
        </View>
        <View style={styles.bannerDivider} />
        <View style={styles.bannerTipsRow}>
          <View style={styles.tipItem}>
            <Ionicons name="person-outline" size={14} color="#8e6ca9" />
            <Text style={styles.tipText}>全身入镜</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="sunny-outline" size={14} color="#8e6ca9" />
            <Text style={styles.tipText}>光线充足</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="camera-outline" size={14} color="#8e6ca9" />
            <Text style={styles.tipText}>侧面拍摄</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {records.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>暂无训练记录</Text>
            <Text style={styles.emptySubtext}>
              点击右下角按钮上传视频开始分析
            </Text>
            <View style={styles.emptySupportTag}>
              <Text style={styles.emptySupportText}>
                {"🏋️ 支持动作："}
                {supportExercisesText}
              </Text>
            </View>
          </View>
        ) : (
          records.map((item) => {
            const isDeleting = deletingId === item.id;
            const hasExercise = Boolean(item.exercise);
            const hasScore = item.score != null;
            const showPlaceholder = !hasExercise && !hasScore;

            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.itemCard,
                  isDeleting && { opacity: 0, transform: [{ scale: 0.8 }] },
                ]}
              >
                {/* 缩略图 */}
                <View style={styles.thumbnailWrapper}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.thumbnail}
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

                {/* ✅ 左侧信息区：固定三行高度，保证与右侧按钮对齐 */}
                <View style={styles.infoSection}>
                  {/* 第1行：日期 ← → 👁️ 查看 */}
                  <View style={styles.cardRow}>
                    <View style={styles.dateRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#333"
                      />
                      <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => viewAnalysisDetails(item)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="eye-outline" size={22} color="#6a4c93" />
                    </TouchableOpacity>
                  </View>

                  {/* 第2行：动作类型 */}
                  <View style={styles.cardRow}>
                    {hasExercise ? (
                      <View style={styles.metaRow}>
                        <Ionicons
                          name="barbell-outline"
                          size={16}
                          color="#333"
                        />
                        <Text style={styles.metaText}>{item.exercise}</Text>
                      </View>
                    ) : (
                      <View style={styles.metaRow}>
                        <Ionicons
                          name="barbell-outline"
                          size={16}
                          color="#ccc"
                        />
                        <Text style={[styles.metaText, { color: "#ccc" }]}>
                          待分析
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* 第3行：AI评分 ← → 🗑️ 删除 */}
                  <View style={styles.cardRow}>
                    {hasScore ? (
                      <View style={styles.metaRow}>
                        <Ionicons name="star-outline" size={16} color="#333" />
                        <Text style={styles.metaText}>
                          {"AI评分: "}
                          {item.score}
                          {"分"}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.metaRow}>
                        <Ionicons name="star-outline" size={16} color="#ccc" />
                        <Text style={[styles.metaText, { color: "#ccc" }]}>
                          --
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => showDeleteConfirmation(item.id)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color="#ff6b6b"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      {/* FAB 悬浮按钮 */}
      <TouchableOpacity
        style={[styles.fabButton, uploading && styles.fabButtonDisabled]}
        onPress={handleUploadVideoWithChunking}
        disabled={uploading}
        activeOpacity={0.8}
      >
        {uploading ? (
          <View style={styles.fabContent}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.fabText}>
              {uploadProgress > 0 ? `${uploadProgress}%` : "上传中"}
            </Text>
          </View>
        ) : (
          <View style={styles.fabContent}>
            <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
            <Text style={styles.fabText}>上传视频</Text>
          </View>
        )}
      </TouchableOpacity>

      {renderAnalysisModal()}
      {renderUploadLockModal()}
    </SafeAreaView>
  );
}

// ================================================================
// 样式表
// ================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
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

  // ✅ 重构：支持动作+拍摄要求横幅
  supportBanner: {
    backgroundColor: "#f3eef8",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0d4f0",
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 14,
    color: "#444",
    marginLeft: 8,
    fontWeight: "500",
  },
  supportHighlight: {
    fontWeight: "700",
    color: "#6a4c93",
  },
  bannerDivider: {
    height: 1,
    backgroundColor: "#e0d4f0",
    marginVertical: 8,
  },
  bannerTipsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tipText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  listContainer: { paddingBottom: 100 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: { fontSize: 18, color: "#666", marginBottom: 8, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: "#999" },
  emptySupportTag: {
    marginTop: 24,
    backgroundColor: "#f3eef8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emptySupportText: { fontSize: 13, color: "#6a4c93", fontWeight: "500" },

  // 卡片
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
  thumbnail: { width: "100%", height: "100%", resizeMode: "cover" },
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
  noThumbnailText: { fontSize: 12, color: "#999", marginTop: 4 },
  infoSection: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 28,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 85,
    paddingHorizontal: 12,
  },
  deleteButton: { padding: 4, borderRadius: 4 },

  lockAnalyzingIcon: {
    fontSize: 42,
    marginBottom: 8,
  },

  lockProgressBarIndeterminate: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "40%",
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },

  // FAB 悬浮按钮
  fabButton: {
    position: "absolute",
    right: 20,
    bottom: 24,
    backgroundColor: "#6a4c93",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#6a4c93",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  fabButtonDisabled: { backgroundColor: "#7a5a8f" },
  fabContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  fabText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: { fontSize: 20, fontWeight: "600", color: "#333" },
  modalContent: { paddingHorizontal: 20, paddingVertical: 16 },
  analysisSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6a4c93",
    marginBottom: 12,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoLabel: { fontSize: 14, color: "#666", marginLeft: 8, marginRight: 8 },
  infoValue: { fontSize: 14, color: "#333", flex: 1 },
  scoreText: { fontSize: 18, fontWeight: "bold", color: "#FFD700" },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  featureContent: { marginLeft: 12, flex: 1 },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  featureDesc: { fontSize: 13, color: "#666", lineHeight: 20 },
  feedbackText: { fontSize: 14, color: "#4CAF50", lineHeight: 22 },
  closeButton: {
    backgroundColor: "#6a4c93",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  feedbackItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  feedbackBullet: { width: 20, alignItems: "center", paddingTop: 6 },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },
  trajSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  trajSummaryLabel: { fontSize: 13, color: "#666" },
  trajSummaryValue: { fontSize: 13, fontWeight: "600", color: "#333" },
  trajProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  trajProgressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#e8e8e8",
    borderRadius: 4,
    marginRight: 8,
    overflow: "hidden",
  },
  trajProgressBarFill: {
    height: "100%",
    backgroundColor: "#6a4c93",
    borderRadius: 4,
  },
  trajProgressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6a4c93",
    width: 36,
    textAlign: "right",
  },
  trajectoryContainer: {
    marginTop: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
  },
  trajectoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6a4c93",
    marginBottom: 8,
  },
  trajectoryPoint: { marginBottom: 8 },
  trajectoryText: { fontSize: 12, color: "#555", fontFamily: "monospace" },
  trajectoryMore: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginTop: 4,
  },

  // ✅上传锁屏 Modal 样式（移除转圈，改为百分比数字+线性进度条）
  lockModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  lockModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "82%",
    maxWidth: 340,
  },
  lockProgressNumber: {
    fontSize: 48,
    fontWeight: "800",
    color: "#6a4c93",
    marginBottom: 4,
    fontVariant: ["tabular-nums"], // 等宽数字防止宽度跳动
  },
  lockModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  lockProgressBarBg: {
    width: "100%",
    height: 12,
    backgroundColor: "#e8e8e8",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 10,
  },
  lockProgressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  lockModalStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  lockModalDesc: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
});
