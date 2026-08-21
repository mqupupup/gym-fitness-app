import { Stack, useNavigation } from "expo-router";
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

export default function TexasSplit() {
  const navigation = useNavigation();

  const [oneRMs, setOneRMs] = useState({
    squat: "",
    bench: "",
    deadlift: "",
    press: "",
  });

  const [currentDay, setCurrentDay] = useState<"monday" | "tuesday" | "thursday" | "friday">("monday");

  useLayoutEffect(() => {
    navigation.setOptions({ title: "德州-4日分化" });
  }, [navigation]);

  const getDayTitle = () => {
    const titles = {
      monday: "周一 · 容量日",
      tuesday: "周二 · 容量日",
      thursday: "周四 · 强度日",
      friday: "周五 · 强度日",
    };
    return titles[currentDay];
  };

  const calcWeight = (oneRM: string, percentage: number) => {
    const weight = parseFloat(oneRM);
    if (isNaN(weight) || weight <= 0) return "--";
    return (Math.round(weight * percentage * 2) / 2).toFixed(1);
  };

  const hasAny1RM = Object.values(oneRMs).some((v) => parseFloat(v) > 0);

  const update1RM = (key: string, value: string) => {
    setOneRMs((prev) => ({ ...prev, [key]: value }));
  };

  const dayConfigs = {
    monday: {
      type: "容量日",
      typeColor: "#6A4C93",
      typeBg: "#F3F0FF",
      exercises: [
        { name: "卧推", sets: "5×5", percentage: 0.7, oneRMKey: "bench", detail: "容量训练，注重动作质量" },
      ],
    },
    tuesday: {
      type: "容量日",
      typeColor: "#6A4C93",
      typeBg: "#F3F0FF",
      exercises: [
        { name: "深蹲", sets: "5×5", percentage: 0.7, oneRMKey: "squat", detail: "容量训练，注重动作质量" },
        { name: "硬拉", sets: "3×3", percentage: 0.65, oneRMKey: "deadlift", detail: "辅助训练，不要力竭" },
      ],
    },
    thursday: {
      type: "强度日",
      typeColor: "#FF3B30",
      typeBg: "#FFE8E8",
      exercises: [
        { name: "卧推", sets: "1×5", percentage: 0.82, oneRMKey: "bench", detail: "比上一次强度日增加1~1.5kg" },
      ],
    },
    friday: {
      type: "强度日",
      typeColor: "#FF3B30",
      typeBg: "#FFE8E8",
      exercises: [
        { name: "深蹲", sets: "1×5", percentage: 0.85, oneRMKey: "squat", detail: "比上一次强度日增加2.5kg" },
        { name: "硬拉", sets: "1×3", percentage: 0.85, oneRMKey: "deadlift", detail: "冲击新重量" },
      ],
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "德州-4日分化" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 顶部标题区 */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="grid-outline" size={24} color="#6A4C93" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>4 日分化计划</Text>
              <Text style={styles.headerSubtitle}>容量日与强度日分开，适合进阶训练者</Text>
            </View>
          </View>

          {/* 1RM 输入卡片 */}
          <View style={styles.inputCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="calculator-outline" size={18} color="#6A4C93" />
              <Text style={styles.cardTitle}>输入你的 1RM</Text>
            </View>
            <View style={styles.inputGrid}>
              {[
                { key: "squat", label: "深蹲" },
                { key: "bench", label: "卧推" },
                { key: "deadlift", label: "硬拉" },
                { key: "press", label: "推举" },
              ].map((item) => (
                <View key={item.key} style={styles.inputItem}>
                  <Text style={styles.inputLabel}>{item.label}</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.numberInput}
                      value={oneRMs[item.key as keyof typeof oneRMs]}
                      onChangeText={(v) => update1RM(item.key, v)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#C7C7CC"
                    />
                    <Text style={styles.inputUnit}>kg</Text>
                  </View>
                </View>
              ))}
            </View>
            {!hasAny1RM && (
              <Text style={styles.inputHint}>输入 1RM 后自动计算训练重量</Text>
            )}
          </View>

          {/* 训练日选择 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
            <View style={styles.daySelector}>
              {[
                { key: "monday", label: "周一", sub: "容量日" },
                { key: "tuesday", label: "周二", sub: "容量日" },
                { key: "thursday", label: "周四", sub: "强度日" },
                { key: "friday", label: "周五", sub: "强度日" },
              ].map((day) => (
                <Pressable
                  key={day.key}
                  style={[
                    styles.dayButton,
                    currentDay === day.key && styles.dayButtonActive,
                  ]}
                  onPress={() => setCurrentDay(day.key as typeof currentDay)}
                >
                  <Text style={[styles.dayButtonText, currentDay === day.key && styles.dayButtonTextActive]}>
                    {day.label}
                  </Text>
                  <Text style={[styles.dayButtonSub, currentDay === day.key && styles.dayButtonSubActive]}>
                    {day.sub}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* 训练计划详情 */}
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={[styles.planTypeBadge, { backgroundColor: dayConfigs[currentDay].typeBg }]}>
                <Text style={[styles.planTypeText, { color: dayConfigs[currentDay].typeColor }]}>
                  {dayConfigs[currentDay].type}
                </Text>
              </View>
              <Text style={styles.planDayTitle}>{getDayTitle()}</Text>
            </View>

            {dayConfigs[currentDay].exercises.map((ex, idx) => (
              <View key={idx} style={styles.exerciseBlock}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  <Text style={styles.exerciseSets}>{ex.sets}</Text>
                </View>
                {ex.detail && (
                  <Text style={styles.exerciseDetail}>{ex.detail}</Text>
                )}
                <View style={styles.weightRow}>
                  <Text style={styles.weightLabel}>参考重量</Text>
                  <Text style={styles.weightValue}>
                    {calcWeight(oneRMs[ex.oneRMKey as keyof typeof oneRMs], ex.percentage)} kg
                  </Text>
                  <Text style={styles.weightPct}>(约{Math.round(ex.percentage * 100)}% 1RM)</Text>
                </View>
              </View>
            ))}
          </View>

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
  keyboardAvoidingView: {
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
  logCard: {
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
    marginBottom: 14,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  inputItem: {
    width: "47%",
  },
  inputLabel: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 6,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F8",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  numberInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  inputUnit: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  inputHint: {
    fontSize: 12,
    color: "#6A4C93",
    marginTop: 10,
    textAlign: "center",
  },
  dayScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  daySelector: {
    flexDirection: "row",
    gap: 10,
  },
  dayButton: {
    width: 72,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8E8ED",
  },
  dayButtonActive: {
    backgroundColor: "#6A4C93",
    borderColor: "#6A4C93",
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C3C43",
  },
  dayButtonTextActive: {
    color: "#FFFFFF",
  },
  dayButtonSub: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  dayButtonSubActive: {
    color: "rgba(255,255,255,0.75)",
  },
  planCard: {
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
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F3",
  },
  planTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  planTypeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  planDayTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  exerciseBlock: {
    backgroundColor: "#F7F6FA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  exerciseSets: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6A4C93",
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  exerciseDetail: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 8,
    fontStyle: "italic",
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  weightLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  weightValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6A4C93",
  },
  weightPct: {
    fontSize: 12,
    color: "#8E8E93",
  },
});
