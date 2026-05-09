// app/powerlifting-plans/candito-6-week/index.tsx

import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CANDITO_PROGRAM } from "./candito-data";

export default function CanditoPlanIndex() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.header}>Candito 6周力量举训练计划</Text>
        <Text style={styles.subHeader}>
          "当今力量举领域最合乎逻辑的训练计划" - PowerliftingtoWin
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 计划说明</Text>
          <Text style={styles.infoText}>
            • 深蹲可选择高杠或低杠，硬拉可选择传统式或相扑式
          </Text>
          <Text style={styles.infoText}>
            • MR = 使用指定重量，尽可能多次重复，直到力竭
          </Text>
          <Text style={styles.infoText}>
            • MR10 =
            使用指定重量，尽可能多次重复，但如果做到10次仍未力竭，则停止
          </Text>
          <Text style={styles.infoText}>
            • 如果在任何需要完成规定次数时出现力竭，立即将1RM重量减少2.5%
          </Text>
        </View>

        <Text style={styles.sectionTitle}>🏋️ 训练周计划</Text>

        {Object.values(CANDITO_PROGRAM).map((week) => (
          <Link
            key={week.id}
            href={`/powerlifting-plans/candito-6-week/week?weekId=${week.id}`}
            style={styles.weekCard}
          >
            <View style={styles.weekContent}>
              <Text style={styles.weekNumber}>第{week.id}周</Text>
              <Text style={styles.weekTitle}>{week.title}</Text>
              <Text style={styles.weekFocus}>{week.focus}</Text>
              <Text style={styles.weekDescription}>{week.description}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A365D",
    textAlign: "center",
    marginVertical: 20,
  },
  subHeader: {
    fontSize: 14,
    color: "#E53E3E",
    textAlign: "center",
    marginBottom: 24,
    fontStyle: "italic",
  },
  infoCard: {
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#C3DAF9",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B6CB0",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#4A5568",
    marginBottom: 8,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A365D",
    marginBottom: 16,
  },
  weekCard: {
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C3DAF9",
  },
  weekContent: {
    flex: 1,
  },
  weekNumber: {
    fontSize: 12,
    color: "#A0AEC0",
    fontWeight: "600",
    marginBottom: 4,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A365D",
    marginBottom: 4,
  },
  weekFocus: {
    fontSize: 14,
    color: "#2B6CB0",
    fontWeight: "600",
  },
  weekDescription: {
    fontSize: 12,
    color: "#A0AEC0",
    marginTop: 4,
  },
  chevron: {
    color: "#2B6CB0",
    fontSize: 24,
    marginLeft: 12,
  },
});
