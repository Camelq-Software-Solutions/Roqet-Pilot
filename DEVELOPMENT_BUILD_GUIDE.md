# Development Build Guide for Push Notifications

## Why Development Build?

Push notifications don't work in Expo Go due to limitations in SDK 53+. To test push notifications properly, you need to create a development build.

## Quick Setup

### 1. Install EAS CLI (if not already installed)
```bash
npm install -g @expo/eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Build Development APK
```bash
eas build --profile development --platform android
```

### 4. Install on Device
- Download the APK from the build link
- Install on your Android device
- Enable developer options and USB debugging if needed

## Alternative: Local Development Build

If you prefer to build locally:

### 1. Install Expo Dev Client
```bash
npx expo install expo-dev-client
```

### 2. Build Locally
```bash
npx expo run:android
```

## Testing Push Notifications

### In Development Build:
1. **Real Push Notifications**: Work properly with sound, vibration, and background processing
2. **Navigation**: Tapping notifications navigates to appropriate screens
3. **Background**: Notifications work when app is closed

### In Expo Go (Current Setup):
1. **Mock Notifications**: Shows as alerts for testing
2. **Limited Functionality**: No background processing or real push notifications
3. **Testing**: Good for UI testing but not real push notification testing

## Current Implementation

The app automatically detects the environment:
- **Expo Go**: Uses `MockPushNotificationService`
- **Development Build**: Uses real `PushNotificationService`

## Troubleshooting

### Build Issues:
1. **Authentication Error**: Run `eas login` and ensure you have access to the project
2. **Build Fails**: Check the EAS build logs for specific errors
3. **APK Won't Install**: Enable "Install from unknown sources" on your device

### Push Notification Issues:
1. **Not Receiving Notifications**: Check device notification settings
2. **Permissions Denied**: Grant notification permissions in app settings
3. **Token Issues**: Check console logs for token generation errors

## Next Steps

1. **Build Development APK**: Use the commands above
2. **Test on Physical Device**: Install the APK and test notifications
3. **Backend Integration**: Ensure your backend can send push notifications
4. **Production**: Use the production build profile for app store releases

## Mock Service Features

The mock service provides:
- ✅ Alert-based notifications in Expo Go
- ✅ Console logging for debugging
- ✅ Navigation simulation
- ✅ All notification types (ride requests, updates, payments, system)

## Real Service Features

The real service provides:
- ✅ Native push notifications
- ✅ Background processing
- ✅ Sound and vibration
- ✅ Badge counts
- ✅ Android notification channels
- ✅ Backend integration

---

**Note**: Always test push notifications on a physical device, not an emulator.
