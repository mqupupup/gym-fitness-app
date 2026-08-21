import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const powerliftingPlans = [
  {
    id: "wendler-531",
    title: "Wendler 5-3-1",
    description:
      "Jim Wendler 的经典周期化训练计划，适合中级到高级训练者。采用百分比系统和 RPE 调节，注重长期可持续进步。",
    icon: "calendar-outline",
    difficulty: "中级-高级",
    duration: "4周循环",
  },
  {
    id: "texas-method",
    title: "德州计划 (Texas Method)",
    description:
      "经典的三日分化训练（容量日、恢复日、强度日），被《Practical Programming》等权威教材收录，适合新手到中级训练者。",
    icon: "barbell-outline",
    difficulty: "初级-中级",
    duration: "每周循环",
  },
  {
    id: "candito-6-week",
    title: "Candito 6周计划",
    description:
      "线性进阶的 6 周周期计划，结构清晰易执行。在 Reddit 和力量训练社区广受欢迎，适合希望系统提升三大项的训练者。",
    icon: "trending-up-outline",
    difficulty: "中级",
    duration: "6周",
  },
  {
    id: "gzclp",
    title: "GZCLP",
    description:
      "Cody Lefever 创建的系统化训练方法，强调渐进超负荷和个体化调整。在专业训练圈内认可度高，适合自学者。",
    icon: "stats-chart-outline",
    difficulty: "中级-高级",
    duration: "持续进阶",
  },
  {
    id: "madcow",
    title: "疯牛55 (Madcow 5x5)",
    description:
      "基于 5x5 理念的中级训练计划，在 StrongLifts 社区和中级训练者中较常见。专注于深蹲、卧推、硬拉和推举的基础训练。",
    icon: "fitness-outline",
    difficulty: "初级-中级",
    duration: "9周",
  },
];

export default function PowerliftingPlan() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "力量举计划" });
  }, [navigation]);

  const handleStartTraining = (planId: string) => {
    router.push(`/powerlifting-plans/${planId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部标题区（水平排列：Icon + 标题 + 副标题） */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="trophy-outline" size={24} color="#6A4C93" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>力量举计划</Text>
          <Text style={styles.headerSubtitle}>选择适合你的权威训练计划</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {powerliftingPlans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={styles.planIcon}>
                <Ionicons name={plan.icon as any} size={20} color="#6A4C93" />
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <View style={styles.planMeta}>
                  <View style={styles.difficultyTag}>
                    <Text style={styles.difficultyText}>{plan.difficulty}</Text>
                  </View>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.planDescription}>{plan.description}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.startButtonPressed,
              ]}
              onPress={() => handleStartTraining(plan.id)}
              android_ripple={{ color: "rgba(106, 76, 147, 0.15)" }}
            >
              <Text style={styles.startButtonText}>开始计划</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
    backgroundColor: "#F7F6FA",
    paddingHorizontal: 20,
  },

  // 顶部标题区
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
    fontWeight: "400",
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // 计划卡片
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    color: "#1C1C1E",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  planMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyTag: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  difficultyText: {
    color: "#6A4C93",
    fontSize: 12,
    fontWeight: "600",
  },
  planDuration: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "500",
  },
  planDescription: {
    color: "#3C3C43",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  startButton: {
    backgroundColor: "#6A4C93",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonPressed: {
    backgroundColor: "#5A3D80",
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
