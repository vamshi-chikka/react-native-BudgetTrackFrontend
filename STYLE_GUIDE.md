# Code Style Guide - MyApp

## Overview
This guide establishes consistent coding standards for the MyApp React Native project.

---

## TypeScript & JavaScript

### 1. File Organization

```typescript
// 1. Imports (external first, then internal)
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { API_URL } from '../Constants/api';
import { User } from '@/src/types';

// 2. Type Definitions
interface MyComponentProps {
  item: User;
  onPress: () => void;
}

// 3. Component Definition
export default function MyComponent({ item, onPress }: MyComponentProps) {
  // Implementation
}

// 4. Styles
const styles = StyleSheet.create({
  // Styles
});
```

### 2. Naming Conventions

```typescript
// Components: PascalCase
function UserProfile() {}
const UserCard = () => {};

// Functions: camelCase
function formatUserName() {}
const calculateTotal = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 50;
const API_TIMEOUT = 10000;

// State variables: camelCase
const [userName, setUserName] = useState('');
const [isLoading, setIsLoading] = useState(false);

// Interfaces/Types: PascalCase
interface User {}
type TransactionType = 'Income' | 'Expense';

// Boolean variables: isSomething, hasSomething, canSomething
const isConnected = true;
const hasError = false;
const canDelete = true;
```

### 3. Import Organization

```typescript
// Group imports by type:
// 1. React/React Native
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Navigation
import { useNavigation } from '@react-navigation/native';

// 3. Redux
import { useSelector, useDispatch } from 'react-redux';

// 4. Third-party libraries
import axios from 'axios';
import * as Yup from 'yup';

// 5. Project files (absolute imports)
import { API_URL } from '@/Constants/api';
import { User } from '@/src/types';

// 6. Relative imports (last resort)
import { MyComponent } from '../components/MyComponent';
```

---

## React & React Native

### 1. Component Structure

```typescript
export default function MyComponent({ prop1, prop2 }: Props) {
  // Hooks first
  const [state, setState] = useState(initialValue);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Derived state
  const isValid = state.length > 0;
  
  // Event handlers
  const handlePress = () => {
    // Implementation
  };
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Render
  return (
    <View>
      <Text>{state}</Text>
    </View>
  );
}
```

### 2. Hook Usage

```typescript
// Use hooks at the top of component
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');

// Custom hooks for complex logic
const { data, loading } = useFetchData(url);

// Never use hooks conditionally
// ❌ WRONG
if (condition) {
  const [state, setState] = useState(0);
}

// ✅ CORRECT
const [state, setState] = useState(0);
if (condition) {
  // Use state
}
```

### 3. Styling

```typescript
// Use StyleSheet for all styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  button: {
    backgroundColor: '#4A3428',
    paddingVertical: 12,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A3428',
  },
});

// Apply styles consistently
<View style={styles.container}>
  <TouchableOpacity style={styles.button}>
    <Text style={styles.text}>Press me</Text>
  </TouchableOpacity>
</View>

// Conditional styles
<View style={[styles.container, isActive && styles.activeContainer]} />

// Avoid inline styles
// ❌ WRONG
<Text style={{ fontSize: 16, color: '#000' }}>Text</Text>

// ✅ CORRECT
<Text style={styles.text}>Text</Text>
```

---

## Error Handling

### 1. API Calls

```typescript
const fetchData = async () => {
  try {
    setIsLoading(true);
    const response = await axios.get(endpoint, { timeout: 10000 });
    
    if (response.data?.status === 'ok') {
      setData(response.data.data);
      setError('');
    } else {
      setError(response.data?.message || 'Request failed');
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        'An error occurred';
    setError(errorMessage);
    console.error('API Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Input Validation

```typescript
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const handleSubmit = () => {
  if (!validateEmail(email)) {
    setEmailError('Invalid email format');
    return;
  }
  // Proceed with submission
};
```

### 3. Error Display

```typescript
// Show user-friendly error messages
Alert.alert(
  'Error Title',
  'User-friendly error description',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Retry', onPress: handleRetry },
  ]
);

// Show inline error messages
{error && <Text style={styles.errorText}>{error}</Text>}
```

---

## Redux Best Practices

### 1. Slice Structure

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyState {
  data: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MyState = {
  data: [],
  isLoading: false,
  error: null,
};

export const mySlice = createSlice({
  name: 'mySlice',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setData, setLoading, setError } = mySlice.actions;
export default mySlice.reducer;
```

### 2. Using Redux

```typescript
// Selector
const data = useSelector((state: RootState) => state.mySlice.data);

// Dispatch
const dispatch = useDispatch();

dispatch(setData(newData));
```

---

## Constants & Configuration

### 1. API Endpoints

```typescript
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
};

export const TRANSACTION_ENDPOINTS = {
  GET_SUMMARY: '/api/tran/summary',
  ADD: '/api/tran/addtransaction',
  DELETE: '/api/tran/delete',
};
```

### 2. Magic Numbers

```typescript
// ❌ WRONG
const items = data.slice(0, 5);

// ✅ CORRECT
const ITEMS_PER_PAGE = 5;
const items = data.slice(0, ITEMS_PER_PAGE);
```

---

## Comments & Documentation

### 1. Function Documentation

```typescript
/**
 * Formats a date string into readable format
 * @param dateString - ISO format date string
 * @returns Formatted date string (e.g., 'Jan 15, 2024')
 */
function formatDate(dateString: string): string {
  // Implementation
}
```

### 2. Complex Logic Comments

```typescript
// Fetch paginated data and append to existing list
if (pageNumber === 1) {
  setData(newData);
  setHasMore(currentPage < totalPages);
} else {
  setData(prev => [...prev, ...newData]);
}
```

### 3. TODO Comments

```typescript
// TODO: Add error boundary for better error handling
// FIXME: Performance issue with large lists
// NOTE: API returns timestamps in milliseconds, not seconds
```

---

## Testing Recommendations

### 1. Test File Naming

```
MyComponent.test.tsx
utils/helpers.test.ts
redux/authSlice.test.ts
```

### 2. Test Structure

```typescript
describe('MyComponent', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user input', () => {
    // Test implementation
  });
});
```

---

## Performance Guidelines

### 1. Memoization

```typescript
// Memoize components with heavy rendering
const MyComponent = React.memo(function MyComponent(props: Props) {
  // Component code
});

// Memoize callbacks
const handlePress = useCallback(() => {
  // Handler code
}, [dependencies]);
```

### 2. List Rendering

```typescript
// Always use FlatList for large lists
<FlatList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  keyExtractor={(item) => item.id}
  onEndReached={loadMore}
  onEndReachedThreshold={0.4}
/>
```

---

## Common Patterns

### 1. Loading State

```typescript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    // Fetch data
  } finally {
    setIsLoading(false);
  }
};

// Display loading indicator
{isLoading && <ActivityIndicator />}
```

### 2. Error State

```typescript
const [error, setError] = useState('');

// Clear error on successful operation
if (success) {
  setError('');
}

// Display error message
{error && <Text style={styles.error}>{error}</Text>}
```

### 3. Form Validation

```typescript
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState<FormErrors>({});

const validate = (): boolean => {
  const newErrors: FormErrors = {};
  
  if (!formData.email) {
    newErrors.email = 'Email is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (!validate()) return;
  // Submit form
};
```

---

## Avoid These Anti-Patterns

```typescript
// ❌ Don't use 'any' type
const data: any = fetchData();

// ✅ Use proper typing
const data: User[] = fetchData();

// ❌ Don't use console.log in production
console.log('data', data);

// ✅ Use a logging service
logger.debug('data', data);

// ❌ Don't hardcode API URLs
axios.get('https://api.example.com/users');

// ✅ Use configuration
axios.get(`${API_URL}/api/users`);

// ❌ Don't forget dependencies in useEffect
useEffect(() => {
  fetchData(id);
}); // Infinite loop!

// ✅ Include dependencies
useEffect(() => {
  fetchData(id);
}, [id]);
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Formik Documentation](https://formik.org/docs/overview)

---

**Last Updated**: August 17, 2024
