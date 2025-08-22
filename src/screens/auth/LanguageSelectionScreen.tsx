import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getSupportedLanguages, getCurrentLanguage } from '../../i18n';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const { width } = Dimensions.get('window');

interface LanguageSelectionScreenProps {
  navigation?: any;
  isModal?: boolean;
  onClose?: () => void;
}

export default function LanguageSelectionScreen({ 
  navigation, 
  isModal = false, 
  onClose 
}: LanguageSelectionScreenProps) {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(getCurrentLanguage());
  const [isChanging, setIsChanging] = useState(false);
  const supportedLanguages = getSupportedLanguages();

  const handleLanguageSelect = async (languageCode: string) => {
    if (selectedLanguage === languageCode || isChanging) {
      if (isModal && onClose) {
        onClose();
      } else if (navigation) {
        navigation.goBack();
      }
      return;
    }
    
    setIsChanging(true);
    setSelectedLanguage(languageCode);
    
    // Close modal immediately for better UX
    if (isModal && onClose) {
      onClose();
    } else if (navigation) {
      navigation.goBack();
    }
    
    // Change language in background
    try {
      await changeLanguage(languageCode);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const renderLanguageItem = (language: any) => (
    <TouchableOpacity
      key={language.code}
      style={[
        styles.languageItem,
        selectedLanguage === language.code && styles.selectedLanguageItem
      ]}
      onPress={() => handleLanguageSelect(language.code)}
      activeOpacity={0.6}
    >
      <View style={styles.languageInfo}>
        <Text style={[
          styles.languageName,
          selectedLanguage === language.code && styles.selectedLanguageText
        ]}>
          {language.nativeName}
        </Text>
        <Text style={[
          styles.languageCode,
          selectedLanguage === language.code && styles.selectedLanguageText
        ]}>
          {language.name}
        </Text>
      </View>
      {selectedLanguage === language.code && (
        <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );

  const content = (
    <View style={styles.container}>
      {!isModal && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('settings.language')}</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.languageSubtitle')}</Text>
          <View style={styles.languageCard}>
            {supportedLanguages.map(renderLanguageItem)}
          </View>
        </View>
      </ScrollView>
    </View>
  );

  if (isModal) {
    return (
      <Modal
        visible={true}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('settings.language')}</Text>
            <View style={styles.placeholder} />
          </View>
          {content}
        </SafeAreaView>
      </Modal>
    );
  }

  return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalContainer: {
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: Layout.spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
  },
  closeButton: {
    padding: Layout.spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
  },
  headerTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  modalTitle: {
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
  languageCard: {
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
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  selectedLanguageItem: {
    backgroundColor: Colors.primary + '10',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: Layout.fontSize.md,
    fontWeight: '500',
    color: Colors.text,
  },
  languageCode: {
    fontSize: Layout.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  selectedLanguageText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
