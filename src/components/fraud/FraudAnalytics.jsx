//after solving error 
// components/fraud/FraudAnalytics.js
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useFraud } from '../../hooks/useFraud';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

const FraudAnalytics = ({ reports }) => {
  const { fraudTypes, severityLevels, statusTypes } = useFraud();

  // Process data for charts
  const chartData = useMemo(() => {
    if (!reports || reports.length === 0) {
      return {
        statusData: [],
        severityData: [],
        typeData: [],
        timelineData: []
      };
    }

    // Status distribution
    const statusCounts = {};
    Object.keys(statusTypes).forEach(status => {
      statusCounts[status] = 0;
    });
    
    // Severity distribution
    const severityCounts = {};
    Object.keys(severityLevels).forEach(severity => {
      severityCounts[severity] = 0;
    });
    
    // Type distribution
    const typeCounts = {};
    Object.keys(fraudTypes).forEach(type => {
      typeCounts[type] = 0;
    });

    // Timeline data (reports by day)
    const timelineCounts = {};

    reports.forEach(report => {
      // Count by status
      if (Object.prototype.hasOwnProperty.call(statusCounts, report.status)) {
        statusCounts[report.status]++;
      }
      
      // Count by severity
      if (Object.prototype.hasOwnProperty.call(severityCounts, report.severity)) {
        severityCounts[report.severity]++;
      }
      
      // Count by type
      if (Object.prototype.hasOwnProperty.call(typeCounts, report.fraud_type)) {
        typeCounts[report.fraud_type]++;
      }
      
      // Count by date
      const date = new Date(report.created_at).toLocaleDateString();
      timelineCounts[date] = (timelineCounts[date] || 0) + 1;
    });

    return {
      statusData: Object.entries(statusCounts).map(([status, count]) => ({
        name: statusTypes[status],
        value: count,
        status: status
      })),
      severityData: Object.entries(severityCounts).map(([severity, count]) => ({
        name: severityLevels[severity],
        value: count,
        severity: severity
      })),
      typeData: Object.entries(typeCounts).map(([type, count]) => ({
        name: fraudTypes[type],
        value: count,
        type: type
      })),
      timelineData: Object.entries(timelineCounts)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .map(([date, count]) => ({
          date: date,
          reports: count
        }))
    };
  }, [reports, fraudTypes, severityLevels, statusTypes]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!reports || reports.length === 0) {
      return {
        total: 0,
        pending: 0,
        resolved: 0,
        highSeverity: 0,
        resolutionRate: 0,
        avgResponseTime: 0
      };
    }

    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const highSeverity = reports.filter(r => ['high', 'critical'].includes(r.severity)).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
    // Calculate average response time for resolved reports
    const resolvedReports = reports.filter(r => r.status === 'resolved' && r.updated_at);
    let avgResponseTime = 0;
    
    if (resolvedReports.length > 0) {
      const totalResponseTime = resolvedReports.reduce((acc, report) => {
        const created = new Date(report.created_at);
        const resolved = new Date(report.updated_at);
        return acc + (resolved - created);
      }, 0);
      
      avgResponseTime = Math.round(totalResponseTime / resolvedReports.length / (1000 * 60 * 60 * 24)); // Convert to days
    }

    return {
      total,
      pending,
      resolved,
      highSeverity,
      resolutionRate,
      avgResponseTime
    };
  }, [reports]);

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fraud Analytics
        </h3>
        <div className="text-center text-gray-500 py-8">
          No fraud reports available for analysis
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{summaryStats.total}</div>
          <div className="text-sm text-gray-600">Total Reports</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{summaryStats.resolved}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">{summaryStats.highSeverity}</div>
          <div className="text-sm text-gray-600">High Severity</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">{summaryStats.resolutionRate}%</div>
          <div className="text-sm text-gray-600">Resolution Rate</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-indigo-600">{summaryStats.avgResponseTime}</div>
          <div className="text-sm text-gray-600">Avg Days to Resolve</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Reports by Status
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.statusData.filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Reports by Severity
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.severityData.filter(item => item.value > 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Type Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Reports by Fraud Type
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.typeData.filter(item => item.value > 0)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Reports Timeline
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="reports" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Detailed Breakdown
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Breakdown */}
          <div>
            <h5 className="font-medium text-gray-700 mb-3">By Status</h5>
            <div className="space-y-2">
              {chartData.statusData.map((item, index) => (
                <div key={item.status} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Breakdown */}
          <div>
            <h5 className="font-medium text-gray-700 mb-3">By Severity</h5>
            <div className="space-y-2">
              {chartData.severityData.map((item, index) => (
                <div key={item.severity} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Type Breakdown */}
          <div>
            <h5 className="font-medium text-gray-700 mb-3">By Type</h5>
            <div className="space-y-2">
              {chartData.typeData.slice(0, 5).map((item, index) => (
                <div key={item.type} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-600 truncate">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Key Insights
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Report Analysis</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Total fraud reports: {summaryStats.total}</li>
              <li>• {summaryStats.pending} reports are still pending investigation</li>
              <li>• {summaryStats.resolutionRate}% resolution rate achieved</li>
              <li>• {summaryStats.highSeverity} high/critical severity cases require attention</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Performance Metrics</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Average resolution time: {summaryStats.avgResponseTime} days</li>
              <li>• Most common fraud type: {chartData.typeData.reduce((max, item) => item.value > max.value ? item : max, { value: 0, name: 'None' }).name}</li>
              <li>• {chartData.statusData.find(s => s.status === 'investigating')?.value || 0} cases under investigation</li>
              <li>• {chartData.statusData.find(s => s.status === 'escalated')?.value || 0} cases escalated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudAnalytics;

// // components/fraud/FraudAnalytics.js
// import React, { useMemo } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
// import { useFraud } from '../../hooks/useFraud';

// const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

// const FraudAnalytics = ({ reports }) => {
//   const { fraudTypes, severityLevels, statusTypes } = useFraud();

//   // Process data for charts
//   const chartData = useMemo(() => {
//     if (!reports || reports.length === 0) {
//       return {
//         statusData: [],
//         severityData: [],
//         typeData: [],
//         timelineData: []
//       };
//     }

//     // Status distribution
//     const statusCounts = {};
//     Object.keys(statusTypes).forEach(status => {
//       statusCounts[status] = 0;
//     });
    
//     // Severity distribution
//     const severityCounts = {};
//     Object.keys(severityLevels).forEach(severity => {
//       severityCounts[severity] = 0;
//     });
    
//     // Type distribution
//     const typeCounts = {};
//     Object.keys(fraudTypes).forEach(type => {
//       typeCounts[type] = 0;
//     });

//     // Timeline data (reports by day)
//     const timelineCounts = {};

//     reports.forEach(report => {
//       // Count by status
//       if (statusCounts.hasOwnProperty(report.status)) {
//         statusCounts[report.status]++;
//       }
      
//       // Count by severity
//       if (severityCounts.hasOwnProperty(report.severity)) {
//         severityCounts[report.severity]++;
//       }
      
//       // Count by type
//       if (typeCounts.hasOwnProperty(report.fraud_type)) {
//         typeCounts[report.fraud_type]++;
//       }
      
//       // Count by date
//       const date = new Date(report.created_at).toLocaleDateString();
//       timelineCounts[date] = (timelineCounts[date] || 0) + 1;
//     });

//     return {
//       statusData: Object.entries(statusCounts).map(([status, count]) => ({
//         name: statusTypes[status],
//         value: count,
//         status: status
//       })),
//       severityData: Object.entries(severityCounts).map(([severity, count]) => ({
//         name: severityLevels[severity],
//         value: count,
//         severity: severity
//       })),
//       typeData: Object.entries(typeCounts).map(([type, count]) => ({
//         name: fraudTypes[type],
//         value: count,
//         type: type
//       })),
//       timelineData: Object.entries(timelineCounts)
//         .sort((a, b) => new Date(a[0]) - new Date(b[0]))
//         .map(([date, count]) => ({
//           date: date,
//           reports: count
//         }))
//     };
//   }, [reports, fraudTypes, severityLevels, statusTypes]);

//   // Calculate summary statistics
//   const summaryStats = useMemo(() => {
//     if (!reports || reports.length === 0) {
//       return {
//         total: 0,
//         pending: 0,
//         resolved: 0,
//         highSeverity: 0,
//         resolutionRate: 0,
//         avgResponseTime: 0
//       };
//     }

//     const total = reports.length;
//     const pending = reports.filter(r => r.status === 'pending').length;
//     const resolved = reports.filter(r => r.status === 'resolved').length;
//     const highSeverity = reports.filter(r => ['high', 'critical'].includes(r.severity)).length;
//     const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
//     // Calculate average response time for resolved reports
//     const resolvedReports = reports.filter(r => r.status === 'resolved' && r.updated_at);
//     let avgResponseTime = 0;
    
//     if (resolvedReports.length > 0) {
//       const totalResponseTime = resolvedReports.reduce((acc, report) => {
//         const created = new Date(report.created_at);
//         const resolved = new Date(report.updated_at);
//         return acc + (resolved - created);
//       }, 0);
      
//       avgResponseTime = Math.round(totalResponseTime / resolvedReports.length / (1000 * 60 * 60 * 24)); // Convert to days
//     }

//     return {
//       total,
//       pending,
//       resolved,
//       highSeverity,
//       resolutionRate,
//       avgResponseTime
//     };
//   }, [reports]);

//   if (!reports || reports.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           Fraud Analytics
//         </h3>
//         <div className="text-center text-gray-500 py-8">
//           No fraud reports available for analysis
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Summary Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="text-2xl font-bold text-blue-600">{summaryStats.total}</div>
//           <div className="text-sm text-gray-600">Total Reports</div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</div>
//           <div className="text-sm text-gray-600">Pending</div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="text-2xl font-bold text-green-600">{summaryStats.resolved}</div>
//           <div className="text-sm text-gray-600">Resolved</div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="text-2xl font-bold text-red-600">{summaryStats.highSeverity}</div>
//           <div className="text-sm text-gray-600">High Severity</div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="text-2xl font-bold text-purple-600">{summaryStats.resolutionRate}%</div>
//           <div className="text-sm text-gray-600">Resolution Rate</div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="text-2xl font-bold text-indigo-600">{summaryStats.avgResponseTime}</div>
//           <div className="text-sm text-gray-600">Avg Days to Resolve</div>
//         </div>
//       </div>

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Status Distribution */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h4 className="text-lg font-semibold text-gray-900 mb-4">
//             Reports by Status
//           </h4>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={chartData.statusData.filter(item => item.value > 0)}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {chartData.statusData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Severity Distribution */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h4 className="text-lg font-semibold text-gray-900 mb-4">
//             Reports by Severity
//           </h4>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData.severityData.filter(item => item.value > 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#82ca9d" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Fraud Type Distribution */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h4 className="text-lg font-semibold text-gray-900 mb-4">
//             Reports by Fraud Type
//           </h4>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData.typeData.filter(item => item.value > 0)} layout="horizontal">
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis type="number" />
//               <YAxis dataKey="name" type="category" width={150} />
//               <Tooltip />
//               <Bar dataKey="value" fill="#ffc658" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Timeline */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h4 className="text-lg font-semibold text-gray-900 mb-4">
//             Reports Timeline
//           </h4>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={chartData.timelineData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis 
//                 dataKey="date" 
//                 tick={{ fontSize: 12 }}
//                 angle={-45}
//                 textAnchor="end"
//               />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="reports" stroke="#8884d8" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Detailed Breakdown Table */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h4 className="text-lg font-semibold text-gray-900 mb-4">
//           Detailed Breakdown
//         </h4>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Status Breakdown */}
//           <div>
//             <h5 className="font-medium text-gray-700 mb-3">By Status</h5>
//             <div className="space-y-2">
//               {chartData.statusData.map((item, index) => (
//                 <div key={item.status} className="flex justify-between items-center">
//                   <div className="flex items-center">
//                     <div 
//                       className="w-3 h-3 rounded-full mr-2"
//                       style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                     ></div>
//                     <span className="text-sm text-gray-600">{item.name}</span>
//                   </div>
//                   <span className="text-sm font-medium">{item.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Severity Breakdown */}
//           <div>
//             <h5 className="font-medium text-gray-700 mb-3">By Severity</h5>
//             <div className="space-y-2">
//               {chartData.severityData.map((item, index) => (
//                 <div key={item.severity} className="flex justify-between items-center">
//                   <div className="flex items-center">
//                     <div 
//                       className="w-3 h-3 rounded-full mr-2"
//                       style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                     ></div>
//                     <span className="text-sm text-gray-600">{item.name}</span>
//                   </div>
//                   <span className="text-sm font-medium">{item.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Type Breakdown */}
//           <div>
//             <h5 className="font-medium text-gray-700 mb-3">By Type</h5>
//             <div className="space-y-2">
//               {chartData.typeData.slice(0, 5).map((item, index) => (
//                 <div key={item.type} className="flex justify-between items-center">
//                   <div className="flex items-center">
//                     <div 
//                       className="w-3 h-3 rounded-full mr-2"
//                       style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                     ></div>
//                     <span className="text-sm text-gray-600 truncate">{item.name}</span>
//                   </div>
//                   <span className="text-sm font-medium">{item.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Key Insights */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h4 className="text-lg font-semibold text-gray-900 mb-4">
//           Key Insights
//         </h4>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-3">
//             <h5 className="font-medium text-gray-700">Report Analysis</h5>
//             <ul className="text-sm text-gray-600 space-y-1">
//               <li>• Total fraud reports: {summaryStats.total}</li>
//               <li>• {summaryStats.pending} reports are still pending investigation</li>
//               <li>• {summaryStats.resolutionRate}% resolution rate achieved</li>
//               <li>• {summaryStats.highSeverity} high/critical severity cases require attention</li>
//             </ul>
//           </div>
          
//           <div className="space-y-3">
//             <h5 className="font-medium text-gray-700">Performance Metrics</h5>
//             <ul className="text-sm text-gray-600 space-y-1">
//               <li>• Average resolution time: {summaryStats.avgResponseTime} days</li>
//               <li>• Most common fraud type: {chartData.typeData.reduce((max, item) => item.value > max.value ? item : max, { value: 0, name: 'None' }).name}</li>
//               <li>• {chartData.statusData.find(s => s.status === 'investigating')?.value || 0} cases under investigation</li>
//               <li>• {chartData.statusData.find(s => s.status === 'escalated')?.value || 0} cases escalated</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FraudAnalytics;