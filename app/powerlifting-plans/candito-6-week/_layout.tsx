// app/powerlifting-plans/candito-6-week/_layout.tsx

import { Stack } from "expo-router";

export default function CanditoLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Candito 6周训练计划",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#1C1C1E",
          },
          headerTintColor: "#FF3B30",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="week"
        options={{
          title: "训练周",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#1C1C1E",
          },
          headerTintColor: "#FF3B30",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="day"
        options={{
          title: "训练日",
          headerShown: false,

          headerStyle: {
            backgroundColor: "#1C1C1E",
          },
          headerTintColor: "#FF3B30",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="logs"
        options={{
          title: "训练记录",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#1C1C1E",
          },
          headerTintColor: "#FF3B30",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
}
