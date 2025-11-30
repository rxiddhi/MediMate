import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import notificationService from "../services/notificationService";
import storageService from "../services/storageService";

export default function SettingsScreen({ navigation }) {
  const {
    theme,
    isDark,
    isSystemTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    spacing,
    typography,
    borderRadius,
  } = useTheme();

  // Easter egg: Triple tap counter
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Easter egg handler - triple tap on app icon
  const handleLogoTap = () => {
    const now = Date.now();

    // Reset if more than 1 second passed
    if (now - lastTapTime > 1000) {
      setTapCount(1);
    } else {
      setTapCount(tapCount + 1);
    }

    setLastTapTime(now);

    // Trigger on 3rd tap
    if (tapCount + 1 === 3) {
      const showToast = (message) => {
        if (Platform.OS === "android") {
          ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
          Alert.alert("🎉 Easter Egg!", message);
        }
      };

      showToast("💜 Made with love by humans who care about your health");
      setTapCount(0);
    }
  };

  const handleClearAllNotifications = async () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to cancel all scheduled notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await notificationService.cancelAllNotifications();
              Alert.alert("Success", "All notifications cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear notifications");
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your medicines and profile data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await storageService.clear();
              await notificationService.cancelAllNotifications();
              Alert.alert(
                "Success",
                "All data cleared. Please restart the app."
              );
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  const renderSection = (title, children) => (
    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      {children}
    </View>
  );

  const renderSettingRow = (
    icon,
    label,
    value,
    onPress,
    showChevron = true,
    description = null
  ) => (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.infoLight },
          ]}
        >
          <Ionicons name={icon} size={22} color={theme.colors.primary} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            {label}
          </Text>
          {description && (
            <Text
              style={[
                styles.settingDescription,
                { color: theme.colors.textTertiary },
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {value && (
          <Text
            style={[styles.settingValue, { color: theme.colors.textSecondary }]}
          >
            {value}
          </Text>
        )}
        {showChevron && onPress && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textTertiary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSwitchRow = (
    icon,
    label,
    value,
    onValueChange,
    description = null
  ) => (
    <View
      style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.infoLight },
          ]}
        >
          <Ionicons name={icon} size={22} color={theme.colors.primary} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            {label}
          </Text>
          {description && (
            <Text
              style={[
                styles.settingDescription,
                { color: theme.colors.textTertiary },
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primaryLight,
        }}
        thumbColor={value ? theme.colors.primary : theme.colors.disabled}
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Account Section */}
      {renderSection(
        "Account",
        <>
          {renderSettingRow(
            "person-circle-outline",
            "Profile",
            null,
            () => navigation.navigate("Main", { screen: "Profile" }),
            true,
            "Manage your personal information"
          )}
          {renderSettingRow(
            "shield-checkmark-outline",
            "Privacy & Security",
            null,
            () => Alert.alert("Privacy", "Privacy settings coming soon"),
            true,
            "Control your privacy settings"
          )}
        </>
      )}

      {/* Appearance Section */}
      {renderSection(
        "Appearance",
        <>
          {renderSwitchRow(
            "contrast-outline",
            "Use System Theme",
            isSystemTheme,
            async (value) => {
              if (value) {
                await setSystemTheme();
              } else {
                await setLightTheme();
              }
            },
            "Follow system light/dark mode settings"
          )}
          {!isSystemTheme &&
            renderSwitchRow(
              "moon-outline",
              "Dark Mode",
              isDark,
              async (value) => {
                if (value) {
                  await setDarkTheme();
                } else {
                  await setLightTheme();
                }
              },
              "Enable dark theme"
            )}
        </>
      )}

      {/* Notifications Section */}
      {renderSection(
        "Notifications",
        <>
          {renderSettingRow(
            "notifications-outline",
            "Medicine Reminders",
            "Enabled",
            () =>
              Alert.alert(
                "Notifications",
                "Notification preferences coming soon"
              ),
            true,
            "Configure reminder notifications"
          )}
          {renderSettingRow(
            "trash-outline",
            "Clear All Notifications",
            null,
            handleClearAllNotifications,
            true,
            "Cancel all scheduled reminders"
          )}
        </>
      )}

      {/* Data & Storage Section */}
      {renderSection(
        "Data & Storage",
        <>
          {renderSettingRow(
            "cloud-upload-outline",
            "Backup & Sync",
            "Not configured",
            () => Alert.alert("Backup", "Cloud backup coming soon"),
            true,
            "Backup your data to cloud"
          )}
          {renderSettingRow(
            "trash-bin-outline",
            "Clear All Data",
            null,
            handleClearAllData,
            true,
            "Delete all medicines and profile data"
          )}
        </>
      )}

      {/* Support Section */}
      {renderSection(
        "Support & About",
        <>
          {renderSettingRow(
            "help-circle-outline",
            "Help & Support",
            null,
            () => Alert.alert("Help", "Support resources coming soon"),
            true
          )}
          {renderSettingRow(
            "document-text-outline",
            "Terms & Conditions",
            null,
            () => Alert.alert("Terms", "Terms and conditions coming soon"),
            true
          )}
          {renderSettingRow(
            "information-circle-outline",
            "About MediMate",
            "Version 2.0.0",
            null,
            false
          )}
        </>
      )}

      {/* App Info Card */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleLogoTap}
        style={[
          styles.infoCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.appIconContainer,
            { backgroundColor: theme.colors.primaryLight },
          ]}
        >
          <Ionicons name="medical" size={32} color="#fff" />
        </View>
        <Text style={[styles.appName, { color: theme.colors.text }]}>
          MediMate
        </Text>
        <Text
          style={[styles.appTagline, { color: theme.colors.textSecondary }]}
        >
          Your personal medicine companion
        </Text>
        <Text style={[styles.appVersion, { color: theme.colors.textTertiary }]}>
          Version 2.0.0 • Healthcare Grade
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    minHeight: 56,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  infoCard: {
    margin: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  appIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 12,
    textAlign: "center",
  },
});
