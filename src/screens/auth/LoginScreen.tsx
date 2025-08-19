import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useLanguage } from '../../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

const COUNTRY_CODES = [
  { code: '+91', label: 'IN' },
  { code: '+1', label: 'US' },
];

export default function LoginScreen({ navigation }: any) {
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [showDropdown, setShowDropdown] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const { t } = useLanguage();

  // Enhanced animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const logoScaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const inputSlideAnim = React.useRef(new Animated.Value(30)).current;
  const buttonSlideAnim = React.useRef(new Animated.Value(40)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Enhanced staggered animations
    Animated.sequence([
      // Logo animation with bounce effect
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Main content animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(inputSlideAnim, {
          toValue: 0,
          duration: 800,
          delay: 300,
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlideAnim, {
          toValue: 0,
          duration: 800,
          delay: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSendOTP = async () => {
    if (!isLoaded) return;

    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    try {
      const formattedPhone = `${countryCode}${phoneNumber}`;
      const { supportedFirstFactors } = await signIn.create({
        identifier: formattedPhone,
      });
      const phoneNumberFactor = supportedFirstFactors?.find((factor: any) => {
        return factor.strategy === 'phone_code';
      }) as any;
      if (phoneNumberFactor) {
        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId: phoneNumberFactor.phoneNumberId,
        });
        navigation.navigate('OTPVerification', {
          phoneNumber: formattedPhone,
          isSignIn: true,
        });
      }
    } catch (err: any) {
      console.error('Error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const renderCountryCodeSelector = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        style={styles.countryCodeButton}
        onPress={() => setShowDropdown(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.countryCodeText}>{countryCode}</Text>
        <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.gray600} />
      </TouchableOpacity>
      <Modal
        visible={showDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={styles.modalOverlay} pointerEvents="box-none" />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Country Code</Text>
          {COUNTRY_CODES.map((item) => (
            <TouchableOpacity
              key={item.code}
              style={styles.modalItem}
              onPress={() => {
                setCountryCode(item.code);
                setShowDropdown(false);
              }}
            >
              <Text style={styles.modalItemText}>{item.label} {item.code}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );

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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
          >
            {/* Header Section */}
            <Animated.View style={[styles.header, { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }, { scale: logoScaleAnim }] 
            }]}>
              <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                  colors={[Colors.sandWarm, Colors.sandMedium]}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Image source={require('../../../assets/images/Mainlogo.jpeg')} style={styles.logo} />
                </LinearGradient>
              </Animated.View>
              <Text style={styles.title}>{t('auth.login')}</Text>
              <Text style={styles.subtitle}>
                {t('auth.signInWith')}
              </Text>
            </Animated.View>

            {/* Form Section */}
            <Animated.View style={[styles.form, { 
              opacity: fadeAnim, 
              transform: [{ translateY: inputSlideAnim }, { scale: scaleAnim }] 
            }]}>
              <View style={styles.inputContainer}>
                <Input
                  label={t('auth.phoneNumber')}
                  placeholder={t('auth.phoneNumber')}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  leftElement={renderCountryCodeSelector()}
                />
              </View>

              <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonSlideAnim }] }]}>
                <Button
                  title={t('auth.sendOTP')}
                  onPress={handleSendOTP}
                  loading={isLoading}
                  fullWidth
                  disabled={phoneNumber.length !== 10}
                  style={styles.primaryButton}
                />
              </Animated.View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{t('common.or')}</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                <Text style={styles.signUpText}>
                  {t('auth.dontHaveAccount')} <Text style={styles.signUpLink}>{t('auth.signup')}</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Footer Section */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
              <Text style={styles.termsText}>
                {t('auth.agreeToTerms')}{' '}
                <Text style={styles.linkText}>{t('auth.termsOfService')}</Text> and{' '}
                <Text style={styles.linkText}>{t('auth.privacyPolicy')}</Text>
              </Text>
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
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 32,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.9,
  },
  form: {
    flex: 1,
    paddingHorizontal: 8,
  },
  inputContainer: {
    marginBottom: 32,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: Colors.modernYellow,
    shadowColor: Colors.modernYellow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dividerText: {
    marginHorizontal: 20,
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  signUpText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '500',
  },
  signUpLink: {
    color: Colors.modernYellow,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  linkText: {
    color: Colors.modernYellow,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    marginTop: 'auto',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
});
