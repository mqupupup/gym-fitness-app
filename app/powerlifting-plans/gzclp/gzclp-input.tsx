import { useRouter } from "expo-router";
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
import { LIFT_NAMES, LiftKey, getT1StartingWeight, getT2Weight } from "../../../src/data/gzclp-data";

const LIFT_KEYS: LiftKey[] = ["squat", "bench", "deadlift", "press"];

export default function GZCLPInput() {
  const router = useRouter();
  const navigation = useNavigation();
  const [fiveRMs, setFiveRMs] = useState<Record<LiftKey, string>>({
    squat: "",
    bench: "",
    deadlift: "",
    press: "",
  });
  const [errors, setErrors] = useState<Record<LiftKey, boolean>>({
    squat: false,
    bench: false,
    deadlift: false,
    press: false,
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: "GZCLP参数设置" });
  }, [navigation]);

  const handleChange = (key: LiftKey, value: string) => {
    setFiveRMs((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleGenerate = () => {
    const newErrors: Record<LiftKey, boolean> = {
      squat: false,
      bench: false,
      deadlift: false,
      press: false,
    };
    let hasError = false;

    LIFT_KEYS.forEach((key) => {
      const val = parseFloat(fiveRMs[key]);
      if (!fiveRMs[key] || isNaN(val) || val <= 0) {
        newErrors[key] = true;
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (!hasError) {
      const params = new URLSearchParams({
        squat: fiveRMs.squat,
        bench: fiveRMs.bench,
        deadlift: fiveRMs.deadlift,
        press: fiveRMs.press,
      }).toString();
      router.push(`/powerlifting-plans/gzclp/week?week=1&${params}`);
    }
  };

  // 预览计算
  const previewWeights = LIFT_KEYS.map((key) => {
    const rm = parseFloat(fiveRMs[key]);
    if (!rm || isNaN(rm) || rm <= 0) return null;
    return {
      key,
      name: LIFT_NAMES[key],
      t1Start: getT1StartingWeight(rm),
      t2: getT2Weight(rm),
    };
  }).filter(Boolean);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 顶部说明 */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="calculator-outline" size={24} color="#6A4C93" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>输入四项 5RM</Text>
              <Text style={styles.headerSubtitle}>
                系统将自动计算 T1/T2 训练重量，生成 12 周计划
              </Text>
            </View>
          </View>

          {/* 说明卡片 */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={16} color="#6A4C93" />
              <Text style={styles.infoText}>
                5RM = 能完成 5 次的最大重量
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="trending-up-outline" size={16} color="#6A4C93" />
              <Text style={styles.infoText}>
                T1 起始重量 = 5RM × 85%，每周递增 2.5kg
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="resize-outline" size={16} color="#6A4C93" />
              <Text style={styles.infoText}>
                T2 固定重量 = 5RM × 65%，全程不变
              </Text>
            </View>
          </View>

          {/* 输入框 */}
          <Text style={styles.sectionTitle}>四项动作 5RM</Text>
          {LIFT_KEYS.map((key) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{LIFT_NAMES[key]}</Text>
              <View style={[styles.inputWrapper, errors[key] && styles.inputWrapperError]}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="请输入你的5RM重量"
                  placeholderTextColor="#C7C7CC"
                  value={fiveRMs[key]}
                  onChangeText={(v) => handleChange(key, v)}
                />
                <Text style={styles.inputUnit}>kg</Text>
              </View>
              {errors[key] && (
                <Text style={styles.errorText}>请输入有效的重量</Text>
              )}
            </View>
          ))}

          {/* 重量预览 */}
          {previewWeights.length > 0 && (
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>起始重量预览</Text>
              {previewWeights.map((item: any) => (
                <View key={item.key} style={styles.previewRow}>
                  <Text style={styles.previewName}>{item.name}</Text>
                  <View style={styles.previewValues}>
                    <View style={styles.previewValue}>
                      <Text style={styles.previewValueLabel}>T1</Text>
                      <Text style={styles.previewValueNum}>{item.t1Start}kg</Text>
                    </View>
                    <View style={styles.previewDivider} />
                    <View style={styles.previewValue}>
                      <Text style={styles.previewValueLabel}>T2</Text>
                      <Text style={styles.previewValueNum}>{item.t2}kg</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* 固定底部按钮 */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.generateButton,
              pressed && styles.generateButtonPressed,
            ]}
            onPress={handleGenerate}
          >
            <Text style={styles.generateButtonText}>生成 12 周训练计划</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FA",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#3C3C43",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperError: {
    borderColor: "#FF3B30",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    paddingRight: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlignVertical: "center",
  },
  inputUnit: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8E8E93",
    paddingLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F3",
  },
  previewName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C3C43",
  },
  previewValues: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewValue: {
    alignItems: "center",
  },
  previewValueLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginBottom: 2,
  },
  previewValueNum: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6A4C93",
  },
  previewDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E8E8ED",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    backgroundColor: "#F7F6FA",
    borderTopWidth: 1,
    borderTopColor: "#EDEDF0",
  },
  generateButton: {
    backgroundColor: "#6A4C93",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#6A4C93",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  generateButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
