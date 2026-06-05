import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 类型定义（与计算器保持一致）
interface SetWeight {
  setNumber: number;
  reps: number;
  weight: number;
}

interface Exercise {
  name: string;
  sets: SetWeight[];
}

interface DayPlan {
  dayLabel: string;
  exercises: Exercise[];
}

type WeekPlan = DayPlan[];

export default function WeekOverview() {
  const { week } = useLocalSearchParams();
  const router = useRouter();
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  const weekNum = parseInt(week as string);

  // 加载计划 + 完成状态
  useEffect(() => {
    const load = async () => {
      try {
        const rawPlan = await AsyncStorage.getItem("madcow_plan");
        const rawCompleted = await AsyncStorage.getItem(
          `madcow_completed_week_${weekNum}`,
        );

        if (rawPlan) {
          const parsedPlan: WeekPlan = JSON.parse(rawPlan);
          if (parsedPlan[weekNum - 1]) {
            setPlan(parsedPlan[weekNum - 1]);
          }
        }

        if (rawCompleted) {
          setCompletedDays(JSON.parse(rawCompleted));
        }
      } catch (e) {
        console.error("加载失败:", e);
        Alert.alert("⚠️ 加载错误", "无法读取训练计划，请重新生成。");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [week]);

  // 保存完成状态（当用户点击“完成”时）
  const markDayCompleted = (dayLabel: string) => {
    const newCompleted = { ...completedDays, [dayLabel]: true };
    setCompletedDays(newCompleted);
    AsyncStorage.setItem(
      `madcow_completed_week_${weekNum}`,
      JSON.stringify(newCompleted),
    );
  };

  // 获取某天的首组重量（用于预览）
  const getPreviewWeight = (dayIndex: number, exerciseName: string) => {
    if (!plan || !plan[dayIndex]) return "-";
    const ex = plan[dayIndex].exercises.find((e) =>
      e.name.toLowerCase().includes(exerciseName.toLowerCase()),
    );
    return ex?.sets[0]?.weight ?? "-";
  };

  const days = [
    {
      label: "Monday",
      key: "Mon",
      color: "#007bff",
      exercises: ["Squat", "Bench", "Row"],
    },
    {
      label: "Wednesday",
      key: "Wed",
      color: "#28a745",
      exercises: ["Light Squat", "Press", "Deadlift"],
    },
    {
      label: "Friday",
      key: "Fri",
      color: "#dc3545",
      exercises: ["Squat", "Bench", "Row"],
    },
  ];

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>⏳ 加载中...</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text>❌ 未找到第 {week} 周计划</Text>
        <TouchableOpacity onPress={() => router.replace("/madcow")}>
          <Text style={styles.link}>← 返回首页生成计划</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐂 Madcow 5x5 · Week {week}</Text>
        <Text style={styles.subtitle}>
          {completedDays.Monday &&
          completedDays.Wednesday &&
          completedDays.Friday
            ? "✅ 本周全部完成！"
            : `${Object.values(completedDays).filter(Boolean).length}/3 天完成`}
        </Text>
      </View>

      {/* 3天卡片 */}
      {days.map((day, idx) => {
        const isCompleted = completedDays[day.label];
        const topExercises = day.exercises.slice(0, 2); // 只显示前2个动作预览
        const previewWeights = topExercises.map((ex) =>
          getPreviewWeight(idx, ex),
        );

        return (
          <TouchableOpacity
            key={day.label}
            style={[
              styles.dayCard,
              { borderColor: day.color, borderWidth: 2 },
              isCompleted && styles.dayCardCompleted,
            ]}
            onPress={() =>
              router.push(`/powerlifting-plans/madcow/${week}/${day.label}`)
            }
          >
            <View style={styles.dayHeader}>
              <View style={[styles.dayBadge, { backgroundColor: day.color }]}>
                <Text style={styles.badgeText}>{day.key}</Text>
              </View>
              <Text style={styles.dayLabel}>{day.label}</Text>
              {isCompleted && <Text style={styles.completedTag}>✅</Text>}
            </View>

            <View style={styles.exercisePreview}>
              {topExercises.map((ex, i) => (
                <View key={i} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName} numberOfLines={1}>
                    {ex}
                  </Text>
                  <Text style={styles.exerciseWeight}>
                    {previewWeights[i]}kg
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.setSummary}>
              <Text style={styles.setInfo}>5×5 阶梯组</Text>
              <Text style={styles.setInfo}>
                ⏱️ 组间休息{" "}
                {plan[idx]?.exercises[0]?.sets.length > 0 ? "120s" : "—"}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* 底部操作区 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← 上一周</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => {
            if (weekNum < 12) {
              router.push(`/powerlifting-plans/madcow/${weekNum + 1}`);
            } else {
              Alert.alert("🎉 计划完成！", "你已成功完成12周Madcow 5x5！");
            }
          }}
        >
          <Text style={styles.nextBtnText}>
            {weekNum < 12 ? `→ Week ${weekNum + 1}` : "🏆 结束计划"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    paddingBottom: 80,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  link: {
    color: "#007bff",
    marginTop: 8,
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#333",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 6,
  },
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dayCardCompleted: {
    backgroundColor: "#f8f9fa",
    opacity: 0.9,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  dayLabel: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    color: "#333",
  },
  completedTag: {
    fontSize: 20,
    color: "#28a745",
    fontWeight: "bold",
  },
  exercisePreview: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  exerciseItem: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
    marginBottom: 4,
  },
  exerciseWeight: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  setSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  setInfo: {
    fontSize: 13,
    color: "#777",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 8,
  },
  backBtn: {
    flex: 1,
    backgroundColor: "#6c757d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  backBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  nextBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
