import { Stack } from "expo-router";

export default function MadcowLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 静态路由 */}
      <Stack.Screen
        name="index"
        options={{
          title: "疯牛55 计划",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
