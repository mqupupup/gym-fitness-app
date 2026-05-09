import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function TexasMethodPlans() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "德州55训练法",
      headerTitle: "德州55训练法",
    });
  }, [navigation]);

  const plans = [
    {
      id: "powerlifting",
      title: "专注力量举3日",
      description: "只练深蹲、卧推、硬拉、推举四个基础动作",
      route: "texas-powerlifting",
    },
    {
      id: "classic",
      title: "经典3日计划",
      description: "包含深蹲、卧推、硬拉 + 奥林匹克举重动作",
      route: "texas-classic",
    },
    {
      id: "split",
      title: "4日分化计划",
      description: "容量日和强度日分开，更适合进阶训练者",
      route: "texas-split",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.title}>德州55训练法</Text>
        <Text style={styles.subtitle}>选择适合您的训练计划</Text>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <Pressable
              key={plan.id}
              style={styles.planCard}
              onPress={() => navigation.navigate(plan.route as any)}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{plan.title}</Text>
              </View>
              <Text style={styles.planDescription}>{plan.description}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  title: {
    color: "#1C1C1E",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  planTitle: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  planDescription: {
    color: "#666666",
    fontSize: 14,
    lineHeight: 20,
  },
});
