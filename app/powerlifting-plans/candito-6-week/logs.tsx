// app/powerlifting-plans/candito-6-week/logs.tsx

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TrainingLogCard } from "../../../src/components/TrainingLogCard";
import { TrainingLog, useTrainingLog } from "../../../src/hooks/useTrainingLog";

export default function TrainingLogsScreen() {
  const insets = useSafeAreaInsets();
  const { logs, loading, deleteLog } = useTrainingLog();
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [dateLogs, setDateLogs] = useState<TrainingLog[]>([]);

  useEffect(() => {
    if (!loading) {
      const filteredLogs = logs.filter((log) => log.date === selectedDate);
      setDateLogs(filteredLogs);
    }
  }, [logs, loading, selectedDate]);

  const handleDelete = async (id: string) => {
    setDeletingLogId(id);
    try {
      await deleteLog(id);
    } finally {
      setDeletingLogId(null);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      weekday: "short",
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>加载训练记录中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.header}>训练记录</Text>

        <View style={styles.dateSelector}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              setSelectedDate(yesterday.toISOString().split("T")[0]);
            }}
          >
            <Text style={styles.dateButtonText}>← 昨天</Text>
          </TouchableOpacity>

          <Text style={styles.selectedDate}>
            {formatDateForDisplay(selectedDate)}
          </Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              const today = new Date().toISOString().split("T")[0];
              setSelectedDate(today);
            }}
          >
            <Text style={styles.dateButtonText}>今天 →</Text>
          </TouchableOpacity>
        </View>

        {dateLogs.length === 0 ? (
          <View style={styles.noLogsContainer}>
            <Text style={styles.noLogsText}>今天还没有训练记录</Text>
            <Text style={styles.noLogsSubtext}>完成训练后点击保存记录</Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>
                今日完成 {dateLogs.length} 个动作
              </Text>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>总重量</Text>
                  <Text style={styles.statValue}>
                    {dateLogs
                      .reduce((sum, log) => sum + log.weight * log.reps, 0)
                      .toFixed(0)}
                    kg
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>总次数</Text>
                  <Text style={styles.statValue}>
                    {dateLogs.reduce((sum, log) => sum + log.reps, 0)}
                  </Text>
                </View>
              </View>
            </View>

            {dateLogs.map((log) => (
              <TrainingLogCard
                key={log.id}
                log={log}
                onDelete={handleDelete}
                showDelete={deletingLogId !== log.id}
              />
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>历史记录</Text>

        <View style={styles.historyGrid}>
          {logs
            .filter((log) => log.date !== selectedDate)
            .slice(0, 6)
            .map((log) => (
              <TouchableOpacity
                key={log.id}
                style={styles.historyItem}
                onPress={() => setSelectedDate(log.date)}
              >
                <Text style={styles.historyDate}>
                  {new Date(log.date).toLocaleDateString("zh-CN", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text style={styles.historyExercise}>{log.exercise}</Text>
                <Text style={styles.historyStats}>
                  {log.weight}kg × {log.reps}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
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
  header: {
    color: "#2B6CB0",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 20,
  },
  loadingText: {
    color: "#A0C4FF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  dateButton: {
    padding: 8,
  },
  dateButtonText: {
    color: "#3182CE",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedDate: {
    color: "#2B6CB0",
    fontSize: 18,
    fontWeight: "700",
  },
  noLogsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noLogsText: {
    color: "#E53E3E",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noLogsSubtext: {
    color: "#A0C4FF",
    fontSize: 14,
  },
  summaryContainer: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BEE3F8",
  },
  summaryTitle: {
    color: "#2B6CB0",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: "#A0C4FF",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "#2B6CB0",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#2B6CB0",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 24,
  },
  historyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  historyItem: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: "45%",
    borderWidth: 1,
    borderColor: "#BEE3F8",
  },
  historyDate: {
    color: "#3182CE",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  historyExercise: {
    color: "#2B6CB0",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  historyStats: {
    color: "#4A90E2",
    fontSize: 12,
  },
});
