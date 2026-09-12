/**
 * Global TypeScript Types and Interfaces
 */

/**
 * User Profile Type
 */
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
}

/**
 * Transaction Type
 */
export interface Transaction {
  _id: string;
  type: 'Income' | 'Expense';
  amount: number;
  title: string;
  category: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Transaction Summary (from API)
 */
export interface TransactionSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  allData: Transaction[];
  currentPage: number;
  totalPages: number;
  limit: number;
}

/**
 * API Response Type
 */
export interface ApiResponse<T = any> {
  status: 'ok' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Login Request/Response
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  oldUser: User;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

/**
 * Verify Request
 */
export interface VerifyRequest {
  email: string;
  otp: string;
}

/**
 * Redux State Types
 */
export interface AuthState {
  isLoggedIn: boolean;
}

export interface UserState {
  user: User | null;
  error: string | null;
}

export interface LoaderState {
  isLoading: boolean;
  message: string;
}

export interface RootState {
  auth: AuthState;
  user: UserState;
  loader: LoaderState;
}

/**
 * Navigation Types
 */
export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  VerifyScreen: { email: string };
  Transaction: undefined;
  AddTransaction: undefined;
};

/**
 * Component Props Types
 */
export interface TransactionCardProps {
  item: Transaction;
  onDelete: (id: string) => void;
}

export interface ExpenseCardProps {
  amountDetails: Partial<TransactionSummary>;
}

export interface OfflineBannerProps {
  onRetry?: () => void;
}

/**
 * Context Types
 */
export interface NetworkContextType {
  isConnected: boolean;
}

/**
 * Form Error Type
 */
export interface FormErrors {
  [key: string]: string;
}

/**
 * API Error Type
 */
export interface ApiError {
  message: string;
  status?: number;
  response?: any;
}
