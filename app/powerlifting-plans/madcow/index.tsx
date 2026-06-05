import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

export default function MadcowHome() {
  const router = useRouter();
  const [inputs, setInputs] = useState<MadcowTestInputs>(INITIAL_INPUTS);

  const updateField = (field: keyof MadcowTestInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleGenerate = async () => {
    const fields = Object.entries(inputs);
    const invalid = fields.find(([, v]) => v <= 0);
    if (invalid) {
      Alert.alert("⚠️ 请输入有效的测试重量");
      return;
    }

    const plan = generateMadcowPlan(inputs);
    await AsyncStorage.setItem("madcow_plan", JSON.stringify(plan));
    await AsyncStorage.setItem("madcow_inputs", JSON.stringify(inputs));
    router.push("/powerlifting-plans/madcow/1");
    // router.push(`/powerlifting-plans/madcow/${weekNumber}/${dayName}`);
  };
  const renderInput = (label: string, field: keyof MadcowTestInputs) => (
    <View style={styles.inputRow}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(inputs[field])}
        onChangeText={(v) => updateField(field, v)}
      />
      <Text style={styles.unit}>kg</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐂 Madcow 5x5</Text>
        <Text style={styles.subtitle}>输入你的测试数据，生成12周计划</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>测试重量 & 次数</Text>
        {renderInput("深蹲 (5次)", "squat")}
        {renderInput("卧推 (5次)", "bench")}
        {renderInput("划船 (12次)", "row")}
        {renderInput("推举 (3次)", "press")}
        {renderInput("硬拉 (3次)", "deadlift")}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>📊 生成12周训练计划</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          • 测试重量 = 你能标准完成指定次数的最大重量
        </Text>
        <Text style={styles.infoText}>• 所有训练重量自动按2.5kg取整</Text>
        <Text style={styles.infoText}>
          • 组间递增12.5%，每周顶层组递增~2.5%
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fa", flexGrow: 1 },
  header: { alignItems: "center", marginBottom: 30, paddingTop: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  label: { flex: 1, fontSize: 16, color: "#555" },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: "center",
  },
  unit: { width: 30, fontSize: 16, color: "#888", marginLeft: 8 },
  button: {
    backgroundColor: "#dc3545",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  infoBox: { backgroundColor: "#fff3cd", borderRadius: 12, padding: 16 },
  infoText: { fontSize: 13, color: "#856404", lineHeight: 22 },
});
