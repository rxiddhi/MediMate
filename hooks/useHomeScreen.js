import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useMedicine } from "../context/MedicineContext";

export const useHomeScreen = (navigation) => {
  const {
    medicines,
    loading,
    loadMedicines,
    deleteMedicine,
    markDoseTaken,
    getUpcomingDoses,
    loadMedicineHistory,
  } = useMedicine();

  const [refreshing, setRefreshing] = useState(false);
  const [upcomingDoses, setUpcomingDoses] = useState([]);

  // Load data on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  // Update upcoming doses when medicines change
  useEffect(() => {
    if (getUpcomingDoses) {
      setUpcomingDoses(getUpcomingDoses());
    }
  }, [medicines, getUpcomingDoses]);

  const loadData = useCallback(async () => {
    await Promise.all([loadMedicines(), loadMedicineHistory()]);
  }, [loadMedicines, loadMedicineHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleMarkTaken = useCallback(
    async (dose) => {
      try {
        if (markDoseTaken) {
          await markDoseTaken(dose.medicineId, dose.scheduledTime.toISOString());
          Alert.alert("Success", `${dose.medicineName} marked as taken!`);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to mark dose as taken");
      }
    },
    [markDoseTaken]
  );

  const handleDeleteMedicine = useCallback(
    (medicineId, medicineName) => {
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
    },
    [deleteMedicine]
  );

  return {
    medicines,
    loading,
    refreshing,
    upcomingDoses,
    onRefresh,
    handleMarkTaken,
    handleDeleteMedicine,
  };
};
