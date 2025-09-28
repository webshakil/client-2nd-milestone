



//this is last working code
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { SecurityProvider } from './contexts/SecurityContext.jsx'
//import { ElectionProvider } from './contexts/ElectionContext/ElectionProvider.jsx'
import './index.css'
import { ElectionProvider } from './contexts/ElectionContext/ElectionContext.jsx'
//import { ElectionProvider } from './contexts/ElectionContext/ElectionProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SecurityProvider> 
        <AuthProvider> 
          <ElectionProvider>
            <App />
          </ElectionProvider>
        </AuthProvider> 
      </SecurityProvider> 
    </BrowserRouter>
  </React.StrictMode>,
)






// //ADDING election context
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router'
// import App from './App.jsx'
// import { AuthProvider } from './contexts/AuthContext.jsx'
// import { SecurityProvider } from './contexts/SecurityContext.jsx'
// //import { ElectionProvider } from './contexts/ElectionContext.jsx'  // Add this import
// import './index.css'
// import { ElectionProvider } from './contexts/ElectionContext/ElectionContext.jsx'


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <SecurityProvider> 
//         <AuthProvider> 
//           <ElectionProvider>  {/* Add ElectionProvider here */}
//             <App />
//           </ElectionProvider>
//         </AuthProvider> 
//       </SecurityProvider> 
//     </BrowserRouter>
//   </React.StrictMode>,
// )
// //latest
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router'
// import App from './App.jsx'
// import { AuthProvider } from './contexts/AuthContext.jsx'
// import { SecurityProvider } from './contexts/SecurityContext.jsx'
// import './index.css'
// //import { AuthProvider } from './contexts/auth/AuthProvider.jsx'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <SecurityProvider> 
//         <AuthProvider> 
//           <App />
//         </AuthProvider> 
//       </SecurityProvider> 
//     </BrowserRouter>
//   </React.StrictMode>,
// )





// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router'
// import App from './App.jsx'
// import { AuthProvider } from './contexts/AuthContext.jsx'
// import { SecurityProvider } from './contexts/SecurityContext.jsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <SecurityProvider>
//         <AuthProvider>
//           <App />
//         </AuthProvider>
//       </SecurityProvider>
//     </BrowserRouter>
//   </React.StrictMode>,
// )

