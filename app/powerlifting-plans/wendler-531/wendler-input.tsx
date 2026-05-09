import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function WendlerInput() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    navigation.setOptions({
      title: "Wendler计划设置",
      headerTitle: "Wendler计划设置",
    });
  }, [navigation]);

  const [formData, setFormData] = useState({
    weight: "",
    barWeight: "20",
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
    // 使用Brzycki公式估算1RM
    return weight * (36 / (37 - reps));
  };

  const handleCalculatePlan = () => {
    // 验证必填字段
    if (
      !formData.weight ||
      !formData.squatWeight ||
      !formData.benchWeight ||
      !formData.deadliftWeight ||
      !formData.pressWeight
    ) {
      Alert.alert("错误", "请填写所有必填字段");
      return;
    }

    // 计算1RM值
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

    // 构建计划数据
    const planData = {
      userWeight: parseFloat(formData.weight),
      barWeight: parseFloat(formData.barWeight),
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

    // 导航到详情页面并传递数据
    router.push({
      pathname: "./wendler-detail",
      params: { planData: JSON.stringify(planData) },
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 处理输入框聚焦，自动滚动到可见区域
  const handleTextInputFocus = (
    scrollView: ScrollView | null,
    index: number,
  ) => {
    if (scrollView) {
      // 延迟一点时间确保键盘已经弹起
      setTimeout(() => {
        scrollView.scrollTo({
          y: index * 80 - 100, // 根据输入框位置调整滚动距离
          animated: true,
        });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Wendler 5-3-1 计划设置</Text>

          {/* 用户基本信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>用户信息</Text>
            <View style={styles.inputRow}>
              <Text style={styles.label}>体重 (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(value) => updateField("weight", value)}
                keyboardType="numeric"
                placeholder="例如: 85"
                onFocus={() => handleTextInputFocus(scrollViewRef.current, 0)}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>杠铃重量 (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.barWeight}
                onChangeText={(value) => updateField("barWeight", value)}
                keyboardType="numeric"
                placeholder="默认: 20"
                onFocus={() => handleTextInputFocus(scrollViewRef.current, 1)}
              />
            </View>
          </View>

          {/* 四项动作输入 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>四项动作最大重量</Text>

            <View style={styles.liftInput}>
              <Text style={styles.liftTitle}>深蹲 (Squat)</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>重量 (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.squatWeight}
                  onChangeText={(value) => updateField("squatWeight", value)}
                  keyboardType="numeric"
                  placeholder="例如: 140"
                  onFocus={() => handleTextInputFocus(scrollViewRef.current, 2)}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>次数</Text>
                <TextInput
                  style={styles.input}
                  value={formData.squatReps}
                  onChangeText={(value) => updateField("squatReps", value)}
                  keyboardType="numeric"
                  placeholder="例如: 5"
                  onFocus={() => handleTextInputFocus(scrollViewRef.current, 3)}
                />
              </View>
            </View>

            <View style={styles.liftInput}>
              <Text style={styles.liftTitle}>卧推 (Bench Press)</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>重量 (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.benchWeight}
                  onChangeText={(value) => updateField("benchWeight", value)}
                  keyboardType="numeric"
                  placeholder="例如: 90"
                  onFocus={() => handleTextInputFocus(scrollViewRef.current, 4)}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>次数</Text>
                <TextInput
                  style={styles.input}
                  value={formData.benchReps}
                  onChangeText={(value) => updateField("benchReps", value)}
                  keyboardType="numeric"
                  placeholder="例如: 5"
                  onFocus={() => handleTextInputFocus(scrollViewRef.current, 5)}
                />
              </View>
            </View>

            <View style={styles.liftInput}>
              <Text style={styles.liftTitle}>硬拉 (Deadlift)</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>重量 (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.deadliftWeight}
                  onChangeText={(value) => updateField("deadliftWeight", value)}
                  keyboardType="numeric"
                  placeholder="例如: 160"
                  onFocus={() => handleTextInputFocus(scrollViewRef.current, 6)}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>次数</Text>
                <TextInput
                  style={styles.input}
                  value={formData.deadliftReps}
                  onChangeText={(value) => updateField("deadliftReps", value)}
                  keyboardType="numeric"
                  placeholder="例如: 5"
                  onFocus={() => handleTextInputFocus(scrollViewRef.current, 7)}
                />
              </View>
            </View>

            <View style={styles.liftInput}>
              <Text style={styles.liftTitle}>推举 (Shoulder Press)</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>重量 (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.pressWeight}
                  onChangeText={(value) => updateField("pressWeight", value)}
                  keyboardType="numeric"
                  placeholder="例如: 60"
                  onFocus={() => handleTextInputFocus(scrollViewRef.current, 8)}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>次数</Text>
                <TextInput
                  style={styles.input}
                  value={formData.pressReps}
                  onChangeText={(value) => updateField("pressReps", value)}
                  keyboardType="numeric"
                  placeholder="例如: 5"
                  onFocus={() => handleTextInputFocus(scrollViewRef.current, 9)}
                />
              </View>
            </View>
          </View>

          {/* 进步速率设置 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>每周期进步速率 (4周)</Text>
            <View style={styles.inputRow}>
              <Text style={styles.label}>深蹲增加 (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.squatProgression}
                onChangeText={(value) => updateField("squatProgression", value)}
                keyboardType="numeric"
                placeholder="例如: 10"
                onFocus={() => handleTextInputFocus(scrollViewRef.current, 10)}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>卧推增加 (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.benchProgression}
                onChangeText={(value) => updateField("benchProgression", value)}
                keyboardType="numeric"
                placeholder="例如: 5"
                onFocus={() => handleTextInputFocus(scrollViewRef.current, 11)}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>硬拉增加 (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.deadliftProgression}
                onChangeText={(value) =>
                  updateField("deadliftProgression", value)
                }
                keyboardType="numeric"
                placeholder="例如: 10"
                onFocus={() => handleTextInputFocus(scrollViewRef.current, 12)}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>推举增加 (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.pressProgression}
                onChangeText={(value) => updateField("pressProgression", value)}
                keyboardType="numeric"
                placeholder="例如: 5"
                onFocus={() => handleTextInputFocus(scrollViewRef.current, 13)}
              />
            </View>
          </View>

          {/* 辅助训练设置 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Boring But Big 辅助训练</Text>
            <View style={styles.inputRow}>
              <Text style={styles.label}>辅助训练百分比 (%)</Text>
              <TextInput
                style={styles.input}
                value={formData.bbbPercentage}
                onChangeText={(value) => updateField("bbbPercentage", value)}
                keyboardType="numeric"
                placeholder="例如: 50"
                onFocus={() => handleTextInputFocus(scrollViewRef.current, 14)}
              />
            </View>
          </View>

          {/* 开始按钮 */}
          <Pressable style={styles.startButton} onPress={handleCalculatePlan}>
            <Text style={styles.startButtonText}>生成训练计划</Text>
          </Pressable>

          {/* 底部填充，确保按钮不会被键盘遮挡 */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
  },
  title: {
    color: "#1C1C1E",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  liftInput: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
  },
  liftTitle: {
    color: "#1C1C1E",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#4A4A4A",
    fontSize: 14,
    flex: 1,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    width: 100,
    textAlign: "right",
  },
  startButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 20,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
