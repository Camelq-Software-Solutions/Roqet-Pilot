import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface BikeAnimationProps {
  visible: boolean;
  onAnimationComplete?: () => void;
}

export default function BikeAnimation({ visible, onAnimationComplete }: BikeAnimationProps) {
  const bikePosition = useRef(new Animated.Value(-100)).current;
  const bikeRotation = useRef(new Animated.Value(0)).current;
  const wheelRotation = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset position
      bikePosition.setValue(-100);
      bikeRotation.setValue(0);
      wheelRotation.setValue(0);
      bounceAnim.setValue(0);

      // Start animations
      Animated.parallel([
        // Bike moves from left to right
        Animated.timing(bikePosition, {
          toValue: width + 100,
          duration: 3000,
          useNativeDriver: true,
        }),
        // Bike bounces up and down
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ),
        // Wheels rotate
        Animated.loop(
          Animated.timing(wheelRotation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ),
      ]).start(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
    }
  }, [visible]);

  if (!visible) return null;

  const bikeBounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const wheelSpin = wheelRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bikeContainer,
          {
            transform: [
              { translateX: bikePosition },
              { translateY: bikeBounce },
            ],
          },
        ]}
      >
        {/* Bike body */}
        <View style={styles.bikeBody}>
          <Ionicons name="bicycle" size={60} color={Colors.modernYellow} />
        </View>
        
        {/* Front wheel */}
        <Animated.View
          style={[
            styles.wheel,
            styles.frontWheel,
            {
              transform: [{ rotate: wheelSpin }],
            },
          ]}
        >
          <View style={styles.wheelInner} />
        </Animated.View>
        
        {/* Back wheel */}
        <Animated.View
          style={[
            styles.wheel,
            styles.backWheel,
            {
              transform: [{ rotate: wheelSpin }],
            },
          ]}
        >
          <View style={styles.wheelInner} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10000,
  },

  bikeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeBody: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontWheel: {
    top: 15,
    right: -10,
  },
  backWheel: {
    top: 15,
    left: -10,
  },
  wheelInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
  },
});
