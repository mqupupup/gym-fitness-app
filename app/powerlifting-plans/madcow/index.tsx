import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import {
  Alert,
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
  generateMadcowPlan,
  MadcowTestInputs,
} from "../../../src/lib/madcow-calculator";

const INITIAL_INPUTS: MadcowTestInputs = {
  squat: 140,
  bench: 90,
  row: 80,
  press: 60,
  deadlift: 155,
};

const INPUT_FIELDS: { label: string; field: keyof MadcowTestInputs; reps: string }[] = [
  { label: "深蹲", field: "squat", reps: "5次" },
  { label: "卧推", field: "bench", reps: "5次" },
  { label: "划船", field: "row", reps: "12次" },
  { label: "推举", field: "press", reps: "3次" },
  { label: "硬拉", field: "deadlift", reps: "3次" },
];

export default function MadcowHome() {
  const router = useRouter();
  const navigation = useNavigation();
  const [inputs, setInputs] = useState<MadcowTestInputs>(INITIAL_INPUTS);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Madcow 5x5" });
  }, [navigation]);

  const updateField = (field: keyof MadcowTestInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleGenerate = async () => {
    const fields = Object.entries(inputs);
    const invalid = fields.find(([, v]) => v <= 0);
    if (invalid) {
      Alert.alert("请输入有效的测试重量");
      return;
    }

    const plan = generateMadcowPlan(inputs);
    await AsyncStorage.setItem("madcow_plan", JSON.stringify(plan));
    await AsyncStorage.setItem("madcow_inputs", JSON.stringify(inputs));
    router.push("/powerlifting-plans/madcow/1");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Madcow 5x5" }} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 顶部标题区 */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="fitness-outline" size={24} color="#6A4C93" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Madcow 5x5</Text>
            <Text style={styles.headerSubtitle}>输入测试数据，自动生成 12 周训练计划</Text>
          </View>
        </View>

        {/* 输入卡片 */}
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>测试重量</Text>
          <Text style={styles.cardSubtitle}>你能标准完成指定次数的最大重量</Text>

          {INPUT_FIELDS.map((item, index) => (
            <View
              key={item.field}
              style={[
                styles.inputRow,
                index < INPUT_FIELDS.length - 1 && styles.inputRowBorder,
              ]}
            >
              <View style={styles.inputLabelContainer}>
                <Text style={styles.inputLabel}>{item.label}</Text>
                <Text style={styles.inputReps}>{item.reps}</Text>
              </View>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(inputs[item.field])}
                  onChangeText={(v) => updateField(item.field, v)}
                  placeholderTextColor="#C7C7CC"
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 生成按钮 */}
        <Pressable
          style={({ pressed }) => [
            styles.generateButton,
            pressed && styles.generateButtonPressed,
          ]}
          onPress={handleGenerate}
          android_ripple={{ color: "rgba(255,255,255,0.15)" }}
        >
          <Ionicons name="flash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.generateButtonText}>生成 12 周训练计划</Text>
        </Pressable>

        {/* 说明卡片 */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={16} color="#6A4C93" />
            <Text style={styles.infoTitle}>计算说明</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>所有训练重量自动按 2.5kg 取整</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>组间递增 12.5%，每周顶层组递增约 2.5%</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>专注深蹲、卧推、硬拉和推举的基础训练</Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
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

  // 输入卡片
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  inputRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F3",
  },
  inputLabelContainer: {
    width: 90,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  inputReps: {
    fontSize: 12,
    color: "#8E8E93",
  },
  inputField: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "right",
  },
  unit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginLeft: 8,
  },

  // 生成按钮
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6A4C93",
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 16,
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

  // 说明卡片
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
});
