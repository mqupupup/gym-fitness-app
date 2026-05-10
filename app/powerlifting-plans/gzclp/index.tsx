import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function GZCLPIndex() {
  const router = useRouter();

  const weeks = [
    { number: 1, description: "基础适应周" },
    { number: 2, description: "强度提升周" },
    { number: 3, description: "容量增加周" },
    { number: 4, description: "峰值周" },
  ];

  // 导航到训练日（使用动态路由）
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - 美化版 */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerEmoji}>💪</Text>
            <View style={styles.titleWrapper}>
              <Text style={styles.headerTitle}>GZCLP 计划</Text>
              <Text style={styles.headerSubtitle}>12 周力量训练计划</Text>
            </View>
          </View>

          <View style={styles.headerDivider} />

          <View style={styles.headerStats}>
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

          <TouchableOpacity
            style={styles.calculatorButton}
            onPress={() => router.push("/powerlifting-plans/gzclp/calculator")}
            activeOpacity={0.8}
          >
            <Text style={styles.calculatorButtonText}>📱 计算器</Text>
            <Text style={styles.calculatorButtonSubtext}>计算训练重量</Text>
          </TouchableOpacity>
        </View>

        {/* Weeks List */}
        <View style={styles.weeksContainer}>
          {weeks.map((week) => (
            <View key={week.number} style={styles.weekCard}>
              <View style={styles.weekHeader}>
                <View style={styles.weekBadge}>
                  <Text style={styles.weekBadgeText}>WEEK {week.number}</Text>
                </View>
                <Text style={styles.weekDescription}>{week.description}</Text>
              </View>

              <View style={styles.daysContainer}>
                {[1, 2, 3].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={styles.dayButton}
                    onPress={() => handleDayPress(week.number, day)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dayIcon}>
                      <Text style={styles.dayIconText}>
                        {day === 1 ? "A" : day === 2 ? "B" : "A+"}
                      </Text>
                    </View>
                    <View style={styles.dayContent}>
                      <Text style={styles.dayButtonText}>Day {day}</Text>
                      <Text style={styles.dayButtonSubtext}>
                        {day === 1
                          ? "深蹲 · 卧推 · 划船"
                          : day === 2
                            ? "深蹲 · 硬拉 · 推举"
                            : "深蹲 · 卧推 · 划船"}
                      </Text>
                    </View>
                    <View style={styles.dayArrow}>
                      <Text style={styles.dayArrowText}>→</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>💡 点击任意训练日开始你的训练！</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  titleWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#e0f0ff",
    opacity: 0.9,
  },
  headerDivider: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 16,
  },
  headerStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#e0f0ff",
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  calculatorButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0056b3",
  },
  calculatorButtonText: {
    color: "#007bff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  calculatorButtonSubtext: {
    color: "#666",
    fontSize: 12,
    opacity: 0.8,
  },

  weeksContainer: {
    gap: 16,
  },
  weekCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weekHeader: {
    marginBottom: 16,
  },
  weekBadge: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  weekBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  weekDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  daysContainer: {
    gap: 12,
  },
  dayButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  dayIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dayIconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  dayContent: {
    flex: 1,
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  dayButtonSubtext: {
    fontSize: 12,
    color: "#666",
    opacity: 0.8,
  },
  dayArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  dayArrowText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },

  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
