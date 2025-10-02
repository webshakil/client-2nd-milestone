//last workable codes
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
import FraudManagement from './pages/FraudManagement';
import CreateElection2 from './pages/election-2/CreateElection2';
import EditElection2 from './pages/election-2/EditElection2';
import ElectionDashboard2 from './pages/election-2/ElectionDashboard2';
import ElectionList2 from './pages/election-2/ElectionList2';

// Milestone 3 imports
import Wallet from './pages/milestone3/Wallet';
import Subscriptions from './pages/milestone3/Subscriptions';
import LotteryDashboard from './pages/milestone3/LotteryDashboard';


const App = () => {
  return (
    <AuthProvider>
      <SecurityProvider>
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
              
              {/* Original Elections Routes */}
              {/* <Route path="elections" element={<Elections />} /> */}
               <Route path="elections" element={<ElectionDashboard2 />} />
              {/* <Route path="elections/create" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
                  <CreateElection />
                </RoleBasedRoute>
              } />
              <Route path="elections/:id/edit" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
                  <CreateElection />
                </RoleBasedRoute>
              } />  */}
              
              {/* Election-2 Routes */}
              <Route path="elections-2" element={<ElectionList2 />} />
              {/* <Route path="elections-2/dashboard" element={<ElectionDashboard2 />} /> */}
              <Route path="elections/create" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
                  <CreateElection2 />
                </RoleBasedRoute>
              } />
              <Route path="elections-2/:id/edit" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
                  <EditElection2 />
                </RoleBasedRoute>
              } />
              
              {/* Voting Routes */}
              <Route path="vote/:electionId" element={<VotePage />} />
              
              {/* Verification and Audit */}
              {/* <Route path="elections" element={<ElectionDashboard2 />} /> */}
              <Route path="verify" element={<VerificationPage />} />
              <Route path="audit" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'auditor', 'analyst']}>
                  <AuditPage />
                </RoleBasedRoute>
              } />
              
              {/* Analytics */}
              <Route path="analytics" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'analyst', 'moderator']}>
                  <Analytics />
                </RoleBasedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="admin/users" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin']}>
                  <UserManagement />
                </RoleBasedRoute>
              } />
              
              {/* Fraud Management */}
              <Route path="fraud" element={
                <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator']}>
                  <FraudManagement />
                </RoleBasedRoute>
              } />

              {/* Milestone 3 Routes - No role checks */}
              <Route path="wallet" element={<Wallet />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="lottery" element={<LotteryDashboard />} />
            </Route>
            
            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </SecurityProvider>
    </AuthProvider>
    
  );
};

 export default App;
// //last workable codes but for pyament and lottery this one
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router';
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
// import FraudManagement from './pages/FraudManagement';
// import CreateElection2 from './pages/election-2/CreateElection2';
// import EditElection2 from './pages/election-2/EditElection2';
// import ElectionDashboard2 from './pages/election-2/ElectionDashboard2';
// import ElectionList2 from './pages/election-2/ElectionList2';


// const App = () => {
//   return (
//     <AuthProvider>
//       <SecurityProvider>
//         <div className="min-h-screen bg-gray-50">
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//             }}
//           />
          
//           <Routes>
//             {/* Public Authentication Route */}
//             <Route
//               path="/auth"
//               element={
//                 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//                   <AuthenticationFlow />
//                 </div>
//               }
//             />
            
//             {/* Protected Routes with Layout */}
//             <Route path="/" element={
//               <ProtectedRoute>
//                 <Layout />
//               </ProtectedRoute>
//             }>
//               <Route index element={<Dashboard />} />
//               <Route path="dashboard" element={<Dashboard />} />
              
//               {/* Original Elections Routes */}
//               {/* <Route path="elections" element={<Elections />} /> */}
//                <Route path="elections" element={<ElectionDashboard2 />} />
//               {/* <Route path="elections/create" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//                   <CreateElection />
//                 </RoleBasedRoute>
//               } />
//               <Route path="elections/:id/edit" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//                   <CreateElection />
//                 </RoleBasedRoute>
//               } />  */}
              
//               {/* Election-2 Routes */}
//               <Route path="elections-2" element={<ElectionList2 />} />
//               {/* <Route path="elections-2/dashboard" element={<ElectionDashboard2 />} /> */}
//               <Route path="elections/create" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//                   <CreateElection2 />
//                 </RoleBasedRoute>
//               } />
//               <Route path="elections-2/:id/edit" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//                   <EditElection2 />
//                 </RoleBasedRoute>
//               } />
              
//               {/* Voting Routes */}
//               <Route path="vote/:electionId" element={<VotePage />} />
              
//               {/* Verification and Audit */}
//               {/* <Route path="elections" element={<ElectionDashboard2 />} /> */}
//               <Route path="verify" element={<VerificationPage />} />
//               <Route path="audit" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'auditor', 'analyst']}>
//                   <AuditPage />
//                 </RoleBasedRoute>
//               } />
              
//               {/* Analytics */}
//               <Route path="analytics" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'analyst', 'moderator']}>
//                   <Analytics />
//                 </RoleBasedRoute>
//               } />
              
//               {/* Admin Routes */}
//               <Route path="admin/users" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin']}>
//                   <UserManagement />
//                 </RoleBasedRoute>
//               } />
              
//               {/* Fraud Management */}
//               <Route path="fraud" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator']}>
//                   <FraudManagement />
//                 </RoleBasedRoute>
//               } />
//             </Route>
            
//             {/* Catch all redirect */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </div>
//       </SecurityProvider>
//     </AuthProvider>
    
//   );
// };

//  export default App;
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router';
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
// import FraudManagement from './pages/FraudManagement';

// const App = () => {
//   return (
    
//         <div className="min-h-screen bg-gray-50">
//           <Toaster 
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//             }}
//           />
          
//           <Routes>
//             {/* Public Authentication Route */}
//             <Route 
//               path="/auth" 
//               element={
//                 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//                   <AuthenticationFlow />
//                 </div>
//               } 
//             />
            
//             {/* Protected Routes with Layout */}
//             <Route path="/" element={
//               <ProtectedRoute>
//                 <Layout />
//               </ProtectedRoute>
//             }>
//               <Route index element={<Dashboard />} />
//               <Route path="dashboard" element={<Dashboard />} />
//               <Route path="elections" element={<Elections />} />
//               <Route path="elections/create" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//                   <CreateElection />
//                 </RoleBasedRoute>
//               } />
//               <Route path="elections/:id/edit" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'moderator', 'editor']}>
//                   <CreateElection />
//                 </RoleBasedRoute>
//               } />
//               <Route path="vote/:electionId" element={<VotePage />} />
//               <Route path="verify" element={<VerificationPage />} />
//               <Route path="audit" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'auditor', 'analyst']}>
//                   <AuditPage />
//                 </RoleBasedRoute>
//               } />
//               <Route path="analytics" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin', 'analyst', 'moderator']}>
//                   <Analytics />
                 
//                 </RoleBasedRoute>
//               } />
//                {/* New Fraud Management Route */}
//               {/* <Route path="fraud" element={<FraudManagement />} /> */}
//               <Route path="admin/users" element={
//                 <RoleBasedRoute allowedRoles={['manager', 'admin']}>
//                   <UserManagement />
//                 </RoleBasedRoute>
//               } />
//             </Route>

//             {/* Catch all redirect */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </div>
     
//   );
// };

// export default App;

