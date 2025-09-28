import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";

export default function MedicineCalendar({ medicines }) {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    generateMarkedDates();
  }, [medicines]);

  const generateMarkedDates = () => {
    const today = new Date();
    const marks = {};

    for (let i = -10; i <= 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const key = date.toISOString().split("T")[0];
      const roll = Math.random();

      if (roll > 0.8) {
        marks[key] = { marked: true, dotColor: "#27ae60", customText: "✓" }; // taken
      } else if (roll > 0.6) {
        marks[key] = { marked: true, dotColor: "#f39c12", customText: "⚠" }; // partial
      } else if (roll > 0.4) {
        marks[key] = { marked: true, dotColor: "#e74c3c", customText: "✗" }; // missed
      } else {
        marks[key] = { marked: true, dotColor: "#3498db", customText: "🏥" }; // appointment
      }
    }

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
              selectedColor: "#2c3e50",
            },
          }),
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: "#2c3e50",
          todayTextColor: "#3498db",
          dotColor: "#2c3e50",
          arrowColor: "#2c3e50",
          monthTextColor: "#2c3e50",
          textDayFontWeight: "600",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "600",
        }}
      />

      {selectedDate && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            {new Date(selectedDate).toDateString()}
          </Text>
          <Text style={styles.infoSubtitle}>
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
            <Text style={styles.legendText}>Partially taken</Text>
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
            <Text style={styles.legendText}>Doctor appointment</Text>
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
