import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePushNotifications } from '../../contexts/PushNotificationContext';
import { useRideNotifications } from '../../hooks/useRideNotifications';

const { width } = Dimensions.get('window');

export default function SettingsScreen({ navigation }: any) {
  const { t } = useLanguage();
  const { isInitialized: pushNotificationsInitialized, pushToken } = usePushNotifications();
  const { sendSystemNotification } = useRideNotifications();
  const [notifications, setNotifications] = useState(true);
  // const [locationServices, setLocationServices] = useState(true);
  const [shareData, setShareData] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const settingSections = [
    {
      title: t('settings.account'),
      items: [
        {
          icon: 'person-outline',
          title: t('settings.personalInformation'),
          subtitle: t('settings.updateProfileDetails'),
          action: () => navigation.navigate('PersonalDetails'),
        },
        {
          icon: 'shield-checkmark-outline',
          title: t('settings.privacySecurity'),
          subtitle: t('settings.managePrivacySettings'),
          action: () => navigation.navigate('PrivacySecurity'),
        },
      ],
    },
    {
      title: t('settings.preferences'),
      items: [
        {
          icon: 'notifications-outline',
          title: t('settings.pushNotifications'),
          subtitle: pushNotificationsInitialized ? 'Push notifications enabled' : 'Push notifications disabled',
          toggle: true,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'flash-outline',
          title: t('notifications.testNotification'),
          subtitle: t('notifications.sendTestNotification'),
          action: async () => {
            if (pushNotificationsInitialized) {
              await sendSystemNotification(
                t('notifications.testNotification'),
                t('notifications.testNotificationMessage')
              );
            }
          },
        },
        // {
        //   icon: 'location-outline',
        //   title: 'Location Services',
        //   subtitle: 'Allow location access for better experience',
        //   toggle: true,
        //   value: locationServices,
        //   onToggle: setLocationServices,
        // },
        {
          icon: 'card-outline',
          title: t('settings.autoPayment'),
          subtitle: t('settings.automaticallyPayForRides'),
          action: () => navigation.navigate('AutoPayment'),
        },
        {
          icon: 'language-outline',
          title: t('settings.language'),
          subtitle: t('settings.choosePreferredLanguage'),
          action: () => navigation.navigate('Language'),
        },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        {
          icon: 'help-circle-outline',
          title: t('settings.helpCenter'),
          subtitle: t('settings.getHelpWithAccount'),
          action: () => navigation.navigate('HelpSupport'),
        },
        {
          icon: 'star-outline',
          title: t('settings.rateApp'),
          subtitle: t('settings.shareFeedback'),
          action: () => console.log('Rate App'),
        },
      ],
    },
    {
      title: t('settings.legal'),
      items: [
        {
          icon: 'document-text-outline',
          title: t('settings.termsOfService'),
          subtitle: t('settings.readTermsAndConditions'),
          action: () => navigation.navigate('TermsCondition'),
        },
        // {
        //   icon: 'share-outline',
        //   title: 'Data Sharing',
        //   subtitle: 'Control how your data is shared',
        //   toggle: true,
        //   value: shareData,
        //   onToggle: setShareData,
        // },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.settingItem}
      onPress={item.action}
      disabled={item.toggle}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={item.icon} size={20} color={Colors.modernYellow} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.toggle ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.gray300, true: Colors.modernYellow }}
            thumbColor={Colors.white}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.settings')}</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <Animated.View 
            key={sectionIndex} 
            style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </Animated.View>
        ))}

        {/* App Info */}
        <Animated.View style={[styles.appInfo, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
        </Animated.View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: Layout.spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
  },
  headerTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Layout.fontSize.md,
    fontWeight: '500',
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingRight: {
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
    marginTop: Layout.spacing.lg,
  },
  appVersion: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  appBuild: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
});
