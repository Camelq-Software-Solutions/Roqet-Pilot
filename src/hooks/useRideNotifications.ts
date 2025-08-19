import { useCallback } from 'react';
import { usePushNotifications } from '../contexts/PushNotificationContext';
import { NotificationData } from '../services/PushNotificationService';
import { useLanguage } from '../contexts/LanguageContext';

export interface RideNotificationData {
  rideId: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  fare?: number;
  passengerName?: string;
  estimatedTime?: string;
  distance?: string;
}

export const useRideNotifications = () => {
  const { sendLocalNotification, scheduleNotification, cancelNotification } = usePushNotifications();
  const { t } = useLanguage();

  /**
   * Send ride request notification
   */
  const sendRideRequestNotification = useCallback(
    async (data: RideNotificationData) => {
      const notificationData: NotificationData = {
        type: 'ride_request',
        rideId: data.rideId,
        title: t('notifications.newRideRequest'),
        body: `${t('notifications.pickup')}: ${data.pickupLocation || 'Location'}\n${t('notifications.distance')}: ${data.distance || 'Unknown'}\n${t('notifications.time')}: ${data.estimatedTime || 'Unknown'}\n${t('notifications.fare')}: ₹${data.fare || '0'}`,
        data: {
          type: 'ride_request',
          rideId: data.rideId,
          pickupLocation: data.pickupLocation,
          dropoffLocation: data.dropoffLocation,
          fare: data.fare,
          passengerName: data.passengerName,
          distance: data.distance,
          estimatedTime: data.estimatedTime,
        },
      };

      await sendLocalNotification(notificationData);
    },
    [sendLocalNotification, t]
  );

  /**
   * Send ride update notification
   */
  const sendRideUpdateNotification = useCallback(
    async (data: RideNotificationData, updateType: 'pickup' | 'dropoff' | 'status') => {
      let title = '';
      let body = '';

      switch (updateType) {
        case 'pickup':
          title = t('notifications.passengerPickedUp');
          body = `${t('notifications.rideInProgress')} ${t('notifications.toDestination')} ${data.dropoffLocation || 'destination'}`;
          break;
        case 'dropoff':
          title = t('notifications.rideCompleted');
          body = `${t('notifications.earned')} ₹${data.fare || '0'}`;
          break;
        case 'status':
          title = t('notifications.rideStatusUpdate');
          body = `Your ride status has been updated`;
          break;
      }

      const notificationData: NotificationData = {
        type: 'ride_update',
        rideId: data.rideId,
        title,
        body,
        data: {
          type: 'ride_update',
          rideId: data.rideId,
          updateType,
          pickupLocation: data.pickupLocation,
          dropoffLocation: data.dropoffLocation,
          fare: data.fare,
        },
      };

      await sendLocalNotification(notificationData);
    },
    [sendLocalNotification, t]
  );

  /**
   * Send ride completed notification
   */
  const sendRideCompletedNotification = useCallback(
    async (data: RideNotificationData) => {
      const notificationData: NotificationData = {
        type: 'ride_completed',
        rideId: data.rideId,
        title: t('notifications.rideCompleted'),
        body: `${t('notifications.earned')} ₹${data.fare || '0'} for this ride\n${t('notifications.distance')}: ${data.distance || 'Unknown'}`,
        data: {
          type: 'ride_completed',
          rideId: data.rideId,
          fare: data.fare,
          pickupLocation: data.pickupLocation,
          dropoffLocation: data.dropoffLocation,
          distance: data.distance,
        },
      };

      await sendLocalNotification(notificationData);
    },
    [sendLocalNotification, t]
  );

  /**
   * Send payment received notification
   */
  const sendPaymentReceivedNotification = useCallback(
    async (data: RideNotificationData) => {
      const notificationData: NotificationData = {
        type: 'payment_received',
        rideId: data.rideId,
        title: t('notifications.paymentReceived'),
        body: `₹${data.fare || '0'} ${t('notifications.addedToWallet')}`,
        data: {
          type: 'payment_received',
          rideId: data.rideId,
          fare: data.fare,
        },
      };

      await sendLocalNotification(notificationData);
    },
    [sendLocalNotification, t]
  );

  /**
   * Schedule a reminder notification for ride pickup
   */
  const schedulePickupReminder = useCallback(
    async (data: RideNotificationData, reminderTime: Date) => {
      const notificationData: NotificationData = {
        type: 'ride_update',
        rideId: data.rideId,
        title: t('notifications.pickupReminder'),
        body: `${t('notifications.dontForgetPickup')} ${data.pickupLocation || 'the pickup location'}`,
        data: {
          type: 'ride_update',
          rideId: data.rideId,
          updateType: 'pickup_reminder',
          pickupLocation: data.pickupLocation,
        },
      };

      const trigger = {
        date: reminderTime,
      };

      return await scheduleNotification(notificationData, trigger);
    },
    [scheduleNotification, t]
  );

  /**
   * Schedule a notification for when driver goes offline
   */
  const scheduleOfflineReminder = useCallback(
    async (reminderTime: Date) => {
      const notificationData: NotificationData = {
        type: 'system',
        title: t('notifications.youreOffline'),
        body: t('notifications.goBackOnline'),
        data: {
          type: 'system',
          action: 'go_online',
        },
      };

      const trigger = {
        date: reminderTime,
      };

      return await scheduleNotification(notificationData, trigger);
    },
    [scheduleNotification, t]
  );

  /**
   * Cancel ride-specific notifications
   */
  const cancelRideNotifications = useCallback(
    async (rideId: string) => {
      // This would require tracking notification IDs per ride
      // For now, we'll just log it
      console.log(`Canceling notifications for ride: ${rideId}`);
    },
    []
  );

  /**
   * Send system notification
   */
  const sendSystemNotification = useCallback(
    async (title: string, body: string, data?: Record<string, any>) => {
      const notificationData: NotificationData = {
        type: 'system',
        title,
        body,
        data: {
          type: 'system',
          ...data,
        },
      };

      await sendLocalNotification(notificationData);
    },
    [sendLocalNotification, t]
  );

  /**
   * Send offline notification when app is closed
   */
  const sendOfflineNotification = useCallback(
    async () => {
      const notificationData: NotificationData = {
        type: 'system',
        title: t('notifications.youreOffline'),
        body: t('notifications.goBackOnline'),
        data: {
          type: 'system',
          action: 'go_online',
        },
      };

      await sendLocalNotification(notificationData);
    },
    [sendLocalNotification, t]
  );

  return {
    sendRideRequestNotification,
    sendRideUpdateNotification,
    sendRideCompletedNotification,
    sendPaymentReceivedNotification,
    schedulePickupReminder,
    scheduleOfflineReminder,
    cancelRideNotifications,
    sendSystemNotification,
    sendOfflineNotification,
  };
};
