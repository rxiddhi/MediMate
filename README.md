# MediMate

A mobile medicine management app built with React Native and Expo that helps you track medication schedules, manage appointments, and stay on top of your health routine.

## What It Does

MediMate simplifies medicine management by letting you add your medications, set reminders for when to take them, and keep a history of your doses. The app sends you notifications when it's time to take medicine, lets you mark doses as taken, and provides a clear overview of your medication schedule.

## Features

**Medicine Management**
- Add medications with dosage, frequency, and timing
- Add personal notes to medicines
- Delete medicines when no longer needed
- View all medicines in an organized list

**Dose Scheduling and Reminders**
- See upcoming doses throughout the day
- Get push notifications for reminders
- View time remaining until next dose
- Mark doses as taken with one tap

**Health Dashboard**
- See today's medication progress at a glance
- Track how many medicines you've taken today
- View a calendar of your medication history
- Get personalized greetings throughout the day

**Appointment Management**
- Schedule doctor visits and checkups
- Integrate appointments with your medicine schedule

**Profile and Settings**
- Manage your personal health information
- Customize app preferences
- Choose between dark and light mode

**Health History**
- View a complete log of medicines taken
- Track your medication compliance over time

## Built With

- React Native 0.81.4
- Expo 54.0.10
- React Navigation 7.x
- React Context API for state management
- AsyncStorage for data persistence
- Push notifications via Expo Notifications
- Calendar component for date tracking
- Icons from Ionicons and MaterialCommunityIcons

## Project Structure

The app is organized into clear folders:

- **screens/**: Main app pages (Home, Add Medicine, Appointments, Profile, Settings, History)
- **components/**: Reusable UI elements like medicine cards and calendars
- **navigation/**: Navigation setup and routing
- **context/**: Global state management using React Context
- **hooks/**: Custom React hooks for screen logic
- **services/**: Notifications and data storage
- **features/**: Feature-specific code for appointments, medicines, and profiles
- **constants/**: App-wide constants and configurations
- **utils/**: Helper functions
- **assets/**: Images and icons

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn package manager
- Expo CLI installed globally
- iOS or Android emulator, or a physical device

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
   npm run ios      # For iOS (macOS only)
   npm run android  # For Android
   npm run web      # For web browser
   ```

### Available Commands

- `npm start`: Start the development server
- `npm run ios`: Run on iOS simulator
- `npm run android`: Run on Android emulator
- `npm run web`: Run in web browser
- `npm run build:android`: Build for Android
- `npm run build:ios`: Build for iOS
- `npm submit:android`: Submit to Google Play Store
- `npm submit:ios`: Submit to Apple App Store

## How It Works

**Home Screen Dashboard**
When you open the app, you'll see your medication progress for the day. The dashboard shows upcoming doses, how many medicines you've taken, and quick access to add new medicines or view history.

**Adding Medicines**
Add a new medicine by providing its name, dosage, how often you take it, and what times. You can also add personal notes like "take with food" or any special instructions.

**Getting Reminders**
The app sends you notifications at scheduled times to remind you to take your medicine. You can tap the notification to open the app, or tap "Taken" directly in the notification.

**Tracking History**
All your medicine intake is recorded. You can view your history to see which medicines you've taken and when, helping you stay consistent with your medication schedule.

**Appointments**
You can also schedule doctor visits and appointments alongside your medicine tracking for a complete health management experience.

## How Data is Stored

All your information is stored securely on your device using local storage. Your medicines, appointments, and history stay private and never leave your phone.

## Contributing

Contributions are welcome. Feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is private and owned by rxiddhi.

## Support

For questions or issues, please open an issue on GitHub.
