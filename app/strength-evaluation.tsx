import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StrengthEvaluation() {
  const navigation = useNavigation();
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [bench, setBench] = useState("");
  const [squat, setSquat] = useState("");
  const [deadlift, setDeadlift] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ title: "健美式力量评估" });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
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
          <Text style={styles.label}>卧推1RM</Text>
          <TextInput
            style={styles.input}
            value={bench}
            onChangeText={setBench}
            placeholder="请输入卧推1RM（kg）"
            placeholderTextColor="#6f7280"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>深蹲1RM</Text>
          <TextInput
            style={styles.input}
            value={squat}
            onChangeText={setSquat}
            placeholder="请输入深蹲1RM（kg）"
            placeholderTextColor="#6f7280"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>硬拉1RM</Text>
          <TextInput
            style={styles.input}
            value={deadlift}
            onChangeText={setDeadlift}
            placeholder="请输入硬拉1RM（kg）"
            placeholderTextColor="#6f7280"
            keyboardType="numeric"
          />
        </View>

        <Pressable style={styles.submitButton}>
          <Text style={styles.submitText}>开始评估</Text>
        </Pressable>
      </ScrollView>
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
    paddingBottom: 32,
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
    marginTop: 10,
    backgroundColor: "#4f9f3f",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
