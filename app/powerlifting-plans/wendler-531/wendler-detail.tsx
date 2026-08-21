import { Stack, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function WendlerDetail() {
  const { planData } = useLocalSearchParams();
  const navigation = useNavigation();
  const [selectedCycle, setSelectedCycle] = useState(1);
  const [selectedDay, setSelectedDay] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Wendler 训练计划" });
  }, [navigation]);

  const data = planData ? JSON.parse(planData as string) : null;

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Wendler 训练计划" }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#8E8E93" />
          <Text style={styles.errorText}>未找到训练计划数据</Text>
        </View>
      </SafeAreaView>
    );
  }

  const calculateCycleWeights = (
    oneRepMax: number,
    progression: number,
    cycle: number,
  ) => {
    const baseWeight = oneRepMax * 0.9;
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

  const trainingDays = [
    { day: "周一", exercise: "深蹲", key: "squat" },
    { day: "周三", exercise: "卧推", key: "bench" },
    { day: "周四", exercise: "硬拉", key: "deadlift" },
    { day: "周五", exercise: "推举", key: "press" },
  ];

  const renderSets = (
    weights: number[],
    weekIndex: number,
  ) => {
    // 经典 5/3/1 组次数：第1周 5/5/5+，第2周 3/3/3+，第3周 5/3/1+，第4周 5/5/5
    const repsByWeek = [
      ["5", "5", "5+"],
      ["3", "3", "3+"],
      ["5", "3", "1+"],
      ["5", "5", "5"],
    ];
    const reps = repsByWeek[weekIndex] || ["5", "5", "5+"];
    const isPRWeek = weekIndex === 2;

    return (
      <View style={styles.setsContainer}>
        {weights.map((weight, index) => (
          <View key={index} style={styles.setRow}>
            <Text style={styles.setNumber}>第{index + 1}组</Text>
            <Text style={styles.weightText}>{weight.toFixed(1)} kg</Text>
            <Text style={styles.repsText}>{reps[index]}</Text>
            {isPRWeek && index === 2 && (
              <View style={styles.prBadge}>
                <Text style={styles.prText}>PR</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderCycleDay = (cycle: number, dayIndex: number) => {
    const lifts = data.lifts;
    const progression = data.progression;
    const bbbPct = data.bbbPercentage;

    const weightsMap = {
      squat: calculateCycleWeights(lifts.squat.oneRepMax, progression.squat, cycle),
      bench: calculateCycleWeights(lifts.bench.oneRepMax, progression.bench, cycle),
      deadlift: calculateCycleWeights(lifts.deadlift.oneRepMax, progression.deadlift, cycle),
      press: calculateCycleWeights(lifts.press.oneRepMax, progression.press, cycle),
    };

    const bbbMap = {
      squat: calculateBBBWeight(lifts.squat.oneRepMax, bbbPct),
      bench: calculateBBBWeight(lifts.bench.oneRepMax, bbbPct),
      deadlift: calculateBBBWeight(lifts.deadlift.oneRepMax, bbbPct),
      press: calculateBBBWeight(lifts.press.oneRepMax, bbbPct),
    };

    const weekLabels = [
      { key: "week1", label: "第1周", type: "强度周" },
      { key: "week2", label: "第2周", type: "强度周" },
      { key: "week3", label: "第3周", type: "PR周" },
      { key: "week4", label: "第4周", type: "减载周" },
    ];

    const trainingDay = trainingDays[dayIndex];
    const exerciseKey = trainingDay.key as keyof typeof weightsMap;
    const weights = weightsMap[exerciseKey];
    const bbbWeight = bbbMap[exerciseKey];

    return (
      <View style={styles.exerciseCard}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayText}>{trainingDay.day}</Text>
          <Text style={styles.exerciseText}>{trainingDay.exercise}</Text>
        </View>

        {weekLabels.map((week, wi) => (
          <View key={wi} style={styles.weekCard}>
            <View style={styles.weekHeader}>
              <Text style={styles.weekLabel}>{week.label}</Text>
              <View style={[
                styles.weekTypeBadge,
                week.type === "PR周" && styles.weekTypePR,
                week.type === "减载周" && styles.weekTypeDeload,
              ]}>
                <Text style={[
                  styles.weekTypeText,
                  week.type === "PR周" && styles.weekTypeTextPR,
                  week.type === "减载周" && styles.weekTypeTextDeload,
                ]}>{week.type}</Text>
              </View>
            </View>
            {renderSets(
              (weights as any)[week.key],
              wi,
            )}
            <View style={styles.bbbRow}>
              <Text style={styles.bbbLabel}>辅助训练</Text>
              <Text style={styles.bbbValue}>
                {bbbWeight.toFixed(1)} kg × {week.type === "减载周" ? "3" : "5"}组×10次
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Wendler 训练计划" }} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="document-text-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Wendler 训练计划</Text>
            <Text style={styles.headerSubtitle}>基于你的个人数据生成</Text>
          </View>
        </View>

        {/* 计划概要 */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={18} color="#6A4C93" />
            <Text style={styles.cardTitle}>四项 1RM 估算</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>深蹲 1RM</Text>
            <Text style={styles.summaryValue}>{data.lifts.squat.oneRepMax.toFixed(1)} kg</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>卧推 1RM</Text>
            <Text style={styles.summaryValue}>{data.lifts.bench.oneRepMax.toFixed(1)} kg</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>硬拉 1RM</Text>
            <Text style={styles.summaryValue}>{data.lifts.deadlift.oneRepMax.toFixed(1)} kg</Text>
          </View>
          <View style={styles.summaryRowLast}>
            <Text style={styles.summaryLabel}>推举 1RM</Text>
            <Text style={styles.summaryValue}>{data.lifts.press.oneRepMax.toFixed(1)} kg</Text>
          </View>
        </View>

        {/* 重要说明 */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="warning-outline" size={18} color="#6A4C93" />
            <Text style={styles.cardTitle}>重要说明</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>这是 4 天/周训练计划，不是连续训练</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>每个周期包含完整的 4 周训练</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>第 1-3 周为强度训练，第 4 周为减载恢复</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>"5+" 表示至少完成 5 次，尽可能多做</Text>
          </View>
        </View>

        {/* 训练频率 */}
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Ionicons name="calendar-outline" size={16} color="#6A4C93" />
            <Text style={styles.scheduleTitle}>训练频率</Text>
          </View>
          {trainingDays.map((d, i) => (
            <Text key={i} style={styles.scheduleText}>
              {d.day}：{d.exercise}日
            </Text>
          ))}
          <Text style={styles.scheduleNote}>每周训练4天，周二、周六、周日休息</Text>
        </View>

        {/* 周期选择 */}
        <View style={styles.tabSection}>
          <Text style={styles.tabSectionTitle}>选择周期</Text>
          <View style={styles.tabRow}>
            {[1, 2, 3, 4].map((cycle) => (
              <Pressable
                key={cycle}
                style={[
                  styles.tabButton,
                  selectedCycle === cycle && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedCycle(cycle)}
              >
                <Text style={[
                  styles.tabButtonText,
                  selectedCycle === cycle && styles.tabButtonTextActive,
                ]}>周期{cycle}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 训练日选择 */}
        <View style={styles.tabSection}>
          <Text style={styles.tabSectionTitle}>选择训练日</Text>
          <View style={styles.tabRow}>
            {trainingDays.map((d, i) => (
              <Pressable
                key={i}
                style={[
                  styles.tabButton,
                  selectedDay === i && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedDay(i)}
              >
                <Text style={[
                  styles.tabButtonText,
                  selectedDay === i && styles.tabButtonTextActive,
                ]}>{d.exercise}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 当前周期+训练日的训练安排 */}
        <View style={styles.cycleCard}>
          <View style={styles.cycleHeader}>
            <View style={styles.cycleBadge}>
              <Text style={styles.cycleBadgeText}>周期 {selectedCycle}</Text>
            </View>
            <Text style={styles.cycleTitle}>{trainingDays[selectedDay].day} · {trainingDays[selectedDay].exercise}</Text>
          </View>
          {renderCycleDay(selectedCycle, selectedDay)}
        </View>

        {/* 底部提示 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>第3周PR周全力突破，第4周减载周轻松恢复</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // 顶部标题区
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 14,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
    fontWeight: "400",
  },

  // 通用卡片
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCard: {
    backgroundColor: "#F3F0FF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#6A4C93",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  // 计划概要
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F3",
  },
  summaryRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    color: "#1C1C1E",
    fontWeight: "700",
  },

  // 重要说明
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 8,
  },
  infoBullet: {
    fontSize: 14,
    color: "#6A4C93",
    fontWeight: "700",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },

  // 周期卡片
  cycleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Tab 选择器
  tabSection: {
    marginBottom: 14,
  },
  tabSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    marginLeft: 2,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8ED",
  },
  tabButtonActive: {
    backgroundColor: "#6A4C93",
    borderColor: "#6A4C93",
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3C3C43",
  },
  tabButtonTextActive: {
    color: "#FFFFFF",
  },
  cycleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  cycleBadge: {
    backgroundColor: "#6A4C93",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cycleBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cycleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  // 训练频率
  scheduleCard: {
    backgroundColor: "#F7F6FA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6A4C93",
  },
  scheduleText: {
    fontSize: 13,
    color: "#3C3C43",
    marginBottom: 4,
    paddingLeft: 22,
  },
  scheduleNote: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 8,
    paddingLeft: 22,
    fontStyle: "italic",
  },

  // 训练日卡片
  exerciseCard: {
    backgroundColor: "#F7F6FA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E5",
    gap: 8,
  },
  dayText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6A4C93",
  },
  exerciseText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },

  // 周卡片
  weekCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  weekTypeBadge: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  weekTypePR: {
    backgroundColor: "#FFE8E8",
  },
  weekTypeDeload: {
    backgroundColor: "#E8F5E9",
  },
  weekTypeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6A4C93",
  },
  weekTypeTextPR: {
    color: "#FF3B30",
  },
  weekTypeTextDeload: {
    color: "#34C759",
  },

  // 组数
  setsContainer: {
    marginBottom: 8,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  setNumber: {
    fontSize: 13,
    color: "#8E8E93",
    width: 50,
  },
  weightText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
    flex: 1,
  },
  repsText: {
    fontSize: 13,
    color: "#6A4C93",
    fontWeight: "600",
    minWidth: 35,
    textAlign: "right",
  },
  prBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  prText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // 辅助训练
  bbbRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F3",
  },
  bbbLabel: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  bbbValue: {
    fontSize: 13,
    color: "#6A4C93",
    fontWeight: "600",
  },

  // 底部提示
  tipCard: {
    backgroundColor: "#6A4C93",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 20,
  },

  // 错误
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    color: "#8E8E93",
    fontSize: 16,
    textAlign: "center",
  },
});
