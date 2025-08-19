import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Modal, 
  FlatList, 
  TextInput, 
  Image, 
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp, useUser, useAuth } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logJWTDetails } from '../../utils/jwtDecoder';
import { useLanguage } from '../../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

// Types
interface NameStepProps {
  firstName: string;
  lastName: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  onNext: () => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  countryCode: string;
  setCountryCode: (v: string) => void;
  countryModalVisible: boolean;
  setCountryModalVisible: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

interface OtpStepProps {
  otp: string[];
  setOtp: (v: string[]) => void;
  onVerify: () => void;
  onBack: () => void;
  isLoading: boolean;
  error: string;
  resendOtp: () => void;
  canResend: boolean;
  timer: number;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

interface PhotoStepProps {
  profileImage: string | null;
  setProfileImage: (v: string | null) => void;
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
  isLoading: boolean;
  firstName: string;
  lastName: string;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

interface CountryItem {
  code: string;
  name: string;
}

// Add a helper function for name validation (allows letters, spaces, hyphens, apostrophes)
function isValidName(str: string) {
  return /^[A-Za-z\s\-']+$/.test(str) && str.trim().length >= 2;
}

// Step 1: Name Entry
function NameStep({ firstName, lastName, setFirstName, setLastName, onNext, fadeAnim, slideAnim }: NameStepProps) {
  const { t } = useLanguage();
  const handleNext = () => {
    console.log('SignUpScreen - NameStep handleNext called');
    console.log('SignUpScreen - First name:', firstName);
    console.log('SignUpScreen - Last name:', lastName);
    console.log('SignUpScreen - onNext function:', typeof onNext);
    
    if (!isValidName(firstName.trim())) {
      console.log('SignUpScreen - First name validation failed');
      Alert.alert('Invalid First Name', 'First name should contain only letters, spaces, hyphens, and apostrophes (minimum 2 characters).');
      return;
    }
    if (!isValidName(lastName.trim())) {
      console.log('SignUpScreen - Last name validation failed');
      Alert.alert('Invalid Last Name', 'Last name should contain only letters, spaces, hyphens, and apostrophes (minimum 2 characters).');
      return;
    }
    
    console.log('SignUpScreen - Name validation passed, calling onNext');
    try {
      onNext();
      console.log('SignUpScreen - onNext called successfully');
    } catch (error) {
      console.error('SignUpScreen - Error calling onNext:', error);
    }
  };
  
  return (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.progressContainer}>
        <Text style={styles.progress}>{t('common.step')} 1 {t('common.of')} 4</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '25%' }]} />
        </View>
      </View>
      
      <Text style={styles.stepTitle}>{t('auth.whatsYourName')}</Text>
      <Text style={styles.stepSubtitle}>{t('auth.letsGetToKnowYou')}</Text>
      
      <View style={styles.inputWrapper}>
        <Input
          label={t('auth.firstName')}
          placeholder={t('auth.firstName')}
          value={firstName}
          onChangeText={setFirstName}
          leftIcon="person"
          autoCapitalize="words"
          returnKeyType="next"
          blurOnSubmit={false}
        />
        <Input
          label={t('auth.lastName')}
          placeholder={t('auth.lastName')}
          value={lastName}
          onChangeText={setLastName}
          leftIcon="person"
          autoCapitalize="words"
          returnKeyType="done"
          blurOnSubmit={true}
        />
      </View>
      
      <Button
        title={t('common.next')}
        onPress={handleNext}
        fullWidth
        disabled={!firstName.trim() || !lastName.trim()}
        style={styles.primaryButton}
      />
    </Animated.View>
  );
}

// Step 2: Phone Number Entry
function PhoneStep({ 
  phoneNumber, 
  setPhoneNumber, 
  countryCode, 
  setCountryCode, 
  countryModalVisible, 
  setCountryModalVisible, 
  onNext, 
  onBack, 
  isLoading,
  fadeAnim,
  slideAnim
}: PhoneStepProps) {
  const countryList: CountryItem[] = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+86', name: 'China' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+61', name: 'Australia' },
    { code: '+55', name: 'Brazil' },
  ];

  return (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.progressContainer}>
        <Text style={styles.progress}>Step 2 of 4</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>
      </View>
      
      <Text style={styles.stepTitle}>What's your mobile number?</Text>
      <Text style={styles.stepSubtitle}>We'll send you a verification code</Text>
      
      <View style={styles.inputWrapper}>
        <Input
          label="Mobile Number"
          placeholder="Enter your 10-digit mobile number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
          returnKeyType="done"
          blurOnSubmit={true}
          leftElement={
            <TouchableOpacity
              onPress={() => setCountryModalVisible(true)}
              style={styles.countryCodeButton}
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <Ionicons name="chevron-down" size={18} color={Colors.gray400} />
            </TouchableOpacity>
          }
        />
      </View>
      
      {/* Country Code Modal */}
      <Modal
        visible={countryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setCountryModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={countryList}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setCountryCode(item.code);
                    setCountryModalVisible(false);
                  }}
                >
                  <Text style={styles.countryItemText}>
                    {item.name} ({item.code})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      <Button
        title="Send OTP"
        onPress={onNext}
        fullWidth
        loading={isLoading}
        disabled={phoneNumber.length !== 10}
        style={styles.primaryButton}
      />
      <Button
        title="Back"
        onPress={onBack}
        fullWidth
        variant="secondary"
        style={styles.secondaryButton}
      />
    </Animated.View>
  );
}

// Step 3: OTP Entry
function OtpStep({ 
  otp, 
  setOtp, 
  onVerify, 
  onBack, 
  isLoading, 
  error, 
  resendOtp, 
  canResend, 
  timer,
  fadeAnim,
  slideAnim
}: OtpStepProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    console.log(`OtpStep - handleOtpChange: index=${index}, value="${value}", length=${value.length}`);
    
    // Only allow single digit
    if (value.length > 1) {
      console.log('OtpStep - Value too long, ignoring');
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    console.log('OtpStep - New OTP array:', newOtp);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (nativeEvent: any, index: number) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.progressContainer}>
        <Text style={styles.progress}>Step 3 of 4</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
      </View>
      
      {/* OTP Illustration */}
      <View style={styles.otpIllustrationContainer}>
        <View style={styles.otpIllustrationCircle}>
          <Ionicons name="shield-checkmark" size={60} color={Colors.modernYellow} />
        </View>
        <View style={styles.otpIllustrationBadge}>
          <Ionicons name="lock-closed" size={20} color={Colors.white} />
        </View>
      </View>
      
      <Text style={styles.stepTitle}>Enter 6-digit verification code</Text>
      <Text style={styles.stepSubtitle}>
        We've sent a verification code to your mobile number
      </Text>
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>
      
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
      
      <View style={styles.resendContainer}>
        {canResend ? (
          <TouchableOpacity onPress={resendOtp} style={styles.resendButton}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
        )}
      </View>
      
      <Button
        title="Verify"
        onPress={onVerify}
        fullWidth
        loading={isLoading}
        disabled={otp.join('').length !== 6}
        style={styles.primaryButton}
      />
      <Button
        title="Back"
        onPress={onBack}
        fullWidth
        variant="secondary"
        style={styles.secondaryButton}
      />
    </Animated.View>
  );
}

// Step 4: Photo Upload
function PhotoStep({ 
  profileImage, 
  setProfileImage, 
  onComplete, 
  onSkip, 
  onBack, 
  isLoading,
  firstName,
  lastName,
  fadeAnim,
  slideAnim
}: PhotoStepProps) {
  const handleImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add your photo',
      [
        { text: 'Camera', onPress: () => console.log('Open Camera') },
        { text: 'Gallery', onPress: () => console.log('Open Gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.progressContainer}>
        <Text style={styles.progress}>Step 4 of 4</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>
      
      <Text style={styles.stepTitle}>Upload your photo</Text>
      <Text style={styles.stepSubtitle}>
        Add a profile photo to help others recognize you
      </Text>
      
      <TouchableOpacity
        onPress={handleImagePicker}
        style={styles.profileImageContainer}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <LinearGradient
            colors={[Colors.sandWarm, Colors.sandMedium]}
            style={styles.placeholderImage}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="camera" size={32} color={Colors.text} />
          </LinearGradient>
        )}
      </TouchableOpacity>
      
      <Text style={styles.imageHint}>Tap to upload</Text>
      
      {(!firstName.trim() || !lastName.trim()) && (
        <Text style={styles.errorText}>
          Please provide both first name and last name to continue
        </Text>
      )}
      
      <Button
        title="Complete"
        onPress={onComplete}
        fullWidth
        loading={isLoading}
        disabled={!firstName.trim() || !lastName.trim()}
        style={styles.primaryButton}
      />
      {(!firstName.trim() || !lastName.trim()) && (
        <Button
          title="Back to Name Step"
          onPress={onBack}
          fullWidth
          variant="secondary"
          style={styles.secondaryButton}
        />
      )}
      <Button
        title="I'll do it later"
        onPress={onSkip}
        fullWidth
        variant="outline"
        style={styles.outlineButton}
      />
      <Button
        title="Back"
        onPress={onBack}
        fullWidth
        variant="ghost"
        style={styles.ghostButton}
      />
    </Animated.View>
  );
}

// Main SignUp Screen Component
export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [step, setStep] = useState<number>(1);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [countryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [signUpCreated, setSignUpCreated] = useState<boolean>(false);
  const { signUp, setActive: setSignUpActive, isLoaded } = useSignUp();
  const { user } = useUser();
  const { isSignedIn, getToken } = useAuth();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  // Timer for OTP resend
  useEffect(() => {
    if (step !== 3) return;
    
    setTimer(30);
    setCanResend(false);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [step]);

  // Reset signUpCreated if phone number changes
  useEffect(() => {
    setSignUpCreated(false);
  }, [phoneNumber, countryCode]);

  // Monitor authentication state
  useEffect(() => {
    console.log('SignUpScreen - Auth state changed. isSignedIn:', isSignedIn);
    if (isSignedIn) {
      console.log('SignUpScreen - User is signed in!');
    }
  }, [isSignedIn]);

  // Monitor step changes
  useEffect(() => {
    console.log('SignUpScreen - Step changed to:', step);
  }, [step]);

  // Step navigation with animations
  const goToNextStep = () => {
    console.log('SignUpScreen - goToNextStep called, current step:', step);
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    
    // Update step first
    const newStep = step + 1;
    console.log('SignUpScreen - Step changing from', step, 'to', newStep);
    
    // Use functional update to ensure we're working with the latest state
    setStep((currentStep) => {
      const nextStep = currentStep + 1;
      console.log('SignUpScreen - Functional update: currentStep =', currentStep, 'nextStep =', nextStep);
      return nextStep;
    });
    
    // Start animations after a brief delay to ensure state update
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100); // Increased delay slightly
  };
  
  const goToPrevStep = () => {
    console.log('SignUpScreen - goToPrevStep called, current step:', step);
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(-30);
    
    // Update step first
    const newStep = step - 1;
    console.log('SignUpScreen - Step changing from', step, 'to', newStep);
    setStep(newStep);
    
    // Start animations after a brief delay to ensure state update
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 50);
  };

  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Step 2: Send OTP
  const handleSendOTP = async () => {
    if (!isLoaded) return;
    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    try {
      const formattedPhone = `${countryCode}${phoneNumber.replace(/^0+/, '')}`;
      console.log('SignUpScreen - Sending OTP to:', formattedPhone);
      console.log('SignUpScreen - SignUp object:', signUp);
      console.log('SignUpScreen - Is loaded:', isLoaded);
      
      if (!signUp) {
        console.error('SignUpScreen - SignUp object is null during OTP send');
        Alert.alert('Error', 'Authentication service not available. Please try again.');
        return;
      }
      
      if (!signUpCreated) {
        console.log('SignUpScreen - Creating sign up...');
        await signUp.create({ phoneNumber: formattedPhone });
        setSignUpCreated(true);
        console.log('SignUpScreen - Sign up created successfully');
      }
      
      console.log('SignUpScreen - Preparing phone number verification...');
      await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });
      console.log('SignUpScreen - OTP sent successfully');
      goToNextStep();
    } catch (err: unknown) {
      console.error('SignUpScreen - Error sending OTP:', err);
      if (typeof err === 'object' && err && 'errors' in err) {
        // @ts-ignore
        const errorMessage = err.errors?.[0]?.message || 'Failed to send OTP';
        console.error('SignUpScreen - Error message:', errorMessage);
        Alert.alert('Error', errorMessage);
      } else {
        console.error('SignUpScreen - Unknown error type:', err);
        Alert.alert('Error', 'Failed to send OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setOtpError('');
    try {
      const otpString = otp.join('');
      console.log('SignUpScreen - Verifying OTP:', otpString);
      console.log('SignUpScreen - OTP length:', otpString.length);
      console.log('SignUpScreen - OTP array:', otp);
      console.log('SignUpScreen - SignUp object:', signUp);
      console.log('SignUpScreen - Is loaded:', isLoaded);
      console.log('SignUpScreen - SignUpCreated:', signUpCreated);
      
      if (otpString.length !== 6) {
        setOtpError('Please enter complete OTP');
        setIsLoading(false);
        return;
      }

      if (!signUp) {
        console.error('SignUpScreen - SignUp object is null');
        setOtpError('Authentication service not available. Please try again.');
        setIsLoading(false);
        return;
      }

      // Test: Check if the OTP contains only numbers
      if (!/^\d{6}$/.test(otpString)) {
        console.error('SignUpScreen - OTP contains non-numeric characters');
        setOtpError('OTP should contain only numbers');
        setIsLoading(false);
        return;
      }
      
      console.log('SignUpScreen - Attempting phone number verification...');
      console.log('SignUpScreen - OTP code being sent:', otpString);
      
      const completeSignUp = await signUp.attemptPhoneNumberVerification({ code: otpString });
      console.log('SignUpScreen - Verification result:', completeSignUp);
      console.log('SignUpScreen - Verification status:', completeSignUp?.status);
      console.log('SignUpScreen - Phone verification status:', completeSignUp?.verifications?.phoneNumber?.status);
      console.log('SignUpScreen - Created session ID:', completeSignUp?.createdSessionId);
      
      // Check if phone number is verified
      const isPhoneVerified = completeSignUp?.verifications?.phoneNumber?.status === 'verified';
      console.log('SignUpScreen - Is phone verified:', isPhoneVerified);
      
      if (isPhoneVerified) {
        console.log('SignUpScreen - Phone verification successful!');
        console.log('SignUpScreen - Missing fields:', completeSignUp?.missingFields);
        
        // Set userType in Clerk metadata immediately after phone verification
        if (user) {
          try {
            await user.update({
              unsafeMetadata: { ...user.unsafeMetadata, type: 'driver' }
            });
            console.log('SignUpScreen - User type set to driver after phone verification');
            
            // Force new JWT with updated userType
            if (typeof getToken === 'function') {
              const newToken = await getToken({ template: 'driver_app_token', skipCache: true });
              console.log('SignUpScreen - New JWT with userType after phone verification:', newToken ? 'Generated' : 'Failed');
              
              // Log the JWT details to verify custom fields
              if (newToken) {
                await logJWTDetails(getToken, 'SignUp Phone Verification JWT Analysis');
              }
            }
          } catch (metadataErr) {
            console.error('SignUpScreen - Error setting user type after phone verification:', metadataErr);
          }
        }
        
        // Save Clerk user ID if available and signup is complete
        if (user && completeSignUp?.status === 'complete') {
          try {
            await AsyncStorage.setItem('clerkUserId', user.id);
            console.log('SignUpScreen - Clerk user ID saved to AsyncStorage:', user.id);
          } catch (e) {
            console.error('SignUpScreen - Failed to save Clerk user ID:', e);
          }
        }
        // Check if we have all required fields (phone is verified, but we still need first_name and last_name)
        if (completeSignUp?.missingFields?.includes('first_name') || completeSignUp?.missingFields?.includes('last_name')) {
          console.log('SignUpScreen - Phone verified but missing name fields, proceeding to next step');
          goToNextStep();
        } else if (completeSignUp?.status === 'complete') {
          console.log('SignUpScreen - All requirements met, setting active session...');
          console.log('SignUpScreen - Created session ID:', completeSignUp.createdSessionId);
          
          // Set the active session
          if (setSignUpActive && completeSignUp.createdSessionId) {
            await setSignUpActive({ session: completeSignUp.createdSessionId });
            console.log('SignUpScreen - Session activated successfully');
          } else {
            console.error('SignUpScreen - setSignUpActive is not available or no session ID');
          }
          goToNextStep();
        } else {
          console.log('SignUpScreen - Phone verified but status not complete, proceeding anyway');
          goToNextStep();
        }
      } else {
        console.log('SignUpScreen - Phone verification failed');
        console.log('SignUpScreen - Complete signup object:', completeSignUp);
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      console.error('SignUpScreen - OTP Verification Error:', err);
      console.error('SignUpScreen - Error details:', err.errors);
      console.error('SignUpScreen - Error message:', err.message);
      console.error('SignUpScreen - Error code:', err.code);
      console.error('SignUpScreen - Error type:', typeof err);
      console.error('SignUpScreen - Full error object:', JSON.stringify(err, null, 2));
      
      let errorMessage = 'Invalid OTP. Please try again.';
      if (err?.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setOtpError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Resend OTP
  const handleResendOTP = async () => {
    try {
      await signUp?.preparePhoneNumberVerification({ strategy: 'phone_code' });
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      Alert.alert('Success', 'OTP sent successfully');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  // Step 4: Complete Profile
  const handleCompleteProfile = async () => {
    setIsLoading(true);
    try {
      console.log('SignUpScreen - Completing profile...');
      console.log('SignUpScreen - First name:', firstName);
      console.log('SignUpScreen - Last name:', lastName);
      console.log('SignUpScreen - Current auth state - isSignedIn:', isSignedIn);
      
      // Validate that both names are provided
      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert('Error', 'Please enter both first name and last name');
        setIsLoading(false);
        return;
      }

      // Add validation for name characters
      if (!isValidName(firstName.trim())) {
        Alert.alert('Invalid First Name', 'First name should contain only letters, spaces, hyphens, and apostrophes (minimum 2 characters).');
        setIsLoading(false);
        return;
      }
      if (!isValidName(lastName.trim())) {
        Alert.alert('Invalid Last Name', 'Last name should contain only letters, spaces, hyphens, and apostrophes (minimum 2 characters).');
        setIsLoading(false);
        return;
      }
      
      // Update the signup with first and last name
      if (signUp) {
        await signUp.update({
          firstName: firstName.trim(),
          lastName: lastName.trim()
        });
        console.log('SignUpScreen - Profile updated successfully');
        console.log('SignUpScreen - SignUp status after update:', signUp.status);
        // Check if we need to complete the signup
        if (signUp.status === 'complete') {
          console.log('SignUpScreen - SignUp is complete, setting active session...');
          if (setSignUpActive && signUp.createdSessionId) {
            await setSignUpActive({ session: signUp.createdSessionId });
            console.log('SignUpScreen - Session activated successfully');
          }
        } else {
          console.log('SignUpScreen - SignUp status is not complete:', signUp.status);
          console.log('SignUpScreen - Missing fields:', signUp.missingFields);
          // Try to complete the signup manually
          try {
            console.log('SignUpScreen - Attempting to complete signup...');
            // Since we've already verified the phone and updated the name, 
            // we should be able to complete the signup
            console.log('SignUpScreen - SignUp should be complete now');
          } catch (completionErr) {
            console.error('SignUpScreen - Error completing signup:', completionErr);
          }
        }
      }
      // Set userType in Clerk metadata if user is available
      if (user) {
        try {
          await user.update({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            unsafeMetadata: { ...user.unsafeMetadata, type: 'driver' }
          });
          console.log('SignUpScreen - Clerk user updated with name and userType');
          
          // Force new JWT with updated userType and name fields
          if (typeof getToken === 'function') {
            const newToken = await getToken({ template: 'driver_app_token', skipCache: true });
            console.log('SignUpScreen - New JWT with complete user data:', newToken ? 'Generated' : 'Failed');
            
            // Log the JWT details to verify custom fields
            if (newToken) {
              await logJWTDetails(getToken, 'SignUp Profile Completion JWT Analysis');
            }
          }
          
          // Save Clerk user ID after profile completion
          try {
            await AsyncStorage.setItem('clerkUserId', user.id);
            console.log('SignUpScreen - Clerk user ID saved to AsyncStorage:', user.id);
          } catch (e) {
            console.error('SignUpScreen - Failed to save Clerk user ID:', e);
          }
        } catch (userUpdateErr) {
          console.error('SignUpScreen - Error updating user data:', userUpdateErr);
        }
      }
      
      // TODO: Handle profile image upload if needed
      // if (profileImage) {
      //   await user?.setProfileImage({ file: profileImage });
      // }
      
      console.log('SignUpScreen - Profile completion successful');
      console.log('SignUpScreen - Final auth state - isSignedIn:', isSignedIn);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => {
          console.log('SignUpScreen - Profile completion alert dismissed');
        }}
      ]);
    } catch (err: any) {
      console.error('SignUpScreen - Profile completion error:', err);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Skip profile
  const handleSkipProfile = () => {
    console.log('SignUpScreen - Skipping profile setup');
    console.log('SignUpScreen - Current auth state - isSignedIn:', isSignedIn);
    console.log('SignUpScreen - SignUp status:', signUp?.status);
    console.log('SignUpScreen - First name:', firstName);
    console.log('SignUpScreen - Last name:', lastName);
    
    // Check if names are missing
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert(
        'Name Required', 
        'Please provide both first name and last name to complete your profile.',
        [
          { text: 'Go Back', onPress: () => goToPrevStep() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }
    
    // Check if we can complete the signup without name
    if (signUp && signUp.status === 'complete') {
      console.log('SignUpScreen - SignUp is complete, setting active session...');
      if (setSignUpActive && signUp.createdSessionId) {
        setSignUpActive({ session: signUp.createdSessionId }).then(() => {
          console.log('SignUpScreen - Session activated successfully on skip');
        }).catch(err => {
          console.error('SignUpScreen - Error activating session on skip:', err);
        });
      }
    } else {
      console.log('SignUpScreen - SignUp status is not complete:', signUp?.status);
      console.log('SignUpScreen - Missing fields:', signUp?.missingFields);
    }
    
    Alert.alert(
      'Profile Setup', 
      'You can complete your profile later from the settings.',
      [
        { text: 'OK', onPress: () => {
          console.log('SignUpScreen - Profile skip alert dismissed');
          console.log('SignUpScreen - Auth state after skip - isSignedIn:', isSignedIn);
        }}
      ]
    );
  };

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={step > 1 ? goToPrevStep : () => navigation?.goBack?.()} 
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
              </TouchableOpacity>
              
              {/* Default Image/Illustration */}
              <View style={styles.illustrationContainer}>
                <View style={styles.illustrationCircle}>
                  <Ionicons name="person-add" size={40} color={Colors.modernYellow} />
                </View>
                <View style={styles.illustrationBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.white} />
                </View>
              </View>
            </View>
            
            <View style={styles.content}>
              {step === 1 && (
                <NameStep
                  firstName={firstName}
                  lastName={lastName}
                  setFirstName={setFirstName}
                  setLastName={setLastName}
                  onNext={goToNextStep}
                  fadeAnim={fadeAnim}
                  slideAnim={slideAnim}
                />
              )}
              
              {step === 2 && (
                <PhoneStep
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                  countryModalVisible={countryModalVisible}
                  setCountryModalVisible={setCountryModalVisible}
                  onNext={handleSendOTP}
                  onBack={goToPrevStep}
                  isLoading={isLoading}
                  fadeAnim={fadeAnim}
                  slideAnim={slideAnim}
                />
              )}
              
              {step === 3 && (
                <OtpStep
                  otp={otp}
                  setOtp={setOtp}
                  onVerify={handleVerifyOTP}
                  onBack={goToPrevStep}
                  isLoading={isLoading}
                  error={otpError}
                  resendOtp={handleResendOTP}
                  canResend={canResend}
                  timer={timer}
                  fadeAnim={fadeAnim}
                  slideAnim={slideAnim}
                />
              )}
              
              {step === 4 && (
                <PhotoStep
                  profileImage={profileImage}
                  setProfileImage={setProfileImage}
                  onComplete={handleCompleteProfile}
                  onSkip={handleSkipProfile}
                  onBack={goToPrevStep}
                  isLoading={isLoading}
                  firstName={firstName}
                  lastName={lastName}
                  fadeAnim={fadeAnim}
                  slideAnim={slideAnim}
                />
              )}
            </View>
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
    paddingBottom: 100,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: Layout.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  stepContainer: {
    marginTop: 20,
    backgroundColor: Colors.sandLight,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 380,
    minWidth: 320,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progress: {
    color: Colors.modernYellow,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.modernYellow,
    borderRadius: 2,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: Colors.modernYellow,
    shadowColor: Colors.modernYellow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: Colors.modernYellow,
  },
  outlineButton: {
    marginTop: 12,
    borderColor: Colors.modernYellow,
  },
  ghostButton: {
    marginTop: 12,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  countryCodeText: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  countryItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  countryItemText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    marginHorizontal: 8,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: Colors.gray50,
  },
  otpInputFilled: {
    borderColor: Colors.modernYellow,
    backgroundColor: Colors.white,
    shadowColor: Colors.modernYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    color: Colors.modernYellow,
    fontWeight: '600',
    fontSize: 16,
  },
  timerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    borderStyle: 'dashed',
  },
  imageHint: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  illustrationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.sandLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  illustrationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.modernYellow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.modernYellow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  otpIllustrationContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  otpIllustrationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.sandLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  otpIllustrationBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: Colors.modernYellow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.modernYellow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
});