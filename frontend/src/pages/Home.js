import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/actions/authActions';
import Layout from '../components/Layout'

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  let email = 'User';
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      email = decodedToken.email;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  return (

    <div><Layout>
      {isLoggedIn ? (
        <>
          <h1>Welcome {user ? user.email : email}!</h1>
        </>
      ) : (
        <h1>Please log in.</h1>
      )}
    </Layout>
    </div>
  );
};

export default Home;