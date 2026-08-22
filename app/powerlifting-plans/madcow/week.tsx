import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  generateMadcowProgram,
  getTopSetWeight,
  MadcowTestInputs,
  WeekPlan,
} from "../../../src/data/madcow-data";

const DAY_COLORS: Record<string, { bg: string; text: string }> = {
  monday: { bg: "#EDE7F6", text: "#6A4C93" },
  wednesday: { bg: "#E8F5E9", text: "#2E7D32" },
  friday: { bg: "#FFF3E0", text: "#E65100" },
};

export default function MadcowWeek() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [selectedWeek, setSelectedWeek] = useState(
    parseInt((params.week as string) || "1"),
  );

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
  const currentWeek: WeekPlan = program[selectedWeek - 1];

  useLayoutEffect(() => {
    navigation.setOptions({ title: `第${selectedWeek}周` });
  }, [navigation, selectedWeek]);

  const baseParams = new URLSearchParams({
    squat: String(inputs.squat),
    bench: String(inputs.bench),
    row: String(inputs.row),
    press: String(inputs.press),
    deadlift: String(inputs.deadlift),
  }).toString();

  const handleDayPress = (dayKey: string) => {
    router.push(
      `/powerlifting-plans/madcow/day?week=${selectedWeek}&day=${dayKey}&${baseParams}`,
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* 横向周切换器 */}
      <View style={styles.weekSelector}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekSelectorContent}
        >
          {program.map((w) => {
            const isActive = w.week === selectedWeek;
            const isPRWeek = w.week === 4;
            return (
              <Pressable
                key={w.week}
                style={[styles.weekTab, isActive && styles.weekTabActive]}
                onPress={() => setSelectedWeek(w.week)}
              >
                <Text style={[styles.weekTabText, isActive && styles.weekTabTextActive]}>
                  W{w.week}
                </Text>
                {isPRWeek && (
                  <Ionicons
                    name="trophy-outline"
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 阶段标签 */}
        <View style={styles.phaseBanner}>
          <Ionicons name="flag-outline" size={16} color="#6A4C93" />
          <Text style={styles.phaseText}>
            第{selectedWeek}周 · {currentWeek.phase}
          </Text>
          {selectedWeek === 4 && (
            <View style={styles.prTag}>
              <Text style={styles.prTagText}>PR匹配周</Text>
            </View>
          )}
        </View>

        {/* 3天训练卡片 */}
        {currentWeek.days.map((day) => {
          const color = DAY_COLORS[day.dayKey];
          const topExercises = day.exercises.slice(0, 3);
          return (
            <Pressable
              key={day.dayKey}
              style={({ pressed }) => [
                styles.dayCard,
                pressed && styles.dayCardPressed,
              ]}
              onPress={() => handleDayPress(day.dayKey)}
            >
              <View style={styles.dayHeader}>
                <View style={[styles.dayBadge, { backgroundColor: color.bg }]}>
                  <Text style={[styles.dayBadgeText, { color: color.text }]}>
                    {day.dayLabel}
                  </Text>
                </View>
                <View style={styles.dayHeaderText}>
                  <Text style={styles.dayWeekday}>{day.weekday}</Text>
                  <Text style={styles.dayExerciseCount}>
                    {day.exercises.length}个动作
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </View>

              <View style={styles.exerciseList}>
                {topExercises.map((ex) => {
                  const topWeight = getTopSetWeight(day, ex.key);
                  const hasIntensity = ex.sets.some((s) => s.isIntensitySet);
                  return (
                    <View key={ex.key} style={styles.exerciseRow}>
                      <View style={styles.exerciseDot}>
                        <View
                          style={[styles.dot, { backgroundColor: color.text }]}
                        />
                      </View>
                      <Text style={styles.exerciseName}>{ex.name}</Text>
                      <View style={styles.exerciseSets}>
                        <Text style={styles.exerciseSetInfo}>
                          {ex.sets.length}组
                        </Text>
                        {topWeight && (
                          <Text style={styles.exerciseWeight}>
                            {topWeight}kg
                          </Text>
                        )}
                        {hasIntensity && (
                          <View style={styles.intensityTag}>
                            <Text style={styles.intensityTagText}>1×3</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </Pressable>
          );
        })}

        {/* 底部提示 */}
        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={16} color="#6A4C93" />
          <Text style={styles.tipText}>
            {selectedWeek < 12
              ? `下周正式组重量将基于本周周五1×3强度组自动递增`
              : "12周计划已完成，建议测试新的1RM并重新开始计划"}
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
  weekSelector: {
    marginVertical: 12,
  },
  weekSelectorContent: {
    gap: 8,
    paddingRight: 4,
    paddingHorizontal: 16,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  phaseBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F0FF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  phaseText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#6A4C93",
  },
  prTag: {
    backgroundColor: "#FF9500",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  prTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dayCard: {
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
  dayCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  dayBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBadgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  dayHeaderText: {
    flex: 1,
  },
  dayWeekday: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  dayExerciseCount: {
    fontSize: 12,
    color: "#8E8E93",
  },
  exerciseList: {
    gap: 10,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  exerciseDot: {
    width: 16,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  exerciseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  exerciseSets: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exerciseSetInfo: {
    fontSize: 12,
    color: "#8E8E93",
  },
  exerciseWeight: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6A4C93",
    minWidth: 50,
    textAlign: "right",
  },
  intensityTag: {
    backgroundColor: "#FFF3E0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  intensityTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#E65100",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginTop: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#6B6B70",
    lineHeight: 18,
  },
});
