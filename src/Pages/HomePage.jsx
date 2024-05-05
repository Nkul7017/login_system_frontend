import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

const HomePage = () => {
  const { state: authState, clearToken } = useAuth();
  const { authToken } = authState;
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login', { replace: true });
  };

  if (!authToken) {
    return <Navigate to="/login" replace={true} />;
  }

  const { state:user, loading, error } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to the Homepage</h2>
          {user && (
            <div className="mt-6">
              <p className="text-center text-lg font-medium text-gray-900">User Details:</p>
              <p className="text-center">Name: {user?.name}</p>
              <p className="text-center">Email: {user?.email}</p>
              {/* Add more user details as needed */}
            </div>
          )}
        </div>
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
