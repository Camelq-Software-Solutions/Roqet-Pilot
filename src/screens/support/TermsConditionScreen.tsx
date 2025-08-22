import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, TITLE_COLOR } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function TermsConditionScreen({ navigation }: any) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={TITLE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('support.termsAndConditions')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>{t('terms.introduction')}</Text>
        <Text style={styles.text}>
          {t('terms.welcomeMessage')}
        </Text>
        <Text style={styles.sectionTitle}>{t('terms.userResponsibilities')}</Text>
        <Text style={styles.text}>
          {t('terms.accountConfidentiality')}
        </Text>
        <Text style={styles.sectionTitle}>{t('terms.payments')}</Text>
        <Text style={styles.text}>
          {t('terms.paymentMethods')}
        </Text>
        <Text style={styles.sectionTitle}>{t('terms.limitationOfLiability')}</Text>
        <Text style={styles.text}>
          {t('terms.liabilityDisclaimer')}
        </Text>
        <Text style={styles.sectionTitle}>{t('terms.changesToTerms')}</Text>
        <Text style={styles.text}>
          {t('terms.termsUpdates')}
        </Text>
        <Text style={styles.sectionTitle}>{t('terms.contactUs')}</Text>
        <Text style={styles.text}>
          {t('terms.contactSupport')}
        </Text>
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