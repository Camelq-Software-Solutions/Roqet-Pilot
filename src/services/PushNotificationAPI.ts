import { getToken } from '@clerk/clerk-expo';

export interface PushNotificationPayload {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | 'notification.wav';
  priority?: 'default' | 'normal' | 'high';
  badge?: number;
}

export interface RideNotificationData {
  rideId: string;
  type: 'ride_request' | 'ride_update' | 'ride_completed' | 'payment_received';
  pickupLocation?: string;
  dropoffLocation?: string;
  fare?: number;
  passengerName?: string;
  estimatedTime?: string;
}

class PushNotificationAPI {
  private static instance: PushNotificationAPI;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://roqet-production.up.railway.app';
  }

  public static getInstance(): PushNotificationAPI {
    if (!PushNotificationAPI.instance) {
      PushNotificationAPI.instance = new PushNotificationAPI();
    }
    return PushNotificationAPI.instance;
  }

  /**
   * Register driver's push token with the backend
   */
  public async registerPushToken(pushToken: string): Promise<boolean> {
    try {
      const token = await getToken({ template: 'driver_app_token' });
      
      const response = await fetch(`${this.baseURL}/api/drivers/push-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
        body: JSON.stringify({
          pushToken,
          platform: 'expo',
        }),
      });

      if (response.ok) {
        console.log('✅ Push token registered successfully');
        return true;
      } else {
        console.error('❌ Failed to register push token:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error registering push token:', error);
      return false;
    }
  }

  /**
   * Send ride request notification to driver
   */
  public async sendRideRequestNotification(
    driverPushToken: string,
    rideData: RideNotificationData
  ): Promise<boolean> {
    try {
      const token = await getToken({ template: 'driver_app_token' });
      
      const payload: PushNotificationPayload = {
        to: driverPushToken,
        title: 'New Ride Request! 🚗',
        body: `Pickup: ${rideData.pickupLocation || 'Location'}\nFare: $${rideData.fare || '0'}`,
        data: {
          type: 'ride_request',
          rideId: rideData.rideId,
          pickupLocation: rideData.pickupLocation,
          dropoffLocation: rideData.dropoffLocation,
          fare: rideData.fare,
          passengerName: rideData.passengerName,
        },
        sound: 'default',
        priority: 'high',
        badge: 1,
      };

      const response = await fetch(`${this.baseURL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('✅ Ride request notification sent successfully');
        return true;
      } else {
        console.error('❌ Failed to send ride request notification:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending ride request notification:', error);
      return false;
    }
  }

  /**
   * Send ride update notification to driver
   */
  public async sendRideUpdateNotification(
    driverPushToken: string,
    rideData: RideNotificationData,
    updateType: 'pickup' | 'dropoff' | 'status'
  ): Promise<boolean> {
    try {
      const token = await getToken({ template: 'driver_app_token' });
      
      let title = '';
      let body = '';

      switch (updateType) {
        case 'pickup':
          title = 'Passenger Picked Up! ✅';
          body = `Ride in progress to ${rideData.dropoffLocation || 'destination'}`;
          break;
        case 'dropoff':
          title = 'Ride Completed! 🎉';
          body = `You've earned $${rideData.fare || '0'}`;
          break;
        case 'status':
          title = 'Ride Status Update';
          body = `Your ride status has been updated`;
          break;
      }

      const payload: PushNotificationPayload = {
        to: driverPushToken,
        title,
        body,
        data: {
          type: 'ride_update',
          rideId: rideData.rideId,
          updateType,
          pickupLocation: rideData.pickupLocation,
          dropoffLocation: rideData.dropoffLocation,
          fare: rideData.fare,
        },
        sound: 'default',
        priority: 'normal',
      };

      const response = await fetch(`${this.baseURL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('✅ Ride update notification sent successfully');
        return true;
      } else {
        console.error('❌ Failed to send ride update notification:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending ride update notification:', error);
      return false;
    }
  }

  /**
   * Send payment received notification to driver
   */
  public async sendPaymentNotification(
    driverPushToken: string,
    rideData: RideNotificationData
  ): Promise<boolean> {
    try {
      const token = await getToken({ template: 'driver_app_token' });
      
      const payload: PushNotificationPayload = {
        to: driverPushToken,
        title: 'Payment Received! 💰',
        body: `$${rideData.fare || '0'} has been added to your wallet`,
        data: {
          type: 'payment_received',
          rideId: rideData.rideId,
          fare: rideData.fare,
        },
        sound: 'default',
        priority: 'normal',
      };

      const response = await fetch(`${this.baseURL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('✅ Payment notification sent successfully');
        return true;
      } else {
        console.error('❌ Failed to send payment notification:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending payment notification:', error);
      return false;
    }
  }

  /**
   * Send system notification to driver
   */
  public async sendSystemNotification(
    driverPushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      const token = await getToken({ template: 'driver_app_token' });
      
      const payload: PushNotificationPayload = {
        to: driverPushToken,
        title,
        body,
        data: {
          type: 'system',
          ...data,
        },
        sound: 'default',
        priority: 'normal',
      };

      const response = await fetch(`${this.baseURL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('✅ System notification sent successfully');
        return true;
      } else {
        console.error('❌ Failed to send system notification:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending system notification:', error);
      return false;
    }
  }

  /**
   * Unregister driver's push token
   */
  public async unregisterPushToken(pushToken: string): Promise<boolean> {
    try {
      const token = await getToken({ template: 'driver_app_token' });
      
      const response = await fetch(`${this.baseURL}/api/drivers/push-token`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
        body: JSON.stringify({
          pushToken,
        }),
      });

      if (response.ok) {
        console.log('✅ Push token unregistered successfully');
        return true;
      } else {
        console.error('❌ Failed to unregister push token:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error unregistering push token:', error);
      return false;
    }
  }
}

export default PushNotificationAPI;
