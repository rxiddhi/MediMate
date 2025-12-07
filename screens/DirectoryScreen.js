import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import storageService from "../services/storageService";
import { useTheme } from "../context/ThemeContext";
import { useIsFocused } from "@react-navigation/native";
import { useMedicine } from "../context/MedicineContext";

export default function DirectoryScreen() {
  const { theme } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", relationship: "" });

  useEffect(() => {
    loadContacts();
  }, []);
  const isFocused = useIsFocused();
  const { profile } = useMedicine();

  useEffect(() => {
    if (profile) {
      loadContacts();
    }
  }, [profile]);

  const loadContacts = async () => {
    try {
      const list = await storageService.getDirectory();
      setContacts(list || []);
    } catch (error) {
      console.error("Error loading directory:", error);
      Alert.alert("Error", "Failed to load contacts");
    }
  };

  // Add missing handlers: edit, delete, save, reset
  const onEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      phone: item.phone || "",
      relationship: item.relationship || "",
    });
    setModalVisible(true);
  };

  const onDelete = (item) => {
    Alert.alert("Delete contact", `Delete ${item.name || item.phone}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const list = (await storageService.getDirectory()) || [];
            const updated = list.filter((c) => c.id !== item.id);
            await storageService.saveDirectory(updated);
            setContacts(updated);
          } catch (err) {
            console.error("Error deleting contact:", err);
            Alert.alert("Error", "Failed to delete contact");
          }
        },
      },
    ]);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", phone: "", relationship: "" });
  };

  const onSave = async () => {
    if (!form.name || !form.phone) {
      Alert.alert("Validation", "Please provide a name and phone number.");
      return;
    }
    try {
      const list = (await storageService.getDirectory()) || [];
      let updated = [];
      if (editing && editing.id) {
        updated = list.map((c) =>
          c.id === editing.id ? { ...c, ...form } : c
        );
      } else {
        const newContact = { id: Date.now().toString(), ...form };
        updated = [newContact, ...list];
      }
      await storageService.saveDirectory(updated);
      setContacts(updated);
      setModalVisible(false);
      resetForm();
    } catch (err) {
      console.error("Error saving contact:", err);
      Alert.alert("Error", "Failed to save contact");
    }
  };

  const dialNumber = (phone) => {
    if (!phone) return;
    const url = `tel:${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Unsupported", "Dialing is not supported on this device");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error dialing:", err));
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.item,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: theme.colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.note, { color: theme.colors.textSecondary }]}>
          {item.relationship || "Contact"}
        </Text>
        <Text style={[styles.phone, { color: theme.colors.primary }]}>
          {item.phone}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.callButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => dialNumber(item.phone)}
      >
        <Text style={styles.callText}>Call</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.editButton, { marginLeft: 8 }]}
        onPress={() => onEdit(item)}
      >
        <Text style={[styles.editText, { color: theme.colors.primary }]}>
          Edit
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.deleteButton, { marginLeft: 8 }]}
        onPress={() => onDelete(item)}
      >
        <Text style={[styles.deleteText, { color: theme.colors.error }]}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Modal for add/edit contact */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {editing ? "Edit Contact" : "Add Contact"}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Full name"
              placeholderTextColor={theme.colors.textTertiary}
              value={form.name}
              onChangeText={(t) => setForm((p) => ({ ...p, name: t }))}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Phone"
              placeholderTextColor={theme.colors.textTertiary}
              value={form.phone}
              onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
              keyboardType={Platform.OS === "ios" ? "phone-pad" : "phone-pad"}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Relationship (e.g., Caretaker)"
              placeholderTextColor={theme.colors.textTertiary}
              value={form.relationship}
              onChangeText={(t) => setForm((p) => ({ ...p, relationship: t }))}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={[styles.cancelText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={onSave}
              >
                <Text style={[styles.saveText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={contacts}
        keyExtractor={(item, idx) => item.id || `${item.phone}_${idx}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.colors.textSecondary }}>
              No emergency contacts saved.
            </Text>
            <Text style={{ color: theme.colors.textSecondary }}>
              Add one from Profile (Edit Profile)
            </Text>
          </View>
        }
        contentContainerStyle={{ padding: 16 }}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          setEditing(null);
          resetForm();
          setModalVisible(true);
        }}
        accessibilityLabel="Add contact"
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  note: { fontSize: 13, marginBottom: 6 },
  phone: { fontSize: 14, fontWeight: "600" },
  callButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  callText: { color: "#fff", fontWeight: "700" },
  empty: { alignItems: "center", marginTop: 40 },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  editText: { fontWeight: "600" },
  deleteText: { fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 10 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  cancelText: { color: "#333", fontWeight: "600" },
  saveButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  saveText: { color: "#fff", fontWeight: "700" },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
});
