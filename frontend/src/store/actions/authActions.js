import { useNavigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const register = (email, password) => {
  return async (dispatch) => {
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation Register($email: String!, $password: String!) {
            register(userInput: { email: $email, password: $password }) {
              id
              email
            }
          }
        `,
        variables: { email, password },
      });

      dispatch({ type: REGISTER, payload: result.data.register });
    } catch (error) {
      console.error('Register error:', error);
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              id
              email
              token
            }
          }
        `,
        variables: { email, password },
      });

      if (result.data.login.token) {
        localStorage.setItem('token', result.data.login.token);
      }

      dispatch({ type: LOGIN, payload: result.data.login });
    } catch (error) {
      console.error('Login error:', error);
    }
  };
};

export const logout = (navigate) => {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
    if (navigate) {
      navigate('/'); // Redirect to home or login page
    }
  };
};

export const updateProfile = (email) => async (dispatch) => {
  try {
    const result = await client.mutate({
      mutation: gql`
        mutation UpdateProfile($email: String!) {
          updateProfile(email: $email) {
            id
            email
          }
        }
      `,
      variables: { email },
    });

    dispatch({ type: UPDATE_PROFILE, payload: result.data.updateProfile });
  } catch (error) {
    console.error('Update profile error:', error);
  }
};
