# MediMate - Your Personal Medicine Reminder App

**Project Title:** MediMate – A React Native App for Medicine Reminders and Health Tracking  
**Developer:** Riddhi Khera – 2024-B-02042007

## Problem Statement

Many people, especially the elderly and patients with chronic illnesses, often forget to take their medicines on time. Missing doses can lead to serious health consequences. Current reminder apps are often complicated, cluttered, or lack personalization. MediMate aims to solve this problem with a clean, simple, and intuitive mobile app designed for quick medicine scheduling and reliable notifications.

## Proposed Solution

A cross-platform mobile application built using React Native that allows users to set medicine reminders, track their dosage history, and store basic health notes. The app sends timely push notifications and keeps all reminders organized in a minimal and accessible interface.

## Key Features

✅ **Add, edit, and delete medicine schedules**  
✅ **Push notifications for medicine reminders**  
✅ **Simple list view of upcoming doses**  
✅ **Local storage for offline use**  
✅ **Profile section for personal and medical notes**  
✅ **Clean and minimal UI for easy navigation**  

## Technology Stack

- **Frontend:** React Native, Expo, React Navigation
- **State Management:** useContext, useReducer, Context API
- **Data Storage:** AsyncStorage (local database)
- **Notifications:** Expo Notifications API
- **Navigation:** React Navigation Bottom Tabs

## Architecture

### Context API Implementation
- **MedicineContext:** Centralized state management using useContext and useReducer
- **State Management:** Reducer pattern for predictable state updates
- **Data Flow:** Unidirectional data flow with context providers

### Key Components
- **MedicineProvider:** Context provider wrapping the entire app
- **useMedicine:** Custom hook for accessing medicine context
- **Reducer Pattern:** useReducer for complex state management

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd medi-mate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

## App Structure

```
medi-mate/
├── App.js                          # Main app component with MedicineProvider
├── context/
│   └── MedicineContext.js           # Context API with useReducer
├── components/
│   └── MedicineItem.js             # Reusable medicine item component
├── navigation/
│   └── TabNavigator.js             # Bottom tab navigation
├── screens/
│   ├── HomeScreen.js               # Main dashboard with medicine list
│   ├── AddMedicineScreen.js         # Form to add new medicines
│   └── ProfileScreen.js            # User profile and medical info
└── package.json                     # Dependencies and scripts
```

## Core Features Implementation

### 1. Context API & State Management
- **useContext:** Global state access across components
- **useReducer:** Complex state management with predictable updates
- **Context Provider:** Wraps entire app for state sharing

### 2. Medicine Management
- **Add Medicine:** Comprehensive form with scheduling
- **View Medicines:** Clean list with upcoming doses
- **Delete Medicine:** Easy removal with confirmation
- **Mark as Taken:** Quick action to mark doses

### 3. Data Storage
- **AsyncStorage:** Local storage for offline use
- **Context Integration:** Seamless data flow with context
- **State Persistence:** Data saved between sessions

### 4. Navigation
- **Bottom Tabs:** React Navigation bottom tab navigator
- **Screen Navigation:** Seamless navigation between screens
- **Tab Icons:** Ionicons for visual navigation

### 5. Notifications
- **Push Notifications:** Timely reminders using Expo Notifications
- **Permission Handling:** Automatic permission requests
- **Scheduling:** Daily recurring notifications

## Usage Guide

### Adding a Medicine
1. Navigate to the "Add Medicine" tab
2. Fill in medicine details (name, dosage, times, etc.)
3. Select reminder times from common options or add custom times
4. Set start/end dates and add notes
5. Tap "Add Medicine" to save and schedule notifications

### Viewing Upcoming Doses
1. Home screen shows upcoming doses at the top
2. View all medicines in the "All Medicines" section
3. Mark doses as taken with the "✓ Taken" button
4. Delete medicines with the trash icon

### Managing Profile
1. Go to the "Profile" tab
2. Tap "Edit Profile" to modify information
3. Add personal details, medical information, and emergency contacts
4. Save changes to update your profile

## Development Timeline

- **Week 1** – Research, UI/UX design ✅
- **Week 2** – Setup React Native project and navigation ✅
- **Week 3** – Implement medicine list & local storage ✅
- **Week 4** – Add notifications & reminders ✅
- **Week 5** – Testing and UI polishing ✅
- **Week 6** – Final deployment and presentation ✅

## Technical Implementation Highlights

### Context API Usage
```javascript
// MedicineContext.js
const MedicineContext = createContext();
const [state, dispatch] = useReducer(medicineReducer, initialState);

// Usage in components
const { medicines, addMedicine, deleteMedicine } = useMedicine();
```

### State Management Pattern
```javascript
// Reducer for predictable state updates
const medicineReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MEDICINE':
      return { ...state, medicines: [...state.medicines, action.payload] };
    // ... other cases
  }
};
```

### Data Storage Integration
```javascript
// AsyncStorage with Context
const addMedicine = async (medicineData) => {
  const newMedicine = { id: Date.now().toString(), ...medicineData };
  await AsyncStorage.setItem('@medimates_medicines', JSON.stringify(updatedMedicines));
  dispatch({ type: 'ADD_MEDICINE', payload: newMedicine });
};
```

## Future Enhancements

This is an MVP that can be expanded with:
- Cloud sync for multi-device access
- Multi-user support for families
- Health report tracking and analytics
- Integration with healthcare providers
- Medication interaction warnings
- Photo capture for medicine identification

## Contributing

This is a personal project for academic purposes. For questions or suggestions, please contact the developer.

## License

This project is for educational purposes only.

---

**MediMate** - Never miss a dose, stay healthy! 💊