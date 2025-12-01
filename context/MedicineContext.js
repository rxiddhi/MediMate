import React, { createContext, useContext, useReducer } from "react";
import storageService from "../services/storageService";
import notificationService from "../services/notificationService";

const MedicineContext = createContext();

const initialState = {
  medicines: [],
  appointments: [],
  medicineHistory: [],
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
    case "LOAD_APPOINTMENTS":
      return { ...state, appointments: action.payload, loading: false };
    case "ADD_APPOINTMENT":
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      };
    case "UPDATE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.map((apt) =>
          apt.id === action.payload.id ? action.payload : apt
        ),
      };
    case "DELETE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.filter(
          (apt) => apt.id !== action.payload
        ),
      };
    case "LOAD_MEDICINE_HISTORY":
      return { ...state, medicineHistory: action.payload };
    default:
      return state;
  }
};

export const MedicineProvider = ({ children }) => {
  const [state, dispatch] = useReducer(medicineReducer, initialState);

  const loadMedicines = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const medicines = await storageService.getMedicines();
      dispatch({
        type: "LOAD_MEDICINES",
        payload: medicines || [],
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
      await storageService.saveMedicines(updatedMedicines);

      // Schedule notifications
      await notificationService.scheduleMedicineNotifications(newMedicine);

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

      await storageService.saveMedicines(updatedMedicines);
      const updatedMedicine = updatedMedicines.find((med) => med.id === id);
      if (updates.times || updates.frequency) {
        await notificationService.updateMedicineNotifications(updatedMedicine);
      }
      dispatch({ type: "UPDATE_MEDICINE", payload: updatedMedicine });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const deleteMedicine = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const updatedMedicines = state.medicines.filter((med) => med.id !== id);
      await storageService.saveMedicines(updatedMedicines);

      // Cancel notifications
      await notificationService.cancelMedicineNotifications(id);
      dispatch({ type: "DELETE_MEDICINE", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };
  const markDoseTaken = async (id, scheduledTime = null) => {
    try {
      const medicine = state.medicines.find((med) => med.id === id);
      if (medicine) {
        const now = new Date();
        const updatedMedicines = state.medicines.map((med) =>
          med.id === id ? { ...med, lastTaken: now.toISOString() } : med
        );

        await storageService.saveMedicines(updatedMedicines);

        // Add to history
        await storageService.addMedicineHistoryRecord({
          medicineId: id,
          medicineName: medicine.name,
          dosage: medicine.dosage,
          status: "taken",
          scheduledTime: scheduledTime || now.toISOString(),
          takenTime: now.toISOString(),
          date: now.toISOString().split("T")[0],
        });

        const updatedMedicine = updatedMedicines.find((med) => med.id === id);
        dispatch({ type: "UPDATE_MEDICINE", payload: updatedMedicine });

        // Reload history to update UI
        loadMedicineHistory();
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const markDoseSkipped = async (id, scheduledTime = null) => {
    try {
      const medicine = state.medicines.find((med) => med.id === id);
      if (medicine) {
        const now = new Date();

        // Add to history
        await storageService.addMedicineHistoryRecord({
          medicineId: id,
          medicineName: medicine.name,
          dosage: medicine.dosage,
          status: "skipped",
          scheduledTime: scheduledTime || now.toISOString(),
          date: now.toISOString().split("T")[0],
        });

        // Reload history to update UI
        loadMedicineHistory();
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const loadProfile = async () => {
    try {
      const profile = await storageService.getProfile();
      dispatch({
        type: "LOAD_PROFILE",
        payload: profile,
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await storageService.saveProfile(profileData);
      dispatch({ type: "UPDATE_PROFILE", payload: profileData });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const getUpcomingDoses = () => {
    const now = new Date();
    const todayDate = now.toISOString().split("T")[0];
    const upcoming = [];

    state.medicines.forEach((medicine) => {
      if (!medicine.isActive) return;

      medicine.times.forEach((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const doseTime = new Date();
        doseTime.setHours(hours, minutes, 0, 0);

        // Skip doses that are in the past for today
        if (doseTime <= now) {
          doseTime.setDate(doseTime.getDate() + 1);
        }

        // Check if this dose was already taken today
        const isTakenToday =
          medicine.lastTaken &&
          new Date(medicine.lastTaken).toISOString().split("T")[0] ===
            todayDate;

        // Only show upcoming doses that haven't been taken today
        if (!isTakenToday || doseTime.toISOString().split("T")[0] > todayDate) {
          upcoming.push({
            medicineId: medicine.id,
            medicineName: medicine.name,
            dosage: medicine.dosage,
            time: time,
            scheduledTime: doseTime,
            notes: medicine.notes,
          });
        }
      });
    });

    return upcoming.sort((a, b) => a.scheduledTime - b.scheduledTime);
  };

  const loadAppointments = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const appointments = await storageService.getAppointments();
      dispatch({
        type: "LOAD_APPOINTMENTS",
        payload: appointments || [],
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const addAppointment = async (appointmentData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      let dateString;
      if (appointmentData.date instanceof Date) {
        dateString = appointmentData.date.toISOString().split("T")[0];
      } else if (typeof appointmentData.date === "string") {
        dateString = appointmentData.date.includes("T")
          ? appointmentData.date.split("T")[0]
          : appointmentData.date;
      } else {
        dateString = new Date(appointmentData.date).toISOString().split("T")[0];
      }

      let timeString;
      if (appointmentData.time instanceof Date) {
        timeString = appointmentData.time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } else {
        timeString = appointmentData.time;
      }

      const newAppointment = {
        id: Date.now().toString(),
        title: appointmentData.title,
        doctor: appointmentData.doctor,
        location: appointmentData.location || "",
        notes: appointmentData.notes || "",
        type: appointmentData.type || "checkup",
        date: dateString,
        time: timeString,
        createdAt: new Date().toISOString(),
      };

      const updatedAppointments = [...state.appointments, newAppointment];
      await storageService.saveAppointments(updatedAppointments);

      await notificationService.scheduleAppointmentNotification(newAppointment);

      dispatch({ type: "ADD_APPOINTMENT", payload: newAppointment });
      return newAppointment;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const updateAppointment = async (id, updates) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const updatedAppointments = state.appointments.map((apt) =>
        apt.id === id ? { ...apt, ...updates } : apt
      );

      await storageService.saveAppointments(updatedAppointments);

      const updatedAppointment = updatedAppointments.find(
        (apt) => apt.id === id
      );
      dispatch({ type: "UPDATE_APPOINTMENT", payload: updatedAppointment });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const deleteAppointment = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const updatedAppointments = state.appointments.filter(
        (apt) => apt.id !== id
      );

      await storageService.saveAppointments(updatedAppointments);

      dispatch({ type: "DELETE_APPOINTMENT", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const loadMedicineHistory = async () => {
    try {
      // First fill missing history
      await storageService.fillMissingHistory(state.medicines);
      const history = await storageService.getMedicineHistory();
      dispatch({ type: "LOAD_MEDICINE_HISTORY", payload: history || {} });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const value = {
    ...state,
    loadMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    markDoseTaken,
    markDoseSkipped,
    loadProfile,
    updateProfile,
    getUpcomingDoses,
    loadAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    loadMedicineHistory,
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
