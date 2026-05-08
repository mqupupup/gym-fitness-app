import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { powerliftingStyles as styles } from "../styles/powerliftingStyles";
import { Gender } from "../types/powerlifting";

interface InputSectionProps {
  gender: Gender;
  setGender: (gender: Gender) => void;
  weight: string;
  setWeight: (weight: string) => void;
  squat: string;
  setSquat: (squat: string) => void;
  bench: string;
  setBench: (bench: string) => void;
  deadlift: string;
  setDeadlift: (deadlift: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  gender,
  setGender,
  weight,
  setWeight,
  squat,
  setSquat,
  bench,
  setBench,
  deadlift,
  setDeadlift,
}) => {
  return (
    <>
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
          <Text style={styles.inputLabel}>Squat 🦵 深蹲</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={squat}
              onChangeText={setSquat}
              placeholder="深蹲重量"
              placeholderTextColor="#A0A0A5"
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bench Press 💪 卧推</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={bench}
              onChangeText={setBench}
              placeholder="卧推重量"
              placeholderTextColor="#A0A0A5"
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Deadlift 🏋️ 硬拉</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={deadlift}
              onChangeText={setDeadlift}
              placeholder="硬拉重量"
              placeholderTextColor="#A0A0A5"
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
        </View>
      </View>
    </>
  );
};
