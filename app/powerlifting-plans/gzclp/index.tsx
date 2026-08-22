import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GZCLP_PROGRAM } from "../../../src/data/gzclp-data";

export default function GZCLPIndex() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "GZCLP 直线计划" });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="stats-chart-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>GZCLP 直线计划</Text>
            <Text style={styles.headerSubtitle}>
              T1 线性进阶 + T2 固定容量，系统化渐进超负荷训练
            </Text>
          </View>
        </View>

        {/* 数据统计卡片 */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>周计划</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>训练日/周</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>动作级别</Text>
          </View>
        </View>

        {/* 开始按钮 */}
        <Pressable
          style={({ pressed }) => [
            styles.startCard,
            pressed && styles.startCardPressed,
          ]}
          onPress={() => router.push("/powerlifting-plans/gzclp/gzclp-input")}
        >
          <View style={styles.startIcon}>
            <Ionicons name="play-circle-outline" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.startContent}>
            <Text style={styles.startTitle}>开始训练计划</Text>
            <Text style={styles.startSubtitle}>
              输入四项 5RM，自动计算 T1/T2 重量并生成 12 周计划
            </Text>
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
            <Text style={styles.infoBullet}>T1</Text>
            <Text style={styles.infoText}>
              主项动作，3×5+（最后一组尽力多做），起始重量 = 5RM×85%，每周递增 2.5kg
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>T2</Text>
            <Text style={styles.infoText}>
              辅助动作，10×3，固定重量 = 5RM×65%，全程不变
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>T3</Text>
            <Text style={styles.infoText}>
              自选辅助动作（俯身划船/引体向上），自选重量和次数
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>Reset</Text>
            <Text style={styles.infoText}>
              第 8 周起如无法完成 T1，降低 10-15% 重量重新线性进阶
            </Text>
          </View>
        </View>

        {/* 12周概览 */}
        <Text style={styles.sectionTitle}>12 周计划概览</Text>
        {GZCLP_PROGRAM.map((week) => (
          <View key={week.id} style={styles.weekCard}>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>WEEK {week.weekNumber}</Text>
            </View>
            <View style={styles.weekContent}>
              <Text style={styles.weekTitle}>
                {week.title.replace(/^第\d+周[：:]/, "")}
              </Text>
              <Text style={styles.weekDesc}>{week.description}</Text>
            </View>
            {week.isResetWeek && (
              <View style={styles.resetTag}>
                <Ionicons name="refresh-outline" size={12} color="#FF9500" />
                <Text style={styles.resetTagText}>可Reset</Text>
              </View>
            )}
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
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
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
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6A4C93",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#EDEDF0",
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
  startCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
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
    lineHeight: 16,
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
    marginBottom: 10,
    gap: 10,
  },
  infoBullet: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6A4C93",
    minWidth: 36,
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
    minWidth: 56,
    alignItems: "center",
  },
  weekBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6A4C93",
    letterSpacing: 0.5,
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
  weekDesc: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
  },
  resetTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  resetTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FF9500",
  },
});
