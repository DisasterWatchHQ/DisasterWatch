# State Management

## Overview

DisasterWatch uses a hybrid state management approach combining React Context for global UI state and Redux Toolkit for complex data management. This documentation outlines our state management architecture and best practices.

## State Categories

### Local Component State
- Used for component-specific UI state
- Managed with useState and useReducer hooks
- Examples: form inputs, toggles, loading states

### Global UI State (React Context)
- Used for theme, authentication, and UI preferences
- Managed through Context Providers
- Quick access without Redux boilerplate

### Application Data (Redux)
- Complex data management
- API cache and synchronization
- Real-time disaster updates
- User data and settings

## React Context Implementation

### Theme Context
```tsx
// contexts/ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Auth Context
```tsx
// contexts/AuthContext.tsx
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: Credentials) => {
    // Implementation
  };

  const logout = async () => {
    // Implementation
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Redux Implementation

### Store Configuration
```tsx
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import disasterReducer from './slices/disasterSlice';
import weatherReducer from './slices/weatherSlice';
import emergencyReducer from './slices/emergencySlice';

export const store = configureStore({
  reducer: {
    disasters: disasterReducer,
    weather: weatherReducer,
    emergency: emergencyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Slice Example
```tsx
// store/slices/disasterSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDisasters = createAsyncThunk(
  'disasters/fetchDisasters',
  async (params: FetchDisastersParams) => {
    // API call implementation
  }
);

const disasterSlice = createSlice({
  name: 'disasters',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      type: null,
      severity: null,
      dateRange: null,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    // Other reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisasters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDisasters.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchDisasters.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});
```

### Custom Hooks
```tsx
// hooks/useDisasters.ts
export const useDisasters = () => {
  const dispatch = useAppDispatch();
  const disasters = useSelector((state: RootState) => state.disasters);

  const fetchDisastersByLocation = useCallback(
    (location: Location) => {
      dispatch(fetchDisasters({ location }));
    },
    [dispatch]
  );

  return {
    disasters: disasters.items,
    loading: disasters.loading,
    error: disasters.error,
    fetchDisastersByLocation,
  };
};
```

## Real-time Updates

### WebSocket Integration
```tsx
// services/websocket.ts
import { store } from '@/store';
import { addDisaster, updateDisaster } from '@/store/slices/disasterSlice';

export class WebSocketService {
  private ws: WebSocket;

  constructor() {
    this.ws = new WebSocket('wss://api.disasterwatch.com/v1/ws');
    this.setupListeners();
  }

  private setupListeners() {
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'NEW_DISASTER':
          store.dispatch(addDisaster(data.payload));
          break;
        case 'UPDATE_DISASTER':
          store.dispatch(updateDisaster(data.payload));
          break;
      }
    };
  }
}
```

## Best Practices

### State Organization
1. **Keep state minimal**
   - Only store necessary data
   - Derive computed values using selectors
   - Clean up obsolete state

2. **Normalize complex data**
   - Use normalized state structure
   - Maintain relationships using IDs
   - Update related entities efficiently

### Performance Optimization
1. **Memoization**
   ```tsx
   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
   const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
   ```

2. **Selective Rendering**
   ```tsx
   const disasters = useSelector(selectDisasters, shallowEqual);
   ```

3. **Batch Updates**
   ```tsx
   dispatch(batchActions([
     action1(),
     action2(),
     action3(),
   ]));
   ```

### Error Handling
```tsx
try {
  await dispatch(someAsyncAction()).unwrap();
} catch (error) {
  // Handle error
}
```

## Testing

### Redux Tests
```tsx
// store/slices/disasterSlice.test.ts
describe('disaster slice', () => {
  it('should handle initial state', () => {
    expect(disasterReducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      loading: false,
      error: null,
    });
  });

  it('should handle fetchDisasters.fulfilled', () => {
    const disasters = [/* mock data */];
    const actual = disasterReducer(
      initialState,
      fetchDisasters.fulfilled(disasters, 'requestId', params)
    );
    expect(actual.items).toEqual(disasters);
  });
});
```

### Context Tests
```tsx
// contexts/AuthContext.test.tsx
it('provides authentication context', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.user).toBeNull();
  expect(typeof result.current.login).toBe('function');
  expect(typeof result.current.logout).toBe('function');
});
``` 