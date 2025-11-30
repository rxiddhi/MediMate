import * as Notifications from "expo-notifications";
import storageService from "./storageService";

/**
 * Notification Service
 * Handles advanced notification scheduling, editing, canceling, and deep linking
 */
class NotificationService {
  constructor() {
    this.setupNotificationHandler();
  }

  setupNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  /**
   * Request notification permissions
   * @returns {Promise<boolean>} Permission granted status
   */
  async requestPermissions() {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === "granted";
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  /**
   * Schedule notifications for a medicine
   * Supports daily, weekly, and monthly recurring patterns
   */
  async scheduleMedicineNotifications(medicine) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Notification permissions not granted");
      }

      const scheduledIds = [];

      for (const time of medicine.times) {
        const [hours, minutes] = time.split(":").map(Number);
        const trigger = this.createTrigger(
          medicine.frequency,
          hours,
          minutes,
          medicine.recurringPattern
        );

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "💊 Medicine Reminder",
            body: `Time to take ${medicine.name} (${medicine.dosage})`,
            data: {
              medicineId: medicine.id,
              medicineName: medicine.name,
              dosage: medicine.dosage,
              time: time,
              screen: "Home",
            },
            sound: "default",
            priority: Notifications.AndroidNotificationPriority.HIGH,
            categoryIdentifier: "MEDICINE_REMINDER",
          },
          trigger,
        });

        scheduledIds.push({
          notificationId,
          medicineId: medicine.id,
          time,
        });
      }

      // Save notification IDs for later management
      await this.saveNotificationMapping(medicine.id, scheduledIds);

      return scheduledIds;
    } catch (error) {
      console.error("Error scheduling notifications:", error);
      throw error;
    }
  }

  /**
   * Create trigger based on frequency
   */
  createTrigger(frequency, hours, minutes, recurringPattern = null) {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    switch (frequency) {
      case "daily":
        return {
          hour: hours,
          minute: minutes,
          repeats: true,
        };

      case "weekly":
        // Repeat on specific days of the week
        const weekday = recurringPattern?.weekdays || [new Date().getDay()];
        return {
          weekday: weekday[0], // First selected weekday
          hour: hours,
          minute: minutes,
          repeats: true,
        };

      case "monthly":
        // Repeat on specific day of month
        const day = recurringPattern?.dayOfMonth || new Date().getDate();
        return {
          day: day,
          hour: hours,
          minute: minutes,
          repeats: true,
        };

      case "custom":
        // One-time or custom interval
        return {
          date: scheduledTime,
          repeats: recurringPattern?.interval ? true : false,
        };

      default:
        return {
          hour: hours,
          minute: minutes,
          repeats: true,
        };
    }
  }

  /**
   * Update notifications for a medicine
   */
  async updateMedicineNotifications(medicine) {
    try {
      // Cancel existing notifications
      await this.cancelMedicineNotifications(medicine.id);

      // Schedule new notifications
      return await this.scheduleMedicineNotifications(medicine);
    } catch (error) {
      console.error("Error updating notifications:", error);
      throw error;
    }
  }

  /**
   * Cancel all notifications for a medicine
   */
  async cancelMedicineNotifications(medicineId) {
    try {
      const mappings = await this.getNotificationMapping(medicineId);

      if (mappings && mappings.length > 0) {
        for (const mapping of mappings) {
          await Notifications.cancelScheduledNotificationAsync(
            mapping.notificationId
          );
        }

        // Remove from storage
        await this.removeNotificationMapping(medicineId);
      }
    } catch (error) {
      console.error("Error canceling notifications:", error);
      throw error;
    }
  }

  /**
   * Cancel a specific notification
   */
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error("Error canceling notification:", error);
      throw error;
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await storageService.saveNotifications([]);
    } catch (error) {
      console.error("Error canceling all notifications:", error);
      throw error;
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  }

  /**
   * Save notification mapping to storage
   */
  async saveNotificationMapping(medicineId, scheduledIds) {
    try {
      const notifications = await storageService.getNotifications();
      const filtered = notifications.filter((n) => n.medicineId !== medicineId);

      await storageService.saveNotifications([
        ...filtered,
        { medicineId, scheduledIds, updatedAt: new Date().toISOString() },
      ]);
    } catch (error) {
      console.error("Error saving notification mapping:", error);
    }
  }

  /**
   * Get notification mapping for a medicine
   */
  async getNotificationMapping(medicineId) {
    try {
      const notifications = await storageService.getNotifications();
      const mapping = notifications.find((n) => n.medicineId === medicineId);
      return mapping?.scheduledIds || [];
    } catch (error) {
      console.error("Error getting notification mapping:", error);
      return [];
    }
  }

  /**
   * Remove notification mapping
   */
  async removeNotificationMapping(medicineId) {
    try {
      const notifications = await storageService.getNotifications();
      const filtered = notifications.filter((n) => n.medicineId !== medicineId);
      await storageService.saveNotifications(filtered);
    } catch (error) {
      console.error("Error removing notification mapping:", error);
    }
  }

  /**
   * Setup notification response listener for deep linking
   */
  setupNotificationListener(navigationRef) {
    // Handle notification tap when app is in foreground/background
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data.screen && navigationRef.current) {
          navigationRef.current.navigate(data.screen, {
            medicineId: data.medicineId,
          });
        }
      }
    );

    return subscription;
  }

  /**
   * Get last notification response (for app opened from killed state)
   */
  async getLastNotificationResponse() {
    try {
      return await Notifications.getLastNotificationResponseAsync();
    } catch (error) {
      console.error("Error getting last notification response:", error);
      return null;
    }
  }

  /**
   * Set notification categories for iOS
   */
  async setNotificationCategories() {
    try {
      await Notifications.setNotificationCategoryAsync("MEDICINE_REMINDER", [
        {
          identifier: "MARK_TAKEN",
          buttonTitle: "Mark as Taken",
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: "SNOOZE",
          buttonTitle: "Snooze 10 min",
          options: {
            opensAppToForeground: false,
          },
        },
      ]);
    } catch (error) {
      console.error("Error setting notification categories:", error);
    }
  }

  /**
   * Schedule notification for an appointment
   */
  async scheduleAppointmentNotification(appointment) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Notification permissions not granted");
      }

      const appointmentDate = new Date(appointment.date);
      const appointmentTime = new Date(appointment.time);
      appointmentDate.setHours(
        appointmentTime.getHours(),
        appointmentTime.getMinutes(),
        0,
        0
      );

      // Schedule notification 1 hour before
      const reminderTime = new Date(appointmentDate);
      reminderTime.setHours(reminderTime.getHours() - 1);

      if (reminderTime > new Date()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "🏥 Upcoming Appointment",
            body: `${appointment.title} with ${appointment.doctor} in 1 hour`,
            data: {
              appointmentId: appointment.id,
              screen: "Appointment",
            },
            sound: "default",
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            date: reminderTime,
          },
        });

        return notificationId;
      }
    } catch (error) {
      console.error("Error scheduling appointment notification:", error);
    }
  }
}

// Export singleton instance
export default new NotificationService();
