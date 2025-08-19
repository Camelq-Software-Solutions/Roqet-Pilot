import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import PushNotificationService, { NotificationData } from '../services/PushNotificationService';
import NotificationSettingsService, { NotificationSettings } from '../services/NotificationSettingsService';

interface PushNotificationContextType {
  isInitialized: boolean;
  pushToken: string | null;
  badgeCount: number;
  sendLocalNotification: (notificationData: NotificationData) => Promise<void>;
  scheduleNotification: (
    notificationData: NotificationData,
    trigger: any
  ) => Promise<string>;
  cancelNotification: (notificationId: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  setBadgeCount: (count: number) => Promise<void>;
  getBadgeCount: () => Promise<number>;
  // Notification settings
  getNotificationSettings: () => NotificationSettings;
  updateNotificationSetting: <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => Promise<void>;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => Promise<void>;
  resetNotificationSettings: () => Promise<void>;
}

const PushNotificationContext = createContext<PushNotificationContextType | undefined>(undefined);

interface PushNotificationProviderProps {
  children: ReactNode;
}

export const PushNotificationProvider: React.FC<PushNotificationProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [badgeCount, setBadgeCountState] = useState(0);
  const navigation = useNavigation<NavigationProp<any>>();

  const notificationService = PushNotificationService.getInstance();

  useEffect(() => {
    initializePushNotifications();
    return () => {
      notificationService.cleanup();
    };
  }, []);

  const initializePushNotifications = async () => {
    try {
      await notificationService.initialize();
      const token = notificationService.getCurrentToken();
      setPushToken(token);
      setIsInitialized(true);

      // Set up navigation handlers
      setupNavigationHandlers();
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      setIsInitialized(true); // Set to true even if failed to prevent infinite loading
    }
  };

  const setupNavigationHandlers = () => {
    // Override the navigation methods in the service
    const originalNavigateToRideRequest = (notificationService as any).navigateToRideRequest;
    const originalNavigateToRideDetails = (notificationService as any).navigateToRideDetails;
    const originalNavigateToWallet = (notificationService as any).navigateToWallet;

    (notificationService as any).navigateToRideRequest = (rideId?: string) => {
      console.log('Navigate to ride request:', rideId);
      // Navigate to ride request screen
      navigation.navigate('RideRequest', { rideId });
    };

    (notificationService as any).navigateToRideDetails = (rideId?: string) => {
      console.log('Navigate to ride details:', rideId);
      // Navigate to ride details screen
      navigation.navigate('RideDetails', { rideId });
    };

    (notificationService as any).navigateToWallet = () => {
      console.log('Navigate to wallet');
      // Navigate to wallet screen
      navigation.navigate('Wallet');
    };
  };

  const sendLocalNotification = async (notificationData: NotificationData) => {
    try {
      await notificationService.sendLocalNotification(notificationData);
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  };

  const scheduleNotification = async (
    notificationData: NotificationData,
    trigger: any
  ): Promise<string> => {
    try {
      return await notificationService.scheduleNotification(notificationData, trigger);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  };

  const cancelNotification = async (notificationId: string) => {
    try {
      await notificationService.cancelNotification(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await notificationService.cancelAllNotifications();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationService.clearAllNotifications();
      setBadgeCountState(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const setBadgeCount = async (count: number) => {
    try {
      await notificationService.setBadgeCount(count);
      setBadgeCountState(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  };

  const getBadgeCount = async (): Promise<number> => {
    try {
      const count = await notificationService.getBadgeCount();
      setBadgeCountState(count);
      return count;
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  };

  // Notification settings methods
  const getNotificationSettings = (): NotificationSettings => {
    return notificationService.getSettingsService().getSettings();
  };

  const updateNotificationSetting = async <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ): Promise<void> => {
    await notificationService.getSettingsService().updateSetting(key, value);
  };

  const updateNotificationSettings = async (updates: Partial<NotificationSettings>): Promise<void> => {
    await notificationService.getSettingsService().updateSettings(updates);
  };

  const resetNotificationSettings = async (): Promise<void> => {
    await notificationService.getSettingsService().resetToDefaults();
  };

  const value: PushNotificationContextType = {
    isInitialized,
    pushToken,
    badgeCount,
    sendLocalNotification,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    clearAllNotifications,
    setBadgeCount,
    getBadgeCount,
    getNotificationSettings,
    updateNotificationSetting,
    updateNotificationSettings,
    resetNotificationSettings,
  };

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotifications = (): PushNotificationContextType => {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error('usePushNotifications must be used within a PushNotificationProvider');
  }
  return context;
};
