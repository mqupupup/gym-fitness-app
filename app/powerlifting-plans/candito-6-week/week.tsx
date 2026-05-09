// app/powerlifting-plans/candito-6-week/week.tsx

import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CANDITO_PROGRAM } from "./candito-data";

export default function CanditoWeekDetail() {
  const insets = useSafeAreaInsets();
  const { weekId } = useLocalSearchParams();

  const weekKey = String(weekId || "");
  const weekData = CANDITO_PROGRAM[weekKey as keyof typeof CANDITO_PROGRAM];

  if (!weekData) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>未找到第{weekKey}周数据</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.title}>{weekData.title}</Text>
        <Text style={styles.focus}>{weekData.focus}</Text>
        <Text style={styles.description}>{weekData.description}</Text>

        {weekData.days.map((day) => (
          <Link
            key={day.id}
            href={`/powerlifting-plans/candito-6-week/day?weekId=${weekKey}&dayId=${day.id}`}
            style={styles.dayCard}
          >
            {/* 日期标题 */}
            <View style={styles.dateHeader}>
              <Text style={styles.dateTitle}>{day.dateLabel}</Text>
            </View>

            {/* 训练动作列表 */}
            <View style={styles.exercisesContainer}>
              {day.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} style={styles.exerciseSection}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>

                  {/* 重量信息 */}
                  <View style={styles.setsContainer}>
                    {exercise.sets.map((set, setIndex) => (
                      <View key={setIndex} style={styles.setRow}>
                        {set.percentage && (
                          <Text style={styles.setPercentage}>
                            {set.percentage}
                          </Text>
                        )}
                        {set.percentage && set.reps && (
                          <Text style={styles.setX}>×</Text>
                        )}
                        {set.reps && (
                          <Text style={styles.setReps}>{set.reps}</Text>
                        )}
                        {set.count && set.count > 1 && (
                          <>
                            <Text style={styles.setX}>×</Text>
                            <Text style={styles.setCount}>{set.count}</Text>
                          </>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* 更多动作提示 */}
            {day.exercises.length > 3 && (
              <Text style={styles.moreExercises}>
                +{day.exercises.length - 3} 个更多动作
              </Text>
            )}
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  title: {
    color: "#1A365D",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  focus: {
    color: "#2B6CB0",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    color: "#4A5568",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  dayCard: {
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#C3DAF9",
    overflow: "hidden",
  },
  dateHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#C3DAF9",
  },
  dateTitle: {
    color: "#2B6CB0",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  exercisesContainer: {
    gap: 16,
  },
  exerciseSection: {
    gap: 8,
  },
  exerciseName: {
    color: "#1A365D",
    fontSize: 16,
    fontWeight: "700",
  },
  setsContainer: {
    gap: 8,
  },
  setRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  setPercentage: {
    fontSize: 14,
    color: "#2B6CB0",
    fontWeight: "600",
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  setX: {
    fontSize: 14,
    color: "#A0AEC0",
  },
  setReps: {
    fontSize: 14,
    color: "#1A365D",
    fontWeight: "600",
    backgroundColor: "#E6F7FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  setCount: {
    fontSize: 14,
    color: "#4A5568",
  },
  moreExercises: {
    color: "#A0AEC0",
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 12,
    textAlign: "center",
  },
});
