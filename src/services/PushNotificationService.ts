import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationAPI from './PushNotificationAPI';
import MockPushNotificationService from './MockPushNotificationService';
import Constants from 'expo-constants';
import NotificationSettingsService from './NotificationSettingsService';

// Configure notification behavior for all environments
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  type: 'ride_request' | 'ride_update' | 'ride_completed' | 'payment_received' | 'system';
  rideId?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;
  private settingsService: NotificationSettingsService;

  private constructor() {
    this.settingsService = NotificationSettingsService.getInstance();
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initialize push notifications
   */
  public async initialize(): Promise<void> {
    try {
      // Initialize notification settings first
      await this.settingsService.initialize();
      
      // Request permissions for all environments
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get the token
      if (Device.isDevice) {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: '2310a216-9fa2-4e9b-bf24-b2735c3bc4e1', // Your EAS project ID
        });
        this.expoPushToken = token.data;
        await this.saveToken(token.data);
        console.log('Expo push token:', token.data);

        // Register token with backend
        const api = PushNotificationAPI.getInstance();
        const success = await api.registerPushToken(token.data);
        if (success) {
          console.log('✅ Push token registered with backend');
        } else {
          console.log('⚠️ Failed to register push token with backend');
        }
      } else {
        console.log('⚠️ Must use physical device for Push Notifications');
        console.log('📱 For testing in Expo Go, notifications will be simulated');
        // For development/testing, we can still use local notifications
        this.expoPushToken = 'dev_token_' + Date.now();
      }

      // Set up notification listeners
      this.setupNotificationListeners();

      // Configure notification channels for Android
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  /**
   * Set up Android notification channels
   */
  private async setupAndroidChannels(): Promise<void> {
    await Notifications.setNotificationChannelAsync('ride-requests', {
      name: 'Ride Requests',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });

    await Notifications.setNotificationChannelAsync('ride-updates', {
      name: 'Ride Updates',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });

    await Notifications.setNotificationChannelAsync('payments', {
      name: 'Payments',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });

    await Notifications.setNotificationChannelAsync('system', {
      name: 'System Notifications',
      importance: Notifications.AndroidImportance.LOW,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      enableVibrate: false,
      showBadge: true,
    });
  }

  /**
   * Set up notification listeners
   */
  private setupNotificationListeners(): void {
    // Listen for incoming notifications
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listen for notification responses (when user taps notification)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  /**
   * Handle incoming notifications
   */
  private handleNotificationReceived(notification: Notifications.Notification): void {
    const { title, body, data } = notification.request.content;
    console.log('Received notification:', { title, body, data });

    // You can add custom logic here to handle different notification types
    // For example, update UI, play sounds, etc.
  }

  /**
   * Handle notification responses (when user taps notification)
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const { title, body, data } = response.notification.request.content;
    console.log('Notification tapped:', { title, body, data });

    // Handle navigation based on notification type
    if (data?.type === 'ride_request') {
      // Navigate to ride request screen
      this.navigateToRideRequest(data.rideId);
    } else if (data?.type === 'ride_update') {
      // Navigate to ride details
      this.navigateToRideDetails(data.rideId);
    } else if (data?.type === 'payment_received') {
      // Navigate to wallet or payment screen
      this.navigateToWallet();
    }
  }

  /**
   * Navigate to ride request screen
   */
  private navigateToRideRequest(rideId?: string): void {
    // This will be implemented with navigation
    console.log('Navigate to ride request:', rideId);
  }

  /**
   * Navigate to ride details screen
   */
  private navigateToRideDetails(rideId?: string): void {
    // This will be implemented with navigation
    console.log('Navigate to ride details:', rideId);
  }

  /**
   * Navigate to wallet screen
   */
  private navigateToWallet(): void {
    // This will be implemented with navigation
    console.log('Navigate to wallet');
  }

  /**
   * Save push token to AsyncStorage
   */
  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('expoPushToken', token);
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  /**
   * Get saved push token
   */
  public async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('expoPushToken');
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Send local notification (for testing or immediate notifications)
   */
  public async sendLocalNotification(notificationData: NotificationData): Promise<void> {
    try {
      console.log('🔔 Attempting to send notification:', notificationData.title);
      
      // Check notification settings before sending
      const shouldSend = this.shouldSendNotification(notificationData.type);
      if (!shouldSend) {
        console.log(`🔕 Notification blocked by settings: ${notificationData.type}`);
        return;
      }

      // Real notifications for all environments
      const channelId = this.getChannelId(notificationData.type);
      const settings = this.getNotificationSettings(notificationData.type);
      
      console.log('📱 Sending notification with channel:', channelId);
      console.log('📱 Notification settings:', settings);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data || {},
          sound: settings.sound ? 'default' : undefined,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
      });
      
      console.log('📱 Real push notification sent:', notificationData.title);
    } catch (error) {
      console.error('❌ Error sending local notification:', error);
    }
  }

  /**
   * Get appropriate channel ID based on notification type
   */
  private getChannelId(type: string): string {
    switch (type) {
      case 'ride_request':
        return 'ride-requests';
      case 'ride_update':
      case 'ride_completed':
        return 'ride-updates';
      case 'payment_received':
        return 'payments';
      default:
        return 'system';
    }
  }

  /**
   * Schedule a notification for later
   */
  public async scheduleNotification(
    notificationData: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const channelId = this.getChannelId(notificationData.type);
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data || {},
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  public async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  public async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  /**
   * Get badge count
   */
  public async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  /**
   * Set badge count
   */
  public async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  /**
   * Clear all notifications
   */
  public async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  /**
   * Clean up listeners
   */
  public cleanup(): void {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }

  /**
   * Get the current push token
   */
  public getCurrentToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Check if notification should be sent based on settings
   */
  private shouldSendNotification(type: string): boolean {
    switch (type) {
      case 'ride_request':
        return this.settingsService.isNotificationEnabled('rideRequests');
      case 'ride_update':
      case 'ride_completed':
        return this.settingsService.isNotificationEnabled('rideUpdates');
      case 'payment_received':
        return this.settingsService.isNotificationEnabled('paymentReceived');
      case 'system':
        return this.settingsService.isNotificationEnabled('systemNotifications');
      default:
        return this.settingsService.isNotificationEnabled('systemNotifications');
    }
  }

  /**
   * Get notification settings for a specific type
   */
  private getNotificationSettings(type: string): { sound: boolean; vibration: boolean } {
    switch (type) {
      case 'ride_request':
        return this.settingsService.getRideRequestSettings();
      case 'ride_update':
      case 'ride_completed':
        return this.settingsService.getRideUpdateSettings();
      case 'payment_received':
        return this.settingsService.getPaymentSettings();
      case 'system':
        return this.settingsService.getSystemSettings();
      default:
        return this.settingsService.getSystemSettings();
    }
  }

  /**
   * Get notification settings service
   */
  public getSettingsService(): NotificationSettingsService {
    return this.settingsService;
  }
}

export default PushNotificationService;
