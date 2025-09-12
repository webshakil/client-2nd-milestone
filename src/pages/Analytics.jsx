/* eslint-disable */
const Analytics = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
        <p className="text-gray-600">Comprehensive insights and reporting dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Users', value: '1,234', change: '+12%' },
          { title: 'Elections Created', value: '89', change: '+5%' },
          { title: 'Total Votes', value: '5,678', change: '+15%' },
          { title: 'Engagement Rate', value: '68%', change: '+3%' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
            <div className="text-sm text-green-600 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900">Advanced Analytics</h3>
          <p className="text-sm text-gray-500 mt-1">
            Detailed charts and insights will be available in the next milestone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics