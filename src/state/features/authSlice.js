import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

// Storage keys
const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

// Check if user is authenticated based on token in state
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Basic JWT expiration check
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return false;
  }
};

// Load initial state from localStorage
const loadInitialAuthState = () => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const user = localStorage.getItem(USER_STORAGE_KEY);
    
    if (token && user && isTokenValid(token)) {
      return {
        user: JSON.parse(user),
        token: token,
        isAuthenticated: true,
        error: null,
      };
    } else {
      // Clear invalid data
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
  };
};

const initialState = loadInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    checkAuthStatus: (state) => {
      // Try to load from localStorage if not in state
      if (!state.token) {
        try {
          const token = localStorage.getItem(TOKEN_STORAGE_KEY);
          const user = localStorage.getItem(USER_STORAGE_KEY);
          
          if (token && user && isTokenValid(token)) {
            state.token = token;
            state.user = JSON.parse(user);
            state.isAuthenticated = true;
            return;
          }
        } catch (error) {
          console.error('Error loading auth from localStorage:', error);
        }
      }
      
      if (state.token && isTokenValid(state.token)) {
        state.isAuthenticated = true;
      } else {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        // Clear localStorage
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addMatcher(
        apiSlice.endpoints.login.matchPending,
        (state) => {
          state.error = null;
        }
      )
      .addMatcher(
        apiSlice.endpoints.login.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = isTokenValid(action.payload.token);
          state.error = null;
          
          // Persist to localStorage
          try {
            localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
          } catch (error) {
            console.error('Error saving auth to localStorage:', error);
          }
        }
      )
      .addMatcher(
        apiSlice.endpoints.login.matchRejected,
        (state, action) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = action.error?.message || 'Login failed';
          // Clear localStorage on failed login
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      )
      // Logout cases
      .addMatcher(
        apiSlice.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = null;
          // Clear localStorage
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      )
      .addMatcher(
        apiSlice.endpoints.logout.matchRejected,
        (state) => {
          // Even if logout API fails, we clear the state
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          // Clear localStorage
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      );
  },
});

export const { clearError, checkAuthStatus, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectUserId = (state) => state.auth.user?.user_id;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice;