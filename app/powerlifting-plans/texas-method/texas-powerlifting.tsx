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

export default function TexasPowerlifting() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const { saveLog, loading } = useTrainingLog();

  const [currentDay, setCurrentDay] = useState<
    "monday" | "wednesday" | "friday"
  >("monday");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    exercise: "",
    weight: "",
    reps: "",
    notes: "",
  });

  const exercises = ["深蹲", "卧推", "硬拉", "推举"];

  const getRecommendedExercises = () => {
    if (currentDay === "monday") return ["深蹲", "卧推"];
    if (currentDay === "wednesday") return ["深蹲", "推举"];
    if (currentDay === "friday") return ["深蹲", "卧推", "硬拉"];
    return exercises;
  };

  const getDayTitle = () => {
    const titles = {
      monday: "周一：容量日 (Volume Day)",
      wednesday: "周三：恢复日 (Recovery Day)",
      friday: "周五：强度日 (Intensity Day)",
    };
    return titles[currentDay];
  };

  useEffect(() => {
    navigation.setOptions({
      title: "德州-力量举3日",
      headerTitle: "德州-力量举3日",
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
      notes: `Texas Powerlifting - ${getDayTitle()}${formData.notes ? ` | ${formData.notes}` : ""}`,
    });

    if (success) {
      Alert.alert("成功", "训练记录已保存！");
      setFormData((prev) => ({
        ...prev,
        weight: "",
        reps: "",
        notes: "",
      }));
    } else {
      Alert.alert("错误", "保存失败，请重试");
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const recommendedExercises = getRecommendedExercises();

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
          <Text style={styles.title}>专注力量举3日计划</Text>

          {/* 训练日选择 */}
          <View style={styles.daySelector}>
            <Pressable
              style={[
                styles.dayButton,
                currentDay === "monday" && styles.dayButtonActive,
              ]}
              onPress={() => setCurrentDay("monday")}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  currentDay === "monday" && styles.dayButtonTextActive,
                ]}
              >
                周一
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayButton,
                currentDay === "wednesday" && styles.dayButtonActive,
              ]}
              onPress={() => setCurrentDay("wednesday")}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  currentDay === "wednesday" && styles.dayButtonTextActive,
                ]}
              >
                周三
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayButton,
                currentDay === "friday" && styles.dayButtonActive,
              ]}
              onPress={() => setCurrentDay("friday")}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  currentDay === "friday" && styles.dayButtonTextActive,
                ]}
              >
                周五
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
                {recommendedExercises.map((exercise) => (
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
                placeholder="例如: 5"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>备注</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(value) => updateField("notes", value)}
                placeholder="RPE、技术要点等"
                multiline
                numberOfLines={2}
              />
            </View>

            <Pressable
              style={styles.saveButton}
              onPress={handleSaveLog}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "保存中..." : "保存训练记录"}
              </Text>
            </Pressable>
          </View>

          {/* 计划详情 */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>训练计划详情</Text>
            <Text style={styles.infoSubtitle}>专注力量举3日计划</Text>
            <Text style={styles.infoText}>
              • 周一：深蹲(1RM70%)×5×5, 卧推/推举(1RM70%)×5×5
            </Text>
            <Text style={styles.infoText}>
              • 周三：深蹲(周一80%)×5×2, 推举/卧推3×5
            </Text>
            <Text style={styles.infoText}>
              • 周五：深蹲(1RM90%×3, 93%×2×2, 96%×1×5), 卧推/推举同深蹲模式,
              硬拉1×3/1×2/1×1
            </Text>
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
    marginBottom: 20,
    textAlign: "center",
  },
  daySelector: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: "600",
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
  infoSubtitle: {
    color: "#FF9500",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    color: "#4A4A4A",
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
});
