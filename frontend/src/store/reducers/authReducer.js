import { REGISTER, LOGIN } from '../actions/authActions';

const initialState = {
  isLoggedIn: !!localStorage.getItem('token'),
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, isLoggedIn: true, user: action.payload };
    case REGISTER:
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, user: null };
    default:
      return state;
  }
};

export default authReducer;
