export default {
  expo: {
    name: "MediMate",
    slug: "medimate",
    version: "2.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#27ae60",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.medimate.app",
      infoPlist: {
        UIBackgroundModes: ["remote-notification"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#27ae60",
      },
      package: "com.medimate.app",
      permissions: [
        "RECEIVE_BOOT_COMPLETED",
        "SCHEDULE_EXACT_ALARM",
        "USE_EXACT_ALARM",
        "POST_NOTIFICATIONS",
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    scheme: "medimate",
    plugins: [
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#27ae60",
          sounds: ["./assets/notification.wav"],
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "your-project-id-here",
      },
    },
  },
};
