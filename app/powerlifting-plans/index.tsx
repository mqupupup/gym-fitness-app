import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { POWERLIFTING_PLANS, PowerliftingPlan as PlanData } from "../../src/data/powerlifting-plans";

const FATIGUE_COLORS: Record<string, string> = {
  low: "#34C759",
  moderate: "#FF9500",
  high: "#FF3B30",
};

export default function PowerliftingPlan() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "力量举计划" });
  }, [navigation]);

  const handleStartTraining = (plan: PlanData) => {
    router.push(plan.route);
  };

  return (
    <SafeAreaView style={styles.container}>
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
        {POWERLIFTING_PLANS.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={styles.planIcon}>
                <Ionicons name={plan.icon as any} size={20} color="#6A4C93" />
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
              </View>
            </View>

            {/* 元信息标签行 */}
            <View style={styles.metaRow}>
              <View style={styles.difficultyTag}>
                <Text style={styles.difficultyText}>{plan.experienceLevel.typical}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
                <Text style={styles.metaText}>{plan.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={12} color="#8E8E93" />
                <Text style={styles.metaText}>{plan.frequency}天/周</Text>
              </View>
            </View>

            {/* 进阶类型 + 疲劳管理 */}
            <View style={styles.attrRow}>
              <View style={styles.attrItem}>
                <Text style={styles.attrLabel}>周期结构</Text>
                <Text style={styles.attrValue}>{plan.progressionTypeLabel}</Text>
              </View>
              <View style={styles.attrDivider} />
              <View style={styles.attrItem}>
                <Text style={styles.attrLabel}>疲劳管理</Text>
                <View style={styles.attrValueRow}>
                  <View
                    style={[
                      styles.fatigueDot,
                      { backgroundColor: FATIGUE_COLORS[plan.fatigueManagement] },
                    ]}
                  />
                  <Text style={styles.attrValue}>{plan.fatigueManagementLabel}</Text>
                </View>
              </View>
              <View style={styles.attrDivider} />
              <View style={styles.attrItem}>
                <Text style={styles.attrLabel}>主要目标</Text>
                <Text style={styles.attrValue}>{plan.primaryGoalLabel}</Text>
              </View>
            </View>

            <Text style={styles.planDescription}>{plan.description}</Text>

            {/* 核心特点标签 */}
            <View style={styles.featuresRow}>
              {plan.coreFeatures.map((feature, idx) => (
                <View key={idx} style={styles.featureTag}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.startButtonPressed,
              ]}
              onPress={() => handleStartTraining(plan)}
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
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
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  planSubtitle: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  difficultyTag: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    color: "#6A4C93",
    fontSize: 12,
    fontWeight: "600",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "500",
  },
  attrRow: {
    flexDirection: "row",
    backgroundColor: "#F7F6FA",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  attrItem: {
    flex: 1,
    alignItems: "center",
  },
  attrLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginBottom: 3,
  },
  attrValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  attrValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  fatigueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  attrDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E5E5EA",
  },
  planDescription: {
    color: "#3C3C43",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  featureTag: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureText: {
    color: "#6A4C93",
    fontSize: 11,
    fontWeight: "600",
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
