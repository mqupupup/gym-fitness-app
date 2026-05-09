import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const items = [
  {
    title: "力量水平评估",
    icon: "💪",
    route: "/strength-evaluation",
  },
  {
    title: "减肥&减脂",
    icon: "🔥",
    route: "/weight-loss",
  },
  {
    title: "力量举水平评估",
    icon: "🏋️",
    route: "/powerlifting-evaluation",
  },
  {
    title: "力量举计划",
    icon: "📋",
    route: "/powerlifting-plans",
  },
];

export default function My() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.title}>我的</Text>

      <View style={styles.cardList}>
        {items.map((item, index) => (
          <Link
            key={item.title}
            href={item.route || "#"}
            asChild
            style={{ marginBottom: 16 }}
          >
            <Pressable
              style={styles.card}
              android_ripple={{ color: "rgba(0, 122, 255, 0.1)" }}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
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
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
  },
  title: {
    color: "#1C1C1E",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  cardList: {
    flex: 1,
  },
  card: {
    width: "100%",
    minHeight: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0, // 允许内容收缩
  },
  iconContainer: {
    width: 40, // 固定宽度确保图标可见
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 32,
    color: "#1C1C1E", // 深色确保可见
  },
  cardTitle: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 14,
    flexShrink: 1,
    maxWidth: "70%", // 防止文字溢出
  },
  cardArrow: {
    color: "#8E8E93",
    fontSize: 22,
  },
});
