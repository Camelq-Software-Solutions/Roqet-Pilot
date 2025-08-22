import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function PrivacySecurityScreen({ navigation }: any) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.privacySecurity')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>{t('privacy.yourPrivacyAndSecurity')}</Text>
        <Text style={styles.text}>
          {t('privacy.managePrivacySecurity')}
        </Text>
        {/* Add privacy and security options here */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: TITLE_COLOR,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  scrollContent: {
    paddingBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: TITLE_COLOR,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  text: {
    color: Colors.gray700,
    fontSize: Layout.fontSize.md,
    marginBottom: Layout.spacing.md,
    lineHeight: 22,
  },
}); 