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



