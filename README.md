# TriTracker - Triathlon Workout Tracker

A triathlon workout tracker app available in two versions:
- **iOS Native (SwiftUI)** - For macOS/Xcode development
- **React Native** - Cross-platform version that can be developed on Windows

Both versions track your triathlon workouts (running, biking, and swimming) with comprehensive analytics.

## Features

- **Manual Workout Entry**: Add workouts with detailed information including:
  - Workout type (Run, Bike, Swim)
  - Date and time
  - Duration (hours, minutes, seconds)
  - Distance (km for run/bike, meters for swim)
  - Calories burned
  - Average heart rate
  - Average wattage

- **Comprehensive Analytics**: View your performance across different time periods:
  - Daily
  - Weekly
  - Monthly
  - Yearly

- **Performance Metrics**: Track and analyze:
  - Total workouts
  - Total distance
  - Total time
  - Total calories
  - Average heart rate
  - Average wattage
  - Breakdown by workout type

## Which Version Should I Use?

### Use iOS Native Version If:
- You have a Mac with Xcode installed
- You want a native iOS experience
- You're targeting iOS only

### Use React Native Version If:
- You're developing on Windows
- You want to test on Android
- You want cross-platform support

See [WINDOWS_SETUP.md](WINDOWS_SETUP.md) for Windows development setup.

## iOS Native Version Requirements

- iOS 17.0 or later
- Xcode 15.0 or later
- Swift 5.0 or later

### Installation (iOS Native)

1. Open the project in Xcode
2. Select your development team in the project settings
3. Build and run on a simulator or device

## React Native Version Requirements

- Node.js v18 or later
- React Native CLI
- Android Studio (for Windows development)
- Xcode (for iOS development - Mac only)

### Installation (React Native)

See [TriTrackerRN/README.md](TriTrackerRN/README.md) and [TriTrackerRN/QUICK_START.md](TriTrackerRN/QUICK_START.md) for detailed setup instructions.

## Project Structure

```
TriTracker/
├── TriTrackerApp.swift          # App entry point
├── Models/
│   ├── WorkoutType.swift        # Workout type enum
│   └── Workout.swift            # Workout model extensions
├── Persistence/
│   └── PersistenceController.swift  # Core Data setup
├── ViewModels/
│   └── WorkoutViewModel.swift    # Workout data management
├── Views/
│   ├── ContentView.swift       # Main tab view
│   ├── WorkoutListView.swift   # List of all workouts
│   ├── AddWorkoutView.swift    # Form to add new workouts
│   ├── WorkoutDetailView.swift # Detailed workout view
│   └── AnalyticsView.swift     # Analytics dashboard
└── TriTrackerDataModel.xcdatamodeld/  # Core Data model
```

## Usage

### Adding a Workout

1. Tap the "+" button in the Workouts tab
2. Select the workout type (Run, Bike, or Swim)
3. Enter the date and time
4. Set the duration using the pickers
5. Enter distance (in km for run/bike, meters for swim)
6. Optionally add calories, heart rate, and wattage
7. Tap "Save"

### Viewing Analytics

1. Navigate to the Analytics tab
2. Select a time period (Daily, Weekly, Monthly, Yearly)
3. Optionally filter by workout type
4. View your statistics and performance metrics

## Data Persistence

The app uses Core Data to persist all workout data locally on your device. Your data is stored securely and remains available even after closing the app.

## License

MIT License - see LICENSE file for details

