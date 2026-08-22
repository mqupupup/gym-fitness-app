import { Link, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CANDITO_PROGRAM, OneRMKey } from "../../../src/data/candito-data";

const ALL_WEEKS = ["1", "2", "3", "4", "5", "6"];

export default function CanditoWeekDetail() {
  const navigation = useNavigation();
  const { weekId, squat, bench, deadlift } = useLocalSearchParams();
  const [currentWeek, setCurrentWeek] = useState(String(weekId || "1"));

  const oneRMs: Record<OneRMKey, number> = {
    squat: parseFloat(squat as string) || 0,
    bench: parseFloat(bench as string) || 0,
    deadlift: parseFloat(deadlift as string) || 0,
  };

  const weekKey = currentWeek;
  const weekData = CANDITO_PROGRAM[weekKey as keyof typeof CANDITO_PROGRAM];

  useLayoutEffect(() => {
    if (weekData) {
      navigation.setOptions({ title: weekData.title });
    }
  }, [navigation, weekData]);

  const calcWeight = (percentage?: number, oneRMKey?: OneRMKey): string => {
    if (!percentage || !oneRMKey || !oneRMs[oneRMKey]) return "";
    const weight = (oneRMs[oneRMKey] * percentage) / 100;
    return (Math.round(weight * 2) / 2).toFixed(1);
  };

  const getDayParams = (dayId: string) => {
    const params = new URLSearchParams({
      weekId: weekKey,
      dayId,
      squat: String(oneRMs.squat),
      bench: String(oneRMs.bench),
      deadlift: String(oneRMs.deadlift),
    }).toString();
    return `/powerlifting-plans/candito-6-week/day?${params}`;
  };

  if (!weekData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#8E8E93" />
          <Text style={styles.errorText}>未找到第{weekKey}周数据</Text>
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
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="calendar-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{weekData.title}</Text>
            <Text style={styles.headerFocus}>{weekData.focus}</Text>
            <Text style={styles.headerDesc}>{weekData.description}</Text>
          </View>
        </View>

        {/* 1RM 概览 */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>深蹲</Text>
              <Text style={styles.summaryValue}>{oneRMs.squat}kg</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>卧推</Text>
              <Text style={styles.summaryValue}>{oneRMs.bench}kg</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>硬拉</Text>
              <Text style={styles.summaryValue}>{oneRMs.deadlift}kg</Text>
            </View>
          </View>
        </View>

        {/* 周切换器 */}
        <View style={styles.weekSelector}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekSelectorContent}
          >
            {ALL_WEEKS.map((w) => {
              const wData = CANDITO_PROGRAM[w as keyof typeof CANDITO_PROGRAM];
              const isActive = currentWeek === w;
              return (
                <Pressable
                  key={w}
                  style={[styles.weekTab, isActive && styles.weekTabActive]}
                  onPress={() => setCurrentWeek(w)}
                >
                  <Text style={[styles.weekTabText, isActive && styles.weekTabTextActive]}>
                    第{w}周
                  </Text>
                  <Text style={[styles.weekTabSub, isActive && styles.weekTabSubActive]}>
                    {wData?.days.length}天
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 训练日列表 */}
        <Text style={styles.sectionTitle}>训练日</Text>
        {weekData.days.map((day) => (
          <Link
            key={day.id}
            href={getDayParams(day.id)}
            style={styles.dayCard}
          >
            <View style={styles.dayHeader}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{day.dayOfWeek}</Text>
              </View>
              <Text style={styles.dayLabel}>{day.dateLabel}</Text>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </View>

            <View style={styles.exercisesPreview}>
              {day.exercises.slice(0, 4).map((exercise, i) => {
                const mainSet = exercise.sets.find(s => s.percentage);
                const weight = calcWeight(mainSet?.percentage, mainSet?.oneRMKey);
                return (
                  <View key={i} style={styles.exercisePreviewItem}>
                    <Text style={styles.exercisePreviewName} numberOfLines={1}>
                      {exercise.name}
                    </Text>
                    {weight ? (
                      <Text style={styles.exercisePreviewWeight}>{weight}kg</Text>
                    ) : (
                      <Text style={styles.exercisePreviewReps}>
                        {mainSet?.reps || "—"}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {day.exercises.length > 4 && (
              <Text style={styles.moreExercises}>
                +{day.exercises.length - 4} 个更多动作
              </Text>
            )}
          </Link>
        ))}

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
    alignItems: "flex-start",
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
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  headerFocus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6A4C93",
    marginBottom: 4,
  },
  headerDesc: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E8E8ED",
  },
  // 周切换器
  weekSelector: {
    marginBottom: 16,
  },
  weekSelectorContent: {
    gap: 8,
    paddingRight: 4,
  },
  weekTab: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 72,
    borderWidth: 1.5,
    borderColor: "#E8E8ED",
  },
  weekTabActive: {
    backgroundColor: "#6A4C93",
    borderColor: "#6A4C93",
  },
  weekTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3C3C43",
    marginBottom: 2,
  },
  weekTabTextActive: {
    color: "#FFFFFF",
  },
  weekTabSub: {
    fontSize: 11,
    color: "#8E8E93",
  },
  weekTabSubActive: {
    color: "rgba(255,255,255,0.8)",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  dayCard: {
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
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F3",
    gap: 10,
  },
  dayBadge: {
    backgroundColor: "#6A4C93",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dayLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  exercisesPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exercisePreviewItem: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F6FA",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  exercisePreviewName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#3C3C43",
    flex: 1,
  },
  exercisePreviewWeight: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6A4C93",
    marginLeft: 6,
  },
  exercisePreviewReps: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E8E93",
    marginLeft: 6,
  },
  moreExercises: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 10,
    textAlign: "center",
  },
});
