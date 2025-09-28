import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMedicine } from "../context/MedicineContext";
import * as Notifications from "expo-notifications";

export default function AddMedicineScreen({ navigation }) {
  const { addMedicine } = useMedicine();

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "daily",
    times: ["08:00"],
    startDate: new Date(),
    endDate: null,
    notes: "",
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const frequencyOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Custom", value: "custom" },
  ];

  const commonTimes = [
    "06:00",
    "08:00",
    "12:00",
    "14:00",
    "18:00",
    "20:00",
    "22:00",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeToggle = (time) => {
    setFormData((prev) => {
      const newTimes = prev.times.includes(time)
        ? prev.times.filter((t) => t !== time)
        : [...prev.times, time];
      return { ...prev, times: newTimes };
    });
  };

  const handleCustomTime = (time) => {
    if (time && !formData.times.includes(time)) {
      setFormData((prev) => ({
        ...prev,
        times: [...prev.times, time],
      }));
    }
  };

  const removeTime = (timeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      times: prev.times.filter((time) => time !== timeToRemove),
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter medicine name");
      return false;
    }
    if (!formData.dosage.trim()) {
      Alert.alert("Error", "Please enter dosage");
      return false;
    }
    if (formData.times.length === 0) {
      Alert.alert("Error", "Please select at least one time");
      return false;
    }
    return true;
  };

  const scheduleNotification = async (medicine) => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return false;

      await Notifications.cancelAllScheduledNotificationsAsync();

      const notifications = [];
      medicine.times.forEach((time, index) => {
        const [hours, minutes] = time.split(":").map(Number);

        // Calculate the next occurrence of this time
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        // If the time has already passed today, schedule for tomorrow
        if (scheduledTime <= now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const notificationContent = {
          title: "💊 Medicine Reminder",
          body: `Time to take ${medicine.name} (${medicine.dosage})`,
          data: {
            medicineId: medicine.id,
            medicineName: medicine.name,
            dosage: medicine.dosage,
            time: time,
          },
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.HIGH,
        };

        const trigger = {
          date: scheduledTime,
          repeats: true,
        };

        notifications.push(
          Notifications.scheduleNotificationAsync({
            content: notificationContent,
            trigger,
            identifier: `${medicine.id}_${time}`,
          })
        );
      });

      await Promise.all(notifications);
      return true;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await addMedicine(formData);
      await scheduleNotification({ ...formData, id: Date.now().toString() });

      Alert.alert(
        "Success",
        "Medicine added successfully! You will receive notifications at the scheduled times.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving medicine:", error);
      Alert.alert("Error", "Failed to save medicine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTimeSelector = () => (
    <View style={styles.timeSection}>
      <Text style={styles.sectionTitle}>Reminder Times</Text>

      <View style={styles.timeGrid}>
        {commonTimes.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeButton,
              formData.times.includes(time) && styles.timeButtonSelected,
            ]}
            onPress={() => handleTimeToggle(time)}
          >
            <Text
              style={[
                styles.timeButtonText,
                formData.times.includes(time) && styles.timeButtonTextSelected,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.customTimeContainer}>
        <TextInput
          style={styles.customTimeInput}
          placeholder="Add custom time (HH:MM)"
          placeholderTextColor="#95a5a6"
          value=""
          onChangeText={handleCustomTime}
        />
      </View>

      {formData.times.length > 0 && (
        <View style={styles.selectedTimes}>
          <Text style={styles.selectedTimesTitle}>Selected Times:</Text>
          <View style={styles.selectedTimesList}>
            {formData.times.map((time) => (
              <View key={time} style={styles.selectedTimeChip}>
                <Text style={styles.selectedTimeText}>{time}</Text>
                <TouchableOpacity
                  style={styles.removeTimeButton}
                  onPress={() => removeTime(time)}
                >
                  <Text style={styles.removeTimeText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Add Medicine</Text>
        <Text style={styles.subtitle}>Set up your medicine reminders</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medicine Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder="e.g., Paracetamol, Vitamin D"
            placeholderTextColor="#95a5a6"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dosage *</Text>
          <TextInput
            style={styles.input}
            value={formData.dosage}
            onChangeText={(value) => handleInputChange("dosage", value)}
            placeholder="e.g., 500mg, 1 tablet, 2 capsules"
            placeholderTextColor="#95a5a6"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.frequencyContainer}>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.frequencyButton,
                  formData.frequency === option.value &&
                    styles.frequencyButtonSelected,
                ]}
                onPress={() => handleInputChange("frequency", option.value)}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    formData.frequency === option.value &&
                      styles.frequencyButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {renderTimeSelector()}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formData.startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={formData.startDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  handleInputChange("startDate", selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Date (Optional)</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formData.endDate
                ? formData.endDate.toLocaleDateString()
                : "No end date"}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={formData.endDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                handleInputChange("endDate", selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(value) => handleInputChange("notes", value)}
            placeholder="Any additional notes about this medicine..."
            placeholderTextColor="#95a5a6"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Adding..." : "Add Medicine"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  frequencyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ecf0f1",
    alignItems: "center",
  },
  frequencyButtonSelected: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  frequencyButtonText: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  frequencyButtonTextSelected: {
    color: "#fff",
  },
  timeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  timeButtonSelected: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  timeButtonText: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  timeButtonTextSelected: {
    color: "#fff",
  },
  customTimeContainer: {
    marginBottom: 16,
  },
  customTimeInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  selectedTimes: {
    marginTop: 8,
  },
  selectedTimesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  selectedTimesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedTimeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedTimeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  removeTimeButton: {
    marginLeft: 4,
  },
  removeTimeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  submitButton: {
    backgroundColor: "#27ae60",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#95a5a6",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
