import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function GZCLPIndex() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "GZCLP" });
  }, [navigation]);

  const weeks = [
    { number: 1, description: "基础适应周" },
    { number: 2, description: "强度提升周" },
    { number: 3, description: "容量增加周" },
    { number: 4, description: "峰值周" },
  ];

  const dayInfo: Record<number, { label: string; moves: string }> = {
    1: { label: "A", moves: "深蹲 · 卧推 · 划船" },
    2: { label: "B", moves: "深蹲 · 硬拉 · 推举" },
    3: { label: "A+", moves: "深蹲 · 卧推 · 划船" },
  };

  const handleDayPress = (weekNumber: number, dayNumber: number) => {
    router.push({
      pathname: `/powerlifting-plans/gzclp/[week]/[day]`,
      params: {
        week: weekNumber.toString(),
        day: `day${dayNumber}`,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "GZCLP" }} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="stats-chart-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>GZCLP</Text>
            <Text style={styles.headerSubtitle}>系统化渐进超负荷，适合自学者的 12 周计划</Text>
          </View>
        </View>

        {/* 计划数据统计卡片 */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>周数</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>训练日/周</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>主要动作</Text>
          </View>
        </View>

        {/* 计算器入口 */}
        <Pressable
          style={({ pressed }) => [
            styles.calculatorCard,
            pressed && styles.calculatorCardPressed,
          ]}
          onPress={() => router.push("/powerlifting-plans/gzclp/calculator")}
          android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
        >
          <View style={styles.calculatorIcon}>
            <Ionicons name="calculator-outline" size={22} color="#6A4C93" />
          </View>
          <View style={styles.calculatorContent}>
            <Text style={styles.calculatorTitle}>训练重量计算器</Text>
            <Text style={styles.calculatorSubtitle}>输入 1RM，自动计算各周训练重量</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </Pressable>

        {/* 周计划列表 */}
        <Text style={styles.sectionTitle}>训练周计划</Text>
        {weeks.map((week) => (
          <View key={week.number} style={styles.weekCard}>
            <View style={styles.weekHeader}>
              <View style={styles.weekBadge}>
                <Text style={styles.weekBadgeText}>WEEK {week.number}</Text>
              </View>
              <Text style={styles.weekDescription}>{week.description}</Text>
            </View>

            <View style={styles.daysContainer}>
              {[1, 2, 3].map((day) => {
                const info = dayInfo[day];
                return (
                  <Pressable
                    key={day}
                    style={({ pressed }) => [
                      styles.dayButton,
                      pressed && styles.dayButtonPressed,
                    ]}
                    onPress={() => handleDayPress(week.number, day)}
                    android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
                  >
                    <View style={styles.dayIcon}>
                      <Text style={styles.dayIconText}>{info.label}</Text>
                    </View>
                    <View style={styles.dayContent}>
                      <Text style={styles.dayTitle}>Day {day}</Text>
                      <Text style={styles.daySubtitle}>{info.moves}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {/* 底部提示 */}
        <View style={styles.footer}>
          <Ionicons name="lightbulb-outline" size={14} color="#8E8E93" />
          <Text style={styles.footerText}>点击任意训练日开始你的训练</Text>
        </View>
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

  // 数据统计卡片
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
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
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6A4C93",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#EDEDF0",
  },

  // 计算器卡片
  calculatorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  calculatorCardPressed: {
    backgroundColor: "#FAFAFC",
    transform: [{ scale: 0.99 }],
  },
  calculatorIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  calculatorContent: {
    flex: 1,
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 3,
  },
  calculatorSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 17,
  },

  // 分区标题
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },

  // 周计划卡片
  weekCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  weekHeader: {
    marginBottom: 14,
  },
  weekBadge: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  weekBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6A4C93",
    letterSpacing: 0.5,
  },
  weekDescription: {
    fontSize: 14,
    color: "#3C3C43",
    fontWeight: "500",
  },

  // 训练日列表
  daysContainer: {
    gap: 8,
  },
  dayButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F6FA",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  dayButtonPressed: {
    backgroundColor: "#F0EDFA",
  },
  dayIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#6A4C93",
    justifyContent: "center",
    alignItems: "center",
  },
  dayIconText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dayContent: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  daySubtitle: {
    fontSize: 12,
    color: "#8E8E93",
  },

  // 底部提示
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    color: "#8E8E93",
    fontSize: 13,
    textAlign: "center",
  },
});
