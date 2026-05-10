import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function GZCLPCalculator() {
  const [oneRepMax, setOneRepMax] = useState("");
  const [trainingMax, setTrainingMax] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  // 计算 1RM (Epley 公式)
  const calculateOneRepMax = () => {
    if (!weight || !reps) return "";
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (isNaN(w) || isNaN(r) || r <= 0) return "";
    return (w * r * 0.0333 + w).toFixed(1);
  };

  // 计算训练重量
  const calculateTrainingWeight = (percentage: number) => {
    if (!oneRepMax) return "";
    const orm = parseFloat(oneRepMax);
    if (isNaN(orm)) return "";
    return (orm * (percentage / 100)).toFixed(1);
  };

  // 计算训练最大值 (90% 1RM)
  const calculateTrainingMax = () => {
    if (!oneRepMax) return "";
    const orm = parseFloat(oneRepMax);
    if (isNaN(orm)) return "";
    return (orm * 0.9).toFixed(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🧮 GZCLP 计算器</Text>
            <Text style={styles.headerSubtitle}>计算你的训练重量</Text>
          </View>

          {/* 1RM 计算器 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>计算 1RM</Text>
            <Text style={styles.cardSubtitle}>使用你能完成的重量和次数</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>重量 (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="例如: 80"
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>次数 (Reps)</Text>
              <TextInput
                style={styles.input}
                placeholder="例如: 5"
                keyboardType="number-pad"
                value={reps}
                onChangeText={setReps}
              />
            </View>

            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>估算 1RM:</Text>
              <Text style={styles.resultValue}>
                {calculateOneRepMax() ? `${calculateOneRepMax()} kg` : "-"}
              </Text>
            </View>
          </View>

          {/* 训练重量计算器 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>训练重量</Text>
            <Text style={styles.cardSubtitle}>
              输入你的 1RM 计算各周训练重量
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>1RM (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="例如: 100"
                keyboardType="decimal-pad"
                value={oneRepMax}
                onChangeText={setOneRepMax}
              />
            </View>

            {oneRepMax && (
              <>
                <View style={styles.trainingMaxContainer}>
                  <Text style={styles.trainingMaxLabel}>
                    🎯 训练最大值 (90% 1RM):
                  </Text>
                  <Text style={styles.trainingMaxValue}>
                    {calculateTrainingMax()} kg
                  </Text>
                </View>

                <View style={styles.percentagesContainer}>
                  <Text style={styles.sectionTitle}>各周训练重量:</Text>

                  {[65, 70, 75, 80, 85, 90].map((percent) => (
                    <View key={percent} style={styles.percentageRow}>
                      <Text style={styles.percentageLabel}>{percent}%:</Text>
                      <Text style={styles.percentageValue}>
                        {calculateTrainingWeight(percent)} kg
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* 说明 */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 使用说明</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Week 1-3:</Text> 使用 65-75% 1RM
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Week 4-6:</Text> 使用 75-85% 1RM
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Week 7-9:</Text> 使用 85-90% 1RM
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Week 10-12:</Text> 使用 90%+ 1RM
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  resultContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
  },
  trainingMaxContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    alignItems: "center",
    backgroundColor: "#e7f3ff",
    padding: 15,
    borderRadius: 8,
  },
  trainingMaxLabel: {
    fontSize: 14,
    color: "#0056b3",
    marginBottom: 8,
  },
  trainingMaxValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
  },
  percentagesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  percentageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
  },
  percentageLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  percentageValue: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#fff3cd",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  infoBullet: {
    fontSize: 20,
    color: "#856404",
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#856404",
    flex: 1,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: "600",
  },
});
