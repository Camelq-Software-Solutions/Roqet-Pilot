import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList, Image, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage } from '../../i18n';
import LanguageSelectionScreen from './LanguageSelectionScreen';

const { width, height } = Dimensions.get('window');

const PRIMARY_GREEN = '#219C7E';
const TITLE_COLOR = '#111827';
const SUBTITLE_COLOR = '#6B7280';

export default function OnboardingSwiper({ navigation }: { navigation?: any }) {
  const { t } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const currentLanguage = getCurrentLanguage();
  const buttonScale = useRef(new Animated.Value(0)).current;

  // Debug translations
  console.log('🌐 SplashScreen - Current language:', currentLanguage);
  console.log('🌐 SplashScreen - Welcome text:', t('onboarding.welcome'));
  console.log('🌐 SplashScreen - Skip text:', t('common.skip'));

  // Define screens array inside component to ensure translations are available
  const screens = [
    {
      key: 'booking',
      illustration: (
        <View style={{ width: 300, height: 260, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <Image source={require('../../../assets/images/Mainlogo.jpeg')} style={{ width: 340, height: 370, resizeMode: 'contain' }} />
        </View>
      ),
      title: t('onboarding.welcome'),
      subtitle: t('onboarding.welcomeSubtitle'),
    },
    {
      key: 'affordable',
      illustration: (
        <View style={{ width: 300, height: 260, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <Image source={require('../../../assets/images/Grow.jpg.jpeg')} style={{ width: 450, height: 390, resizeMode: 'contain' }} />
        </View>
      ),
      title: t('onboarding.rideSmart'),
      subtitle: t('onboarding.rideSmartSubtitle'),
    },
    {
      key: 'safe',
      illustration: (
        <View style={{ width: 300, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <Image source={require('../../../assets/images/Bossimage.jpg.jpeg')} style={{ width: 450, height: 370, resizeMode: 'contain' }} />
        </View>
      ),
      title: t('onboarding.beYourBoss'),
      subtitle: t('onboarding.beYourBossSubtitle'),
    },
    {
      key: 'eco',
      illustration: (
        <View style={{ width: 300, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <Image source={require('../../../assets/images/Community.jpg.jpeg')} style={{ width: 450, height: 370, resizeMode: 'contain' }} />
        </View>
      ),
      title: t('onboarding.community'),
      subtitle: t('onboarding.communitySubtitle'),
    },
  ];

  const handleNext = () => {
    if (index < screens.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      navigation?.replace?.('Login');
    }
  };

  const handleSkip = () => {
    navigation?.replace?.('Login');
  };

  useEffect(() => {
    // Animate language button entrance
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
      delay: 500,
    }).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Language Button */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
          zIndex: 1000,
          transform: [{ scale: buttonScale }],
        }}
      >
        <TouchableOpacity
          onPress={() => setShowLanguageModal(true)}
          activeOpacity={0.7}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 25,
            padding: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
            borderWidth: 1,
            borderColor: 'rgba(33, 156, 126, 0.1)',
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: 50,
          }}
        >
          <Ionicons name="language" size={24} color={PRIMARY_GREEN} />
          <Text style={{ 
            marginLeft: 6, 
            fontSize: 12, 
            fontWeight: '600', 
            color: PRIMARY_GREEN,
            textTransform: 'uppercase'
          }}>
            {currentLanguage}
          </Text>
        </TouchableOpacity>
      </Animated.View>

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
          <View style={{ width, height, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            {item.illustration}
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: TITLE_COLOR, marginTop: 32, textAlign: 'center' }}>{item.title}</Text>
            <Text style={{ fontSize: 16, color: SUBTITLE_COLOR, marginTop: 16, textAlign: 'center' }}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
        {screens.map((_, i) => (
          <View
            key={i}
            style={{
              marginHorizontal: 4,
              borderRadius: 9999,
              width: i === index ? 20 : 10,
              height: 10,
              backgroundColor: i === index ? PRIMARY_GREEN : '#E5E7EB',
              opacity: i === index ? 1 : 0.5,
            }}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, marginBottom: 40 }}>
        {index < screens.length - 1 ? (
          <>
            <TouchableOpacity onPress={handleSkip} style={{ paddingVertical: 12, paddingHorizontal: 24 }}>
              <Text style={{ color: PRIMARY_GREEN, fontSize: 16, fontWeight: '600' }}>{t('common.skip')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: PRIMARY_GREEN, borderRadius: 9999, paddingVertical: 14, paddingHorizontal: 32 }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginRight: 8 }}>{t('common.next')}</Text>
              <Text style={{ color: '#fff', fontSize: 18 }}>→</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            style={{ flex: 1, backgroundColor: PRIMARY_GREEN, borderRadius: 9999, paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{t('common.getStarted')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <LanguageSelectionScreen
          isModal={true}
          onClose={() => setShowLanguageModal(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}
