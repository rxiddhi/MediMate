import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

import { useMedicine } from "../context/MedicineContext";

export default function MedicineCalendar({ medicines }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { medicineHistory } = useMedicine();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    generateMarkedDates();
  }, [medicineHistory]);

  const generateMarkedDates = () => {
    const marks = {};
    
    Object.keys(medicineHistory).forEach(date => {
      const entry = medicineHistory[date];
      const total = (entry.taken || 0) + (entry.skipped || 0);
      
      let color = "#3498db"; // default
      let text = "✓";

      if (entry.taken > 0 && entry.skipped === 0) {
        color = "#27ae60"; // All taken (assuming no skipped means all taken, or at least some taken and none skipped explicitly)
        text = "✓";
      } else if (entry.taken > 0 && entry.skipped > 0) {
        color = "#f39c12"; // Partial
        text = "⚠";
      } else if (entry.taken === 0 && entry.skipped > 0) {
        color = "#e74c3c"; // Missed
        text = "✗";
      }

      marks[date] = { marked: true, dotColor: color, customText: text };
    });
    setMarkedDates(marks);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>Medicine Calendar</Text>
        <TouchableOpacity
          style={styles.quickAddButton}
          onPress={() => {
            Alert.alert("Quick Add", "What would you like to add?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Doctor Appointment",
                onPress: () => {
                  Alert.alert("Success", "Appointment screen would open here");
                },
              },
              {
                text: "Medicine Note",
                onPress: () => {
                  Alert.alert(
                    "Success",
                    "Medicine note screen would open here"
                  );
                },
              },
            ]);
          }}
        >
          <Text style={styles.quickAddText}>+ Quick Add</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: theme.colors.primary,
            },
          }),
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: theme.colors.primary,
          todayTextColor: theme.colors.secondary,
          dotColor: theme.colors.primary,
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.text,
          textDayFontWeight: "600",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "600",
          backgroundColor: theme.colors.card,
          calendarBackground: theme.colors.card,
          textSectionTitleColor: theme.colors.textSecondary,
          dayTextColor: theme.colors.text,
        }}
      />

      {selectedDate && (
        <View
          style={[styles.infoBox, { backgroundColor: theme.colors.background }]}
        >
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            {new Date(selectedDate).toDateString()}
          </Text>
          <Text
            style={[styles.infoSubtitle, { color: theme.colors.textSecondary }]}
          >
            {markedDates[selectedDate]?.customText === "✓" &&
              "All medicines taken"}
            {markedDates[selectedDate]?.customText === "⚠" && "Partially taken"}
            {markedDates[selectedDate]?.customText === "✗" && "Missed doses"}
            {markedDates[selectedDate]?.customText === "🏥" &&
              "Doctor appointment"}
          </Text>
          <TouchableOpacity
            style={styles.addAppointmentButton}
            onPress={() => {
              Alert.alert(
                "Add Appointment",
                "Would you like to schedule a doctor appointment for this date?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Add Appointment",
                    onPress: () => {
                      // Navigate to appointment screen with selected date
                      Alert.alert(
                        "Success",
                        "Appointment screen would open here"
                      );
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.addAppointmentText}>
              + Add Doctor Appointment
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#27ae60" }]}
            />
            <Text style={styles.legendText}>All medicines taken</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#f39c12" }]}
            />
            <Text
              style={[styles.legendText, { color: theme.colors.textSecondary }]}
            >
              Partially taken
              </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#e74c3c" }]}
            />

            <Text style={styles.legendText}>Missed doses</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#3498db" }]}
            />
            <Text
              style={[styles.legendText, { color: theme.colors.textSecondary }]}
            >
              Doctor appointment
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  quickAddButton: {
    backgroundColor: "#27ae60",
  },
  quickAddButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quickAddText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 12,
  },
  addAppointmentButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  addAppointmentText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  legend: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",

    marginBottom: 8,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#7f8c8d",
    flex: 1,
  },
});
