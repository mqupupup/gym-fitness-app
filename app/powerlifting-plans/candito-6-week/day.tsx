import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CANDITO_PROGRAM, OneRMKey, ExerciseSet } from "../../../src/data/candito-data";

export default function CanditoTrainingDay() {
  const navigation = useNavigation();
  const { weekId, dayId, squat, bench, deadlift } = useLocalSearchParams();

  const oneRMs: Record<OneRMKey, number> = {
    squat: parseFloat(squat as string) || 0,
    bench: parseFloat(bench as string) || 0,
    deadlift: parseFloat(deadlift as string) || 0,
  };

  const weekKey = String(weekId || "1");
  const dayKey = String(dayId || "");
  const weekData = CANDITO_PROGRAM[weekKey as keyof typeof CANDITO_PROGRAM];
  const dayData = weekData?.days.find((d) => d.id === dayKey);
  const isOptionPage = dayData?.dayOfWeek === "—";

  useLayoutEffect(() => {
    if (weekData) {
      navigation.setOptions({ title: `第${weekKey}周` });
    }
  }, [navigation, weekData, weekKey]);

  const calcWeight = (set: ExerciseSet): string => {
    if (!set.percentage || !set.oneRMKey || !oneRMs[set.oneRMKey]) return "";
    const weight = (oneRMs[set.oneRMKey] * set.percentage) / 100;
    return (Math.round(weight * 2) / 2).toFixed(1);
  };

  if (!weekData || !dayData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#8E8E93" />
          <Text style={styles.errorText}>未找到训练日数据</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ===== 第6周选项页特殊布局 =====
  if (isOptionPage) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="options-outline" size={24} color="#6A4C93" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerWeek}>{weekData.title}</Text>
              <Text style={styles.headerDay}>{weekData.focus}</Text>
              <Text style={styles.headerDesc}>{weekData.description}</Text>
            </View>
          </View>

          {/* 预估1RM公式说明 */}
          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>第5周极限组 → 预估1RM公式</Text>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaReps}>完成2次</Text>
              <Text style={styles.formulaArrow}>→</Text>
              <Text style={styles.formulaResult}>重量 × 1.03</Text>
            </View>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaReps}>完成3次</Text>
              <Text style={styles.formulaArrow}>→</Text>
              <Text style={styles.formulaResult}>重量 × 1.06</Text>
            </View>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaReps}>完成4次</Text>
              <Text style={styles.formulaArrow}>→</Text>
              <Text style={styles.formulaResult}>重量 × 1.09</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>三个选项</Text>
          {dayData.exercises.map((option, idx) => (
            <View key={idx} style={styles.optionCard}>
              <View style={styles.optionHeader}>
                <View style={styles.optionBadge}>
                  <Text style={styles.optionBadgeText}>{idx + 1}</Text>
                </View>
                <Text style={styles.optionName}>{option.name}</Text>
              </View>
              {option.note && (
                <Text style={styles.optionNote}>{option.note}</Text>
              )}
              <View style={styles.optionContent}>
                {option.sets.map((set, si) => (
                  <Text key={si} style={styles.optionDesc}>{set.reps}</Text>
                ))}
              </View>
            </View>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===== 普通训练日布局 =====
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="barbell-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerWeek}>{weekData.title.replace(/^第\d+周[：:]/, "")}</Text>
            <Text style={styles.headerDay}>
              {dayData.dayOfWeek} · {dayData.dateLabel}
            </Text>
          </View>
        </View>

        {/* 训练动作列表 */}
        {dayData.exercises.map((exercise, exIndex) => {
          const hasPercentage = exercise.sets.some((s) => s.percentage);
          const hasWarmup = exercise.sets.some((s) => s.reps === "热身" || s.reps === "—");
          const isAccessory = !hasPercentage && !hasWarmup;
          const isWarmup = exercise.name.includes("热身");

          return (
          <View key={exIndex} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {isAccessory && !isWarmup && (
                <View style={styles.accessoryTag}>
                  <Text style={styles.accessoryTagText}>自选重量</Text>
                </View>
              )}
              {isWarmup && (
                <View style={styles.warmupTag}>
                  <Text style={styles.warmupTagText}>热身</Text>
                </View>
              )}
            </View>
            {exercise.note && (
              <Text style={styles.exerciseNote}>{exercise.note}</Text>
            )}

            {/* 组列表 */}
            <View style={styles.setsList}>
              {exercise.sets.map((set, setIndex) => {
                const weight = calcWeight(set);
                const isSpecial = set.reps === "MR" || set.reps === "MR10";
                const setIsWarmup = set.reps === "热身" || set.reps === "—" || (set.note && set.note.includes("热身"));

                return (
                  <View key={setIndex} style={styles.setContainer}>
                    <View style={styles.setRow}>
                      <View style={styles.setLeft}>
                        {set.percentage ? (
                          <>
                            <View style={styles.percentageBadge}>
                              <Text style={styles.percentageText}>{set.percentage}%</Text>
                            </View>
                            {weight ? (
                              <Text style={styles.weightText}>{weight} kg</Text>
                            ) : null}
                          </>
                        ) : setIsWarmup ? (
                          <View style={[styles.percentageBadge, styles.warmupBadge]}>
                            <Text style={styles.warmupText}>热身</Text>
                          </View>
                        ) : (
                          <View style={[styles.percentageBadge, styles.accessoryBadge]}>
                            <Ionicons name="body-outline" size={14} color="#8E8E93" />
                          </View>
                        )}
                      </View>
                      <View style={styles.setRight}>
                        <Text style={[
                          styles.repsText,
                          isSpecial && styles.specialReps,
                        ]}>
                          {set.reps}
                          {set.count && set.count > 1 ? ` × ${set.count}组` : ""}
                        </Text>
                      </View>
                    </View>
                    {/* note 单独一行，避免和重量重叠 */}
                    {set.note && (
                      <Text style={styles.setNote}>{set.note}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
          );
        })}

        {/* 底部说明 */}
        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={16} color="#FFFFFF" />
          <Text style={styles.tipText}>
            MR = 力竭组尽可能多做；MR10 = 做到10次未力竭则停止
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FA",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    color: "#8E8E93",
    fontSize: 16,
  },
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
  headerWeek: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6A4C93",
    marginBottom: 2,
  },
  headerDay: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: -0.3,
  },
  headerDesc: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 4,
    lineHeight: 18,
  },
  // 选项页样式
  formulaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  formulaTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  formulaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  formulaReps: {
    fontSize: 13,
    color: "#3C3C43",
    width: 70,
  },
  formulaArrow: {
    fontSize: 13,
    color: "#8E8E93",
    marginHorizontal: 8,
  },
  formulaResult: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6A4C93",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6A4C93",
    alignItems: "center",
    justifyContent: "center",
  },
  optionBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  optionName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
    flex: 1,
  },
  optionNote: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 10,
    lineHeight: 17,
    backgroundColor: "#F7F6FA",
    padding: 8,
    borderRadius: 8,
  },
  optionContent: {
    backgroundColor: "#F7F6FA",
    borderRadius: 10,
    padding: 12,
  },
  optionDesc: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  // 训练动作样式
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
    flex: 1,
  },
  accessoryTag: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  accessoryTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6A4C93",
  },
  warmupTag: {
    backgroundColor: "#F0F0F3",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  warmupTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E8E93",
  },
  exerciseNote: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 12,
    lineHeight: 17,
    backgroundColor: "#F7F6FA",
    padding: 8,
    borderRadius: 8,
  },
  setsList: {
    gap: 8,
  },
  setContainer: {
    backgroundColor: "#F7F6FA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  setLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  percentageBadge: {
    backgroundColor: "#6A4C93",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 48,
    alignItems: "center",
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  warmupBadge: {
    backgroundColor: "#E8E8ED",
  },
  warmupText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
  },
  accessoryBadge: {
    backgroundColor: "#EDEDF0",
    minWidth: 28,
  },
  weightText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  setRight: {
    alignItems: "flex-end",
    flexShrink: 1,
    marginLeft: 8,
  },
  repsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C3C43",
  },
  specialReps: {
    color: "#FF3B30",
    fontWeight: "700",
  },
  setNote: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 6,
    lineHeight: 16,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6A4C93",
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginTop: 8,
  },
  tipText: {
    fontSize: 13,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    flex: 1,
  },
});
