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

export default function AppointmentScreen({ navigation, route }) {
  const { selectedDate } = route.params || {};

  const [appointment, setAppointment] = useState({
    title: "",
    doctor: "",
    location: "",
    date: selectedDate || new Date(),
    time: new Date(),
    notes: "",
    type: "checkup", // checkup, followup, emergency, specialist
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const appointmentTypes = [
    { label: "Regular Checkup", value: "checkup" },
    { label: "Follow-up", value: "followup" },
    { label: "Specialist", value: "specialist" },
    { label: "Emergency", value: "emergency" },
  ];

  const handleInputChange = (field, value) => {
    setAppointment((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!appointment.title.trim()) {
      Alert.alert("Error", "Please enter appointment title");
      return false;
    }
    if (!appointment.doctor.trim()) {
      Alert.alert("Error", "Please enter doctor name");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Here you would save to AsyncStorage or your storage system
      Alert.alert("Success", "Appointment saved successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Add Appointment</Text>
        <Text style={styles.subtitle}>Schedule your doctor visit</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appointment Title *</Text>
          <TextInput
            style={styles.input}
            value={appointment.title}
            onChangeText={(value) => handleInputChange("title", value)}
            placeholder="e.g., Annual Checkup, Heart Specialist"
            placeholderTextColor="#95a5a6"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Doctor Name *</Text>
          <TextInput
            style={styles.input}
            value={appointment.doctor}
            onChangeText={(value) => handleInputChange("doctor", value)}
            placeholder="e.g., Dr. Smith, Dr. Johnson"
            placeholderTextColor="#95a5a6"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={appointment.location}
            onChangeText={(value) => handleInputChange("location", value)}
            placeholder="e.g., City Hospital, Clinic Name"
            placeholderTextColor="#95a5a6"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appointment Type</Text>
          <View style={styles.typeContainer}>
            {appointmentTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  appointment.type === type.value && styles.typeButtonSelected,
                ]}
                onPress={() => handleInputChange("type", type.value)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    appointment.type === type.value &&
                      styles.typeButtonTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {appointment.date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={appointment.date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  handleInputChange("date", selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {appointment.time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={appointment.time}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  handleInputChange("time", selectedTime);
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={appointment.notes}
            onChangeText={(value) => handleInputChange("notes", value)}
            placeholder="Any additional notes about this appointment..."
            placeholderTextColor="#95a5a6"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Saving..." : "Save Appointment"}
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
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ecf0f1",
    alignItems: "center",
    minWidth: "45%",
  },
  typeButtonSelected: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  typeButtonText: {
    fontSize: 12,
    color: "#7f8c8d",
    fontWeight: "500",
    textAlign: "center",
  },
  typeButtonTextSelected: {
    color: "#fff",
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
    backgroundColor: "#3498db",
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
