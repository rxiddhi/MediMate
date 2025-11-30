# MediMate 🏥💊

A comprehensive mobile medicine management app built with React Native and Expo. MediMate helps users track their medication schedules, manage appointments, and maintain a complete health profile.

## Overview

MediMate is a user-friendly health companion that simplifies medicine management for individuals who need to track multiple medications. The app provides timely reminders, medication history tracking, and an intuitive interface for managing your health routine.

## Key Features

### 📱 Medicine Management
- **Add & Track Medicines**: Easily add medications with dosage, frequency, and timing information
- **Medicine Cards**: Visual representation of all your medicines with quick access to details
- **Custom Dosage**: Set specific dosages for each medicine
- **Notes**: Add personal notes or special instructions for each medication
- **Delete Options**: Remove medicines when no longer needed

### ⏰ Dose Scheduling & Reminders
- **Upcoming Doses**: View next doses scheduled throughout the day
- **Time Tracking**: See exactly how much time until your next dose
- **Mark as Taken**: Quick button to confirm when you've taken a medicine
- **Push Notifications**: Receive timely reminders for upcoming doses

### 📊 Health Dashboard
- **Today's Progress**: Visual progress bar showing medication completion
- **Status Overview**: Quick stats on remaining, taken, and total medications
- **Calendar View**: Medicine history calendar for tracking patterns
- **Daily Greeting**: Personalized greeting based on time of day

### 📅 Appointment Management
- **Schedule Appointments**: Track doctor visits and health checkups
- **Appointment Screen**: Dedicated interface for viewing all appointments
- **Integration**: Seamlessly integrate appointments with medicine schedule

### 👤 Profile Management
- **User Profile**: Manage your personal health information
- **Settings**: Customize app preferences and notification settings
- **Theme Support**: Dark and light mode support for comfortable viewing

### 📈 Health History
- **Medicine History**: Complete log of all medication taken
- **Historical Data**: Track medication compliance over time
- **Detailed Records**: View past entries with timestamps

## Tech Stack

### Frontend Framework
- **React Native 0.81.4**: Cross-platform mobile development
- **Expo ~54.0.10**: Managed React Native platform

### Navigation
- **React Navigation 7.x**: Comprehensive navigation solution
  - Bottom Tabs navigation for main screens
  - Stack navigation for detailed views
  - Drawer navigation for additional options

### State Management & Storage
- **React Context API**: Global state management
- **AsyncStorage**: Local data persistence
- **MedicineContext**: Centralized medicine state
- **ThemeContext**: Theme and styling state

### Features & Services
- **expo-notifications**: Push notification system
- **expo-device**: Device information access
- **expo-clipboard**: Clipboard functionality
- **expo-linking**: Deep linking support

### UI Components & Animations
- **react-native-calendars**: Calendar component for date selection
- **react-native-reanimated**: Smooth animations and transitions
- **Ionicons & MaterialCommunityIcons**: Comprehensive icon library
- **Gesture Handler**: Touch and gesture recognition

### Additional Libraries
- **react-native-safe-area-context**: Safe area management for notched devices
- **react-native-screens**: Native screen support for better performance

## Project Structure

```
medi-mate/
├── screens/                    # Main screen components
│   ├── HomeScreen.js          # Dashboard with medicine overview
│   ├── AddMedicineScreen.js   # Add new medicine form
│   ├── AppointmentScreen.js   # Appointment management
│   ├── ProfileScreen.js       # User profile management
│   ├── SettingsScreen.js      # App settings
│   └── HistoryScreen.js       # Medicine history
├── components/                # Reusable UI components
│   ├── MedicineItem.js        # Medicine list item
│   ├── MedicineCalendar.js    # Calendar component
│   ├── NotificationDemo.js    # Notification utilities
│   └── AppErrorBoundary.js    # Error handling wrapper
├── navigation/                # Navigation configuration
│   ├── RootNavigator.js       # Main app navigator
│   └── TabNavigator.js        # Bottom tab navigator
├── context/                   # React Context providers
│   ├── MedicineContext.js     # Medicine state management
│   └── ThemeContext.js        # Theme and styling state
├── hooks/                     # Custom React hooks
│   ├── useHomeScreen.js       # Home screen logic
│   └── useAddMedicine.js      # Add medicine form logic
├── services/                  # Business logic & external services
│   ├── notificationService.js # Push notification handling
│   └── storageService.js      # Data persistence
├── features/                  # Feature-specific modules
│   ├── appointment/           # Appointment feature
│   ├── medicine/              # Medicine feature
│   └── profile/               # Profile feature
├── constants/                 # App constants and configurations
├── config/                    # App configuration files
├── utils/                     # Utility functions
├── assets/                    # Images and static assets
├── App.js                     # Root app component
├── app.json                   # Expo configuration
├── app.config.js              # App configuration script
├── package.json               # Dependencies and scripts
└── index.js                   # App entry point
```

## Getting Started

### Prerequisites
- **Node.js**: v16 or higher
- **npm** or **yarn**: Package manager
- **Expo CLI**: `npm install -g expo-cli`
- **iOS/Android Emulator** or **Physical Device**: For testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rxiddhi/MediMate.git
   cd medi-mate
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on specific platform**
   ```bash
   # iOS (macOS only)
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Available Scripts

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web

# Build for Android
npm run build:android

# Build for iOS
npm run build:ios

# Build for both platforms
npm run build:all

# Submit to Google Play Store
npm submit:android

# Submit to Apple App Store
npm run submit:ios
```

## Core Features Explained

### Home Screen Dashboard
The home screen provides an at-a-glance view of your medication status:
- Personalized greeting based on time of day
- Today's medication progress with visual progress bar
- Quick action buttons for common tasks
- Upcoming doses with time counters
- Medicine calendar for historical tracking
- Complete list of all medicines with management options

### Medicine Management
- Add new medicines with detailed information (name, dosage, frequency)
- Set specific times for medication intake
- Add personal notes or special instructions
- View all medicines in an organized list
- Delete medicines when needed
- Mark doses as taken throughout the day

### Notifications System
The app includes a robust notification system that:
- Requests user permissions on startup
- Sets up notification categories for interaction
- Sends timely reminders for upcoming doses
- Handles deep linking from notifications
- Manages notifications opened from killed state

### Theme Support
The app includes a complete theming system with:
- Light and dark mode support
- Consistent color palette throughout
- Responsive design for all screen sizes
- Safe area handling for notched devices

## Deep Linking

MediMate supports deep linking for direct navigation via notifications:
- **Prefixes**: `medimate://` and standard URL scheme
- **Supported Routes**:
  - `home`: Home screen
  - `add-medicine`: Add medicine screen
  - `appointment`: Appointment screen
  - `profile`: Profile screen
  - `settings`: Settings screen

Example: `medimate://add-medicine` opens the add medicine screen directly.

## Data Persistence

The app uses AsyncStorage for local data persistence:
- Medicine list and details
- User profile information
- Appointment history
- Medicine history and logs
- User preferences and settings

All data is stored locally on the device and persists across app sessions.

## Error Handling

The app includes comprehensive error handling:
- **Error Boundary**: Catches and handles component errors gracefully
- **Try-Catch Blocks**: Strategic error catching in async operations
- **User Feedback**: Clear error messages and alerts for user actions
- **Fallback UI**: Graceful degradation when errors occur

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is private and owned by rxiddhi. All rights reserved.

## Support

For support, issues, or feature requests, please open an issue on the GitHub repository.

---

**Built with ❤️ using React Native and Expo**

Version 1.0.0
