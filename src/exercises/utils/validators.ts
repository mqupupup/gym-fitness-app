// app/(tabs)/exercises/utils/validators.ts
import {
    AnalysisResult,
    FatigueResult,
    QualityBreakdown,
    RepResult,
} from "../types";

/**
 * 验证并标准化后端返回的分析数据
 * 包含 V8.0 ai_feedback 解析
 */
export const validateAnalysisData = (data: any): AnalysisResult => {
  // 验证 reps_list
  let repsList: RepResult[] = [];
  if (Array.isArray(data.reps_list)) {
    repsList = data.reps_list
      .filter((r: any) => r && typeof r.rep_index === "number")
      .map((r: any) => ({
        rep_index: r.rep_index,
        start_frame: r.start_frame ?? 0,
        end_frame: r.end_frame ?? 0,
        duration_sec: r.duration_sec ?? 0,
        phases:
          r.phases && typeof r.phases === "object"
            ? (Object.fromEntries(
                Object.entries(r.phases).filter(
                  ([, v]) => typeof v === "number",
                ),
              ) as Record<string, number>)
            : {},
        errors: Array.isArray(r.errors)
          ? r.errors
              .filter((e: any) => e && typeof e.name === "string")
              .map((e: any) => ({
                name: e.name,
                severity: typeof e.severity === "string" ? e.severity : "low",
                value: typeof e.value === "number" ? e.value : undefined,
                threshold:
                  typeof e.threshold === "number" ? e.threshold : undefined,
              }))
          : [],
        metrics:
          r.metrics && typeof r.metrics === "object"
            ? (Object.fromEntries(
                Object.entries(r.metrics).filter(
                  ([, v]) => typeof v === "number",
                ),
              ) as Record<string, number>)
            : undefined,
      }));
  }

  // 验证 angle_curves
  let angleCurves: Record<string, number[]> = {};
  if (data.angle_curves && typeof data.angle_curves === "object") {
    Object.entries(data.angle_curves).forEach(([key, vals]) => {
      if (Array.isArray(vals)) {
        angleCurves[key] = vals.filter(
          (v: any) => typeof v === "number" && !isNaN(v),
        );
      }
    });
  }

  // 验证 skeleton_frames
  let skeletonFrames: AnalysisResult["skeleton_frames"] = [];
  if (Array.isArray(data.skeleton_frames)) {
    skeletonFrames = data.skeleton_frames
      .filter((f: any) => f && typeof f.pct === "number")
      .map((f: any) => ({
        pct: f.pct,
        joints: Array.isArray(f.joints)
          ? f.joints
              .filter(
                (j: any) =>
                  j &&
                  typeof j.name === "string" &&
                  Array.isArray(j.position) &&
                  j.position.length === 2,
              )
              .map((j: any) => ({
                name: j.name,
                position: j.position as [number, number],
              }))
          : [],
        bones: Array.isArray(f.bones)
          ? f.bones
              .filter(
                (b: any) =>
                  b &&
                  Array.isArray(b.start) &&
                  b.start.length === 2 &&
                  Array.isArray(b.end) &&
                  b.end.length === 2,
              )
              .map((b: any) => ({
                start: b.start as [number, number],
                end: b.end as [number, number],
              }))
          : [],
        angles: Array.isArray(f.angles)
          ? f.angles
              .filter(
                (a: any) =>
                  a &&
                  typeof a.name === "string" &&
                  typeof a.value === "number",
              )
              .map((a: any) => ({
                name: a.name,
                value: a.value,
              }))
          : [],
      }));
  }

  // 验证 key_frames（证据帧）
  let keyFrames: AnalysisResult["key_frames"];
  if (Array.isArray(data.key_frames)) {
    keyFrames = data.key_frames
      .filter((f: any) => f && typeof f.frame_idx === "number" && f.image_url)
      .map((f: any) => ({
        type: typeof f.type === "string" ? f.type : "bottom",
        rep_index: typeof f.rep_index === "number" ? f.rep_index : 1,
        frame_idx: f.frame_idx,
        pct: typeof f.pct === "number" ? f.pct : 0,
        image_url: f.image_url,
        frame_width: typeof f.frame_width === "number" ? f.frame_width : 720,
        frame_height: typeof f.frame_height === "number" ? f.frame_height : 1280,
        quality: typeof f.quality === "number" ? f.quality : 0,
        left_quality: typeof f.left_quality === "number" ? f.left_quality : 0,
        right_quality: typeof f.right_quality === "number" ? f.right_quality : 0,
        landmarks: Array.isArray(f.landmarks)
          ? f.landmarks
              .filter((j: any) => j && typeof j.name === "string" && Array.isArray(j.position))
              .map((j: any) => ({ name: j.name, position: j.position as [number, number] }))
          : [],
        bones: Array.isArray(f.bones)
          ? f.bones
              .filter((b: any) => b && Array.isArray(b.start) && Array.isArray(b.end))
              .map((b: any) => ({
                name: typeof b.name === "string" ? b.name : "",
                start: b.start as [number, number],
                end: b.end as [number, number],
              }))
          : [],
        metrics: f.metrics && typeof f.metrics === "object" ? f.metrics : {},
        evidence_for: Array.isArray(f.evidence_for)
          ? f.evidence_for
              .filter((e: any) => e && typeof e.rule === "string")
              .map((e: any) => ({
                rule: e.rule,
                name: typeof e.name === "string" ? e.name : e.rule,
                value: typeof e.value === "number" ? e.value : null,
                severity: typeof e.severity === "string" ? e.severity : null,
              }))
          : [],
      }));
  }

  // 验证 fatigue
  let fatigueResult: FatigueResult | undefined;
  if (data.fatigue && typeof data.fatigue === "object") {
    const f = data.fatigue;
    fatigueResult = {
      velocity_loss_pct:
        typeof f.velocity_loss_pct === "number" ? f.velocity_loss_pct : 0,
      fatigue_level:
        typeof f.fatigue_level === "string" ? f.fatigue_level : "low",
      estimated_rir: typeof f.estimated_rir === "number" ? f.estimated_rir : 0,
      velocity_curve: Array.isArray(f.velocity_curve)
        ? f.velocity_curve.filter((v: any) => typeof v === "number")
        : [],
    };
  }

  // 验证 quality_breakdown
  let qualityBreakdown: QualityBreakdown | undefined;
  if (data.quality_breakdown && typeof data.quality_breakdown === "object") {
    const q = data.quality_breakdown;
    qualityBreakdown = {
      bar_path: typeof q.bar_path === "number" ? q.bar_path : 0,
      joint_control: typeof q.joint_control === "number" ? q.joint_control : 0,
      stability: typeof q.stability === "number" ? q.stability : 0,
      tempo: typeof q.tempo === "number" ? q.tempo : 0,
      safety: typeof q.safety === "number" ? q.safety : 0,
    };
  }

  // 验证 sticking_point
  let stickingPoint: AnalysisResult["sticking_point"] | undefined;
  if (data.sticking_point && typeof data.sticking_point === "object") {
    const sp = data.sticking_point;
    if (
      typeof sp.description === "string" &&
      typeof sp.frame === "number" &&
      typeof sp.joint === "string"
    ) {
      stickingPoint = {
        description: sp.description,
        frame: sp.frame,
        joint: sp.joint,
      };
    }
  }

  // ✅ V8.0 新增：解析 ai_feedback
  let aiFeedback: AnalysisResult["ai_feedback"] | undefined;
  if (data.ai_feedback && typeof data.ai_feedback === "object") {
    const af = data.ai_feedback;
    aiFeedback = {
      summary: typeof af.summary === "string" ? af.summary : "",
      strengths: Array.isArray(af.strengths)
        ? af.strengths.filter((s: any) => typeof s === "string")
        : [],
      critical_issues: Array.isArray(af.critical_issues)
        ? af.critical_issues.filter((s: any) => typeof s === "string")
        : [],
      improvement_plan: Array.isArray(af.improvement_plan)
        ? af.improvement_plan.filter((s: any) => typeof s === "string")
        : [],
      detailed_errors: Array.isArray(af.detailed_errors)
        ? af.detailed_errors
            .filter((e: any) => e && typeof e.error_name === "string")
            .map((e: any) => ({
              error_id: typeof e.error_id === "string" ? e.error_id : "",
              error_name: e.error_name,
              severity: typeof e.severity === "string" ? e.severity : "medium",
              explanation:
                typeof e.explanation === "string" ? e.explanation : "",
              correction: typeof e.correction === "string" ? e.correction : "",
              drills: Array.isArray(e.drills)
                ? e.drills.filter((d: any) => typeof d === "string")
                : [],
            }))
        : [],
      fatigue_warning:
        typeof af.fatigue_warning === "string" ? af.fatigue_warning : undefined,
      motivation:
        typeof af.motivation === "string"
          ? af.motivation
          : "继续保持，稳步提升！",
    };
  }

  return {
    exercise: typeof data.exercise === "string" ? data.exercise : "",
    reps: typeof data.reps === "number" ? data.reps : 0,
    score: typeof data.score === "number" ? data.score : 0,
    avg_rep_duration:
      typeof data.avg_rep_duration === "number" ? data.avg_rep_duration : 0,
    reps_list: repsList,
    ...(typeof data.video_url === "string" && { video_url: data.video_url }),
    ...(typeof data.fps === "number" && { fps: data.fps }),
    feedback: Array.isArray(data.feedback)
      ? data.feedback.filter((f: any) => typeof f === "string")
      : ["📋 本次训练已完成分析，继续保持！"],
    angle_curves: angleCurves,
    skeleton_frames: skeletonFrames,
    key_frames: keyFrames,
    stability: typeof data.stability === "string" ? data.stability : "",
    offset: typeof data.offset === "string" ? data.offset : "",
    path_smoothness:
      typeof data.path_smoothness === "string" ? data.path_smoothness : "",
    avg_speed: typeof data.avg_speed === "string" ? data.avg_speed : "",
    max_speed: typeof data.max_speed === "string" ? data.max_speed : "",
    sticking_point: stickingPoint,
    quality_breakdown: qualityBreakdown,
    fatigue: fatigueResult,
    ai_feedback: aiFeedback,
  };
};
