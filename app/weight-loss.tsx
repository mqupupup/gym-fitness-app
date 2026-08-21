import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 引入工具函数和组件
import CustomModal from "../src/components/CustomModal";
import StrategiesList from "../src/components/StrategiesList";
import { validateUserData } from "../src/utils/validation";

// 常量数据
const ACTIVITY_LEVELS = [
  {
    label: "久坐 (办公室工作，无额外运动)",
    value: "sedentary",
    multiplier: 1.2,
  },
  {
    label: "轻度活动 (轻量运动或散步，每周1-3天)",
    value: "light",
    multiplier: 1.375,
  },
  { label: "适度运动量，每周3-5天", value: "moderate", multiplier: 1.55 },
  { label: "高强度体力劳动或专业训练", value: "active", multiplier: 1.725 },
];

const WeightLossScreen = () => {
  const insets = useSafeAreaInsets();
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("sedentary");

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activityPickerVisible, setActivityPickerVisible] = useState(false);

  const calculate = () => {
    setError("");
    if (!age || !height || !weight) {
      setError("请填写完整信息");
      setModalVisible(true);
      return;
    }

    const validation = validateUserData(age, height, weight);
    if (!validation.isValid) {
      setError(validation.message);
      setModalVisible(true);
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    const currentActivity = ACTIVITY_LEVELS.find(
      (item) => item.value === activity,
    );
    const multiplier = currentActivity ? currentActivity.multiplier : 1.2;

    let bmr =
      10 * weightNum +
      6.25 * heightNum -
      5 * ageNum +
      (gender === "male" ? 5 : -161);

    const tdee = Math.round(bmr * multiplier);
    const lossCalorie = tdee - 350;

    setResult({
      bmr: Math.round(bmr),
      tdee: tdee,
      target: lossCalorie > 1200 ? Math.round(lossCalorie) : 1200,
    });

    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "减脂 & 减肥" }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {/* 顶部标题区 */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="flame" size={24} color="#6A4C93" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>身体数据计算器</Text>
              <Text style={styles.headerSubtitle}>
                热量计算 + 饮食训练策略，科学减脂
              </Text>
            </View>
          </View>

          {/* 输入卡片 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>基本信息</Text>

            {/* 性别选择 */}
            <Text style={styles.inputLabel}>性别</Text>
            <View style={styles.genderContainer}>
              <Pressable
                style={[
                  styles.genderBtn,
                  gender === "male" && styles.genderBtnActive,
                ]}
                onPress={() => setGender("male")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "male" && styles.genderTextActive,
                  ]}
                >
                  男
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.genderBtn,
                  gender === "female" && styles.genderBtnActive,
                ]}
                onPress={() => setGender("female")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "female" && styles.genderTextActive,
                  ]}
                >
                  女
                </Text>
              </Pressable>
            </View>

            <View style={{ height: 14 }} />

            {/* 年龄 */}
            <Text style={styles.inputLabel}>年龄</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="请输入年龄"
                placeholderTextColor="#C7C7CC"
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.unitText}>岁</Text>
            </View>

            <View style={{ height: 14 }} />

            {/* 身高 */}
            <Text style={styles.inputLabel}>身高</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="请输入身高"
                placeholderTextColor="#C7C7CC"
                keyboardType="numeric"
                maxLength={6}
              />
              <Text style={styles.unitText}>cm</Text>
            </View>

            <View style={{ height: 14 }} />

            {/* 体重 */}
            <Text style={styles.inputLabel}>体重</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="请输入体重"
                placeholderTextColor="#C7C7CC"
                keyboardType="numeric"
                maxLength={6}
              />
              <Text style={styles.unitText}>kg</Text>
            </View>

            <View style={{ height: 14 }} />

            {/* 活动水平 */}
            <Text style={styles.inputLabel}>活动水平</Text>
            <Pressable
              style={styles.pickerTrigger}
              onPress={() => setActivityPickerVisible(true)}
              android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
            >
              <Text style={styles.pickerTriggerText} numberOfLines={1}>
                {ACTIVITY_LEVELS.find((item) => item.value === activity)?.label ||
                  "请选择活动水平"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#8E8E93" />
            </Pressable>
          </View>

          {/* 策略列表 */}
          <StrategiesList />

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 底部按钮（放在 KeyboardAvoidingView 外面，位置固定不受键盘影响） */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 12) + 12 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
          ]}
          onPress={calculate}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>开始计算</Text>
          )}
        </Pressable>
      </View>

      {/* 活动水平选择器（底部 ActionSheet 风格） */}
      <Modal
        visible={activityPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActivityPickerVisible(false)}
      >
        <Pressable
          style={pickerStyles.overlay}
          onPress={() => setActivityPickerVisible(false)}
        >
          <Pressable style={pickerStyles.sheet}>
            <View style={pickerStyles.handle} />
            <Text style={pickerStyles.sheetTitle}>选择活动水平</Text>
            {ACTIVITY_LEVELS.map((item, index) => {
              const isSelected = item.value === activity;
              return (
                <Pressable
                  key={item.value}
                  style={[
                    pickerStyles.option,
                    index === ACTIVITY_LEVELS.length - 1 && pickerStyles.optionLast,
                  ]}
                  onPress={() => {
                    setActivity(item.value);
                    setActivityPickerVisible(false);
                  }}
                  android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
                >
                  <Text
                    style={[
                      pickerStyles.optionText,
                      isSelected && pickerStyles.optionTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color="#6A4C93" />
                  )}
                </Pressable>
              );
            })}
            <Pressable
              style={pickerStyles.cancelBtn}
              onPress={() => setActivityPickerVisible(false)}
            >
              <Text style={pickerStyles.cancelText}>取消</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 使用自定义 Modal 组件 */}
      <CustomModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title={result ? "计算结果" : "提示"}
        icon={result ? "calculator-outline" : "alert-circle-outline"}
        message={result ? undefined : error || "信息不完整"}
      >
        {result && (
          <View style={resultModalStyles.container}>
            <View style={resultModalStyles.row}>
              <View style={resultModalStyles.item}>
                <Text style={resultModalStyles.value}>{result.bmr}</Text>
                <Text style={resultModalStyles.label}>基础代谢</Text>
                <Text style={resultModalStyles.unit}>大卡/天</Text>
              </View>
              <View style={resultModalStyles.divider} />
              <View style={resultModalStyles.item}>
                <Text style={resultModalStyles.value}>{result.tdee}</Text>
                <Text style={resultModalStyles.label}>每日总消耗</Text>
                <Text style={resultModalStyles.unit}>大卡/天</Text>
              </View>
            </View>
            <View style={resultModalStyles.targetCard}>
              <Text style={resultModalStyles.targetLabel}>建议减脂摄入</Text>
              <Text style={resultModalStyles.targetValue}>
                {result.target}
                <Text style={resultModalStyles.targetUnit}> 大卡/天</Text>
              </Text>
              <Text style={resultModalStyles.targetHint}>
                每日热量缺口约 350 大卡，温和减脂
              </Text>
            </View>
          </View>
        )}
      </CustomModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FA",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
  },

  // 顶部标题区
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 16,
    letterSpacing: -0.2,
  },

  // 输入标签
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C3C43",
    marginBottom: 8,
  },

  // 输入框容器
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDEDF0",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  unitText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8E8E93",
    paddingHorizontal: 16,
  },

  // 性别选择
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
  },
  genderBtnActive: {
    backgroundColor: "#F3F0FF",
    borderColor: "#6A4C93",
  },
  genderText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "600",
  },
  genderTextActive: {
    color: "#6A4C93",
  },

  // 活动水平选择器触发按钮
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F7F7F8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDEDF0",
    paddingHorizontal: 16,
    height: 50,
  },
  pickerTriggerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    marginRight: 12,
  },

  // 底部按钮
  footer: {
    paddingHorizontal: 20,
    paddingTop: 36,
    backgroundColor: "#F7F6FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E5",
  },
  submitButton: {
    backgroundColor: "#6A4C93",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
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

// 计算结果弹窗的结构化样式
const resultModalStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F6FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  item: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E5",
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6A4C93",
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  unit: {
    fontSize: 11,
    color: "#8E8E93",
  },
  targetCard: {
    backgroundColor: "#F3F0FF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  targetLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6A4C93",
    marginBottom: 6,
  },
  targetValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#6A4C93",
    marginBottom: 6,
  },
  targetUnit: {
    fontSize: 16,
    fontWeight: "500",
  },
  targetHint: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
});

// 活动水平选择器（底部 ActionSheet 风格）
const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Math.max(12, 0) + 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E5",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F3",
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "500",
    marginRight: 12,
  },
  optionTextSelected: {
    color: "#6A4C93",
    fontWeight: "600",
  },
  cancelBtn: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#F7F6FA",
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6A4C93",
  },
});

export default WeightLossScreen;
