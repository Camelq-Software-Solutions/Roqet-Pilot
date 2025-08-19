import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // State for driver details
  const [driverDetails, setDriverDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDriverDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get the token - the /api/drivers/me endpoint uses JWT authentication
        const token = await getToken();
        console.log('[ProfileScreen] Retrieved token:', token);
        if (!token) {
          setError('No auth token found.');
          console.error('[ProfileScreen] No auth token found.');
          setLoading(false);
          return;
        }
        
        // Use the correct endpoint with proper JWT authentication
        const url = 'https://bike-taxi-production.up.railway.app/api/drivers/me';
        console.log('[ProfileScreen] Fetching driver details from:', url);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-App-Version': '1.0.0',
            'X-Platform': 'ReactNative',
            'X-Environment': 'development',
          },
        });
        console.log('[ProfileScreen] Response status:', response.status);
        if (!response.ok) {
          setError('Failed to fetch driver details.');
          console.error('[ProfileScreen] Failed to fetch driver details. Status:', response.status);
          setLoading(false);
          return;
        }
        const data = await response.json();
        console.log('[ProfileScreen] Backend response data:', data);
        setDriverDetails(data);
      } catch (err) {
        setError('An error occurred while fetching driver details.');
        console.error('[ProfileScreen] Error while fetching driver details:', err);
      } finally {
        setLoading(false);
        console.log('[ProfileScreen] Finished fetching driver details.');
      }
    };
    fetchDriverDetails();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();
  }, []);

  const getUserPhoto = () => {
    return user?.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.fullName) {
      return user.fullName;
    }
    return 'User';
  };

  // Demo values for stats (replace with real data if available)
  const totalRides = 47;
  const totalEarnings = '₹2,340';
  const rating = 4.8;
  const completedRides = 42;
  const cancelledRides = 5;
  const averageRating = 4.8;
  const totalDistance = '156 km';
  const memberSince = 'March 2024';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color={Colors.modernYellow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color={Colors.modernYellow} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Enhanced Profile Card */}
        <Animated.View style={[styles.profileCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>  
          {/* Profile Photo with Default Image */}
          <View style={styles.profilePhotoContainer}>
            <Image source={{ uri: getUserPhoto() }} style={styles.profilePhoto} />
            <View style={styles.photoBadge}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </View>
          </View>
          
          {/* Profile Info */}
          <Text style={styles.profileName}>{getUserName()}</Text>
          <Text style={styles.profileSubtitle}>Professional Driver</Text>
          
          {/* Member Since Badge */}
          <View style={styles.memberBadge}>
            <Ionicons name="calendar" size={14} color={Colors.modernYellow} />
            <Text style={styles.memberText}>Member since {memberSince}</Text>
          </View>

          {/* Enhanced Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Ionicons name="car" size={20} color={Colors.modernYellow} />
              </View>
              <Text style={styles.statValue}>{totalRides}</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Ionicons name="wallet" size={20} color={Colors.modernYellow} />
              </View>
              <Text style={styles.statValue}>{totalEarnings}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Ionicons name="star" size={20} color={Colors.modernYellow} />
              </View>
              <Text style={styles.statValue}>{rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </Animated.View>

        {/* Performance Overview Card */}
        <View style={styles.performanceCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up" size={24} color={Colors.modernYellow} />
            <Text style={styles.cardTitle}>Performance Overview</Text>
          </View>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <View style={styles.performanceIcon}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              </View>
              <Text style={styles.performanceValue}>{completedRides}</Text>
              <Text style={styles.performanceLabel}>Completed</Text>
            </View>
            <View style={styles.performanceItem}>
              <View style={styles.performanceIcon}>
                <Ionicons name="close-circle" size={24} color={Colors.error} />
              </View>
              <Text style={styles.performanceValue}>{cancelledRides}</Text>
              <Text style={styles.performanceLabel}>Cancelled</Text>
            </View>
            <View style={styles.performanceItem}>
              <View style={styles.performanceIcon}>
                <Ionicons name="speedometer" size={24} color={Colors.modernYellow} />
              </View>
              <Text style={styles.performanceValue}>{totalDistance}</Text>
              <Text style={styles.performanceLabel}>Distance</Text>
            </View>
            <View style={styles.performanceItem}>
              <View style={styles.performanceIcon}>
                <Ionicons name="star-half" size={24} color={Colors.modernYellow} />
              </View>
              <Text style={styles.performanceValue}>{averageRating}</Text>
              <Text style={styles.performanceLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* Personal Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={24} color={Colors.modernYellow} />
            <Text style={styles.cardTitle}>Personal Details</Text>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={24} color={Colors.modernYellow} />
              <Text style={styles.loadingText}>Loading driver details...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : driverDetails ? (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="person-outline" size={16} color={Colors.modernYellow} />
                </View>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{driverDetails.firstName} {driverDetails.lastName}</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="call-outline" size={16} color={Colors.modernYellow} />
                </View>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <Text style={styles.detailValue}>{driverDetails.phoneNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="car-outline" size={16} color={Colors.modernYellow} />
                </View>
                <Text style={styles.detailLabel}>Vehicle Type</Text>
                <Text style={styles.detailValue}>Bike</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={Colors.modernYellow} />
                </View>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>Verified</Text>
              </View>
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="person-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.noDataText}>No driver details found</Text>
            </View>
          )}
        </View>

        {/* Quick Actions Card */}
        <View style={styles.actionsCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="settings" size={24} color={Colors.modernYellow} />
            <Text style={styles.cardTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="document-text" size={24} color={Colors.modernYellow} />
              </View>
              <Text style={styles.actionText}>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="shield-checkmark" size={24} color={Colors.modernYellow} />
              </View>
              <Text style={styles.actionText}>Safety</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="notifications" size={24} color={Colors.modernYellow} />
              </View>
              <Text style={styles.actionText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="help-circle" size={24} color={Colors.modernYellow} />
              </View>
              <Text style={styles.actionText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.achievementCard}>
          <View style={styles.achievementContent}>
            <View style={styles.achievementIcon}>
              <Ionicons name="trophy" size={32} color={Colors.modernYellow} />
            </View>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>Top Performer</Text>
              <Text style={styles.achievementSubtitle}>You've completed 40+ rides this month!</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Enhanced Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await signOut();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }}
        >
          <Ionicons name="log-out" size={20} color={Colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: Layout.spacing.sm,
  },
  headerTitle: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  editButton: {
    padding: Layout.spacing.sm,
  },
  scrollContent: {
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
  },
  profileCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  profilePhotoContainer: {
    position: 'relative',
    marginBottom: Layout.spacing.md,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.modernYellow,
  },
  photoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.modernYellow,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileName: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  profileSubtitle: {
    fontSize: Layout.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.sm,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.modernYellow + '15',
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    marginBottom: Layout.spacing.md,
  },
  memberText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.modernYellow,
    fontWeight: '600',
    marginLeft: Layout.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Layout.spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.modernYellow + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.xs,
  },
  statValue: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.modernYellow,
  },
  statLabel: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  performanceCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  cardTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: Layout.spacing.sm,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: Colors.sandLight,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  performanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.xs,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  performanceValue: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  performanceLabel: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  loadingText: {
    fontSize: Layout.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.sm,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  errorText: {
    fontSize: Layout.fontSize.md,
    color: Colors.error,
    marginTop: Layout.spacing.sm,
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  noDataText: {
    fontSize: Layout.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.modernYellow + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.sm,
  },
  detailLabel: {
    fontSize: Layout.fontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: Layout.fontSize.md,
    color: Colors.text,
    fontWeight: '600',
  },
  actionsCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: Colors.sandLight,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.xs,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  achievementCard: {
    width: '100%',
    backgroundColor: Colors.modernYellow + '10',
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.modernYellow + '30',
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.modernYellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
    shadowColor: Colors.modernYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  achievementSubtitle: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  logoutContainer: {
    padding: Layout.spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Layout.fontSize.lg,
  },
});
