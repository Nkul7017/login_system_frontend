import React, { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  authToken: null,
  loading: false,
  error: null,
  signupSuccess: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, authToken: action.payload, loading: false, error: null };
    case 'CLEAR_TOKEN':
      return { ...state, authToken: null, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload};
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SIGNUP_SUCCESS':
      return { ...state, signupSuccess: true };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials, rememberMe) => {
    console.log(rememberMe)
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await axios.post('http://localhost:3000/api/users/login', credentials);

      dispatch({ type: 'SET_TOKEN', payload: response.data.token });

      if (rememberMe) {
        localStorage.setItem('authToken', response.data.token);
      } else {
        sessionStorage.setItem('authToken', response.data.token);
      }
    } catch (error) {
      console.log('Error logging in:', error?.response?.data?.error!==undefined?error?.response?.data?.error:error?.message);
      dispatch({ type: 'SET_ERROR', payload: error?.response?.data?.error!==undefined?error?.response?.data?.error:error?.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      await axios.post('http://localhost:3000/api/users/signup', userData);

      dispatch({ type: 'SIGNUP_SUCCESS' });
    } catch (error) {
      console.log('Error signing up:', error);
      dispatch({ type: 'SET_ERROR', payload: error?.response?.data?.error!==undefined?error?.response?.data?.error:error?.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearToken = () => {
    dispatch({ type: 'CLEAR_TOKEN' });
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  };

  useEffect(() => {

    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (storedToken) {
      dispatch({ type: 'SET_TOKEN', payload: storedToken });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, signup, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
