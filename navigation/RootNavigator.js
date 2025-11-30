import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TabNavigator from "./TabNavigator";
import SettingsScreen from "../screens/SettingsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import { useTheme } from "../context/ThemeContext";

const Stack = createStackNavigator();

// Root Stack Navigator with Settings accessible via header icon
export default function RootNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={({ navigation }) => ({
          headerTitle: "MediMate",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: "Settings",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerTitle: "History",
          presentation: "card",
        }}
      />
    </Stack.Navigator>
  );
}
