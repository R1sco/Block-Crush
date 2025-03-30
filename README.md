# BlockCrush

BlockCrush adalah game Match-3 sederhana yang dibangun dengan React Native dan Expo. Game ini mirip dengan Candy Crush di mana pemain mencocokkan tiga atau lebih blok dengan warna yang sama untuk mendapatkan poin.

![BlockCrush Game Screenshot](assets/images/gameplay.png)

## 🎮 Fitur

- 🧩 Mekanisme swap blok dengan satu klik
- 🌈 Berbagai warna dan bentuk blok yang menarik
- 🔄 Efek cascade untuk combo chains
- 🎵 Efek suara yang menambah keseruan
- 🎯 Sistem skor dengan multiplier
- ⏱️ Mode permainan berbasis waktu dan gerakan
- 🏆 Penyimpanan skor tertinggi

## 📱 Tech Stack

- [React Native](https://reactnative.dev/) - Framework untuk membangun aplikasi mobile
- [Expo](https://expo.dev/) - Platform pengembangan untuk React Native
- [TypeScript](https://www.typescriptlang.org/) - Untuk type safety
- [Zustand](https://github.com/pmndrs/zustand) - State management yang ringan dan powerful
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) - Untuk visual efek gradien
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/) - Untuk audio
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Untuk animasi performa tinggi

## 🚀 Cara Menjalankan

### Prasyarat

- Node.js (versi 16 atau lebih tinggi)
- npm atau yarn
- Expo CLI
- Smartphone dengan Expo Go app atau Emulator

### Installasi

1. Clone repositori ini:

```bash
git clone https://github.com/[username]/BlockCrush.git
cd BlockCrush
```

2. Install dependensi:

```bash
npm install
# atau
yarn install
```

3. Jalankan aplikasi:

```bash
npm start
# atau
yarn start
```

4. Scan QR code dengan aplikasi Expo Go di smartphone, atau tekan 'a' untuk menjalankan di emulator Android, atau 'i' untuk emulator iOS.

## 🎲 Cara Bermain

1. **Tujuan**: Cocokkan 3 atau lebih blok dengan warna yang sama untuk mendapatkan poin dan menyingkirkannya dari papan.
2. **Kontrol**:
   - Klik pada satu blok untuk memilihnya
   - Klik blok di sebelahnya untuk menukar posisi
   - Blok hanya dapat ditukar jika menghasilkan kecocokan
3. **Cascade Multiplier**: Saat blok tercocokkan dan hilang, blok di atasnya akan jatuh dan bisa menghasilkan kecocokan lagi. Setiap cascade berturut-turut akan meningkatkan multiplier skor.
4. **End Game**: Permainan berakhir ketika waktu habis atau gerakan habis.

## 🧠 Struktur Project

```
BlockCrush/
├── app/               # Halaman aplikasi (Expo Router)
├── assets/            # Asset seperti gambar, audio, fonts
├── components/        # Komponen React
│   ├── Block.tsx      # Komponen blok individual
│   ├── GameBoard.tsx  # Papan permainan utama
│   └── ...
├── constants/         # Nilai konstan dan konfigurasi
├── store/             # State management dengan Zustand
│   └── gameStore.ts   # Store untuk logika game
├── types/             # TypeScript type definitions
```

## 🛠️ Pengembangan Selanjutnya

Beberapa ide untuk pengembangan selanjutnya:

- Menambahkan mode multiplayer
- Implementasi power-ups dan blok spesial
- Integrasi dengan Firebase untuk leaderboard online
- Meningkatkan efek visual dengan React Native Skia
- Menambahkan level dengan tantangan berbeda

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 👏 Terima Kasih
