import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- 数据源 ---
const DIET_STRATEGIES = [
  {
    id: "d1",
    title: "16+8 轻断食",
    icon: "⏰",
    core: "限制进食窗口，延长身体燃脂时间。",
    method:
      "每天将进食时间控制在 8小时 内（如12:00-20:00），其余 16小时 只喝水或无糖饮料。",
    target: "忙碌的上班族、不喜欢计算卡路里的人。",
  },
  {
    id: "d2",
    title: "碳水循环",
    icon: "🔄",
    core: "欺骗代谢，防止身体适应低热量。",
    method:
      "高碳日（训练日）多吃碳水；低碳日（休息日）少吃碳水，迫使身体燃烧脂肪。",
    target: "有一定训练基础、想要突破减脂平台期的人。",
  },
  {
    id: "d3",
    title: "高蛋白饮食",
    icon: "🥩",
    core: "食物热效应 + 饱腹感 + 肌肉保护。",
    method:
      "每餐包含优质蛋白（鸡胸、鱼虾、蛋）。建议摄入 1.5g - 2g / 每公斤体重。",
    target: "所有人，特别是想减脂不掉肌肉的人。",
  },
  {
    id: "d4",
    title: "地中海饮食",
    icon: "🥑",
    core: "优质脂肪抗炎，长期可持续。",
    method: "多吃蔬菜、全谷物、橄榄油；适量鱼禽，少吃红肉。",
    target: "追求长期健康、温和减脂的人群。",
  },
];

const TRAINING_STRATEGIES = [
  {
    id: "t1",
    title: "力量训练",
    icon: "🏋️",
    core: "增加肌肉量，提高基础代谢（易瘦体质）。",
    method: "每周 2-3 次全身性训练（深蹲、硬拉、卧推）。",
    target: "想要线条紧致的人。",
  },
  {
    id: "t2",
    title: "高强度间歇训练",
    icon: "🏃",
    core: "短时间，高消耗，后燃效应。",
    method: "通过高强度爆发（如波比跳、冲刺跑），在运动后 24 小时持续燃脂。",
    target: "时间紧张、心肺功能较好的人。",
  },
  {
    id: "t3",
    title: "增加日常消耗",
    icon: "🚶",
    core: "积少成多，非运动消耗也很重要。",
    method: "多走路、爬楼梯、站立办公。目标每天 8000-10000 步。",
    target: "所有人。",
  },
];

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
        toValue: 100,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCore}>{item.core}</Text>
        </View>
        <Animated.View
          style={{ transform: [{ rotate: expanded ? "45deg" : "0deg" }] }}
        >
          <Text style={styles.toggleIcon}>+</Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.cardContent,
          { height: heightAnim, opacity: heightAnim },
        ]}
      >
        <View style={styles.detailRow}>
          <Text style={styles.label}>怎么做：</Text>
          <Text style={styles.value}>{item.method}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>适合：</Text>
          <Text style={styles.value}>{item.target}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

// --- 主列表组件 ---
export default function StrategiesList() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🥗 饮食策略</Text>
      {DIET_STRATEGIES.map((item) => (
        <StrategyCard key={item.id} item={item} />
      ))}

      <Text style={styles.sectionTitle}>🏋️ 训练与生活</Text>
      {TRAINING_STRATEGIES.map((item) => (
        <StrategyCard key={item.id} item={item} />
      ))}

      {/* 简单的对比表文字版 */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>📊 策略对比</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.bold]}>策略</Text>
          <Text style={[styles.tableCell, styles.bold]}>难度</Text>
          <Text style={[styles.tableCell, styles.bold]}>推荐</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>16+8</Text>
          <Text style={styles.tableCell}>⭐⭐</Text>
          <Text style={styles.tableCell}>上班族</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>碳水循环</Text>
          <Text style={styles.tableCell}>⭐⭐⭐⭐</Text>
          <Text style={styles.tableCell}>进阶</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>力量训练</Text>
          <Text style={styles.tableCell}>⭐⭐⭐</Text>
          <Text style={styles.tableCell}>塑形</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 16,
    marginTop: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardCore: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  toggleIcon: {
    fontSize: 20,
    color: "#999",
    fontWeight: "300",
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#FAFAFA",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    overflow: "hidden", // 必须隐藏溢出才能看到高度动画
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    width: 50,
    fontSize: 13,
  },
  value: {
    flex: 1,
    color: "#666",
    fontSize: 13,
    lineHeight: 18,
  },
  tableContainer: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: "#666",
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
});
