// app/(tabs)/exercises/types/index.ts

/** 单个错误 */
export type RepError = {
  name: string;
  severity: string;
  value?: number;
  threshold?: number;
};

/** 单组动作 */
export type RepResult = {
  rep_index: number;
  start_frame: number;
  end_frame: number;
  duration_sec: number;
  phases: Record<string, number>;
  errors: RepError[];
  metrics?: Record<string, number>;
};

/** 疲劳分析 */
export type FatigueResult = {
  velocity_loss_pct: number;
  fatigue_level: string;
  estimated_rir: number;
  velocity_curve: number[];
};

/** 质量细分 */
export type QualityBreakdown = {
  bar_path: number;
  joint_control: number;
  stability: number;
  tempo: number;
  safety: number;
};

/** 分析结果 */
export type AnalysisResult = {
  exercise: string;
  reps: number;
  score: number;
  avg_rep_duration: number;
  reps_list: RepResult[];
  video_url?: string;
  fps?: number;
  feedback: string[];
  angle_curves: Record<string, number[]>;
  skeleton_frames: Array<{
    pct: number;
    joints: Array<{ name: string; position: [number, number] }>;
    bones: Array<{ start: [number, number]; end: [number, number] }>;
    angles: Array<{ name: string; value: number }>;
  }>;
  /** Evidence Frame v1 — 关键事件证据帧 */
  key_frames?: Array<{
    type: "bottom" | "lockout" | string;
    rep_index: number;
    frame_idx: number;
    pct: number;
    image_url: string;
    frame_width: number;
    frame_height: number;
    quality: number;
    left_quality: number;
    right_quality: number;
    landmarks: Array<{ name: string; position: [number, number] }>;
    bones: Array<{ name: string; start: [number, number]; end: [number, number] }>;
    metrics: Record<string, number>;
    evidence_for: Array<{
      rule: string;
      name: string;
      value: number | null;
      severity: string | null;
    }>;
  }>;
  stability: string;
  offset: string;
  path_smoothness: string;
  avg_speed: string;
  max_speed: string;
  sticking_point?: {
    description: string;
    frame: number;
    joint: string;
  };
  quality_breakdown?: QualityBreakdown;
  fatigue?: FatigueResult;
  // ✅ V8.0 新增：AI 深度反馈
  ai_feedback?: {
    summary: string;
    strengths: string[];
    critical_issues: string[];
    improvement_plan: string[];
    detailed_errors?: Array<{
      error_id?: string;
      error_name: string;
      severity: string;
      explanation: string;
      correction: string;
      drills: string[];
    }>;
    fatigue_warning?: string;
    motivation: string;
  };
};

/** 训练记录 */
export type ExerciseRecord = {
  id: string;
  image?: string;
  date: string;
  duration: string;
  exercise?: string;
  repsCount?: number;
  score?: number;
  isProcessing?: boolean;
  analysis?: AnalysisResult;
};
