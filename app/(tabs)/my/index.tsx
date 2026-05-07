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
  },
  {
    title: "力量举计划",
    icon: "📅",
  },
];

export default function My() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.title}>我的</Text>
      <View style={styles.cardWrap}>
        {items.map((item) => {
          const card = (
            <Pressable
              key={item.title}
              style={styles.card}
              android_ripple={{ color: "rgba(255,255,255,0.08)" }}
            >
              <View style={styles.cardBody}>
                <View style={styles.cardIcon}>
                  <Text style={styles.iconText}>{item.icon}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </Pressable>
          );

          return item.route ? (
            <Link key={item.title} href={item.route} asChild>
              {card}
            </Link>
          ) : (
            card
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
    paddingHorizontal: 16,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  cardWrap: {
    marginTop: 8,
    paddingBottom: 24,
  },
  card: {
    width: "100%",
    minHeight: 100,
    backgroundColor: "#1c1f25",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 26,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 14,
    flexShrink: 1,
  },
  cardArrow: {
    color: "#8f96a3",
    fontSize: 22,
    marginLeft: 12,
  },
});
