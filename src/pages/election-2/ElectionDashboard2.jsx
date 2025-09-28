// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router';
// import { toast } from 'react-hot-toast';
// import {
//   PlusIcon,
//   ChartBarIcon,
//   UsersIcon,
//   CalendarIcon,
//   TrophyIcon,
//   EyeIcon,
//   ArrowTrendingUpIcon,
//   CurrencyDollarIcon,
//   GiftIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   XCircleIcon
// } from '@heroicons/react/24/outline';
// import LoadingScreen from '../../components/LoadingScreen';

// const ElectionDashboard2 = () => {
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalElections: 0,
//     activeElections: 0,
//     draftElections: 0,
//     upcomingElections: 0,
//     completedElections: 0,
//     totalVotes: 0,
//     freeElections: 0,
//     paidElections: 0,
//     lotteryElections: 0,
//     totalRevenue: 0
//   });
  
//   const [recentElections, setRecentElections] = useState([]);
//   const [topPerformingElections, setTopPerformingElections] = useState([]);

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = useCallback(async () => {
//     try {
//       setLoading(true);
      
//       // Fetch all elections from the API
//       const response = await fetch('http://localhost:3004/api/elections');
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success) {
//         const elections = result.data.elections || result.data || [];
        
//         // Calculate comprehensive stats
//         const now = new Date();
//         const statsData = {
//           totalElections: elections.length,
//           activeElections: elections.filter(e => {
//             const startDate = new Date(e.start_date);
//             const endDate = new Date(e.end_date);
//             return !e.is_draft && e.is_published && now >= startDate && now <= endDate;
//           }).length,
//           draftElections: elections.filter(e => e.is_draft).length,
//           upcomingElections: elections.filter(e => {
//             const startDate = new Date(e.start_date);
//             return !e.is_draft && e.is_published && now < startDate;
//           }).length,
//           completedElections: elections.filter(e => {
//             const endDate = new Date(e.end_date);
//             return !e.is_draft && e.is_published && now > endDate;
//           }).length,
//           totalVotes: elections.reduce((sum, e) => sum + (e.total_votes || 0), 0),
//           freeElections: elections.filter(e => e.pricing_type === 'free').length,
//           paidElections: elections.filter(e => e.pricing_type !== 'free').length,
//           lotteryElections: elections.filter(e => e.is_lotterized).length,
//           totalRevenue: elections.reduce((sum, e) => {
//             if (e.pricing_type === 'general') {
//               return sum + ((e.participation_fee || 0) * (e.total_votes || 0));
//             } else if (e.pricing_type === 'regional') {
//               // Simplified calculation - in real app you'd track regional votes
//               const avgRegionalFee = Object.values(e.regional_fees || {}).reduce((a, b) => a + b, 0) / Math.max(Object.keys(e.regional_fees || {}).length, 1) || 0;
//               return sum + (avgRegionalFee * (e.total_votes || 0));
//             }
//             return sum;
//           }, 0)
//         };
        
//         setStats(statsData);
        
//         // Set recent elections (last 5)
//         const sortedElections = [...elections].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//         setRecentElections(sortedElections.slice(0, 5));
        
//         // Set top performing elections by vote count
//         const topPerforming = [...elections]
//           .filter(e => (e.total_votes || 0) > 0)
//           .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
//           .slice(0, 3);
//         setTopPerformingElections(topPerforming);
        
//       } else {
//         throw new Error(result.message || 'Failed to fetch elections');
//       }
      
//     } catch (error) {
//       console.error('Error loading dashboard data:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const getElectionStatus = (election) => {
//     const now = new Date();
//     const startDate = new Date(election.start_date);
//     const endDate = new Date(election.end_date);
    
//     if (election.is_draft) return 'draft';
//     if (!election.is_published) return 'unpublished';
//     if (now < startDate) return 'upcoming';
//     if (now >= startDate && now <= endDate) return 'active';
//     if (now > endDate) return 'completed';
//     return 'unknown';
//   };

//   const getStatusBadge = (election) => {
//     const status = getElectionStatus(election);
//     const statusConfig = {
//       draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft', icon: ClockIcon },
//       unpublished: { color: 'bg-yellow-100 text-yellow-800', text: 'Unpublished', icon: XCircleIcon },
//       upcoming: { color: 'bg-blue-100 text-blue-800', text: 'Upcoming', icon: CalendarIcon },
//       active: { color: 'bg-green-100 text-green-800', text: 'Active', icon: CheckCircleIcon },
//       completed: { color: 'bg-purple-100 text-purple-800', text: 'Completed', icon: TrophyIcon },
//       unknown: { color: 'bg-gray-100 text-gray-800', text: 'Unknown', icon: ClockIcon }
//     };

//     const config = statusConfig[status] || statusConfig.unknown;
//     const IconComponent = config.icon;
    
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
//         <IconComponent className="h-3 w-3 mr-1" />
//         {config.text}
//       </span>
//     );
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const handleQuickAction = (action) => {
//     switch (action) {
//       case 'create':
//         navigate('/elections-2/create');
//         break;
//       case 'viewAll':
//         navigate('/elections-2');
//         break;
//       case 'analytics':
//         navigate('/analytics');
//         break;
//       default:
//         break;
//     }
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Election Dashboard</h1>
//               <p className="mt-2 text-sm text-gray-600">
//                 Comprehensive overview of all elections on the platform
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <Link
//                 to="/elections-2"
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <EyeIcon className="h-4 w-4 mr-2" />
//                 Browse All Elections
//               </Link>
              
//               <Link
//                 to="/elections-2/create"
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <PlusIcon className="h-4 w-4 mr-2" />
//                 Create Election
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Primary Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <ChartBarIcon className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Total Elections
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {stats.totalElections.toLocaleString()}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <CheckCircleIcon className="h-6 w-6 text-green-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Active Elections
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {stats.activeElections.toLocaleString()}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <UsersIcon className="h-6 w-6 text-blue-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Total Votes Cast
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {stats.totalVotes.toLocaleString()}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Total Revenue
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {formatCurrency(stats.totalRevenue)}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Secondary Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <CalendarIcon className="h-6 w-6 text-blue-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Upcoming
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {stats.upcomingElections}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <TrophyIcon className="h-6 w-6 text-purple-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Completed
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {stats.completedElections}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <GiftIcon className="h-6 w-6 text-yellow-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Lottery Elections
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {stats.lotteryElections}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <ClockIcon className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Draft Elections
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {stats.draftElections}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Recent Elections */}
//           <div className="lg:col-span-2">
//             <div className="bg-white shadow rounded-lg">
//               <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg leading-6 font-medium text-gray-900">
//                     Recent Elections
//                   </h3>
//                   <Link
//                     to="/elections-2"
//                     className="text-sm text-blue-600 hover:text-blue-500"
//                   >
//                     View all
//                   </Link>
//                 </div>
//               </div>
              
//               <div className="px-4 py-5 sm:p-6">
//                 {recentElections.length === 0 ? (
//                   <div className="text-center py-12">
//                     <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
//                     <h3 className="mt-2 text-sm font-medium text-gray-900">No elections yet</h3>
//                     <p className="mt-1 text-sm text-gray-500">
//                       Be the first to create an election on the platform.
//                     </p>
//                     <div className="mt-6">
//                       <Link
//                         to="/elections-2/create"
//                         className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                       >
//                         <PlusIcon className="h-4 w-4 mr-2" />
//                         Create Election
//                       </Link>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {recentElections.map((election) => (
//                       <div
//                         key={election.id}
//                         className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
//                       >
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between mb-2">
//                             <h4 className="text-sm font-medium text-gray-900 truncate">
//                               {election.title}
//                             </h4>
//                             {getStatusBadge(election)}
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500 space-x-4">
//                             <span>
//                               Created: {formatDate(election.created_at)}
//                             </span>
//                             <span>
//                               {election.total_votes || 0} votes
//                             </span>
//                             <span className={`px-2 py-1 rounded-full text-xs ${
//                               election.pricing_type === 'free' 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-blue-100 text-blue-800'
//                             }`}>
//                               {election.pricing_type === 'free' ? 'Free' : 'Paid'}
//                             </span>
//                             {election.is_lotterized && (
//                               <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
//                                 Lottery
//                               </span>
//                             )}
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center space-x-2 ml-4">
//                           {getElectionStatus(election) === 'active' && (
//                             <>
//                               {election.pricing_type === 'free' ? (
//                                 <Link
//                                   to={`/vote/${election.id}`}
//                                   className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
//                                 >
//                                   Vote Free
//                                 </Link>
//                               ) : (
//                                 <Link
//                                   to={`/payment/${election.id}`}
//                                   className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
//                                 >
//                                   Pay & Vote
//                                 </Link>
//                               )}
//                             </>
//                           )}
                          
//                           <Link
//                             to={`/elections/${election.id}`}
//                             className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Quick Actions */}
//             <div className="bg-white shadow rounded-lg">
//               <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Quick Actions
//                 </h3>
//               </div>
              
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="space-y-3">
//                   <button
//                     onClick={() => handleQuickAction('create')}
//                     className="w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                   >
//                     <PlusIcon className="h-4 w-4 mr-2" />
//                     Create New Election
//                   </button>
                  
//                   <button
//                     onClick={() => handleQuickAction('viewAll')}
//                     className="w-full inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     <EyeIcon className="h-4 w-4 mr-2" />
//                     Browse All Elections
//                   </button>
                  
//                   <button
//                     onClick={() => handleQuickAction('analytics')}
//                     className="w-full inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
//                     Platform Analytics
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Top Performing Elections */}
//             {topPerformingElections.length > 0 && (
//               <div className="bg-white shadow rounded-lg">
//                 <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//                   <h3 className="text-lg leading-6 font-medium text-gray-900">
//                     Top Performing
//                   </h3>
//                 </div>
                
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="space-y-4">
//                     {topPerformingElections.map((election, index) => (
//                       <div key={election.id} className="flex items-center space-x-3">
//                         <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
//                           index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
//                         }`}>
//                           {index + 1}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-gray-900 truncate">
//                             {election.title}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {election.total_votes} votes
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Platform Statistics */}
//             <div className="bg-white shadow rounded-lg">
//               <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Platform Statistics
//                 </h3>
//               </div>
              
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-500">Free Elections</span>
//                     <span className="text-sm font-medium text-green-600">{stats.freeElections}</span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-500">Paid Elections</span>
//                     <span className="text-sm font-medium text-blue-600">{stats.paidElections}</span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-500">Lottery Elections</span>
//                     <span className="text-sm font-medium text-purple-600">{stats.lotteryElections}</span>
//                   </div>
                  
//                   <div className="border-t border-gray-200 pt-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-gray-900">Total Revenue</span>
//                       <span className="text-sm font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</span>
//                     </div>
//                   </div>
                  
//                   {stats.totalElections > 0 && (
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-500">Avg. Votes per Election</span>
//                       <span className="text-sm font-medium text-gray-900">
//                         {Math.round(stats.totalVotes / stats.totalElections)}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Platform Info */}
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0">
//                   <ChartBarIcon className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-blue-900">
//                     Platform Features
//                   </h3>
//                   <div className="mt-2 text-sm text-blue-700">
//                     <ul className="space-y-1">
//                       <li>• Free and paid voting options</li>
//                       <li>• Regional pricing support</li>
//                       <li>• Lottery-enabled elections</li>
//                       <li>• Real-time vote counting</li>
//                       <li>• Multi-language support</li>
//                       <li>• Secure biometric authentication</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ElectionDashboard2;
// //last workable codes
// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router';
// // import { toast } from 'react-hot-toast';
// // import {
// //   PlusIcon,
// //   ChartBarIcon,
// //   UsersIcon,
// //   CalendarIcon,
// //   TrophyIcon,
// //   EyeIcon,
// //   DocumentDuplicateIcon,
// //   ArrowTrendingUpIcon
// // } from '@heroicons/react/24/outline';
// // //import { electionAPI } from '../../services/election-2/electionAPI';
// // import LoadingScreen from '../../components/LoadingScreen';
// // import eeelllectionService from '../../services/election/EeellllectionService';
// // //import ElectionService from '../../services/election/EeellllectionService';

// // const ElectionDashboard2 = () => {
// //   const navigate = useNavigate();
  
// //   const [loading, setLoading] = useState(true);
// //   const [stats, setStats] = useState({
// //     totalElections: 0,
// //     activeElections: 0,
// //     draftElections: 0,
// //     completedElections: 0,
// //     totalVotes: 0,
// //     totalParticipants: 0
// //   });
  
// //   const [recentElections, setRecentElections] = useState([]);
// //   //const [quickActions, setQuickActions] = useState([]);

// //   useEffect(() => {
// //     loadDashboardData();
// //   }, []);

// //   const loadDashboardData = async () => {
// //     try {
// //       setLoading(true);
      
// //       // Load user's elections with different statuses
// //       const [electionsResponse] = await Promise.all([
// //         eeelllectionService.getUserElections({ limit: 10 })
// //       ]);

// //       if (electionsResponse.success) {
// //         const elections = electionsResponse.data;
// //         setRecentElections(elections);
        
// //         // Calculate stats
// //         const statsData = {
// //           totalElections: elections.length,
// //           activeElections: elections.filter(e => e.status === 'active').length,
// //           draftElections: elections.filter(e => e.status === 'draft').length,
// //           completedElections: elections.filter(e => e.status === 'completed').length,
// //           totalVotes: elections.reduce((sum, e) => sum + (e.total_votes || 0), 0),
// //           totalParticipants: elections.reduce((sum, e) => sum + (e.participant_count || 0), 0)
// //         };
        
// //         setStats(statsData);
// //       }
      
// //     } catch (error) {
// //       console.error('Error loading dashboard data:', error);
// //       toast.error('Failed to load dashboard data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getStatusBadge = (status) => {
// //     const statusConfig = {
// //       draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
// //       active: { color: 'bg-green-100 text-green-800', text: 'Active' },
// //       completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' },
// //       cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
// //     };

// //     const config = statusConfig[status] || statusConfig.draft;
    
// //     return (
// //       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
// //         {config.text}
// //       </span>
// //     );
// //   };

// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric'
// //     });
// //   };

// //   const handleQuickAction = (action) => {
// //     switch (action) {
// //       case 'create':
// //         navigate('/elections-2/create');
// //         break;
// //       case 'viewAll':
// //         navigate('/elections-2');
// //         break;
// //       case 'analytics':
// //         navigate('/analytics');
// //         break;
// //       default:
// //         break;
// //     }
// //   };

// //   if (loading) {
// //     return <LoadingScreen />;
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-8">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-900">Election Dashboard</h1>
// //               <p className="mt-2 text-sm text-gray-600">
// //                 Manage your elections and track performance
// //               </p>
// //             </div>
            
// //             <div className="flex items-center space-x-3">
// //               <Link
// //                 to="/elections-2"
// //                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //               >
// //                 <EyeIcon className="h-4 w-4 mr-2" />
// //                 View All Elections
// //               </Link>
              
// //               <Link
// //                 to="/elections-2/create"
// //                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //               >
// //                 <PlusIcon className="h-4 w-4 mr-2" />
// //                 Create Election
// //               </Link>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //           <div className="bg-white overflow-hidden shadow rounded-lg">
// //             <div className="p-5">
// //               <div className="flex items-center">
// //                 <div className="flex-shrink-0">
// //                   <ChartBarIcon className="h-6 w-6 text-gray-400" />
// //                 </div>
// //                 <div className="ml-5 w-0 flex-1">
// //                   <dl>
// //                     <dt className="text-sm font-medium text-gray-500 truncate">
// //                       Total Elections
// //                     </dt>
// //                     <dd className="text-lg font-medium text-gray-900">
// //                       {stats.totalElections}
// //                     </dd>
// //                   </dl>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white overflow-hidden shadow rounded-lg">
// //             <div className="p-5">
// //               <div className="flex items-center">
// //                 <div className="flex-shrink-0">
// //                   <CalendarIcon className="h-6 w-6 text-green-400" />
// //                 </div>
// //                 <div className="ml-5 w-0 flex-1">
// //                   <dl>
// //                     <dt className="text-sm font-medium text-gray-500 truncate">
// //                       Active Elections
// //                     </dt>
// //                     <dd className="text-lg font-medium text-gray-900">
// //                       {stats.activeElections}
// //                     </dd>
// //                   </dl>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white overflow-hidden shadow rounded-lg">
// //             <div className="p-5">
// //               <div className="flex items-center">
// //                 <div className="flex-shrink-0">
// //                   <UsersIcon className="h-6 w-6 text-blue-400" />
// //                 </div>
// //                 <div className="ml-5 w-0 flex-1">
// //                   <dl>
// //                     <dt className="text-sm font-medium text-gray-500 truncate">
// //                       Total Votes
// //                     </dt>
// //                     <dd className="text-lg font-medium text-gray-900">
// //                       {stats.totalVotes.toLocaleString()}
// //                     </dd>
// //                   </dl>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white overflow-hidden shadow rounded-lg">
// //             <div className="p-5">
// //               <div className="flex items-center">
// //                 <div className="flex-shrink-0">
// //                   <TrophyIcon className="h-6 w-6 text-yellow-400" />
// //                 </div>
// //                 <div className="ml-5 w-0 flex-1">
// //                   <dl>
// //                     <dt className="text-sm font-medium text-gray-500 truncate">
// //                       Completed
// //                     </dt>
// //                     <dd className="text-lg font-medium text-gray-900">
// //                       {stats.completedElections}
// //                     </dd>
// //                   </dl>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Recent Elections */}
// //           <div className="lg:col-span-2">
// //             <div className="bg-white shadow rounded-lg">
// //               <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
// //                 <div className="flex items-center justify-between">
// //                   <h3 className="text-lg leading-6 font-medium text-gray-900">
// //                     Recent Elections
// //                   </h3>
// //                   <Link
// //                     to="/elections-2"
// //                     className="text-sm text-blue-600 hover:text-blue-500"
// //                   >
// //                     View all
// //                   </Link>
// //                 </div>
// //               </div>
              
// //               <div className="px-4 py-5 sm:p-6">
// //                 {recentElections.length === 0 ? (
// //                   <div className="text-center py-12">
// //                     <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
// //                     <h3 className="mt-2 text-sm font-medium text-gray-900">No elections yet</h3>
// //                     <p className="mt-1 text-sm text-gray-500">
// //                       Get started by creating your first election.
// //                     </p>
// //                     <div className="mt-6">
// //                       <Link
// //                         to="/elections-2/create"
// //                         className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
// //                       >
// //                         <PlusIcon className="h-4 w-4 mr-2" />
// //                         Create Election
// //                       </Link>
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <div className="space-y-4">
// //                     {recentElections.slice(0, 5).map((election) => (
// //                       <div
// //                         key={election.id}
// //                         className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
// //                       >
// //                         <div className="flex-1">
// //                           <div className="flex items-center justify-between">
// //                             <h4 className="text-sm font-medium text-gray-900 truncate">
// //                               {election.title}
// //                             </h4>
// //                             {getStatusBadge(election.status)}
// //                           </div>
// //                           <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
// //                             <span>
// //                               Created: {formatDate(election.created_at)}
// //                             </span>
// //                             {election.total_votes > 0 && (
// //                               <span>
// //                                 {election.total_votes} votes
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
                        
// //                         <div className="flex items-center space-x-2 ml-4">
// //                           <Link
// //                             to={`/elections-2/${election.id}/edit`}
// //                             className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
// //                           >
// //                             Edit
// //                           </Link>
                          
// //                           {election.status === 'active' && (
// //                             <Link
// //                               to={`/vote/${election.id}`}
// //                               className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
// //                             >
// //                               Vote
// //                             </Link>
// //                           )}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Quick Actions & Analytics */}
// //           <div className="space-y-6">
// //             {/* Quick Actions */}
// //             <div className="bg-white shadow rounded-lg">
// //               <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
// //                 <h3 className="text-lg leading-6 font-medium text-gray-900">
// //                   Quick Actions
// //                 </h3>
// //               </div>
              
// //               <div className="px-4 py-5 sm:p-6">
// //                 <div className="space-y-3">
// //                   <button
// //                     onClick={() => handleQuickAction('create')}
// //                     className="w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
// //                   >
// //                     <PlusIcon className="h-4 w-4 mr-2" />
// //                     Create New Election
// //                   </button>
                  
// //                   <button
// //                     onClick={() => handleQuickAction('viewAll')}
// //                     className="w-full inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
// //                   >
// //                     <EyeIcon className="h-4 w-4 mr-2" />
// //                     View All Elections
// //                   </button>
                  
// //                   <button
// //                     onClick={() => handleQuickAction('analytics')}
// //                     className="w-full inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
// //                   >
// //                     <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
// //                     View Analytics
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Performance Summary */}
// //             <div className="bg-white shadow rounded-lg">
// //               <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
// //                 <h3 className="text-lg leading-6 font-medium text-gray-900">
// //                   Performance Summary
// //                 </h3>
// //               </div>
              
// //               <div className="px-4 py-5 sm:p-6">
// //                 <div className="space-y-4">
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-sm text-gray-500">Draft Elections</span>
// //                     <span className="text-sm font-medium text-gray-900">{stats.draftElections}</span>
// //                   </div>
                  
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-sm text-gray-500">Active Elections</span>
// //                     <span className="text-sm font-medium text-green-600">{stats.activeElections}</span>
// //                   </div>
                  
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-sm text-gray-500">Completed Elections</span>
// //                     <span className="text-sm font-medium text-blue-600">{stats.completedElections}</span>
// //                   </div>
                  
// //                   <div className="border-t border-gray-200 pt-4">
// //                     <div className="flex justify-between items-center">
// //                       <span className="text-sm font-medium text-gray-900">Total Votes</span>
// //                       <span className="text-sm font-bold text-gray-900">{stats.totalVotes.toLocaleString()}</span>
// //                     </div>
// //                   </div>
                  
// //                   {stats.totalElections > 0 && (
// //                     <div className="flex justify-between items-center">
// //                       <span className="text-sm text-gray-500">Avg. Votes per Election</span>
// //                       <span className="text-sm font-medium text-gray-900">
// //                         {Math.round(stats.totalVotes / stats.totalElections)}
// //                       </span>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Tips & Getting Started */}
// //             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
// //               <div className="flex items-start">
// //                 <div className="flex-shrink-0">
// //                   <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                   </svg>
// //                 </div>
// //                 <div className="ml-3">
// //                   <h3 className="text-sm font-medium text-blue-900">
// //                     Getting Started Tips
// //                   </h3>
// //                   <div className="mt-2 text-sm text-blue-700">
// //                     <ul className="space-y-1">
// //                       <li>• Set clear election titles and descriptions</li>
// //                       <li>• Choose appropriate voting duration</li>
// //                       <li>• Configure access controls for your audience</li>
// //                       <li>• Test your election before publishing</li>
// //                       <li>• Monitor results in real-time</li>
// //                     </ul>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ElectionDashboard2;

import React from 'react'

const ElectionDashboard2 = () => {
  return (
    <div>
      <h1>Here all election list will come</h1>
    </div>
  )
}

export default ElectionDashboard2
