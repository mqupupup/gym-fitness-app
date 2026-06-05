import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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

export default function TrainingConfig() {
  const router = useRouter();
  const { week, day } = useLocalSearchParams();

  const [config, setConfig] = useState<TrainingConfig>({
    squat1RM: 0,
    bench1RM: 0,
    deadlift1RM: 0,
    press1RM: 0,
    restTime: 120,
  });

  const [loading, setLoading] = useState(true);

  // 加载已保存的配置
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
    } finally {
      setLoading(false);
    }
  };

  // 保存配置
  const saveConfig = async () => {
    // 验证输入
    if (
      config.squat1RM <= 0 ||
      config.bench1RM <= 0 ||
      config.deadlift1RM <= 0 ||
      config.press1RM <= 0 ||
      config.restTime < 30 ||
      config.restTime > 300
    ) {
      Alert.alert("⚠️ 输入错误", "请检查所有数值是否有效");
      return;
    }

    try {
      await AsyncStorage.setItem("trainingConfig", JSON.stringify(config));
      Alert.alert("✅ 配置已保存", "训练配置已成功保存", [
        {
          text: "开始训练",
          onPress: () => {
            router.push({
              pathname: `/powerlifting-plans/gzclp/[week]/[day]`,
              params: { week, day },
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert("❌ 保存失败", "配置保存失败，请重试");
      console.error("保存配置失败:", error);
    }
  };

  // 计算训练重量
  const calculateWeight = (oneRM: number, percentage: number) => {
    return Math.round(oneRM * (percentage / 100));
  };

  // 获取训练日类型
  const dayNumber = String(day).includes("day")
    ? parseInt(String(day).replace("day", ""))
    : 1;

  const weekNumber = parseInt(String(week));
  const basePercentage = 60 + weekNumber * 2;

  // 计算本周训练重量
  const trainingWeights = {
    squat: calculateWeight(config.squat1RM, basePercentage),
    bench: calculateWeight(config.bench1RM, basePercentage),
    deadlift: calculateWeight(config.deadlift1RM, basePercentage),
    press: calculateWeight(config.press1RM, basePercentage),
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>训练配置</Text>
          <Text style={styles.headerSubtitle}>
            Week {week} - Day {dayNumber}
          </Text>
        </View>

        {/* 1RM 输入 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏋️ 一次最大重量 (1RM)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>深蹲 (Squat)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="输入公斤数"
                value={config.squat1RM.toString()}
                onChangeText={(text) =>
                  setConfig({ ...config, squat1RM: parseFloat(text) || 0 })
                }
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>卧推 (Bench Press)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="输入公斤数"
                value={config.bench1RM.toString()}
                onChangeText={(text) =>
                  setConfig({ ...config, bench1RM: parseFloat(text) || 0 })
                }
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>硬拉 (Deadlift)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="输入公斤数"
                value={config.deadlift1RM.toString()}
                onChangeText={(text) =>
                  setConfig({ ...config, deadlift1RM: parseFloat(text) || 0 })
                }
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>推举 (Overhead Press)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="输入公斤数"
                value={config.press1RM.toString()}
                onChangeText={(text) =>
                  setConfig({ ...config, press1RM: parseFloat(text) || 0 })
                }
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          </View>
        </View>

        {/* 休息时间设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱️ 组间休息时间</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>休息时间</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="输入秒数"
                value={config.restTime.toString()}
                onChangeText={(text) =>
                  setConfig({ ...config, restTime: parseInt(text) || 120 })
                }
              />
              <Text style={styles.unit}>秒</Text>
            </View>
            <Text style={styles.hint}>建议范围: 60-180秒 (1-3分钟)</Text>
          </View>
        </View>

        {/* 训练重量预览 */}
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>📊 本周训练重量预览</Text>

          <View style={styles.weightRow}>
            <Text style={styles.weightLabel}>深蹲:</Text>
            <Text style={styles.weightValue}>
              {trainingWeights.squat}kg @ {basePercentage}%
            </Text>
          </View>

          <View style={styles.weightRow}>
            <Text style={styles.weightLabel}>卧推:</Text>
            <Text style={styles.weightValue}>
              {trainingWeights.bench}kg @ {basePercentage}%
            </Text>
          </View>

          <View style={styles.weightRow}>
            <Text style={styles.weightLabel}>硬拉:</Text>
            <Text style={styles.weightValue}>
              {trainingWeights.deadlift}kg @ {basePercentage}%
            </Text>
          </View>

          <View style={styles.weightRow}>
            <Text style={styles.weightLabel}>推举:</Text>
            <Text style={styles.weightValue}>
              {trainingWeights.press}kg @ {basePercentage}%
            </Text>
          </View>
        </View>

        {/* 保存按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={saveConfig}>
          <Text style={styles.saveButtonText}>✅ 保存配置并开始训练</Text>
        </TouchableOpacity>

        {/* 提示信息 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 使用说明</Text>
          <Text style={styles.infoText}>
            • 1RM = 一次最大重量（你能标准完成一次的最大重量）
          </Text>
          <Text style={styles.infoText}>
            • 训练重量 = 1RM × 百分比（本周: {basePercentage}%）
          </Text>
          <Text style={styles.infoText}>• 休息时间可根据个人恢复能力调整</Text>
          <Text style={styles.infoText}>
            • 配置会自动保存，下次训练无需重复输入
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0f0ff",
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  unit: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  hint: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
    fontStyle: "italic",
  },
  previewCard: {
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
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  weightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  weightLabel: {
    fontSize: 14,
    color: "#666",
  },
  weightValue: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#e7f3ff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#1976d2",
    lineHeight: 20,
    marginBottom: 4,
  },
});
