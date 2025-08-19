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
  
  // Smoke animation values
  const smokeOpacity1 = useRef(new Animated.Value(0)).current;
  const smokeOpacity2 = useRef(new Animated.Value(0)).current;
  const smokeOpacity3 = useRef(new Animated.Value(0)).current;
  const smokeScale1 = useRef(new Animated.Value(0.5)).current;
  const smokeScale2 = useRef(new Animated.Value(0.5)).current;
  const smokeScale3 = useRef(new Animated.Value(0.5)).current;
  const smokePosition1 = useRef(new Animated.Value(0)).current;
  const smokePosition2 = useRef(new Animated.Value(0)).current;
  const smokePosition3 = useRef(new Animated.Value(0)).current;
  
  // Engine vibration animation
  const engineVibration = useRef(new Animated.Value(0)).current;
  
  // Mud dust animation values
  const dustOpacity1 = useRef(new Animated.Value(0)).current;
  const dustOpacity2 = useRef(new Animated.Value(0)).current;
  const dustOpacity3 = useRef(new Animated.Value(0)).current;
  const dustOpacity4 = useRef(new Animated.Value(0)).current;
  const dustOpacity5 = useRef(new Animated.Value(0)).current;
  const dustOpacity6 = useRef(new Animated.Value(0)).current;
  
  const dustScale1 = useRef(new Animated.Value(0.3)).current;
  const dustScale2 = useRef(new Animated.Value(0.3)).current;
  const dustScale3 = useRef(new Animated.Value(0.3)).current;
  const dustScale4 = useRef(new Animated.Value(0.3)).current;
  const dustScale5 = useRef(new Animated.Value(0.3)).current;
  const dustScale6 = useRef(new Animated.Value(0.3)).current;
  
  const dustPosition1 = useRef(new Animated.Value(0)).current;
  const dustPosition2 = useRef(new Animated.Value(0)).current;
  const dustPosition3 = useRef(new Animated.Value(0)).current;
  const dustPosition4 = useRef(new Animated.Value(0)).current;
  const dustPosition5 = useRef(new Animated.Value(0)).current;
  const dustPosition6 = useRef(new Animated.Value(0)).current;
  
  const dustRotation1 = useRef(new Animated.Value(0)).current;
  const dustRotation2 = useRef(new Animated.Value(0)).current;
  const dustRotation3 = useRef(new Animated.Value(0)).current;
  const dustRotation4 = useRef(new Animated.Value(0)).current;
  const dustRotation5 = useRef(new Animated.Value(0)).current;
  const dustRotation6 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset position
      bikePosition.setValue(-100);
      bikeRotation.setValue(0);
      wheelRotation.setValue(0);
      bounceAnim.setValue(0);
      
      // Reset smoke animations
      smokeOpacity1.setValue(0);
      smokeOpacity2.setValue(0);
      smokeOpacity3.setValue(0);
      smokeScale1.setValue(0.5);
      smokeScale2.setValue(0.5);
      smokeScale3.setValue(0.5);
      smokePosition1.setValue(0);
      smokePosition2.setValue(0);
      smokePosition3.setValue(0);
      engineVibration.setValue(0);
      
      // Reset dust animations
      dustOpacity1.setValue(0);
      dustOpacity2.setValue(0);
      dustOpacity3.setValue(0);
      dustOpacity4.setValue(0);
      dustOpacity5.setValue(0);
      dustOpacity6.setValue(0);
      
      dustScale1.setValue(0.3);
      dustScale2.setValue(0.3);
      dustScale3.setValue(0.3);
      dustScale4.setValue(0.3);
      dustScale5.setValue(0.3);
      dustScale6.setValue(0.3);
      
      dustPosition1.setValue(0);
      dustPosition2.setValue(0);
      dustPosition3.setValue(0);
      dustPosition4.setValue(0);
      dustPosition5.setValue(0);
      dustPosition6.setValue(0);
      
      dustRotation1.setValue(0);
      dustRotation2.setValue(0);
      dustRotation3.setValue(0);
      dustRotation4.setValue(0);
      dustRotation5.setValue(0);
      dustRotation6.setValue(0);

      // Start bike animations
      Animated.parallel([
        // Bike moves from left to right (slower)
        Animated.timing(bikePosition, {
          toValue: width + 100,
          duration: 6000, // Increased from 3000ms to 6000ms
          useNativeDriver: true,
        }),
        // Bike bounces up and down
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 800, // Increased from 500ms to 800ms
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 800, // Increased from 500ms to 800ms
              useNativeDriver: true,
            }),
          ])
        ),
        // Wheels rotate (slower)
        Animated.loop(
          Animated.timing(wheelRotation, {
            toValue: 1,
            duration: 1500, // Increased from 1000ms to 1500ms
            useNativeDriver: true,
          })
        ),
      ]).start(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });

      // Start smoke animations with delays
      setTimeout(() => {
        // First smoke puff
        Animated.parallel([
          Animated.timing(smokeOpacity1, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(smokeScale1, {
            toValue: 1.5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(smokePosition1, {
            toValue: -30,
            duration: 2000,
            useNativeDriver: true,
          }),
          // Engine vibration
          Animated.sequence([
            Animated.timing(engineVibration, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(engineVibration, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          Animated.timing(smokeOpacity1, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        });
      }, 1000);

      setTimeout(() => {
        // Second smoke puff
        Animated.parallel([
          Animated.timing(smokeOpacity2, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(smokeScale2, {
            toValue: 1.5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(smokePosition2, {
            toValue: -30,
            duration: 2000,
            useNativeDriver: true,
          }),
          // Engine vibration
          Animated.sequence([
            Animated.timing(engineVibration, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(engineVibration, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          Animated.timing(smokeOpacity2, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        });
      }, 3000);

      setTimeout(() => {
        // Third smoke puff
        Animated.parallel([
          Animated.timing(smokeOpacity3, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(smokeScale3, {
            toValue: 1.5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(smokePosition3, {
            toValue: -30,
            duration: 2000,
            useNativeDriver: true,
          }),
          // Engine vibration
          Animated.sequence([
            Animated.timing(engineVibration, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(engineVibration, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          Animated.timing(smokeOpacity3, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start();
                 });
       }, 5000);
       
       // Start continuous dust animations
       const startDustAnimation = () => {
         // Dust particle 1
         setTimeout(() => {
           Animated.parallel([
             Animated.timing(dustOpacity1, {
               toValue: 0.6,
               duration: 800,
               useNativeDriver: true,
             }),
             Animated.timing(dustScale1, {
               toValue: 1.2,
               duration: 1500,
               useNativeDriver: true,
             }),
             Animated.timing(dustPosition1, {
               toValue: -25,
               duration: 1500,
               useNativeDriver: true,
             }),
             Animated.timing(dustRotation1, {
               toValue: 1,
               duration: 1500,
               useNativeDriver: true,
             }),
           ]).start(() => {
             Animated.timing(dustOpacity1, {
               toValue: 0,
               duration: 500,
               useNativeDriver: true,
             }).start();
           });
         }, 500);
         
         // Dust particle 2
         setTimeout(() => {
           Animated.parallel([
             Animated.timing(dustOpacity2, {
               toValue: 0.5,
               duration: 800,
               useNativeDriver: true,
             }),
             Animated.timing(dustScale2, {
               toValue: 1.0,
               duration: 1200,
               useNativeDriver: true,
             }),
             Animated.timing(dustPosition2, {
               toValue: -20,
               duration: 1200,
               useNativeDriver: true,
             }),
             Animated.timing(dustRotation2, {
               toValue: 1,
               duration: 1200,
               useNativeDriver: true,
             }),
           ]).start(() => {
             Animated.timing(dustOpacity2, {
               toValue: 0,
               duration: 500,
               useNativeDriver: true,
             }).start();
           });
         }, 1200);
         
         // Dust particle 3
         setTimeout(() => {
           Animated.parallel([
             Animated.timing(dustOpacity3, {
               toValue: 0.7,
               duration: 800,
               useNativeDriver: true,
             }),
             Animated.timing(dustScale3, {
               toValue: 1.3,
               duration: 1800,
               useNativeDriver: true,
             }),
             Animated.timing(dustPosition3, {
               toValue: -30,
               duration: 1800,
               useNativeDriver: true,
             }),
             Animated.timing(dustRotation3, {
               toValue: 1,
               duration: 1800,
               useNativeDriver: true,
             }),
           ]).start(() => {
             Animated.timing(dustOpacity3, {
               toValue: 0,
               duration: 500,
               useNativeDriver: true,
             }).start();
           });
         }, 1800);
         
         // Dust particle 4
         setTimeout(() => {
           Animated.parallel([
             Animated.timing(dustOpacity4, {
               toValue: 0.4,
               duration: 800,
               useNativeDriver: true,
             }),
             Animated.timing(dustScale4, {
               toValue: 0.9,
               duration: 1000,
               useNativeDriver: true,
             }),
             Animated.timing(dustPosition4, {
               toValue: -18,
               duration: 1000,
               useNativeDriver: true,
             }),
             Animated.timing(dustRotation4, {
               toValue: 1,
               duration: 1000,
               useNativeDriver: true,
             }),
           ]).start(() => {
             Animated.timing(dustOpacity4, {
               toValue: 0,
               duration: 500,
               useNativeDriver: true,
             }).start();
           });
         }, 2400);
         
         // Dust particle 5
         setTimeout(() => {
           Animated.parallel([
             Animated.timing(dustOpacity5, {
               toValue: 0.6,
               duration: 800,
               useNativeDriver: true,
             }),
             Animated.timing(dustScale5, {
               toValue: 1.1,
               duration: 1400,
               useNativeDriver: true,
             }),
             Animated.timing(dustPosition5, {
               toValue: -22,
               duration: 1400,
               useNativeDriver: true,
             }),
             Animated.timing(dustRotation5, {
               toValue: 1,
               duration: 1400,
               useNativeDriver: true,
             }),
           ]).start(() => {
             Animated.timing(dustOpacity5, {
               toValue: 0,
               duration: 500,
               useNativeDriver: true,
             }).start();
           });
         }, 3000);
         
         // Dust particle 6
         setTimeout(() => {
           Animated.parallel([
             Animated.timing(dustOpacity6, {
               toValue: 0.5,
               duration: 800,
               useNativeDriver: true,
             }),
             Animated.timing(dustScale6, {
               toValue: 1.0,
               duration: 1300,
               useNativeDriver: true,
             }),
             Animated.timing(dustPosition6, {
               toValue: -25,
               duration: 1300,
               useNativeDriver: true,
             }),
             Animated.timing(dustRotation6, {
               toValue: 1,
               duration: 1300,
               useNativeDriver: true,
             }),
           ]).start(() => {
             Animated.timing(dustOpacity6, {
               toValue: 0,
               duration: 500,
               useNativeDriver: true,
             }).start();
           });
         }, 3600);
       };
       
       // Start dust animation after a short delay
       setTimeout(startDustAnimation, 800);
       
       // Create continuous dust animation loop
       const createContinuousDust = () => {
         const dustParticles = [
           { opacity: dustOpacity1, scale: dustScale1, position: dustPosition1, rotation: dustRotation1 },
           { opacity: dustOpacity2, scale: dustScale2, position: dustPosition2, rotation: dustRotation2 },
           { opacity: dustOpacity3, scale: dustScale3, position: dustPosition3, rotation: dustRotation3 },
           { opacity: dustOpacity4, scale: dustScale4, position: dustPosition4, rotation: dustRotation4 },
           { opacity: dustOpacity5, scale: dustScale5, position: dustPosition5, rotation: dustRotation5 },
           { opacity: dustOpacity6, scale: dustScale6, position: dustPosition6, rotation: dustRotation6 },
         ];
         
         let currentParticle = 0;
         
         const animateDustParticle = () => {
           const particle = dustParticles[currentParticle];
           
           // Reset particle
           particle.opacity.setValue(0);
           particle.scale.setValue(0.3);
           particle.position.setValue(0);
           particle.rotation.setValue(0);
           
           // Animate particle
           Animated.parallel([
             Animated.timing(particle.opacity, {
               toValue: 0.6 + Math.random() * 0.3, // Random opacity between 0.6-0.9
               duration: 600 + Math.random() * 400, // Random duration between 600-1000ms
               useNativeDriver: true,
             }),
             Animated.timing(particle.scale, {
               toValue: 0.8 + Math.random() * 0.7, // Random scale between 0.8-1.5
               duration: 1000 + Math.random() * 800, // Random duration between 1000-1800ms
               useNativeDriver: true,
             }),
             Animated.timing(particle.position, {
               toValue: -(15 + Math.random() * 20), // Random position between -15 to -35
               duration: 1000 + Math.random() * 800,
               useNativeDriver: true,
             }),
             Animated.timing(particle.rotation, {
               toValue: 1,
               duration: 1000 + Math.random() * 800,
               useNativeDriver: true,
             }),
           ]).start(() => {
             Animated.timing(particle.opacity, {
               toValue: 0,
               duration: 400,
               useNativeDriver: true,
             }).start();
           });
           
           // Move to next particle
           currentParticle = (currentParticle + 1) % dustParticles.length;
           
           // Schedule next animation
           setTimeout(animateDustParticle, 300 + Math.random() * 400); // Random interval between 300-700ms
         };
         
         // Start the continuous loop
         setTimeout(animateDustParticle, 1500);
       };
       
       // Start continuous dust animation
       setTimeout(createContinuousDust, 2000);
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

  const engineShake = engineVibration.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  // Dust rotation interpolations
  const dustSpin1 = dustRotation1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const dustSpin2 = dustRotation2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const dustSpin3 = dustRotation3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const dustSpin4 = dustRotation4.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const dustSpin5 = dustRotation5.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const dustSpin6 = dustRotation6.interpolate({
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
        {/* Smoke effects */}
        <Animated.View
          style={[
            styles.smoke,
            styles.smoke1,
            {
              opacity: smokeOpacity1,
              transform: [
                { scale: smokeScale1 },
                { translateY: smokePosition1 },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.smoke,
            styles.smoke2,
            {
              opacity: smokeOpacity2,
              transform: [
                { scale: smokeScale2 },
                { translateY: smokePosition2 },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.smoke,
            styles.smoke3,
            {
              opacity: smokeOpacity3,
              transform: [
                { scale: smokeScale3 },
                { translateY: smokePosition3 },
              ],
            },
          ]}
                 />
         
         {/* Dust particles */}
         <Animated.View
           style={[
             styles.dust,
             styles.dust1,
             {
               opacity: dustOpacity1,
               transform: [
                 { scale: dustScale1 },
                 { translateY: dustPosition1 },
                 { rotate: dustSpin1 },
               ],
             },
           ]}
         />
         <Animated.View
           style={[
             styles.dust,
             styles.dust2,
             {
               opacity: dustOpacity2,
               transform: [
                 { scale: dustScale2 },
                 { translateY: dustPosition2 },
                 { rotate: dustSpin2 },
               ],
             },
           ]}
         />
         <Animated.View
           style={[
             styles.dust,
             styles.dust3,
             {
               opacity: dustOpacity3,
               transform: [
                 { scale: dustScale3 },
                 { translateY: dustPosition3 },
                 { rotate: dustSpin3 },
               ],
             },
           ]}
         />
         <Animated.View
           style={[
             styles.dust,
             styles.dust4,
             {
               opacity: dustOpacity4,
               transform: [
                 { scale: dustScale4 },
                 { translateY: dustPosition4 },
                 { rotate: dustSpin4 },
               ],
             },
           ]}
         />
         <Animated.View
           style={[
             styles.dust,
             styles.dust5,
             {
               opacity: dustOpacity5,
               transform: [
                 { scale: dustScale5 },
                 { translateY: dustPosition5 },
                 { rotate: dustSpin5 },
               ],
             },
           ]}
         />
         <Animated.View
           style={[
             styles.dust,
             styles.dust6,
             {
               opacity: dustOpacity6,
               transform: [
                 { scale: dustScale6 },
                 { translateY: dustPosition6 },
                 { rotate: dustSpin6 },
               ],
             },
           ]}
         />
         
         {/* Bike body */}
        <Animated.View 
          style={[
            styles.bikeBody,
            {
              transform: [{ translateX: engineShake }],
            },
          ]}
        >
          <Ionicons name="bicycle" size={60} color={Colors.modernYellow} />
        </Animated.View>
        
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
  smoke: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(255, 255, 255, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  smoke1: {
    top: 25,
    left: -15,
  },
  smoke2: {
    top: 20,
    left: -20,
  },
  smoke3: {
    top: 30,
    left: -10,
  },
  dust: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(139, 69, 19, 0.8)', // Brown mud color
    borderWidth: 1,
    borderColor: 'rgba(160, 82, 45, 0.6)',
    shadowColor: 'rgba(139, 69, 19, 0.9)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 3,
  },
  dust1: {
    top: 35,
    left: -8,
  },
  dust2: {
    top: 32,
    left: -12,
  },
  dust3: {
    top: 38,
    left: -6,
  },
  dust4: {
    top: 30,
    left: -15,
  },
  dust5: {
    top: 36,
    left: -10,
  },
  dust6: {
    top: 34,
    left: -13,
  },
});
