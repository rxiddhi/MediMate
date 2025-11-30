import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useMedicine } from "../context/MedicineContext";

/**
 * Custom hook for AddMedicineScreen logic
 */
export const useAddMedicine = (navigation) => {
  const { addMedicine } = useMedicine();

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "daily",
    times: ["08:00"],
    startDate: new Date(),
    endDate: null,
    notes: "",
    recurringPattern: null,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTimeToggle = useCallback((time) => {
    setFormData((prev) => {
      const newTimes = prev.times.includes(time)
        ? prev.times.filter((t) => t !== time)
        : [...prev.times, time];
      return { ...prev, times: newTimes };
    });
  }, []);

  const handleCustomTime = useCallback(
    (time) => {
      if (time && !formData.times.includes(time)) {
        setFormData((prev) => ({
          ...prev,
          times: [...prev.times, time],
        }));
      }
    },
    [formData.times]
  );

  const removeTime = useCallback((timeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      times: prev.times.filter((time) => time !== timeToRemove),
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter medicine name");
      return false;
    }
    if (!formData.dosage.trim()) {
      Alert.alert("Error", "Please enter dosage");
      return false;
    }
    if (formData.times.length === 0) {
      Alert.alert("Error", "Please select at least one time");
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await addMedicine(formData);

      Alert.alert(
        "Success",
        "Medicine added successfully! You will receive notifications at the scheduled times.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving medicine:", error);
      Alert.alert("Error", "Failed to save medicine. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, addMedicine, navigation]);

  return {
    formData,
    loading,
    handleInputChange,
    handleTimeToggle,
    handleCustomTime,
    removeTime,
    handleSubmit,
  };
};
