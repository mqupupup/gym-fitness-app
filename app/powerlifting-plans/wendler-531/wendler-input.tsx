import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LIFT_FIELDS = [
  { key: "squat", label: "深蹲", weightPlaceholder: "例如: 140" },
  { key: "bench", label: "卧推", weightPlaceholder: "例如: 90" },
  { key: "deadlift", label: "硬拉", weightPlaceholder: "例如: 160" },
  { key: "press", label: "推举", weightPlaceholder: "例如: 60" },
];

export default function WendlerInput() {
  const router = useRouter();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Wendler 计划设置" });
  }, [navigation]);

  const [formData, setFormData] = useState({
    squatWeight: "",
    squatReps: "5",
    benchWeight: "",
    benchReps: "5",
    deadliftWeight: "",
    deadliftReps: "5",
    pressWeight: "",
    pressReps: "5",
    squatProgression: "10",
    benchProgression: "5",
    deadliftProgression: "10",
    pressProgression: "5",
    bbbPercentage: "50",
  });

  const calculateOneRepMax = (weight: number, reps: number): number => {
    return weight * (36 / (37 - reps));
  };

  const handleCalculatePlan = () => {
    if (
      !formData.squatWeight ||
      !formData.benchWeight ||
      !formData.deadliftWeight ||
      !formData.pressWeight
    ) {
      Alert.alert("请填写所有动作的重量");
      return;
    }

    const squat1RM = calculateOneRepMax(
      parseFloat(formData.squatWeight),
      parseInt(formData.squatReps),
    );
    const bench1RM = calculateOneRepMax(
      parseFloat(formData.benchWeight),
      parseInt(formData.benchReps),
    );
    const deadlift1RM = calculateOneRepMax(
      parseFloat(formData.deadliftWeight),
      parseInt(formData.deadliftReps),
    );
    const press1RM = calculateOneRepMax(
      parseFloat(formData.pressWeight),
      parseInt(formData.pressReps),
    );

    const planData = {
      lifts: {
        squat: {
          weight: parseFloat(formData.squatWeight),
          reps: parseInt(formData.squatReps),
          oneRepMax: squat1RM,
        },
        bench: {
          weight: parseFloat(formData.benchWeight),
          reps: parseInt(formData.benchReps),
          oneRepMax: bench1RM,
        },
        deadlift: {
          weight: parseFloat(formData.deadliftWeight),
          reps: parseInt(formData.deadliftReps),
          oneRepMax: deadlift1RM,
        },
        press: {
          weight: parseFloat(formData.pressWeight),
          reps: parseInt(formData.pressReps),
          oneRepMax: press1RM,
        },
      },
      progression: {
        squat: parseFloat(formData.squatProgression),
        bench: parseFloat(formData.benchProgression),
        deadlift: parseFloat(formData.deadliftProgression),
        press: parseFloat(formData.pressProgression),
      },
      bbbPercentage: parseFloat(formData.bbbPercentage),
    };

    router.push({
      pathname: "./wendler-detail",
      params: { planData: JSON.stringify(planData) },
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: "Wendler 计划设置" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : undefined}
        keyboardVerticalOffset={insets.top + 44}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* 顶部标题区 */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="create-outline" size={24} color="#6A4C93" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Wendler 计划设置</Text>
              <Text style={styles.headerSubtitle}>
                输入你的数据，生成个性化 4 周训练计划
              </Text>
            </View>
          </View>

          {/* 四项动作输入 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>四项动作训练数据</Text>
            <Text style={styles.sectionHint}>输入你最近能完成的训练重量和次数，系统自动推算 1RM</Text>
            {LIFT_FIELDS.map((lift, index) => (
              <View
                key={lift.key}
                style={[
                  styles.liftCard,
                  index === LIFT_FIELDS.length - 1 && styles.liftCardLast,
                ]}
              >
                <Text style={styles.liftTitle}>{lift.label}</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>重量</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={
                        formData[`${lift.key}Weight` as keyof typeof formData]
                      }
                      onChangeText={(value) =>
                        updateField(`${lift.key}Weight`, value)
                      }
                      keyboardType="numeric"
                      placeholder={lift.weightPlaceholder}
                      placeholderTextColor="#C7C7CC"
                    />
                    <Text style={styles.unit}>kg</Text>
                  </View>
                </View>
                <View style={styles.inputGroupLast}>
                  <Text style={styles.inputLabel}>次数</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={
                        formData[`${lift.key}Reps` as keyof typeof formData]
                      }
                      onChangeText={(value) =>
                        updateField(`${lift.key}Reps`, value)
                      }
                      keyboardType="numeric"
                      placeholder="例如: 5"
                      placeholderTextColor="#C7C7CC"
                    />
                    <Text style={styles.unit}>次</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* 进步速率设置 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>每周期进步速率</Text>
            {LIFT_FIELDS.map((lift, index) => (
              <View
                key={lift.key}
                style={[
                  styles.inputGroup,
                  index === LIFT_FIELDS.length - 1 && styles.inputGroupLast,
                ]}
              >
                <Text style={styles.inputLabel}>{lift.label}增加</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={
                      formData[
                        `${lift.key}Progression` as keyof typeof formData
                      ]
                    }
                    onChangeText={(value) =>
                      updateField(`${lift.key}Progression`, value)
                    }
                    keyboardType="numeric"
                    placeholder="例如: 10"
                    placeholderTextColor="#C7C7CC"
                  />
                  <Text style={styles.unit}>kg</Text>
                </View>
              </View>
            ))}
          </View>

          {/* 辅助训练设置 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>BBB 辅助训练</Text>
            <View style={styles.inputGroupLast}>
              <Text style={styles.inputLabel}>辅助训练百分比</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={formData.bbbPercentage}
                  onChangeText={(value) => updateField("bbbPercentage", value)}
                  keyboardType="numeric"
                  placeholder="例如: 50"
                  placeholderTextColor="#C7C7CC"
                />
                <Text style={styles.unit}>%</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 底部按钮（固定位置，手动控制底部安全区） */}
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
            onPress={handleCalculatePlan}
            android_ripple={{ color: "rgba(255,255,255,0.15)" }}
          >
            <Ionicons name="flash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>生成训练计划</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
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
    paddingBottom: 20,
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

  // 区域卡片
  sectionCard: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 14,
    lineHeight: 17,
  },

  // 动作卡片
  liftCard: {
    backgroundColor: "#F7F6FA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  liftCardLast: {
    marginBottom: 0,
  },
  liftTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6A4C93",
    marginBottom: 10,
  },

  // 输入组
  inputGroup: {
    marginBottom: 10,
  },
  inputGroupLast: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3C3C43",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EDEDF0",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 15,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  unit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginLeft: 8,
  },

  // 底部按钮
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#F7F6FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E5",
  },
  submitButton: {
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
  submitButtonPressed: {
    backgroundColor: "#5A3D80",
    transform: [{ scale: 0.98 }],
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
