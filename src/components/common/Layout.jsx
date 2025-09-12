//design fix
import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          user={userData}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
// import React, { useState } from 'react';
// import { Outlet } from 'react-router';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import { useAuth } from '../../contexts/AuthContext';

// const Layout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { userData } = useAuth();

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar 
//         isOpen={sidebarOpen} 
//         onClose={() => setSidebarOpen(false)} 
//       />
      
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <Header 
//           onMenuClick={() => setSidebarOpen(true)}
//           user={userData}
//         />
        
//         {/* Main Content Area */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;