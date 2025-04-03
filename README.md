# BlockCrush

BlockCrush is a simple Match-3 game built with React Native and Expo. The game is similar to Candy Crush where players match three or more blocks of the same color to earn points.

![BlockCrush Game Screenshot](assets/images/gameplay.png)

## 🎮 Features

- 🧩 One-click block swapping mechanism
- 🌈 Various attractive block colors and shapes
- 🔄 Cascade effects for combo chains
- 🎵 Sound effects for added excitement
- 🎯 Scoring system with multipliers
- ⏱️ Time-based and move-based game modes
- 🏆 High score storage

## 📱 Tech Stack

- [React Native](https://reactnative.dev/) - Framework for building mobile applications
- [Expo](https://expo.dev/) - Development platform for React Native
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight and powerful state management
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) - For gradient visual effects
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/) - For audio
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - For high-performance animations

## 🚀 How to Run

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Expo CLI
- Smartphone with Expo Go app or Emulator

### Installation

1. Clone this repository:

```bash
git clone https://github.com/[username]/BlockCrush.git
cd BlockCrush
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the application:

```bash
npm start
# or
yarn start
```

4. Scan the QR code with the Expo Go app on your smartphone, or press 'a' to run on Android emulator, or 'i' for iOS emulator.

## 🎲 How to Play

1. **Objective**: Match 3 or more blocks of the same color to earn points and remove them from the board.
2. **Controls**:
   - Click on a block to select it
   - Click on an adjacent block to swap positions
   - Blocks can only be swapped if they result in a match
3. **Cascade Multiplier**: When blocks match and disappear, blocks above will fall and may create new matches. Each consecutive cascade increases the score multiplier.
4. **End Game**: The game ends when time runs out or moves are depleted.

## 🧠 Project Structure

```
BlockCrush/
├── app/               # Application pages (Expo Router)
├── assets/            # Assets like images, audio, fonts
├── components/        # React components
│   ├── Block.tsx      # Individual block component
│   ├── GameBoard.tsx  # Main game board
│   └── ...
├── constants/         # Constant values and configurations
├── store/             # State management with Zustand
│   └── gameStore.ts   # Store for game logic
├── types/             # TypeScript type definitions
```

## 🛠️ Future Development

Some ideas for future development:

- Adding multiplayer mode
- Implementing power-ups and special blocks
- Firebase integration for online leaderboards
- Enhancing visual effects with React Native Skia
- Adding levels with different challenges

## 📄 License

This project is licensed under the [MIT License](LICENSE).
