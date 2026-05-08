import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("sedentary");

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

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
      {/* 配置原生 KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS用padding，Android用height
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // 针对 Android 稍微偏移一点
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode="on-drag" // 拖动时收起键盘
          keyboardShouldPersistTaps="handled" // 点击按钮不收起键盘
        >
          <Text style={styles.header}>身体数据计算器</Text>

          {/* 性别选择 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>性别</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
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
              </TouchableOpacity>
              <TouchableOpacity
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
              </TouchableOpacity>
            </View>
          </View>

          {/* 基础输入 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>年龄 (岁)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="例如: 25"
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>身高 (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="例如: 175"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>体重 (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="例如: 70"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* 活动量选择 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>活动水平</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={activity}
                onValueChange={(itemValue) => setActivity(itemValue)}
                dropdownIconColor="#007AFF"
              >
                {ACTIVITY_LEVELS.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* 计算按钮 */}
          <TouchableOpacity style={styles.submitButton} onPress={calculate}>
            <Text style={styles.submitButtonText}>开始计算</Text>
          </TouchableOpacity>

          {/* 策略列表 */}
          <StrategiesList />

          {/*  关键：增加底部留白，防止最后一个输入框贴底 */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 使用自定义 Modal 组件 */}
      <CustomModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title={result ? "计算结果" : "提示"}
        message={
          result
            ? `基础代谢: ${result.bmr} 大卡\n\n每日总消耗: ${result.tdee} 大卡\n\n建议减脂摄入: ${result.target} 大卡`
            : error || "信息不完整"
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 30,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C3C43",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#1C1C1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 15,
  },
  genderBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  genderBtnActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  genderText: {
    fontSize: 16,
    color: "#3C3C43",
    fontWeight: "600",
  },
  genderTextActive: {
    color: "#FFFFFF",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WeightLossScreen;
