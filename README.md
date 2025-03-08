
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
=======
## DisasterWatch

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Dependencies](#dependencies)
- [Recent Changes](#recent-changes)
- [License](#license)
- [Contact](#contact)

## Description
DisasterWatch is a comprehensive application designed to provide real-time disaster alerts, reporting capabilities, and emergency contacts.

## Installation
To install the project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/DisasterWatchHQ/DisasterWatch.git
    ```
2. Navigate to the project directory:
    ```bash
    cd DisasterWatch
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Run the application:
    ```bash
    npx expo start
    ```

## Usage
Detailed usage instructions and examples will be provided here.

## Features
- Real-time disaster alerts
- Interactive maps
- User profiles and resource pages
- Theming and customization options

## Dependencies
The project uses several dependencies, including but not limited to:
- @expo/metro-runtime
- @react-native-async-storage/async-storage
- @react-native-community/checkbox
- @react-native-community/geolocation
- @react-native-picker/picker
- @react-navigation/native
- axios
- expo
- expo-camera
- expo-constants
- expo-image-picker
- expo-linking
- expo-location
- expo-notifications
- expo-router
- expo-secure-store
- expo-status-bar
- nativewind
- react
- react-dom
- react-native
- react-native-appwrite
- react-native-dotenv
- react-native-dropdown-picker
- react-native-elements
- react-native-geocoding
- react-native-get-random-values
- react-native-google-places-autocomplete
- react-native-maps
- react-native-reanimated
- react-native-safe-area-context
- react-native-screens
- react-native-url-polyfill
- react-native-vector-icons
- react-native-web
- react-navigation
- react-redux
- redux
- tailwindcss
- uuid

For a complete list, refer to the [package.json](https://github.com/DisasterWatchHQ/DisasterWatch/blob/main/package.json) file.

## Recent Changes
Here are some of the recent notable commits:
- [feat: pushing update](https://github.com/DisasterWatchHQ/DisasterWatch/commit/3ab9ca93c023d4071452f37d2009a542a039c11f)
- [feat: improved the button component](https://github.com/DisasterWatchHQ/DisasterWatch/commit/06a1f02dd5b1122acc1e869124cceaa839df2e0b)
- [feat: made the profile page skeloton](https://github.com/DisasterWatchHQ/DisasterWatch/commit/ae73572182b55c1e5118e2d00a9e5b10c12516d1)
- [refactor: changed the start page and add animations](https://github.com/DisasterWatchHQ/DisasterWatch/commit/c416f9596fd786f169b2affd9dbd24f56cd213eb)
- [feat: hide the back button on profile page](https://github.com/DisasterWatchHQ/DisasterWatch/commit/f2a336e5c57065dae47e9d5c352721e487e40c3d)

For more commits, visit the [commit history](https://github.com/DisasterWatchHQ/DisasterWatch/commits/main).

## License
This project is licensed under the GNU General Public License v3.0. See the [LICENSE](https://github.com/DisasterWatchHQ/DisasterWatch/blob/main/LICENSE) file for details.

## Contact
For any queries or concerns, please contact the project maintainers.

