import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  Alert,
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
import {
  DEFAULT_TEST_REPS,
  get5RM,
  getStartingWeight,
  MadcowTestInputs,
} from "../../../src/data/madcow-data";

const INITIAL_INPUTS: MadcowTestInputs = {
  squat: 0,
  bench: 0,
  row: 0,
  press: 0,
  deadlift: 0,
};

const INPUT_FIELDS: {
  label: string;
  field: keyof MadcowTestInputs;
  reps: number;
  icon: string;
}[] = [
  { label: "深蹲", field: "squat", reps: DEFAULT_TEST_REPS.squat, icon: "body-outline" },
  { label: "卧推", field: "bench", reps: DEFAULT_TEST_REPS.bench, icon: "body-outline" },
  { label: "俯身划船", field: "row", reps: DEFAULT_TEST_REPS.row, icon: "body-outline" },
  { label: "直立杠铃推举", field: "press", reps: DEFAULT_TEST_REPS.press, icon: "body-outline" },
  { label: "硬拉", field: "deadlift", reps: DEFAULT_TEST_REPS.deadlift, icon: "body-outline" },
];

export default function MadcowInput() {
  const router = useRouter();
  const navigation = useNavigation();
  const [inputs, setInputs] = useState<MadcowTestInputs>(INITIAL_INPUTS);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Madcow参数设置" });
  }, [navigation]);

  const updateField = (field: keyof MadcowTestInputs, value: string) => {
    const num = parseFloat(value);
    setInputs((prev) => ({ ...prev, [field]: isNaN(num) ? 0 : num }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const previews = useMemo(() => {
    return INPUT_FIELDS.map((f) => ({
      field: f.field,
      start: getStartingWeight(inputs[f.field], f.reps),
      fiveRM: get5RM(inputs[f.field], f.reps),
    }));
  }, [inputs]);

  const handleGenerate = () => {
    const newErrors: Record<string, boolean> = {};
    let hasError = false;
    INPUT_FIELDS.forEach((f) => {
      if (!inputs[f.field] || inputs[f.field] <= 0) {
        newErrors[f.field] = true;
        hasError = true;
      }
    });
    setErrors(newErrors);
    if (hasError) {
      Alert.alert("请输入有效的测试重量");
      return;
    }

    const params = new URLSearchParams({
      squat: String(inputs.squat),
      bench: String(inputs.bench),
      row: String(inputs.row),
      press: String(inputs.press),
      deadlift: String(inputs.deadlift),
    }).toString();

    router.push(`/powerlifting-plans/madcow/week?week=1&${params}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 顶部标题区 */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="trending-up-outline" size={24} color="#6A4C93" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Madcow 5x5</Text>
              <Text style={styles.headerSubtitle}>
                输入测试重量，自动生成12周直线力量进阶计划
              </Text>
            </View>
          </View>

          {/* 输入卡片 */}
          <View style={styles.inputCard}>
            <Text style={styles.cardTitle}>测试重量</Text>
            <Text style={styles.cardSubtitle}>
              你能标准完成指定次数的最大重量
            </Text>

            {INPUT_FIELDS.map((item) => (
              <View key={item.field} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {item.label}
                  <Text style={styles.inputReps}> · {item.reps}RM</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors[item.field] && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={inputs[item.field] ? String(inputs[item.field]) : ""}
                    onChangeText={(v) => updateField(item.field, v)}
                    placeholder={`请输入你的${item.reps}RM重量`}
                    placeholderTextColor="#C7C7CC"
                  />
                  <Text style={styles.inputUnit}>kg</Text>
                </View>
                {errors[item.field] && (
                  <Text style={styles.errorText}>请输入有效的重量</Text>
                )}
              </View>
            ))}
          </View>

          {/* 起始重量预览 */}
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Ionicons name="eye-outline" size={16} color="#6A4C93" />
              <Text style={styles.previewTitle}>第1周起始重量预览</Text>
            </View>
            <View style={styles.previewGrid}>
              {previews.map((p) => {
                const field = INPUT_FIELDS.find((f) => f.field === p.field);
                return (
                  <View key={p.field} style={styles.previewItem}>
                    <Text style={styles.previewLabel}>{field?.label}</Text>
                    <Text style={styles.previewValue}>
                      {p.start}
                      <Text style={styles.previewUnit}>kg</Text>
                    </Text>
                    <Text style={styles.previewSub}>5RM {p.fiveRM}kg</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 说明卡片 */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle-outline" size={16} color="#6A4C93" />
              <Text style={styles.infoTitle}>计划说明</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                每周3天：周一正式组日、周三轻量恢复日、周五强度突破日
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                前4组递增热身（组间12.5%），最后1组正式组
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                周五加1×3强度组（+2.5%）和1×8容量组，下周正式组=本周1×3
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>第4周匹配5RM PR，所有重量按2.5kg取整</Text>
            </View>
          </View>
        </ScrollView>

        {/* 固定底部按钮 */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.generateButton,
              pressed && styles.generateButtonPressed,
            ]}
            onPress={handleGenerate}
            android_ripple={{ color: "rgba(255,255,255,0.15)" }}
          >
            <Ionicons name="flash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.generateButtonText}>生成12周训练计划</Text>
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
  scrollView: {
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
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
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
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 16,
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
  inputReps: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8E8E93",
  },
  inputWrapper: {
    flex: 1,
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
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
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
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginLeft: 8,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 6,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  previewItem: {
    width: "31%",
    backgroundColor: "#F7F6FA",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6A4C93",
  },
  previewUnit: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
  },
  previewSub: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6A4C93",
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  generateButtonPressed: {
    backgroundColor: "#5A3D80",
    transform: [{ scale: 0.98 }],
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
