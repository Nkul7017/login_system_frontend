import React, { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';

const UserContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Perform API call to fetch user details
        const response = await axios.get('http://localhost:3000/api/users/fetchuser', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        dispatch({ type: 'SET_USER', payload: response.data });
      } catch (error) {
        console.log(error)
        dispatch({ type: 'SET_ERROR', payload: error?.response?.data?.error!==undefined?error?.response?.data?.error:error?.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      fetchUserDetails();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
