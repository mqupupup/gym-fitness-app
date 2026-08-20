// app/(tabs)/exercises/hooks/useExerciseAnalysis.ts
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { EXERCISE_NAME_ZH } from "../contants/exercises";
import { AnalysisResult, ExerciseRecord } from "../types";
import {
  API_BASE_URL,
  getAnalysisResult,
  uploadVideoChunked as uploadVideoChunkedApi,
} from "../utils/api";
import { generateUniqueId, getCurrentDateString } from "../utils/helpers";

/**
 * 分数提取器 —— 兼容后端所有可能的返回格式
 */
const extractScore = (val: any): number => {
  if (val == null) return 0;

  if (typeof val === "number") return Number.isFinite(val) ? val : 0;

  if (typeof val === "string") {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : 0;
  }

  if (typeof val === "object" && val !== null) {
    for (const key of [
      "score",
      "value",
      "rating",
      "points",
      "pct",
      "percentage",
    ]) {
      if (typeof val[key] === "number" && Number.isFinite(val[key])) {
        return val[key];
      }
      if (typeof val[key] === "string") {
        const n = parseFloat(val[key]);
        if (Number.isFinite(n)) return n;
      }
    }

    for (const wrapper of ["data", "result", "detail", "metrics"]) {
      if (val[wrapper] && typeof val[wrapper] === "object") {
        const inner = extractScore(val[wrapper]);
        if (inner > 0) return inner;
      }
    }
  }

  return 0;
};

const extractFromBreakdown = (
  breakdown: Record<string, any>,
  candidateKeys: string[],
): number => {
  for (const key of candidateKeys) {
    if (key in breakdown && breakdown[key] != null) {
      const score = extractScore(breakdown[key]);
      if (score > 0) return score;
    }
  }
  return 0;
};

const safeNumber = (val: any, fallback = 0): number => {
  if (val == null) return fallback;
  if (typeof val === "number") return Number.isFinite(val) ? val : fallback;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : fallback;
  }
  if (typeof val === "object") {
    if (typeof val.value === "number" && Number.isFinite(val.value))
      return val.value;
    if (typeof val.score === "number" && Number.isFinite(val.score))
      return val.score;
  }
  return fallback;
};

const safeString = (val: any, fallback = ""): string => {
  if (val == null) return fallback;
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

export const useExerciseAnalysis = () => {
  const [records, setRecords] = useState<ExerciseRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(
    null,
  );
  const [selectedRepIndex, setSelectedRepIndex] = useState(0);
  const [showUploadLockModal, setShowUploadLockModal] = useState(false);
  const [uploadLockStatus, setUploadLockStatus] = useState("");

  const handleUploadVideoWithChunking = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("权限不足", "需要访问相册才能上传视频");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        quality: 1,
        allowsEditing: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const fileUri = asset.uri;
      const fileName = `video_${Date.now()}.mp4`;

      const tempId = generateUniqueId();
      const newRecord: ExerciseRecord = {
        id: tempId,
        date: getCurrentDateString(),
        duration: asset.duration
          ? `${Math.floor(asset.duration / 1000)}s`
          : "0s",
        isProcessing: true,
      };

      setRecords((prev) => [newRecord, ...prev]);
      setUploading(true);
      setUploadProgress(0);
      setShowUploadLockModal(true);
      setUploadLockStatus("上传中...");

      const uploadResult = await uploadVideoChunkedApi(
        fileUri,
        fileName,
        (progress) => {
          setUploadProgress(progress);
          setUploadLockStatus(`上传中... ${progress}%`);
        },
      );

      let analysisData: any;

      if (
        uploadResult.success &&
        (uploadResult.exercise_type || uploadResult.rep_count !== undefined)
      ) {
        setUploadLockStatus("分析完成！");
        setUploadProgress(100);
        analysisData = uploadResult;
      } else {
        const taskId = uploadResult.task_id || uploadResult.analysis_id;
        if (!taskId) {
          throw new Error("上传成功但未返回分析 ID");
        }

        setUploadLockStatus("AI 分析中...");
        setUploadProgress(100);
        const pollResult = await getAnalysisResult(taskId);

        if (pollResult && pollResult.data) {
          analysisData = pollResult.data;
        } else if (pollResult) {
          analysisData = pollResult;
        } else {
          throw new Error("分析结果格式错误");
        }
      }

      // 1. 动作名称
      const exerciseName =
        analysisData.exercise_type_zh ||
        EXERCISE_NAME_ZH[analysisData.exercise_type] ||
        analysisData.exercise_type ||
        "未知动作";

      // 2. Reps 详情列表
      const repsDetail: any[] = analysisData.reps_detail || [];

      // 3. 平均 rep 时长
      const durations = repsDetail.map((r: any) =>
        safeNumber(r.duration ?? r.duration_sec ?? r.time ?? r.elapsed),
      );
      const validDurations = durations.filter((d: number) => d > 0);
      const avgRepDuration =
        validDurations.length > 0
          ? validDurations.reduce((a: number, b: number) => a + b, 0) /
            validDurations.length
          : 0;

      // 4. 适配 reps_list
      const repsList = repsDetail.map((rep: any, idx: number) => {
        const durationSec = safeNumber(
          rep.duration ?? rep.duration_sec ?? rep.time ?? rep.elapsed,
        );

        const startFrame = safeNumber(
          rep.start_frame ?? rep.frame_start ?? rep.start_idx ?? rep.from,
        );
        const endFrame = safeNumber(
          rep.end_frame ?? rep.frame_end ?? rep.end_idx ?? rep.to,
        );

        let phasesObj: Record<string, number> = {};
        if (Array.isArray(rep.phases)) {
          rep.phases.forEach((p: any) => {
            if (typeof p === "object" && p !== null) {
              const phaseName =
                p.phase ||
                p.name ||
                p.type ||
                `phase_${Object.keys(phasesObj).length}`;
              const phaseFrame = safeNumber(
                p.frame ?? p.start ?? p.start_frame ?? p.start_idx,
              );
              phasesObj[phaseName] = phaseFrame;
            } else if (typeof p === "string") {
              phasesObj[p] = 0;
            }
          });
        } else if (rep.phases && typeof rep.phases === "object") {
          Object.entries(rep.phases).forEach(([key, val]) => {
            phasesObj[key] = safeNumber(val);
          });
        }

        const rawErrors = Array.isArray(rep.errors) ? rep.errors : [];
        const feedback = safeString(rep.feedback);
        const qualityScore = safeNumber(
          rep.quality_score ?? rep.score ?? rep.quality,
        );

        return {
          rep_index: safeNumber(rep.rep_index ?? rep.index, idx),
          duration_sec: durationSec,
          quality_score: qualityScore,
          errors: rawErrors,
          feedback,
          phases: phasesObj,
          start_frame: startFrame,
          end_frame: endFrame,
        };
      });

      // 5. 质量细分 breakdown (✅ 去掉了 stability)
      const breakdown = analysisData.quality?.breakdown || {};
      const qualityBreakdown = {
        bar_path: extractScore(breakdown.bar_path),
        joint_control: extractScore(
          breakdown.joint_control || breakdown.elbow_tuck,
        ),
        tempo: extractScore(breakdown.tempo),
        safety: extractScore(breakdown.safety || breakdown.touch_point),
      };

      // 6. 速度相关
      const rawVelocityCurve = analysisData.fatigue?.velocity_curve || [];
      const velocityCurve: number[] = Array.isArray(rawVelocityCurve)
        ? rawVelocityCurve
            .map((v: any) => safeNumber(v, NaN))
            .filter((v: number) => Number.isFinite(v))
        : [];

      const avgSpeed =
        velocityCurve.length > 0
          ? (
              velocityCurve.reduce((a, b) => a + b, 0) / velocityCurve.length
            ).toFixed(2) + " m/s"
          : "-- m/s";
      const maxSpeed =
        velocityCurve.length > 0
          ? Math.max(...velocityCurve).toFixed(2) + " m/s"
          : "-- m/s";

      // 7. 安全构建 fatigue 对象
      const rawFatigue = analysisData.fatigue;
      const fatigue = rawFatigue
        ? {
            velocity_loss_pct: safeNumber(
              rawFatigue.velocity_loss_pct ??
                rawFatigue.velocity_loss ??
                rawFatigue.speed_loss,
            ),
            estimated_rir: safeNumber(
              rawFatigue.estimated_rir ?? rawFatigue.rir,
              -1,
            ),
            fatigue_level: safeString(
              rawFatigue.fatigue_level ?? rawFatigue.level,
              "unknown",
            ),
            velocity_curve: velocityCurve,
          }
        : undefined;

      // 8. 安全构建 sticking_point
      const rawStickingPoint = analysisData.sticking_point;
      const stickingPoint = rawStickingPoint
        ? {
            ...rawStickingPoint,
            description: safeString(
              rawStickingPoint.description ??
                rawStickingPoint.message ??
                rawStickingPoint.text,
              "暂无",
            ),
          }
        : undefined;

      // 9. 安全构建 ai_feedback
      const rawAi = analysisData.ai_feedback;
      const aiFeedback = rawAi
        ? {
            summary: safeString(
              rawAi.summary || rawAi.summary_text || rawAi.overall_description,
            ),

            strengths: Array.isArray(rawAi.strengths)
              ? rawAi.strengths.map((s: any) => safeString(s)).filter(Boolean)
              : [],
            critical_issues: Array.isArray(rawAi.critical_issues)
              ? rawAi.critical_issues
                  .map((s: any) => safeString(s))
                  .filter(Boolean)
              : (() => {
                  const details =
                    rawAi.errors_summary?.details ||
                    rawAi.errors_summary?.top_errors ||
                    [];
                  return details
                    .filter(
                      (e: any) =>
                        e.severity === "high" ||
                        e.severity === "severe" ||
                        e.severity_raw === "high",
                    )
                    .map((e: any) =>
                      safeString(e.name || e.name_zh || e.error_id || ""),
                    )
                    .filter(Boolean);
                })(),
            detailed_errors: (() => {
              const rawDetails =
                rawAi.detailed_errors ||
                rawAi.errors_summary?.details ||
                rawAi.errors_summary?.top_errors ||
                [];
              if (!Array.isArray(rawDetails)) return [];
              return rawDetails.map((err: any) => ({
                error_id: safeString(
                  err.error_id || err.rule || "",
                ),
                error_name: safeString(
                  err.error_name ||
                    err.name ||
                    err.name_zh ||
                    err.error_id ||
                    "未知错误",
                ),
                name: safeString(
                  err.name || err.name_zh || err.error_id || "未知错误",
                ),
                severity: safeString(
                  err.severity || err.severity_raw || "medium",
                ),
                explanation: safeString(err.explanation || err.feedback || ""),
                correction: safeString(err.correction || err.suggestion || ""),
                drills: Array.isArray(err.drills)
                  ? err.drills.map((d: any) => safeString(d)).filter(Boolean)
                  : [],
              }));
            })(),
            improvement_plan: (() => {
              if (Array.isArray(rawAi.improvement_plan))
                return rawAi.improvement_plan
                  .map((s: any) => safeString(s))
                  .filter(Boolean);
              if (Array.isArray(rawAi.top_suggestions))
                return rawAi.top_suggestions
                  .map((s: any) => {
                    if (typeof s === "string") return s;
                    if (typeof s === "object" && s !== null) {
                      return safeString(
                        s.feedback || s.suggestion || s.problem || "",
                      );
                    }
                    return "";
                  })
                  .filter(Boolean);
              return [];
            })(),
            fatigue_warning: (() => {
              const fw = rawAi.fatigue_warning;
              if (fw == null) return "";
              if (typeof fw === "string") return fw;
              if (typeof fw === "object") return safeString(fw.message || fw);
              return String(fw);
            })(),
            motivation: safeString(rawAi.motivation),
          }
        : undefined;

      // 10. 构建完整的 AnalysisResult 对象 (✅ 去掉了 stability 硬编码)
      const validated: AnalysisResult = {
        exercise: exerciseName,
        reps: safeNumber(analysisData.rep_count ?? repsDetail.length, 0),
        score: safeNumber(
          analysisData.total_score ?? analysisData.quality?.total_score,
          0,
        ),
        avg_rep_duration: avgRepDuration,
        reps_list: repsList,
        ...(analysisData.video_url && {
          video_url: analysisData.video_url.startsWith("http")
            ? analysisData.video_url
            : `${API_BASE_URL}${analysisData.video_url}`,
        }),
        ...(analysisData.summary_metrics?.fps_detected && {
          fps: analysisData.summary_metrics.fps_detected,
        }),
        quality_breakdown: qualityBreakdown,
        ...(aiFeedback && { ai_feedback: aiFeedback }),
        ...(analysisData.angle_curves && {
          angle_curves: analysisData.angle_curves,
        }),
        ...(analysisData.skeleton_frames && {
          skeleton_frames: analysisData.skeleton_frames,
        }),
        ...(Array.isArray(analysisData.key_frames) && analysisData.key_frames.length > 0 && {
          key_frames: analysisData.key_frames.map((kf: any) => ({
            ...kf,
            image_url: kf.image_url?.startsWith("http")
              ? kf.image_url
              : `${API_BASE_URL}${kf.image_url}`,
          })),
        }),
        ...(fatigue && { fatigue }),
        ...(analysisData.quality && { quality: analysisData.quality }),
        ...(analysisData.errors && { errors: analysisData.errors }),
        ...(analysisData.confidence !== undefined && {
          confidence: safeNumber(analysisData.confidence),
        }),
        stability: safeString(
          analysisData.stability ||
            analysisData.quality?.breakdown?.bar_path?.feedback,
          "良好",
        ),
        offset: safeString(analysisData.offset, "无明显偏移"),
        path_smoothness: safeString(analysisData.path_smoothness, "平滑"),
        avg_speed: avgSpeed,
        max_speed: maxSpeed,
        ...(stickingPoint && { sticking_point: stickingPoint }),
      };

      // 11. 构建缩略图 URL
      let thumbnailUrl: string | undefined;
      const rawThumb = analysisData.thumbnailUrl || analysisData.thumbnail_url;
      if (rawThumb) {
        if (rawThumb.startsWith("http")) {
          thumbnailUrl = rawThumb;
        } else {
          const baseUrl = uploadResult._baseUrl || "http://192.168.1.78:8001";
          thumbnailUrl = `${baseUrl}${rawThumb}`;
        }
      }

      // 12. 更新记录
      setRecords((prev) =>
        prev.map((r) =>
          r.id === tempId
            ? {
                ...r,
                isProcessing: false,
                exercise: exerciseName,
                repsCount: validated.reps,
                score: validated.score,
                analysis: validated,
                image: thumbnailUrl,
              }
            : r,
        ),
      );

      // 13. 分析完成后自动打开分析详情弹窗（不自动关闭，等用户手动关闭）
      setCurrentAnalysis(validated);
      setSelectedRepIndex(0);
      setShowAnalysisModal(true);
    } catch (error: any) {
      console.error("上传/分析失败:", error);
      Alert.alert("错误", error.message || "上传或分析失败");
      setRecords((prev) => prev.filter((r) => !r.isProcessing));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setShowUploadLockModal(false);
    }
  }, []);

  const viewAnalysisDetails = useCallback((item: ExerciseRecord) => {
    if (item.analysis) {
      setCurrentAnalysis(item.analysis);
      setSelectedRepIndex(0);
      setShowAnalysisModal(true);
    }
  }, []);

  const hideAnalysisDetails = useCallback(() => {
    setShowAnalysisModal(false);
  }, []);

  const showDeleteConfirmation = useCallback((id: string) => {
    Alert.alert("确认删除", "确定要删除这个训练记录吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: () => handleDelete(id),
      },
    ]);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      setTimeout(() => {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        setDeletingId(null);
      }, 300);
    } catch (error: any) {
      console.error("删除失败:", error);
      Alert.alert("错误", "删除失败");
      setDeletingId(null);
    }
  }, []);

  return {
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
  };
};
