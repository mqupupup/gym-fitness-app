import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

interface Assessment {
  exercise: string;
  oneRepMax: number;
  level: string;
  standard: {
    weight: number;
    beginner: number;
    novice: number;
    intermediate: number;
    advanced: number;
    elite: number;
  };
}

export default function StrengthEvaluation() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [bench, setBench] = useState("");
  const [squat, setSquat] = useState("");
  const [deadlift, setDeadlift] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    assessments: Assessment[];
    overallLevel: string;
    overallScore: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "力量水平评估" });
  }, [navigation]);

  useEffect(() => {
    setResult(null);
  }, [gender, weight, bench, squat, deadlift]);

  const handleEvaluate = async () => {
    // 提取数字的辅助函数
    const parseNumeric = (val: string) => {
      const cleaned = val.replace(/[^0-9.]/g, "");
      return cleaned ? Number(cleaned) : 0;
    };

    const bodyWeightNum = parseNumeric(weight);
    const benchNum = parseNumeric(bench);
    const squatNum = parseNumeric(squat);
    const deadliftNum = parseNumeric(deadlift);

    if (!bodyWeightNum) {
      setError("请输入有效的体重数字");
      return;
    }

    if (!benchNum && !squatNum && !deadliftNum) {
      setError("请至少输入一项运动的极限重量");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      userId: "test_user_001",
      gender,
      bodyWeight: bodyWeightNum,
      benchPress1RM: benchNum,
      squat1RM: squatNum,
      deadlift1RM: deadliftNum,
    };

    try {
      const response = await fetch(
        "http://192.168.1.78:3000/api/fitness/assess",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("评估请求失败，请稍后重试。");
      }

      const json = await response.json();
      if (!json.success) {
        throw new Error(json.message || "评估失败");
      }

      setResult({
        assessments: json.data.assessments,
        overallLevel: json.data.overallLevel,
        overallScore: json.data.overallScore,
      });
    } catch (err: any) {
      setError(err?.message || "请求发生错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={styles.card}>
            <Text style={styles.label}>性别</Text>
            <View style={styles.radioGroup}>
              <Pressable
                style={
                  gender === "male"
                    ? [styles.radioItem, styles.radioItemActive]
                    : styles.radioItem
                }
                onPress={() => setGender("male")}
              >
                <Text
                  style={
                    gender === "male"
                      ? [styles.radioText, styles.radioTextActive]
                      : styles.radioText
                  }
                >
                  男
                </Text>
              </Pressable>
              <Pressable
                style={
                  gender === "female"
                    ? [styles.radioItem, styles.radioItemActive]
                    : styles.radioItem
                }
                onPress={() => setGender("female")}
              >
                <Text
                  style={
                    gender === "female"
                      ? [styles.radioText, styles.radioTextActive]
                      : styles.radioText
                  }
                >
                  女
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>体重</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="请输入体重（kg）"
              placeholderTextColor="#6f7280"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>卧推单次最大重量</Text>
            <TextInput
              style={styles.input}
              value={bench}
              onChangeText={setBench}
              placeholder="请输入卧推单次最大重量（kg）"
              placeholderTextColor="#6f7280"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>深蹲单次最大重量</Text>
            <TextInput
              style={styles.input}
              value={squat}
              onChangeText={setSquat}
              placeholder="请输入深蹲单次最大重量（kg）"
              placeholderTextColor="#6f7280"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>硬拉单次最大重量</Text>
            <TextInput
              style={styles.input}
              value={deadlift}
              onChangeText={setDeadlift}
              placeholder="请输入硬拉单次最大重量（kg）"
              placeholderTextColor="#6f7280"
              keyboardType="numeric"
            />
          </View>

          {error ? (
            <View style={styles.messageBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {result ? (
            <View style={styles.resultBlock}>
              <Text style={styles.resultTitle}>综合评估结果</Text>
              {/* <Text style={styles.resultSummary}>
              等级：{result.overallLevel} / 得分：{result.overallScore}
            </Text> */}
              {result.assessments.map((item) => (
                <View key={item.exercise} style={styles.assessmentCard}>
                  <Text style={styles.assessmentName}>
                    {item.exercise === "bench_press"
                      ? "卧推"
                      : item.exercise === "squat"
                        ? "深蹲"
                        : item.exercise === "deadlift"
                          ? "硬拉"
                          : item.exercise}
                  </Text>
                  <Text style={styles.assessmentText}>
                    极限重量：
                    <Text style={styles.highlight}>{item.oneRepMax}kg</Text>
                    ，等级：
                    <Text style={styles.highlight}>{item.level}</Text>
                  </Text>
                  <Text style={styles.assessmentText}>
                    标准：初级 {item.standard.beginner}kg ·入门{" "}
                    {item.standard.novice}kg ·中级 {item.standard.intermediate}
                    kg · 高级 {item.standard.advanced}kg · 精英{" "}
                    {item.standard.elite}
                    kg
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 24) + 12 },
          ]}
        >
          <Pressable
            style={styles.submitButton}
            onPress={
              result
                ? () => scrollViewRef.current?.scrollToEnd()
                : handleEvaluate
            }
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitText}>
                {result ? "向下滑动查看结果" : "开始评估"}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#0f1115",
  },
  inner: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#16181d",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 12,
  },
  radioItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2f3340",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16181d",
  },
  radioItemActive: {
    borderColor: "#4f9f3f",
    backgroundColor: "#223b25",
  },
  radioText: {
    color: "#cbd5e1",
    fontSize: 16,
    fontWeight: "600",
  },
  radioTextActive: {
    color: "#ffffff",
  },
  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#11131a",
    color: "#ffffff",
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#23262f",
  },
  submitButton: {
    backgroundColor: "#4f9f3f",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#0f1115",
    borderTopWidth: 1,
    borderTopColor: "#1c1f25",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  messageBox: {
    backgroundColor: "#331b1b",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: "#fda4af",
    fontSize: 14,
  },
  resultBlock: {
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#1c1f25",
  },
  resultTitle: {
    color: "#e5e7eb",
    fontSize: 28,
    lineHeight: 42,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  resultSummary: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 12,
  },
  assessmentCard: {
    backgroundColor: "#16181d",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  assessmentName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  assessmentText: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 20,
  },
  highlight: {
    color: "#4f9f3f",
    fontWeight: "700",
    fontSize: 15,
  },
});
