import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  GZCLP_PROGRAM,
  FiveRMs,
  getT1Weight,
  LIFT_NAMES,
} from "../../../src/data/gzclp-data";

export default function GZCLPWeekDetail() {
  const router = useRouter();
  const navigation = useNavigation();
  const { week, squat, bench, deadlift, press } = useLocalSearchParams();

  const [currentWeek, setCurrentWeek] = useState(parseInt(String(week || "1")));

  const fiveRMs: FiveRMs = {
    squat: parseFloat(squat as string) || 0,
    bench: parseFloat(bench as string) || 0,
    deadlift: parseFloat(deadlift as string) || 0,
    press: parseFloat(press as string) || 0,
  };

  const weekData = GZCLP_PROGRAM.find((w) => w.weekNumber === currentWeek);

  useLayoutEffect(() => {
    if (weekData) {
      navigation.setOptions({ title: `第${currentWeek}周` });
    }
  }, [navigation, weekData, currentWeek]);

  const getDayParams = (dayId: string) => {
    const params = new URLSearchParams({
      week: String(currentWeek),
      day: dayId,
      squat: String(fiveRMs.squat),
      bench: String(fiveRMs.bench),
      deadlift: String(fiveRMs.deadlift),
      press: String(fiveRMs.press),
    }).toString();
    return `/powerlifting-plans/gzclp/day?${params}`;
  };

  // 获取某天的T1主项和重量
  const getDayT1Info = (day: any) => {
    const t1Exercise = day.exercises.find((e: any) => e.level === "T1");
    if (!t1Exercise || !t1Exercise.liftKey) return null;
    const weight = getT1Weight(fiveRMs[t1Exercise.liftKey], currentWeek);
    return {
      name: t1Exercise.name,
      weight,
      reps: t1Exercise.sets[0]?.reps || "3×5+",
    };
  };

  if (!weekData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#8E8E93" />
          <Text style={styles.errorText}>未找到第{currentWeek}周数据</Text>
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
        {/* 周切换器 */}
        <View style={styles.weekSelector}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekSelectorContent}
          >
            {GZCLP_PROGRAM.map((w) => {
              const isActive = currentWeek === w.weekNumber;
              return (
                <Pressable
                  key={w.id}
                  style={[styles.weekTab, isActive && styles.weekTabActive]}
                  onPress={() => setCurrentWeek(w.weekNumber)}
                >
                  <Text style={[styles.weekTabText, isActive && styles.weekTabTextActive]}>
                    W{w.weekNumber}
                  </Text>
                  {w.isResetWeek && (
                    <Ionicons
                      name="refresh-outline"
                      size={10}
                      color={isActive ? "#FFFFFF" : "#FF9500"}
                      style={{ marginTop: 1 }}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 周标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="calendar-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {weekData.title.replace(/^第\d+周[：:]/, "")}
            </Text>
            <Text style={styles.headerDesc}>{weekData.description}</Text>
          </View>
        </View>

        {/* 5RM概览 */}
        <View style={styles.summaryCard}>
          {(["squat", "bench", "deadlift", "press"] as const).map((key) => (
            <View key={key} style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>
                {key === "press" ? "推举" : LIFT_NAMES[key]}
              </Text>
              <Text style={styles.summaryValue}>{fiveRMs[key]}kg</Text>
            </View>
          ))}
        </View>

        {/* Reset提示 */}
        {weekData.isResetWeek && (
          <View style={styles.resetCard}>
            <Ionicons name="refresh-outline" size={16} color="#FF9500" />
            <Text style={styles.resetText}>
              如 T1 无法完成 3×5+，可降低 10-15% 重量重新线性进阶
            </Text>
          </View>
        )}

        {/* 训练日列表 */}
        <Text style={styles.sectionTitle}>本周训练日</Text>
        {weekData.days.map((day) => {
          const t1Info = getDayT1Info(day);
          return (
            <Pressable
              key={day.id}
              style={({ pressed }) => [
                styles.dayCard,
                pressed && styles.dayCardPressed,
              ]}
              onPress={() => router.push(getDayParams(day.id))}
            >
              <View style={styles.dayHeader}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{day.dayOfWeek}</Text>
                </View>
                <Text style={styles.dayLabel}>{day.dateLabel}</Text>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </View>

              {t1Info && (
                <View style={styles.t1Preview}>
                  <View style={styles.t1Tag}>
                    <Text style={styles.t1TagText}>T1</Text>
                  </View>
                  <Text style={styles.t1Name}>{t1Info.name}</Text>
                  <Text style={styles.t1Weight}>{t1Info.weight}kg</Text>
                  <Text style={styles.t1Reps}>{t1Info.reps}</Text>
                </View>
              )}

              <View style={styles.exercisesPreview}>
                {day.exercises.map((ex, i) => (
                  <View key={i} style={styles.exPreviewItem}>
                    <View
                      style={[
                        styles.levelDot,
                        ex.level === "T1" && styles.levelT1,
                        ex.level === "T2" && styles.levelT2,
                        ex.level === "T3" && styles.levelT3,
                      ]}
                    />
                    <Text style={styles.exPreviewName} numberOfLines={1}>
                      {ex.name}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}

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
  weekSelector: {
    marginVertical: 12,
  },
  weekSelectorContent: {
    gap: 8,
    paddingRight: 4,
  },
  weekTab: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 48,
    borderWidth: 1.5,
    borderColor: "#E8E8ED",
    flexDirection: "row",
    gap: 4,
  },
  weekTabActive: {
    backgroundColor: "#6A4C93",
    borderColor: "#6A4C93",
  },
  weekTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3C3C43",
  },
  weekTabTextActive: {
    color: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
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
  headerDesc: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  resetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  resetText: {
    fontSize: 12,
    color: "#B25A00",
    flex: 1,
    lineHeight: 16,
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
  dayCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  t1Preview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F6FA",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8,
  },
  t1Tag: {
    backgroundColor: "#6A4C93",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  t1TagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  t1Name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    flex: 1,
  },
  t1Weight: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6A4C93",
  },
  t1Reps: {
    fontSize: 12,
    color: "#8E8E93",
    minWidth: 40,
    textAlign: "right",
  },
  exercisesPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exPreviewItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F6FA",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 5,
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C7C7CC",
  },
  levelT1: {
    backgroundColor: "#6A4C93",
  },
  levelT2: {
    backgroundColor: "#7C5CFC",
  },
  levelT3: {
    backgroundColor: "#C7C7CC",
  },
  exPreviewName: {
    fontSize: 12,
    color: "#3C3C43",
    maxWidth: 100,
  },
});
