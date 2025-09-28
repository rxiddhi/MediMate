import React, { createContext, useContext, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MedicineContext = createContext();

const initialState = {
  medicines: [],
  profile: null,
  loading: false,
  error: null,
};

const medicineReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOAD_MEDICINES":
      return { ...state, medicines: action.payload, loading: false };
    case "ADD_MEDICINE":
      return { ...state, medicines: [...state.medicines, action.payload] };
    case "UPDATE_MEDICINE":
      return {
        ...state,
        medicines: state.medicines.map((med) =>
          med.id === action.payload.id ? action.payload : med
        ),
      };
    case "DELETE_MEDICINE":
      return {
        ...state,
        medicines: state.medicines.filter((med) => med.id !== action.payload),
      };
    case "LOAD_PROFILE":
      return { ...state, profile: action.payload };
    case "UPDATE_PROFILE":
      return { ...state, profile: action.payload };
    default:
      return state;
  }
};

export const MedicineProvider = ({ children }) => {
  const [state, dispatch] = useReducer(medicineReducer, initialState);

  const loadMedicines = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const medicines = await AsyncStorage.getItem("@medimates_medicines");
      dispatch({
        type: "LOAD_MEDICINES",
        payload: medicines ? JSON.parse(medicines) : [],
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const addMedicine = async (medicineData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const newMedicine = {
        id: Date.now().toString(),
        ...medicineData,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastTaken: null,
      };

      const updatedMedicines = [...state.medicines, newMedicine];
      await AsyncStorage.setItem(
        "@medimates_medicines",
        JSON.stringify(updatedMedicines)
      );

      dispatch({ type: "ADD_MEDICINE", payload: newMedicine });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const updateMedicine = async (id, updates) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const updatedMedicines = state.medicines.map((med) =>
        med.id === id ? { ...med, ...updates } : med
      );

      await AsyncStorage.setItem(
        "@medimates_medicines",
        JSON.stringify(updatedMedicines)
      );

      const updatedMedicine = updatedMedicines.find((med) => med.id === id);
      dispatch({ type: "UPDATE_MEDICINE", payload: updatedMedicine });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const deleteMedicine = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const updatedMedicines = state.medicines.filter((med) => med.id !== id);

      await AsyncStorage.setItem(
        "@medimates_medicines",
        JSON.stringify(updatedMedicines)
      );
      dispatch({ type: "DELETE_MEDICINE", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const markDoseTaken = async (id) => {
    try {
      const medicine = state.medicines.find((med) => med.id === id);
      if (medicine) {
        const updatedMedicines = state.medicines.map((med) =>
          med.id === id ? { ...med, lastTaken: new Date().toISOString() } : med
        );

        await AsyncStorage.setItem(
          "@medimates_medicines",
          JSON.stringify(updatedMedicines)
        );

        const updatedMedicine = updatedMedicines.find((med) => med.id === id);
        dispatch({ type: "UPDATE_MEDICINE", payload: updatedMedicine });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const loadProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem("@medimates_profile");
      dispatch({
        type: "LOAD_PROFILE",
        payload: profile ? JSON.parse(profile) : null,
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await AsyncStorage.setItem(
        "@medimates_profile",
        JSON.stringify(profileData)
      );
      dispatch({ type: "UPDATE_PROFILE", payload: profileData });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const getUpcomingDoses = () => {
    const now = new Date();
    const upcoming = [];

    state.medicines.forEach((medicine) => {
      if (!medicine.isActive) return;

      medicine.times.forEach((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const doseTime = new Date();
        doseTime.setHours(hours, minutes, 0, 0);

        if (doseTime <= now) {
          doseTime.setDate(doseTime.getDate() + 1);
        }

        upcoming.push({
          medicineId: medicine.id,
          medicineName: medicine.name,
          dosage: medicine.dosage,
          time: time,
          scheduledTime: doseTime,
          notes: medicine.notes,
        });
      });
    });

    return upcoming.sort((a, b) => a.scheduledTime - b.scheduledTime);
  };

  const value = {
    ...state,
    loadMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    markDoseTaken,
    loadProfile,
    updateProfile,
    getUpcomingDoses,
  };

  console.log("MedicineContext value:", Object.keys(value));

  return (
    <MedicineContext.Provider value={value}>
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicine = () => {
  const context = useContext(MedicineContext);
  if (!context) {
    throw new Error("useMedicine must be used within a MedicineProvider");
  }
  return context;
};
