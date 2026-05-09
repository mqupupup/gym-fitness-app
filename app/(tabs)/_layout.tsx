import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          const iconSize = focused ? size + 2 : size;

          switch (route.name) {
            case "training":
              iconName = focused ? "barbell" : "barbell-outline";
              break;
            case "exercises":
              iconName = focused ? "fitness" : "fitness-outline";
              break;
            case "history":
              iconName = focused ? "time" : "time-outline";
              break;
            case "my":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = focused ? "ellipse" : "ellipse-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={iconSize}
              color={color}
              style={{
                transform: [{ scale: focused ? 1.15 : 1 }], // 轻微放大效果
                transition: "all 0.2s ease", // 平滑过渡
              }}
            />
          );
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
