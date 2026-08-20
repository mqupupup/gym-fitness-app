// app/(tabs)/exercises/constants/exercises.ts

// 支持的动作列表
export const SUPPORTED_EXERCISES: string[] = ["卧推", "深蹲", "硬拉"];

// 支持的动作（用于后端校验）
export const SUPPORTED_EXERCISE_KEYS: Record<string, string> = {
  bench_press: "卧推",
  squat: "深蹲",
  deadlift: "硬拉",
};

// 动作中文名映射
export const EXERCISE_NAME_ZH: Record<string, string> = {
  bench_press: "卧推",
  squat: "深蹲",
  deadlift: "硬拉",
};

// 动作阶段名称中文映射
export const PHASE_NAME_ZH: Record<string, string> = {
  setup: "准备",
  eccentric: "离心",
  bottom: "底部",
  concentric: "向心",
  lockout: "锁定",
  finish: "完成",
};

// 关节角度名称中文映射
export const ANGLE_NAME_ZH: Record<string, string> = {
  knee_angle: "膝关节角度",
  hip_angle: "髋关节角度",
  elbow_angle: "肘关节角度",
  shoulder_angle: "肩关节角度",
  torso_angle: "躯干角度",
  shin_angle: "小腿角度",
  ankle_angle: "踝关节角度",
  wrist_angle: "腕关节角度",
  lumbar_angle: "腰椎角度",
  neck_angle: "颈椎角度",
  left_knee: "左膝",
  right_knee: "右膝",
  left_hip: "左髋",
  right_hip: "右髋",
  left_elbow: "左肘",
  right_elbow: "右肘",
  left_shoulder: "左肩",
  right_shoulder: "右肩",
  left_ankle: "左踝",
  right_ankle: "右踝",
  elbow_angle_avg: "肘角",
  torso_from_vertical: "躯干角",
  left_hip_hinge: "左髋角",
  right_hip_hinge: "右髋角",
  left_upper_arm_torso: "左肘外展",
  right_upper_arm_torso: "右肘外展",
  left_shoulder_flexion: "左肩屈曲",
  right_shoulder_flexion: "右肩屈曲",
};

// 错误严重度配置
export const SEVERITY_CONFIG: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  high: { label: "高", color: "#E53935", icon: "🔴" },
  medium: { label: "中", color: "#FB8C00", icon: "🟠" },
  low: { label: "低", color: "#43A047", icon: "🟢" },
};
