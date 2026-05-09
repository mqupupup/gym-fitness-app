import { Stack } from "expo-router";

export default function TexasMethodLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // title: "德州55训练法",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="texas-powerlifting"
        options={{ title: "专注力量举3日", headerShown: false }}
      />
      <Stack.Screen
        name="texas-classic"
        options={{ title: "经典3日计划", headerShown: false }}
      />
      <Stack.Screen
        name="texas-split"
        options={{ title: "4日分化计划", headerShown: false }}
      />
    </Stack>
  );
}
