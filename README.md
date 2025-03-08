# DisasterWatch

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-v0.72+-61dafb.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2049+-000020.svg)](https://expo.dev/)

## About

DisasterWatch is a comprehensive mobile application designed to help communities prepare for, monitor, and respond to natural and man-made disasters. Built with React Native and Expo, it provides real-time disaster tracking, reporting capabilities, and emergency response coordination tools.

## Features

- 🗺️ **Real-time Disaster Feed**
  - Interactive map interface with disaster markers
  - Filter disasters by type, severity, and location
  - Real-time updates and push notifications

- 📱 **Disaster Reporting**
  - User-generated incident reports
  - Photo and video upload capabilities
  - Location-based reporting
  - Offline submission support

- 🚨 **Emergency Services**
  - Emergency contact directory
  - One-tap emergency calling
  - Nearest emergency facility locator
  - Emergency protocols and guidelines

- 🔔 **Smart Notifications**
  - Customizable alert preferences
  - Geofenced notifications
  - Severity-based filtering
  - Silent hours configuration

- 👤 **User Features**
  - Profile management
  - Emergency contact list
  - Personal safety checklist
  - Activity history

- 🌡️ **Weather Integration**
  - Real-time weather data
  - Natural disaster predictions
  - Severe weather alerts
  - Historical weather patterns

## Tech Stack

### Frontend
- React Native (v0.72+)
- Expo SDK 49+
- NativeWind (TailwindCSS for React Native)
- React Navigation v6

### Data Management
- React Context API
- AsyncStorage
- Expo SecureStore
- Redux Toolkit (for complex state)

### Maps & Location
- React Native Maps
- Expo Location
- Google Maps API

### Notifications
- Expo Notifications
- Firebase Cloud Messaging

### API & Networking
- Axios
- React Query
- WebSocket for real-time updates

## Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher) or yarn (v1.22.0 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS development, Mac only)
- Android Studio (for Android development)
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DisasterWatch.git
   cd DisasterWatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your API keys and configuration:
   - GOOGLE_MAPS_API_KEY
   - WEATHER_API_KEY
   - FIREBASE_CONFIG
   - API_BASE_URL

4. **Start Development Server**
   ```bash
   npm start # or yarn start
   ```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run typescript` - Run TypeScript checks
- `npm run build:android` - Build Android release
- `npm run build:ios` - Build iOS release

## Development

### Code Style
- ESLint configuration extends React Native recommended settings
- Prettier for code formatting
- Husky for pre-commit hooks
- Commitlint for conventional commits

### Testing
- Jest for unit and integration tests
- React Native Testing Library
- E2E testing with Detox

### Debugging
- React Native Debugger
- Flipper support
- Chrome DevTools integration

## Deployment

### Android
1. Update `app.json` version
2. Generate release keystore
3. Configure `app.json` with keystore details
4. Run `npm run build:android`

### iOS
1. Update `app.json` version
2. Configure certificates in Apple Developer Portal
3. Update provisioning profiles
4. Run `npm run build:ios`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Documentation

- [API Documentation](docs/API.md)
- [Component Library](docs/COMPONENTS.md)
- [State Management](docs/STATE.md)
- [Testing Guide](docs/TESTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@disasterwatch.com or join our Slack channel.

---

Made with ❤️ by the DisasterWatch Team
