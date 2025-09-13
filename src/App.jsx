// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router';
// import { Toaster } from 'react-hot-toast';
// import { useAuth } from './contexts/AuthContext';
// import AuthenticationFlow from './components/AuthenticationFlow';
// import ProtectedRoute from './routes/ProtectedRoute';
// import RoleBasedRoute from './routes/RoleBasedRoute';
// import Layout from './components/common/Layout';
// import Dashboard from './pages/Dashboard';
// import Elections from './pages/Elections';
// import CreateElection from './pages/CreateElection';
// import VotePage from './pages/VotePage';
// import VerificationPage from './pages/VerificationPage';
// import AuditPage from './pages/AuditPage';
// import UserManagement from './pages/UserManagement';
// import Analytics from './pages/Analytics';
// import LoadingScreen from './components/LoadingScreen';

// const App = () => {
//   const [isInitializing, setIsInitializing] = useState(true);
//   const { dispatch, isAuthenticated } = useAuth();

//   // Token persistence logic in App.js
//   useEffect(() => {
//     const initializeAuth = () => {
//       try {
//         // Check for stored tokens and user data
//         const accessToken = localStorage.getItem('vottery_access_token');
//         //const refreshToken = localStorage.getItem('vottery_refresh_token');
//         const userData = localStorage.getItem('vottery_user_data');
//         const tokenExpiry = localStorage.getItem('vottery_token_expiry');
//         const tokenTimestamp = localStorage.getItem('vottery_token_timestamp');

//         if (accessToken && userData && tokenExpiry && tokenTimestamp) {
//           try {
//             // Parse token expiry info
//             const expiryInfo = JSON.parse(tokenExpiry);
//             const timestamp = parseInt(tokenTimestamp);
            
//             // Check if token is expired
//             const parseTokenExpiry = (expiry) => {
//               const match = expiry.match(/^(\d+)([smhd])$/);
//               if (!match) return 60000; // 1 minute default
              
//               const value = parseInt(match[1]);
//               const unit = match[2];
              
//               switch (unit) {
//                 case 's': return value * 1000;
//                 case 'm': return value * 60 * 1000;
//                 case 'h': return value * 60 * 60 * 1000;
//                 case 'd': return value * 24 * 60 * 60 * 1000;
//                 default: return 60000;
//               }
//             };

//             const expiryMs = parseTokenExpiry(expiryInfo.accessTokenExpiry);
//             const tokenAge = Date.now() - timestamp;
//             const isTokenExpired = tokenAge >= expiryMs;

//             if (!isTokenExpired) {
//               // Token is valid, restore auth state
//               const parsedUserData = JSON.parse(userData);
              
//               // Restore all authentication state
//               dispatch({ type: 'SET_USER_DATA', payload: parsedUserData });
//               dispatch({ type: 'SET_USER_ID', payload: parsedUserData.id });
//               dispatch({ type: 'SET_EMAIL', payload: parsedUserData.sngine_email });
//               dispatch({ type: 'SET_PHONE', payload: parsedUserData.sngine_phone });
//               dispatch({ type: 'SET_EMAIL_VERIFIED', payload: true });
//               dispatch({ type: 'SET_PHONE_VERIFIED', payload: true });
//               dispatch({ type: 'SET_BIOMETRIC_VERIFIED', payload: true });
//               dispatch({ type: 'SET_PROFILE_CREATED', payload: true });
//               dispatch({ type: 'SET_SECURITY_QUESTIONS_SETUP', payload: true });
//               dispatch({ type: 'SET_AUTHENTICATED', payload: true });

//               console.log('Token restored successfully');
//             } else {
//               // Token expired, clear storage
//               localStorage.removeItem('vottery_access_token');
//               localStorage.removeItem('vottery_refresh_token');
//               localStorage.removeItem('vottery_token_expiry');
//               localStorage.removeItem('vottery_token_timestamp');
//               localStorage.removeItem('vottery_user_data');
//               console.log('Token expired, cleared storage');
//             }
//             /*eslint-disable*/
//           } catch (parseError) {
//             // Error parsing stored data, clear everything
//             localStorage.removeItem('vottery_access_token');
//             localStorage.removeItem('vottery_refresh_token');
//             localStorage.removeItem('vottery_token_expiry');
//             localStorage.removeItem('vottery_token_timestamp');
//             localStorage.removeItem('vottery_user_data');
//             console.warn('Failed to parse stored auth data, cleared storage');
//           }
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//       } finally {
//         setIsInitializing(false);
//       }
//     };

//     initializeAuth();
//   }, [dispatch]);

//   // Show loading while checking tokens
//   if (isInitializing) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#363636',
//             color: '#fff',
//           },
//         }}
//       />
      
//       <Routes>
//         {/* Public Authentication Route */}
//         <Route 
//           path="/auth" 
//           element={
//             isAuthenticated ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//                 <AuthenticationFlow />
//               </div>
//             )
//           } 
//         />
        
//         {/* Protected Routes with Layout */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }>
//           <Route index element={
//             isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
//           } />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="elections" element={<Elections />} />
//           <Route path="elections/create" element={
//             <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//               <CreateElection />
//             </RoleBasedRoute>
//           } />
//           <Route path="elections/:id/edit" element={
//             <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//               <CreateElection />
//             </RoleBasedRoute>
//           } />
//           <Route path="vote/:electionId" element={<VotePage />} />
//           <Route path="verify" element={<VerificationPage />} />
//           <Route path="audit" element={
//             <RoleBasedRoute allowedRoles={['manager', 'admin', 'auditor', 'analyst']}>
//               <AuditPage />
//             </RoleBasedRoute>
//           } />
//           <Route path="analytics" element={
//             <RoleBasedRoute allowedRoles={['manager', 'admin', 'analyst', 'moderator']}>
//               <Analytics />
//             </RoleBasedRoute>
//           } />
//           <Route path="admin/users" element={
//             <RoleBasedRoute allowedRoles={['manager', 'admin']}>
//               <UserManagement />
//             </RoleBasedRoute>
//           } />
//         </Route>

//         {/* Catch all redirect */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;



import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SecurityProvider } from './contexts/SecurityContext';
import AuthenticationFlow from './components/AuthenticationFlow';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Elections from './pages/Elections';
import CreateElection from './pages/CreateElection';
import VotePage from './pages/VotePage';
import VerificationPage from './pages/VerificationPage';
import AuditPage from './pages/AuditPage';
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';
import LoadingScreen from './components/LoadingScreen';

const App = () => {
  return (
    
        <div className="min-h-screen bg-gray-50">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Public Authentication Route */}
            <Route 
              path="/auth" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <AuthenticationFlow />
                </div>
              } 
            />
            
            {/* Protected Routes with Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="elections" element={<Elections />} />
              <Route path="elections/create" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
                  <CreateElection />
                </RoleBasedRoute>
              } />
              <Route path="elections/:id/edit" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
                  <CreateElection />
                </RoleBasedRoute>
              } />
              <Route path="vote/:electionId" element={<VotePage />} />
              <Route path="verify" element={<VerificationPage />} />
              <Route path="audit" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'auditor', 'analyst']}>
                  <AuditPage />
                </RoleBasedRoute>
              } />
              <Route path="analytics" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'analyst', 'moderator']}>
                  <Analytics />
                </RoleBasedRoute>
              } />
              <Route path="admin/users" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin']}>
                  <UserManagement />
                </RoleBasedRoute>
              } />
            </Route>

            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
     
  );
};

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './contexts/AuthContext';
// import { SecurityProvider } from './contexts/SecurityContext';
// import AuthenticationFlow from './components/AuthenticationFlow';
// import ProtectedRoute from './routes/ProtectedRoute';
// import RoleBasedRoute from './routes/RoleBasedRoute';
// import Layout from './components/common/Layout';
// import Dashboard from './pages/Dashboard';
// import Elections from './pages/Elections';
// import CreateElection from './pages/CreateElection';
// import VotePage from './pages/VotePage';
// import VerificationPage from './pages/VerificationPage';
// import AuditPage from './pages/AuditPage';
// import UserManagement from './pages/UserManagement';
// import Analytics from './pages/Analytics';
// import LoadingScreen from './components/LoadingScreen';

// const App = () => {
//   return (
   
  
//         <Router>
//           <div className="min-h-screen bg-gray-50">
//             <Toaster 
//               position="top-right"
//               toastOptions={{
//                 duration: 4000,
//                 style: {
//                   background: '#363636',
//                   color: '#fff',
//                 },
//               }}
//             />
            
//             <Routes>
//               {/* Public Authentication Route */}
//               <Route 
//                 path="/auth" 
//                 element={
//                   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//                     <AuthenticationFlow />
//                   </div>
//                 } 
//               />
              
//               {/* Protected Routes with Layout */}
//               <Route path="/" element={
//                 <ProtectedRoute>
//                   <Layout />
//                 </ProtectedRoute>
//               }>
//                 {/* Dashboard - Role-based redirect */}
//                 <Route index element={<Dashboard />} />
//                 <Route path="dashboard" element={<Dashboard />} />
                
//                 {/* Election Management */}
//                 <Route path="elections" element={<Elections />} />
//                 <Route path="elections/create" element={
//                   <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//                     <CreateElection />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="elections/:id/edit" element={
//                   <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//                     <CreateElection />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* Voting */}
//                 <Route path="vote/:electionId" element={<VotePage />} />
                
//                 {/* Verification & Audit */}
//                 <Route path="verify" element={<VerificationPage />} />
//                 <Route path="audit" element={
//                   <RoleBasedRoute allowedRoles={['manager', 'admin', 'auditor', 'analyst']}>
//                     <AuditPage />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* Analytics */}
//                 <Route path="analytics" element={
//                   <RoleBasedRoute allowedRoles={['manager', 'admin', 'analyst', 'moderator']}>
//                     <Analytics />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* User Management - Admin only */}
//                 <Route path="admin/users" element={
//                   <RoleBasedRoute allowedRoles={['manager', 'admin']}>
//                     <UserManagement />
//                   </RoleBasedRoute>
//                 } />
//               </Route>
              
//               {/* Catch all redirect */}
//               <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>
//           </div>
//         </Router>
   
//   );
// };

// export default App;
// //to mimic that i am from sngine with 5 steps
// // import React from 'react';
// // import { Routes, Route, Navigate } from 'react-router';
// // import { useAuth } from './contexts/AuthContext';
// // import { useSecurity } from './contexts/SecurityContext';
// // import AccessDenied from './components/AccessDenied';
// // import AuthenticationFlow from './components/AuthenticationFlow';
// // import Dashboard from './components/Dashboard';
// // import LoadingScreen from './components/LoadingScreen';

// // function App() {
// //   const { isAuthenticated, isLoading } = useAuth();
// //   const { isValidReferrer, referrerCheckComplete } = useSecurity();

// //   // DEBUG: Log the states to help troubleshoot
// //   console.log('🔍 App States:', {
// //     isAuthenticated,
// //     isLoading,
// //     isValidReferrer,
// //     referrerCheckComplete
// //   });

// //   // Show loading while auth or referrer check is in progress
// //   if (isLoading || !referrerCheckComplete) {
// //     return <LoadingScreen />;
// //   }

// //   // Show access denied if referrer check fails
// //   if (!isValidReferrer) {
// //     return <AccessDenied />;
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Routes>
// //         <Route 
// //           path="/" 
// //           element={
// //             isAuthenticated ? 
// //             <Navigate to="/dashboard" replace /> : 
// //             <AuthenticationFlow />
// //           } 
// //         />
// //         <Route 
// //           path="/dashboard" 
// //           element={
// //             isAuthenticated ? 
// //             <Dashboard /> : 
// //             <Navigate to="/" replace />
// //           } 
// //         />
// //         <Route path="*" element={<Navigate to="/" replace />} />
// //       </Routes>
// //     </div>
// //   );
// // }

// // export default App;


// //latest orginal code without mimic

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router';
// import { useAuth } from './contexts/AuthContext';
// //import { useSecurity } from './contexts/SecurityContext';
// //import AccessDenied from './components/AccessDenied';
// import AuthenticationFlow from './components/AuthenticationFlow';
// import Dashboard from './components/Dashboard';
// import LoadingScreen from './components/LoadingScreen';
// //import Dashboard from './components/Dasbaord/Dashboard';
// //import { useAuth } from './contexts/auth/AuthContext';
// //import AdminManagement from './components/AdminManagement';

// function App() {
//   const { isAuthenticated, isLoading } = useAuth();
//   //const { isValidReferrer, checkReferrer } = useSecurity();

//   // useEffect(() => {
//   //   checkReferrer();
//   // }, [checkReferrer]);

//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   // if (!isValidReferrer) {
//   //   return <AccessDenied />;
//   // }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Routes>
//         <Route 
//           path="/" 
//           element={
//             isAuthenticated ? 
//             <Navigate to="/dashboard" replace /> : 
//             <AuthenticationFlow />
//           } 
//         />
//         <Route 
//           path="/dashboard" 
//           element={
//             isAuthenticated ? 
//             <Dashboard /> : 
//             <Navigate to="/" replace />
//           } 
//         />
//         {/* <Route path="/admin/users" element={<AdminManagement />} /> */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;



