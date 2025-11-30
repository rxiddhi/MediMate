import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import AddMedicineScreen from "../screens/AddMedicineScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AppointmentScreen from "../screens/AppointmentScreen";
<<<<<<< HEAD
=======
import { useTheme } from "../context/ThemeContext";
>>>>>>> dd0e490 (changes)

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
<<<<<<< HEAD
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
=======
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
>>>>>>> dd0e490 (changes)
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "AddMedicine") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Appointment") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
<<<<<<< HEAD
        tabBarActiveTintColor: "#27ae60",
        tabBarInactiveTintColor: "#7f8c8d",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ecf0f1",
=======
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
>>>>>>> dd0e490 (changes)
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
<<<<<<< HEAD
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#ecf0f1",
        },
        headerTitleStyle: { color: "#2c3e50", fontWeight: "600" },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddMedicine" component={AddMedicineScreen} />
      <Tab.Screen name="Appointment" component={AppointmentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
=======
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="AddMedicine"
        component={AddMedicineScreen}
        options={{ tabBarLabel: "Add Medicine" }}
      />
      <Tab.Screen
        name="Appointment"
        component={AppointmentScreen}
        options={{ tabBarLabel: "Appointments" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
>>>>>>> dd0e490 (changes)
    </Tab.Navigator>
  );
}
