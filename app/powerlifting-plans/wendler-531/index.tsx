import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const WEEKS = [
  {
    week: 1,
    title: "5次组周",
    focus: "主项3组×5次，逐步建立训练容量",
    intensity: "65% / 75% / 85% TM",
  },
  {
    week: 2,
    title: "3次组周",
    focus: "主项3组×3次，提高训练强度",
    intensity: "70% / 80% / 90% TM",
  },
  {
    week: 3,
    title: "1次组周",
    focus: "主项5/3/1递增，最后一组挑战极限",
    intensity: "75% / 85% / 95% TM",
  },
  {
    week: 4,
    title: "减载周",
    focus: "降低训练量，充分恢复，为下一循环蓄力",
    intensity: "40% / 50% / 60% TM",
  },
];

export default function Wendler531Page() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Wendler 5-3-1" });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Wendler 5-3-1" }} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="calendar-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Wendler 5-3-1</Text>
            <Text style={styles.headerSubtitle}>经典周期化训练，4 周循环，长期可持续进步</Text>
          </View>
        </View>

        {/* 统计卡片 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>周循环</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>天/周</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>核心动作</Text>
          </View>
        </View>

        {/* 开始训练计划按钮 */}
        <Pressable
          style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
          onPress={() => router.push(`/powerlifting-plans/wendler-531/wendler-input`)}
          android_ripple={{ color: "rgba(255,255,255,0.15)" }}
        >
          <View style={styles.startIcon}>
            <Ionicons name="play-circle" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.startContent}>
            <Text style={styles.startTitle}>开始训练计划</Text>
            <Text style={styles.startSubtitle}>输入四项 1RM，自动生成 4 周训练重量</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>

        {/* 计划说明卡片 */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>计划说明</Text>
          <View style={styles.introRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.introText}>基于 Training Max（通常为1RM的90%）的百分比系统推进</Text>
          </View>
          <View style={styles.introRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.introText}>4周一个循环，逐步提高训练强度并设置减量/恢复周</Text>
          </View>
          <View style={styles.introRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.introText}>主项采用5/3/1周期训练，辅助训练可使用BBB等模板</Text>
          </View>
          <View style={styles.introRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.introText}>适合希望长期、稳步提高力量的训练者</Text>
          </View>
        </View>

        {/* 4周计划概览 */}
        <Text style={styles.sectionTitle}>4周计划概览</Text>
        {WEEKS.map((week) => (
          <View key={week.week} style={styles.weekCard}>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>第{week.week}周</Text>
            </View>
            <View style={styles.weekContent}>
              <View style={styles.weekTitleRow}>
                <Text style={styles.weekTitle}>{week.title}</Text>
                <Text style={styles.weekIntensity}>{week.intensity}</Text>
              </View>
              <Text style={styles.weekFocus}>{week.focus}</Text>
            </View>
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
  },

  // 统计卡片
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#6A4C93",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },

  // 开始按钮
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6A4C93",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    gap: 14,
    shadowColor: "#6A4C93",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonPressed: {
    backgroundColor: "#5A3D80",
    transform: [{ scale: 0.99 }],
  },
  startIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  startContent: {
    flex: 1,
  },
  startTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 3,
  },
  startSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 17,
  },

  // 计划说明卡片
  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
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

  // 周计划概览
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 10,
    marginTop: 4,
  },
  weekCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  weekBadge: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 52,
    alignItems: "center",
  },
  weekBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6A4C93",
  },
  weekContent: {
    flex: 1,
  },
  weekTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  weekTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  weekFocus: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
  },
  weekIntensity: {
    fontSize: 11,
    color: "#6A4C93",
    fontWeight: "600",
  },
});
