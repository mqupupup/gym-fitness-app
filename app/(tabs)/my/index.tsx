import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const items = [
  {
    title: "力量水平评估",
    subtitle: "查看你的力量等级与发展潜力",
    icon: "barbell-outline",
    route: "/strength-evaluation",
  },
  {
    title: "减肥 & 减脂",
    subtitle: "热量计算 + 饮食训练策略，科学减脂",
    icon: "flame-outline",
    route: "/weight-loss",
  },
  {
    title: "力量举水平评估",
    subtitle: "三大项成绩与等级诊断",
    icon: "trophy-outline",
    route: "/powerlifting-evaluation",
  },
  {
    title: "力量举计划",
    subtitle: "周期性训练计划与进度追踪",
    icon: "calendar-outline",
    route: "/powerlifting-plans",
  },
];

export default function My() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>我的</Text>
      <Text style={styles.subtitle}>训练、力量与成长，都在这里</Text>

      <View style={styles.cardList}>
        {items.map((item) => (
          <Link key={item.title} href={item.route || "#"} asChild>
            <Pressable
              style={styles.card}
              android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={22} color="#6A4C93" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="#C7C7CC"
              />
            </Pressable>
          </Link>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FA",
    paddingHorizontal: 20,
  },
  title: {
    color: "#1C1C1E",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 28,
  },
  cardList: {
    flex: 1,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardText: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    color: "#1C1C1E",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  cardSubtitle: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "400",
  },
});
