// app/(tabs)/exercises/utils/helpers.ts

import { Alert } from "react-native";

// RPE 文本描述
export const getRPEText = (rpe: number): string => {
  if (rpe <= 5) return "轻松";
  if (rpe <= 7) return "中等";
  if (rpe <= 8.5) return "困难";
  return "极限";
};

// 疲劳等级颜色
export const getFatigueColor = (level: string): string => {
  switch (level) {
    case "low":
      return "#4CAF50";
    case "moderate":
      return "#FF9800";
    case "high":
      return "#F44336";
    default:
      return "#999";
  }
};

// 时长格式化
export const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// 计算平均速度
export const calculateAvgSpeed = (
  totalDistance: number,
  totalTime: number,
): string => {
  if (totalTime === 0) return "0.00 m/s";
  return (totalDistance / totalTime).toFixed(2) + " m/s";
};

// 显示错误提示
export const showErrorAlert = (title: string, message: string): void => {
  Alert.alert(title, message, [{ text: "确定" }]);
};

// 显示成功提示
export const showSuccessAlert = (title: string, message: string): void => {
  Alert.alert(title, message, [{ text: "确定" }]);
};

// 生成唯一 ID
export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 获取当前日期字符串
export const getCurrentDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
