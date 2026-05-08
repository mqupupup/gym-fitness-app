import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { powerliftingStyles as styles } from "../styles/powerliftingStyles";
import { AssessmentResult } from "../types/powerlifting";

interface ResultSectionProps {
  result: AssessmentResult | null;
  error: string | null;
  loading: boolean;
}

const getCoefficientDisplayName = (type: string): string => {
  switch (type) {
    case "ipf_gl":
      return "IPF GL 系数";
    case "dots":
      return "DOTS 系数";
    case "wilks":
      return "Wilks 系数";
    default:
      return "未知系数";
  }
};

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    beginner: "#FF9500",
    novice: "#FFCC00",
    intermediate: "#5AC8FA",
    advanced: "#4CD964",
    elite: "#FF2D55",
  };
  return colors[level] || "#8E8E93";
};

const getLevelName = (level: string) => {
  const names: Record<string, string> = {
    beginner: "初级",
    novice: "入门",
    intermediate: "中级",
    advanced: "高级",
    elite: "精英",
  };
  return names[level] || level;
};

export const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  error,
  loading,
}) => {
  if (loading) {
    return (
      <View style={styles.resultCard}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, textAlign: "center" }}>计算中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorCard}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!result || !result.assessments[0]) {
    return null;
  }

  const assessment = result.assessments[0];

  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultTitle}>📊 评估结果</Text>

      <View style={styles.resultSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>总重量</Text>
          <Text style={styles.summaryValue}>{assessment.total}kg</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>体重</Text>
          <Text style={styles.summaryValue}>{assessment.bodyWeight}kg</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>系数</Text>
          <Text style={styles.summaryValue}>
            {getCoefficientDisplayName(assessment.coefficient)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>标准化分数</Text>
          <Text style={styles.summaryValue}>
            {assessment.normalizedScore.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* 等级显示 */}
      <View style={styles.levelSection}>
        <Text style={styles.levelLabel}>力量举水平</Text>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: getLevelColor(result.overallLevel) },
          ]}
        >
          <Text style={styles.levelText}>
            {getLevelName(result.overallLevel)}
          </Text>
        </View>
      </View>

      {/* 系数详细信息 */}
      <View style={styles.coefficientDetail}>
        <Text style={styles.detailTitle}>系数计算详情</Text>
        <Text style={styles.detailText}>
          系数值: {assessment.coefficientValue.toFixed(6)}
        </Text>
        <Text style={styles.detailText}>
          计算公式: 总重量 × 系数值 = 标准化分数
        </Text>
        <Text style={styles.detailText}>
          {assessment.total} × {assessment.coefficientValue.toFixed(6)} ={" "}
          {assessment.normalizedScore.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};
