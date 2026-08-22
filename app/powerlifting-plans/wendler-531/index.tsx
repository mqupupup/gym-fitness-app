import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Wendler531Page() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Wendler 5-3-1" });
  }, [navigation]);

  const actions = [
    {
      id: "start",
      title: "开始设置参数",
      subtitle: "输入你的 1RM，生成个性化训练计划",
      icon: "create-outline",
      color: "#6A4C93",
      onPress: () => router.push(`/powerlifting-plans/wendler-531/wendler-input`),
    },
  ];

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

        {/* 操作卡片列表 */}
        {actions.map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.actionCardPressed,
            ]}
            onPress={action.onPress}
            android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
          >
            <View style={styles.actionIcon}>
              <Ionicons name={action.icon as any} size={22} color="#6A4C93" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
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
    marginBottom: 12,
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
  introRowLast: {
    marginBottom: 0,
  },
  introText: {
    flex: 1,
    fontSize: 13,
    color: "#3C3C43",
    lineHeight: 18,
  },

  // 操作卡片
  actionCard: {
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
  actionCardPressed: {
    backgroundColor: "#FAFAFC",
    transform: [{ scale: 0.99 }],
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 17,
  },
});
