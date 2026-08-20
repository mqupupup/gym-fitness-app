// app/(tabs)/exercises/index.tsx
import { AnalysisModal } from "@/src/exercises/components/AnalysisModal";
import { useExerciseAnalysis } from "@/src/exercises/hooks/useExerciseAnalysis";
import { styles } from "@/src/exercises/styles";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SUPPORTED_EXERCISES } from "../../../src/exercises/contants/exercises";

/**
 * 动作分析主页面
 * 负责布局与组合，所有业务逻辑由 useExerciseAnalysis Hook 管理
 */
export default function ExercisesScreen() {
  const {
    records,
    uploading,
    uploadProgress,
    deletingId,
    showAnalysisModal,
    currentAnalysis,
    selectedRepIndex,
    setSelectedRepIndex,
    showUploadLockModal,
    uploadLockStatus,
    handleUploadVideoWithChunking,
    viewAnalysisDetails,
    hideAnalysisDetails,
    showDeleteConfirmation,
  } = useExerciseAnalysis();

  const insets = useSafeAreaInsets();
  const supportExercisesText = SUPPORTED_EXERCISES.join(" · ");

  // 分析中不确定进度条的滑动动画（用原生驱动，避免JS线程阻塞导致卡死）
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progressAnim]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* ==================== 顶部栏 ==================== */}
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <Text style={styles.title}>动作分析</Text>
      </View>

      {/* ==================== 支持提示 Banner ==================== */}
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
          <View style={styles.tipItem}>
            <Ionicons name="person" size={14} color="#8e6ca9" />
            <Text style={styles.tipText}>单人出镜</Text>
          </View>
        </View>
      </View>

      {/* ==================== 记录列表 ==================== */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {records.length === 0 ? (
          /* 空状态 */
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>暂无训练记录</Text>
            <Text style={styles.emptySubtext}>
              点击右下角按钮上传视频开始分析
            </Text>
            <View style={styles.emptySupportTag}>
              <Text style={styles.emptySupportText}>
                🏋️ 支持动作：{supportExercisesText}
              </Text>
            </View>
          </View>
        ) : (
          /* 记录卡片列表 */
          records.map((item) => {
            const isDeleting = deletingId === item.id;
            const hasExercise = Boolean(item.exercise);
            const hasScore = item.score != null;

            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.itemCard,
                  isDeleting && {
                    opacity: 0,
                    transform: [{ scale: 0.8 }],
                  },
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

                {/* 信息区 */}
                <View style={styles.infoSection}>
                  {/* 第一行：日期 + 查看按钮 */}
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
                      hitSlop={{
                        top: 8,
                        bottom: 8,
                        left: 8,
                        right: 8,
                      }}
                    >
                      <Ionicons name="eye-outline" size={22} color="#6a4c93" />
                    </TouchableOpacity>
                  </View>

                  {/* 第二行：动作名称 */}
                  <View style={styles.cardRow}>
                    {hasExercise ? (
                      <View style={styles.metaRow}>
                        <Ionicons
                          name="barbell-outline"
                          size={16}
                          color="#333"
                        />
                        <Text style={styles.metaText}>
                          {item.exercise}
                          {item.repsCount != null ? ` × ${item.repsCount}` : ""}
                        </Text>
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

                  {/* 第三行：评分 + 删除按钮 */}
                  <View style={styles.cardRow}>
                    {hasScore ? (
                      <View style={styles.metaRow}>
                        <Ionicons name="star-outline" size={16} color="#333" />
                        <Text style={styles.metaText}>
                          AI评分: {item.score}分
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
                      hitSlop={{
                        top: 8,
                        bottom: 8,
                        left: 8,
                        right: 8,
                      }}
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

      {/* ==================== 上传浮动按钮 ==================== */}
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

      {/* ==================== 分析详情弹窗 ==================== */}
      <AnalysisModal
        visible={showAnalysisModal}
        analysis={currentAnalysis}
        selectedRepIndex={selectedRepIndex}
        setSelectedRepIndex={setSelectedRepIndex}
        onClose={hideAnalysisDetails}
      />

      {/* ==================== 上传锁定弹窗 ==================== */}
      <Modal
        visible={showUploadLockModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.lockModalOverlay}>
          <View style={styles.lockModalContainer}>
            {uploadProgress > 0 && uploadProgress < 100 ? (
              <Text style={styles.lockProgressNumber}>{uploadProgress}%</Text>
            ) : (
              <Text style={styles.lockAnalyzingIcon}>🔬</Text>
            )}
            <Text style={styles.lockModalTitle}>
              {uploadProgress < 100 ? "上传视频" : "AI 分析中"}
            </Text>
            <View
              style={styles.lockProgressBarBg}
              onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                setProgressBarWidth((prev) => (prev === w ? prev : w));
              }}
            >
              {uploadProgress < 100 ? (
                <View
                  style={[
                    styles.lockProgressBarFill,
                    { width: `${uploadProgress}%` },
                  ]}
                />
              ) : (
                progressBarWidth > 0 && (
                  <Animated.View
                    style={[
                      styles.lockProgressBarIndeterminate,
                      {
                        transform: [
                          {
                            translateX: progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [
                                -progressBarWidth * 0.4,
                                progressBarWidth,
                              ],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                )
              )}
            </View>
            <Text style={styles.lockModalStatus}>
              {uploadProgress < 100 ? uploadLockStatus : "正在分析动作细节..."}
            </Text>
            <Text style={styles.lockModalDesc}>
              {uploadProgress < 100
                ? "正在上传视频到服务器..."
                : "AI 正在分析你的动作，请勿切换应用，预计需要 30-60 秒..."}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
