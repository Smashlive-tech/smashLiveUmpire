import { Stack } from "expo-router";
import "../global.css";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="editable"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="start_match"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
  );
}
