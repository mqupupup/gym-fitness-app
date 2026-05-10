import { Stack } from "expo-router";

export default function WeekLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[day]"
        options={{
          headerShown: false,
          title: "训练日",
        }}
      />
    </Stack>
  );
}
