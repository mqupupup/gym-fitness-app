import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function TexasMethodPlans() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "德州计划" });
  }, [navigation]);

  const plans = [
    {
      id: "powerlifting",
      title: "专注力量举 3 日",
      description: "只练深蹲、卧推、硬拉、推举四个基础动作",
      icon: "barbell-outline",
      route: "texas-powerlifting",
    },
    {
      id: "classic",
      title: "经典 3 日计划",
      description: "包含深蹲、卧推、硬拉 + 奥林匹克举重动作",
      icon: "trophy-outline",
      route: "texas-classic",
    },
    {
      id: "split",
      title: "4 日分化计划",
      description: "容量日和强度日分开，更适合进阶训练者",
      icon: "grid-outline",
      route: "texas-split",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "德州计划" }} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="barbell-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>德州计划</Text>
            <Text style={styles.headerSubtitle}>Texas Method · 经典三日分化，容量日 + 恢复日 + 强度日</Text>
          </View>
        </View>

        {/* 计划简介卡片 */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>计划特点</Text>
          <View style={styles.introRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.introText}>每周 3 练：容量日、恢复日、强度日，结构清晰</Text>
          </View>
          <View style={styles.introRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.introText}>被《Practical Programming》等权威教材收录</Text>
          </View>
          <View style={styles.introRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.introText}>适合新手到中级训练者，快速建立力量基础</Text>
          </View>
        </View>

        {/* 计划选择列表 */}
        <Text style={styles.sectionTitle}>选择训练版本</Text>
        {plans.map((plan) => (
          <Pressable
            key={plan.id}
            style={({ pressed }) => [
              styles.planCard,
              pressed && styles.planCardPressed,
            ]}
            onPress={() => router.push(`/powerlifting-plans/texas-method/${plan.route}`)}
            android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
          >
            <View style={styles.planIcon}>
              <Ionicons name={plan.icon as any} size={22} color="#6A4C93" />
            </View>
            <View style={styles.planContent}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // 顶部标题区
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
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

  // 计划简介卡片
  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  introRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  introText: {
    flex: 1,
    fontSize: 13,
    color: "#3C3C43",
    lineHeight: 18,
  },

  // 分区标题
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },

  // 计划卡片
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  planCardPressed: {
    backgroundColor: "#FAFAFC",
    transform: [{ scale: 0.99 }],
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  planContent: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 3,
  },
  planDescription: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 17,
  },
});
