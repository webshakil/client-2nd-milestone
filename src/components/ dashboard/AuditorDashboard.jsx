import { ShieldCheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export const AuditorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Auditor Dashboard</h2>
        <p className="text-orange-100">Audit and verification tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Tools</h3>
          <div className="space-y-3">
            <Link to="/audit/elections" className="block p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700">
              <ClipboardDocumentListIcon className="h-5 w-5 inline mr-2" />
              Election Audit Trail
            </Link>
            <Link to="/audit/security" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700">
              Security Logs
            </Link>
            <Link to="/audit/compliance" className="block p-3 bg-red-50 hover:bg-red-100 rounded-lg text-red-700">
              Compliance Check
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification</h3>
          <div className="space-y-3">
            <Link to="/audit/votes" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700">
              <ShieldCheckIcon className="h-5 w-5 inline mr-2" />
              Vote Verification
            </Link>
            <Link to="/audit/reports" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700">
              Integrity Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};