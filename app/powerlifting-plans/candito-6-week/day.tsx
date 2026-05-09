// app/powerlifting-plans/candito-6-week/day.tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TrainingLogCard } from "../../../src/components/TrainingLogCard";
import { useTrainingLog } from "../../../src/hooks/useTrainingLog";
import { CANDITO_PROGRAM } from "./candito-data";

export default function CanditoTrainingDay() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { weekId, dayId } = useLocalSearchParams();

  const weekIdStr = String(weekId || "");
  const dayIdStr = String(dayId || "");
  const [showAllHistory, setShowAllHistory] = useState(false);
  // 使用useMemo稳定weekData和dayData
  const [weekData, dayData] = useMemo(() => {
    if (!weekIdStr || !dayIdStr) return [null, null];

    const week = CANDITO_PROGRAM[weekIdStr as keyof typeof CANDITO_PROGRAM];
    if (!week) return [null, null];

    const day = week.days.find((d) => String(d.id) === dayIdStr);
    return [week, day];
  }, [weekIdStr, dayIdStr]);

  const {
    logs,
    loading: logsLoading,
    saveLog,
    getLogsByExercise,
    deleteLog,
  } = useTrainingLog();
  const [exerciseLogs, setExerciseLogs] = useState<
    Record<
      string,
      {
        weight: string;
        reps: string;
        notes: string;
      }
    >
  >({});
  const [savingLogId, setSavingLogId] = useState<string | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);
  const [today] = useState(() => new Date().toISOString().split("T")[0]);

  // 1. 初始化训练记录 - 使用函数式更新，避免依赖问题
  useEffect(() => {
    if (dayData?.exercises) {
      setExerciseLogs((prevLogs) => {
        // 如果已经初始化过，不再重新初始化
        if (Object.keys(prevLogs).length > 0) {
          return prevLogs;
        }

        const initialLogs: Record<
          string,
          { weight: string; reps: string; notes: string }
        > = {};

        dayData.exercises.forEach((exercise, exerciseIndex) => {
          const exerciseName = `${exercise.name}_${exerciseIndex}`;
          initialLogs[exerciseName] = {
            weight: "",
            reps: "",
            notes: "",
          };
        });

        return initialLogs;
      });
    }
  }, [dayData]); // 只依赖dayData，不依赖setExerciseLogs

  // 2. 加载历史记录 - 优化依赖数组
  useEffect(() => {
    if (
      dayData?.exercises &&
      !logsLoading &&
      Object.keys(exerciseLogs).length > 0
    ) {
      let isMounted = true;

      const loadHistoricalData = async () => {
        try {
          const historicalUpdates: Record<
            string,
            { weight: string; reps: string; notes: string }
          > = {};

          for (const [exerciseName, logData] of Object.entries(exerciseLogs)) {
            const exerciseIndex = parseInt(
              exerciseName.split("_").pop() || "0",
            );
            const exercise = dayData.exercises[exerciseIndex];

            if (exercise) {
              const exerciseLogsHistory = getLogsByExercise(exercise.name);
              const todayLog = exerciseLogsHistory.find(
                (log) => log.date === today,
              );

              if (todayLog && isMounted) {
                historicalUpdates[exerciseName] = {
                  weight: todayLog.weight.toString(),
                  reps: todayLog.reps.toString(),
                  notes: todayLog.notes || "",
                };
              }
            }
          }

          if (Object.keys(historicalUpdates).length > 0 && isMounted) {
            setExerciseLogs((prev) => ({
              ...prev,
              ...historicalUpdates,
            }));
          }
        } catch (error) {
          console.error("加载历史记录失败:", error);
        }
      };

      loadHistoricalData();

      return () => {
        isMounted = false;
      };
    }
  }, [dayData, logsLoading, today, getLogsByExercise]); // 优化依赖数组

  // 3. 使用useCallback稳定回调函数
  const handleInputChange = useCallback(
    (
      exerciseName: string,
      field: "weight" | "reps" | "notes",
      value: string,
    ) => {
      setExerciseLogs((prev) => ({
        ...prev,
        [exerciseName]: {
          ...prev[exerciseName],
          [field]: value,
        },
      }));
    },
    [],
  );

  const handleSaveLog = useCallback(
    async (exerciseName: string, exerciseIndex: number) => {
      if (!dayData || !weekData) return;

      const exercise = dayData.exercises[exerciseIndex];
      const logData = exerciseLogs[exerciseName];

      if (!logData.weight || !logData.reps) {
        Alert.alert("提示", "请填写重量和次数");
        return;
      }

      const weight = parseFloat(logData.weight);
      const reps = parseInt(logData.reps);

      if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
        Alert.alert("提示", "请输入有效的重量和次数");
        return;
      }

      setSavingLogId(exerciseName);

      try {
        const success = await saveLog({
          date: today,
          exercise: exercise.name,
          weight,
          reps,
          notes: `${logData.notes || ""} | 计划: ${weekData.title} | ${dayData.dateLabel}`,
        });

        if (success) {
          Alert.alert("成功", "训练记录已保存！");
          // 重置输入
          setExerciseLogs((prev) => ({
            ...prev,
            [exerciseName]: {
              weight: weight.toString(),
              reps: reps.toString(),
              notes: logData.notes,
            },
          }));
        } else {
          Alert.alert("失败", "保存训练记录失败");
        }
      } catch (error) {
        console.error("保存日志失败:", error);
        Alert.alert("错误", "保存训练记录时发生错误");
      } finally {
        setSavingLogId(null);
      }
    },
    [dayData, weekData, exerciseLogs, saveLog, today],
  );

  const handleDeleteLog = useCallback(
    async (id: string) => {
      setDeletingLogId(id);
      try {
        await deleteLog(id);
      } finally {
        setDeletingLogId(null);
      }
    },
    [deleteLog],
  );

  // 4. 使用useMemo优化todayLogs计算
  const todayLogs = useMemo(() => {
    if (!dayData) return [];

    return logs.filter(
      (log) =>
        log.date === today &&
        dayData.exercises.some((exercise) =>
          log.exercise.includes(exercise.name),
        ),
    );
  }, [logs, dayData, today]);

  if (!weekData || !dayData) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>未找到训练日数据</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.weekTitle}>{weekData.title}</Text>
        <Text style={styles.dayTitle}>{dayData.dateLabel}</Text>

        {/* 今日训练记录概览 */}
        {todayLogs.length > 0 && (
          <View style={styles.logsSummary}>
            <Text style={styles.logsTitle}>
              今日已完成 {todayLogs.length} 个动作
            </Text>
            <View style={styles.logsGrid}>
              {todayLogs.slice(0, 3).map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <Text style={styles.logExercise}>{log.exercise}</Text>
                  <Text style={styles.logStats}>
                    {log.weight}kg × {log.reps}
                  </Text>
                </View>
              ))}
              {todayLogs.length > 3 && (
                <TouchableOpacity
                  style={styles.seeMore}
                  onPress={() =>
                    router.push(`/powerlifting-plans/candito-6-week/logs`)
                  }
                >
                  <Text style={styles.seeMoreText}>
                    查看全部 ({todayLogs.length})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* 训练动作列表 */}
        {dayData.exercises.map((exercise, exerciseIndex) => {
          const exerciseName = `${exercise.name}_${exerciseIndex}`;
          const logData = exerciseLogs[exerciseName] || {
            weight: "",
            reps: "",
            notes: "",
          };
          const isSaving = savingLogId === exerciseName;
          const exerciseHistory = getLogsByExercise(exercise.name);
          const displayedLogs = showAllHistory
            ? exerciseHistory
            : exerciseHistory.slice(0, 2);

          return (
            <View key={exerciseIndex} style={styles.exerciseCard}>
              <Text style={styles.exerciseTitle}>{exercise.name}</Text>

              {/* 计划要求 */}
              <View style={styles.planContainer}>
                <Text style={styles.planLabel}>计划要求:</Text>
                {exercise.sets.map((set, setIndex) => (
                  <View key={setIndex} style={styles.setRow}>
                    {set.percentage && (
                      <Text style={styles.planPercentage}>
                        {set.percentage}
                      </Text>
                    )}
                    {set.percentage && set.reps && (
                      <Text style={styles.planX}>×</Text>
                    )}
                    {set.reps && (
                      <Text style={styles.planReps}>{set.reps}</Text>
                    )}
                    {set.count && set.count > 1 && (
                      <>
                        <Text style={styles.planX}>×</Text>
                        <Text style={styles.planCount}>{set.count}</Text>
                      </>
                    )}
                  </View>
                ))}
              </View>

              {/* 实际完成 */}
              <View style={styles.actualContainer}>
                <Text style={styles.actualLabel}>实际完成:</Text>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>重量 (kg)</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      placeholder="0"
                      value={logData.weight}
                      onChangeText={(value) =>
                        handleInputChange(exerciseName, "weight", value)
                      }
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>次数</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      placeholder="0"
                      value={logData.reps}
                      onChangeText={(value) =>
                        handleInputChange(exerciseName, "reps", value)
                      }
                    />
                  </View>
                </View>

                <View style={styles.notesContainer}>
                  <Text style={styles.inputLabel}>备注</Text>
                  <TextInput
                    style={[styles.input, styles.notesInput]}
                    placeholder="输入备注（可选）"
                    value={logData.notes}
                    onChangeText={(value) =>
                      handleInputChange(exerciseName, "notes", value)
                    }
                    multiline
                    numberOfLines={2}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isSaving && styles.saveButtonDisabled,
                  ]}
                  onPress={() => handleSaveLog(exerciseName, exerciseIndex)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      {exerciseHistory.some((log) => log.date === today)
                        ? "更新记录"
                        : "保存记录"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* 历史记录 */}
              {exerciseHistory.length > 0 && (
                <View style={styles.historyContainer}>
                  <Text style={styles.historyTitle}>历史记录:</Text>
                  {displayedLogs.map((log) => (
                    <TrainingLogCard
                      key={log.id}
                      log={log}
                      onDelete={handleDeleteLog}
                      showDelete={deletingLogId !== log.id}
                    />
                  ))}
                  {exerciseHistory.length > 2 && (
                    <TouchableOpacity
                      style={styles.seeHistoryButton}
                      onPress={() => setShowAllHistory(!showAllHistory)}
                    >
                      <Text style={styles.seeHistoryText}>
                        {showAllHistory
                          ? "收起历史"
                          : `查看全部历史 (${exerciseHistory.length})`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
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
    fontWeight: "600",
  },
  weekTitle: {
    color: "#2B6CB0",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  dayTitle: {
    color: "#1A365D",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 24,
  },
  logsSummary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#C3DAF9",
    shadowColor: "#2B6CB0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logsTitle: {
    color: "#2B6CB0",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  logsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  logItem: {
    backgroundColor: "#F8FAFF",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#C3DAF9",
  },
  logExercise: {
    color: "#1A365D",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  logStats: {
    color: "#2B6CB0",
    fontSize: 14,
    fontWeight: "600",
  },
  seeMore: {
    backgroundColor: "#2B6CB0",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    minWidth: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  seeMoreText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#C3DAF9",
    shadowColor: "#2B6CB0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseTitle: {
    color: "#1A365D",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  planContainer: {
    marginBottom: 16,
  },
  planLabel: {
    color: "#4A5568",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  setRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  planPercentage: {
    fontSize: 14,
    color: "#2B6CB0",
    fontWeight: "600",
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  planX: {
    fontSize: 14,
    color: "#A0AEC0",
  },
  planReps: {
    fontSize: 14,
    color: "#1A365D",
    fontWeight: "600",
    backgroundColor: "#E6F7FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  planCount: {
    fontSize: 14,
    color: "#4A5568",
    backgroundColor: "#E6F7FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actualContainer: {
    borderTopWidth: 1,
    borderTopColor: "#C3DAF9",
    paddingTop: 16,
  },
  actualLabel: {
    color: "#2B6CB0",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    color: "#4A5568",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    color: "#1A365D",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#A0C4FF",
  },
  notesInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  notesContainer: {
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#2B6CB0",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    shadowColor: "#2B6CB0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.7,
    backgroundColor: "#4299E1",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  historyContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#C3DAF9",
    paddingTop: 16,
  },
  historyTitle: {
    color: "#4A5568",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  seeHistoryButton: {
    backgroundColor: "#F8FAFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#C3DAF9",
  },
  seeHistoryText: {
    color: "#2B6CB0",
    fontSize: 14,
    fontWeight: "600",
  },
});
