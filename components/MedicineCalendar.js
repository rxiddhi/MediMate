import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

import { useMedicine } from "../context/MedicineContext";

export default function MedicineCalendar({ medicines }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { medicineHistory, appointments, loadAppointments } = useMedicine();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    generateMarkedDates();
  }, [medicineHistory, appointments]);

  const generateMarkedDates = () => {
    const marks = {};

    Object.keys(medicineHistory).forEach((date) => {
      const entry = medicineHistory[date];
      const total = (entry.taken || 0) + (entry.skipped || 0);

      let color = "#3498db";
      let text = "✓";

      if (entry.taken > 0 && entry.skipped === 0) {
        color = "#27ae60";
        text = "✓";
      } else if (entry.taken > 0 && entry.skipped > 0) {
        color = "#f39c12";
        text = "⚠";
      } else if (entry.taken === 0 && entry.skipped > 0) {
        color = "#e74c3c";
        text = "✗";
      }

      marks[date] = {
        marked: true,
        dotColor: color,
        customText: text,
        hasMedicine: true,
      };
    });

    console.log("Appointments to process:", appointments);

    if (appointments && appointments.length > 0) {
      appointments.forEach((appointment) => {
        let appointmentDate;

        if (appointment.date instanceof Date) {
          appointmentDate = appointment.date.toISOString().split("T")[0];
        } else if (typeof appointment.date === "string") {
          appointmentDate = appointment.date.includes("T")
            ? appointment.date.split("T")[0]
            : appointment.date;
        } else {
          console.log(
            "Skipping appointment with invalid date:",
            appointment.date
          );
          return;
        }

        console.log("Processing appointment date:", appointmentDate);

        if (marks[appointmentDate]) {
          marks[appointmentDate].hasAppointment = true;
          marks[appointmentDate].dotColor = "#9b59b6";
          marks[appointmentDate].customText =
            marks[appointmentDate].customText + " 🏥";
        } else {
          marks[appointmentDate] = {
            marked: true,
            dotColor: "#9b59b6",
            customText: "🏥",
            hasAppointment: true,
          };
        }
      });
    }

    console.log("Final marks:", marks);
    setMarkedDates(marks);
  };

  const getDateInfo = (dateString) => {
    const medicineInfo = markedDates[dateString];
    const dayAppointments = appointments.filter((apt) => {
      let appointmentDate;

      if (apt.date instanceof Date) {
        appointmentDate = apt.date.toISOString().split("T")[0];
      } else if (typeof apt.date === "string") {
        appointmentDate = apt.date.includes("T")
          ? apt.date.split("T")[0]
          : apt.date;
      }

      return appointmentDate === dateString;
    });

    return { medicineInfo, dayAppointments };
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
                  navigation.navigate("Appointment");
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

          {markedDates[selectedDate] && (
            <Text
              style={[
                styles.infoSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              {markedDates[selectedDate]?.customText === "✓" &&
                "All medicines taken"}
              {markedDates[selectedDate]?.customText === "⚠" &&
                "Partially taken"}
              {markedDates[selectedDate]?.customText === "✗" && "Missed doses"}
            </Text>
          )}

          {getDateInfo(selectedDate).dayAppointments.length > 0 && (
            <View style={styles.appointmentSection}>
              <Text
                style={[styles.appointmentLabel, { color: theme.colors.text }]}
              >
                Appointments:
              </Text>
              {getDateInfo(selectedDate).dayAppointments.map((apt) => (
                <View key={apt.id} style={styles.appointmentItem}>
                  <Text
                    style={[
                      styles.appointmentTitle,
                      { color: theme.colors.text },
                    ]}
                  >
                    {apt.title}
                  </Text>
                  <Text
                    style={[
                      styles.appointmentDoctor,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Dr. {apt.doctor} at {apt.time}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.addAppointmentButton}
            onPress={() => {
              navigation.navigate("Appointment");
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
              style={[styles.legendColor, { backgroundColor: "#9b59b6" }]}
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#27ae60",
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
    marginBottom: 8,
  },
  appointmentSection: {
    marginVertical: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  appointmentLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2c3e50",
  },
  appointmentItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  appointmentTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 2,
  },
  appointmentDoctor: {
    fontSize: 12,
    color: "#7f8c8d",
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
