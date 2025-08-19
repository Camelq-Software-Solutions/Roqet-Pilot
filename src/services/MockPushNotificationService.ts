import { Alert } from 'react-native';

export interface NotificationData {
  type: 'ride_request' | 'ride_update' | 'ride_completed' | 'payment_received' | 'system';
  rideId?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

class MockPushNotificationService {
  private static instance: MockPushNotificationService;
  private expoPushToken: string | null = null;

  private constructor() {}

  public static getInstance(): MockPushNotificationService {
    if (!MockPushNotificationService.instance) {
      MockPushNotificationService.instance = new MockPushNotificationService();
    }
    return MockPushNotificationService.instance;
  }

  /**
   * Initialize mock push notifications
   */
  public async initialize(): Promise<void> {
    try {
      console.log('🔧 Mock Push Notifications: Initializing...');
      
      // Generate a mock token
      this.expoPushToken = `mock_token_${Date.now()}`;
      console.log('📱 Mock Push token:', this.expoPushToken);
      
      // Show initialization alert
      Alert.alert(
        'Mock Push Notifications',
        'Push notifications are running in mock mode for Expo Go testing.\n\nIn a development build, you would receive real push notifications.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Error initializing mock push notifications:', error);
    }
  }

  /**
   * Send local notification (shows as alert in Expo Go)
   */
  public async sendLocalNotification(notificationData: NotificationData): Promise<void> {
    try {
      console.log('📱 Mock Notification:', notificationData);
      
      // Show as alert in Expo Go
      Alert.alert(
        notificationData.title,
        notificationData.body,
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Mock notification tapped:', notificationData);
              this.handleNotificationTap(notificationData);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error sending mock notification:', error);
    }
  }

  /**
   * Handle notification tap
   */
  private handleNotificationTap(notificationData: NotificationData): void {
    const { type, rideId } = notificationData;
    
    switch (type) {
      case 'ride_request':
        console.log('Navigate to ride request:', rideId);
        break;
      case 'ride_update':
        console.log('Navigate to ride details:', rideId);
        break;
      case 'payment_received':
        console.log('Navigate to wallet');
        break;
      case 'system':
        console.log('Navigate to home');
        break;
      default:
        console.log('Unknown notification type:', type);
    }
  }

  /**
   * Schedule a notification for later
   */
  public async scheduleNotification(
    notificationData: NotificationData,
    trigger: any
  ): Promise<string> {
    try {
      const notificationId = `mock_${Date.now()}`;
      console.log('📅 Mock scheduled notification:', notificationData, 'ID:', notificationId);
      
      // For mock service, we'll show it immediately
      setTimeout(() => {
        this.sendLocalNotification(notificationData);
      }, 1000);
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling mock notification:', error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  public async cancelNotification(notificationId: string): Promise<void> {
    try {
      console.log('❌ Mock cancel notification:', notificationId);
    } catch (error) {
      console.error('Error canceling mock notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  public async cancelAllNotifications(): Promise<void> {
    try {
      console.log('❌ Mock cancel all notifications');
    } catch (error) {
      console.error('Error canceling all mock notifications:', error);
    }
  }

  /**
   * Get badge count
   */
  public async getBadgeCount(): Promise<number> {
    return 0; // Mock badge count
  }

  /**
   * Set badge count
   */
  public async setBadgeCount(count: number): Promise<void> {
    console.log('📱 Mock set badge count:', count);
  }

  /**
   * Clear all notifications
   */
  public async clearAllNotifications(): Promise<void> {
    console.log('🧹 Mock clear all notifications');
  }

  /**
   * Clean up listeners
   */
  public cleanup(): void {
    console.log('🧹 Mock cleanup');
  }

  /**
   * Get the current push token
   */
  public getCurrentToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Get saved push token
   */
  public async getToken(): Promise<string | null> {
    return this.expoPushToken;
  }
}

export default MockPushNotificationService;
