import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- 数据源 ---
const DIET_STRATEGIES = [
  {
    id: "d1",
    title: "16+8 轻断食",
    icon: "time-outline",
    core: "限制进食窗口，延长身体燃脂时间",
    method:
      "每天将进食时间控制在 8 小时内（如 12:00-20:00），其余 16 小时只喝水或无糖饮料。",
    target: "忙碌的上班族、不喜欢计算卡路里的人",
  },
  {
    id: "d2",
    title: "碳水循环",
    icon: "refresh-outline",
    core: "欺骗代谢，防止身体适应低热量",
    method:
      "高碳日（训练日）多吃碳水；低碳日（休息日）少吃碳水，迫使身体燃烧脂肪。",
    target: "有一定训练基础、想要突破减脂平台期的人",
  },
  {
    id: "d3",
    title: "高蛋白饮食",
    icon: "nutrition-outline",
    core: "食物热效应 + 饱腹感 + 肌肉保护",
    method:
      "每餐包含优质蛋白（鸡胸、鱼虾、蛋）。建议摄入 1.5g - 2g / 每公斤体重。",
    target: "所有人，特别是想减脂不掉肌肉的人",
  },
  {
    id: "d4",
    title: "地中海饮食",
    icon: "leaf-outline",
    core: "优质脂肪抗炎，长期可持续",
    method: "多吃蔬菜、全谷物、橄榄油；适量鱼禽，少吃红肉。",
    target: "追求长期健康、温和减脂的人群",
  },
];

const TRAINING_STRATEGIES = [
  {
    id: "t1",
    title: "力量训练",
    icon: "barbell-outline",
    core: "增加肌肉量，提高基础代谢（易瘦体质）",
    method: "每周 2-3 次全身性训练（深蹲、硬拉、卧推）。",
    target: "想要线条紧致的人",
  },
  {
    id: "t2",
    title: "高强度间歇训练",
    icon: "fitness-outline",
    core: "短时间，高消耗，后燃效应",
    method: "通过高强度爆发（如波比跳、冲刺跑），在运动后 24 小时持续燃脂。",
    target: "时间紧张、心肺功能较好的人",
  },
  {
    id: "t3",
    title: "增加日常消耗",
    icon: "walk-outline",
    core: "积少成多，非运动消耗也很重要",
    method: "多走路、爬楼梯、站立办公。目标每天 8000-10000 步。",
    target: "所有人",
  },
];

// 难度映射
const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
  easy: { label: "简单", color: "#34C759" },
  medium: { label: "中等", color: "#FF9500" },
  hard: { label: "困难", color: "#FF3B30" },
};

// --- 动画折叠卡片组件 ---
const StrategyCard = ({ item }: { item: any }) => {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(heightAnim, {
        toValue: 120,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
  };

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.cardHeader}
        onPress={toggleExpand}
        android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
      >
        <View style={styles.cardIcon}>
          <Ionicons name={item.icon} size={20} color="#6A4C93" />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCore} numberOfLines={1}>
            {item.core}
          </Text>
        </View>
        <Animated.View
          style={{ transform: [{ rotate: expanded ? "45deg" : "0deg" }] }}
        >
          <Ionicons name="add" size={22} color="#C7C7CC" />
        </Animated.View>
      </Pressable>

      <Animated.View
        style={[
          styles.cardContent,
          { height: heightAnim, opacity: heightAnim },
        ]}
      >
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>怎么做</Text>
          <Text style={styles.detailValue}>{item.method}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>适合</Text>
          <Text style={styles.detailValue}>{item.target}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

// --- 主列表组件 ---
export default function StrategiesList() {
  return (
    <View style={styles.container}>
      {/* 饮食策略 */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name="restaurant-outline" size={18} color="#6A4C93" />
        </View>
        <Text style={styles.sectionTitle}>饮食策略</Text>
      </View>
      {DIET_STRATEGIES.map((item) => (
        <StrategyCard key={item.id} item={item} />
      ))}

      {/* 训练与生活 */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View style={styles.sectionIcon}>
          <Ionicons name="barbell-outline" size={18} color="#6A4C93" />
        </View>
        <Text style={styles.sectionTitle}>训练与生活</Text>
      </View>
      {TRAINING_STRATEGIES.map((item) => (
        <StrategyCard key={item.id} item={item} />
      ))}

      {/* 策略对比表 */}
      <View style={styles.tableContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Ionicons name="stats-chart-outline" size={18} color="#6A4C93" />
          </View>
          <Text style={styles.sectionTitle}>策略对比</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>策略</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>难度</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>推荐人群</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>16+8 轻断食</Text>
          <Text style={[styles.tableCell, { color: DIFFICULTY_MAP.easy.color }]}>
            {DIFFICULTY_MAP.easy.label}
          </Text>
          <Text style={styles.tableCell}>上班族</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>碳水循环</Text>
          <Text style={[styles.tableCell, { color: DIFFICULTY_MAP.hard.color }]}>
            {DIFFICULTY_MAP.hard.label}
          </Text>
          <Text style={styles.tableCell}>进阶</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>力量训练</Text>
          <Text style={[styles.tableCell, { color: DIFFICULTY_MAP.medium.color }]}>
            {DIFFICULTY_MAP.medium.label}
          </Text>
          <Text style={styles.tableCell}>塑形</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },

  // 分区标题
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },

  // 策略卡片
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  cardCore: {
    fontSize: 12,
    color: "#8E8E93",
  },

  // 展开内容
  cardContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    backgroundColor: "#FAFAFC",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F3",
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: "600",
    color: "#6A4C93",
    width: 50,
    fontSize: 13,
  },
  detailValue: {
    flex: 1,
    color: "#3C3C43",
    fontSize: 13,
    lineHeight: 18,
  },

  // 对比表
  tableContainer: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F3",
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: "#3C3C43",
  },
  tableHeader: {
    fontWeight: "700",
    color: "#8E8E93",
    fontSize: 12,
  },
});
