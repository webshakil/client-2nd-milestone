import { ClipboardDocumentCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export const ModeratorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Moderator Dashboard</h2>
        <p className="text-green-100">Content and election management tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Management</h3>
          <div className="space-y-3">
            <Link to="/moderation/content" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700">
              <ClipboardDocumentCheckIcon className="h-5 w-5 inline mr-2" />
              Review Reported Content
            </Link>
            <Link to="/moderation/comments" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700">
              Moderate Comments
            </Link>
            <Link to="/moderation/guidelines" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700">
              Content Guidelines
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Election Oversight</h3>
          <div className="space-y-3">
            <Link to="/moderation/elections" className="block p-3 bg-teal-50 hover:bg-teal-100 rounded-lg text-teal-700">
              <DocumentTextIcon className="h-5 w-5 inline mr-2" />
              Review Elections
            </Link>
            <Link to="/moderation/voting" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700">
              Monitor Voting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};