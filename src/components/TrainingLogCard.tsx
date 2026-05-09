import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TrainingLog } from "../hooks/useTrainingLog";

interface TrainingLogCardProps {
  log: TrainingLog;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export function TrainingLogCard({
  log,
  onDelete,
  showDelete = false,
}: TrainingLogCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (onDelete && !isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(log.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // 格式化创建时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{formatDate(log.date)}</Text>
          <Text style={styles.time}>{formatTime(log.createdAt)}</Text>
        </View>
        {showDelete && (
          <TouchableOpacity
            style={[
              styles.deleteButton,
              isDeleting && styles.deleteButtonDisabled,
            ]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? "删除中..." : "删除"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.exercise}>{log.exercise}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>重量</Text>
          <Text style={styles.statValue}>{log.weight}kg</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>次数</Text>
          <Text style={styles.statValue}>{log.reps}</Text>
        </View>
      </View>

      {log.notes && log.notes.trim() !== "" && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>备注:</Text>
          <Text style={styles.notesText}>{log.notes}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#C3DAF9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    color: "#2B6CB0",
    fontSize: 14,
    fontWeight: "600",
  },
  time: {
    color: "#718096",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  exercise: {
    color: "#1A365D",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: "#718096",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "#1A365D",
    fontSize: 16,
    fontWeight: "600",
  },
  notesContainer: {
    borderTopWidth: 1,
    borderTopColor: "#C3DAF9",
    paddingTop: 12,
    marginTop: 12,
  },
  notesTitle: {
    color: "#718096",
    fontSize: 12,
    marginBottom: 4,
  },
  notesText: {
    color: "#4A5568",
    fontSize: 14,
    lineHeight: 20,
  },
});
