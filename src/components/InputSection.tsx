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
      {/* 基本信息 */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>基本信息</Text>

        {/* 性别选择 */}
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
                男
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
                女
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 体重 */}
        <View style={styles.inputGroupLast}>
          <Text style={styles.inputLabel}>体重</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="请输入体重"
              placeholderTextColor="#C7C7CC"
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
        </View>
      </View>

      {/* 三大项极限重量 */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>三大项极限重量</Text>

        {/* 深蹲 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>深蹲</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={squat}
              onChangeText={setSquat}
              placeholder="请输入深蹲 1RM"
              placeholderTextColor="#C7C7CC"
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
        </View>

        {/* 卧推 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>卧推</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={bench}
              onChangeText={setBench}
              placeholder="请输入卧推 1RM"
              placeholderTextColor="#C7C7CC"
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
        </View>

        {/* 硬拉 */}
        <View style={styles.inputGroupLast}>
          <Text style={styles.inputLabel}>硬拉</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={deadlift}
              onChangeText={setDeadlift}
              placeholder="请输入硬拉 1RM"
              placeholderTextColor="#C7C7CC"
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
        </View>
      </View>
    </>
  );
};
