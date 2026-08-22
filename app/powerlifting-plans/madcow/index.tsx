import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const WEEK_PHASES = [
  { week: 1, phase: "基础适应期", desc: "建立动作模式，适应递增节奏" },
  { week: 2, phase: "基础适应期", desc: "持续加量，巩固技术动作" },
  { week: 3, phase: "基础适应期", desc: "稳步提升，准备PR测试" },
  { week: 4, phase: "基础适应期", desc: "PR匹配周，测试5RM极限" },
  { week: 5, phase: "线性进阶期", desc: "新周期开始，持续直线进步" },
  { week: 6, phase: "线性进阶期", desc: "稳步递增，积累训练量" },
  { week: 7, phase: "线性进阶期", desc: "强度提升，突破平台期" },
  { week: 8, phase: "线性进阶期", desc: "持续进阶，巩固力量基础" },
  { week: 9, phase: "强度突破期", desc: "高强度训练，冲击新极限" },
  { week: 10, phase: "强度突破期", desc: "稳步提升，准备最终突破" },
  { week: 11, phase: "强度突破期", desc: "最后冲刺，最大化力量" },
  { week: 12, phase: "强度突破期", desc: "计划完成，测试最终成果" },
];

export default function MadcowIndex() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Madcow 5x5" });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="trending-up-outline" size={28} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Madcow 5x5</Text>
            <Text style={styles.headerSubtitle}>
              适合中高级训练者的12周直线力量进阶计划
            </Text>
          </View>
        </View>

        {/* 开始按钮 */}
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={() => router.push("/powerlifting-plans/madcow/madcow-input")}
          android_ripple={{ color: "rgba(255,255,255,0.15)" }}
        >
          <Ionicons name="play-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.startButtonText}>开始设置参数</Text>
        </Pressable>

        {/* 统计卡片 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>周计划</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>天/周</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>核心动作</Text>
          </View>
        </View>

        {/* 计划核心逻辑 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>计划核心逻辑</Text>
          <View style={styles.logicItem}>
            <View style={styles.logicBadge}>
              <Text style={styles.logicBadgeText}>1</Text>
            </View>
            <View style={styles.logicContent}>
              <Text style={styles.logicTitle}>递增热身组</Text>
              <Text style={styles.logicDesc}>
                前4组按12.5%组间递增，最后1组为正式组，既保量又保强度
              </Text>
            </View>
          </View>
          <View style={styles.logicItem}>
            <View style={styles.logicBadge}>
              <Text style={styles.logicBadgeText}>2</Text>
            </View>
            <View style={styles.logicContent}>
              <Text style={styles.logicTitle}>周五强度突破</Text>
              <Text style={styles.logicDesc}>
                加1×3强度组（+2.5%）和1×8容量组，用3次更重的重量驱动进步
              </Text>
            </View>
          </View>
          <View style={styles.logicItem}>
            <View style={styles.logicBadge}>
              <Text style={styles.logicBadgeText}>3</Text>
            </View>
            <View style={styles.logicContent}>
              <Text style={styles.logicTitle}>直线进阶</Text>
              <Text style={styles.logicDesc}>
                下周周一正式组 = 本周周五1×3重量，实现重量的跨越式增长
              </Text>
            </View>
          </View>
        </View>

        {/* 每周训练安排 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>每周训练安排</Text>
          <View style={styles.dayRow}>
            <View style={[styles.dayBadge, styles.dayBadgeMon]}>
              <Text style={styles.dayBadgeText}>周一</Text>
            </View>
            <View style={styles.dayContent}>
              <Text style={styles.dayTitle}>正式组日</Text>
              <Text style={styles.dayDesc}>深蹲 · 卧推 · 俯身划船（5组×5次）</Text>
            </View>
          </View>
          <View style={styles.dayRow}>
            <View style={[styles.dayBadge, styles.dayBadgeWed]}>
              <Text style={styles.dayBadgeText}>周三</Text>
            </View>
            <View style={styles.dayContent}>
              <Text style={styles.dayTitle}>轻量恢复日</Text>
              <Text style={styles.dayDesc}>轻量深蹲 · 推举 · 硬拉（4组×5次）</Text>
            </View>
          </View>
          <View style={styles.dayRow}>
            <View style={[styles.dayBadge, styles.dayBadgeFri]}>
              <Text style={styles.dayBadgeText}>周五</Text>
            </View>
            <View style={styles.dayContent}>
              <Text style={styles.dayTitle}>强度突破日</Text>
              <Text style={styles.dayDesc}>深蹲 · 卧推 · 划船（4×5 + 1×3 + 1×8）</Text>
            </View>
          </View>
        </View>

        {/* 12周概览 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>12周阶段概览</Text>
          <View style={styles.weekGrid}>
            {WEEK_PHASES.map((w) => (
              <View key={w.week} style={styles.weekItem}>
                <View style={styles.weekNum}>
                  <Text style={styles.weekNumText}>W{w.week}</Text>
                </View>
                <View style={styles.weekInfo}>
                  <Text style={styles.weekPhase}>{w.phase}</Text>
                  <Text style={styles.weekDesc} numberOfLines={1}>
                    {w.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 适合人群 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>适合人群</Text>
          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.tipText}>
              深蹲1.5-2倍体重、硬拉2-2.5倍体重、卧推1.25-1.5倍体重
            </Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.tipText}>普通5x5/3x5计划已无法继续进步的中高级训练者</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={16} color="#6A4C93" />
            <Text style={styles.tipText}>目标是力量提升，至少可坚持3-4个月</Text>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 14,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6A4C93",
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  startButtonPressed: {
    backgroundColor: "#5A3D80",
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6A4C93",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 14,
  },
  logicItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  logicItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  logicBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logicBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6A4C93",
  },
  logicContent: {
    flex: 1,
  },
  logicTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  logicDesc: {
    fontSize: 13,
    color: "#6B6B70",
    lineHeight: 18,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  dayBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dayBadgeMon: {
    backgroundColor: "#EDE7F6",
  },
  dayBadgeWed: {
    backgroundColor: "#E8F5E9",
  },
  dayBadgeFri: {
    backgroundColor: "#FFF3E0",
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  dayContent: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  dayDesc: {
    fontSize: 12,
    color: "#8E8E93",
  },
  weekGrid: {
    gap: 8,
  },
  weekItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F7F6FA",
    borderRadius: 10,
    padding: 10,
  },
  weekNum: {
    width: 36,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#6A4C93",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  weekNumText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  weekInfo: {
    flex: 1,
  },
  weekPhase: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 1,
  },
  weekDesc: {
    fontSize: 11,
    color: "#8E8E93",
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#3C3C43",
    lineHeight: 18,
  },
});
