import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useHomeScreen } from "../hooks/useHomeScreen";
import { useTheme } from "../context/ThemeContext";
import MedicineCalendar from "../components/MedicineCalendar";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up? 🌙";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Night owl? 🦉";
};

const getUserName = () => {
  return "there";
};

const DoseCard = React.memo(({ item, onMarkTaken, theme }) => {
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

  return (
    <View style={[styles.doseCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.doseInfo}>
        <Text style={[styles.medicineName, { color: theme.colors.text }]}>
          {item.medicineName}
        </Text>
        <Text style={[styles.dosage, { color: theme.colors.textSecondary }]}>
          {item.dosage}
        </Text>
        <Text style={[styles.timeText, { color: theme.colors.error }]}>
          {formatTime(item.scheduledTime)} •{" "}
          {getTimeUntilDose(item.scheduledTime)}
        </Text>
        {item.notes && (
          <Text style={[styles.notes, { color: theme.colors.textTertiary }]}>
            {item.notes}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.takenButton, { backgroundColor: theme.colors.success }]}
        onPress={() => onMarkTaken(item)}
      >
        <Text style={styles.takenButtonText}>✓ Taken</Text>
      </TouchableOpacity>
    </View>
  );
});

const MedicineCard = React.memo(({ item, onDelete, theme }) => (
  <View style={[styles.medicineCard, { backgroundColor: theme.colors.card }]}>
    <View style={styles.medicineInfo}>
      <Text style={[styles.medicineName, { color: theme.colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.dosage, { color: theme.colors.textSecondary }]}>
        {item.dosage}
      </Text>
      <Text style={[styles.frequency, { color: theme.colors.textTertiary }]}>
        {item.frequency} • {item.times.join(", ")}
      </Text>
      {item.notes && (
        <Text style={[styles.notes, { color: theme.colors.textTertiary }]}>
          {item.notes}
        </Text>
      )}
    </View>
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => onDelete(item.id, item.name)}
    >
      <Text style={styles.deleteButtonText}>🗑️</Text>
    </TouchableOpacity>
  </View>
));

export default function HomeScreen({ navigation }) {
  const { theme, spacing, typography, borderRadius, shadows } = useTheme();
  const {
    medicines,
    medicineHistory,
    refreshing,
    upcomingDoses,
    onRefresh,
    handleMarkTaken,
    handleDeleteMedicine,
  } = useHomeScreen(navigation);

  // State for mood check-in card
  const [showMoodCard, setShowMoodCard] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);

  // Fade animation for cards - FIXED: Use useRef
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle fade-in on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculate stats for Status Card
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayHistory = medicineHistory[today];

    let taken = 0;
    let total = 0;

    if (todayHistory) {
      taken = todayHistory.taken || 0;
    }

    medicines.forEach((medicine) => {
      if (medicine.times && medicine.isActive !== false) {
        total += medicine.times.length;
      }
    });

    taken = Math.min(taken, total);
    const pending = Math.max(0, total - taken);
    const percentage = total > 0 ? (taken / total) * 100 : 0;

    return { total, taken, pending, percentage };
  }, [medicines, medicineHistory]);

  // Memoized callbacks
  const renderUpcomingDose = useCallback(
    ({ item }) => (
      <DoseCard item={item} onMarkTaken={handleMarkTaken} theme={theme} />
    ),
    [handleMarkTaken, theme]
  );

  const renderMedicine = useCallback(
    ({ item }) => (
      <MedicineCard item={item} onDelete={handleDeleteMedicine} theme={theme} />
    ),
    [handleDeleteMedicine, theme]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const upcomingKeyExtractor = useCallback(
    (item, index) => `${item.medicineId}_${item.time}_${index}`,
    []
  );

  // Memoized header component - MediAlert Style
  const ListHeaderComponent = useMemo(
    () => (
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <View style={styles.profileIcon}>
              <Ionicons name="person" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() =>
            Alert.alert("Search", "Search functionality coming soon!")
          }
        >
          <Ionicons
            name="search"
            size={22}
            color="#4D96FF"
            style={{ marginRight: 12 }}
          />
          <Text style={styles.searchText}>Search medicines...</Text>
        </TouchableOpacity>

        {/* Status Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("History")}
        >
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Today's Progress</Text>
              <Text style={styles.statusPercent}>
                {Math.round(stats.percentage)}%
              </Text>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${stats.percentage}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.pending}</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.taken}</Text>
                <Text style={styles.statLabel}>Taken</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#4D96FF15" }]}
            onPress={() => navigation.navigate("AddMedicine")}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#4D96FF" }]}>
              <Ionicons name="add-circle" size={24} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Add Medicine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#6BCB7715" }]}
            onPress={() => navigation.navigate("History")}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#6BCB77" }]}>
              <MaterialCommunityIcons name="history" size={24} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#FFB74D15" }]}
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Directory feature will be available soon!"
              )
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: "#FFB74D" }]}>
              <Ionicons name="search" size={24} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Directory</Text>
          </TouchableOpacity>
        </View>

        {upcomingDoses.length > 0 && (
          <View style={{ marginBottom: spacing.lg, marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Medicines Taken</Text>
            <FlatList
              data={upcomingDoses.slice(0, 3)}
              renderItem={renderUpcomingDose}
              keyExtractor={upcomingKeyExtractor}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
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

        <View style={{ marginTop: spacing.lg }}>
          <Text style={styles.sectionTitle}>Your Medicines</Text>
        </View>
      </Animated.View>
    ),
    [
      upcomingDoses,
      medicines,
      theme,
      renderUpcomingDose,
      upcomingKeyExtractor,
      fadeAnim,
      spacing,
      stats, // Added stats dependency
    ]
  );

  // Memoized empty component
  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No medicines added yet
        </Text>
        <Text
          style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}
        >
          Tap the + button to add your first medicine
        </Text>
      </View>
    ),
    [theme]
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: "#fff" }]}
      contentContainerStyle={styles.scrollContent}
      data={medicines}
      renderItem={renderMedicine}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={21}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4D96FF",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 25,
  },
  searchText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "500",
  },
  statusCard: {
    backgroundColor: "#4D96FF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#4D96FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  statusTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  statusPercent: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginBottom: 20,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 20,
  },
  actionCard: {
    width: "30%",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  doseCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  medicineCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  doseInfo: {
    flex: 1,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },
  dosage: {
    fontSize: 15,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  frequency: {
    fontSize: 13,
    color: "#95a5a6",
  },
  timeText: {
    fontSize: 15,
    color: "#e74c3c",
    fontWeight: "500",
  },
  notes: {
    fontSize: 13,
    color: "#95a5a6",
    fontStyle: "italic",
    marginTop: 6,
  },
  takenButton: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  takenButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 28,
  },
  emptyText: {
    fontSize: 17,
    marginBottom: 6,
    fontWeight: "500",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: "center",
  },
});
