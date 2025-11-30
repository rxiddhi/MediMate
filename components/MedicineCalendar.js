import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";

export default function MedicineCalendar({ medicines }) {
=======
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

import { useMedicine } from "../context/MedicineContext";

export default function MedicineCalendar({ medicines }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { medicineHistory } = useMedicine();
>>>>>>> dd0e490 (changes)
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    generateMarkedDates();
<<<<<<< HEAD
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
=======
  }, [medicineHistory]);

  const generateMarkedDates = () => {
    const marks = {};
    
    Object.keys(medicineHistory).forEach(date => {
      const entry = medicineHistory[date];
      const total = (entry.taken || 0) + (entry.skipped || 0); // Approximate total if we don't track total scheduled
      // Or better, check if we have details
      
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
>>>>>>> dd0e490 (changes)

    setMarkedDates(marks);
  };

  return (
<<<<<<< HEAD
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
=======
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.calendarHeader}>
        <Text style={[styles.calendarTitle, { color: theme.colors.text }]}>
          Medicine Calendar
        </Text>
        <TouchableOpacity
          style={[
            styles.quickAddButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => {
            navigation.navigate("Appointment", {
              selectedDate: new Date().toISOString(),
            });
          }}
        >
          <Text style={styles.quickAddText}>+ Add Appointment</Text>
>>>>>>> dd0e490 (changes)
        </TouchableOpacity>
      </View>

      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
<<<<<<< HEAD
              selectedColor: "#2c3e50",
=======
              selectedColor: theme.colors.primary,
>>>>>>> dd0e490 (changes)
            },
          }),
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
<<<<<<< HEAD
          selectedDayBackgroundColor: "#2c3e50",
          todayTextColor: "#3498db",
          dotColor: "#2c3e50",
          arrowColor: "#2c3e50",
          monthTextColor: "#2c3e50",
          textDayFontWeight: "600",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "600",
=======
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
>>>>>>> dd0e490 (changes)
        }}
      />

      {selectedDate && (
<<<<<<< HEAD
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            {new Date(selectedDate).toDateString()}
          </Text>
          <Text style={styles.infoSubtitle}>
=======
        <View
          style={[styles.infoBox, { backgroundColor: theme.colors.background }]}
        >
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            {new Date(selectedDate).toDateString()}
          </Text>
          <Text
            style={[styles.infoSubtitle, { color: theme.colors.textSecondary }]}
          >
>>>>>>> dd0e490 (changes)
            {markedDates[selectedDate]?.customText === "✓" &&
              "All medicines taken"}
            {markedDates[selectedDate]?.customText === "⚠" && "Partially taken"}
            {markedDates[selectedDate]?.customText === "✗" && "Missed doses"}
            {markedDates[selectedDate]?.customText === "🏥" &&
              "Doctor appointment"}
          </Text>
          <TouchableOpacity
<<<<<<< HEAD
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
=======
            style={[
              styles.addAppointmentButton,
              { backgroundColor: theme.colors.secondary },
            ]}
            onPress={() => {
              navigation.navigate("Appointment", { selectedDate });
>>>>>>> dd0e490 (changes)
            }}
          >
            <Text style={styles.addAppointmentText}>
              + Add Doctor Appointment
            </Text>
          </TouchableOpacity>
        </View>
      )}

<<<<<<< HEAD
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
=======
      <View
        style={[styles.legend, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.legendTitle, { color: theme.colors.text }]}>
          Legend
        </Text>
>>>>>>> dd0e490 (changes)
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#27ae60" }]}
            />
<<<<<<< HEAD
            <Text style={styles.legendText}>All medicines taken</Text>
=======
            <Text
              style={[styles.legendText, { color: theme.colors.textSecondary }]}
            >
              All medicines taken
            </Text>
>>>>>>> dd0e490 (changes)
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#f39c12" }]}
            />
<<<<<<< HEAD
            <Text style={styles.legendText}>Partially taken</Text>
=======
            <Text
              style={[styles.legendText, { color: theme.colors.textSecondary }]}
            >
              Partially taken
            </Text>
>>>>>>> dd0e490 (changes)
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#e74c3c" }]}
            />
<<<<<<< HEAD
            <Text style={styles.legendText}>Missed doses</Text>
=======
            <Text
              style={[styles.legendText, { color: theme.colors.textSecondary }]}
            >
              Missed doses
            </Text>
>>>>>>> dd0e490 (changes)
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#3498db" }]}
            />
<<<<<<< HEAD
            <Text style={styles.legendText}>Doctor appointment</Text>
=======
            <Text
              style={[styles.legendText, { color: theme.colors.textSecondary }]}
            >
              Doctor appointment
            </Text>
>>>>>>> dd0e490 (changes)
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    backgroundColor: "#fff",
=======
>>>>>>> dd0e490 (changes)
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
<<<<<<< HEAD
    color: "#2c3e50",
  },
  quickAddButton: {
    backgroundColor: "#27ae60",
=======
  },
  quickAddButton: {
>>>>>>> dd0e490 (changes)
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
<<<<<<< HEAD
    backgroundColor: "#f8f9fa",
=======
>>>>>>> dd0e490 (changes)
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
<<<<<<< HEAD
    color: "#2c3e50",
=======
>>>>>>> dd0e490 (changes)
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
<<<<<<< HEAD
    color: "#7f8c8d",
    marginBottom: 12,
  },
  addAppointmentButton: {
    backgroundColor: "#3498db",
=======
    marginBottom: 12,
  },
  addAppointmentButton: {
>>>>>>> dd0e490 (changes)
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
<<<<<<< HEAD
    backgroundColor: "#f8f9fa",
=======
>>>>>>> dd0e490 (changes)
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
<<<<<<< HEAD
    color: "#2c3e50",
=======
>>>>>>> dd0e490 (changes)
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
<<<<<<< HEAD
    color: "#7f8c8d",
=======
>>>>>>> dd0e490 (changes)
    flex: 1,
  },
});
