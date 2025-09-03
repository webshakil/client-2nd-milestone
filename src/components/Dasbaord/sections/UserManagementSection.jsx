//some users
import React from 'react';

const UserManagementSection = ({
  selectedUserId,
  setSelectedUserId,
  selectedAdminRole,
  setSelectedAdminRole,
  selectedUserType,
  setSelectedUserType,
  selectedSubscription,
  setSelectedSubscription,
  isUpdatingRole,
  handleUpdateUserRole
}) => {
  // Sample USA names for the dropdown
  const usaNames = [
    'John Smith',
    'Emily Johnson',
    'Michael Brown',
    'Sarah Davis',
    'David Wilson',
    'Jessica Miller',
    'Christopher Moore',
    'Ashley Taylor',
    'Matthew Anderson',
    'Amanda Thomas',
    'Daniel Jackson',
    'Stephanie White',
    'James Harris',
    'Jennifer Martin',
    'Robert Thompson',
    'Lisa Garcia',
    'William Martinez',
    'Michelle Robinson',
    'Richard Clark',
    'Karen Rodriguez',
    'Thomas Lewis',
    'Nancy Lee',
    'Charles Walker',
    'Betty Hall',
    'Joseph Allen',
    'Helen Young',
    'Mark Hernandez',
    'Sandra King',
    'Paul Wright',
    'Donna Lopez'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-4">
        <h4 className="font-medium text-gray-900 mb-4">Update User Role & Type</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              All users
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUpdatingRole}
            >
              <option value="">Select User</option>
              {usaNames.map((name, index) => (
                <option key={index} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Role
            </label>
            <select
              value={selectedAdminRole}
              onChange={(e) => setSelectedAdminRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUpdatingRole}
            >
              <option value="">Select Role</option>
              <option value="analyst">Analyst</option>
              <option value="editor">Editor</option>
              <option value="advertiser">Advertiser</option>
              <option value="moderator">Moderator</option>
              <option value="auditor">Auditor</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type
            </label>
            <select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUpdatingRole}
            >
              <option value="">Select Type</option>
              <option value="voter">Voter</option>
              <option value="individual_creator">Individual Creator</option>
              <option value="organization_creator">Organization Creator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subscription
            </label>
            <select
              value={selectedSubscription}
              onChange={(e) => setSelectedSubscription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUpdatingRole}
            >
              <option value="">Select Subscription</option>
              <option value="free">Free</option>
              <option value="subscribed">Subscribed</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleUpdateUserRole}
            disabled={isUpdatingRole || !selectedUserId || !selectedAdminRole || !selectedUserType || !selectedSubscription}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            {isUpdatingRole ? 'Updating...' : 'Update User Role'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Role Assignment</h4>
            <p className="text-sm text-gray-600">Manage user roles and permissions</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            Manage Roles
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">User Types</h4>
            <p className="text-sm text-gray-600">Individual, Organization, Voters</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
            Configure Types
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementSection;
// import React from 'react';

// const UserManagementSection = ({
//   selectedUserId,
//   setSelectedUserId,
//   selectedAdminRole,
//   setSelectedAdminRole,
//   selectedUserType,
//   setSelectedUserType,
//   selectedSubscription,
//   setSelectedSubscription,
//   isUpdatingRole,
//   handleUpdateUserRole
// }) => {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
      
//       <div className="bg-gray-50 rounded-lg p-6 mb-4">
//         <h4 className="font-medium text-gray-900 mb-4">Update User Role & Type</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               All users
//             </label>
//             <input
//               type="number"
//               value={selectedUserId}
//               onChange={(e) => setSelectedUserId(e.target.value)}
//               placeholder="Enter User ID"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               disabled={isUpdatingRole}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Admin Role
//             </label>
//             <select
//               value={selectedAdminRole}
//               onChange={(e) => setSelectedAdminRole(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               disabled={isUpdatingRole}
//             >
//               <option value="">Select Role</option>
//               <option value="analyst">Analyst</option>
//               <option value="editor">Editor</option>
//               <option value="advertiser">Advertiser</option>
//               <option value="moderator">Moderator</option>
//               <option value="auditor">Auditor</option>
//               <option value="admin">Admin</option>
//               <option value="manager">Manager</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               User Type
//             </label>
//             <select
//               value={selectedUserType}
//               onChange={(e) => setSelectedUserType(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               disabled={isUpdatingRole}
//             >
//               <option value="">Select Type</option>
//               <option value="voter">Voter</option>
//               <option value="individual_creator">Individual Creator</option>
//               <option value="organization_creator">Organization Creator</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Subscription
//             </label>
//             <select
//               value={selectedSubscription}
//               onChange={(e) => setSelectedSubscription(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               disabled={isUpdatingRole}
//             >
//               <option value="">Select Subscription</option>
//               <option value="free">Free</option>
//               <option value="subscribed">Subscribed</option>
//             </select>
//           </div>
//         </div>

//         <div className="mt-4">
//           <button
//             onClick={handleUpdateUserRole}
//             disabled={isUpdatingRole || !selectedUserId || !selectedAdminRole || !selectedUserType || !selectedSubscription}
//             className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium"
//           >
//             {isUpdatingRole ? 'Updating...' : 'Update User Role'}
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//           <div>
//             <h4 className="font-medium text-gray-900">Role Assignment</h4>
//             <p className="text-sm text-gray-600">Manage user roles and permissions</p>
//           </div>
//           <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
//             Manage Roles
//           </button>
//         </div>
//         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//           <div>
//             <h4 className="font-medium text-gray-900">User Types</h4>
//             <p className="text-sm text-gray-600">Individual, Organization, Voters</p>
//           </div>
//           <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
//             Configure Types
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagementSection;