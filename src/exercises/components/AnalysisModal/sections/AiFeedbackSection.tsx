// app/(tabs)/exercises/components/AnalysisModal/sections/AiFeedbackSection.tsx
import { SEVERITY_CONFIG } from "@/src/exercises/contants/exercises";
import { AnalysisResult } from "@/src/exercises/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../styles";

interface AiFeedbackSectionProps {
  analysis: AnalysisResult;
  onViewEvidence?: (errorId: string) => void;
  onViewAngleCurve?: (jointKey: string) => void;
}

// P3: 错误类型 → 对应关节曲线的映射
// 注意：后端 angle_curves 只有 left/right_knee, left/right_elbow, left/right_hip, torso_from_vertical
const ERROR_JOINT_MAP: Record<string, RegExp> = {
  bench_incomplete_rom: /elbow/i,
  bench_incomplete_lockout: /elbow/i,
  bench_elbow_flare: /elbow/i, // 肘部外展用肘角曲线间接观察
  bench_bounce: /elbow/i,
  bench_butt_off_bench: /torso/i,
  bench_asymmetric_push: /elbow/i,
  bench_eccentric_speed: /elbow/i,
  bench_touch_point_drift: /elbow/i,
};

const safeString = (val: any): string => {
  if (val == null || val === "") return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    if (typeof val.message === "string") return val.message;
    if (typeof val.text === "string") return val.text;
    if (typeof val.content === "string") return val.content;
    if (typeof val.description === "string") return val.description;
    if (typeof val.name === "string") return val.name;
    try {
      return JSON.stringify(val);
    } catch {
      return "[复杂对象]";
    }
  }
  return String(val);
};

const safeStringArray = (arr: any): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map(safeString).filter((s) => s.length > 0);
};

export const AiFeedbackSection: React.FC<AiFeedbackSectionProps> = ({
  analysis,
  onViewEvidence,
  onViewAngleCurve,
}) => {
  const ai = analysis.ai_feedback;
  const summary = safeString(ai?.summary);
  const strengths = safeStringArray(ai?.strengths);
  const criticalIssues = safeStringArray(ai?.critical_issues);
  const detailedErrors = Array.isArray(ai?.detailed_errors)
    ? ai.detailed_errors
    : [];
  const improvementPlan = safeStringArray(ai?.improvement_plan);
  const fatigueWarning = safeString(ai?.fatigue_warning);
  const motivation = safeString(ai?.motivation);

  const legacyFeedback = safeStringArray(analysis.feedback);

  // 构建有证据帧的 error_id 集合
  const evidenceErrorIds = new Set<string>();
  (analysis.key_frames || []).forEach((kf) => {
    (kf.evidence_for || []).forEach((ev) => {
      if (ev.rule) evidenceErrorIds.add(ev.rule);
    });
  });

  // P3: 检查某错误是否有关节曲线可展示，返回匹配的 jointKey
  const getJointKeyForError = (errorId: string): string | null => {
    const pattern = ERROR_JOINT_MAP[errorId];
    if (!pattern) return null;
    const angleCurves = analysis.angle_curves || {};
    const match = Object.keys(angleCurves).find((key) => pattern.test(key));
    return match || null;
  };

  return (
    <View style={styles.analysisSection}>
      <Text style={styles.sectionTitle}>🤖 AI 智能反馈</Text>

      {ai ? (
        <View>
          {summary ? (
            <View style={styles.featureItem}>
              <Ionicons name="ribbon-outline" size={20} color="#6a4c93" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>整体评价</Text>
                <Text style={styles.featureDesc}>{summary}</Text>
              </View>
            </View>
          ) : null}

          {strengths.length > 0 && (
            <View style={styles.featureItem}>
              <Ionicons name="trophy-outline" size={20} color="#4CAF50" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>✅ 优势表现</Text>
                {strengths.map((s, i) => (
                  <Text key={`str-${i}`} style={styles.featureDesc}>
                    {"  "}
                    {s}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {criticalIssues.length > 0 && (
            <View style={styles.featureItem}>
              <Ionicons name="warning-outline" size={20} color="#F44336" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>⚠️ 关键问题</Text>
                {criticalIssues.map((s, i) => (
                  <Text
                    key={`crit-${i}`}
                    style={[styles.featureDesc, { color: "#D32F2F" }]}
                  >
                    {"  "}
                    {s}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {detailedErrors.length > 0 && (
            <View style={{ marginTop: 4 }}>
              <Text
                style={[
                  styles.featureTitle,
                  { marginBottom: 8, fontSize: 15, color: "#333" },
                ]}
              >
                📝 逐项错误解析
              </Text>
              {detailedErrors.map((err, idx) => {
                const cfg =
                  SEVERITY_CONFIG[err.severity] || SEVERITY_CONFIG.medium;
                const drills = safeStringArray(err.drills);
                const errorName = safeString(err.error_name || err.name);
                const explanation = safeString(err.explanation);
                const correction = safeString(err.correction);

                return (
                  <View
                    key={`de-${idx}`}
                    style={[
                      styles.errorCard,
                      { borderLeftColor: cfg.color, marginBottom: 8 },
                    ]}
                  >
                    <Text style={styles.errorName}>
                      {cfg.icon} {errorName || "未知错误"}
                    </Text>
                    {explanation ? (
                      <View style={styles.errorDetailRow}>
                        <Ionicons
                          name="search-outline"
                          size={14}
                          color="#666"
                        />
                        <Text style={styles.errorFeedbackText}>
                          {explanation}
                        </Text>
                      </View>
                    ) : null}
                    {correction ? (
                      <View style={styles.errorDetailRow}>
                        <Ionicons
                          name="bulb-outline"
                          size={14}
                          color="#4CAF50"
                        />
                        <Text style={styles.errorFeedbackText}>
                          纠正: {correction}
                        </Text>
                      </View>
                    ) : null}
                    {drills.length > 0 && (
                      <View style={styles.errorDrillsRow}>
                        <Ionicons
                          name="fitness-outline"
                          size={14}
                          color="#6a4c93"
                        />
                        <Text style={styles.errorDrillsText}>
                          推荐练习: {drills.join("、")}
                        </Text>
                      </View>
                    )}
                    {(onViewEvidence || onViewAngleCurve) && err.error_id && (
                      <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                        {onViewEvidence &&
                          evidenceErrorIds.has(err.error_id) && (
                            <TouchableOpacity
                              onPress={() => onViewEvidence(err.error_id!)}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 4,
                                paddingHorizontal: 10,
                                backgroundColor: "#6a4c93",
                                borderRadius: 4,
                                gap: 4,
                              }}
                            >
                              <Ionicons name="images-outline" size={12} color="#fff" />
                              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
                                查看证据
                              </Text>
                            </TouchableOpacity>
                          )}
                        {onViewAngleCurve &&
                          (() => {
                            const jointKey = getJointKeyForError(err.error_id!);
                            if (!jointKey) return null;
                            return (
                              <TouchableOpacity
                                onPress={() => onViewAngleCurve(jointKey)}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingVertical: 4,
                                  paddingHorizontal: 10,
                                  backgroundColor: "#fff",
                                  borderWidth: 1,
                                  borderColor: "#6a4c93",
                                  borderRadius: 4,
                                  gap: 4,
                                }}
                              >
                                <Ionicons name="trending-up-outline" size={12} color="#6a4c93" />
                                <Text style={{ color: "#6a4c93", fontSize: 11, fontWeight: "600" }}>
                                  角度变化
                                </Text>
                              </TouchableOpacity>
                            );
                          })()}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {improvementPlan.length > 0 && (
            <View style={styles.featureItem}>
              <Ionicons name="list-circle-outline" size={20} color="#1976D2" />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>📋 改进计划</Text>
                {improvementPlan.map((s, i) => (
                  <Text key={`plan-${i}`} style={styles.featureDesc}>
                    {i + 1}. {s}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {fatigueWarning ? (
            <View
              style={[
                styles.errorCard,
                {
                  borderLeftColor: "#FF9800",
                  backgroundColor: "#FFF3E0",
                  marginTop: 4,
                },
              ]}
            >
              <View style={styles.errorDetailRow}>
                <Ionicons name="alert-circle" size={18} color="#FF9800" />
                <Text
                  style={[
                    styles.errorFeedbackText,
                    { color: "#E65100", fontWeight: "bold" },
                  ]}
                >
                  {fatigueWarning}
                </Text>
              </View>
            </View>
          ) : null}

          {motivation ? (
            <View
              style={[
                styles.errorCard,
                {
                  borderLeftColor: "#4CAF50",
                  backgroundColor: "#E8F5E9",
                  marginTop: 4,
                },
              ]}
            >
              <View style={styles.errorDetailRow}>
                <Ionicons name="star" size={18} color="#4CAF50" />
                <Text
                  style={[
                    styles.errorFeedbackText,
                    { color: "#2E7D32", fontWeight: "bold" },
                  ]}
                >
                  {motivation}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        legacyFeedback.map((item, idx) => (
          <View key={`feedback-${idx}`} style={styles.feedbackItem}>
            <View style={styles.feedbackBullet}>
              <View style={styles.bulletDot} />
            </View>
            <Text style={[styles.featureDesc, styles.feedbackText]}>
              {item}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};
