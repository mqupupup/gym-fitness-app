import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  GZCLP_PROGRAM,
  FiveRMs,
  getT1Weight,
  getT2Weight,
  ExerciseLevel,
} from "../../../src/data/gzclp-data";

const LEVEL_CONFIG: Record<
  ExerciseLevel,
  { label: string; color: string; bgColor: string; desc: string }
> = {
  T1: {
    label: "T1 主项",
    color: "#6A4C93",
    bgColor: "#F3F0FF",
    desc: "3×5+，最后一组尽力多做，每周递增 2.5kg",
  },
  T2: {
    label: "T2 辅助",
    color: "#7C5CFC",
    bgColor: "#F0ECFF",
    desc: "10×3，固定重量，全程不变",
  },
  T3: {
    label: "T3 自选",
    color: "#8E8E93",
    bgColor: "#F7F7F8",
    desc: "自选重量和次数，背部辅助动作",
  },
};

export default function GZCLPDayDetail() {
  const navigation = useNavigation();
  const { week, day, squat, bench, deadlift, press } = useLocalSearchParams();

  const weekNum = parseInt(String(week || "1"));
  const dayId = String(day || "day1");

  const fiveRMs: FiveRMs = {
    squat: parseFloat(squat as string) || 0,
    bench: parseFloat(bench as string) || 0,
    deadlift: parseFloat(deadlift as string) || 0,
    press: parseFloat(press as string) || 0,
  };

  const weekData = GZCLP_PROGRAM.find((w) => w.weekNumber === weekNum);
  const dayData = weekData?.days.find((d) => d.id === dayId);

  useLayoutEffect(() => {
    if (dayData) {
      navigation.setOptions({
        title: `第${weekNum}周 · ${dayData.dayOfWeek}`,
      });
    }
  }, [navigation, dayData, weekNum]);

  // 计算动作重量
  const getExerciseWeight = (exercise: any): string => {
    if (!exercise.liftKey) return "自选";
    const rm = fiveRMs[exercise.liftKey];
    if (!rm) return "—";
    if (exercise.level === "T1") {
      return `${getT1Weight(rm, weekNum)}kg`;
    }
    if (exercise.level === "T2") {
      return `${getT2Weight(rm)}kg`;
    }
    return "自选";
  };

  // 按级别分组
  const groupedExercises: Record<ExerciseLevel, any[]> = {
    T1: [],
    T2: [],
    T3: [],
  };
  dayData?.exercises.forEach((ex) => {
    groupedExercises[ex.level].push(ex);
  });

  if (!dayData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#8E8E93" />
          <Text style={styles.errorText}>未找到训练日数据</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 训练日头部 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="barbell-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {dayData.dayOfWeek} · {dayData.dateLabel}
            </Text>
            <Text style={styles.headerSubtitle}>
              第{weekNum}周 · {weekData?.title.replace(/^第\d+周[：:]/, "")}
            </Text>
          </View>
        </View>

        {/* 动作数量统计 */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{groupedExercises.T1.length}</Text>
            <Text style={styles.statLabel}>T1 主项</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{groupedExercises.T2.length}</Text>
            <Text style={styles.statLabel}>T2 辅助</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{groupedExercises.T3.length}</Text>
            <Text style={styles.statLabel}>T3 自选</Text>
          </View>
        </View>

        {/* 各级别动作 */}
        {(["T1", "T2", "T3"] as ExerciseLevel[]).map((level) => {
          const exercises = groupedExercises[level];
          if (exercises.length === 0) return null;
          const config = LEVEL_CONFIG[level];

          return (
            <View key={level} style={styles.levelSection}>
              <View style={styles.levelHeader}>
                <View
                  style={[styles.levelBadge, { backgroundColor: config.bgColor }]}
                >
                  <Text style={[styles.levelBadgeText, { color: config.color }]}>
                    {config.label}
                  </Text>
                </View>
                <Text style={styles.levelDesc}>{config.desc}</Text>
              </View>

              {exercises.map((exercise, idx) => {
                const weight = getExerciseWeight(exercise);
                return (
                  <View key={idx} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <View style={styles.exerciseIcon}>
                        <Ionicons
                          name={
                            exercise.level === "T1"
                              ? "flame-outline"
                              : exercise.level === "T2"
                              ? "fitness-outline"
                              : "body-outline"
                          }
                          size={18}
                          color={config.color}
                        />
                      </View>
                      <View style={styles.exerciseInfo}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        {exercise.note && (
                          <Text style={styles.exerciseNote}>{exercise.note}</Text>
                        )}
                      </View>
                      <View style={styles.weightBadge}>
                        <Text style={styles.weightText}>{weight}</Text>
                      </View>
                    </View>

                    {/* 组详情 */}
                    <View style={styles.setsContainer}>
                      {exercise.sets.map((set: any, setIdx: number) => (
                        <View key={setIdx} style={styles.setRow}>
                          <View style={styles.setInfo}>
                            <Text style={styles.setReps}>{set.reps}</Text>
                            {set.note && (
                              <Text style={styles.setNote}>{set.note}</Text>
                            )}
                          </View>
                          {exercise.liftKey && (
                            <Text style={styles.setWeight}>
                              {exercise.level === "T1"
                                ? `${getT1Weight(fiveRMs[exercise.liftKey], weekNum)}kg × ${set.reps}`
                                : exercise.level === "T2"
                                ? `${getT2Weight(fiveRMs[exercise.liftKey])}kg × ${set.reps}`
                                : "自选重量"}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* 底部提示 */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={16} color="#6A4C93" />
          <Text style={styles.tipText}>
            T1 最后一组尽力多做，记录实际完成次数；T2 严格按 10×3 执行，不要递增重量
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6A4C93",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#EDEDF0",
  },
  levelSection: {
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  levelDesc: {
    flex: 1,
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
  },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  exerciseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F7F6FA",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  exerciseNote: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
  },
  weightBadge: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  weightText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6A4C93",
  },
  setsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F3",
    paddingTop: 12,
    gap: 8,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F6FA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  setInfo: {
    flex: 1,
  },
  setReps: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  setNote: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  setWeight: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6A4C93",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F3F0FF",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: "#6A4C93",
    lineHeight: 18,
  },
});
