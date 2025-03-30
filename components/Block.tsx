import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Pressable, Animated, Easing, View, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { Block as BlockType } from '@/types/game';
import { SWAP_ANIMATION_DURATION, FALL_ANIMATION_DURATION } from '@/constants/game';

// Particle component for matched effects
const Particle = ({ color, size, left, top, delay }: { 
  color: string;
  size: number;
  left: number;
  top: number;
  delay: number;
}) => {
  const animationValue = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  const translateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30 + Math.random() * 60] // Random direction
  });
  
  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40 - Math.random() * 30] // Always up with random height
  });
  
  const scale = animationValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 1, 0]
  });
  
  const opacity = animationValue.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0, 1, 0]
  });
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
        left: left,
        top: top,
        opacity,
        transform: [
          { translateX },
          { translateY },
          { scale }
        ]
      }}
    />
  );
};

// Create particle component that matches the shape
const ShapeParticle = ({ 
  shape, 
  color, 
  size, 
  left, 
  top, 
  delay, 
  image 
}: { 
  shape: string;
  color: string;
  size: number;
  left: number;
  top: number;
  delay: number;
  image: any;
}) => {
  const animationValue = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  const translateX = animationValue.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, -20 + Math.random() * 40, -10 + Math.random() * 20, -30 + Math.random() * 60]
  });
  
  const translateY = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -20 - Math.random() * 20, -60 - Math.random() * 40]
  });
  
  const scale = animationValue.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1.2, 0.8, 0]
  });
  
  const opacity = animationValue.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 0.8, 0]
  });
  
  const rotate = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${-180 + Math.random() * 360}deg`]
  });
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: left,
        top: top,
        opacity,
        transform: [
          { translateX },
          { translateY },
          { scale },
          { rotate }
        ],
        shadowColor: color,
        shadowOpacity: 0.8,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
        zIndex: 100,
      }}
    >
      <Image 
        source={image}
        style={{ 
          width: '100%', 
          height: '100%',
          tintColor: color
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

interface BlockProps {
  block: BlockType;
  size: number;
  onPress: (block: BlockType) => void;
}

const Block: React.FC<BlockProps> = ({ block, size, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const swapAnim = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const fallAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;
  const elasticAnim = React.useRef(new Animated.Value(1)).current;
  const [showParticles, setShowParticles] = useState(false);
  
  // Handle selection animation
  useEffect(() => {
    if (block.isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [block.isSelected]);
  
  // Handle swapping animation - improved with better motion
  useEffect(() => {
    if (block.isSwapping) {
      // Calculate direction of swap based on block position
      const direction = {
        x: block.col % 2 === 0 ? 1 : -1,
        y: block.row % 2 === 0 ? 0.3 : -0.3
      };
      
      // Reset elastic animation
      elasticAnim.setValue(1);
      
      // Create a squish effect when blocks swap
      const squishAnimation = Animated.sequence([
        Animated.timing(elasticAnim, {
          toValue: 0.8,
          duration: SWAP_ANIMATION_DURATION * 0.3,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(elasticAnim, {
          toValue: 1.1, 
          duration: SWAP_ANIMATION_DURATION * 0.3,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(elasticAnim, {
          toValue: 1,
          duration: SWAP_ANIMATION_DURATION * 0.4,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        })
      ]);
      
      // Create the swap animation with arc motion
      const swapAnimation = Animated.timing(swapAnim, {
        toValue: { 
          x: size * direction.x, 
          y: size * direction.y
        },
        duration: SWAP_ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      });
      
      // Run animations in parallel
      Animated.parallel([
        squishAnimation,
        swapAnimation
      ]).start(() => {
        // Reset position after animation is done
        swapAnim.setValue({ x: 0, y: 0 });
      });
    } else {
      swapAnim.setValue({ x: 0, y: 0 });
      elasticAnim.setValue(1);
    }
  }, [block.isSwapping, size, block.row, block.col]);
  
  // Handle falling animation
  useEffect(() => {
    if (block.isFalling) {
      // Start from above the board
      fallAnim.setValue(-size * 2);
      
      Animated.timing(fallAnim, {
        toValue: 0,
        duration: FALL_ANIMATION_DURATION,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    } else {
      fallAnim.setValue(0);
    }
  }, [block.isFalling, size]);
  
  // Handle matching animation
  useEffect(() => {
    if (block.isMatched) {
      // Show particles before fading out
      setShowParticles(true);
      
      // Animate the match with scale, rotation and fade
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset after animation
        setTimeout(() => {
          setShowParticles(false);
        }, 500);
      });
    } else {
      opacityAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [block.isMatched]);
  
  // Mengambil data objek shape dari COLORS.blocks
  const shapeObject = COLORS.blocks[block.colorIndex];
  const blockColor = shapeObject.color;
  const primaryGradient = shapeObject.primaryGradient;
  const secondaryGradient = shapeObject.secondaryGradient;
  const highlight = shapeObject.highlight;
  const shapeImage = shapeObject.image;
  
  // Create particles for match effect
  const renderParticles = () => {
    if (!showParticles) return null;
    
    const particles = [];
    const particleCount = 8; // Number of particles
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(
        <ShapeParticle 
          key={i}
          shape={shapeObject.shape}
          color={highlight}
          image={shapeImage}
          size={10 + Math.random() * 8}
          left={size * 0.5}
          top={size * 0.5}
          delay={i * 50}
        />
      );
    }
    
    return particles;
  };
  
  // Special block rendering
  const renderBlockContent = () => {
    if (block.specialType) {
      switch (block.specialType) {
        case 'striped-horizontal':
          return (
            <View 
              style={[
                styles.blockContent, 
                styles.specialBlock,
              ]}
            >
              <LinearGradient
                colors={[`${blockColor}80`, blockColor]}
                style={styles.blockGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.candyGlow} />
              <Image 
                source={shapeImage} 
                style={styles.shapeImage} 
                resizeMode="contain"
              />
              <Animated.View style={styles.stripedHorizontal} />
            </View>
          );
        case 'striped-vertical':
          return (
            <View 
              style={[
                styles.blockContent, 
                styles.specialBlock,
              ]}
            >
              <LinearGradient
                colors={[`${blockColor}80`, blockColor]}
                style={styles.blockGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.candyGlow} />
              <Image 
                source={shapeImage} 
                style={styles.shapeImage} 
                resizeMode="contain"
              />
              <Animated.View style={styles.stripedVertical} />
            </View>
          );
        case 'wrapped':
          return (
            <View 
              style={[
                styles.blockContent, 
                styles.specialBlock,
              ]}
            >
              <LinearGradient
                colors={[`${blockColor}80`, blockColor]}
                style={styles.blockGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.candyGlow} />
              <Image 
                source={shapeImage} 
                style={styles.shapeImage} 
                resizeMode="contain"
              />
              <Animated.View style={styles.wrappedOuter} />
              <Animated.View style={styles.wrappedInner} />
            </View>
          );
        case 'bomb':
          return (
            <View 
              style={[
                styles.blockContent, 
                styles.specialBlock, 
                styles.bombBlock,
              ]}
            >
              <LinearGradient
                colors={['#77777780', '#333333']}
                style={styles.blockGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={[styles.candyGlow, {backgroundColor: '#444'}]} />
              <Image 
                source={require('@/assets/images/ball.png')} 
                style={[styles.shapeImage, {tintColor: '#EEEEEE'}]} 
                resizeMode="contain"
              />
              <Animated.View style={styles.bombFuse} />
            </View>
          );
        default:
          return (
            <View 
              style={[
                styles.blockContent,
                block.isSelected && styles.selectedBlock,
              ]}
            >
              <LinearGradient
                colors={[`${blockColor}80`, blockColor]}
                style={styles.blockGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.candyGlow} />
              <Image 
                source={shapeImage} 
                style={styles.shapeImage} 
                resizeMode="contain"
              />
            </View>
          );
      }
    }
    
    return (
      <View
        style={[
          styles.blockContent,
          block.isSelected && styles.selectedBlock,
        ]}
      >
        <LinearGradient
          colors={[`${blockColor}80`, blockColor]}
          style={styles.blockGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.candyGlow} />
        <Image 
          source={shapeImage} 
          style={styles.shapeImage} 
          resizeMode="contain"
        />
        {/* Add shine effect */}
        <View style={styles.shine} />
      </View>
    );
  };
  
  // Rotate transform for match animation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Elastic transforms for swap animation
  const scaleX = elasticAnim.interpolate({
    inputRange: [0.8, 1, 1.1],
    outputRange: [1.2, 1, 0.9]
  });
  
  const scaleY = elasticAnim.interpolate({
    inputRange: [0.8, 1, 1.1],
    outputRange: [0.8, 1, 1.1]
  });
  
  // Shadow opacity for 3D effect
  const shadowOpacity = swapAnim.x.interpolate({
    inputRange: [-size, 0, size],
    outputRange: [0.3, 0.1, 0.3],
    extrapolate: 'clamp'
  });
  
  return (
    <Pressable
      onPress={() => onPress(block)}
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.blockWrapper,
          {
            transform: [
              { translateX: swapAnim.x },
              { translateY: swapAnim.y },
              { translateY: fallAnim },
              { rotate },
              { scaleX },
              { scaleY },
              { scale: scaleAnim }
            ],
            opacity: opacityAnim,
            shadowOpacity,
          },
        ]}
      >
        {renderBlockContent()}
        {renderParticles()}
      </Animated.View>
    </Pressable>
  );
};

// Helper to lighten a color
const adjustColor = (color: string, amount: number): string => {
  const cleanHex = color.replace('#', '');
  const r = Math.min(255, parseInt(cleanHex.substring(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(cleanHex.substring(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(cleanHex.substring(4, 6), 16) + amount);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  blockWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        shadowColor: undefined,
        shadowOffset: undefined,
        shadowOpacity: undefined,
        shadowRadius: undefined,
        elevation: undefined,
        boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
      }
    })
  },
  block: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBlock: {
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 3,
  },
  specialBlock: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  bombBlock: {
    borderRadius: 24,
  },
  stripedHorizontal: {
    width: '90%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    zIndex: 5,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
  stripedVertical: {
    width: 6,
    height: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    zIndex: 5,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
  wrappedOuter: {
    width: '88%',
    height: '88%',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    zIndex: 5,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
  },
  wrappedInner: {
    width: '60%',
    height: '60%',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute',
    zIndex: 4,
  },
  bombFuse: {
    width: 4,
    height: 14,
    backgroundColor: '#FFD700',
    position: 'absolute',
    top: -8,
    borderRadius: 4,
    zIndex: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    shadowOpacity: 0.8,
  },
  shine: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: -5,
    left: -5,
    zIndex: 4,
  },
  blockContent: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    padding: 4,
  },
  blockGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  candyGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.4,
    zIndex: 2,
  },
  shapeImage: {
    width: '80%',
    height: '80%',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  }
});

export default React.memo(Block);