import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const ProtectedRoute = ({ children }) => {
  /*eslint-disable*/
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // TEMPORARY: Bypass authentication for demo
  // Comment out the authentication check
  /*
  if (!isAuthenticated) {
    // Redirect to auth with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  */

  return children;
};

export default ProtectedRoute;
//this is the last workable code. to bypass auth above code
// import React from 'react';
// import { Navigate, useLocation } from 'react-router';
// import { useAuth } from '../contexts/AuthContext';
// import LoadingScreen from '../components/LoadingScreen';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();
//   const location = useLocation();

//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   if (!isAuthenticated) {
//     // Redirect to auth with return url
//     return <Navigate to="/auth" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;