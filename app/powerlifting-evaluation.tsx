import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CoefficientSelector } from "../src/components/CoefficientSelector";
import { InputSection } from "../src/components/InputSection";
import { ResultSection } from "../src/components/ResultSection";
import { usePowerliftingEvaluation } from "../src/hooks/usePowerliftingEvaluation";
import { powerliftingStyles as styles } from "../src/styles/powerliftingStyles";
import { CoefficientType, Gender } from "../src/types/powerlifting";

export default function PowerliftingEvaluation() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // 表单状态
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState("");
  const [squat, setSquat] = useState("");
  const [bench, setBench] = useState("");
  const [deadlift, setDeadlift] = useState("");
  const [coefficientType, setCoefficientType] =
    useState<CoefficientType>("ipf_gl");

  // 使用自定义Hook处理评估逻辑
  const { loading, result, error, evaluate, reset } = usePowerliftingEvaluation(
    {
      gender,
      weight,
      squat,
      bench,
      deadlift,
      coefficientType,
    },
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "力量举水平评估" });
  }, [navigation]);

  const handleEvaluate = () => {
    evaluate();
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
        >
          {/* 顶部标题区（水平排列：Icon + 标题 + 副标题） */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="trophy-outline" size={24} color="#6A4C93" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>力量举评估</Text>
              <Text style={styles.headerSubtitle}>
                输入三大项成绩，获得专业力量举水平分析
              </Text>
            </View>
          </View>

          {/* 输入区域 */}
          <InputSection
            gender={gender}
            setGender={setGender}
            weight={weight}
            setWeight={setWeight}
            squat={squat}
            setSquat={setSquat}
            bench={bench}
            setBench={setBench}
            deadlift={deadlift}
            setDeadlift={setDeadlift}
          />

          {/* 系数选择 */}
          <CoefficientSelector
            coefficientType={coefficientType}
            setCoefficientType={setCoefficientType}
          />

          {/* 结果区域 */}
          <ResultSection result={result} error={error} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 底部按钮（移到 KeyboardAvoidingView 外面，避免键盘弹起时偏移） */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 12) + 16 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
            loading && styles.submitButtonDisabled,
          ]}
          onPress={
            result
              ? () => scrollViewRef.current?.scrollToEnd({ animated: true })
              : handleEvaluate
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitText}>
              {result ? "查看完整结果" : "开始评估"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
