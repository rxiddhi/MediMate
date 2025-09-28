import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { MedicineProvider } from "./context/MedicineContext";
import TabNavigator from "./navigation/TabNavigator";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync().then(({ status }) => {
      if (status !== "granted") {
        console.log("Notification permissions not granted");
      }
    });
  }, []);

  return (
    <MedicineProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <TabNavigator />
      </NavigationContainer>
    </MedicineProvider>
  );
}
