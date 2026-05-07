import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// 导入样式
import { styles } from "./strength-evaluation.styles";

// 类型定义
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

interface AssessmentResult {
  assessments: Assessment[];
  overallLevel: string;
  overallScore: string;
}

type Gender = "male" | "female";

export default function StrengthEvaluation() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState("");
  const [bench, setBench] = useState("");
  const [squat, setSquat] = useState("");
  const [deadlift, setDeadlift] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "💪 力量水平评估" });
  }, [navigation]);

  useEffect(() => {
    setResult(null);
  }, [gender, weight, bench, squat, deadlift]);

  const handleEvaluate = async () => {
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

  // 等级颜色函数
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      // 英文映射
      beginner: "#FF9500",
      novice: "#FFCC00",
      intermediate: "#5AC8FA",
      advanced: "#4CD964",
      elite: "#FF2D55",
      // 中文映射
      初级: "#FF9500",
      入门: "#FFCC00",
      中级: "#5AC8FA",
      高级: "#4CD964",
      精英: "#FF2D55",
    };
    return colors[level] || "#8E8E93";
  };

  const getLevelName = (level: string) => {
    const names: Record<string, string> = {
      beginner: "初级",
      novice: "入门",
      intermediate: "中级",
      advanced: "高级",
      elite: "精英",
    };
    // 如果是英文，转换为中文；如果是中文，直接返回
    return names[level] || level;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* 顶部标题卡片 */}
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>🏋️‍♂️ 力量评估</Text>
            <Text style={styles.headerSubtitle}>
              输入您的基础数据，获得专业的力量水平分析
            </Text>
          </View>

          {/* 性别选择 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>基本信息</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>性别</Text>
              <View style={styles.genderGroup}>
                <Pressable
                  style={[
                    styles.genderButton,
                    gender === "male" && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender("male")}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === "male" && styles.genderTextActive,
                    ]}
                  >
                    👨 男
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.genderButton,
                    gender === "female" && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender("female")}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === "female" && styles.genderTextActive,
                    ]}
                  >
                    👩 女
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* 体重输入 */}
          <View style={styles.sectionCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>⚖️ 体重</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="请输入体重"
                  placeholderTextColor="#A0A0A5"
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </View>

          {/* 三大项输入 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>三大项极限重量</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bench Press 💪</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={bench}
                  onChangeText={setBench}
                  placeholder="卧推"
                  placeholderTextColor="#A0A0A5"
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Squat 🦵</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={squat}
                  onChangeText={setSquat}
                  placeholder="深蹲"
                  placeholderTextColor="#A0A0A5"
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Deadlift 🏋️</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={deadlift}
                  onChangeText={setDeadlift}
                  placeholder="硬拉"
                  placeholderTextColor="#A0A0A5"
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </View>

          {/* 错误提示 */}
          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* 评估结果 */}
          {result ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>📊 评估结果</Text>

              {result.assessments.map((item) => {
                const levelColor = getLevelColor(item.level);
                const levelName = getLevelName(item.level);

                return (
                  <View key={item.exercise} style={styles.resultItem}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultExercise}>
                        {item.exercise === "bench_press"
                          ? "Bench Press 💪"
                          : item.exercise === "squat"
                            ? "Squat 🦵"
                            : item.exercise === "deadlift"
                              ? "Deadlift 🏋️"
                              : item.exercise}
                      </Text>
                      <View
                        style={[
                          styles.levelBadge,
                          { backgroundColor: levelColor },
                        ]}
                      >
                        <Text style={styles.levelText}>{levelName}</Text>
                      </View>
                    </View>

                    <View style={styles.resultStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>1RM</Text>
                        <Text style={styles.statValue}>{item.oneRepMax}kg</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>体重比</Text>
                        <Text style={styles.statValue}>
                          {(item.oneRepMax / item.standard.weight).toFixed(2)}x
                        </Text>
                      </View>
                    </View>

                    {/* 进度条展示等级位置 */}
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${
                              ((item.oneRepMax - item.standard.beginner) /
                                (item.standard.elite -
                                  item.standard.beginner)) *
                              100
                            }%`,
                            backgroundColor: levelColor,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
        </ScrollView>

        {/* 底部按钮 */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 24) + 16 },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
            onPress={
              result
                ? () => scrollViewRef.current?.scrollToEnd()
                : handleEvaluate
            }
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitText}>
                {result ? "👇 向下滑动查看完整结果" : "🚀 开始评估"}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
