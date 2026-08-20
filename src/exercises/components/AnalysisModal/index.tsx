// app/(tabs)/exercises/components/AnalysisModal/index.tsx
import { ANGLE_NAME_ZH } from "@/src/exercises/contants/exercises";
import { getFatigueColor } from "@/src/exercises/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../styles";
import { AnalysisResult } from "../../types";
import { AiFeedbackSection } from "./sections/AiFeedbackSection";

const SCREEN_WIDTH = Dimensions.get("window").width;

/** 安全的 toFixed，如果值不是有限数字则返回 "--" */
const safeFixed = (val: any, digits = 1): string => {
  const n =
    typeof val === "number"
      ? val
      : typeof val === "object" && val != null
        ? typeof val.value === "number"
          ? val.value
          : NaN
        : parseFloat(val);
  return Number.isFinite(n) ? n.toFixed(digits) : "--";
};

/** 安全字符串提取 */
const safeStr = (val: any, fallback = ""): string => {
  if (val == null || val === "") return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    if (typeof val.message === "string") return val.message;
    if (typeof val.text === "string") return val.text;
    if (typeof val.description === "string") return val.description;
    if (typeof val.name === "string") return val.name;
    try {
      return JSON.stringify(val);
    } catch {
      return fallback || "[数据]";
    }
  }
  return fallback;
};

interface AnalysisModalProps {
  visible: boolean;
  analysis: AnalysisResult | null;
  selectedRepIndex: number;
  setSelectedRepIndex: (index: number) => void;
  onClose: () => void;
}

/**
 * 分析详情弹窗组件
 * 包含：总览、错误分析、Rep 详情、关节曲线、骨骼帧、轨迹、质量、疲劳、AI反馈
 */
export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  visible,
  analysis,
  selectedRepIndex,
  setSelectedRepIndex,
  onClose,
}) => {
  if (!analysis) return null;

  const reps = analysis.reps_list || [];
  const angleCurves = analysis.angle_curves || {};

  // P1: 3点移动平均平滑（仅用于UI展示，不修改原始算法数据）
  const smoothArray = (arr: number[], window = 3): number[] => {
    if (arr.length < window) return arr;
    const half = Math.floor(window / 2);
    return arr.map((_, i) => {
      let sum = 0;
      let count = 0;
      for (
        let j = Math.max(0, i - half);
        j <= Math.min(arr.length - 1, i + half);
        j++
      ) {
        sum += arr[j];
        count++;
      }
      return sum / count;
    });
  };

  // P1: 关节优先级排序：肘 → 肩 → 肘外展 → 躯干 → 膝 → 髋 → 其他
  const JOINT_PRIORITY = [
    /elbow/i,
    /shoulder/i,
    /upper_arm/i,
    /torso/i,
    /knee/i,
    /hip/i,
  ];
  const sortedAngleEntries = Object.entries(angleCurves)
    .filter(([, values]) => {
      if (!Array.isArray(values)) return false;
      const validCount = values.filter(
        (v: any) => typeof v === "number" && Number.isFinite(v),
      ).length;
      return validCount >= 20; // 少于20个有效点的曲线不展示（如侧面拍摄被遮挡的对侧关节）
    })
    .sort(([a], [b]) => {
      const aIdx = JOINT_PRIORITY.findIndex((re) => re.test(a));
      const bIdx = JOINT_PRIORITY.findIndex((re) => re.test(b));
      if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
  // 前端筛选骨骼帧：按骨骼完整度排序，只展示最完整的6帧，再按时间顺序排列
  const rawSkeletonFrames = analysis.skeleton_frames || [];
  const skeletonFrames = [...rawSkeletonFrames]
    .sort((a: any, b: any) => (b.bones?.length || 0) - (a.bones?.length || 0))
    .slice(0, 6)
    .sort((a: any, b: any) => (a.pct || 0) - (b.pct || 0));
  const keyFrames = analysis.key_frames || [];

  // P2: 证据帧滚动 + 高亮
  const scrollViewRef = useRef<ScrollView>(null);
  const evidenceSectionRef = useRef<View>(null);
  const videoRef = useRef<Video>(null);
  const [highlightedError, setHighlightedError] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const handleViewEvidence = (errorId: string) => {
    setHighlightedError(errorId);

    // P0: 找到包含该错误的证据帧，seek 到对应时间点
    const targetFrame = keyFrames.find((kf: any) =>
      (kf.evidence_for || []).some((ev: any) => ev.rule === errorId)
    );
    if (targetFrame && analysis.fps) {
      const timeMs = (targetFrame.frame_idx / analysis.fps) * 1000;
      videoRef.current?.setPositionAsync(timeMs).catch(() => {});
    }

    // 滚动到证据帧区域
    requestAnimationFrame(() => {
      evidenceSectionRef.current?.measureLayout(
        scrollViewRef.current as any,
        (_x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
        },
        () => {},
      );
    });
    // 3 秒后清除高亮
    setTimeout(() => setHighlightedError(null), 3000);
  };

  // P3: 关节曲线滚动 + 高亮（用 onLayout 预记录位置，比 measureLayout 更可靠）
  const curveSectionRef = useRef<View>(null);
  const [sectionLayoutY, setSectionLayoutY] = useState(0);
  const [cardLayoutYs, setCardLayoutYs] = useState<Record<string, number>>({});
  const [highlightedJoint, setHighlightedJoint] = useState<string | null>(null);

  const handleViewAngleCurve = (jointKey: string) => {
    setHighlightedJoint(jointKey);
    requestAnimationFrame(() => {
      const cardY = cardLayoutYs[jointKey];
      const targetY = cardY != null
        ? sectionLayoutY + cardY - 20
        : sectionLayoutY - 20;
      scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
    });
    setTimeout(() => setHighlightedJoint(null), 3000);
  };

  const currentRep = reps[selectedRepIndex] || null;

  const fatigue = analysis.fatigue || null;
  const fatigueLevel = safeStr(fatigue?.fatigue_level, "unknown");
  const fatigueVelocityLoss = safeFixed(fatigue?.velocity_loss_pct);
  const fatigueStatus = safeStr(fatigue?.status, "");
  const fatigueInsufficient = fatigueStatus === "insufficient_data";
  const fatigueRir =
    fatigue?.estimated_rir != null && fatigue.estimated_rir >= 0
      ? String(fatigue.estimated_rir)
      : "--";
  const fatigueCurve = Array.isArray(fatigue?.velocity_curve)
    ? fatigue!.velocity_curve.filter(
        (v: any) => typeof v === "number" && Number.isFinite(v),
      )
    : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>分析详情</Text>
              <Text style={styles.modalSubtitle}>
                {safeStr(analysis.exercise, "未知动作")} ·{" "}
                {safeFixed(analysis.reps, 0)} 次
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={32} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView ref={scrollViewRef} style={styles.modalContent}>
            {/* ============ Section 1: 总览 ============ */}
            <View style={styles.analysisSection}>
              <Text style={styles.sectionTitle}>📊 总览</Text>
              <View style={styles.overviewRow}>
                <View style={styles.scoreRing}>
                  <Text
                    style={[
                      styles.scoreRingText,
                      {
                        color:
                          (analysis.score ?? 0) >= 80
                            ? "#4CAF50"
                            : (analysis.score ?? 0) >= 60
                              ? "#FF9800"
                              : "#F44336",
                      },
                    ]}
                  >
                    {safeFixed(analysis.score, 1)}
                  </Text>
                  <Text style={styles.scoreRingLabel}>评分</Text>
                </View>
                <View style={styles.overviewStats}>
                  <View style={styles.overviewStatItem}>
                    <Text style={styles.overviewStatValue}>
                      {safeFixed(analysis.reps, 0)}
                    </Text>
                    <Text style={styles.overviewStatLabel}>次数</Text>
                  </View>
                  <View style={styles.overviewStatItem}>
                    <Text style={styles.overviewStatValue}>
                      {safeFixed(analysis.avg_rep_duration)}s
                    </Text>
                    <Text style={styles.overviewStatLabel}>均时</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ============ P0: 视频播放器 ============ */}
            {analysis.video_url && (
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>🎬 动作回放</Text>
                <View
                  style={{
                    width: "100%",
                    height: 220,
                    borderRadius: 8,
                    backgroundColor: "#000",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Video
                    ref={videoRef}
                    source={{ uri: analysis.video_url }}
                    style={{ width: "100%", height: "100%" }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping={false}
                    onPlaybackStatusUpdate={(status) => {
                      if ("isPlaying" in status) {
                        setVideoPlaying(status.isPlaying);
                      }
                    }}
                  />
                  {!videoPlaying && (
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.35)",
                      }}
                      onPress={() => {
                        videoRef.current?.playAsync().catch(() => {});
                      }}
                      activeOpacity={0.7}
                    >
                      <View
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 32,
                          backgroundColor: "rgba(255,255,255,0.9)",
                          justifyContent: "center",
                          alignItems: "center",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 5,
                        }}
                      >
                        <Ionicons
                          name="play"
                          size={32}
                          color="#6a4c93"
                          style={{ marginLeft: 4 }}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* ============ Section 7: AI 反馈 (V8.0 升级) ============ */}
            <AiFeedbackSection
              analysis={analysis}
              onViewEvidence={handleViewEvidence}
              onViewAngleCurve={handleViewAngleCurve}
            />
            {/* ============ Section 4: 关节角度曲线 ============ */}
            {sortedAngleEntries.length > 0 && (
              <View
                ref={curveSectionRef}
                style={styles.analysisSection}
                collapsable={false}
                onLayout={(e) => setSectionLayoutY(e.nativeEvent.layout.y)}
              >
                <Text style={styles.sectionTitle}>📈 关节角度曲线</Text>
                <Text style={styles.curveSubtitle}>
                  横轴: 动作周期 0%→100% | 纵轴: 角度(°)
                </Text>

                {sortedAngleEntries.map(([key, values]) => {
                  const rawValues = (
                    Array.isArray(values) ? values : []
                  ).filter(
                    (v: any) => typeof v === "number" && Number.isFinite(v),
                  );
                  if (rawValues.length === 0) return null;

                  // 仅UI展示用3点平滑，原始数据 rawValues 不动
                  const safeValues = smoothArray(rawValues, 3);
                  const minVal = Math.min(...rawValues);
                  const maxVal = Math.max(...rawValues);
                  const range = maxVal - minVal || 1;
                  const chartH = 80;
                  const chartW = SCREEN_WIDTH - 80;

                  return (
                    <View
                      key={`curve-${key}`}
                      onLayout={(e) => {
                        const y = e.nativeEvent.layout.y;
                        setCardLayoutYs((prev) =>
                          prev[key] === y ? prev : { ...prev, [key]: y },
                        );
                      }}
                      style={[
                        styles.curveCard,
                        highlightedJoint === key && {
                          borderWidth: 2,
                          borderColor: "#6a4c93",
                          backgroundColor: "#f3e5f5",
                        },
                      ]}
                    >
                      <View style={styles.curveHeader}>
                        <Text style={styles.curveName}>
                          {ANGLE_NAME_ZH[key] || key}
                        </Text>
                        <Text style={styles.curveRange}>
                          {safeFixed(minVal, 0)}° ~ {safeFixed(maxVal, 0)}°
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.curveChart,
                          { height: chartH, width: chartW },
                        ]}
                      >
                        <View
                          style={[
                            styles.curveGridLine,
                            { bottom: chartH * 0.25 },
                          ]}
                        />
                        <View
                          style={[
                            styles.curveGridLine,
                            { bottom: chartH * 0.5 },
                          ]}
                        />
                        <View
                          style={[
                            styles.curveGridLine,
                            { bottom: chartH * 0.75 },
                          ]}
                        />

                        {safeValues.map((val, vi) => {
                          const x =
                            (vi / Math.max(safeValues.length - 1, 1)) * chartW;
                          const y = chartH - ((val - minVal) / range) * chartH;
                          const isMin = vi === rawValues.indexOf(minVal);
                          const isMax = vi === rawValues.indexOf(maxVal);
                          return (
                            <View
                              key={`pt-${vi}`}
                              style={{
                                position: "absolute",
                                left: x - (isMin || isMax ? 2.5 : 1),
                                bottom: y - (isMin || isMax ? 2.5 : 1),
                                width: isMin || isMax ? 5 : 2,
                                height: isMin || isMax ? 5 : 2,
                                borderRadius: isMin || isMax ? 2.5 : 1,
                                backgroundColor: isMin
                                  ? "#F44336"
                                  : isMax
                                    ? "#4CAF50"
                                    : "#6a4c93",
                              }}
                            />
                          );
                        })}
                      </View>
                      <View style={styles.curveAxisLabels}>
                        <Text style={styles.curveAxisLabel}>0%</Text>
                        <Text style={styles.curveAxisLabel}>50%</Text>
                        <Text style={styles.curveAxisLabel}>100%</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* ============ Section 5: AI 分析证据 ============ */}
            {keyFrames.length > 0 && (
              <View ref={evidenceSectionRef} style={styles.analysisSection}
                collapsable={false}
              >
                <Text style={styles.sectionTitle}>🔍 AI 分析证据</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.skeletonFramesRow}>
                    {keyFrames.map((kf: any, idx: number) => {
                      const imgW = 150;
                      const imgH = Math.round(
                        (imgW * kf.frame_height) / kf.frame_width
                      );
                      const scaleX = imgW / kf.frame_width;
                      const scaleY = imgH / kf.frame_height;

                      const boneColorMap: Record<string, string> = {
                        torso_top: "#66BB6A", torso_bottom: "#66BB6A",
                        torso_left: "#66BB6A", torso_right: "#66BB6A",
                        left_upper_arm: "#29B6F6", left_forearm: "#29B6F6",
                        right_upper_arm: "#EF5350", right_forearm: "#EF5350",
                        left_thigh: "#42A5F5", left_shin: "#42A5F5",
                        right_thigh: "#EC407A", right_shin: "#EC407A",
                      };

                      const eventLabel =
                        kf.type === "bottom" ? "最低点" : "锁定点";
                      const eventIcon = kf.type === "bottom" ? "⬇" : "⬆";

                      // 按事件类型定义角度优先级：lockout 优先肘角（判断伸直），bottom 优先肘角+外展
                      const anglePriority =
                        kf.type === "lockout"
                          ? [
                              "elbow_angle_avg", "left_elbow", "right_elbow",
                              "left_knee", "right_knee",
                              "torso_from_vertical",
                            ]
                          : [
                              "elbow_angle_avg", "left_elbow", "right_elbow",
                              "left_upper_arm_torso", "right_upper_arm_torso",
                              "torso_from_vertical",
                              "left_knee", "right_knee",
                              "left_hip_hinge", "right_hip_hinge",
                            ];
                      const metricKeys = Object.keys(kf.metrics || {});
                      const keyMetricKeys = metricKeys
                        .filter((k) => anglePriority.includes(k))
                        .sort(
                          (a, b) =>
                            anglePriority.indexOf(a) - anglePriority.indexOf(b)
                        )
                        .slice(0, 2);

                      const lowQualitySide =
                        kf.left_quality < 0.5 && kf.right_quality < 0.5
                          ? "both"
                          : kf.left_quality < 0.5
                          ? "left"
                          : kf.right_quality < 0.5
                          ? "right"
                          : null;

                      // 检查该卡片是否是当前高亮错误的证据
                      const isHighlighted =
                        highlightedError != null &&
                        (kf.evidence_for || []).some(
                          (ev: any) => ev.rule === highlightedError
                        );

                      return (
                        <View
                          key={`kf-${idx}`}
                          style={[
                            styles.skeletonFrameCard,
                            isHighlighted && {
                              borderWidth: 2,
                              borderColor: "#6a4c93",
                              backgroundColor: "#f3e5f5",
                              shadowColor: "#6a4c93",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.3,
                              shadowRadius: 4,
                              elevation: 4,
                            },
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 4,
                            }}
                          >
                            <Text style={[styles.skeletonFramePct, { fontSize: 12 }]}>
                              {eventIcon} {eventLabel}
                            </Text>
                            <Text style={{ fontSize: 9, color: "#999" }}>
                              Rep {kf.rep_index}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: imgW,
                              height: imgH,
                              borderRadius: 8,
                              overflow: "hidden",
                              backgroundColor: "#1a1a2e",
                              position: "relative",
                            }}
                          >
                            <Image
                              source={{ uri: kf.image_url }}
                              style={{
                                width: imgW,
                                height: imgH,
                                position: "absolute",
                                top: 0,
                                left: 0,
                              }}
                              resizeMode="cover"
                            />
                            <View
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: imgW,
                                height: imgH,
                                backgroundColor: "rgba(0,0,0,0.12)",
                              }}
                            />

                            {kf.bones.map((bone: any, bi: number) => {
                              const sx = bone.start[0] * scaleX;
                              const sy = bone.start[1] * scaleY;
                              const ex = bone.end[0] * scaleX;
                              const ey = bone.end[1] * scaleY;
                              const dx = ex - sx;
                              const dy = ey - sy;
                              const len = Math.max(
                                Math.sqrt(dx * dx + dy * dy),
                                1
                              );
                              const color =
                                boneColorMap[bone.name] || "#29B6F6";
                              const isLeft = bone.name?.startsWith("left_");
                              const isRight = bone.name?.startsWith("right_");
                              const dimmed =
                                (lowQualitySide === "left" && isLeft) ||
                                (lowQualitySide === "right" && isRight) ||
                                lowQualitySide === "both";
                              return (
                                <View
                                  key={`bone-${bi}`}
                                  style={{
                                    position: "absolute",
                                    left: sx,
                                    top: sy,
                                    width: len,
                                    height: 3,
                                    backgroundColor: color,
                                    borderRadius: 1.5,
                                    opacity: dimmed ? 0.2 : 0.9,
                                    transform: [
                                      { rotate: `${Math.atan2(dy, dx)}rad` },
                                    ],
                                  }}
                                />
                              );
                            })}

                            {kf.landmarks.map((lm: any, li: number) => {
                              const x = lm.position[0] * scaleX;
                              const y = lm.position[1] * scaleY;
                              const isLeft = lm.name?.startsWith("left_");
                              const isRight = lm.name?.startsWith("right_");
                              const dimmed =
                                (lowQualitySide === "left" && isLeft) ||
                                (lowQualitySide === "right" && isRight) ||
                                lowQualitySide === "both";
                              return (
                                <View
                                  key={`lm-${li}`}
                                  style={{
                                    position: "absolute",
                                    left: x - 3,
                                    top: y - 3,
                                    width: 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: "#FFD54F",
                                    borderWidth: 1,
                                    borderColor: "rgba(0,0,0,0.5)",
                                    opacity: dimmed ? 0.2 : 1,
                                  }}
                                />
                              );
                            })}
                          </View>

                          {keyMetricKeys.map((mk: string, mi: number) => (
                            <Text key={`metric-${mi}`} style={styles.skeletonAngleText}>
                              {ANGLE_NAME_ZH[mk] || mk}: {safeFixed(kf.metrics[mk])}°
                            </Text>
                          ))}

                          {kf.evidence_for && kf.evidence_for.length > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 3,
                                marginTop: 3,
                                width: 150,
                                justifyContent: "center",
                              }}
                            >
                              {kf.evidence_for
                                .slice(0, 2)
                                .map((ev: any, ei: number) => {
                                  const sevColor =
                                    ev.severity === "severe"
                                      ? "#EF5350"
                                      : ev.severity === "moderate"
                                      ? "#FF9800"
                                      : ev.severity === "mild"
                                      ? "#FFC107"
                                      : "#999";
                                  return (
                                    <View
                                      key={`ev-${ei}`}
                                      style={{
                                        backgroundColor: `${sevColor}22`,
                                        paddingHorizontal: 4,
                                        paddingVertical: 1,
                                        borderRadius: 3,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 8,
                                          color: sevColor,
                                          fontWeight: "600",
                                        }}
                                      >
                                        {ev.name}
                                      </Text>
                                    </View>
                                  );
                                })}
                            </View>
                          )}

                          {lowQualitySide && (
                            <Text style={{ fontSize: 8, color: "#FF9800", marginTop: 2 }}>
                              ⚠️ {lowQualitySide === "both"
                                ? "关键点缺失较多"
                                : "部分关键点缺失"}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* ============ Section 6: 轨迹与稳定性 ============ */}
            <View style={styles.analysisSection}>
              <Text style={styles.sectionTitle}>🎯 轨迹与稳定性</Text>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>水平稳定性</Text>
                  <Text style={styles.featureDesc}>
                    {safeStr(analysis.stability, "暂无数据")}
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>左右偏移</Text>
                  <Text style={styles.featureDesc}>
                    {safeStr(analysis.offset, "暂无数据")}
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>路径平滑度</Text>
                  <Text style={styles.featureDesc}>
                    {safeStr(analysis.path_smoothness, "暂无数据")}
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Ionicons
                  name="speedometer-outline"
                  size={20}
                  color="#6a4c93"
                />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>速度</Text>
                  <Text style={styles.featureDesc}>
                    平均: {safeStr(analysis.avg_speed, "--")}
                    {"\n"}最大: {safeStr(analysis.max_speed, "--")}
                  </Text>
                </View>
              </View>
              {analysis.sticking_point && (
                <View style={styles.featureItem}>
                  <Ionicons name="warning" size={20} color="#FF5722" />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>卡点检测</Text>
                    <Text style={styles.featureDesc}>
                      {safeStr(analysis.sticking_point.description, "暂无")}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* ============ Section 6.5: 质量细分 ============ */}
            {analysis.quality_breakdown && (
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>📋 质量细分</Text>
                {[
                  {
                    label: "杠铃轨迹",
                    value: analysis.quality_breakdown.bar_path,
                  },
                  {
                    label: "关节控制",
                    value: analysis.quality_breakdown.joint_control,
                  },
                  {
                    label: "节奏",
                    value: analysis.quality_breakdown.tempo,
                  },
                  {
                    label: "安全性",
                    value: analysis.quality_breakdown.safety,
                  },
                ].map((item, idx) => {
                  const safeVal =
                    typeof item.value === "number" &&
                    Number.isFinite(item.value)
                      ? item.value
                      : 0;
                  return (
                    <View key={`qb-${idx}`} style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={
                          safeVal >= 80
                            ? "#4CAF50"
                            : safeVal >= 60
                              ? "#FF9800"
                              : "#F44336"
                        }
                      />
                      <View style={styles.featureContent}>
                        <Text style={styles.featureTitle}>{item.label}</Text>
                        <Text style={styles.featureDesc}>
                          {safeFixed(safeVal)} / 100
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* ============ Section 6.6: 疲劳分析 ============ */}
            {fatigue && (
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>💪 疲劳分析</Text>
                <View style={styles.fatigueCard}>
                  {fatigueInsufficient ? (
                    <View style={{ paddingVertical: 12, alignItems: "center" }}>
                      <Ionicons name="information-circle-outline" size={20} color="#999" />
                      <Text style={{ color: "#999", fontSize: 13, marginTop: 6, textAlign: "center" }}>
                        数据不足，疲劳分析需至少 3 次有效动作
                      </Text>
                    </View>
                  ) : (
                    <>
                      <View style={styles.fatigueRow}>
                        <Text style={styles.fatigueLabel}>速度损失</Text>
                        <Text
                          style={[
                            styles.fatigueValue,
                            { color: getFatigueColor(fatigueLevel) },
                          ]}
                        >
                          {fatigueVelocityLoss}%
                        </Text>
                      </View>
                      <View style={styles.fatigueRow}>
                        <Text style={styles.fatigueLabel}>预估 RIR</Text>
                        <Text style={styles.fatigueValue}>{fatigueRir}</Text>
                      </View>
                      <View style={styles.fatigueRow}>
                        <Text style={styles.fatigueLabel}>疲劳等级</Text>
                        <Text
                          style={[
                            styles.fatigueValue,
                            { color: getFatigueColor(fatigueLevel) },
                          ]}
                        >
                          {fatigueLevel}
                        </Text>
                      </View>
                    </>
                  )}
                  {fatigueCurve.length > 0 && (
                    <View style={styles.fatigueRow}>
                      <Text style={styles.fatigueLabel}>速度曲线</Text>
                      <Text style={styles.fatigueValueSmall}>
                        均
                        {safeFixed(
                          fatigueCurve.reduce((a, b) => a + b, 0) /
                            fatigueCurve.length,
                          1,
                        )}{" "}
                        / 峰{safeFixed(Math.max(...fatigueCurve), 1)} / 谷
                        {safeFixed(Math.min(...fatigueCurve), 1)} °/s
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          {/* 关闭按钮 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
