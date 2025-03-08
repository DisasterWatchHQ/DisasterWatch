# Component Library

## Overview

DisasterWatch uses a component-based architecture following atomic design principles. Components are organized into the following categories:

- Atoms: Basic building blocks (buttons, inputs, icons)
- Molecules: Simple combinations of atoms
- Organisms: Complex UI components
- Templates: Page-level component layouts
- Pages: Complete screen implementations

## Core Components

### Atoms

#### Button
```tsx
import { Button } from '@/components/atoms/Button';

<Button
  variant="primary" // 'primary' | 'secondary' | 'danger' | 'ghost'
  size="md" // 'sm' | 'md' | 'lg'
  disabled={false}
  loading={false}
  onPress={() => {}}
>
  Button Text
</Button>
```

#### Input
```tsx
import { Input } from '@/components/atoms/Input';

<Input
  type="text" // 'text' | 'email' | 'password' | 'number'
  placeholder="Enter text..."
  value={value}
  onChange={setValue}
  error="Error message"
  disabled={false}
/>
```

#### Icon
```tsx
import { Icon } from '@/components/atoms/Icon';

<Icon
  name="warning" // See IconName type for all options
  size={24}
  color="#000000"
/>
```

### Molecules

#### SearchBar
```tsx
import { SearchBar } from '@/components/molecules/SearchBar';

<SearchBar
  placeholder="Search disasters..."
  onSearch={(query) => {}}
  filters={[]}
  onFilterChange={() => {}}
/>
```

#### AlertCard
```tsx
import { AlertCard } from '@/components/molecules/AlertCard';

<AlertCard
  severity="high"
  title="Flood Warning"
  description="Heavy rainfall expected..."
  timestamp={new Date()}
  onPress={() => {}}
/>
```

### Organisms

#### DisasterMap
```tsx
import { DisasterMap } from '@/components/organisms/DisasterMap';

<DisasterMap
  initialRegion={{
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  disasters={[]}
  onMarkerPress={(disaster) => {}}
  onRegionChange={(region) => {}}
/>
```

#### EmergencyContactsList
```tsx
import { EmergencyContactsList } from '@/components/organisms/EmergencyContactsList';

<EmergencyContactsList
  contacts={[]}
  onContactPress={(contact) => {}}
  onAddContact={() => {}}
  onEditContact={(contact) => {}}
  onDeleteContact={(contactId) => {}}
/>
```

## Layout Components

### SafeAreaContainer
```tsx
import { SafeAreaContainer } from '@/components/layout/SafeAreaContainer';

<SafeAreaContainer>
  {children}
</SafeAreaContainer>
```

### ScreenContainer
```tsx
import { ScreenContainer } from '@/components/layout/ScreenContainer';

<ScreenContainer
  header={<Header />}
  footer={<Footer />}
  loading={false}
  error={null}
>
  {children}
</ScreenContainer>
```

## Form Components

### Form
```tsx
import { Form } from '@/components/form/Form';

<Form
  onSubmit={(values) => {}}
  initialValues={{}}
  validationSchema={schema}
>
  <Form.Field
    name="email"
    label="Email"
    component={Input}
  />
  <Form.Submit>Submit</Form.Submit>
</Form>
```

## Navigation Components

### TabBar
```tsx
import { TabBar } from '@/components/navigation/TabBar';

<TabBar
  tabs={[
    { key: 'map', title: 'Map', icon: 'map' },
    { key: 'alerts', title: 'Alerts', icon: 'bell' },
    { key: 'profile', title: 'Profile', icon: 'user' }
  ]}
  activeTab="map"
  onTabPress={(tab) => {}}
/>
```

## Theming

Components use a consistent theme defined in `src/theme`:

```typescript
// theme/colors.ts
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  // ... more colors
};

// theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  // ... more spacing values
};
```

## Styling

Components are styled using NativeWind (TailwindCSS):

```tsx
// Example styled component
const StyledButton = styled.TouchableOpacity`
  bg-primary-500
  px-4
  py-2
  rounded-lg
  flex-row
  items-center
  justify-center
`;
```

## Best Practices

1. **Component Structure**
   - Keep components small and focused
   - Use TypeScript for type safety
   - Include prop validation
   - Document props using JSDoc comments

2. **Performance**
   - Memoize callbacks with useCallback
   - Memoize expensive computations with useMemo
   - Use React.memo for pure components
   - Implement virtualization for long lists

3. **Accessibility**
   - Include proper aria labels
   - Support screen readers
   - Maintain proper contrast ratios
   - Handle different font sizes

4. **Testing**
   - Write unit tests for all components
   - Include snapshot tests
   - Test edge cases and error states
   - Test accessibility features

## Example Usage

```tsx
import { View } from 'react-native';
import { Button, Input, AlertCard } from '@/components';

export const DisasterReportScreen = () => {
  return (
    <ScreenContainer>
      <View className="p-4">
        <Input
          placeholder="Describe the situation..."
          multiline
        />
        <Button
          variant="primary"
          onPress={handleSubmit}
        >
          Submit Report
        </Button>
        <AlertCard
          severity="high"
          title="Current Alert"
          description="Active flood warning in your area"
        />
      </View>
    </ScreenContainer>
  );
};
``` 