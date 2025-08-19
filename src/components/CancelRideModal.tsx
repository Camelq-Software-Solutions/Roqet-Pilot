import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CancelRideModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelRideModal({ visible, onClose, onConfirm }: CancelRideModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const anim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const cancelReasons = [
    'Passenger not found at pickup location',
    'Passenger requested cancellation',
    'Vehicle breakdown',
    'Traffic/road conditions',
    'Personal emergency',
    'Unsafe pickup location',
    'Other'
  ];

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
      setSelectedReason('');
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View style={{
        flex: 1,
        backgroundColor: anim.interpolate({ 
          inputRange: [0, 1], 
          outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'] 
        }),
        justifyContent: 'center',
        alignItems: 'center',
        opacity: anim,
      }}>
        <Animated.View style={{
          width: '90%',
          maxWidth: 400,
          backgroundColor: Colors.white,
          borderRadius: 20,
          padding: 24,
          transform: [{ 
            scale: anim.interpolate({ 
              inputRange: [0, 1], 
              outputRange: [0.9, 1] 
            }) 
          }],
        }}>
          <View style={styles.header}>
            <Text style={styles.title}>Cancel Ride</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.subtitle}>
            Please select a reason for cancelling this ride
          </Text>
          
          <ScrollView style={styles.reasonsContainer} showsVerticalScrollIndicator={false}>
            {cancelReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.reasonItem,
                  selectedReason === reason && styles.reasonItemSelected
                ]}
                onPress={() => setSelectedReason(reason)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.radioButton,
                  selectedReason === reason && styles.radioButtonSelected
                ]}>
                  {selectedReason === reason && (
                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                  )}
                </View>
                <Text style={[
                  styles.reasonText,
                  selectedReason === reason && styles.reasonTextSelected
                ]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Keep Ride</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedReason && styles.confirmButtonDisabled
              ]}
              onPress={handleConfirm}
              disabled={!selectedReason}
              activeOpacity={selectedReason ? 0.7 : 1}
            >
              <Text style={styles.confirmButtonText}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  reasonsContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reasonItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: Colors.modernYellow,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: Colors.modernYellow,
    backgroundColor: Colors.modernYellow,
  },
  reasonText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '400',
    flex: 1,
  },
  reasonTextSelected: {
    color: Colors.modernYellow,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.modernYellow,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
