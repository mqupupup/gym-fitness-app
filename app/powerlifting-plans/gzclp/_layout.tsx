import { Stack } from "expo-router";

export default function GZCLPLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 静态路由 */}
      <Stack.Screen
        name="index"
        options={{
          title: "GZCLP 计划",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="calculator"
        options={{
          title: "GZCLP 计算器",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#007bff",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
