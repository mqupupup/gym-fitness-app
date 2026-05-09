import { useNavigation } from "expo-router";
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
import { useTrainingLog } from "../../../src/hooks/useTrainingLog";

export default function TexasLog() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const { saveLog, loading } = useTrainingLog();

  // Texas 特有状态
  const [trainingDay, setTrainingDay] = useState<
    "volume" | "recovery" | "intensity"
  >("volume");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    exercise: "",
    weight: "",
    reps: "",
    notes: "",
  });

  const exercises = ["深蹲", "卧推", "硬拉", "推举"];

  // 根据训练日设置默认次数
  const getDefaultReps = () => {
    if (trainingDay === "volume") return "5"; // 5×5
    if (trainingDay === "recovery") return "3"; // 5×3
    if (trainingDay === "intensity") return "5"; // 1×5（冲击重量）
    return "5";
  };

  useEffect(() => {
    // 设置默认次数
    setFormData((prev) => ({ ...prev, reps: getDefaultReps() }));
  }, [trainingDay]);

  useEffect(() => {
    navigation.setOptions({
      title: "德州训练法",
      headerTitle: "德州训练法",
    });
  }, [navigation]);

  const handleSaveLog = async () => {
    if (!formData.exercise || !formData.weight) {
      Alert.alert("错误", "请填写动作和重量");
      return;
    }

    const success = await saveLog({
      date: formData.date,
      exercise: formData.exercise,
      weight: parseFloat(formData.weight),
      reps: parseInt(formData.reps) || 5,
      notes: `Texas Method - ${trainingDay === "volume" ? "容量日" : trainingDay === "recovery" ? "恢复日" : "强度日"}${formData.notes ? ` | ${formData.notes}` : ""}`,
    });

    if (success) {
      Alert.alert("成功", "训练记录已保存！");
      setFormData({
        date: new Date().toISOString().split("T")[0],
        exercise: "",
        weight: "",
        reps: getDefaultReps(),
        notes: "",
      });
    } else {
      Alert.alert("错误", "保存失败，请重试");
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={insets.top + 60}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>德州训练法</Text>
          <Text style={styles.subtitle}>记录您的每次训练表现</Text>

          {/* 训练日选择 */}
          <View style={styles.daySelector}>
            <Pressable
              style={[
                styles.dayButton,
                trainingDay === "volume" && styles.dayButtonActive,
              ]}
              onPress={() => setTrainingDay("volume")}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  trainingDay === "volume" && styles.dayButtonTextActive,
                ]}
              >
                容量日
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayButton,
                trainingDay === "recovery" && styles.dayButtonActive,
              ]}
              onPress={() => setTrainingDay("recovery")}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  trainingDay === "recovery" && styles.dayButtonTextActive,
                ]}
              >
                恢复日
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayButton,
                trainingDay === "intensity" && styles.dayButtonActive,
              ]}
              onPress={() => setTrainingDay("intensity")}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  trainingDay === "intensity" && styles.dayButtonTextActive,
                ]}
              >
                强度日
              </Text>
            </Pressable>
          </View>

          <View style={styles.logForm}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>日期</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(value) => updateField("date", value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>动作</Text>
              <View style={styles.exerciseSelector}>
                {exercises.map((exercise) => (
                  <Pressable
                    key={exercise}
                    style={[
                      styles.exerciseButton,
                      formData.exercise === exercise &&
                        styles.exerciseButtonActive,
                    ]}
                    onPress={() => updateField("exercise", exercise)}
                  >
                    <Text
                      style={[
                        styles.exerciseButtonText,
                        formData.exercise === exercise &&
                          styles.exerciseButtonTextActive,
                      ]}
                    >
                      {exercise}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>重量 (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(value) => updateField("weight", value)}
                keyboardType="numeric"
                placeholder="例如: 100"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>次数</Text>
              <TextInput
                style={styles.input}
                value={formData.reps}
                onChangeText={(value) => updateField("reps", value)}
                keyboardType="numeric"
                placeholder={getDefaultReps()}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>备注</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(value) => updateField("notes", value)}
                placeholder="RPE、技术要点、感受等"
                multiline
                numberOfLines={3}
              />
            </View>

            <Pressable
              style={styles.saveButton}
              onPress={handleSaveLog}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading
                  ? "保存中..."
                  : `保存 ${trainingDay === "volume" ? "5×5" : trainingDay === "recovery" ? "5×3" : "1×5"}`}
              </Text>
            </Pressable>
          </View>

          {/* Texas 说明 */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>德州训练法说明</Text>
            <Text style={styles.infoText}>
              • 容量日：5组×5次（上周强度日重量的90%）
            </Text>
            <Text style={styles.infoText}>
              • 恢复日：5组×3次（容量日重量的80-90%）
            </Text>
            <Text style={styles.infoText}>• 强度日：1组×5次（冲击新重量）</Text>
            <Text style={styles.infoText}>• 每周重量递增2.5-5kg</Text>
          </View>

          <View style={{ height: 150 }} />
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  title: {
    color: "#1C1C1E",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  daySelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 12,
  },
  dayButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dayButtonActive: {
    backgroundColor: "#FF9500",
    borderColor: "#FF9500",
  },
  dayButtonText: {
    color: "#4A4A4A",
    fontSize: 14,
    fontWeight: "500",
  },
  dayButtonTextActive: {
    color: "#FFFFFF",
  },
  logForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputRow: {
    marginBottom: 16,
  },
  label: {
    color: "#4A4A4A",
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  exerciseSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exerciseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  exerciseButtonActive: {
    backgroundColor: "#FF9500",
    borderColor: "#FF9500",
  },
  exerciseButtonText: {
    color: "#4A4A4A",
    fontSize: 14,
  },
  exerciseButtonTextActive: {
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#FF9500",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoText: {
    color: "#4A4A4A",
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
});
