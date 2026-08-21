import { Stack } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { Ionicons } from "@expo/vector-icons";
import { useTrainingLog } from "../../../src/hooks/useTrainingLog";

const EXERCISES = ["深蹲", "卧推", "硬拉", "推举"];

export default function WendlerLog() {
  const navigation = useNavigation();
  const { logs, loading, saveLog, getRecentLogs } = useTrainingLog();
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "训练记录" });
  }, [navigation]);

  const [currentLog, setCurrentLog] = useState({
    date: new Date().toISOString().split("T")[0],
    exercise: "",
    weight: "",
    reps: "",
    notes: "",
  });

  const handleSaveLog = async () => {
    if (!currentLog.exercise || !currentLog.weight || !currentLog.reps) {
      Alert.alert("请填写完整训练记录");
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
      Alert.alert("训练记录已保存");
      setCurrentLog({
        date: new Date().toISOString().split("T")[0],
        exercise: "",
        weight: "",
        reps: "",
        notes: "",
      });
    } else {
      Alert.alert("保存失败，请重试");
    }
  };

  const updateLogField = (field: string, value: string) => {
    setCurrentLog((prev) => ({ ...prev, [field]: value }));
  };

  const recentLogs = getRecentLogs(5);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: "训练记录" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : undefined}
        keyboardVerticalOffset={insets.top + 44}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 顶部标题区 */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="document-text-outline" size={24} color="#6A4C93" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>训练记录</Text>
              <Text style={styles.headerSubtitle}>记录你的每次训练表现</Text>
            </View>
          </View>

          {/* 记录表单 */}
          <View style={styles.formCard}>
            {/* 日期 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>日期</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={currentLog.date}
                  onChangeText={(value) => updateLogField("date", value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#C7C7CC"
                />
                <Ionicons name="calendar-outline" size={18} color="#8E8E93" />
              </View>
            </View>

            {/* 动作选择 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>动作</Text>
              <View style={styles.exerciseSelector}>
                {EXERCISES.map((exercise) => {
                  const isActive = currentLog.exercise === exercise;
                  return (
                    <Pressable
                      key={exercise}
                      style={[
                        styles.exerciseButton,
                        isActive && styles.exerciseButtonActive,
                      ]}
                      onPress={() => updateLogField("exercise", exercise)}
                      android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
                    >
                      <Text
                        style={[
                          styles.exerciseButtonText,
                          isActive && styles.exerciseButtonTextActive,
                        ]}
                      >
                        {exercise}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 重量 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>重量</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={currentLog.weight}
                  onChangeText={(value) => updateLogField("weight", value)}
                  keyboardType="numeric"
                  placeholder="请输入重量"
                  placeholderTextColor="#C7C7CC"
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>

            {/* 次数 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>次数</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={currentLog.reps}
                  onChangeText={(value) => updateLogField("reps", value)}
                  keyboardType="numeric"
                  placeholder="请输入次数"
                  placeholderTextColor="#C7C7CC"
                />
                <Text style={styles.unit}>次</Text>
              </View>
            </View>

            {/* 备注 */}
            <View style={styles.inputGroupLast}>
              <Text style={styles.inputLabel}>备注</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={currentLog.notes}
                  onChangeText={(value) => updateLogField("notes", value)}
                  placeholder="训练感受、技术要点等"
                  placeholderTextColor="#C7C7CC"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* 最近训练记录 */}
          <View style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="time-outline" size={18} color="#6A4C93" />
              <Text style={styles.cardTitle}>最近训练记录</Text>
            </View>

            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="small" color="#6A4C93" />
                <Text style={styles.emptyText}>加载中...</Text>
              </View>
            ) : recentLogs.length > 0 ? (
              recentLogs.map((log, index) => (
                <View
                  key={log.id}
                  style={[
                    styles.historyItem,
                    index === recentLogs.length - 1 && styles.historyItemLast,
                  ]}
                >
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyExercise}>{log.exercise}</Text>
                    <Text style={styles.historyDate}>{log.date}</Text>
                  </View>
                  <Text style={styles.historyDetails}>
                    {log.weight} kg × {log.reps} 次
                  </Text>
                  {log.notes ? (
                    <Text style={styles.historyNotes}>{log.notes}</Text>
                  ) : null}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="document-outline" size={32} color="#C7C7CC" />
                <Text style={styles.emptyText}>暂无训练记录</Text>
              </View>
            )}
          </View>
        </ScrollView>
      {/* 底部按钮（固定位置，手动控制底部安全区） */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            loading && styles.saveButtonDisabled,
          ]}
          onPress={handleSaveLog}
          disabled={loading}
          android_ripple={{ color: "rgba(255,255,255,0.15)" }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>保存记录</Text>
            </>
          )}
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

  // 表单卡片
  formCard: {
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
  inputGroup: {
    marginBottom: 14,
  },
  inputGroupLast: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C3C43",
    marginBottom: 8,
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
  textAreaContainer: {
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  unit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginLeft: 8,
  },

  // 动作选择
  exerciseSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exerciseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
    backgroundColor: "#FAFAFA",
  },
  exerciseButtonActive: {
    backgroundColor: "#F3F0FF",
    borderColor: "#6A4C93",
  },
  exerciseButtonText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "600",
  },
  exerciseButtonTextActive: {
    color: "#6A4C93",
  },

  // 历史记录卡片
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
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
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F3",
  },
  historyItemLast: {
    borderBottomWidth: 0,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  historyExercise: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  historyDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  historyDetails: {
    fontSize: 14,
    color: "#6A4C93",
    fontWeight: "600",
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 12,
    color: "#8E8E93",
    fontStyle: "italic",
    lineHeight: 16,
  },

  // 空状态
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#8E8E93",
  },

  // 底部按钮
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#F7F6FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E5",
  },
  saveButton: {
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
  saveButtonPressed: {
    backgroundColor: "#5A3D80",
    transform: [{ scale: 0.98 }],
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
