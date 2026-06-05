import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const powerliftingPlans = [
  {
    id: "wendler-531",
    title: "Wendler 5-3-1",
    description:
      "Jim Wendler的经典周期化训练计划，适合中级到高级训练者。采用百分比系统和RPE调节，注重长期可持续进步。",
    icon: "📋",
    difficulty: "中级-高级",
    duration: "4周循环",
  },
  {
    id: "texas-method",
    title: "德州计划 (Texas Method)",
    description:
      "经典的三日分化训练（容量日、恢复日、强度日），被《Practical Programming》等权威教材收录，适合新手到中级训练者。",
    icon: "🏋️",
    difficulty: "初级-中级",
    duration: "每周循环",
  },
  {
    id: "candito-6-week",
    title: "Candito 6周计划",
    description:
      "线性进阶的6周周期计划，结构清晰易执行。在Reddit和力量训练社区广受欢迎，适合希望系统提升三大项的训练者。",
    icon: "💪",
    difficulty: "中级",
    duration: "6周",
  },
  {
    id: "gzclp",
    title: "GZCLP",
    description:
      "Cody Lefever创建的系统化训练方法，强调渐进超负荷和个体化调整。在专业训练圈内认可度高，适合自学者。",
    icon: "📈",
    difficulty: "中级-高级",
    duration: "持续进阶",
  },
  {
    id: "madcow",
    title: "疯牛55 (Madcow 5x5)",
    description:
      "基于5x5理念的中级训练计划，在StrongLifts社区和中级训练者中较常见。专注于深蹲、卧推、硬拉和推举的基础训练。",
    icon: "🐮",
    difficulty: "初级-中级",
    duration: "9周",
  },
];

export default function PowerliftingPlan() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleStartTraining = (planId: string) => {
    // 这里可以导航到具体的训练计划详情页
    router.push(`/powerlifting-plans/${planId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.title}>力量举计划</Text>
      <Text style={styles.subtitle}>选择适合您的权威训练计划</Text>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {powerliftingPlans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planIcon}>{plan.icon}</Text>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <View style={styles.planMeta}>
                  <Text style={styles.planDifficulty}>{plan.difficulty}</Text>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.planDescription}>{plan.description}</Text>
            <Pressable
              style={styles.startButton}
              onPress={() => handleStartTraining(plan.id)}
              android_ripple={{ color: "rgba(0, 122, 255, 0.1)" }}
            >
              <Text style={styles.startButtonText}>开始计划</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
  },
  title: {
    color: "#1C1C1E",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 16,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  planIcon: {
    fontSize: 24,
    marginRight: 12,
    minWidth: 24,
    textAlign: "center",
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  planMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  planDifficulty: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 12,
  },
  planDuration: {
    color: "#8E8E93",
    fontSize: 14,
  },
  planDescription: {
    color: "#4A4A4A",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
