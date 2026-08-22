import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function CanditoInput() {
  const router = useRouter();
  const navigation = useNavigation();

  const [oneRMs, setOneRMs] = useState({
    squat: "",
    bench: "",
    deadlift: "",
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Candito 参数设置" });
  }, [navigation]);

  const update1RM = (key: string, value: string) => {
    setOneRMs((prev) => ({ ...prev, [key]: value }));
  };

  const handleStart = () => {
    if (!oneRMs.squat || !oneRMs.bench || !oneRMs.deadlift) {
      return;
    }
    const params = new URLSearchParams({
      squat: oneRMs.squat,
      bench: oneRMs.bench,
      deadlift: oneRMs.deadlift,
    }).toString();
    router.push(`/powerlifting-plans/candito-6-week/week?weekId=1&${params}`);
  };

  const allFilled = oneRMs.squat && oneRMs.bench && oneRMs.deadlift;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Candito 参数设置" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 顶部标题区 */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="create-outline" size={24} color="#6A4C93" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Candito 参数设置</Text>
              <Text style={styles.headerSubtitle}>
                输入三大项 1RM，自动计算每周训练重量
              </Text>
            </View>
          </View>

          {/* 1RM 输入卡片 */}
          <View style={styles.inputCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="calculator-outline" size={18} color="#6A4C93" />
              <Text style={styles.cardTitle}>输入你的 1RM</Text>
            </View>
            <Text style={styles.inputHint}>
              Candito 计划基于深蹲、卧推、硬拉三项 1RM 自动计算每周百分比重量
            </Text>

            {[
              { key: "squat", label: "深蹲", icon: "body-outline" },
              { key: "bench", label: "卧推", icon: "fitness-outline" },
              { key: "deadlift", label: "硬拉", icon: "barbell-outline" },
            ].map((item) => (
              <View key={item.key} style={styles.inputItem}>
                <View style={styles.inputItemHeader}>
                  <Ionicons name={item.icon as any} size={18} color="#6A4C93" />
                  <Text style={styles.inputLabel}>{item.label} 1RM</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.numberInput}
                    value={oneRMs[item.key as keyof typeof oneRMs]}
                    onChangeText={(v) => update1RM(item.key, v)}
                    keyboardType="numeric"
                    placeholder="例如: 140"
                    placeholderTextColor="#C7C7CC"
                  />
                  <Text style={styles.inputUnit}>kg</Text>
                </View>
              </View>
            ))}
          </View>

          {/* 计划说明 */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle-outline" size={18} color="#6A4C93" />
              <Text style={styles.cardTitle}>计划说明</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>MR = 使用指定重量，尽可能多次重复，直到力竭</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>MR10 = 使用指定重量，做到 10 次仍未力竭则停止</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>任何规定次数出现力竭，立即将 1RM 重量减少 2.5%</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>第5周记录极限组完成次数，用于第6周预估新1RM</Text>
            </View>
          </View>

          {/* 开始按钮 */}
          <Pressable
            style={[styles.startButton, !allFilled && styles.startButtonDisabled]}
            onPress={handleStart}
            disabled={!allFilled}
          >
            <Text style={styles.startButtonText}>
              {allFilled ? "生成训练计划" : "请填写三项 1RM"}
            </Text>
          </Pressable>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  inputHint: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 16,
    lineHeight: 17,
  },
  inputItem: {
    marginBottom: 16,
  },
  inputItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C3C43",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F8",
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  numberInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  inputUnit: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: "#F3F0FF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#6A4C93",
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
  startButton: {
    backgroundColor: "#6A4C93",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  startButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
