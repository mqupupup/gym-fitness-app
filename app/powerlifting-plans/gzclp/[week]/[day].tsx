import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface TrainingConfig {
  squat1RM: number;
  bench1RM: number;
  deadlift1RM: number;
  press1RM: number;
  restTime: number;
}

function getDayType(day: number) {
  return day === 1 ? "A 训练日" : day === 2 ? "B 训练日" : "A+ 训练日";
}

export default function TrainingDay() {
  const router = useRouter();
  const { week, day } = useLocalSearchParams();
  const [config, setConfig] = useState<TrainingConfig | null>(null);

  const weekStr = String(week);
  const dayStr = String(day);

  // 验证参数
  if (!weekStr || !dayStr) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ 缺少必要的路由参数</Text>
      </View>
    );
  }

  // 解析周数和训练日类型
  const weekNumber = parseInt(weekStr);
  const dayNumber = dayStr.includes("day")
    ? parseInt(dayStr.replace("day", ""))
    : 1;

  // 计算训练重量
  const calculateWeight = (oneRM: number, percentage: number) => {
    return Math.round(oneRM * (percentage / 100));
  };

  // 加载配置
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem("trainingConfig");
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error("加载配置失败:", error);
    }
  };

  // 基础百分比（根据周数递增）
  const basePercentage = 60 + weekNumber * 2;

  // 训练日类型
  const dayType = dayNumber === 1 ? "A" : dayNumber === 2 ? "B" : "A+";

  // 如果有配置，计算训练重量
  const trainingWeights = config
    ? {
        squat: calculateWeight(config.squat1RM, basePercentage),
        bench: calculateWeight(config.bench1RM, basePercentage),
        deadlift: calculateWeight(config.deadlift1RM, basePercentage),
        press: calculateWeight(config.press1RM, basePercentage),
      }
    : null;

  // 训练内容
  const exercises =
    dayNumber === 1 || dayNumber === 3
      ? [
          {
            name: "深蹲 (Squat)",
            sets: "3x5",
            percentage: `${basePercentage}%`,
            weight: trainingWeights ? `${trainingWeights.squat}kg` : "-",
          },
          {
            name: "卧推 (Bench Press)",
            sets: "3x5",
            percentage: `${basePercentage}%`,
            weight: trainingWeights ? `${trainingWeights.bench}kg` : "-",
          },
          {
            name: "划船 (Bent Over Row)",
            sets: "1x5+",
            percentage: `${basePercentage}%`,
            weight: "-",
          },
          { name: "辅助训练", sets: "3x8~12", percentage: "-", weight: "-" },
        ]
      : [
          {
            name: "深蹲 (Squat)",
            sets: "3x5",
            percentage: `${basePercentage}%`,
            weight: trainingWeights ? `${trainingWeights.squat}kg` : "-",
          },
          {
            name: "硬拉 (Deadlift)",
            sets: "1x5+",
            percentage: `${basePercentage}%`,
            weight: trainingWeights ? `${trainingWeights.deadlift}kg` : "-",
          },
          {
            name: "推举 (Overhead Press)",
            sets: "3x5",
            percentage: `${basePercentage}%`,
            weight: trainingWeights ? `${trainingWeights.press}kg` : "-",
          },
          { name: "辅助训练", sets: "3x8~12", percentage: "-", weight: "-" },
        ];

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    return () => {
      navigation.setOptions({ headerShown: true });
    };
  }, [navigation]);

  // 开始训练
  const handleStartTraining = () => {
    if (!config) {
      // 未配置则跳转到配置页面
      router.push(`/powerlifting-plans/gzclp/${week}/${day}/config`);
    } else {
      // 已配置则直接开始训练
      router.push(`/powerlifting-plans/gzclp/${week}/${day}/timer`);
    }
  };

  // 跳转到配置页面
  const handleGoToConfig = () => {
    router.push(`/powerlifting-plans/gzclp/${week}/${day}/config`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.weekText}>Week {weekStr}</Text>
          <Text style={styles.dayText}>
            Day {dayNumber} - {dayType} 训练日
          </Text>
          {config && <Text style={styles.configStatus}>✅ 配置已加载</Text>}
        </View>

        {/* 配置提示 */}
        {!config && (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠️ 未配置训练参数</Text>
            <Text style={styles.warningText}>
              点击"配置训练参数"设置1RM和休息时间
            </Text>
            <TouchableOpacity
              style={styles.configButton}
              onPress={handleGoToConfig}
            >
              <Text style={styles.configButtonText}>⚙️ 立即配置</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.exercisesContainer}>
          {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseMeta}>
                  <Text style={styles.sets}>{exercise.sets}</Text>
                  {exercise.percentage !== "-" && (
                    <Text style={styles.percentage}>{exercise.percentage}</Text>
                  )}
                  {exercise.weight !== "-" && (
                    <Text style={styles.weight}>{exercise.weight}</Text>
                  )}
                </View>
              </View>

              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>💡 要点:</Text>
                <Text style={styles.notesText}>
                  {exercise.name.includes("深蹲") &&
                    "保持核心收紧，膝盖对准脚尖"}
                  {exercise.name.includes("卧推") &&
                    "控制下放速度，保持肩胛骨收紧"}
                  {exercise.name.includes("划船") && "做到力竭，保持背部挺直"}
                  {exercise.name.includes("硬拉") && "注意背部姿势，从地面拉起"}
                  {exercise.name.includes("推举") &&
                    "保持核心稳定，不要过度拱背"}
                  {exercise.name.includes("辅助") && "选择 1-2 个辅助动作"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📊 训练参数</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>周数:</Text>
            <Text style={styles.infoValue}>Week {weekStr}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>训练日:</Text>
            <Text style={styles.infoValue}>
              Day {dayNumber} ({dayType})
            </Text>
          </View>
          {config && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>训练百分比:</Text>
                <Text style={styles.infoValue}>{basePercentage}%</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>组间休息:</Text>
                <Text style={styles.infoValue}>{config.restTime}秒</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleStartTraining}
          >
            <Text style={styles.actionButtonText}>
              {config ? "⏱️ 开始训练" : "⚙️ 配置训练参数"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              ← 返回计划
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007bff",
    borderRadius: 16,
  },
  weekText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  configStatus: {
    fontSize: 14,
    color: "#90ee90",
    fontWeight: "600",
  },
  warningCard: {
    backgroundColor: "#fff3cd",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
    marginBottom: 12,
  },
  configButton: {
    backgroundColor: "#ffc107",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  configButtonText: {
    color: "#856404",
    fontSize: 16,
    fontWeight: "600",
  },
  exercisesContainer: {
    gap: 15,
  },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  exerciseMeta: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  sets: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  percentage: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "500",
  },
  weight: {
    fontSize: 16,
    color: "#dc3545",
    fontWeight: "bold",
  },
  notesContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 12,
  },
  notesLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  notesText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "600",
  },
  actionsContainer: {
    marginTop: 30,
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#fff",
  },
});
