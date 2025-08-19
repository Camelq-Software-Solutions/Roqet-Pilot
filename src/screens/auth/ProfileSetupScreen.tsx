import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAssignUserType } from '../../utils/helpers';
import { logJWTDetails } from '../../utils/jwtDecoder';

export default function ProfileSetupScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const imageScaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const buttonScaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useAssignUserType('driver');

  useEffect(() => {
    // Enhanced staggered animations
    Animated.sequence([
      // Initial fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Staggered animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(imageScaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScaleAnim, {
          toValue: 1,
          tension: 70,
          friction: 9,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleImagePicker = () => {
    // Animate image picker press
    Animated.sequence([
      Animated.timing(imageScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(imageScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert(
      'Select Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCompleteSetup = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }

    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoading(true);
    
    try {
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        unsafeMetadata: { ...user.unsafeMetadata, type: 'driver' }
      });

      if (email.trim()) {
        await user?.createEmailAddress({ email: email.trim() });
      }

      if (typeof getToken === 'function') {
        const newToken = await getToken({ template: 'driver_app_token', skipCache: true });
        console.log('ProfileSetupScreen - New JWT with complete user data:', newToken ? 'Generated' : 'Failed');
        
        if (newToken) {
          await logJWTDetails(getToken, 'ProfileSetup JWT Analysis');
        }
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert('Profile Setup', 'You can complete your profile later from the settings.');
  };

  return (
    <LinearGradient
      colors={['#00CED1', '#40E0D0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animated.View style={[
              styles.header, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Help us personalize your experience
              </Text>
            </Animated.View>

            <Animated.View style={[
              styles.profileImageContainer, 
              { 
                opacity: fadeAnim, 
                transform: [{ scale: imageScaleAnim }] 
              }
            ]}>
              <TouchableOpacity
                onPress={handleImagePicker}
                style={styles.imagePickerButton}
              >
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons name="camera" size={32} color="#ffffff" />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={16} color={Colors.primary} />
                </View>
              </TouchableOpacity>
              <Text style={styles.imageHint}>Add Profile Photo</Text>
            </Animated.View>

            <Animated.View style={[
              styles.form, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }] 
              }
            ]}>
              <View style={styles.inputContainer}>
                <Input
                  label="First Name *"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                  leftIcon="person"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                  leftIcon="person"
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Email Address"
                  placeholder="Enter your email (optional)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  leftIcon="mail"
                />
              </View>

              <Animated.View style={[
                styles.buttonContainer,
                { transform: [{ scale: buttonScaleAnim }] }
              ]}>
                <Button
                  title="Complete Setup"
                  onPress={handleCompleteSetup}
                  loading={isLoading}
                  fullWidth
                  disabled={!firstName.trim()}
                />
              </Animated.View>

              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: Layout.fontSize.md,
    color: '#ffffff',
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  imagePickerButton: {
    position: 'relative',
    marginBottom: Layout.spacing.sm,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  imageHint: {
    fontSize: Layout.fontSize.sm,
    color: '#ffffff',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: Layout.spacing.lg,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContainer: {
    marginBottom: Layout.spacing.md,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    marginTop: Layout.spacing.md,
  },
  skipText: {
    fontSize: Layout.fontSize.md,
    color: '#ffffff',
    fontWeight: '600',
  },
});
