import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen
        name="confirm_result"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
  );
}
