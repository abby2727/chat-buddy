import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#0F0F13" : "#FFFFFF",
        },
        headerTintColor: isDark ? "#FFFFFF" : "#0F0F13",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: isDark ? "#0F0F13" : "#F4F4F8",
        },
      }}
    />
  );
}
