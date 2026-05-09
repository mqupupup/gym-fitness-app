import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function WendlerDetail() {
  const insets = useSafeAreaInsets();
  const { planData } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "个性化Wendler 训练计划",
      headerTitle: "个性化Wendler 训练计划",
    });
  }, [navigation]);

  // 解析传入的计划数据
  const data = planData ? JSON.parse(planData as string) : null;

  if (!data) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>未找到训练计划数据</Text>
      </SafeAreaView>
    );
  }

  // Wendler 5-3-1 核心计算逻辑
  const calculateCycleWeights = (
    oneRepMax: number,
    progression: number,
    cycle: number,
  ) => {
    const baseWeight = oneRepMax * 0.9; // 90% of 1RM
    const currentBase = baseWeight + progression * (cycle - 1);

    return {
      week1: [
        Math.round(currentBase * 0.65 * 2) / 2,
        Math.round(currentBase * 0.75 * 2) / 2,
        Math.round(currentBase * 0.85 * 2) / 2,
      ],
      week2: [
        Math.round(currentBase * 0.7 * 2) / 2,
        Math.round(currentBase * 0.8 * 2) / 2,
        Math.round(currentBase * 0.9 * 2) / 2,
      ],
      week3: [
        Math.round(currentBase * 0.75 * 2) / 2,
        Math.round(currentBase * 0.85 * 2) / 2,
        Math.round(currentBase * 0.95 * 2) / 2,
      ],
      week4: [
        Math.round(currentBase * 0.4 * 2) / 2,
        Math.round(currentBase * 0.5 * 2) / 2,
        Math.round(currentBase * 0.6 * 2) / 2,
      ],
    };
  };

  const calculateBBBWeight = (oneRepMax: number, percentage: number) => {
    return Math.round(oneRepMax * (percentage / 100) * 2) / 2;
  };

  // 训练日映射（基于Excel中的标准安排）
  const trainingDays = [
    { day: "周一", exercise: "深蹲", key: "squat" },
    { day: "周三", exercise: "卧推", key: "bench" },
    { day: "周四", exercise: "硬拉", key: "deadlift" },
    { day: "周五", exercise: "推举", key: "press" },
  ];

  const renderCycle = (cycle: number) => {
    const lifts = data.lifts;
    const progression = data.progression;
    const bbbPct = data.bbbPercentage;

    // 计算各动作的重量
    const squatWeights = calculateCycleWeights(
      lifts.squat.oneRepMax,
      progression.squat,
      cycle,
    );
    const benchWeights = calculateCycleWeights(
      lifts.bench.oneRepMax,
      progression.bench,
      cycle,
    );
    const deadliftWeights = calculateCycleWeights(
      lifts.deadlift.oneRepMax,
      progression.deadlift,
      cycle,
    );
    const pressWeights = calculateCycleWeights(
      lifts.press.oneRepMax,
      progression.press,
      cycle,
    );

    const squatBBB = calculateBBBWeight(lifts.squat.oneRepMax, bbbPct);
    const benchBBB = calculateBBBWeight(lifts.bench.oneRepMax, bbbPct);
    const deadliftBBB = calculateBBBWeight(lifts.deadlift.oneRepMax, bbbPct);
    const pressBBB = calculateBBBWeight(lifts.press.oneRepMax, bbbPct);

    const weightsMap = {
      squat: squatWeights,
      bench: benchWeights,
      deadlift: deadliftWeights,
      press: pressWeights,
    };

    const bbbMap = {
      squat: squatBBB,
      bench: benchBBB,
      deadlift: deadliftBBB,
      press: pressBBB,
    };

    return (
      <View key={cycle} style={styles.cycleContainer}>
        <Text style={styles.cycleTitle}>第 {cycle} 周期 (4周)</Text>

        {/* 训练频率说明 */}
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleTitle}>📅 训练频率安排：</Text>
          <Text style={styles.scheduleText}>• 周一：深蹲日</Text>
          <Text style={styles.scheduleText}>• 周三：卧推日</Text>
          <Text style={styles.scheduleText}>• 周四：硬拉日</Text>
          <Text style={styles.scheduleText}>• 周五：推举日</Text>
          <Text style={styles.scheduleNote}>
            💡 每周训练4天，周二、周六、周日为休息日
          </Text>
        </View>

        {/* 按实际训练日展示 */}
        {trainingDays.map((trainingDay, dayIndex) => {
          const exerciseKey = trainingDay.key as keyof typeof weightsMap;
          const weights = weightsMap[exerciseKey];
          const bbbWeight = bbbMap[exerciseKey];

          return (
            <View key={dayIndex} style={styles.exerciseContainer}>
              <Text style={styles.dayHeader}>
                {trainingDay.day} - {trainingDay.exercise}
              </Text>

              {/* 第1周 */}
              <View style={styles.weekSection}>
                <Text style={styles.weekLabel}>第1周 (强度周)</Text>
                {renderSets(weights.week1, false)}
                <View style={styles.bbbRow}>
                  <Text style={styles.bbbLabel}>辅助训练:</Text>
                  <Text style={styles.bbbValue}>
                    {bbbWeight.toFixed(1)} kg × 5组×10次
                  </Text>
                </View>
              </View>

              {/* 第2周 */}
              <View style={styles.weekSection}>
                <Text style={styles.weekLabel}>第2周 (强度周)</Text>
                {renderSets(weights.week2, false)}
                <View style={styles.bbbRow}>
                  <Text style={styles.bbbLabel}>辅助训练:</Text>
                  <Text style={styles.bbbValue}>
                    {bbbWeight.toFixed(1)} kg × 5组×10次
                  </Text>
                </View>
              </View>

              {/* 第3周 */}
              <View style={styles.weekSection}>
                <Text style={styles.weekLabel}>第3周 (PR周 💪)</Text>
                {renderSets(weights.week3, true)}
                <View style={styles.bbbRow}>
                  <Text style={styles.bbbLabel}>辅助训练:</Text>
                  <Text style={styles.bbbValue}>
                    {bbbWeight.toFixed(1)} kg × 5组×10次
                  </Text>
                </View>
              </View>

              {/* 第4周 */}
              <View style={styles.weekSection}>
                <Text style={styles.weekLabel}>第4周 (减载周 📉)</Text>
                {renderSets(weights.week4, false, true)}
                <View style={styles.bbbRow}>
                  <Text style={styles.bbbLabel}>辅助训练:</Text>
                  <Text style={styles.bbbValue}>
                    {bbbWeight.toFixed(1)} kg × 3组×10次
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderSets = (
    weights: number[],
    isPRWeek: boolean,
    isDeload: boolean = false,
  ) => {
    const reps = isDeload ? ["3×5"] : ["5+", "5+", "5+"];

    return (
      <View style={styles.setsContainer}>
        {weights.map((weight, index) => (
          <View key={index} style={styles.setRow}>
            <Text style={styles.setNumber}>第 {index + 1} 组:</Text>
            <Text style={styles.weightText}>{weight.toFixed(1)} kg</Text>
            <Text style={styles.repsText}>{reps[index]}</Text>
            {isPRWeek && index === 2 && (
              <Text style={styles.prIndicator}>💪</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Wendler 5-3-1 训练计划</Text>
        <Text style={styles.subtitle}>基于您的个人数据生成</Text>

        {/* 显示用户输入的概要 */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>📋 计划概要</Text>
          <Text>体重: {data.userWeight} kg</Text>
          <Text>深蹲 1RM: {data.lifts.squat.oneRepMax.toFixed(1)} kg</Text>
          <Text>卧推 1RM: {data.lifts.bench.oneRepMax.toFixed(1)} kg</Text>
          <Text>硬拉 1RM: {data.lifts.deadlift.oneRepMax.toFixed(1)} kg</Text>
          <Text>推举 1RM: {data.lifts.press.oneRepMax.toFixed(1)} kg</Text>
          <Text>
            每周期进步: 深蹲：{data.progression.squat}kg, 卧推：
            {data.progression.bench}kg, 硬拉：{data.progression.deadlift}kg,
            推举：{data.progression.press}kg
          </Text>
        </View>

        {/* 重要说明 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>⚠️ 重要说明：</Text>
          <Text style={styles.infoText}>
            • 这是4天/周训练计划，不是连续训练
          </Text>
          <Text style={styles.infoText}>• 每个"周期"包含完整的4周训练</Text>
          <Text style={styles.infoText}>
            • 第1-3周为强度训练，第4周为减载恢复
          </Text>
          <Text style={styles.infoText}>
            • "5+" 表示至少完成5次，尽可能多做
          </Text>
        </View>

        {/* 生成前2个周期的计划（避免页面过长） */}
        {renderCycle(1)}
        {renderCycle(2)}

        {/* 导出/打印提示 */}
        <View style={styles.exportContainer}>
          <Text style={styles.exportText}>
            💡 提示: 您可以截图保存此计划，或在训练记录页面跟踪进度
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
  },
  title: {
    color: "#1C1C1E",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: "#FFF3CD",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  infoTitle: {
    color: "#856404",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    color: "#856404",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  cycleContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cycleTitle: {
    color: "#1C1C1E",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  scheduleInfo: {
    backgroundColor: "#E8F4FF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  scheduleTitle: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  scheduleText: {
    color: "#007AFF",
    fontSize: 14,
    marginBottom: 4,
  },
  scheduleNote: {
    color: "#4A4A4A",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 8,
  },
  exerciseContainer: {
    marginBottom: 24,
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
  },
  dayHeader: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 4,
  },
  weekSection: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
  },
  weekLabel: {
    color: "#1C1C1E",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  setsContainer: {
    marginBottom: 8,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  setNumber: {
    color: "#4A4A4A",
    fontSize: 14,
    flex: 1,
  },
  weightText: {
    color: "#1C1C1E",
    fontSize: 14,
    fontWeight: "600",
    minWidth: 60,
    textAlign: "right",
  },
  repsText: {
    color: "#4A4A4A",
    fontSize: 14,
    minWidth: 40,
    textAlign: "right",
  },
  prIndicator: {
    color: "#FF3B30",
    fontSize: 16,
    marginLeft: 4,
  },
  bbbRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  bbbLabel: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  bbbValue: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 8,
  },
  exportContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  exportText: {
    color: "#8E8E93",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});
