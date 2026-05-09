import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Wendler531Page() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Wendler 5-3-1 计划",
      headerTitle: "Wendler 5-3-1 计划",
    });
  }, [navigation]);

  // 示例计划数据
  const examplePlanData = {
    userWeight: 85,
    barWeight: 20,
    lifts: {
      squat: {
        weight: 140,
        reps: 5,
        oneRepMax: 156.8, // 使用Brzycki公式计算: 140 * (36/(37-5)) = 156.8
      },
      bench: {
        weight: 90,
        reps: 5,
        oneRepMax: 100.8,
      },
      deadlift: {
        weight: 160,
        reps: 5,
        oneRepMax: 179.2,
      },
      press: {
        weight: 60,
        reps: 5,
        oneRepMax: 67.2,
      },
    },
    progression: {
      squat: 10,
      bench: 5,
      deadlift: 10,
      press: 5,
    },
    bbbPercentage: 50,
  };

  const handleStartTraining = () => {
    router.push(`/powerlifting-plans/wendler-531/wendler-input`);
  };

  const handleViewExample = () => {
    // 将示例数据作为参数传递给详情页面
    router.push({
      // pathname: "./wendler-detail",
      pathname: `/powerlifting-plans/wendler-531/wendler-detail`,
      params: { planData: JSON.stringify(examplePlanData) },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wendler 5-3-1 计划</Text>
      <Text style={styles.description}>请选择操作：</Text>

      <Pressable style={styles.button} onPress={handleStartTraining}>
        <Text style={styles.buttonText}>开始设置参数</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#4A4A4A" }]}
        onPress={handleViewExample}
      >
        <Text style={styles.buttonText}>查看示例计划</Text>
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: "#34C759" }]}
        // onPress={() => router.push("./wendler-log")}
        onPress={() =>
          router.push(`/powerlifting-plans/wendler-531/wendler-log`)
        }
      >
        <Text style={styles.buttonText}>查看训练记录</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F2F2F7",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    width: "80%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
