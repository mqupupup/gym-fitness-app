import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CANDITO_PROGRAM } from "../../../src/data/candito-data";

export default function CanditoPlanIndex() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Candito 6周" });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Candito 6周" }} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="trending-up-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Candito 6周</Text>
            <Text style={styles.headerSubtitle}>
              线性进阶周期计划，结构清晰，系统提升三大项
            </Text>
          </View>
        </View>

        {/* 开始按钮 */}
        <Pressable
          style={styles.startCard}
          onPress={() => router.push("/powerlifting-plans/candito-6-week/candito-input")}
        >
          <View style={styles.startIcon}>
            <Ionicons name="play-circle-outline" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.startContent}>
            <Text style={styles.startTitle}>开始训练计划</Text>
            <Text style={styles.startSubtitle}>输入三大项 1RM，自动生成6周训练重量</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>

        {/* 计划说明卡片 */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={18} color="#6A4C93" />
            <Text style={styles.infoTitle}>计划说明</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              深蹲可选择高杠或低杠，硬拉可选择传统式或相扑式
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              MR = 使用指定重量，尽可能多次重复，直到力竭
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              MR10 = 使用指定重量，做到 10 次仍未力竭则停止
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              任何规定次数出现力竭，立即将 1RM 重量减少 2.5%
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              第5周记录极限组完成次数，用于第6周预估新1RM
            </Text>
          </View>
        </View>

        {/* 周计划概览 */}
        <Text style={styles.sectionTitle}>6周计划概览</Text>
        {Object.values(CANDITO_PROGRAM).map((week: any) => (
          <View key={week.id} style={styles.weekCard}>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>第{week.id}周</Text>
            </View>
            <View style={styles.weekContent}>
              <Text style={styles.weekTitle}>{week.title.replace(/^第\d+周[：:]/, "")}</Text>
              <Text style={styles.weekFocus}>{week.focus}</Text>
            </View>
            <Text style={styles.weekDays}>{week.days.length}天</Text>
          </View>
        ))}

        <View style={{ height: 20 }} />
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
  startCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6A4C93",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    gap: 14,
    shadowColor: "#6A4C93",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  startIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
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
    marginBottom: 2,
  },
  startSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  infoBullet: {
    fontSize: 13,
    color: "#6A4C93",
    fontWeight: "700",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#3C3C43",
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  weekCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  weekBadge: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  weekTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  weekFocus: {
    fontSize: 12,
    color: "#8E8E93",
  },
  weekDays: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6A4C93",
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
