import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

interface Exercise {
  name: string;
  sets: string;
  percentage: string;
  weight?: string;
  completed?: boolean;
}

interface TrainingConfig {
  squat1RM: number;
  bench1RM: number;
  deadlift1RM: number;
  press1RM: number;
  restTime: number;
}

export default function TrainingTimer() {
  const { week, day } = useLocalSearchParams();
  const navigation = useNavigation();

  // 状态管理
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [restTime, setRestTime] = useState(120);
  const [showWarning, setShowWarning] = useState(false);
  const [config, setConfig] = useState<TrainingConfig | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // 设置自定义 header 标题（隐藏路径，显示友好名称）
  useEffect(() => {
    const weekNum = week ? `Week ${week}` : "训练";
    const dayNum = day ? `Day ${day.replace("day", "")}` : "";
    navigation.setOptions({
      headerShown: false,
    });

    navigation.setOptions({
      headerShown: false,
    });
    navigation.setOptions({
      headerShown: false,
    });
    return () => {
      navigation.setOptions({ headerTitle: undefined });
    };
  }, [navigation, week, day]);

  // 震动模式
  const VIBRATE_PATTERN = [0, 100, 100, 100];

  // 加载配置
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem("trainingConfig");
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        setRestTime(parsedConfig.restTime); // 使用配置的休息时间
      }
    } catch (error) {
      console.error("加载配置失败:", error);
    }
  };

  // 计算训练重量
  const calculateWeight = (oneRM: number, percentage: number) => {
    return Math.round(oneRM * (percentage / 100));
  };

  // 获取训练计划
  const getTrainingPlan = () => {
    const weekNumber = parseInt(String(week));
    const dayNumber = String(day).includes("day")
      ? parseInt(String(day).replace("day", ""))
      : 1;

    const basePercentage = 60 + weekNumber * 2;
    const dayType = dayNumber === 1 ? "A" : dayNumber === 2 ? "B" : "A+";

    // 计算训练重量
    const weights = config
      ? {
          squat: calculateWeight(config.squat1RM, basePercentage),
          bench: calculateWeight(config.bench1RM, basePercentage),
          deadlift: calculateWeight(config.deadlift1RM, basePercentage),
          press: calculateWeight(config.press1RM, basePercentage),
        }
      : null;

    const exercises =
      dayNumber === 1 || dayNumber === 3
        ? [
            {
              name: "深蹲 (Squat)",
              sets: "3x5",
              percentage: `${basePercentage}%`,
              weight: weights ? `${weights.squat}kg` : "-",
            },
            {
              name: "卧推 (Bench Press)",
              sets: "3x5",
              percentage: `${basePercentage}%`,
              weight: weights ? `${weights.bench}kg` : "-",
            },
            {
              name: "划船 (Bent Over Row)",
              sets: "1x5+",
              percentage: `${basePercentage}%`,
              weight: "-",
            },
            { name: "辅助训练", sets: "3x8~12", percentage: "-", weight: "-" },
          ]
        : [
            {
              name: "深蹲 (Squat)",
              sets: "3x5",
              percentage: `${basePercentage}%`,
              weight: weights ? `${weights.squat}kg` : "-",
            },
            {
              name: "硬拉 (Deadlift)",
              sets: "1x5+",
              percentage: `${basePercentage}%`,
              weight: weights ? `${weights.deadlift}kg` : "-",
            },
            {
              name: "推举 (Overhead Press)",
              sets: "3x5",
              percentage: `${basePercentage}%`,
              weight: weights ? `${weights.press}kg` : "-",
            },
            { name: "辅助训练", sets: "3x8~12", percentage: "-", weight: "-" },
          ];

    return { dayType, exercises };
  };

  const { dayType, exercises } = getTrainingPlan();
  const currentExercise = exercises[currentExerciseIndex];

  // 解析组数
  const totalSets = currentExercise.sets.includes("x")
    ? parseInt(currentExercise.sets.split("x")[0])
    : 1;

  // 计时器逻辑
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => {
          const newTime = prev - 1;

          // 更新进度条
          Animated.timing(progressAnim, {
            toValue:
              (((config?.restTime || 120) - newTime) /
                (config?.restTime || 120)) *
              100,
            duration: 1000,
            useNativeDriver: false,
          }).start();

          // 最后10秒震动提醒
          if (newTime <= 10) {
            triggerVibration();
            setShowWarning(true);
          }

          return newTime;
        });
      }, 1000);
    } else if (restTime === 0 && isRunning) {
      // 休息时间结束
      Vibration.vibrate([0, 300, 200, 300]);
      Alert.alert("⏰ 休息时间结束", "准备开始下一组训练！", [
        { text: "好的", onPress: handleNextSet },
      ]);
      setIsRunning(false);
      setRestTime(config?.restTime || 120);
      progressAnim.setValue(0);
      setShowWarning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, restTime, config]);

  // 触发震动
  const triggerVibration = () => {
    if (Vibration) {
      Vibration.vibrate(VIBRATE_PATTERN);
    }
  };

  // 停止震动
  const stopVibration = () => {
    if (Vibration) {
      Vibration.cancel();
    }
  };

  // 开始休息
  const handleStartRest = () => {
    if (isRunning) {
      Alert.alert("⚠️ 已在计时", "请先停止当前计时");
      return;
    }
    setIsRunning(true);
    setRestTime(config?.restTime || 120);
    progressAnim.setValue(0);
    setShowWarning(false);
    stopVibration();
  };

  // 停止休息
  const handleStopRest = () => {
    setIsRunning(false);
    progressAnim.setValue(0);
    setShowWarning(false);
    stopVibration();
  };

  // 完成当前组
  const handleCompleteSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      handleStartRest();
    } else {
      // 完成当前动作
      Alert.alert("✅ 动作完成", `已完成 ${currentExercise.name}`, [
        {
          text: "继续下一个动作",
          onPress: () => {
            setCurrentExerciseIndex((prev) => prev + 1);
            setCurrentSet(1);
          },
        },
        {
          text: "稍后继续",
          style: "cancel",
        },
      ]);
    }
  };

  // 下一组
  const handleNextSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      setRestTime(config?.restTime || 120);
      progressAnim.setValue(0);
      setShowWarning(false);
    }
  };

  // 完成训练
  const handleCompleteTraining = () => {
    Vibration.vibrate([0, 200, 100, 200, 100, 200]);
    Alert.alert(
      "🎉 训练完成！",
      `恭喜完成 Week ${week} - Day ${day} 的训练！`,
      [
        {
          text: "返回计划",
          onPress: () => navigation.goBack(),
        },
        {
          text: "查看记录",
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
    );
  };

  // 格式化时间
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 计算进度百分比
  const progressPercentage =
    (((config?.restTime || 120) - restTime) / (config?.restTime || 120)) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 训练信息头部 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Week {week} - Day {day.replace("day", "")}
          </Text>
          <Text style={styles.headerSubtitle}>{dayType} 训练日</Text>
          {config && (
            <Text style={styles.restTimeInfo}>
              休息时间: {config.restTime}秒
            </Text>
          )}
        </View>

        {/* 当前训练动作 */}
        <View style={styles.currentExerciseCard}>
          <Text style={styles.currentLabel}>当前动作</Text>
          <Text style={styles.currentExerciseName}>{currentExercise.name}</Text>
          <View style={styles.setInfo}>
            <Text style={styles.setNumber}>
              第 {currentSet} / {totalSets} 组
            </Text>
            <Text style={styles.percentage}>{currentExercise.percentage}</Text>
            {currentExercise.weight !== "-" && (
              <Text style={styles.weight}>{currentExercise.weight}</Text>
            )}
          </View>
        </View>

        {/* 休息计时器 */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>休息时间</Text>
          <Text
            style={[
              styles.timerDisplay,
              showWarning && styles.timerDisplayWarning,
            ]}
          >
            {formatTime(restTime)}
          </Text>

          {/* 进度条 */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>

          {/* 最后10秒警告 */}
          {showWarning && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>⚠️ 剩余 {restTime} 秒！</Text>
            </View>
          )}

          <Text style={styles.hintText}>🔊 系统震动提醒已启用</Text>

          {/* 控制按钮 */}
          <View style={styles.timerControls}>
            {!isRunning ? (
              <TouchableOpacity
                style={[styles.controlButton, styles.startButton]}
                onPress={handleStartRest}
              >
                <Text style={styles.controlButtonText}>▶️ 开始休息</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.controlButton, styles.stopButton]}
                onPress={handleStopRest}
              >
                <Text style={styles.controlButtonText}>⏸️ 暂停</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 动作列表 */}
        <View style={styles.exercisesList}>
          <Text style={styles.listTitle}>训练动作列表</Text>
          {exercises.map((exercise, index) => (
            <View
              key={index}
              style={[
                styles.exerciseItem,
                index === currentExerciseIndex && styles.exerciseItemActive,
              ]}
            >
              <View style={styles.exerciseInfo}>
                <Text
                  style={[
                    styles.exerciseName,
                    index === currentExerciseIndex && styles.exerciseNameActive,
                  ]}
                >
                  {index + 1}. {exercise.name}
                </Text>
                <View style={styles.exerciseMeta}>
                  <Text style={styles.exerciseSets}>{exercise.sets}</Text>
                  <Text style={styles.exercisePercentage}>
                    {exercise.percentage}
                  </Text>
                  {exercise.weight !== "-" && (
                    <Text style={styles.exerciseWeight}>{exercise.weight}</Text>
                  )}
                </View>
              </View>
              {index === currentExerciseIndex && (
                <View style={styles.currentIndicator} />
              )}
            </View>
          ))}
        </View>

        {/* 完成按钮 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={handleCompleteSet}
            disabled={isRunning}
          >
            <Text style={styles.actionButtonText}>
              ✅ 完成第 {currentSet} 组
            </Text>
          </TouchableOpacity>

          {currentExerciseIndex < exercises.length - 1 ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.skipButton]}
              onPress={() =>
                setCurrentExerciseIndex((prev) =>
                  Math.min(prev + 1, exercises.length - 1),
                )
              }
            >
              <Text style={[styles.actionButtonText, styles.skipButtonText]}>
                ⏭️ 跳过此动作
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.finishButton]}
              onPress={handleCompleteTraining}
            >
              <Text style={[styles.actionButtonText, styles.finishButtonText]}>
                🎉 完成训练
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007bff",
    borderRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0f0ff",
  },
  restTimeInfo: {
    fontSize: 14,
    color: "#90ee90",
    marginTop: 4,
  },
  currentExerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  currentLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  currentExerciseName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  setInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  setNumber: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  percentage: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "600",
  },
  weight: {
    fontSize: 16,
    color: "#dc3545",
    fontWeight: "bold",
  },
  timerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "monospace",
  },
  timerDisplayWarning: {
    color: "#dc3545",
    fontSize: 52,
    textShadowColor: "#dc3545",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#007bff",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    width: 40,
    textAlign: "right",
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  warningText: {
    fontSize: 16,
    color: "#856404",
    fontWeight: "600",
    textAlign: "center",
  },
  hintText: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 12,
    fontStyle: "italic",
  },
  timerControls: {
    marginTop: 12,
  },
  controlButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#28a745",
  },
  stopButton: {
    backgroundColor: "#ffc107",
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  exercisesList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  exerciseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  exerciseItemActive: {
    backgroundColor: "#e7f3ff",
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  exerciseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  exerciseName: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    flex: 1,
  },
  exerciseNameActive: {
    color: "#007bff",
    fontWeight: "600",
  },
  exerciseMeta: {
    flexDirection: "row",
    gap: 12,
    marginLeft: 12,
    alignItems: "center",
  },
  exerciseSets: {
    fontSize: 14,
    color: "#007bff",
  },
  exercisePercentage: {
    fontSize: 14,
    color: "#28a745",
  },
  exerciseWeight: {
    fontSize: 14,
    color: "#dc3545",
    fontWeight: "bold",
  },
  currentIndicator: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -8 }],
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007bff",
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#28a745",
  },
  skipButton: {
    backgroundColor: "#6c757d",
  },
  finishButton: {
    backgroundColor: "#ffc107",
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  skipButtonText: {
    color: "#fff",
  },
  finishButtonText: {
    color: "#333",
  },
});
