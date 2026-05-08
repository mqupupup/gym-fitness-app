import React from "react";
import { Pressable, Text, View } from "react-native";
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
        "OpenPowerlifting数据库默认标准，在不同体重级别比较上表现更优。",
    },
    {
      type: "wilks" as CoefficientType,
      name: "Wilks 系数",
      description: "经典历史标准，曾是力量举界长期使用的'黄金标准'。",
    },
  ];

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>选择系数标准</Text>
      {coefficientInfo.map((info) => (
        <Pressable
          key={info.type}
          style={[
            styles.coefficientOption,
            info.type === coefficientType && styles.coefficientOptionSelected,
          ]}
          onPress={() => setCoefficientType(info.type)}
        >
          <View style={styles.optionHeader}>
            <Text
              style={[
                styles.optionTitle,
                info.type === coefficientType && styles.optionTitleSelected,
              ]}
            >
              {info.name}
            </Text>
            {info.type === coefficientType && (
              <Text style={styles.selectedIndicator}>✓</Text>
            )}
          </View>
          <Text style={styles.optionDescription}>{info.description}</Text>
        </Pressable>
      ))}
    </View>
  );
};
