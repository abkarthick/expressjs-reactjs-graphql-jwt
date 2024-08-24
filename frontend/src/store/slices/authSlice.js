import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { token } = action.payload;
      const decodedToken = jwtDecode(token);
      state.isLoggedIn = true;
      state.user = decodedToken;
      state.token = token;
      localStorage.setItem('token', token);
    },
    logoutSuccess(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export const login = (email, password) => async (dispatch) => {
  // Call your API to login
  // On success:
  // const token = response.data.token;
  // dispatch(loginSuccess({ token }));
};

export const logout = () => (dispatch) => {
  dispatch(logoutSuccess());
};

export default authSlice.reducer;
