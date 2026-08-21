import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { powerliftingStyles as styles } from "../styles/powerliftingStyles";
import { CoefficientType } from "../types/powerlifting";

interface CoefficientSelectorProps {
  coefficientType: CoefficientType;
  setCoefficientType: (type: CoefficientType) => void;
}

export const CoefficientSelector: React.FC<CoefficientSelectorProps> = ({
  coefficientType,
  setCoefficientType,
}) => {
  const coefficientInfo = [
    {
      type: "ipf_gl" as CoefficientType,
      name: "IPF GL 系数",
      description:
        "国际力量举联合会官方标准，基于大量科学研究，综合考虑性别、体重等因素。",
    },
    {
      type: "dots" as CoefficientType,
      name: "DOTS 系数",
      description:
        "OpenPowerlifting 数据库默认标准，在不同体重级别比较上表现更优。",
    },
    {
      type: "wilks" as CoefficientType,
      name: "Wilks 系数",
      description: "经典历史标准，曾是力量举界长期使用的黄金标准。",
    },
  ];

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>选择系数标准</Text>
      {coefficientInfo.map((info) => {
        const isSelected = info.type === coefficientType;
        return (
          <Pressable
            key={info.type}
            style={[
              styles.coefficientOption,
              isSelected && styles.coefficientOptionSelected,
            ]}
            onPress={() => setCoefficientType(info.type)}
            android_ripple={{ color: "rgba(106, 76, 147, 0.08)" }}
          >
            <View style={styles.optionHeader}>
              <Text
                style={[
                  styles.optionTitle,
                  isSelected && styles.optionTitleSelected,
                ]}
              >
                {info.name}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark" size={18} color="#6A4C93" />
              )}
            </View>
            <Text style={styles.optionDescription}>{info.description}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
