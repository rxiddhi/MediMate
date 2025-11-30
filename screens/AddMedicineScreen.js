import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAddMedicine } from "../hooks/useAddMedicine";
import { useTheme } from "../context/ThemeContext";

export default function AddMedicineScreen({ navigation }) {
  const { theme } = useTheme();
  const {
    formData,
    loading,
    handleInputChange,
    handleTimeToggle,
    handleCustomTime,
    removeTime,
    handleSubmit,
  } = useAddMedicine(navigation);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const frequencyOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
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

  const renderTimeSelector = () => (
    <View style={styles.timeSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Reminder Times
      </Text>

      <View style={styles.timeGrid}>
        {commonTimes.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeButton,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
              },
              formData.times.includes(time) && {
                backgroundColor: theme.colors.success,
                borderColor: theme.colors.success,
              },
            ]}
            onPress={() => handleTimeToggle(time)}
          >
            <Text
              style={[
                styles.timeButtonText,
                { color: theme.colors.textSecondary },
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
          style={[
            styles.customTimeInput,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder="Add custom time (HH:MM)"
          placeholderTextColor={theme.colors.textTertiary}
          value=""
          onChangeText={handleCustomTime}
        />
      </View>

      {formData.times.length > 0 && (
        <View style={styles.selectedTimes}>
          <Text
            style={[styles.selectedTimesTitle, { color: theme.colors.text }]}
          >
            Selected Times:
          </Text>
          <View style={styles.selectedTimesList}>
            {formData.times.map((time) => (
              <View
                key={time}
                style={[
                  styles.selectedTimeChip,
                  { backgroundColor: theme.colors.secondary },
                ]}
              >
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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
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
          Add Medicine
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Set up your medicine reminders
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Medicine Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder="e.g., Paracetamol, Vitamin D"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Dosage *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            value={formData.dosage}
            onChangeText={(value) => handleInputChange("dosage", value)}
            placeholder="e.g., 500mg, 1 tablet, 2 capsules"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Frequency
          </Text>
          <View style={styles.frequencyContainer}>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.frequencyButton,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                  formData.frequency === option.value && {
                    backgroundColor: theme.colors.secondary,
                    borderColor: theme.colors.secondary,
                  },
                ]}
                onPress={() => handleInputChange("frequency", option.value)}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    { color: theme.colors.textSecondary },
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
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Start Date
          </Text>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
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
          <Text style={[styles.label, { color: theme.colors.text }]}>
            End Date (Optional)
          </Text>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
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
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Notes (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            value={formData.notes}
            onChangeText={(value) => handleInputChange("notes", value)}
            placeholder="Any additional notes about this medicine..."
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
            loading && styles.submitButtonDisabled,
          ]}
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
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
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
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
    borderWidth: 1,
    alignItems: "center",
  },
  frequencyButtonSelected: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  frequencyButtonText: {
    fontSize: 14,
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
    borderWidth: 1,
  },
  timeButtonSelected: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  timeButtonTextSelected: {
    color: "#fff",
  },
  customTimeContainer: {
    marginBottom: 16,
  },
  customTimeInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  selectedTimes: {
    marginTop: 8,
  },
  selectedTimesTitle: {
    fontSize: 14,
    fontWeight: "600",
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
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
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
});
