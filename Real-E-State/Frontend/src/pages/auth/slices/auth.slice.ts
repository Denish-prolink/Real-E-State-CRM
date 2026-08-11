import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoginResponse } from '../types/auth.types';

interface AuthState {
  user: LoginResponse['data']['user'] | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const getInitialUser = (): LoginResponse['data']['user'] | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getInitialUser(),
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: LoginResponse['data']['user']; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    updateUserCompany: (state, action: PayloadAction<{ _id?: string; name?: string }>) => {
      if (state.user) {
        if (!state.user.companyId) {
          state.user.companyId = {} as unknown as typeof state.user.companyId;
        }
        const companyId = state.user.companyId as NonNullable<typeof state.user.companyId>;
        if (action.payload._id) {
          companyId._id = action.payload._id;
        }
        if (action.payload.name) {
          companyId.name = action.payload.name;
          state.user.firstName = action.payload.name;
        }
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateUserCompany } = authSlice.actions;
export default authSlice.reducer;
