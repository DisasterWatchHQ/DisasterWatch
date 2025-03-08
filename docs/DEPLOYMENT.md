# Deployment Guide

## Overview

This guide covers the deployment process for DisasterWatch on both iOS and Android platforms, including:
- Environment Setup
- Build Configuration
- App Store/Play Store Submission
- CI/CD Pipeline
- Release Management

## Prerequisites

- Node.js (v16.0.0 or higher)
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- Apple Developer Account
- Google Play Console Account
- Firebase Account
- App Signing Keys

## Environment Configuration

### Environment Files

```bash
# .env.production
API_URL=https://api.disasterwatch.com/v1
GOOGLE_MAPS_API_KEY=your_production_key
WEATHER_API_KEY=your_production_key
FIREBASE_CONFIG=your_production_config
```

```bash
# .env.staging
API_URL=https://staging-api.disasterwatch.com/v1
GOOGLE_MAPS_API_KEY=your_staging_key
WEATHER_API_KEY=your_staging_key
FIREBASE_CONFIG=your_staging_config
```

### Configuration Script

```javascript
// scripts/configure-env.js
const fs = require('fs');
const path = require('path');

const environment = process.env.ENVIRONMENT || 'production';
const envFile = `.env.${environment}`;

// Copy environment file
fs.copyFileSync(
  path.resolve(__dirname, '..', envFile),
  path.resolve(__dirname, '..', '.env')
);
```

## iOS Deployment

### Certificates and Provisioning

1. **Generate Certificates**
   ```bash
   fastlane cert
   fastlane sigh
   ```

2. **Update Signing Configuration**
   ```ruby
   # fastlane/Fastfile
   lane :setup_signing do
     match(
       type: "appstore",
       app_identifier: "com.disasterwatch.app",
       readonly: true
     )
   end
   ```

### Build Configuration

```ruby
# ios/DisasterWatch.xcodeproj/project.pbxproj
PRODUCT_BUNDLE_IDENTIFIER = com.disasterwatch.app
CURRENT_PROJECT_VERSION = 1
MARKETING_VERSION = 1.0.0
CODE_SIGN_STYLE = Manual
PROVISIONING_PROFILE_SPECIFIER = DisasterWatch_AppStore
```

### Build and Archive

```bash
# Build using fastlane
fastlane ios build

# Manual build
xcodebuild -workspace ios/DisasterWatch.xcworkspace \
           -scheme DisasterWatch \
           -configuration Release \
           -archivePath build/DisasterWatch.xcarchive \
           archive
```

### App Store Submission

```ruby
# fastlane/Fastfile
lane :deploy_ios do
  setup_signing
  build_ios
  upload_to_testflight(
    skip_waiting_for_build_processing: true
  )
end
```

## Android Deployment

### Keystore Setup

1. **Generate Keystore**
   ```bash
   keytool -genkey -v -keystore disasterwatch.keystore \
           -alias disasterwatch \
           -keyalg RSA \
           -keysize 2048 \
           -validity 10000
   ```

2. **Configure Gradle**
   ```groovy
   // android/app/build.gradle
   android {
     signingConfigs {
       release {
         storeFile file("disasterwatch.keystore")
         storePassword System.getenv("KEYSTORE_PASSWORD")
         keyAlias "disasterwatch"
         keyPassword System.getenv("KEY_PASSWORD")
       }
     }
   }
   ```

### Build Configuration

```groovy
// android/app/build.gradle
android {
  defaultConfig {
    applicationId "com.disasterwatch.app"
    versionCode 1
    versionName "1.0.0"
  }
  
  buildTypes {
    release {
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android.txt')
      signingConfig signingConfigs.release
    }
  }
}
```

### Build APK/Bundle

```bash
# Generate APK
./gradlew assembleRelease

# Generate AAB (App Bundle)
./gradlew bundleRelease
```

### Play Store Submission

```ruby
# fastlane/Fastfile
lane :deploy_android do
  gradle(
    task: 'bundle',
    build_type: 'Release'
  )
  upload_to_play_store(
    track: 'production',
    aab: 'android/app/build/outputs/bundle/release/app-release.aab'
  )
end
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Dependencies
        run: |
          npm install
          bundle install
      
      - name: Setup Certificates
        uses: apple-actions/import-codesign-certs@v1
        with:
          p12-file-base64: ${{ secrets.CERTIFICATES_P12 }}
          p12-password: ${{ secrets.CERTIFICATES_P12_PASSWORD }}
      
      - name: Deploy to TestFlight
        run: bundle exec fastlane ios deploy
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}
  
  deploy-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup JDK
        uses: actions/setup-java@v2
        with:
          java-version: '11'
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '2.7'
      
      - name: Deploy to Play Store
        run: bundle exec fastlane android deploy
        env:
          PLAY_STORE_CONFIG_JSON: ${{ secrets.PLAY_STORE_CONFIG_JSON }}
```

## Version Management

### Version Bump Script

```javascript
// scripts/bump-version.js
const fs = require('fs');
const semver = require('semver');

const bumpVersion = (type) => {
  // Read current version
  const packageJson = require('../package.json');
  const currentVersion = packageJson.version;
  
  // Calculate new version
  const newVersion = semver.inc(currentVersion, type);
  
  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync(
    'package.json',
    JSON.stringify(packageJson, null, 2)
  );
  
  // Update iOS version
  const infoPlist = 'ios/DisasterWatch/Info.plist';
  let plistContent = fs.readFileSync(infoPlist, 'utf8');
  plistContent = plistContent.replace(
    /<string>${currentVersion}<\/string>/,
    `<string>${newVersion}</string>`
  );
  fs.writeFileSync(infoPlist, plistContent);
  
  // Update Android version
  const buildGradle = 'android/app/build.gradle';
  let gradleContent = fs.readFileSync(buildGradle, 'utf8');
  gradleContent = gradleContent.replace(
    /versionName "${currentVersion}"/,
    `versionName "${newVersion}"`
  );
  fs.writeFileSync(buildGradle, gradleContent);
};

bumpVersion(process.argv[2] || 'patch');
```

## Release Checklist

1. **Pre-release**
   - Update changelog
   - Run test suite
   - Check performance metrics
   - Update documentation
   - Review API compatibility

2. **Version Update**
   ```bash
   # Bump version
   npm run version:bump
   
   # Create git tag
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

3. **Build and Test**
   - Build release versions
   - Test on physical devices
   - Verify all features
   - Check crash reporting

4. **Store Submission**
   - Update screenshots
   - Update app description
   - Submit for review

5. **Post-release**
   - Monitor crash reports
   - Track user feedback
   - Plan next release

## Monitoring

### Firebase Setup

```javascript
// src/utils/analytics.ts
import analytics from '@react-native-firebase/analytics';

export const logEvent = async (name, params = {}) => {
  await analytics().logEvent(name, params);
};

export const setUserProperties = async (properties) => {
  Object.entries(properties).forEach(([key, value]) => {
    analytics().setUserProperty(key, value);
  });
};
```

### Crash Reporting

```javascript
// src/utils/crashlytics.ts
import crashlytics from '@react-native-firebase/crashlytics';

export const initCrashlytics = async () => {
  await crashlytics().setCrashlyticsCollectionEnabled(true);
};

export const logError = async (error) => {
  await crashlytics().recordError(error);
};
```

## Rollback Procedures

### iOS Rollback

```ruby
# fastlane/Fastfile
lane :rollback_ios do |options|
  version = options[:version]
  deliver(
    app_version: version,
    skip_metadata: true,
    skip_screenshots: true,
    force: true
  )
end
```

### Android Rollback

```ruby
# fastlane/Fastfile
lane :rollback_android do |options|
  version = options[:version]
  upload_to_play_store(
    version_name: version,
    track: 'production',
    rollout: '0.5'
  )
end
```

## Security Considerations

1. **API Keys**
   - Store in secure environment variables
   - Use different keys for each environment
   - Rotate keys regularly

2. **Code Signing**
   - Secure certificate storage
   - Regular certificate rotation
   - Access control for signing keys

3. **Data Protection**
   - Encrypt sensitive data
   - Implement app transport security
   - Regular security audits

## Troubleshooting

### Common Issues

1. **Code Signing**
   ```bash
   # Reset signing
   fastlane match nuke distribution
   fastlane match appstore
   ```

2. **Build Errors**
   ```bash
   # Clean build
   cd ios && xcodebuild clean
   cd android && ./gradlew clean
   ```

3. **Version Conflicts**
   ```bash
   # Force version update
   npm run version:bump -- --force
   ```

### Support Contacts

- iOS Team: ios@disasterwatch.com
- Android Team: android@disasterwatch.com
- DevOps: devops@disasterwatch.com 