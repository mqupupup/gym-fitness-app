// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FF6B00",
        tabBarIcon: ({ color, size }) => {
          let icon;

          switch (route.name) {
            case "training":
              icon = "barbell-outline";
              break;
            case "exercises":
              icon = "fitness";
              break;
            case "history":
              icon = "time";
              break;
            case "my":
              icon = "person";
              break;
            default:
              icon = "ellipse";
          }

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="training" options={{ title: "训练" }} />
      <Tabs.Screen name="exercises" options={{ title: "动作" }} />
      <Tabs.Screen name="history" options={{ title: "历史" }} />
      <Tabs.Screen name="my" options={{ title: "我的" }} />
    </Tabs>
  );
}
