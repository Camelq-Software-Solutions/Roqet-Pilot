# Push Notifications Implementation

This document outlines the comprehensive push notification system implemented for the RiderSony Driver App.

## Overview

The push notification system allows drivers to receive real-time notifications for ride requests, ride updates, payments, and system messages even when the app is closed or running in the background.

## Features

### 1. **Ride Request Notifications**
- Instant notifications when new ride requests are available
- High priority notifications with sound and vibration
- Includes pickup location, dropoff location, and fare information

### 2. **Ride Update Notifications**
- Passenger pickup confirmations
- Ride completion notifications
- Status update notifications

### 3. **Payment Notifications**
- Payment received confirmations
- Wallet balance updates

### 4. **System Notifications**
- Offline reminders
- App updates and maintenance notifications
- General system messages

### 5. **Background Processing**
- Notifications work when app is closed
- Proper handling of notification taps
- Navigation to appropriate screens

## Architecture

### Core Components

1. **PushNotificationService** (`src/services/PushNotificationService.ts`)
   - Singleton service managing push notification lifecycle
   - Handles token generation and management
   - Manages notification channels (Android)
   - Processes incoming notifications

2. **PushNotificationContext** (`src/contexts/PushNotificationContext.tsx`)
   - React context providing notification functionality
   - Manages notification state across the app
   - Handles navigation from notification taps

3. **useRideNotifications** (`src/hooks/useRideNotifications.ts`)
   - Custom hook for ride-specific notifications
   - Provides easy-to-use functions for different notification types

4. **PushNotificationAPI** (`src/services/PushNotificationAPI.ts`)
   - API service for backend communication
   - Registers/unregisters push tokens
   - Sends notifications from backend

### Notification Types

```typescript
interface NotificationData {
  type: 'ride_request' | 'ride_update' | 'ride_completed' | 'payment_received' | 'system';
  rideId?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}
```

## Setup Instructions

### 1. Dependencies

The following packages are required:
```json
{
  "expo-notifications": "latest",
  "expo-device": "latest"
}
```

### 2. App Configuration

Update `app.json` to include notification configuration:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/Mainlogo.jpeg",
          "color": "#ffffff",
          "sounds": ["./assets/sounds/notification.wav"]
        }
      ]
    ],
    "android": {
      "permissions": [
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "WAKE_LOCK"
      ]
    }
  }
}
```

### 3. Provider Setup

Wrap your app with the PushNotificationProvider in `App.tsx`:

```tsx
import { PushNotificationProvider } from './src/contexts/PushNotificationContext';

export default function App() {
  return (
    <PushNotificationProvider>
      {/* Your app components */}
    </PushNotificationProvider>
  );
}
```

## Usage Examples

### 1. Sending Ride Request Notifications

```tsx
import { useRideNotifications } from '../hooks/useRideNotifications';

const { sendRideRequestNotification } = useRideNotifications();

// When a new ride request is received
await sendRideRequestNotification({
  rideId: 'ride_123',
  pickupLocation: '123 Main St',
  dropoffLocation: '456 Oak Ave',
  fare: 25.50,
  passengerName: 'John Doe'
});
```

### 2. Sending Ride Completion Notifications

```tsx
const { sendRideCompletedNotification } = useRideNotifications();

// When ride is completed
await sendRideCompletedNotification({
  rideId: 'ride_123',
  pickupLocation: '123 Main St',
  dropoffLocation: '456 Oak Ave',
  fare: 25.50
});
```

### 3. Sending System Notifications

```tsx
const { sendSystemNotification } = useRideNotifications();

// Send offline reminder
await sendSystemNotification(
  'You\'re Offline 📱',
  'Tap to go back online and start receiving ride requests'
);
```

### 4. Testing Notifications

Use the test notification feature in Settings screen:

```tsx
// In SettingsScreen.tsx
const { sendSystemNotification } = useRideNotifications();

// Test notification button
<TouchableOpacity onPress={() => {
  sendSystemNotification(
    'Test Notification',
    'This is a test push notification!'
  );
}}>
  <Text>Test Notification</Text>
</TouchableOpacity>
```

## Notification Channels (Android)

The system creates different notification channels for different types of notifications:

1. **ride-requests** - High priority for new ride requests
2. **ride-updates** - Normal priority for ride status updates
3. **payments** - Normal priority for payment notifications
4. **system** - Low priority for system messages

## Background Processing

### App State Handling

The system properly handles notifications in different app states:

1. **Foreground** - Notifications are displayed as in-app alerts
2. **Background** - Notifications appear in notification tray
3. **Closed** - Notifications wake the app and navigate to appropriate screen

### Navigation from Notifications

When users tap on notifications, the app navigates to the appropriate screen:

- **Ride Request** → Ride Request Screen
- **Ride Update** → Ride Details Screen
- **Payment** → Wallet Screen
- **System** → Home Screen

## Backend Integration

### Token Registration

Push tokens are automatically registered with the backend when the app initializes:

```typescript
// In PushNotificationService.initialize()
const api = PushNotificationAPI.getInstance();
await api.registerPushToken(token.data);
```

### Backend API Endpoints

The system expects the following backend endpoints:

1. `POST /api/drivers/push-token` - Register push token
2. `DELETE /api/drivers/push-token` - Unregister push token
3. `POST /api/notifications/send` - Send notification

### Notification Payload Format

```typescript
interface PushNotificationPayload {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | 'notification.wav';
  priority?: 'default' | 'normal' | 'high';
  badge?: number;
}
```

## Testing

### Local Testing

1. Use the test notification feature in Settings
2. Test different notification types
3. Verify navigation from notifications
4. Test background/foreground behavior

### Device Testing

1. Test on physical device (not simulator)
2. Verify notifications work when app is closed
3. Test notification permissions
4. Verify sound and vibration

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Check notification permissions
   - Verify device is physical (not simulator)
   - Check notification channels (Android)

2. **Navigation not working**
   - Verify PushNotificationProvider is properly set up
   - Check navigation context availability

3. **Backend registration failing**
   - Check network connectivity
   - Verify API endpoints
   - Check authentication tokens

### Debug Logs

The system provides comprehensive logging:

```typescript
console.log('📱 Push token:', token.data);
console.log('✅ Push token registered with backend');
console.log('📱 Notification received:', notification);
console.log('📱 Notification tapped:', response);
```

## Security Considerations

1. **Token Security** - Push tokens are stored securely using AsyncStorage
2. **Authentication** - All API calls include proper authentication
3. **Data Privacy** - Notification data is minimal and necessary only

## Performance Optimization

1. **Token Caching** - Push tokens are cached locally
2. **Lazy Loading** - Notification listeners are set up only when needed
3. **Memory Management** - Proper cleanup of notification listeners

## Future Enhancements

1. **Rich Notifications** - Add images and actions to notifications
2. **Custom Sounds** - Different sounds for different notification types
3. **Notification History** - Store and display notification history
4. **Push Analytics** - Track notification engagement metrics
5. **Scheduled Notifications** - Send notifications at specific times

## Support

For issues or questions regarding push notifications:

1. Check the troubleshooting section
2. Review debug logs
3. Test on physical device
4. Verify backend integration

---

**Note**: This implementation requires a physical device for testing as push notifications do not work in simulators.
