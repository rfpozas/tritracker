# Quick Start Guide for Windows

## Step 1: Install Prerequisites

1. **Install Node.js** (v18 or later)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Install React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

3. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - During installation, make sure to install:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device

## Step 2: Set Up Android Environment

1. **Set Environment Variables** (Windows):
   - Add to System Environment Variables:
     - `ANDROID_HOME` = `C:\Users\YourUsername\AppData\Local\Android\Sdk`
     - Add to PATH:
       - `%ANDROID_HOME%\platform-tools`
       - `%ANDROID_HOME%\tools`
       - `%ANDROID_HOME%\tools\bin`

2. **Create Android Virtual Device (AVD)**:
   - Open Android Studio
   - Go to Tools > Device Manager
   - Click "Create Device"
   - Select a device (e.g., Pixel 5)
   - Download a system image (e.g., API 33)
   - Finish setup

## Step 3: Install Project Dependencies

```bash
cd TriTrackerRN
npm install
```

## Step 4: Install Date Picker (Optional but Recommended)

```bash
npm install @react-native-community/datetimepicker
```

For Android, you may also need to link it:
```bash
cd android
./gradlew clean
cd ..
```

## Step 5: Run the App

1. **Start Metro Bundler** (in one terminal):
   ```bash
   npm start
   ```

2. **Run on Android** (in another terminal):
   ```bash
   npm run android
   ```

   Or if you have an Android device connected:
   ```bash
   npx react-native run-android
   ```

## Troubleshooting

### Issue: "SDK location not found"
- Make sure ANDROID_HOME is set correctly
- Restart your terminal/command prompt

### Issue: "Command not found: react-native"
- Make sure React Native CLI is installed globally
- Try: `npm install -g react-native-cli`

### Issue: Metro bundler won't start
- Clear cache: `npx react-native start --reset-cache`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Issue: Android build fails
- Make sure you have Java JDK installed
- Check Android SDK is properly configured
- Try: `cd android && ./gradlew clean && cd ..`

## Next Steps

Once the app is running:
1. Tap the "+" button to add your first workout
2. Navigate to Analytics to see your stats
3. Long-press a workout to delete it

## Building for iOS (When You Have Mac Access)

1. Install Xcode from App Store
2. Install CocoaPods: `sudo gem install cocoapods`
3. Install iOS dependencies:
   ```bash
   cd ios
   pod install
   cd ..
   ```
4. Run: `npx react-native run-ios`





