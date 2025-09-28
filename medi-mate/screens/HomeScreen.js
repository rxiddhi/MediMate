import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useMedicine } from "../context/MedicineContext";
import MedicineCalendar from "../components/MedicineCalendar";

export default function HomeScreen({ navigation }) {
  const {
    medicines,
    loading,
    loadMedicines,
    deleteMedicine,
    markDoseTaken,
    getUpcomingDoses,
  } = useMedicine();

  const [refreshing, setRefreshing] = useState(false);
  const [upcomingDoses, setUpcomingDoses] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (getUpcomingDoses) {
      setUpcomingDoses(getUpcomingDoses());
    }
  }, [medicines, getUpcomingDoses]);

  const loadData = async () => {
    await loadMedicines();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleMarkTaken = async (dose) => {
    try {
      if (markDoseTaken) {
        await markDoseTaken(dose.medicineId);
        Alert.alert("Success", `${dose.medicineName} marked as taken!`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to mark dose as taken");
    }
  };

  const handleDeleteMedicine = (medicineId, medicineName) => {
    Alert.alert(
      "Delete Medicine",
      `Are you sure you want to delete ${medicineName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (deleteMedicine) {
                await deleteMedicine(medicineId);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete medicine");
            }
          },
        },
      ]
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTimeUntilDose = (scheduledTime) => {
    const now = new Date();
    const diff = scheduledTime - now;

    if (diff <= 0) return "Overdue";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const renderUpcomingDose = ({ item }) => (
    <View style={styles.doseCard}>
      <View style={styles.doseInfo}>
        <Text style={styles.medicineName}>{item.medicineName}</Text>
        <Text style={styles.dosage}>{item.dosage}</Text>
        <Text style={styles.timeText}>
          {formatTime(item.scheduledTime)} •{" "}
          {getTimeUntilDose(item.scheduledTime)}
        </Text>
        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
      </View>
      <TouchableOpacity
        style={styles.takenButton}
        onPress={() => handleMarkTaken(item)}
      >
        <Text style={styles.takenButtonText}>✓ Taken</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMedicine = ({ item }) => (
    <View style={styles.medicineCard}>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.dosage}>{item.dosage}</Text>
        <Text style={styles.frequency}>
          {item.frequency} • {item.times.join(", ")}
        </Text>
        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteMedicine(item.id, item.name)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
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
        <Text style={styles.title}>MediMate</Text>
        <Text style={styles.subtitle}>Your Medicine Reminders</Text>
      </View>

      {upcomingDoses.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Doses</Text>
          <FlatList
            data={upcomingDoses.slice(0, 3)}
            renderItem={renderUpcomingDose}
            keyExtractor={(item, index) =>
              `${item.medicineId}_${item.time}_${index}`
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <MedicineCalendar
        medicines={medicines}
        onDateSelect={(date) => {
          Alert.alert(
            "Date Selected",
            `Selected: ${date.toLocaleDateString()}\n\nTap to add medicine notes or doctor appointment`,
            [{ text: "OK" }]
          );
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Medicines</Text>
        {medicines.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No medicines added yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first medicine
            </Text>
          </View>
        ) : (
          <FlatList
            data={medicines}
            renderItem={renderMedicine}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
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
    padding: 16,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  doseCard: {
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
  medicineCard: {
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
  doseInfo: {
    flex: 1,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  frequency: {
    fontSize: 12,
    color: "#95a5a6",
  },
  timeText: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "500",
  },
  notes: {
    fontSize: 12,
    color: "#95a5a6",
    fontStyle: "italic",
    marginTop: 4,
  },
  takenButton: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  takenButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#95a5a6",
  },
});
