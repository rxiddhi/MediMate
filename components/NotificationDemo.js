import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function NotificationDemo({ medicine }) {
  const [demoNotifications, setDemoNotifications] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [istaken, setIstaken] = useState(false);

  useEffect(() => {
    if (medicine && medicine.times) {
      const notifications = medicine.times.map((time, index) => ({
        id: `${medicine.id}_${time}`,
        time: time,
        title: "Medicine Reminder",
        body: `Time to take ${medicine.name} (${medicine.dosage})`,
        scheduled: false,
        triggered: false,
        countdown: 10, // 10 seconds countdown for demo
      }));
      setDemoNotifications(notifications);
    }
  }, [medicine]);

  const simulateNotification = (notification) => {
    Alert.alert(notification.title, notification.body, [
      {
        text: "Mark as Taken",
        onPress: () => {
          setIstaken(true);
          if (istaken) {
            Alert.alert("Great!", `You have taken ${medicine.name}.`);
          }
          setDemoNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, triggered: true } : n
            )
          );
        },
      },
      { text: "Snooze", style: "cancel" },
    ]);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setDemoNotifications((prev) => {
          const updated = prev.map((notification) => {
            if (!notification.triggered && notification.countdown > 0) {
              const newCountdown = notification.countdown - 1;
              if (newCountdown === 0) {
                simulateNotification(notification);
                return { ...notification, triggered: true, countdown: 0 };
              }
              return { ...notification, countdown: newCountdown };
            }
            return notification;
          });
          return updated;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startDemo = () => {
    setIsRunning(true);
    setDemoNotifications((prev) =>
      prev.map((n) => ({ ...n, countdown: 10, triggered: false }))
    );
  };

  const resetDemo = () => {
    setIsRunning(false);
    setDemoNotifications((prev) =>
      prev.map((n) => ({ ...n, triggered: false, countdown: 10 }))
    );
  };

  if (!medicine) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Demo</Text>
      <Text style={styles.subtitle}>
        Watch notifications appear in real-time
      </Text>

      <View style={styles.notificationsList}>
        {demoNotifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTime}>{notification.time}</Text>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationBody}>{notification.body}</Text>
              {!notification.triggered && notification.countdown > 0 && (
                <Text style={styles.countdownText}>
                  Notification in {notification.countdown}s
                </Text>
              )}
            </View>
            <View
              style={[
                styles.statusIndicator,
                notification.triggered ? styles.triggered : styles.pending,
              ]}
            >
              <Text style={styles.statusText}>
                {notification.triggered ? "✓" : notification.countdown}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={startDemo}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? "Demo Running..." : "Start Demo"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetDemo}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>In Production:</Text>
        <Text style={styles.infoText}>
          • Notifications appear at your scheduled times daily
        </Text>
        <Text style={styles.infoText}>• Works even when app is closed</Text>
        <Text style={styles.infoText}>• Includes sound and vibration</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 16,
  },
  notificationsList: {
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e74c3c",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 2,
  },
  notificationBody: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  countdownText: {
    fontSize: 12,
    color: "#e74c3c",
    fontWeight: "600",
    marginTop: 4,
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pending: {
    backgroundColor: "#f39c12",
  },
  triggered: {
    backgroundColor: "#27ae60",
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#3498db",
  },
  resetButton: {
    backgroundColor: "#95a5a6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
    padding: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 4,
  },
});
