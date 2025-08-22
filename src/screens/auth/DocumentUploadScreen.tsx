import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, StyleSheet, Platform, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '@clerk/clerk-expo';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Add type for navigation prop
interface DocumentUploadScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const DocumentUploadScreen = ({ navigation }: DocumentUploadScreenProps) => {
  const { t } = useTranslation();
  const { user, isLoaded } = useUser();
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [isOver18, setIsOver18] = useState(false);
  const [bikeFrontPhoto, setBikeFrontPhoto] = useState<string | null>(null);
  const [bikeBackPhoto, setBikeBackPhoto] = useState<string | null>(null);
  const [licensePhoto, setLicensePhoto] = useState<string | null>(null);
  const [rcPhoto, setRcPhoto] = useState<string | null>(null);
  const [aadharPhoto, setAadharPhoto] = useState<string | null>(null);
  const [panPhoto, setPanPhoto] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Calculate age based on DOB
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setIsOver18(age >= 18);
  }, [dob]);

  useEffect(() => {
    // Pre-fill email if available
    if (user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  const pickImage = async (setImageFunction: (uri: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setImageFunction(result.assets[0].uri);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');
    setDob(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    if (!isOver18) {
      Alert.alert(t('common.error'), t('auth.mustBe18ToRegister'));
      return;
    }
    if (!email || !gender || !bikeFrontPhoto || !bikeBackPhoto || !licensePhoto || !rcPhoto || !aadharPhoto || !panPhoto) {
      Alert.alert(t('common.error'), t('auth.fillAllFieldsAndUploadDocuments'));
      return;
    }
    if (!termsAccepted) {
      Alert.alert(t('common.error'), t('auth.acceptTermsAndConditions'));
      return;
    }
    try {
      setIsSaving(true);
      await user?.update({
        unsafeMetadata: {
          email,
          dob: dob.toISOString(),
          gender,
          bikeFrontPhoto,
          bikeBackPhoto,
          licensePhoto,
          rcPhoto,
          aadharPhoto,
          panPhoto,
        },
      });
      setIsSaving(false);
      Alert.alert(t('common.success'), t('auth.documentsSubmittedForVerification'));
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      setIsSaving(false);
      Alert.alert(t('common.error'), t('auth.failedToSaveDocuments'));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{t('auth.driverRegistration')}</Text>
      <Text style={styles.label}>{t('auth.email')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('auth.enterYourEmail')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>{t('auth.dateOfBirth')}</Text>
      <TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
        <Text>{formatDate(dob)}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}
      {!isOver18 && dob && (
        <Text style={styles.errorText}>{t('auth.mustBe18ToRegister')}</Text>
      )}
      <Text style={styles.label}>{t('auth.gender')}</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderOption, gender === 'male' && styles.genderSelected]}
          onPress={() => setGender('male')}
        >
          <Text>{t('auth.male')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderOption, gender === 'female' && styles.genderSelected]}
          onPress={() => setGender('female')}
        >
          <Text>{t('auth.female')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderOption, gender === 'other' && styles.genderSelected]}
          onPress={() => setGender('other')}
        >
          <Text>{t('auth.other')}</Text>
        </TouchableOpacity>
      </View>
      {/* Document Upload Sections */}
      <Text style={styles.sectionHeader}>{t('auth.uploadDocuments')}</Text>
      <Text style={styles.label}>{t('auth.bikeFrontPhoto')}</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setBikeFrontPhoto)}>
        <Text>{t('auth.selectImage')}</Text>
      </TouchableOpacity>
      {bikeFrontPhoto && <Image source={{ uri: bikeFrontPhoto }} style={styles.previewImage} />}
      <Text style={styles.label}>{t('auth.bikeBackPhoto')}</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setBikeBackPhoto)}>
        <Text>{t('auth.selectImage')}</Text>
      </TouchableOpacity>
      {bikeBackPhoto && <Image source={{ uri: bikeBackPhoto }} style={styles.previewImage} />}
      <Text style={styles.label}>{t('auth.driversLicense')}</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setLicensePhoto)}>
        <Text>{t('auth.selectImage')}</Text>
      </TouchableOpacity>
      {licensePhoto && <Image source={{ uri: licensePhoto }} style={styles.previewImage} />}
      <Text style={styles.label}>{t('auth.rcRegistrationCertificate')}</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setRcPhoto)}>
        <Text>{t('auth.selectImage')}</Text>
      </TouchableOpacity>
      {rcPhoto && <Image source={{ uri: rcPhoto }} style={styles.previewImage} />}
      <Text style={styles.label}>{t('auth.aadharCard')}</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setAadharPhoto)}>
        <Text>{t('auth.selectImage')}</Text>
      </TouchableOpacity>
      {aadharPhoto && <Image source={{ uri: aadharPhoto }} style={styles.previewImage} />}
      <Text style={styles.label}>{t('auth.panCard')}</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setPanPhoto)}>
        <Text>{t('auth.selectImage')}</Text>
      </TouchableOpacity>
      {panPhoto && <Image source={{ uri: panPhoto }} style={styles.previewImage} />}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 10 }}>
        <Switch
          value={termsAccepted}
          onValueChange={setTermsAccepted}
        />
        <Text style={{ marginLeft: 8 }}>{t('auth.acceptTermsAndConditions')}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.submitButton, (!isOver18 || !termsAccepted || isSaving) && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={!isOver18 || !termsAccepted || isSaving}
      >
        <Text style={styles.submitButtonText}>{isSaving ? 'Saving...' : 'Submit Documents'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  genderOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
    paddingLeft: 0,
    marginTop: 15,
  },
  submitButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default DocumentUploadScreen; 