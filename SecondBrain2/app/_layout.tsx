import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="tasks" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="more" />
    </Stack>
  );
}

