# Trading App

A comprehensive mobile trading application built with React Native and Expo, featuring real-time market data, copy trading, OTC/MOTC trading, live chat support, and TradingView integration.

## 📱 Features

### Authentication & Security
- User registration and sign-in
- Two-step verification (2FA)
- Password reset functionality
- Secure session management with Redux Persist

### Trading Features
- **Real-time Market Data**: Live cryptocurrency exchange information
- **TradingView Integration**: Advanced charting and technical analysis
- **Copy Trading**: Follow and copy successful traders
- **OTC & MOTC Trading**: Over-the-counter and Market OTC trading
- **Multiple Trading Pairs**: Support for various cryptocurrency pairs

### Account Management
- User profile editing
- ID card verification
- Account settings
- User avatar support

### Communication
- **Live Chat**: Real-time chat with support using Socket.IO
- **Chat Rooms**: Community discussions
- **Support System**: Dedicated support section

### User Interface
- Multi-language support (i18n)
- Dark theme optimized
- Responsive design for all screen sizes
- Side menu navigation
- Bottom tab navigation

## 🛠️ Tech Stack

### Core
- **React Native** (via Expo SDK 42)
- **Expo** - Development and build platform
- **React** 16.13.1

### State Management
- **Redux** - State container
- **Redux Saga** - Side effects management
- **Redux Persist** - State persistence
- **React Redux** - React bindings

### Navigation
- **React Navigation** v4
- **React Navigation Stack**
- **React Navigation Drawer**

### UI Components
- **Native Base** v3 - UI component library
- **Styled Components** - CSS-in-JS styling
- **Expo Linear Gradient** - Gradient backgrounds
- **React Native Normalize** - Responsive sizing

### Features & Libraries
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Moment.js** - Date/time manipulation
- **i18n-js** - Internationalization
- **React Native Gifted Chat** - Chat UI
- **React Native WebView** - TradingView integration

### Media & UI Components
- **React Native Image Slider Box** - Image carousels
- **React Native Snap Carousel** - Card carousels
- **React Native Swiper** - Swipeable views
- **React Native QR Code SVG** - QR code generation
- **Expo Image Picker** - Image selection
- **React Native User Avatar** - Avatar components

### Forms & Input
- **React Native Confirmation Code Field** - OTP input
- **React Native Country Picker** - Country selection
- **React Native Input Spinner** - Number spinner
- **React Native Password Strength Meter** - Password validation
- **React Native Slider** - Value slider

## 📋 Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for macOS) or Android Emulator

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/superdev947/trading-app.git
   cd trading-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure backend URL**
   
   Update the backend URL in `src/constants/Root.js` with your API endpoint.

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

## 📱 Running the App

### iOS
```bash
npm run ios
# or
expo start --ios
```

### Android
```bash
npm run android
# or
expo start --android
```

### Web (Preview)
```bash
npm run web
# or
expo start --web
```

## 📁 Project Structure

```
trading-app/
├── src/
│   ├── assets/          # Images, fonts, and static files
│   ├── components/      # Reusable UI components
│   ├── constants/       # App constants (colors, layouts, etc.)
│   ├── navigation/      # Navigation configuration
│   │   ├── Guest.js     # Guest user navigation
│   │   ├── Logged.js    # Authenticated user navigation
│   │   └── SideMenu.js  # Drawer menu
│   ├── redux/           # State management
│   │   ├── Store.js     # Redux store configuration
│   │   ├── actions/     # Action creators
│   │   ├── reducers/    # Reducers
│   │   └── services/    # API services
│   └── screens/         # Screen components
│       ├── Guest/       # Authentication screens
│       └── Logged/      # Main app screens
│           ├── Home/
│           ├── Markets/
│           ├── Trade/
│           ├── Assets/
│           ├── CopyTrade/
│           ├── Chat/
│           ├── Support/
│           └── Account/
├── App.js               # Root component
├── package.json         # Dependencies
└── app.json            # Expo configuration
```

## 🔧 Configuration

### Environment Setup

The app uses constants defined in `src/constants/` for configuration:

- **Root.js**: Backend URL and Socket.IO configuration
- **Color.js**: Color palette
- **Layout.js**: Layout dimensions and theme
- **Images.js**: Image assets

### API Integration

API services are located in `src/redux/services/`. Update the base URL and endpoints according to your backend API.

## 🌐 Internationalization

The app supports multiple languages using `i18n-js`. Language files are loaded dynamically from the backend API on app startup.

To add a new language:
1. Add translations to your backend API
2. The app will automatically load and apply them

## 🔐 Authentication Flow

1. Guest users see: SignIn, SignUp, ResetPassword
2. After successful authentication, users can access:
   - Home dashboard
   - Markets and trading
   - Account management
   - Assets (OTC/MOTC)
   - Copy trading
   - Chat and support

## 🧪 Testing

```bash
# Run tests (if configured)
npm test
```

## 📦 Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Developer

**superdev947**

## 🐛 Known Issues

- Expo SDK 42 is an older version; consider upgrading to the latest Expo SDK
- Some dependencies may have security vulnerabilities and should be updated

## 📞 Support

For support and inquiries, please open an issue in the repository.

---

**Note**: Make sure to configure your backend API endpoints before running the application. The app requires a running backend service for authentication, market data, and real-time features.
