import { useAuth } from '@clerk/clerk-expo';

export interface CompleteRideResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

class RideService {
  private baseUrl = 'https://bike-taxi-production.up.railway.app';

  async completeRide(rideId: string, token?: string): Promise<CompleteRideResponse> {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      if (!rideId) {
        throw new Error('Ride ID is required');
      }

      console.log('🚀 Completing ride via API...');
      console.log('📍 Endpoint:', `${this.baseUrl}/api/rides/${rideId}/complete`);
      console.log('🕐 API call timestamp:', new Date().toISOString());
      console.log('🆔 Ride ID:', rideId);

      const response = await fetch(`${this.baseUrl}/api/rides/${rideId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
      });

      console.log('📡 API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error Response:', errorData);
        console.error('❌ API Status:', response.status);
        console.error('❌ API Status Text:', response.statusText);
        throw new Error(`API request failed: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Ride completed successfully via API:', data);

      return {
        success: true,
        data: data,
        message: 'Ride completed successfully'
      };
    } catch (error) {
      console.error('❌ Error completing ride via API:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to complete ride'
      };
    }
  }
}

export const rideService = new RideService();
export default rideService; 