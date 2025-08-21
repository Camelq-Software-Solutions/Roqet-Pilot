import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Dimensions, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Animated,
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

// Responsive dimensions based on screen size
const isSmallScreen = height < 700; // 5-inch screens and smaller
const isMediumScreen = height >= 700 && height < 800;
const isLargeScreen = height >= 800;

// Responsive sizing functions
const getResponsiveSize = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

const getCardSize = () => {
  if (isSmallScreen) return { width: width * 0.8, height: height * 0.28 }; // Smaller for small screens
  if (isMediumScreen) return { width: width * 0.75, height: height * 0.35 };
  return { width: 300, height: 300 };
};

const getImageSize = () => {
  if (isSmallScreen) return { width: width * 0.6, height: height * 0.18 }; // Smaller for small screens
  if (isMediumScreen) return { width: width * 0.6, height: height * 0.25 };
  return { width: 340, height: 370 };
};

const getTitleSize = () => getResponsiveSize(18, 22, 32); // Even smaller title for small screens
const getSubtitleSize = () => getResponsiveSize(11, 13, 18); // Even smaller subtitle for small screens
const getButtonTextSize = () => getResponsiveSize(13, 14, 16);

// Get content height based on screen size
const getContentHeight = () => {
  if (isSmallScreen) return height * 0.65; // Increased content area for small screens
  if (isMediumScreen) return height * 0.7;
  return height * 0.65;
};

const PRIMARY_TEAL = '#00CED1';
const PRIMARY_CYAN = '#40E0D0';

const screens = [
  {
    key: 'booking',
    illustration: (cardSize: any, imageSize: any) => (
      <View style={{ 
        width: cardSize.width * 0.9, 
        height: cardSize.height * 0.8, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: getResponsiveSize(2, 4, 8) 
      }}>
        <Image 
          source={require('../../../assets/images/Mainlogo.jpeg')} 
          style={{ 
            width: imageSize.width, 
            height: imageSize.height, 
            resizeMode: 'contain' 
          }} 
        />
      </View>
    ),
    title: 'onboarding.welcomeToRoqet',
    subtitle: "onboarding.startJourney",
  },
  {
    key: 'affordable',
    illustration: (cardSize: any, imageSize: any) => (
      <View style={{ 
        width: cardSize.width * 0.9, 
        height: cardSize.height * 0.8, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: getResponsiveSize(2, 4, 8) 
      }}>
        <Image 
          source={require('../../../assets/images/Grow.jpg.jpeg')} 
          style={{ 
            width: imageSize.width, 
            height: imageSize.height, 
            resizeMode: 'contain' 
          }} 
        />
      </View>
    ),
    title: 'onboarding.rideSmartEarnMore',
    subtitle: "onboarding.maximizeEarnings",
  },
  {
    key: 'safe',
    illustration: (cardSize: any, imageSize: any) => (
      <View style={{ 
        width: cardSize.width * 0.9, 
        height: cardSize.height * 0.8, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: getResponsiveSize(2, 4, 8) 
      }}>
        <Image 
          source={require('../../../assets/images/Bossimage.jpg.jpeg')} 
          style={{ 
            width: imageSize.width, 
            height: imageSize.height, 
            resizeMode: 'contain' 
          }} 
        />
      </View>
    ),
    title: 'onboarding.beYourOwnBoss',
    subtitle: "onboarding.driveOnYourTerms",
  },
  {
    key: 'eco',
    illustration: (cardSize: any, imageSize: any) => (
      <View style={{ 
        width: cardSize.width * 0.9, 
        height: cardSize.height * 0.8, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: getResponsiveSize(2, 4, 8) 
      }}>
        <Image 
          source={require('../../../assets/images/Community.jpg.jpeg')} 
          style={{ 
            width: imageSize.width, 
            height: imageSize.height, 
            resizeMode: 'contain' 
          }} 
        />
      </View>
    ),
    title: 'onboarding.growingCommunity',
    subtitle: 'onboarding.joinThousands',
  },
];

export default function OnboardingSwiper({ navigation }: { navigation?: any }) {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { t, currentLanguage, setLanguage, availableLanguages } = useLanguage();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.8)).current;
  const paginationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Enhanced staggered animations
    Animated.sequence([
      // Initial fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Slide and scale animations
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
        Animated.spring(buttonScaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(paginationAnim, {
          toValue: 1,
          duration: 600,
          delay: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Handle layout recalculation when language changes
  useEffect(() => {
    // Force layout recalculation when language changes
    const timer = setTimeout(() => {
      // This ensures the layout is recalculated after language change
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: false });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentLanguage, index]);

  const handleNext = () => {
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

    if (index < screens.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      navigation?.replace?.('Login');
    }
  };

  const handleSkip = () => {
    navigation?.replace?.('Login');
  };

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode);
    setShowLanguageModal(false);
  };

  const getCurrentLanguageName = () => {
    const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);
    return currentLang ? currentLang.nativeName : 'English';
  };

  // Get responsive dimensions
  const cardSize = getCardSize();
  const imageSize = getImageSize();
  const contentHeight = getContentHeight();

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header with Language Selector and Skip Button */}
        <Animated.View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingHorizontal: getResponsiveSize(12, 16, 24), 
          paddingTop: getResponsiveSize(8, 10, 16), 
          paddingBottom: getResponsiveSize(8, 10, 16),
          opacity: fadeAnim 
        }}>
          {/* Language Selector */}
          <TouchableOpacity 
            onPress={() => setShowLanguageModal(true)} 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: getResponsiveSize(4, 6, 8),
              paddingHorizontal: getResponsiveSize(6, 8, 12),
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: Colors.modernYellow,
            }}
          >
            <Ionicons name="language" size={getResponsiveSize(12, 14, 16)} color={Colors.modernYellow} style={{ marginRight: 4 }} />
            <Text style={{ 
              color: Colors.modernYellow, 
              fontSize: getResponsiveSize(10, 12, 14), 
              fontWeight: '600' 
            }}>
              {getCurrentLanguageName()}
            </Text>
            <Ionicons name="chevron-down" size={getResponsiveSize(10, 12, 14)} color={Colors.modernYellow} style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity onPress={handleSkip} style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: getResponsiveSize(6, 8, 12),
            paddingHorizontal: getResponsiveSize(8, 12, 16),
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 25,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          }}>
            <Text style={{ 
              color: Colors.text, 
              fontSize: getResponsiveSize(12, 14, 16), 
              fontWeight: '600' 
            }}>
              {t('common.skip')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Main Content Container */}
        <View style={{ 
          flex: 1, 
          justifyContent: 'center',
          paddingVertical: getResponsiveSize(2, 5, 20)
        }}>
          <FlatList
            ref={flatListRef}
            data={screens}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.key}
            onMomentumScrollEnd={e => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setIndex(newIndex);
            }}
            renderItem={({ item }) => (
              <Animated.View style={{ 
                width, 
                height: contentHeight, 
                alignItems: 'center', 
                justifyContent: 'center', 
                paddingHorizontal: getResponsiveSize(12, 16, 24),
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
              }}>
                <View style={{
                  width: cardSize.width,
                  height: cardSize.height,
                  borderRadius: getResponsiveSize(12, 16, 24),
                  overflow: 'hidden',
                  marginBottom: getResponsiveSize(8, 12, 24),
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: getResponsiveSize(4, 8, 12) },
                  shadowOpacity: 0.1,
                  shadowRadius: getResponsiveSize(8, 16, 24),
                  elevation: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.05)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {item.illustration(cardSize, imageSize)}
                  <View style={{
                    position: 'absolute',
                    top: -getResponsiveSize(4, 6, 10),
                    left: -getResponsiveSize(4, 6, 10),
                    right: -getResponsiveSize(4, 6, 10),
                    bottom: -getResponsiveSize(4, 6, 10),
                    borderRadius: getResponsiveSize(16, 20, 34),
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    shadowColor: Colors.modernYellow,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.1,
                    shadowRadius: getResponsiveSize(8, 12, 20),
                    elevation: 5,
                  }} />
                </View>
                <Text style={{ 
                  fontSize: getTitleSize(), 
                  fontWeight: 'bold', 
                  color: Colors.text, 
                  marginTop: getResponsiveSize(4, 8, 20), 
                  textAlign: 'center',
                  marginBottom: getResponsiveSize(2, 4, 12),
                  lineHeight: getTitleSize() * 1.15,
                  paddingHorizontal: getResponsiveSize(8, 12, 20),
                }}>
                  {t(item.title)}
                </Text>
                <Text style={{ 
                  fontSize: getSubtitleSize(), 
                  color: Colors.textSecondary, 
                  marginTop: getResponsiveSize(2, 4, 12), 
                  textAlign: 'center',
                  lineHeight: getSubtitleSize() * 1.25,
                  paddingHorizontal: getResponsiveSize(12, 16, 24),
                }}>
                  {t(item.subtitle)}
                </Text>
              </Animated.View>
            )}
          />
        </View>

        {/* Pagination Dots */}
        <Animated.View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: getResponsiveSize(4, 8, 24),
          opacity: paginationAnim
        }}>
          {screens.map((_, i) => (
            <View
              key={i}
              style={{
                marginHorizontal: getResponsiveSize(3, 4, 6),
                borderRadius: 5,
                width: i === index ? getResponsiveSize(20, 24, 30) : getResponsiveSize(6, 8, 10),
                height: getResponsiveSize(6, 8, 10),
                backgroundColor: i === index ? Colors.modernYellow : 'rgba(0, 0, 0, 0.2)',
                shadowColor: i === index ? Colors.modernYellow : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: i === index ? 0.3 : 0,
                shadowRadius: 4,
                elevation: i === index ? 4 : 0,
              }}
            />
          ))}
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingHorizontal: getResponsiveSize(16, 20, 32), 
          marginBottom: getResponsiveSize(8, 12, 32),
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: buttonScaleAnim }]
        }}>
          {index < screens.length - 1 ? (
            <TouchableOpacity
              onPress={handleNext}
              style={{ 
                flex: 1, 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: Colors.modernYellow, 
                borderRadius: 25, 
                paddingVertical: getResponsiveSize(8, 10, 14), 
                paddingHorizontal: getResponsiveSize(16, 20, 32),
                shadowColor: Colors.modernYellow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ 
                color: '#ffffff', 
                fontSize: getButtonTextSize(), 
                fontWeight: '600', 
                marginRight: 8 
              }}>
                {t('common.next')}
              </Text>
              <Text style={{ color: '#ffffff', fontSize: getButtonTextSize() + 2 }}>→</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleNext}
              style={{ 
                flex: 1, 
                backgroundColor: Colors.modernYellow, 
                borderRadius: 25, 
                paddingVertical: getResponsiveSize(8, 10, 14), 
                alignItems: 'center',
                shadowColor: Colors.modernYellow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ 
                color: '#ffffff', 
                fontSize: getButtonTextSize(), 
                fontWeight: '600' 
              }}>
                {t('onboarding.getStarted')}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </SafeAreaView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: getResponsiveSize(16, 20, 24),
            width: width * 0.85,
            maxHeight: height * 0.7,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: getResponsiveSize(16, 18, 20),
            }}>
              <Text style={{
                fontSize: getResponsiveSize(18, 19, 20),
                fontWeight: 'bold',
                color: Colors.text,
              }}>
                Choose Language
              </Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={getResponsiveSize(20, 22, 24)} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={availableLanguages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: getResponsiveSize(12, 14, 16),
                    paddingHorizontal: getResponsiveSize(8, 10, 12),
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.border,
                    backgroundColor: item.code === currentLanguage ? Colors.sandLight : 'transparent',
                    borderRadius: 8,
                    marginBottom: 4,
                  }}
                  onPress={() => handleLanguageSelect(item.code)}
                >
                  <Text style={{ fontSize: getResponsiveSize(20, 22, 24), marginRight: 12 }}>{item.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: getResponsiveSize(14, 15, 16),
                      fontWeight: '600',
                      color: Colors.text,
                      marginBottom: 2,
                    }}>
                      {item.name}
                    </Text>
                    <Text style={{
                      fontSize: getResponsiveSize(12, 13, 14),
                      color: Colors.textSecondary,
                    }}>
                      {item.nativeName}
                    </Text>
                  </View>
                  {item.code === currentLanguage && (
                    <Ionicons name="checkmark-circle" size={getResponsiveSize(18, 19, 20)} color={Colors.modernYellow} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
