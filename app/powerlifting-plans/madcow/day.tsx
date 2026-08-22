import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  DayPlan,
  generateMadcowProgram,
  MadcowTestInputs,
} from "../../../src/data/madcow-data";

const DAY_TITLES: Record<string, string> = {
  monday: "周一 · 正式组日",
  wednesday: "周三 · 轻量恢复日",
  friday: "周五 · 强度突破日",
};

export default function MadcowDay() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  const week = parseInt((params.week as string) || "1");
  const dayKey = (params.day as string) || "monday";

  const inputs: MadcowTestInputs = useMemo(
    () => ({
      squat: parseFloat((params.squat as string) || "0"),
      bench: parseFloat((params.bench as string) || "0"),
      row: parseFloat((params.row as string) || "0"),
      press: parseFloat((params.press as string) || "0"),
      deadlift: parseFloat((params.deadlift as string) || "0"),
    }),
    [params.squat, params.bench, params.row, params.press, params.deadlift],
  );

  const program = useMemo(() => generateMadcowProgram(inputs), [inputs]);
  const day: DayPlan | undefined = program[week - 1]?.days.find(
    (d) => d.dayKey === dayKey,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `第${week}周 · ${day?.dayLabel || ""}`,
    });
  }, [navigation, week, day]);

  if (!day) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>未找到训练日数据</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 训练日标题 */}
        <View style={styles.dayHeader}>
          <View style={styles.dayIcon}>
            <Ionicons name="barbell-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.dayHeaderText}>
            <Text style={styles.dayTitle}>{DAY_TITLES[dayKey]}</Text>
            <Text style={styles.daySubtitle}>
              {day.exercises.length}个动作 · 第{week}周
            </Text>
          </View>
        </View>

        {/* 动作列表 */}
        {day.exercises.map((exercise, exIndex) => (
          <View key={exercise.key} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseNum}>
                <Text style={styles.exerciseNumText}>{exIndex + 1}</Text>
              </View>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseSetCount}>
                <Text style={styles.exerciseSetCountText}>
                  {exercise.sets.length}组
                </Text>
              </View>
            </View>

            {/* 组详情表格 */}
            <View style={styles.setsTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tableColNum, styles.tableHeaderText]}>组</Text>
                <Text style={[styles.tableCell, styles.tableColReps, styles.tableHeaderText]}>次数</Text>
                <Text style={[styles.tableCell, styles.tableColWeight, styles.tableHeaderText]}>重量</Text>
                <Text style={[styles.tableCell, styles.tableColType, styles.tableHeaderText]}>类型</Text>
              </View>
              {exercise.sets.map((set) => {
                const isTop = set.isTopSet;
                const isIntensity = set.isIntensitySet;
                const isVolume = set.isVolumeSet;
                let typeLabel = "热身";
                let typeStyle = styles.typeWarmup;
                if (isTop) {
                  typeLabel = "正式组";
                  typeStyle = styles.typeTop;
                } else if (isIntensity) {
                  typeLabel = "强度组";
                  typeStyle = styles.typeIntensity;
                } else if (isVolume) {
                  typeLabel = "容量组";
                  typeStyle = styles.typeVolume;
                }
                return (
                  <View
                    key={set.setNumber}
                    style={[
                      styles.tableRow,
                      (isTop || isIntensity) && styles.tableRowHighlight,
                    ]}
                  >
                    <Text style={[styles.tableCell, styles.tableColNum, styles.tableSetNum]}>
                      {set.setNumber}
                    </Text>
                    <Text style={[styles.tableCell, styles.tableColReps, styles.tableReps]}>
                      {set.reps}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.tableColWeight,
                        styles.tableWeight,
                        (isTop || isIntensity) && styles.tableWeightHighlight,
                      ]}
                    >
                      {set.weight}kg
                    </Text>
                    <View style={[styles.tableCell, styles.tableColType, styles.typeContainer]}>
                      <View style={[styles.typeBadge, typeStyle]}>
                        <Text style={styles.typeBadgeText}>{typeLabel}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* 训练提示 */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="information-circle-outline" size={16} color="#6A4C93" />
            <Text style={styles.tipTitle}>训练提示</Text>
          </View>
          {dayKey === "monday" && (
            <Text style={styles.tipText}>
              今天是正式组日，前4组为递增热身组，最后1组为正式组。正式组要全力以赴，但保持动作标准。
            </Text>
          )}
          {dayKey === "wednesday" && (
            <Text style={styles.tipText}>
              今天是轻量恢复日，深蹲只做热身组不加重，推举和硬拉完成4组即可。重点是恢复和技术练习。
            </Text>
          )}
          {dayKey === "friday" && (
            <Text style={styles.tipText}>
              今天是强度突破日，第5组1×3为强度组（比周一正式组重2.5%），第6组1×8为容量组（用第3组重量）。下周周一正式组将使用今天的1×3重量。
            </Text>
          )}
          <View style={styles.tipDivider} />
          <Text style={styles.tipText}>
            所有重量已按2.5kg最小杠铃片取整。组间休息建议：热身组60-90秒，正式组/强度组3-5分钟。
          </Text>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 14,
  },
  dayIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  dayHeaderText: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  daySubtitle: {
    fontSize: 13,
    color: "#8E8E93",
  },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  exerciseNum: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#6A4C93",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseNumText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  exerciseSetCount: {
    backgroundColor: "#F2F2F7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  exerciseSetCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
  },
  setsTable: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F3",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F7F6FA",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F3",
    alignItems: "center",
  },
  tableRowHighlight: {
    backgroundColor: "#F9F7FF",
  },
  tableCell: {
    fontSize: 14,
    color: "#1C1C1E",
  },
  tableColNum: {
    width: 30,
    textAlign: "center",
  },
  tableColReps: {
    width: 50,
    textAlign: "center",
  },
  tableColWeight: {
    flex: 1,
    textAlign: "left",
  },
  tableColType: {
    width: 60,
    alignItems: "flex-end",
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
  },
  tableSetNum: {
    fontWeight: "600",
    color: "#8E8E93",
  },
  tableReps: {
    fontWeight: "500",
  },
  tableWeight: {
    fontWeight: "600",
  },
  tableWeightHighlight: {
    color: "#6A4C93",
    fontWeight: "700",
    fontSize: 15,
  },
  typeContainer: {
    width: 60,
    alignItems: "flex-end",
  },
  typeBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  typeWarmup: {
    backgroundColor: "#F2F2F7",
  },
  typeTop: {
    backgroundColor: "#EDE7F6",
  },
  typeIntensity: {
    backgroundColor: "#FFF3E0",
  },
  typeVolume: {
    backgroundColor: "#E8F5E9",
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  tipText: {
    fontSize: 13,
    color: "#6B6B70",
    lineHeight: 20,
    marginBottom: 8,
  },
  tipDivider: {
    height: 1,
    backgroundColor: "#F0F0F3",
    marginVertical: 8,
  },
});
