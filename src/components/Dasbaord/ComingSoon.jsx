import React from 'react'

const ComingSoon = () => {
  return (
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Coming in Next Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Milestone 2 (Sep 5-16)</h4>
              <ul className="text-sm space-y-1">
                <li>• Election Management</li>
                <li>• Multi-Method Voting</li>
                <li>• Cryptographic Security</li>
                <li>• Vote Verification</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Milestone 3 (Sep 17-28)</h4>
              <ul className="text-sm space-y-1">
                <li>• Payment Processing</li>
                <li>• 3D/4D Lottery System</li>
                <li>• Prize Management</li>
                <li>• Subscription Plans</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Milestone 4-6</h4>
              <ul className="text-sm space-y-1">
                <li>• Mobile Applications</li>
                <li>• AI Recommendations</li>
                <li>• 70+ Languages</li>
                <li>• Production Deployment</li>
              </ul>
            </div>
          </div>
        </div>
  )
}

export default ComingSoon
