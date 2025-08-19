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

  /**
   * Send surge notification during peak hours
   */
  const sendSurgeNotification = useCallback(
    async (surgeMultiplier?: number) => {
      const notificationData: NotificationData = {
        type: 'system',
        title: t('notifications.surgePricing'),
        body: surgeMultiplier 
          ? t('notifications.surgePricingBody', { multiplier: surgeMultiplier })
          : t('notifications.surgePricingDefault'),
        data: {
          type: 'system',
          action: 'go_online',
          surge: true,
          multiplier: surgeMultiplier,
        },
      };

      await sendLocalNotification(notificationData);
    },
    [sendLocalNotification, t]
  );

  /**
   * Schedule daily surge notifications at 9 AM and 6 PM
   */
  const scheduleSurgeNotifications = useCallback(
    async () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Schedule for 9 AM today
      const nineAM = new Date(today);
      nineAM.setHours(9, 0, 0, 0);
      
      // Schedule for 6 PM today
      const sixPM = new Date(today);
      sixPM.setHours(18, 0, 0, 0);
      
      // If it's already past 9 AM, schedule for tomorrow
      if (now.getHours() >= 9) {
        nineAM.setDate(nineAM.getDate() + 1);
      }
      
      // If it's already past 6 PM, schedule for tomorrow
      if (now.getHours() >= 18) {
        sixPM.setDate(sixPM.getDate() + 1);
      }

      try {
        // Schedule 9 AM notification
        const nineAMNotification: NotificationData = {
          type: 'system',
          title: t('notifications.morningSurge'),
          body: t('notifications.morningSurgeBody'),
          data: {
            type: 'system',
            action: 'go_online',
            surge: true,
            time: 'morning',
          },
        };

        const nineAMTrigger = { date: nineAM };
        await scheduleNotification(nineAMNotification, nineAMTrigger);
        console.log('📅 Scheduled morning surge notification for:', nineAM.toLocaleString());

        // Schedule 6 PM notification
        const sixPMNotification: NotificationData = {
          type: 'system',
          title: t('notifications.eveningSurge'),
          body: t('notifications.eveningSurgeBody'),
          data: {
            type: 'system',
            action: 'go_online',
            surge: true,
            time: 'evening',
          },
        };

        const sixPMTrigger = { date: sixPM };
        await scheduleNotification(sixPMNotification, sixPMTrigger);
        console.log('📅 Scheduled evening surge notification for:', sixPM.toLocaleString());

      } catch (error) {
        console.error('❌ Failed to schedule surge notifications:', error);
      }
    },
    [scheduleNotification, t]
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
    sendSurgeNotification,
    scheduleSurgeNotifications,
  };
};
