import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import type { DayPlan } from "../../../../../src/lib/madcow-calculator";

export default function MadcowDaySession() {
  const { week, day } = useLocalSearchParams<{ week: string; day: string }>();
  const router = useRouter();
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>(
    {},
  );

  // Rest timer state
  const [resting, setResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(120);
  const [totalRestTime] = useState(120);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    const raw = await AsyncStorage.getItem("madcow_plan");
    if (!raw) return;
    const plan: DayPlan[][] = JSON.parse(raw);
    const weekIndex = parseInt(week) - 1;
    const dayIndex = ["Monday", "Wednesday", "Friday"].indexOf(day);
    if (plan[weekIndex]?.[dayIndex]) {
      setDayPlan(plan[weekIndex][dayIndex]);
    }
  };

  // Load saved rest time preference
  useEffect(() => {
    (async () => {
      const cfg = await AsyncStorage.getItem("trainingConfig");
      if (cfg) {
        const parsed = JSON.parse(cfg);
        setRestSeconds(parsed.restTime || 120);
      }
    })();
  }, []);

  const toggleSet = (exerciseIdx: number, setIdx: number) => {
    const key = `${exerciseIdx}-${setIdx}`;
    const next = { ...completedSets, [key]: !completedSets[key] };
    setCompletedSets(next);

    // Start rest when completing a set (not un-completing)
    if (!completedSets[key]) {
      startRest();
    }
  };

  const startRest = () => {
    setResting(true);
    setRestSeconds(totalRestTime);
    progressAnim.setValue(0);
  };

  const stopRest = () => {
    setResting(false);
    Vibration.cancel();
  };

  // Timer effect
  useEffect(() => {
    if (!resting || restSeconds <= 0) return;
    const interval = setInterval(() => {
      setRestSeconds((prev) => {
        const next = prev - 1;
        Animated.timing(progressAnim, {
          toValue: ((totalRestTime - next) / totalRestTime) * 100,
          duration: 1000,
          useNativeDriver: false,
        }).start();
        if (next <= 10 && next > 0) Vibration.vibrate([0, 80, 80, 80]);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resting, restSeconds, totalRestTime]);

  useEffect(() => {
    if (restSeconds === 0 && resting) {
      Vibration.vibrate([0, 300, 200, 300]);
      setResting(false);
      progressAnim.setValue(0);
    }
  }, [restSeconds, resting]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if (!dayPlan) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Week {week} · {day}
        </Text>
        <Text style={styles.headerSub}>{dayPlan.dayLabel} Session</Text>
      </View>

      {resting && (
        <View style={styles.timerBanner}>
          <Text style={styles.timerText}>{formatTime(restSeconds)}</Text>
          <Animated.View
            style={[
              styles.timerBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
          <TouchableOpacity onPress={stopRest} style={styles.stopBtn}>
            <Text style={styles.stopBtnText}>⏸ Skip Rest</Text>
          </TouchableOpacity>
        </View>
      )}

      {dayPlan.exercises.map((exercise, eIdx) => (
        <View key={eIdx} style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>

          <View style={styles.setRowHeader}>
            <Text style={[styles.setHeaderCell, { flex: 1 }]}>SET</Text>
            <Text style={[styles.setHeaderCell, { flex: 2 }]}>WEIGHT</Text>
            <Text style={[styles.setHeaderCell, { flex: 1 }]}>REPS</Text>
            <Text style={[styles.setHeaderCell, { flex: 1 }]}>✓</Text>
          </View>

          {exercise.sets.map((set, sIdx) => {
            const key = `${eIdx}-${sIdx}`;
            const done = !!completedSets[key];
            const isHeavyTriple =
              set.reps === 3 && sIdx === exercise.sets.length - 2;
            const isBackoff =
              set.reps === 8 && sIdx === exercise.sets.length - 1;

            return (
              <TouchableOpacity
                key={sIdx}
                style={[
                  styles.setRow,
                  done && styles.setRowDone,
                  isHeavyTriple && !done && styles.setRowHeavy,
                  isBackoff && !done && styles.setRowBackoff,
                ]}
                onPress={() => toggleSet(eIdx, sIdx)}
              >
                <Text style={[styles.setCell, { flex: 1 }]}>
                  {set.setNumber}
                </Text>
                <Text style={[styles.setCell, { flex: 2, fontWeight: "bold" }]}>
                  {set.weight}kg
                </Text>
                <Text style={[styles.setCell, { flex: 1 }]}>
                  {isHeavyTriple ? "3" : isBackoff ? "8" : set.reps}
                </Text>
                <Text style={[styles.setCell, { flex: 1 }]}>
                  {done ? "✅" : "○"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Finish button */}
      <TouchableOpacity style={styles.finishBtn} onPress={() => router.back()}>
        <Text style={styles.finishBtnText}>✅ Complete Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f8f9fa", paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 20, paddingTop: 10 },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#333" },
  headerSub: { fontSize: 16, color: "#888", marginTop: 4 },
  timerBanner: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
    overflow: "hidden",
  },
  timerText: {
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#dc3545",
  },
  timerBar: {
    height: 4,
    backgroundColor: "#dc3545",
    alignSelf: "stretch",
    marginTop: 8,
    borderRadius: 2,
  },
  stopBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "#ffc107",
    borderRadius: 8,
  },
  stopBtnText: { fontWeight: "bold", color: "#333" },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  setRowHeader: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  setHeaderCell: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 2,
  },
  setRowDone: { backgroundColor: "#d4edda" },
  setRowHeavy: { backgroundColor: "#fff3cd" },
  setRowBackoff: { backgroundColor: "#e7f3ff" },
  setCell: { fontSize: 16, textAlign: "center", color: "#333" },
  finishBtn: {
    backgroundColor: "#28a745",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  finishBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
