import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing, Image, ScrollView, Linking, Alert, Modal, Pressable, PanResponder, TextInput, Vibration, Platform } from 'react-native';
import MapView, { Marker, Polyline as MapPolyline, MapViewProps } from 'react-native-maps';
import { MaterialIcons, Ionicons, FontAwesome, Entypo, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import RideRequestScreen, { RideRequest, stopAllNotificationSounds } from '../../components/RideRequestScreen';
import CancelRideModal from '../../components/CancelRideModal';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Polyline from '@mapbox/polyline';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useAssignUserType } from '../../utils/helpers';
import { useOnlineStatus } from '../../store/OnlineStatusContext';
import socketManager from '../../utils/socket';
import * as Location from 'expo-location';
import { useRideHistory } from '../../store/RideHistoryContext';
import { useUserFromJWT } from '../../utils/jwtDecoder';
import { RideRequest as BackendRideRequest } from '../../store/OnlineStatusContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useLocationStore } from '../../store/useLocationStore';

import { logJWTDetails } from '../../utils/jwtDecoder';
import { formatRidePrice, getRidePrice } from '../../utils/priceUtils';
import { Colors } from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePushNotifications } from '../../contexts/PushNotificationContext';
import { useRideNotifications } from '../../hooks/useRideNotifications';

const { width, height } = Dimensions.get('window');

// Add at the top, after imports
function goToHome(navigation: any) {
  navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
}

function SOSModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: Colors.surface, borderRadius: 24, padding: 28, alignItems: 'center', width: 320, elevation: 12 }}>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#222', textAlign: 'center', flex: 1 }}>Call</Text>
            <Pressable onPress={onClose} style={{ marginLeft: 10 }}>
              <Ionicons name="close-circle" size={32} color="#222" />
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 10 }}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => Linking.openURL('tel:108')}
            >
              <View style={{ backgroundColor: Colors.modernYellow, borderRadius: 50, width: 90, height: 90, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <FontAwesome5 name="ambulance" size={48} color="#fff" />
              </View>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>108</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => Linking.openURL('tel:100')}
            >
              <View style={{ backgroundColor: Colors.modernYellow, borderRadius: 50, width: 90, height: 90, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <FontAwesome5 name="user-shield" size={48} color="#fff" />
              </View>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>100</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Helper: Geocode address to lat/lng
async function geocodeAddress(address: string, apiKey: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    // Log the response for debugging
    console.log('Geocoding response:', data);
    
    if (data.status === 'REQUEST_DENIED') {
      console.error('Google Maps API key error:', data.error_message);
      throw new Error('API key error: ' + data.error_message);
    }
    
    if (data.status === 'OVER_QUERY_LIMIT') {
      console.error('Google Maps API quota exceeded');
      throw new Error('API quota exceeded');
    }
    
    if (data.results && data.results[0]) {
      return data.results[0].geometry.location;
    }
    
    console.error('No geocoding results for address:', address);
    throw new Error('No geocoding results found');
  } catch (error) {
    console.error('Geocoding error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error('Geocoding failed: ' + errorMessage);
  }
}

// Helper: Fetch directions and decode polyline
async function fetchRoute(from: {lat: number, lng: number}, to: {lat: number, lng: number}, apiKey: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    // Log the response for debugging
    console.log('Directions API response:', data);
    
    if (data.status === 'REQUEST_DENIED') {
      console.error('Google Maps API key error:', data.error_message);
      throw new Error('API key error: ' + data.error_message);
    }
    
    if (data.status === 'OVER_QUERY_LIMIT') {
      console.error('Google Maps API quota exceeded');
      throw new Error('API quota exceeded');
    }
    
    if (data.routes && data.routes[0]) {
      const points = Polyline.decode(data.routes[0].overview_polyline.points);
      const polyline = points.map(([latitude, longitude]: [number, number]) => ({ latitude, longitude }));
      const leg = data.routes[0].legs[0];
      const distance = leg?.distance?.text || '';
      const duration = leg?.duration?.text || '';
      return { polyline, distance, duration };
    }
    
    console.error('No routes found');
    throw new Error('No routes found');
  } catch (error) {
    console.error('Directions fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error('Directions fetch failed: ' + errorMessage);
  }
}

// Add a fallback for when geocoding fails
const GOOGLE_MAPS_API_KEY = 'AIzaSyDHN3SH_ODlqnHcU9Blvv2pLpnDNkg03lU';

// Add a fallback function for when geocoding fails
const getFallbackCoordinates = (address: string) => {
  // Return default coordinates for Hyderabad if geocoding fails
  return { lat: 17.4375, lng: 78.4483 };
};

const MenuModal = ({ visible, onClose, onNavigate, halfScreen, onLogout }: { visible: boolean; onClose: () => void; onNavigate: (screen: string) => void; halfScreen?: boolean; onLogout: () => void }) => {
  const { user } = useUser();
  const { t } = useLanguage();
  
  // Get driver's full name
  const driverName = user?.fullName || user?.firstName || 'Driver';
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <Animated.View style={{
          backgroundColor: '#fff',
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          width: Math.round(width * 0.8),
          height: '100%',
          elevation: 16,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
        }}>
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222' }}>{t('home.menu')}</Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={{ 
                backgroundColor: '#f5f5f5', 
                borderRadius: 16, 
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Driver Profile Card */}
          <View style={{
            margin: 20,
            backgroundColor: Colors.sandLight,
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: Colors.modernYellow,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Ionicons name="person" size={28} color="#fff" />
            </View>
            
            <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 4 }}>
              {driverName}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
              {t('home.professionalDriver')}
            </Text>
          </View>

          {/* Menu Items */}
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                marginBottom: 4,
                backgroundColor: Colors.modernYellow + '08'
              }} 
              onPress={() => { onNavigate('Home'); onClose(); }}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: Colors.modernYellow,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="home" size={18} color="#fff" />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#222', flex: 1 }}>{t('home.home')}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.modernYellow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                marginBottom: 4
              }} 
              onPress={() => { onNavigate('Refer'); onClose(); }}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: Colors.modernYellow,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="gift" size={18} color="#fff" />
          </View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#222', flex: 1 }}>{t('home.referAndEarn')}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.modernYellow} />
          </TouchableOpacity>

            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                marginBottom: 4
              }} 
              onPress={() => { 
            console.log('🚀 Ride History button clicked - navigating to RideHistory screen');
            onNavigate('RideHistory'); 
            onClose(); 
              }}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: Colors.modernYellow,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="time" size={18} color="#fff" />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#222', flex: 1 }}>{t('home.rideHistory')}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.modernYellow} />
          </TouchableOpacity>

            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                marginBottom: 4
              }} 
              onPress={() => { onNavigate('Wallet'); onClose(); }}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: Colors.modernYellow,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="wallet" size={18} color="#fff" />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#222', flex: 1 }}>{t('home.wallet')}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.modernYellow} />
          </TouchableOpacity>

            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                marginBottom: 4
              }} 
              onPress={() => { onNavigate('Settings'); onClose(); }}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: Colors.modernYellow,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="settings" size={18} color="#fff" />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#222', flex: 1 }}>{t('home.settings')}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.modernYellow} />
          </TouchableOpacity>

            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                marginBottom: 4
              }} 
              onPress={() => { onNavigate('HelpSupport'); onClose(); }}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: Colors.modernYellow,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="help-circle" size={18} color="#fff" />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#222', flex: 1 }}>{t('home.support')}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.modernYellow} />
          </TouchableOpacity>
          </ScrollView>

          {/* Logout Section */}
          <View style={{ 
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderTopWidth: 1, 
            borderTopColor: '#f0f0f0',
          }}>
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: '#FF3B30',
                justifyContent: 'center',
                shadowColor: '#FF3B30',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
              }} 
              onPress={onLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#fff' }}>{t('home.logout')}</Text>
          </TouchableOpacity>

            <Text style={{ 
              fontSize: 11, 
              color: Colors.textSecondary, 
              marginTop: 12,
              textAlign: 'center'
            }}>
              {t('home.appVersion')}
            </Text>
          </View>
        </Animated.View>
        
        {/* Overlay to close menu */}
        <TouchableOpacity 
          style={{ 
            position: 'absolute',
            top: 0,
            left: Math.round(width * 0.8),
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent'
          }} 
          onPress={onClose} 
          activeOpacity={1} 
        />
      </View>
    </Modal>
  );
};

async function updateDriverStatusOnBackend({
  clerkDriverId,
  latitude,
  longitude,
  isOnline,
  token,
}: {
  clerkDriverId: string;
  latitude: number;
  longitude: number;
  isOnline: boolean;
  token: string;
}) {
  try {
    const response = await fetch(
      `https://bike-taxi-production.up.railway.app/api/drivers/me/location`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          isOnline,
        }),
      }
    );
    const data = await response.json().catch(() => null);
    console.log('[updateDriverStatusOnBackend] Response:', response.status, data);
    return response.ok;
  } catch (err) {
    console.error('[updateDriverStatusOnBackend] Error:', err);
    return false;
  }
}



export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const { getToken, signOut } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const { getUserInfo } = useUserFromJWT();
  const { t } = useLanguage();
  const { isInitialized: pushNotificationsInitialized } = usePushNotifications();
  const { sendRideRequestNotification, sendSurgeNotification, scheduleSurgeNotifications } = useRideNotifications();
  const { 
    isOnline, 
    setIsOnline, 
    isSocketConnected, 
    currentRideRequests: contextRideRequests, 
    acceptedRideDetails,
    acceptRide, 
    rejectRide,
    sendLocationUpdate,
    sendRideStatusUpdate,
    sendDriverStatus,
    completeRide,
    resetDriverStatus,
    connectionStatus,
    driverId,
    userType
  } = useOnlineStatus();
  const [isSOSVisible, setSOSVisible] = useState(false);
  const [showOfflineScreen, setShowOfflineScreen] = useState(false);
  const swipeX = useRef(new Animated.Value(0)).current;
  const offlineSwipeX = useRef(new Animated.Value(0)).current;
  const SWIPE_WIDTH = width - 48;
  const SWIPE_THRESHOLD = SWIPE_WIDTH * 0.6;
  const lastHaptic = useRef(Date.now());
  const [rideRequest, setRideRequest] = useState<RideRequest | null>(null);
  const sosAnim = useRef(new Animated.Value(1)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [safetyModalVisible, setSafetyModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [currentRideToCancel, setCurrentRideToCancel] = useState<RideRequest | null>(null);
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const [isSwiping, setIsSwiping] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapView>(null); // Typed ref for MapView
  const [isLocating, setIsLocating] = useState(false);
  const { addRide } = useRideHistory();
  const [currentRideRequests, setCurrentRideRequests] = useState<BackendRideRequest[]>([]); // local mirror if needed
  const [driverCreated, setDriverCreated] = useState(false); // Track if API was called
  const driverCreationStarted = useRef(false);

  // Swipe gesture state - REMOVED (no more map swiping)

  // Function to handle status update on swipe - REMOVED (no more map swiping)

  // Function to update driver online status on backend
  const updateDriverOnlineStatusOnBackend = async (token: string) => {
    try {
      console.log('📡 Calling /api/drivers/me/status endpoint for ONLINE...');
      
      const response = await fetch('https://bike-taxi-production.up.railway.app/api/drivers/me/status', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
        body: JSON.stringify({
          status: 'ONLINE'
        }),
      });

      const responseText = await response.text();
      let data = null;
      
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (jsonErr) {
          console.error('❌ Failed to parse response as JSON:', jsonErr);
        }
      }

      if (response.ok) {
        console.log('✅ Online status update successful!');
        console.log('📊 Response data:', data);
        return true;
      } else if (response.status === 403) {
        console.error('❌ 403 Forbidden - JWT userType issue detected for online status');
        console.error('📊 Response status:', response.status);
        console.error('📊 Response data:', data);
        
        // Try to regenerate JWT and retry once
        console.log('🔄 Attempting JWT regeneration and retry for online status...');
        try {
          const retryToken = await getToken({ template: 'driver_app_token', skipCache: true });
          
          const retryResponse = await fetch('https://bike-taxi-production.up.railway.app/api/drivers/me/status', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${retryToken}`,
              'Content-Type': 'application/json',
              'X-App-Version': '1.0.0',
              'X-Platform': 'ReactNative',
              'X-Environment': 'development',
            },
            body: JSON.stringify({
              status: 'ONLINE'
            }),
          });
          
          if (retryResponse.ok) {
            console.log('✅ Online status update successful after retry!');
            return true;
          } else {
            console.error('❌ Online status update failed even after retry');
            return false;
          }
        } catch (retryError) {
          console.error('❌ Online status retry failed:', retryError);
          return false;
        }
      } else {
        console.error('❌ Online status update failed');
        console.error('📊 Response status:', response.status);
        console.error('📊 Response data:', data);
        return false;
      }
    } catch (error) {
      console.error('❌ Error during online status update:', error);
      return false;
    }
  };

  const handleOfflineStatusUpdate = async () => {
    try {
      console.log('📡 Calling /api/drivers/me/status endpoint for OFFLINE...');
      
      // Force JWT regeneration to ensure we have the latest userType claim
      console.log('🔄 Forcing JWT regeneration before offline status update...');
      const customToken = await getToken({ template: 'driver_app_token', skipCache: true });
      if (!customToken) {
        console.error('❌ No custom Clerk JWT found!');
        return;
      }

      // Log JWT details for debugging
      await logJWTDetails(getToken, 'Offline Status Update - JWT Analysis');

      const response = await fetch('https://bike-taxi-production.up.railway.app/api/drivers/me/status', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${customToken}`,
          'Content-Type': 'application/json',
          'X-App-Version': '1.0.0',
          'X-Platform': 'ReactNative',
          'X-Environment': 'development',
        },
        body: JSON.stringify({
          status: 'OFFLINE'
        }),
      });

      const responseText = await response.text();
      let data = null;
      
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (jsonErr) {
          console.error('❌ Failed to parse response as JSON:', jsonErr);
        }
      }

      if (response.ok) {
        console.log('✅ Offline status update successful!');
        console.log('📊 Response data:', data);
      } else if (response.status === 403) {
        console.error('❌ 403 Forbidden - JWT userType issue detected for offline status');
        console.error('📊 Response status:', response.status);
        console.error('📊 Response data:', data);
        
        // Try to regenerate JWT and retry once
        console.log('🔄 Attempting JWT regeneration and retry for offline status...');
        try {
          const retryToken = await getToken({ template: 'driver_app_token', skipCache: true });
          await logJWTDetails(getToken, 'Offline Status Update Retry - JWT Analysis');
          
          const retryResponse = await fetch('https://bike-taxi-production.up.railway.app/api/drivers/me/status', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${retryToken}`,
              'Content-Type': 'application/json',
              'X-App-Version': '1.0.0',
              'X-Platform': 'ReactNative',
              'X-Environment': 'development',
            },
            body: JSON.stringify({
              status: 'OFFLINE'
            }),
          });
          
          if (retryResponse.ok) {
            console.log('✅ Offline status update successful after retry!');
          } else {
            console.error('❌ Offline status update failed even after retry');
          }
        } catch (retryError) {
          console.error('❌ Offline status retry failed:', retryError);
        }
      } else {
        console.error('❌ Offline status update failed');
        console.error('📊 Response status:', response.status);
        console.error('📊 Response data:', data);
      }
    } catch (error) {
      console.error('❌ Error during offline status update:', error);
    }
  };

  // Get the current ride request (first one in the array)
  const currentRideRequest = contextRideRequests.length > 0 ? contextRideRequests[0] : null;

  // Helper functions for driver status display
  const getDriverStatusColor = () => {
    if (!isSocketConnected) return '#FF3B30'; // Red for disconnected
    if (acceptedRideDetails) return '#FF9500'; // Orange for busy/on ride
    if (contextRideRequests.length > 0) return Colors.modernYellow; // Yellow for considering ride
    return Colors.modernYellow; // Yellow for available
  };

  const getDriverStatusText = () => {
    if (!isSocketConnected) return 'OFFLINE';
    if (acceptedRideDetails) return 'ON RIDE';
    if (contextRideRequests.length > 0) return 'CONSIDERING';
    return 'AVAILABLE';
  };

  // Debug connection status
  useEffect(() => {
    console.log('🔍 HomeScreen Connection Status Debug:');
    console.log('- isOnline:', isOnline);
    console.log('- isSocketConnected:', isSocketConnected);
    console.log('- connectionStatus:', connectionStatus);
    console.log('- driverId:', driverId);
    console.log('- userType:', userType);
    console.log('- Driver Status Color:', getDriverStatusColor());
    console.log('- Driver Status Text:', getDriverStatusText());
  }, [isOnline, isSocketConnected, connectionStatus, driverId, userType]);

  useEffect(() => {
    if (!isLoaded) return;
    // Check for required documents - removed navigation reset to prevent errors
    const meta = user?.unsafeMetadata || {};
    if (!meta.bikeFrontPhoto || !meta.bikeBackPhoto || !meta.licensePhoto || !meta.rcPhoto || !meta.aadharPhoto || !meta.panPhoto) {
      console.log('Missing documents detected, but navigation reset removed to prevent errors');
    }
  }, [isLoaded, user]);

  useAssignUserType('driver');

  // Helper function to force JWT regeneration
  const forceJWTRegeneration = async () => {
    try {
      console.log('🔄 Forcing JWT regeneration...');
      const updatedToken = await getToken({ template: 'driver_app_token', skipCache: true });
      console.log('✅ JWT regenerated successfully');
      
      // Verify the updated JWT has correct userType
      await logJWTDetails(getToken, 'Forced JWT Regeneration');
      
      return updatedToken;
    } catch (error) {
      console.error('❌ JWT regeneration failed:', error);
      return null;
    }
  };

  // PanResponder for swipe to go online gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isOnline,
      onMoveShouldSetPanResponder: (_, gesture) => !isOnline && Math.abs(gesture.dx) > 5,
      onPanResponderGrant: () => {
        // Softer initial feedback (no continuous vibration)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      },
      onPanResponderMove: (e, gestureState) => {
        if (isOnline) return;
        let newX = gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > SWIPE_WIDTH - 56) newX = SWIPE_WIDTH - 56;
        swipeX.setValue(newX);
        // Throttle haptic feedback
        const now = Date.now();
        if (now - lastHaptic.current > 250) {
          Haptics.selectionAsync().catch(() => {});
          lastHaptic.current = now;
        }
      },
      onPanResponderRelease: async (e, gestureState) => {
        if (Platform.OS === 'android') {
          Vibration.cancel();
        }
        if (isOnline) return;
        if (gestureState.dx > SWIPE_THRESHOLD) {
          Animated.timing(swipeX, {
            toValue: SWIPE_WIDTH - 56,
            duration: 120,
            useNativeDriver: false,
          }).start(async () => {
            setIsOnline(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Update driver status to ONLINE on backend
            if (user?.unsafeMetadata?.type === 'driver') {
              try {
                const onlineToken = await getToken({ template: 'driver_app_token' });
                console.log('Custom Clerk JWT (online):', onlineToken);
                
                if (onlineToken) {
                  // Call the status endpoint to set driver as ONLINE
                  const statusSuccess = await updateDriverOnlineStatusOnBackend(onlineToken);
                  
                  if (statusSuccess) {
                    console.log('✅ Driver status updated to ONLINE successfully');
                  } else {
                    console.error('❌ Failed to update driver status to ONLINE');
                  }
                  
                  // Also update location for completeness
                  let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                  const clerkDriverId = user?.id || (await AsyncStorage.getItem('clerkDriverId'));
                  if (location && clerkDriverId) {
                    await updateDriverStatusOnBackend({
                      clerkDriverId,
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                      isOnline: true,
                      token: onlineToken,
                    });
                  }
                }
              } catch (err) {
                console.error('Failed to update driver status on go online:', err);
              }
            }
          });
        } else {
          Animated.spring(swipeX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        if (Platform.OS === 'android') {
          Vibration.cancel();
        }
        Animated.spring(swipeX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // PanResponder for swipe to go offline gesture
  const offlineSwipeWidth = width * 0.9; // 90% width to match modal
  const offlineSwipeThreshold = offlineSwipeWidth * 0.6;
  
  // Create PanResponder function that always uses current state values
  const createOfflinePanResponder = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return isOnline && showOfflineScreen;
      },
      onMoveShouldSetPanResponder: (_, gesture) => {
        return isOnline && showOfflineScreen && Math.abs(gesture.dx) > 5;
      },
      onPanResponderGrant: () => {
        // Softer initial feedback (no continuous vibration)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      },
      onPanResponderMove: (e, gestureState) => {
        if (!isOnline || !showOfflineScreen) return;
        let newX = gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > offlineSwipeWidth - 72) newX = offlineSwipeWidth - 72;
        offlineSwipeX.setValue(newX);
        // Throttle haptic feedback
        const now = Date.now();
        if (now - lastHaptic.current > 250) {
          Haptics.selectionAsync().catch(() => {});
          lastHaptic.current = now;
        }
      },
      onPanResponderRelease: async (e, gestureState) => {
        if (Platform.OS === 'android') {
          Vibration.cancel();
        }
        if (!isOnline || !showOfflineScreen) return;
        if (gestureState.dx > offlineSwipeThreshold) {
          Animated.timing(offlineSwipeX, {
            toValue: offlineSwipeWidth - 72,
            duration: 120,
            useNativeDriver: false,
          }).start(async () => {
            setIsOnline(false);
            setShowOfflineScreen(false);
            // Reset the main swipe bar to its default position
            Animated.spring(swipeX, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            goToHome(navigation);
            
            // Call status endpoint to update driver status to OFFLINE
            try {
              console.log('🔄 Swipe to offline - calling status endpoint...');
              await handleOfflineStatusUpdate();
            } catch (error) {
              console.error('❌ Error updating status on swipe to offline:', error);
            }
            
            // Update backend with offline status
            try {
              const offlineToken = await getToken({ template: 'driver_app_token' });
              let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
              const clerkDriverId = user?.id || (await AsyncStorage.getItem('clerkDriverId'));
              if (location && offlineToken && clerkDriverId) {
                await updateDriverStatusOnBackend({
                  clerkDriverId,
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  isOnline: false,
                  token: offlineToken,
                });
              }
            } catch (err) {
              console.error('Failed to update backend on go offline:', err);
            }
          });
        } else {
          Animated.spring(offlineSwipeX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        if (Platform.OS === 'android') {
          Vibration.cancel();
        }
        Animated.spring(offlineSwipeX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    });
  };
  
  // Create PanResponder instance
  const offlinePanResponder = createOfflinePanResponder();

  const resetOnline = () => {
    setIsOnline(false);
    Animated.spring(swipeX, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  // Add a ref to track if goOffline is already being processed
  const isGoingOffline = useRef(false);

  const goOffline = async () => {
    // Prevent multiple rapid calls
    if (isGoingOffline.current) {
      console.log('🔄 goOffline already in progress, skipping...');
      return;
    }

    isGoingOffline.current = true;
    console.log('🔄 goOffline function called - isOnline:', isOnline, 'pushNotificationsInitialized:', pushNotificationsInitialized);
    
    setShowOfflineScreen(true);
    Animated.spring(offlineSwipeX, {
      toValue: 0,
      useNativeDriver: false,
    }).start();

    // Offline notification code removed as requested

    // Reset the flag after a delay to allow for normal operation
    setTimeout(() => {
      isGoingOffline.current = false;
    }, 2000);
  };

  const cancelOffline = () => {
    setShowOfflineScreen(false);
    Animated.spring(offlineSwipeX, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  function mapBackendRideRequestToUI(backendRide: BackendRideRequest) {
    return {
      id: backendRide.rideId,
              price: formatRidePrice(backendRide.price),
      type: backendRide.rideType || 'Mini',
      tag: 'Hyderabad',
      rating: '4.95',
      verified: true,
      pickup: backendRide.pickup.address || backendRide.pickup.name || 'Pickup Location',
      pickupAddress: backendRide.pickup.address || backendRide.pickup.name || 'Pickup Location',
      dropoff: backendRide.drop.address || backendRide.drop.name || 'Drop Location',
      dropoffAddress: backendRide.drop.address || backendRide.drop.name || 'Drop Location',
      pickupDetails: backendRide.pickup,
      dropoffDetails: backendRide.drop,
    };
  }

  const handleAcceptRide = async (ride: BackendRideRequest) => {
    acceptRide(ride);
    
    // Send ride request notification
    if (pushNotificationsInitialized) {
      try {
        await sendRideRequestNotification({
          rideId: ride.rideId,
          pickupLocation: ride.pickup.address || ride.pickup.name,
          dropoffLocation: ride.drop.address || ride.drop.name,
          fare: ride.price,
        });
        console.log('📱 Ride request notification sent');
      } catch (error) {
        console.error('❌ Failed to send ride request notification:', error);
      }
    }
  };

  const handleRejectRide = (ride: BackendRideRequest) => {
    rejectRide(ride);
  };

  const handleCancelRide = (ride: RideRequest) => {
    setCurrentRideToCancel(ride);
    setCancelModalVisible(true);
  };

  const handleConfirmCancelRide = (reason: string) => {
    if (currentRideToCancel) {
      // Get the current ride details from acceptedRideDetails or rideRequest
      const rideToCancel = acceptedRideDetails || currentRideRequest;
      
      if (rideToCancel) {
        // Cancel ride via socket
        socketManager.cancelRide({
          rideId: rideToCancel.rideId,
          driverId: user?.id || 'driver123',
          reason: reason
        });
        
        console.log('🚫 Driver cancelling ride:', {
          rideId: rideToCancel.rideId,
          reason: reason
        });
      }

      // Add to ride history with cancellation reason
      addRide({
        id: currentRideToCancel.id + '-' + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        from: currentRideToCancel.pickupAddress || '',
        to: currentRideToCancel.dropoffAddress || '',
        driver: user?.fullName || 'You',
        fare: getRidePrice(currentRideToCancel.price),
        distance: 0,
        duration: 0,
        status: 'cancelled',
        cancellationReason: reason,
      });

      // Close modals and reset state
      setCancelModalVisible(false);
      setCurrentRideToCancel(null);
      
      // Note: Navigation will be handled by the driver_cancellation_success event
      // in the OnlineStatusContext
    }
  };

  const handleRideCompleted = async (rideId: string) => {
    // Complete the ride on the server
    completeRide(rideId);
    
    // Reset driver status when ride is completed
    resetDriverStatus();
    console.log('✅ Ride completed, driver status reset to available');

    // Ride completed notification code removed as requested
  };

  const isRideActive = !!(rideRequest);

  // Play haptic feedback on ride request
  useEffect(() => {
    if (rideRequest) {
      // Play haptic feedback immediately
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [rideRequest]);

  // Type guard for address object
  function hasAddress(obj: any): obj is { address: string } {
    return obj && typeof obj === 'object' && typeof obj.address === 'string';
  }

  // Handle incoming ride requests from socket
  useEffect(() => {
    let isMounted = true;
    async function setRideWithRoute() {
      if (currentRideRequest && isOnline) {
        // Log pickup and dropoff details for debugging
        console.log('✅ New ride request received:', currentRideRequest.rideId);
        console.log('Pickup details received:', currentRideRequest.pickup);
        console.log('Dropoff details received:', currentRideRequest.drop);
        // Get coordinates
        const pickupCoords = currentRideRequest.pickup;
        const dropoffCoords = currentRideRequest.drop;
        let pickup = '...';
        let dropoff = '...';
        try {
          if (pickupCoords && dropoffCoords && pickupCoords.latitude && pickupCoords.longitude && dropoffCoords.latitude && dropoffCoords.longitude) {
            const route = await fetchRoute(
              { lat: pickupCoords.latitude, lng: pickupCoords.longitude },
              { lat: dropoffCoords.latitude, lng: dropoffCoords.longitude },
              GOOGLE_MAPS_API_KEY
            );
            pickup = `${route.duration} (${route.distance}) away`;
            dropoff = `${route.duration} (${route.distance}) trip`;
          } else {
            pickup = currentRideRequest.pickup.address || currentRideRequest.pickup.name || 'Pickup Location';
            dropoff = currentRideRequest.drop.address || currentRideRequest.drop.name || 'Drop Location';
          }
        } catch (e) {
          console.error('Failed to fetch real route info:', e);
          pickup = currentRideRequest.pickup.address || currentRideRequest.pickup.name || 'Pickup Location';
          dropoff = currentRideRequest.drop.address || currentRideRequest.drop.name || 'Drop Location';
        }
        // Convert socket ride request to local format
        const localRideRequest: RideRequest = {
          id: currentRideRequest.rideId,
          price: formatRidePrice(currentRideRequest.price),
          type: currentRideRequest.rideType || 'Mini',
          tag: 'Hyderabad',
          rating: '4.95',
          verified: true,
          pickup,
          pickupAddress: currentRideRequest.pickup.address || currentRideRequest.pickup.name || 'Pickup Location',
          dropoff,
          dropoffAddress: currentRideRequest.drop.address || currentRideRequest.drop.name || 'Drop Location',
          // Store detailed location information for navigation
          pickupDetails: currentRideRequest.pickup,
          dropoffDetails: currentRideRequest.drop,
        };
        // Log what will be used for the map
        console.log('pickupDetails for map:', localRideRequest.pickupDetails);
        console.log('dropoffDetails for map:', localRideRequest.dropoffDetails);
        if (isMounted) {
          setRideRequest(localRideRequest);
          // Play haptic feedback for new ride request
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          // Send push notification for new ride request
          if (pushNotificationsInitialized) {
            try {
              console.log('🔔 Attempting to send ride request notification...');
              console.log('🔔 Push notifications initialized:', pushNotificationsInitialized);
              
              // Extract distance from route info
              let distance = 'Unknown distance';
              let duration = 'Unknown time';
              if (pickup.includes('(') && pickup.includes(')')) {
                const distanceMatch = pickup.match(/\(([^)]+)\)/);
                const durationMatch = pickup.match(/^([^(]+)/);
                if (distanceMatch) distance = distanceMatch[1];
                if (durationMatch) duration = durationMatch[1].trim();
              }
              
              const notificationData = {
                rideId: currentRideRequest.rideId,
                pickupLocation: currentRideRequest.pickup.address || currentRideRequest.pickup.name,
                dropoffLocation: currentRideRequest.drop.address || currentRideRequest.drop.name,
                fare: currentRideRequest.price,
                estimatedTime: duration,
                distance: distance,
              };
              
              console.log('🔔 Notification data:', notificationData);
              
              await sendRideRequestNotification(notificationData);
              console.log('📱 New ride request notification sent with distance and price');
            } catch (error) {
              console.error('❌ Failed to send new ride request notification:', error);
            }
          } else {
            console.log('⚠️ Push notifications not initialized, skipping notification');
          }
        }
      }
    }
    setRideWithRoute();
    return () => { isMounted = false; };
  }, [currentRideRequest, isOnline]);





  // Add logout handler
  const handleLogout = async () => {
    await signOut();
    goToHome(navigation);
  };



  useEffect(() => {
    if (acceptedRideDetails) {
      // Convert acceptedRideDetails to local RideRequest format
      const localRideRequest: RideRequest = {
        id: acceptedRideDetails.rideId,
        price: formatRidePrice(acceptedRideDetails.price),
        type: acceptedRideDetails.rideType || 'Mini',
        tag: 'Hyderabad',
        rating: '4.95',
        verified: true,
        pickup: '5 min (2.1 km) away',
        pickupAddress: acceptedRideDetails.pickup.address || acceptedRideDetails.pickup.name || 'Pickup Location',
        dropoff: '25 min (12.3 km) trip',
        dropoffAddress: acceptedRideDetails.drop.address || acceptedRideDetails.drop.name || 'Drop Location',
        pickupDetails: acceptedRideDetails.pickup,
        dropoffDetails: acceptedRideDetails.drop,
      };
      setRideRequest(localRideRequest);
      
      // Navigate to NavigationScreen with the correct ride data including rideId and driverId
      const navigationRide = {
        ...localRideRequest,
        rideId: acceptedRideDetails.rideId,
        driverId: acceptedRideDetails.driverId,
        userId: acceptedRideDetails.userId,
      };
      
      console.log('🚗 Navigating to NavigationScreen with ride data:', navigationRide);
      navigation.navigate('NavigationScreen', { ride: navigationRide });
    }
  }, [acceptedRideDetails, navigation]);

  // Listen for driver cancellation success
  useEffect(() => {
    const socket = socketManager.getSocket();
    if (socket) {
      const handleDriverCancellationSuccess = (data: any) => {
        console.log('✅ Driver cancellation success received in HomeScreen:', data);
        // Navigate to home screen after successful cancellation
        navigation.navigate('Home');
      };

      socket.on('driver_cancellation_success', handleDriverCancellationSuccess);

      return () => {
        socket.off('driver_cancellation_success', handleDriverCancellationSuccess);
      };
    }
  }, [navigation]);

  // Request location permission on mount or when going online
  useEffect(() => {
    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission is required to receive ride requests.');
      }
    }
    requestLocationPermission();
  }, []);

  // Schedule surge notifications when push notifications are initialized
  useEffect(() => {
    if (pushNotificationsInitialized) {
      console.log('📅 Scheduling daily surge notifications...');
      scheduleSurgeNotifications();
    }
  }, [pushNotificationsInitialized, scheduleSurgeNotifications]);

  // Refresh state when screen comes into focus (e.g., after cancellation)
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 HomeScreen focused - refreshing state');
      // Force a refresh of the online status context
      if (isSocketConnected) {
        sendDriverStatus({
          driverId,
          status: 'online'
        });
      }
    }, [isSocketConnected, driverId, sendDriverStatus])
  );

  useEffect(() => {
    // Only run if user is loaded, user exists, and we haven't created the driver yet
    if (!isLoaded || !user || driverCreated || driverCreationStarted.current) return;

    driverCreationStarted.current = true; // Set immediately to block further calls

    const createDriver = async () => {
      console.log('[createDriver] Starting driver creation process...');
      try {
        // Get the custom Clerk JWT token for the driver app
        const customToken = await getToken({ template: 'driver_app_token' });
        console.log('[createDriver] Got custom Clerk JWT (driver_app_token):', customToken);
        if (!customToken) {
          console.error('[createDriver] No custom Clerk JWT found!');
          return;
        }

        // Step 1: Create user record first (like customer app does)
        console.log('[createDriver] Step 1: Creating user record...');
        const userResponse = await fetch('https://bike-taxi-production.up.railway.app/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${customToken}`,
            'Content-Type': 'application/json',
            'X-App-Version': '1.0.0',
            'X-Platform': 'ReactNative',
            'X-Environment': 'development',
          },
        });
        
        if (userResponse.ok) {
          console.log('[createDriver] ✅ User record created/retrieved successfully');
        } else {
          console.error('[createDriver] ❌ Failed to create user record:', userResponse.status);
        }

        // Step 2: Create driver record
        console.log('[createDriver] Step 2: Creating driver record...');
        
        // Check if driver already exists first
        console.log('[createDriver] Checking if driver already exists...');
        const driverCheckResponse = await fetch(`https://bike-taxi-production.up.railway.app/api/drivers/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${customToken}`,
            'Content-Type': 'application/json',
            'X-App-Version': '1.0.0',
            'X-Platform': 'ReactNative',
            'X-Environment': 'development',
          },
        });
        
        if (driverCheckResponse.ok) {
          console.log('[createDriver] ✅ Driver already exists, skipping creation');
          setDriverCreated(true);
          return;
        } else if (driverCheckResponse.status === 404) {
          console.log('[createDriver] Driver not found, proceeding with creation...');
        } else {
          console.log('[createDriver] Driver check response:', driverCheckResponse.status);
        }

        // Prepare form data (send custom JWT in token field)
        const formData = new FormData();
        formData.append('clerkUserId', user.id); // Use clerkUserId instead of token
        formData.append('firstName', user.firstName || '');
        formData.append('lastName', user.lastName || '');
        
        // Fix phone number format - remove country code to match backend validation
        let phoneNumber = user.phoneNumbers?.[0]?.phoneNumber || '';
        if (phoneNumber.startsWith('+91')) {
          phoneNumber = phoneNumber.substring(3); // Remove +91 prefix
        }
        formData.append('phoneNumber', phoneNumber);
        formData.append('userType', 'driver');
        // Add profileImage and licenseImage if needed
        console.log('[createDriver] FormData prepared (custom JWT, Authorization header will be set):', {
          clerkUserId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: phoneNumber,
          userType: 'driver',
        });
        // Log the phone number being sent for debugging
        console.log('[createDriver] Phone number being sent:', phoneNumber);

        // Send request (Authorization header with custom JWT)
        console.log('[createDriver] Sending POST request to /api/registration/driver with Authorization header...');
        const response = await fetch('https://bike-taxi-production.up.railway.app/api/registration/driver', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${customToken}`,
            // Do NOT set Content-Type for multipart/form-data
          },
          body: formData,
        });
        console.log('[createDriver] Response received. Status:', response.status);

        // Try to read response as text first
        const rawText = await response.text();
        console.log('[createDriver] Raw response text:', rawText);

        let data = null;
        if (rawText) {
          try {
            data = JSON.parse(rawText);
            console.log('[createDriver] Parsed JSON:', data);
          } catch (jsonErr) {
            console.error('[createDriver] Failed to parse response as JSON:', jsonErr);
          }
        } else {
          console.warn('[createDriver] Response body is empty');
        }

        if (response.ok && data?.driverId) {
          console.log('[createDriver] ✅ Driver created successfully!');
          console.log('[createDriver] Driver ID:', data.driverId);
          console.log('[createDriver] Clerk User ID:', data.clerkUserId);
          console.log('[createDriver] Status:', data.status);
          
          // Force JWT regeneration to get updated userType claim
          console.log('[createDriver] 🔄 Forcing JWT regeneration after driver creation...');
          try {
            const updatedToken = await getToken({ template: 'driver_app_token', skipCache: true });
            console.log('[createDriver] ✅ JWT regenerated with updated userType claim');
            
            // Add a small delay to ensure backend has time to update User entity
            console.log('[createDriver] ⏳ Waiting 2 seconds for backend to update User entity...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Verify the updated JWT has correct userType
            await logJWTDetails(getToken, 'Driver Creation - JWT Verification');
          } catch (jwtError) {
            console.error('[createDriver] ⚠️ JWT regeneration failed:', jwtError);
          }
          
          // Save the driver ID to AsyncStorage
          try {
            await AsyncStorage.setItem('driverId', data.driverId);
            await AsyncStorage.setItem('clerkDriverId', data.clerkUserId);
            console.log('[createDriver] Driver ID saved to AsyncStorage:', data.driverId);
            console.log('🚩 clerkDriverId just stored:', data.clerkUserId);
          } catch (e) {
            console.error('[createDriver] Failed to save driver ID to AsyncStorage:', e);
          }
          
          setDriverCreated(true);
        } else if (response.status === 400 && data?.error?.includes('already exists')) {
          console.log('[createDriver] ⚠️ Driver already exists, this is normal');
          console.log('[createDriver] Driver already registered with clerkUserId:', user.id);
          
          // Store the clerkDriverId even when driver already exists
          try {
            await AsyncStorage.setItem('clerkDriverId', user.id);
            console.log('[createDriver] clerkDriverId stored for existing driver:', user.id);
          } catch (e) {
            console.error('[createDriver] Failed to save clerkDriverId to AsyncStorage:', e);
          }
          
          setDriverCreated(true);
        } else {
          console.error('[createDriver] ❌ Failed to create driver');
          console.error('[createDriver] Response status:', response.status);
          console.error('[createDriver] Response data:', data);
        }
      } catch (error) {
        console.error('[createDriver] Error during driver creation:', error);
      }
    };

    createDriver();
  }, [isLoaded, user, driverCreated, getToken]);

  return (
    <Animated.View 
      style={[
        { flex: 1, backgroundColor: Colors.background },
      ]}
    >
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top', 'bottom', 'left', 'right']}>
      {/* StatusBar background fix for edge-to-edge */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: Colors.background, zIndex: 10000 }} />
      <StatusBar barStyle="dark-content" translucent />
      {/* Map */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 17.4375, // Example: Hyderabad
          longitude: 78.4483,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        scrollEnabled={isOnline}
        zoomEnabled={isOnline}
        rotateEnabled={isOnline}
        pitchEnabled={isOnline}
      />
      {/* Overall Offline Overlay */}
      {!isOnline && !isRideActive && !showOfflineScreen && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Offline Icon */}
          <View
            style={{
              backgroundColor: '#B0B3B8',
              borderRadius: 50,
              width: 80,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              shadowColor: '#B0B3B8',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons name="wifi-outline" size={40} color="#222" />
            {/* Diagonal slash overlay */}
            <View
              style={{
                position: 'absolute',
                width: 60,
                height: 6,
                backgroundColor: '#333333',
                borderRadius: 3,
                top: 37,
                left: 10,
                transform: [{ rotate: '-25deg' }],
                opacity: 0.95,
              }}
            />
          </View>
          
          {/* Offline Text */}
          <Text
            style={{
              fontSize: 34,
              fontWeight: '900',
              color: '#222',
              textAlign: 'center',
              textShadowColor: 'rgba(255,255,255,0.7)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 6,
              letterSpacing: 0.5,
              marginTop: 4,
            }}
          >
            You're Offline
          </Text>
        </View>
      )}

      {/* Go Offline Confirmation Modal */}
      <Modal
        visible={showOfflineScreen && isOnline}
        animationType="slide"
        transparent={false}
        onRequestClose={cancelOffline}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: insets.top + 24,
            paddingHorizontal: 24,
          }}
          pointerEvents="box-none"
        >
          {/* Enhanced Default Image and Content */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Top Decorative Element */}
            <View
              style={{
                position: 'absolute',
                top: 60,
                right: 30,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.modernYellow,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.1,
              }}
            >
              <Ionicons name="pause-circle" size={40} color={Colors.text} />
          </View>
            
            <View
              style={{
                position: 'absolute',
                top: 100,
                left: 30,
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: Colors.modernYellow,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.08,
              }}
            >
              <Ionicons name="time" size={30} color={Colors.text} />
            </View>

            {/* Main Illustration Container */}
            <View
              style={{
                width: 240,
                height: 240,
                borderRadius: 120,
                backgroundColor: Colors.sandLight,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 40,
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 12,
                borderWidth: 3,
                borderColor: Colors.modernYellow,
                borderStyle: 'dashed',
              }}
            >
              {/* Central Bike Icon */}
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  backgroundColor: Colors.modernYellow,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: Colors.modernYellow,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Ionicons name="bicycle" size={70} color="#fff" />
              </View>
              
              {/* Offline Status Badge */}
              <View
                style={{
                  position: 'absolute',
                  top: 25,
                  right: 25,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#FF6B6B',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 4,
                  borderColor: '#fff',
                  shadowColor: '#FF6B6B',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Ionicons name="wifi-outline" size={24} color="#fff" />
                <View
                  style={{
                    position: 'absolute',
                    width: 35,
                    height: 4,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    transform: [{ rotate: '-45deg' }],
                  }}
                />
              </View>

              {/* Status Indicator Dots */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: Colors.modernYellow,
                    opacity: 0.6,
                  }}
                />
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: Colors.modernYellow,
                    opacity: 0.4,
                  }}
                />
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: Colors.modernYellow,
                    opacity: 0.2,
                  }}
                />
              </View>
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: Colors.text,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              {t('home.goOffline')}
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                fontSize: 16,
                color: Colors.textSecondary,
                textAlign: 'center',
                marginBottom: 8,
                lineHeight: 24,
              }}
            >
              {t('home.youWontReceiveNewRideRequests')}
            </Text>

            {/* Additional Info */}
            <Text
              style={{
                fontSize: 14,
                color: Colors.textLight,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              {t('home.swipeBarBelowToConfirm')}
            </Text>
          </View>

          {/* Enhanced Swipe to Go Offline Bar */}
          <View
            style={{
              position: 'absolute',
              left: '5%',
              right: '5%',
              bottom: insets.bottom > 0 ? insets.bottom + 16 : 32,
              width: '90%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
            }}
            pointerEvents="box-none"
          >
            <LinearGradient
              colors={[Colors.modernYellow, Colors.modernYellowDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 40,
                paddingVertical: 24,
                paddingHorizontal: 32,
                shadowColor: Colors.modernYellow,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 16,
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
              {...offlinePanResponder.panHandlers}
            >
              {/* Animated Background Pattern */}
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 40,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  opacity: offlineSwipeX.interpolate({
                    inputRange: [0, offlineSwipeWidth - 72],
                    outputRange: [0.1, 0.3],
                    extrapolate: 'clamp',
                  }),
                }}
              />
              
              {/* Enhanced Swipe Handle with Better Visual Feedback */}
              <Animated.View
                style={{
                  position: 'absolute',
                  left: offlineSwipeX,
                  top: 4,
                  bottom: 4,
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: offlineSwipeX.interpolate({
                    inputRange: [0, offlineSwipeWidth - 72],
                    outputRange: ['#1a1a2e', '#000000'],
                    extrapolate: 'clamp',
                  }),
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: offlineSwipeX.interpolate({
                    inputRange: [0, offlineSwipeWidth - 72],
                    outputRange: [0.2, 0.4],
                    extrapolate: 'clamp',
                  }),
                  shadowRadius: offlineSwipeX.interpolate({
                    inputRange: [0, offlineSwipeWidth - 72],
                    outputRange: [12, 16],
                    extrapolate: 'clamp',
                  }),
                  elevation: offlineSwipeX.interpolate({
                    inputRange: [0, offlineSwipeWidth - 72],
                    outputRange: [12, 20],
                    extrapolate: 'clamp',
                  }),
                  zIndex: 2,
                  borderWidth: 3,
                  borderColor: offlineSwipeX.interpolate({
                    inputRange: [0, offlineSwipeWidth - 72],
                    outputRange: ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.6)'],
                    extrapolate: 'clamp',
                  }),
                  transform: [{
                    scale: offlineSwipeX.interpolate({
                      inputRange: [0, offlineSwipeWidth - 72],
                      outputRange: [1, 1.05],
                      extrapolate: 'clamp',
                    })
                  }],
                }}
              >
                <Animated.View
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: 33,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: offlineSwipeX.interpolate({
                      inputRange: [0, offlineSwipeWidth - 72],
                      outputRange: ['#2d3748', '#000000'],
                      extrapolate: 'clamp',
                    }),
                    borderWidth: 2,
                    borderColor: offlineSwipeX.interpolate({
                      inputRange: [0, offlineSwipeWidth - 72],
                      outputRange: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.4)'],
                      extrapolate: 'clamp',
                    }),
                  }}
                >
                  <Animated.View
                    style={{
                      transform: [{
                        rotate: offlineSwipeX.interpolate({
                          inputRange: [0, offlineSwipeWidth - 72],
                          outputRange: ['0deg', '15deg'],
                          extrapolate: 'clamp',
                        })
                      }]
                    }}
                  >
                    <Ionicons 
                      name="arrow-forward" 
                      size={32} 
                      color="#fff" 
                    />
                  </Animated.View>
                </Animated.View>
              </Animated.View>
              
              {/* Enhanced Text with Icon and Better Typography */}
              <View style={{ marginLeft: 90, flexDirection: 'row', alignItems: 'center', zIndex: 1 }}>
                <Animated.View
                  style={{
                    opacity: offlineSwipeX.interpolate({
                      inputRange: [0, offlineSwipeWidth - 72],
                      outputRange: [1, 0.7],
                      extrapolate: 'clamp',
                    }),
                    transform: [{
                      scale: offlineSwipeX.interpolate({
                        inputRange: [0, offlineSwipeWidth - 72],
                        outputRange: [1, 0.95],
                        extrapolate: 'clamp',
                      })
                    }]
                  }}
                >
                  <Ionicons name="power" size={20} color="#fff" style={{ marginRight: 8 }} />
                </Animated.View>
                <Animated.Text
                  style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: 18,
                    letterSpacing: 0.8,
                    textShadowColor: 'rgba(0, 0, 0, 0.4)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 3,
                    opacity: offlineSwipeX.interpolate({
                      inputRange: [0, offlineSwipeWidth - 72],
                      outputRange: [1, 0.8],
                      extrapolate: 'clamp',
                    }),
                  }}
                >
                  {t('home.swipeToGoOffline')}
                </Animated.Text>
              </View>
              
              {/* Enhanced Progress Indicator */}
              <Animated.View
                style={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: [{ translateY: -3 }],
                  width: 60,
                  height: 6,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <Animated.View
                  style={{
                    width: offlineSwipeX.interpolate({
                      inputRange: [0, offlineSwipeWidth - 72],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    }),
                    height: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    shadowColor: '#fff',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                  }}
                />
              </Animated.View>
              
              {/* Success Checkmark (appears when swipe is complete) */}
              <Animated.View
                style={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: [
                    { translateY: -16 },
                    {
                      scale: offlineSwipeX.interpolate({
                        inputRange: [offlineSwipeWidth - 100, offlineSwipeWidth - 72],
                        outputRange: [0.5, 1],
                        extrapolate: 'clamp',
                      })
                    }
                  ],
                  opacity: offlineSwipeX.interpolate({
                    inputRange: [offlineSwipeWidth - 100, offlineSwipeWidth - 72],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                }}
              >
                <View style={{
                  backgroundColor: '#22c55e',
                  borderRadius: 20,
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#22c55e',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
              </Animated.View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Top Bar Overlay */}
      <Animated.View
        style={[
          styles.topBar,
          {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 10,
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderRadius: 18,
            margin: 16,
            paddingHorizontal: 16,
            paddingVertical: 8,
            alignSelf: 'center',
            width: '92%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 2000, // Ensure always above overlays
          },
        ]}
      >
        {/* Hamburger/Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Entypo name="menu" size={28} color="#222" />
          <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
        </TouchableOpacity>
        <View style={styles.speedPill}>
          <Text style={styles.speedZero}>0</Text>
          <Text style={styles.speedZero}> | </Text>
          <Text style={styles.speedLimit}>40</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Driver Status Indicator */}
          {isOnline && (
            <View style={{
              backgroundColor: getDriverStatusColor(),
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              marginRight: 8,
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 10,
                fontWeight: 'bold',
              }}>
                {getDriverStatusText()}
              </Text>
              <Text style={{
                color: '#fff',
                fontSize: 8,
                fontWeight: 'bold',
                marginTop: 2,
              }}>
                {isSocketConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
          )}

          
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle" size={32} color="#222" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      {/* Floating location icon - now outside the top bar, truly floating at right mid-screen */}
      {isOnline && (
        <TouchableOpacity
          disabled={isLocating}
        style={{
          position: 'absolute',
            right: 20,
            top: '50%',
            transform: [{ translateY: -32 }],
          backgroundColor: '#fff',
            borderRadius: 32,
            padding: 16,
            elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
            zIndex: 2100,
            opacity: isLocating ? 0.6 : 1,
          }}
          onPress={async () => {
            setIsLocating(true);
            try {
              // Try to get last known position instantly
              let location = await Location.getLastKnownPositionAsync();
              if (location && mapRef.current) {
                mapRef.current.animateToRegion({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }, 1000);
              }
              // Now fetch a fresh position in the background (Balanced accuracy)
              let freshLocation = null;
              try {
                freshLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
              } catch (err1) {
                // If Balanced fails, try Highest
                try {
                  freshLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
                } catch (err2) {
                  console.log('Balanced accuracy also failed:', err2);
                  const errMsg = (err2 && typeof err2 === 'object' && 'message' in err2) ? (err2 as Error).message : '';
                  Alert.alert('Error', `Failed to fetch current location. Try going outdoors or enabling location services. ${errMsg}`);
                  setTimeout(() => setIsLocating(false), 2000);
                  return;
                }
              }
              if (freshLocation && mapRef.current) {
                mapRef.current.animateToRegion({
                  latitude: freshLocation.coords.latitude,
                  longitude: freshLocation.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }, 1000);
                
                // Send location update to socket server if online
                if (isOnline && isSocketConnected && location && currentRideRequest) {
                  sendLocationUpdate({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    userId: currentRideRequest.userId, // Use actual user ID from active ride
                    driverId: 'driver_001'
                  });
                }
              }
            } catch (error) {
              console.log('Location error:', error);
              const errMsg = (error && typeof error === 'object' && 'message' in error) ? (error as Error).message : '';
              Alert.alert('Error', `Failed to fetch current location. ${errMsg}`);
            } finally {
              setTimeout(() => setIsLocating(false), 2000); // debounce for 2 seconds
            }
          }}
        >
          <Ionicons name="navigate" size={32} color={Colors.modernYellow} />
        </TouchableOpacity>
      )}
      {/* Bottom Online/Offline Bar */}
      <SafeAreaView style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'transparent', paddingBottom: insets.bottom > 0 ? insets.bottom : 16, zIndex: 10000 }} edges={['bottom']}>
        {isOnline && !isRideActive && (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
            <View style={{
              width: '94%',
              marginBottom: -30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              borderRadius: 32,
              paddingVertical: 16,
              paddingHorizontal: 18,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.10,
              shadowRadius: 8,
              elevation: 8,
              alignSelf: 'center',
              
            }}>
              {/* Center Text */}
              <Text style={{
                color: Colors.modernYellow,
                fontWeight: 'bold',
                fontSize: 30,
                letterSpacing: 0.5,
                textAlign: 'center',
                flex: 1,
              }}>
                {t('home.youreOnline')}
              </Text>
              {/* Hamburger Icon (right) */}
              <TouchableOpacity 
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 2,
                }}
                onPress={goOffline}
                activeOpacity={0.8}
              >
                <Entypo name="menu" size={28} color="#222" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
      {/* Swipe to Go Online Bar (show only if offline and not in ride) */}
      {!isOnline && !isRideActive && (
        <SafeAreaView style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom > 0 ? insets.bottom + 16 : 32, zIndex: 10000 }} edges={['bottom']}>
          <View style={{
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '5%',
          }}>
            {/* Safety Toolkit Icon - left of swipe bar */}

            {/* Enhanced Swipe Bar */}
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1A2233',
              borderRadius: 32,
              paddingVertical: 20,
              paddingHorizontal: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 12,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
              {...panResponder.panHandlers}
            >
              {/* Enhanced Gradient Progress Bar Background */}
              <Animated.View style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: swipeX.interpolate({
                  inputRange: [0, SWIPE_WIDTH - 56],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
                zIndex: 1,
              }}>
                <LinearGradient
                  colors={[Colors.modernYellowLight, Colors.modernYellow, Colors.modernYellowDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1, borderRadius: 32 }}
                />
                {/* Enhanced Ripple shimmer effect */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: rippleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, (SWIPE_WIDTH - 56) * 0.7],
                    }),
                    top: 0,
                    bottom: 0,
                    width: 60,
                    opacity: 0.4,
                    zIndex: 2,
                  }}
                  pointerEvents="none"
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1, borderRadius: 32 }}
                  />
                </Animated.View>
              </Animated.View>
              
              {/* Enhanced Swipe Handle */}
              <Animated.View style={{
                position: 'absolute',
                left: swipeX,
                top: 0,
                bottom: 0,
                width: 66,
                height: 66,
                borderRadius: 33,
                backgroundColor: Colors.modernYellow,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: Colors.modernYellow,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: swipeX.interpolate({
                  inputRange: [0, SWIPE_WIDTH - 56],
                  outputRange: [0.2, 0.5],
                  extrapolate: 'clamp',
                }),
                shadowRadius: swipeX.interpolate({
                  inputRange: [0, SWIPE_WIDTH - 56],
                  outputRange: [8, 12],
                  extrapolate: 'clamp',
                }),
                elevation: swipeX.interpolate({
                  inputRange: [0, SWIPE_WIDTH - 56],
                  outputRange: [8, 16],
                  extrapolate: 'clamp',
                }),
                zIndex: 3,
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                transform: [{
                  scale: swipeX.interpolate({
                    inputRange: [0, SWIPE_WIDTH - 56],
                    outputRange: [1, 1.05],
                    extrapolate: 'clamp',
                  })
                }],
              }}>
                <Animated.View
                  style={{
                    transform: [{
                      rotate: swipeX.interpolate({
                        inputRange: [0, SWIPE_WIDTH - 56],
                        outputRange: ['0deg', '15deg'],
                        extrapolate: 'clamp',
                      })
                    }]
                  }}
                >
                  <Ionicons name="arrow-forward" size={32} color="#fff" />
                </Animated.View>
            </Animated.View>
              
              {/* Enhanced Text with Icon */}
              <View style={{ marginLeft: 70, flexDirection: 'row', alignItems: 'center', zIndex: 4 }}>
                <Animated.View
                  style={{
                    opacity: swipeX.interpolate({
                      inputRange: [0, SWIPE_WIDTH - 56],
                      outputRange: [1, 0.7],
                      extrapolate: 'clamp',
                    }),
                    transform: [{
                      scale: swipeX.interpolate({
                        inputRange: [0, SWIPE_WIDTH - 56],
                        outputRange: [1, 0.95],
                        extrapolate: 'clamp',
                      })
                    }]
                  }}
                >
                  <Ionicons name="power" size={20} color="#fff" style={{ marginRight: 8 }} />
                </Animated.View>
                <Animated.Text style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 20,
                  letterSpacing: 0.5,
                  zIndex: 4,
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                  opacity: swipeX.interpolate({
                    inputRange: [0, SWIPE_WIDTH - 56],
                    outputRange: [1, 0.8],
                    extrapolate: 'clamp',
                  }),
                }}>
                  Swipe to go online
                </Animated.Text>
              </View>
              
              {/* Success Checkmark for Online Swipe */}
              <Animated.View
                style={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: [
                    { translateY: -16 },
                    {
                      scale: swipeX.interpolate({
                        inputRange: [SWIPE_WIDTH - 100, SWIPE_WIDTH - 56],
                        outputRange: [0.5, 1],
                        extrapolate: 'clamp',
                      })
                    }
                  ],
                  opacity: swipeX.interpolate({
                    inputRange: [SWIPE_WIDTH - 100, SWIPE_WIDTH - 56],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                }}
              >
                <View style={{
                  backgroundColor: '#22c55e',
                  borderRadius: 20,
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#22c55e',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
              </Animated.View>
          </View>
      </View>
        </SafeAreaView>
      )}
      {/* SOS Button (show only when online) */}
      {isOnline && (
        <Animated.View style={{
          position: 'absolute',
          top: '35%',
          right: 7,
          zIndex: 1000,
          shadowColor: '#FF3B30',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 12,
        }}>
        <TouchableOpacity
            style={{
              backgroundColor: '#FF3B30',
              borderRadius: 32,
              width: 64,
              height: 64,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#FF3B30',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 12,
            }}
        onPress={() => setSOSVisible(true)}
            activeOpacity={0.85}
        >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, letterSpacing: 1 }}>SOS</Text>
        </TouchableOpacity>
        </Animated.View>
      )}
      {/* SOS Modal */}
      <SOSModal visible={isSOSVisible} onClose={() => setSOSVisible(false)} />
      {/* Ride Request Modal */}
      {rideRequest && (
        <RideRequestScreen
          ride={rideRequest}
          onClose={async () => {
            await stopAllNotificationSounds(); // Safety net
            setRideRequest(null);
          }}
          onAccept={() => {
            if (currentRideRequest) {
              handleAcceptRide(currentRideRequest);
            }
          }}
          onReject={() => {
            if (currentRideRequest) {
              handleRejectRide(currentRideRequest);
            }
          }}
          playSound={!acceptedRideDetails} // Only play sound for new requests
        />
      )}
      {/* Dual notification card UI */}
      {isOnline && currentRideRequests && currentRideRequests.length > 0 && (
        <View
          style={{
            position: 'absolute',
            top: '18%',
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 9999,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          {currentRideRequests.slice(0, 2).map((ride, idx) => {
            const uiRide = mapBackendRideRequestToUI(ride);
            const handleAccept = () => handleAcceptRide(ride);
            const handleReject = () => handleRejectRide(ride);
            return (
              <View
                key={uiRide.id}
                style={{
                  width: currentRideRequests.length === 1 ? '90%' : '44%',
                  marginRight: idx === 0 && currentRideRequests.length === 2 ? 16 : 0,
                  shadowColor: idx === 0 ? Colors.modernYellow : Colors.modernYellow,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.25,
                  shadowRadius: 16,
                  elevation: 16,
                  borderRadius: 24,
                  overflow: 'visible',
                  backgroundColor: '#fff',
                }}
              >
                <RideRequestScreen
                  ride={uiRide}
                  onClose={handleReject}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              </View>
            );
          })}
        </View>
      )}
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={(screen) => {
          setMenuVisible(false);
            navigation.navigate(screen as never);
        }}
        halfScreen={false}
        onLogout={handleLogout}
      />
      {/* Safety Toolkit Modal */}
      <Modal
        visible={safetyModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSafetyModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.25)' }}>
          <View style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: 16,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 32,
            paddingHorizontal: 0,
            minHeight: 420,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 20,
          }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 8 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222' }}>Safety Toolkit</Text>
              <TouchableOpacity onPress={() => setSafetyModalVisible(false)}>
                <Ionicons name="close" size={28} color="#222" />
              </TouchableOpacity>
    </View>
            {/* List */}
            <ScrollView style={{ paddingHorizontal: 8 }} showsVerticalScrollIndicator={false}>
              {/* Emergency Contacts */}
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16 }}>
                <Ionicons name="alert-circle" size={28} color="#FF3B30" style={{ marginRight: 18 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>Emergency Contacts</Text>
                  <Text style={{ color: '#666', fontSize: 14 }}>Contact emergency services.</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#bbb" />
              </TouchableOpacity>
              {/* Record Audio */}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16 }}>
                <Ionicons name="mic" size={26} color="#222" style={{ marginRight: 18 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>Record audio</Text>
                  <Text style={{ color: '#666', fontSize: 14 }}>Record audio during your trips.</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#eee', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 6 }}>
                  <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 14 }}>Set up</Text>
                </TouchableOpacity>
              </View>
              {/* Follow my ride */}
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16 }}>
                <Ionicons name="radio-outline" size={26} color="#222" style={{ marginRight: 18 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>Follow my ride</Text>
                  <Text style={{ color: '#666', fontSize: 14 }}>Share your location and trip status.</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#bbb" />
              </TouchableOpacity>
              {/* Proof of trip status */}
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16 }}>
                <Ionicons name="image-outline" size={26} color="#222" style={{ marginRight: 18 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>Proof of trip status</Text>
                  <Text style={{ color: '#666', fontSize: 14 }}>Show law enforcement your current status.</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#bbb" />
              </TouchableOpacity>
              {/* Safety Hub */}
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16 }}>
                <Ionicons name="shield-outline" size={26} color="#222" style={{ marginRight: 18 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>Safety Hub</Text>
                  <Text style={{ color: '#666', fontSize: 14 }}>View your safety settings and resources.</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#bbb" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Cancel Ride Modal */}
      <CancelRideModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleConfirmCancelRide}
      />
      {/* Overlay to close menu when tapping outside */}
      {menuVisible && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3000,
          }}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        />
      )}
      
      {/* JWT Test Button and Modal - REMOVED */}

      {/* Swipe Gesture Indicator - REMOVED */}

      {/* Swipe Instruction - REMOVED */}


    </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    zIndex: 10,
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.modernYellow,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  speedPill: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'center',
  },
  speedZero: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 4,
  },
  speedLimit: {
    color: Colors.modernYellow,
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});
