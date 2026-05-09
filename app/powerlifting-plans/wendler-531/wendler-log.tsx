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

export default function WendlerLog() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { logs, loading, saveLog, getRecentLogs } = useTrainingLog();
  const scrollViewRef = useRef<ScrollView>(null);

  const [currentLog, setCurrentLog] = useState({
    date: new Date().toISOString().split("T")[0],
    exercise: "",
    weight: "",
    reps: "",
    notes: "",
  });

  const exercises = ["深蹲", "卧推", "硬拉", "推举"];

  useEffect(() => {
    navigation.setOptions({
      title: "训练记录",
      headerTitle: "训练记录",
    });
  }, [navigation]);

  // 当 TextInput 获得焦点时，滚动到该位置
  const handleTextInputFocus = (fieldName: string) => {
    // 延迟一点时间，确保键盘已经弹出
    setTimeout(() => {
      if (scrollViewRef.current) {
        const fieldIndex = [
          "date",
          "exercise",
          "weight",
          "reps",
          "notes",
        ].indexOf(fieldName);
        if (fieldIndex !== -1) {
          // 滚动到对应位置（粗略估算）
          const yOffset = fieldIndex * 80; // 每个字段大约80px高度
          scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
        }
      }
    }, 100);
  };

  const handleSaveLog = async () => {
    if (!currentLog.exercise || !currentLog.weight || !currentLog.reps) {
      Alert.alert("错误", "请填写完整训练记录");
      return;
    }

    const success = await saveLog({
      date: currentLog.date,
      exercise: currentLog.exercise,
      weight: parseFloat(currentLog.weight),
      reps: parseInt(currentLog.reps),
      notes: currentLog.notes,
    });

    if (success) {
      Alert.alert("成功", "训练记录已保存！");
      setCurrentLog({
        date: new Date().toISOString().split("T")[0],
        exercise: "",
        weight: "",
        reps: "",
        notes: "",
      });
    } else {
      Alert.alert("错误", "保存失败，请重试");
    }
  };

  const updateLogField = (field: string, value: string) => {
    setCurrentLog((prev) => ({ ...prev, [field]: value }));
  };

  const recentLogs = getRecentLogs(5);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* KeyboardAvoidingView 包裹整个内容 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={insets.top + 60} // 考虑状态栏和导航栏高度
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled" // 点击其他 TextInput 时不会收起键盘
        >
          <Text style={styles.title}>训练记录</Text>
          <Text style={styles.subtitle}>记录您的每次训练表现</Text>

          <View style={styles.logForm}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>日期</Text>
              <TextInput
                style={styles.input}
                value={currentLog.date}
                onChangeText={(value) => updateLogField("date", value)}
                placeholder="YYYY-MM-DD"
                onFocus={() => handleTextInputFocus("date")}
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
                      currentLog.exercise === exercise &&
                        styles.exerciseButtonActive,
                    ]}
                    onPress={() => updateLogField("exercise", exercise)}
                  >
                    <Text
                      style={[
                        styles.exerciseButtonText,
                        currentLog.exercise === exercise &&
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
                value={currentLog.weight}
                onChangeText={(value) => updateLogField("weight", value)}
                keyboardType="numeric"
                placeholder="例如: 100"
                onFocus={() => handleTextInputFocus("weight")}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>次数</Text>
              <TextInput
                style={styles.input}
                value={currentLog.reps}
                onChangeText={(value) => updateLogField("reps", value)}
                keyboardType="numeric"
                placeholder="例如: 5"
                onFocus={() => handleTextInputFocus("reps")}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>备注</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={currentLog.notes}
                onChangeText={(value) => updateLogField("notes", value)}
                placeholder="训练感受、技术要点等"
                multiline
                numberOfLines={3}
                onFocus={() => handleTextInputFocus("notes")}
              />
            </View>

            <Pressable
              style={styles.saveButton}
              onPress={handleSaveLog}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "保存中..." : "保存记录"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>最近训练记录</Text>

            {loading ? (
              <Text style={styles.loadingText}>加载中...</Text>
            ) : recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <View key={log.id} style={styles.historyItem}>
                  <Text style={styles.historyDate}>{log.date}</Text>
                  <Text style={styles.historyExercise}>{log.exercise}</Text>
                  <Text style={styles.historyDetails}>
                    {log.weight}kg × {log.reps}次
                  </Text>
                  {log.notes ? (
                    <Text style={styles.historyNotes}>{log.notes}</Text>
                  ) : null}
                </View>
              ))
            ) : (
              <Text style={styles.noRecordsText}>暂无训练记录</Text>
            )}
          </View>

          {/* 添加底部 padding 防止内容被键盘完全遮挡 */}
          <View style={{ height: 200 }} />
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
    paddingBottom: 20, // 给 ScrollView 内容添加底部 padding
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
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  exerciseButtonText: {
    color: "#4A4A4A",
    fontSize: 14,
  },
  exerciseButtonTextActive: {
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  historySection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
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
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  historyDate: {
    color: "#8E8E93",
    fontSize: 12,
  },
  historyExercise: {
    color: "#1C1C1E",
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 4,
  },
  historyDetails: {
    color: "#4A4A4A",
    fontSize: 14,
  },
  historyNotes: {
    color: "#666666",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
  loadingText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 14,
    paddingVertical: 20,
  },
  noRecordsText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 14,
    paddingVertical: 20,
  },
});
