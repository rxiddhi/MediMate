import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function MedicineItem({ medicine, onDelete, onMarkTaken }) {
  const formatTimes = (times) => {
    return times.join(", ");
  };

  const getStatusColor = (isActive) => {
    return isActive ? "#27ae60" : "#95a5a6";
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{medicine.name}</Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(medicine.isActive) },
            ]}
          />
        </View>

        <Text style={styles.dosage}>{medicine.dosage}</Text>
        <Text style={styles.times}>{formatTimes(medicine.times)}</Text>

        {medicine.notes && <Text style={styles.notes}>{medicine.notes}</Text>}

        <View style={styles.footer}>
          <Text style={styles.frequency}>{medicine.frequency}</Text>
          {medicine.lastTaken && (
            <Text style={styles.lastTaken}>
              Last taken: {new Date(medicine.lastTaken).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {onMarkTaken && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onMarkTaken(medicine)}
          >
            <Text style={styles.actionText}>✓</Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(medicine.id, medicine.name)}
          >
            <Text style={[styles.actionText, styles.deleteText]}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  dosage: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  times: {
    fontSize: 12,
    color: "#95a5a6",
    marginBottom: 4,
  },
  notes: {
    fontSize: 12,
    color: "#95a5a6",
    fontStyle: "italic",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  frequency: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "500",
  },
  lastTaken: {
    fontSize: 10,
    color: "#95a5a6",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#27ae60",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteText: {
    fontSize: 12,
  },
});
