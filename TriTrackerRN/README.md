# TriTracker - React Native Version

A cross-platform triathlon workout tracker built with React Native. This version can be developed and tested on Windows using Android emulator, and can be built for iOS when you have access to a Mac.

## Features

- ✅ Manual workout entry (Run, Bike, Swim)
- ✅ Track distance, duration, calories, heart rate, and wattage
- ✅ Comprehensive analytics (Daily, Weekly, Monthly, Yearly)
- ✅ Filter by workout type
- ✅ Local data persistence with AsyncStorage
- ✅ Beautiful, modern UI

## Prerequisites

- Node.js (v18 or later)
- React Native CLI
- Android Studio (for Android development on Windows)
- Xcode (for iOS development - Mac only)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **For Android (Windows):**
   - Install Android Studio
   - Set up Android SDK
   - Create an Android Virtual Device (AVD)
   - Run: `npx react-native run-android`

3. **For iOS (Mac only):**
   ```bash
   cd ios
   pod install
   cd ..
   npx react-native run-ios
   ```

## Running the App

### Start Metro Bundler:
```bash
npm start
```

### Run on Android:
```bash
npm run android
```

### Run on iOS (Mac only):
```bash
npm run ios
```

## Project Structure

```
TriTrackerRN/
├── App.tsx                 # Main app component with navigation
├── src/
│   ├── context/
│   │   └── WorkoutContext.tsx    # Global state management
│   ├── screens/
│   │   ├── WorkoutListScreen.tsx
│   │   ├── AddWorkoutScreen.tsx
│   │   ├── WorkoutDetailScreen.tsx
│   │   └── AnalyticsScreen.tsx
│   └── types/
│       └── Workout.ts            # TypeScript types
└── package.json
```

## Development Notes

- Data is stored locally using AsyncStorage
- The app uses React Navigation for navigation
- Vector icons from react-native-vector-icons
- TypeScript for type safety

## Building for Production

### Android:
```bash
cd android
./gradlew assembleRelease
```

### iOS (Mac only):
```bash
cd ios
pod install
# Then build in Xcode
```

## License

MIT License - see LICENSE file for details

