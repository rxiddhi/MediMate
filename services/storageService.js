import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
export const STORAGE_KEYS = {
  MEDICINES: "@medimates_medicines",
  PROFILE: "@medimates_profile",
  THEME: "@medimates_theme",
  SETTINGS: "@medimates_settings",
  NOTIFICATIONS: "@medimates_notifications",
  APPOINTMENTS: "@medimates_appointments",
  MEDICINE_HISTORY: "@medimates_medicine_history",
  DIRECTORY: "@medimates_directory",
};

/**
 * Storage Service - Abstracts AsyncStorage operations
 * Provides type-safe storage with error handling
 */
class StorageService {
  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @returns {Promise<any|null>} Parsed data or null
   */
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      throw new Error(`Failed to get ${key} from storage`);
    }
  }

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {any} value - Data to store
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw new Error(`Failed to save ${key} to storage`);
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw new Error(`Failed to remove ${key} from storage`);
    }
  }

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw new Error("Failed to clear storage");
    }
  }

  /**
   * Get multiple items from storage
   * @param {string[]} keys - Array of storage keys
   * @returns {Promise<Object>} Object with key-value pairs
   */
  async multiGet(keys) {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result = {};
      pairs.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });
      return result;
    } catch (error) {
      console.error("Error getting multiple items:", error);
      throw new Error("Failed to get multiple items from storage");
    }
  }

  /**
   * Set multiple items in storage
   * @param {Array<[string, any]>} keyValuePairs - Array of [key, value] pairs
   * @returns {Promise<void>}
   */
  async multiSet(keyValuePairs) {
    try {
      const pairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error("Error setting multiple items:", error);
      throw new Error("Failed to save multiple items to storage");
    }
  }

  // Medicine-specific methods
  async getMedicines() {
    const medicines = await this.getItem(STORAGE_KEYS.MEDICINES);
    return medicines || [];
  }

  async saveMedicines(medicines) {
    return this.setItem(STORAGE_KEYS.MEDICINES, medicines);
  }

  // Profile-specific methods
  async getProfile() {
    return this.getItem(STORAGE_KEYS.PROFILE);
  }

  async saveProfile(profile) {
    return this.setItem(STORAGE_KEYS.PROFILE, profile);
  }

  // Theme-specific methods
  async getTheme() {
    const theme = await this.getItem(STORAGE_KEYS.THEME);
    return theme || "light";
  }

  async saveTheme(theme) {
    return this.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Settings-specific methods
  async getSettings() {
    const settings = await this.getItem(STORAGE_KEYS.SETTINGS);
    return settings || {};
  }

  async saveSettings(settings) {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // Notifications-specific methods
  async getNotifications() {
    const notifications = await this.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return notifications || [];
  }

  async saveNotifications(notifications) {
    return this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  // Appointments-specific methods
  async getAppointments() {
    const appointments = await this.getItem(STORAGE_KEYS.APPOINTMENTS);
    return appointments || [];
  }

  async saveAppointments(appointments) {
    return this.setItem(STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  // Directory (emergency contacts) methods
  async getDirectory() {
    const directory = await this.getItem(STORAGE_KEYS.DIRECTORY);
    return directory || [];
  }

  async saveDirectory(directory) {
    return this.setItem(STORAGE_KEYS.DIRECTORY, directory);
  }

  // Medicine history methods
  // Medicine history methods
  async getMedicineHistory() {
    const history = await this.getItem(STORAGE_KEYS.MEDICINE_HISTORY);
    return history || {};
  }

  async saveMedicineHistory(history) {
    return this.setItem(STORAGE_KEYS.MEDICINE_HISTORY, history);
  }

  async addMedicineHistoryRecord(record) {
    const history = await this.getMedicineHistory();
    // Maintain backward compatibility or migrate if needed
    // For now, we assume we are switching to the object-based format: { "YYYY-MM-DD": { taken: 0, skipped: 0, details: [] } }

    const dateStr = record.date || new Date().toISOString().split("T")[0];

    if (!history[dateStr]) {
      history[dateStr] = { taken: 0, skipped: 0, details: [] };
    }

    history[dateStr].details.push({
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    });

    // Update counts
    if (record.status === "taken") {
      history[dateStr].taken = (history[dateStr].taken || 0) + 1;
    } else if (record.status === "skipped") {
      history[dateStr].skipped = (history[dateStr].skipped || 0) + 1;
    }

    await this.saveMedicineHistory(history);
    return history;
  }

  /**
   * Fill missing history entries for past days
   * Checks for days where no activity was recorded and marks them as skipped/pending
   */
  async fillMissingHistory(medicines) {
    try {
      const history = await this.getMedicineHistory();
      const dates = Object.keys(history).sort();

      // Helper to get local date string YYYY-MM-DD
      const getLocalDateStr = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const todayStr = getLocalDateStr(new Date());
      let hasUpdates = false;

      // 1. Update past "pending" items to "skipped"
      for (const date of dates) {
        if (date >= todayStr) continue; // Only process past days

        const entry = history[date];
        if (entry && Array.isArray(entry.details)) {
          let changed = false;
          let taken = 0;
          let skipped = 0;

          const newDetails = entry.details.map((item) => {
            if (item.status === "pending") {
              changed = true;
              skipped++;
              return { ...item, status: "skipped" };
            } else if (item.status === "taken") {
              taken++;
              return item;
            } else if (item.status === "skipped") {
              skipped++;
              return item;
            } else {
              return item;
            }
          });

          if (changed) {
            entry.details = newDetails;
            entry.taken = taken;
            entry.skipped = skipped;
            hasUpdates = true;
          }
        }
      }

      // 2. Create entries for missing days
      if (dates.length > 0) {
        const lastDateStr = dates[dates.length - 1];
        const lastDate = new Date(lastDateStr);
        let currentDate = new Date(lastDate);
        currentDate.setDate(currentDate.getDate() + 1);

        while (true) {
          const currentDateStr = getLocalDateStr(currentDate);
          if (currentDateStr >= todayStr) break;

          if (!history[currentDateStr]) {
            history[currentDateStr] = { taken: 0, skipped: 0, details: [] };
            hasUpdates = true;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      if (hasUpdates) {
        await this.saveMedicineHistory(history);
      }

      return history;
    } catch (error) {
      console.error("Error filling missing history:", error);
      return {};
    }
  }
}

// Export singleton instance
export default new StorageService();
