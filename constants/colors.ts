// Game theme colors
export const COLORS = {
  background: '#1D2326', // Darker slate for background
  surface: '#2A363B', // Deep slate for surface
  primary: '#6A5ACD', // Slate blue
  secondary: '#9EB3C2', // Dusty blue as secondary
  accent: '#D1C2AB', // Warm beige as accent
  text: '#FFFFFF',
  textSecondary: '#D1D1D1', // Lighter secondary text
  
  // Block objects - menggunakan warna lebih cerah seperti Candy Crush
  blocks: [
    {
      id: 1,
      name: 'star',
      shape: 'star',
      color: '#FFD700', // Gold yellow
      primaryGradient: '#FFEB3B',
      secondaryGradient: '#FFC107',
      highlight: '#FFEE58',
      points: 150,
      image: require('@/assets/images/star.png')
    },
    {
      id: 2,
      name: 'ball',
      shape: 'ball',
      color: '#E91E63', // Hot pink
      primaryGradient: '#F06292',
      secondaryGradient: '#D81B60',
      highlight: '#FF4081',
      points: 100,
      image: require('@/assets/images/ball.png')
    },
    {
      id: 3,
      name: 'square',
      shape: 'square',
      color: '#FF9800', // Bright orange
      primaryGradient: '#FFB74D',
      secondaryGradient: '#F57C00',
      highlight: '#FFA726',
      points: 125,
      image: require('@/assets/images/square.png')
    },
    {
      id: 4,
      name: 'triangle',
      shape: 'triangle',
      color: '#4CAF50', // Vibrant green
      primaryGradient: '#81C784',
      secondaryGradient: '#388E3C',
      highlight: '#66BB6A',
      points: 175,
      image: require('@/assets/images/triangle.png')
    },
    {
      id: 5,
      name: 'hexagon',
      shape: 'hexagon',
      color: '#03A9F4', // Bright Blue
      primaryGradient: '#BA68C8',
      secondaryGradient: '#7B1FA2',
      highlight: '#AB47BC',
      points: 200,
      image: require('@/assets/images/hexagon.png')
    }
  ]
};

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#5C7D8A', // Updated tint
    tabIconDefault: '#ccc',
    tabIconSelected: '#5C7D8A', // Updated tab icon
  },
  dark: {
    text: '#fff',
    background: '#1D2326', // Match the new background
    tint: '#9EB3C2', // Using dusty blue for tint
    tabIconDefault: '#aaa',
    tabIconSelected: '#9EB3C2', // Using dusty blue for selected tab icon
  },
};