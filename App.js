import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { MedicineProvider } from "./context/MedicineContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import RootNavigator from "./navigation/RootNavigator";
import notificationService from "./services/notificationService";

// Deep linking configuration
const linking = {
  prefixes: [Linking.createURL("/"), "medimate://"],
  config: {
    screens: {
      Main: {
        screens: {
          Home: "home",
          AddMedicine: "add-medicine",
          Appointment: "appointment",
          Profile: "profile",
        },
      },
      Settings: "settings",
    },
  },
};

function AppContent() {
  const { isDark } = useTheme();
  const navigationRef = useRef();

  useEffect(() => {
    // Request notification permissions
    notificationService.requestPermissions();

    // Set notification categories
    notificationService.setNotificationCategories();

    // Setup notification listener for deep linking
    const subscription =
      notificationService.setupNotificationListener(navigationRef);

    // Handle notification that opened the app from killed state
    notificationService.getLastNotificationResponse().then((response) => {
      if (response && response.notification.request.content.data.screen) {
        const data = response.notification.request.content.data;
        if (navigationRef.current) {
          navigationRef.current.navigate(data.screen, {
            medicineId: data.medicineId,
          });
        }
      }
    });

    return () => subscription?.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <MedicineProvider>
          <AppContent />
        </MedicineProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
