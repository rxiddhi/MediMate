# MediMate

A beautiful and intuitive mobile medicine management app built with React Native and Expo that helps you track medication schedules, manage appointments, and stay on top of your health routine.

## Demo

Watch the full app demo: [MediMate Demo Video](https://drive.google.com/file/d/1pIUb08Q-aeEPc2HkriY800CcjVimu9EJ/view?usp=sharing)

## Features

### Medicine Management
- Add medications with dosage, frequency, and timing
- Set custom reminders for each medicine dose
- Personal notes for special instructions (take with food, etc.)
- Easy deletion when medicines are no longer needed
- Organized medicine list with quick overview

### Smart Notifications
- Push notifications at scheduled medicine times
- Time remaining counter for next dose
- Mark as taken directly from notification or app
- Automatic reminders throughout the day
- Customizable notification times

### Health Dashboard
- Today's progress card showing medication compliance
- Upcoming doses list with countdown timers
- Personalized greetings that change throughout the day
- Quick action buttons for common tasks
- Medicine calendar view for history tracking

### User Profile
- Personal health information (age, blood type, medical notes)
- Emergency contact with one-tap dialing
- Medical history and allergies tracking
- Doctor information storage
- Easy editing with save confirmation

### Emergency Directory
- Quick-dial contacts for emergencies
- Emergency contact sync from profile
- Add/edit/delete contacts with modal interface
- One-tap calling for rapid contact

### Appointment Management
- Schedule doctor visits and checkups
- Appointment tracking alongside medicines
- Notification reminders for appointments
- Complete appointment history

### Health History and Analytics
- Complete medicine intake log with timestamps
- Daily medication compliance tracking
- Historical view of medicines taken and skipped
- Searchable history for quick lookups

### User Experience
- Dark mode and light mode themes
- Modern, vibrant color palette (Purple, Orange, Cyan)
- Smooth animations and transitions
- Responsive design for all screen sizes
- Search functionality across medicines and history
- Intuitive navigation with bottom tabs

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.81.4 | Mobile app framework |
| Expo | 54.0.10 | Development and deployment |
| React Navigation | 7.x | App navigation |
| React Context API | - | Global state management |
| AsyncStorage | - | Local data persistence |
| Expo Notifications | - | Push notifications |
| Vector Icons | - | UI icons (Ionicons, MaterialCommunityIcons) |

## Project Structure

```
medi-mate/
├── screens/              # Main app pages
│   ├── HomeScreen.js
│   ├── AddMedicineScreen.js
│   ├── ProfileScreen.js
│   ├── DirectoryScreen.js
│   ├── HistoryScreen.js
│   ├── AppointmentScreen.js
│   └── SettingsScreen.js
├── components/           # Reusable UI components
│   ├── MedicineCalendar.js
│   ├── MedicineItem.js
│   └── NotificationDemo.js
├── navigation/           # Navigation configuration
│   ├── RootNavigator.js
│   └── TabNavigator.js
├── context/              # Global state management
│   ├── MedicineContext.js
│   └── ThemeContext.js
├── hooks/                # Custom React hooks
│   ├── useHomeScreen.js
│   └── useAddMedicine.js
├── services/             # API and utility services
│   ├── storageService.js
│   └── notificationService.js
├── features/             # Feature-specific modules
│   ├── appointment/
│   ├── medicine/
│   └── profile/
├── constants/            # App constants
├── utils/                # Helper functions
├── assets/               # Images and resources
└── app.json              # Expo configuration
```

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn package manager
- Expo CLI installed globally: `npm install -g expo-cli`
- iOS simulator (macOS) or Android emulator, or a physical device

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rxiddhi/MediMate.git
   cd medi-mate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your device:
   ```bash
   # Scan QR code with Expo Go app on your phone
   # Or run on emulator:
   npm run ios      # iOS simulator (macOS only)
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start the Expo development server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm run build:android` | Create Android APK/AAB |
| `npm run build:ios` | Create iOS build |
| `npm submit:android` | Submit to Google Play Store |
| `npm submit:ios` | Submit to Apple App Store |

## How to Use

### Adding Your First Medicine
1. Tap the "Add Medicine" button on the home screen
2. Enter medicine name and dosage
3. Set the frequency (daily, weekly, etc.) and times
4. Add optional notes (e.g., "take with food")
5. Save and start receiving reminders

### Tracking Your Doses
1. View upcoming doses on the home screen
2. When notified, tap "Taken" to mark medicine as taken
3. Check "Today's Progress" card for daily compliance
4. Review History tab for detailed logs

### Managing Your Profile
1. Go to Profile tab
2. Tap "Edit Profile" to add personal information
3. Add emergency contact for quick dialing
4. Include medical notes, allergies, and doctor info
5. Tap "Save Changes" to persist data

### Using Emergency Directory
1. Go to Directory tab to view emergency contacts
2. Tap "Add" to create new contact
3. Add name, phone, and relationship
4. Tap "Call" for one-tap emergency calling
5. Edit or delete contacts as needed

## Data Storage

All your information is stored securely on your device using AsyncStorage. Your data:
- Stays private and never leaves your phone
- Is backed up in your device storage
- Can be accessed offline
- Is persistent across app sessions

## Customization

The app features a Modern Vibrant theme with:
- Primary Color: Purple (#7C3AED)
- Secondary Color: Orange (#F97316)
- Accent Color: Cyan (#06B6D4)
- Full dark mode support with automatic system detection

Customize the theme in `context/ThemeContext.js`.

## Contributing

Contributions are welcome. Feel free to:
- Submit pull requests for new features
- Open issues for bugs and improvements
- Suggest UX/UI enhancements

## License

This project is private and owned by rxiddhi.

## Support

For questions, issues, or feature requests, please open an issue on [GitHub](https://github.com/rxiddhi/MediMate/issues).

---

Made with care to help you stay healthy and on top of your medications.
