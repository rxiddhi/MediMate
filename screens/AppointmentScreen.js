import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  FlatList,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMedicine } from "../context/MedicineContext";
import { useTheme } from "../context/ThemeContext";

export default function AppointmentScreen({ navigation, route }) {
  const { selectedDate } = route.params || {};
  const { theme } = useTheme();
  const { appointments, loadAppointments, addAppointment, deleteAppointment } =
    useMedicine();

  const [showForm, setShowForm] = useState(false);
  const [appointment, setAppointment] = useState({
    title: "",
    doctor: "",
    location: "",
    date: selectedDate ? new Date(selectedDate) : new Date(),
    time: new Date(),
    notes: "",
    type: "checkup",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

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
      await addAppointment(appointment);
      Alert.alert("Success", "Appointment saved successfully!", [
        {
          text: "OK",
          onPress: () => {
            setShowForm(false);
            setAppointment({
              title: "",
              doctor: "",
              location: "",
              date: new Date(),
              time: new Date(),
              notes: "",
              type: "checkup",
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, title) => {
    Alert.alert(
      "Delete Appointment",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAppointment(id);
          },
        },
      ]
    );
  };

  const renderAppointmentCard = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const appointmentTime = new Date(item.time);

    const getTypeColor = (type) => {
      switch (type) {
        case "checkup":
          return "#3498db";
        case "followup":
          return "#27ae60";
        case "specialist":
          return "#9b59b6";
        case "emergency":
          return "#e74c3c";
        default:
          return "#3498db";
      }
    };

    return (
      <View
        style={[styles.appointmentCard, { backgroundColor: theme.colors.card }]}
      >
        <View
          style={[
            styles.appointmentTypeIndicator,
            { backgroundColor: getTypeColor(item.type) },
          ]}
        />
        <View style={styles.appointmentContent}>
          <View style={styles.appointmentHeader}>
            <Text
              style={[styles.appointmentTitle, { color: theme.colors.text }]}
            >
              {item.title}
            </Text>
            <TouchableOpacity
              style={styles.deleteIconButton}
              onPress={() => handleDelete(item.id, item.title)}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.appointmentDoctor,
              { color: theme.colors.textSecondary },
            ]}
          >
            👨‍⚕️ {item.doctor}
          </Text>
          {item.location && (
            <Text
              style={[
                styles.appointmentLocation,
                { color: theme.colors.textTertiary },
              ]}
            >
              📍 {item.location}
            </Text>
          )}
          <View style={styles.appointmentDateTime}>
            <Text
              style={[styles.appointmentDate, { color: theme.colors.primary }]}
            >
              📅 {appointmentDate.toLocaleDateString()}
            </Text>
            <Text
              style={[styles.appointmentTime, { color: theme.colors.primary }]}
            >
              🕐{" "}
              {appointmentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          {item.notes && (
            <Text
              style={[
                styles.appointmentNotes,
                { color: theme.colors.textTertiary },
              ]}
            >
              {item.notes}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.card,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Appointments
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>
            {showForm ? "✕ Close" : "+ New"}
          </Text>
        </TouchableOpacity>
      </View>

      {showForm ? (
        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
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
                    appointment.type === type.value &&
                      styles.typeButtonSelected,
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
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Saving..." : "Save Appointment"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                No appointments scheduled
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: theme.colors.textTertiary },
                ]}
              >
                Tap the + New button to add an appointment
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    padding: 16,
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
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
  appointmentCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
  },
  appointmentTypeIndicator: {
    width: 6,
  },
  appointmentContent: {
    flex: 1,
    padding: 16,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  deleteIconButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 18,
  },
  appointmentDoctor: {
    fontSize: 16,
    marginBottom: 4,
  },
  appointmentLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  appointmentDateTime: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: "500",
  },
  appointmentNotes: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
});
