# Testing Guide

## Overview

DisasterWatch follows a comprehensive testing strategy that includes:
- Unit Testing
- Integration Testing
- End-to-End Testing
- Performance Testing
- Accessibility Testing

## Test Stack

- Jest
- React Native Testing Library
- Detox (E2E)
- Jest Native
- React Native Performance Monitor
- Accessibility Inspector

## Unit Testing

### Component Testing

```tsx
// components/__tests__/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button onPress={() => {}}>
        Press Me
      </Button>
    );
    
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>
        Press Me
      </Button>
    );
    
    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('applies disabled styles when disabled', () => {
    const { getByText } = render(
      <Button disabled onPress={() => {}}>
        Press Me
      </Button>
    );
    
    const button = getByText('Press Me');
    expect(button.props.style).toMatchObject({
      opacity: 0.5
    });
  });
});
```

### Hook Testing

```tsx
// hooks/__tests__/useLocation.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useLocation } from '../useLocation';

describe('useLocation', () => {
  it('provides current location', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useLocation());
    
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    
    expect(result.current.location).toEqual({
      latitude: expect.any(Number),
      longitude: expect.any(Number),
    });
  });

  it('handles location errors', async () => {
    // Mock location error
    jest.spyOn(navigator.geolocation, 'getCurrentPosition')
      .mockImplementation((_, errorCallback) => 
        errorCallback(new Error('Location unavailable'))
      );

    const { result, waitForNextUpdate } = renderHook(() => useLocation());
    await waitForNextUpdate();
    
    expect(result.current.error).toBe('Location unavailable');
  });
});
```

### Redux Testing

```tsx
// store/__tests__/disasterSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import disasterReducer, {
  fetchDisasters,
  addDisaster,
} from '../disasterSlice';

describe('disaster slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { disasters: disasterReducer },
    });
  });

  it('fetches disasters successfully', async () => {
    await store.dispatch(fetchDisasters());
    
    const state = store.getState().disasters;
    expect(state.loading).toBe(false);
    expect(state.items.length).toBeGreaterThan(0);
  });

  it('handles fetch errors', async () => {
    // Mock API error
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API Error'));
    
    await store.dispatch(fetchDisasters());
    
    const state = store.getState().disasters;
    expect(state.error).toBe('API Error');
  });
});
```

## Integration Testing

### API Integration

```tsx
// services/__tests__/api.test.ts
import { DisasterAPI } from '../api';

describe('DisasterAPI', () => {
  let api;

  beforeEach(() => {
    api = new DisasterAPI();
  });

  it('fetches disaster feed', async () => {
    const response = await api.getDisasterFeed({
      lat: 0,
      lng: 0,
      radius: 50,
    });
    
    expect(response).toMatchObject({
      disasters: expect.any(Array),
      meta: expect.any(Object),
    });
  });

  it('reports new disaster', async () => {
    const disaster = {
      type: 'FLOOD',
      severity: 'HIGH',
      location: { lat: 0, lng: 0 },
      description: 'Test disaster',
    };
    
    const response = await api.reportDisaster(disaster);
    expect(response.id).toBeDefined();
  });
});
```

### Navigation Testing

```tsx
// navigation/__tests__/AppNavigator.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../AppNavigator';

describe('AppNavigator', () => {
  it('navigates between screens', async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );
    
    // Navigate to Profile
    fireEvent.press(getByText('Profile'));
    expect(await findByText('User Profile')).toBeTruthy();
    
    // Navigate back to Map
    fireEvent.press(getByText('Map'));
    expect(await findByText('Disaster Map')).toBeTruthy();
  });
});
```

## End-to-End Testing

### Detox Setup

```javascript
// e2e/config.json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/config.json",
  "configurations": {
    "ios": {
      "type": "ios.simulator",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/DisasterWatch.app",
      "build": "xcodebuild -workspace ios/DisasterWatch.xcworkspace -scheme DisasterWatch -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "android": {
      "type": "android.emulator",
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
      "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd .."
    }
  }
}
```

### E2E Test Example

```typescript
// e2e/disaster-reporting.test.ts
describe('Disaster Reporting', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should report a new disaster', async () => {
    // Navigate to report screen
    await element(by.id('report-button')).tap();
    
    // Fill report form
    await element(by.id('disaster-type')).tap();
    await element(by.text('Flood')).tap();
    await element(by.id('description')).typeText('Test disaster report');
    
    // Submit report
    await element(by.id('submit-button')).tap();
    
    // Verify success message
    await expect(element(by.text('Report Submitted'))).toBeVisible();
  });
});
```

## Performance Testing

### React Native Performance Monitor

```typescript
// utils/performance.ts
import { PerformanceObserver } from 'react-native-performance';

export const setupPerformanceMonitoring = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`);
    });
  });

  observer.observe({ entryTypes: ['measure'] });
};

// Usage in components
performance.mark('mapRenderStart');
// Render map
performance.mark('mapRenderEnd');
performance.measure('Map Render', 'mapRenderStart', 'mapRenderEnd');
```

### Component Performance Testing

```tsx
// components/__tests__/DisasterMap.perf.test.tsx
import { render } from '@testing-library/react-native';
import { DisasterMap } from '../DisasterMap';

describe('DisasterMap Performance', () => {
  it('renders large datasets efficiently', () => {
    const startTime = performance.now();
    
    render(
      <DisasterMap
        disasters={Array(1000).fill(mockDisaster)}
        region={mockRegion}
      />
    );
    
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(500); // Should render in < 500ms
  });
});
```

## Accessibility Testing

### Component Accessibility

```tsx
// components/__tests__/Button.a11y.test.tsx
import { render } from '@testing-library/react-native';
import { Button } from '../Button';
import { accessibilityCheck } from '../../../utils/testUtils';

describe('Button Accessibility', () => {
  it('meets accessibility requirements', () => {
    const { container } = render(
      <Button
        onPress={() => {}}
        accessibilityLabel="Submit form"
      >
        Submit
      </Button>
    );
    
    expect(accessibilityCheck(container)).toBe(true);
  });

  it('handles screen reader focus', () => {
    const { getByA11yLabel } = render(
      <Button
        onPress={() => {}}
        accessibilityLabel="Submit form"
      >
        Submit
      </Button>
    );
    
    const button = getByA11yLabel('Submit form');
    expect(button.props.accessible).toBe(true);
  });
});
```

## Test Coverage

### Coverage Requirements

- Minimum coverage requirements:
  - Statements: 80%
  - Branches: 75%
  - Functions: 80%
  - Lines: 80%

### Coverage Script

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:e2e": "detox test -c ios.sim.debug",
    "test:e2e:build": "detox build -c ios.sim.debug"
  },
  "jest": {
    "preset": "react-native",
    "coverageThreshold": {
      "global": {
        "statements": 80,
        "branches": 75,
        "functions": 80,
        "lines": 80
      }
    }
  }
}
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Run Tests
        run: npm test
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v2
```

## Best Practices

1. **Test Organization**
   - Keep tests close to source files
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

2. **Mocking**
   - Mock external dependencies
   - Use jest.mock() for modules
   - Create reusable mock factories

3. **Test Data**
   - Use factories for test data
   - Keep test data realistic
   - Avoid sharing mutable state

4. **Async Testing**
   - Use async/await
   - Handle promises properly
   - Test error cases

5. **Maintenance**
   - Regular test maintenance
   - Update tests with code changes
   - Remove obsolete tests 