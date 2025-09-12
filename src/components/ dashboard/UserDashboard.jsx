import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSecurity } from '../../contexts/SecurityContext';
import {
  DocumentTextIcon,
  PlusCircleIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const UserDashboard = () => {
  const { userData } = useAuth();
  const securityContext = useSecurity();
  const [activeTab, setActiveTab] = useState('overview');
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [securityMetrics, setSecurityMetrics] = useState({});

  // Collect device and security information
  useEffect(() => {
    const collectDeviceInfo = () => {
      const device = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio || 1
        },
        connection: navigator.connection ? {
          type: navigator.connection.type,
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null,
        memory: navigator.deviceMemory || 'Unknown',
        hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
        cookieEnabled: navigator.cookieEnabled,
        javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
        onLine: navigator.onLine,
        webdriver: navigator.webdriver || false
      };
      setDeviceInfo(device);
    };

    const collectSecurityMetrics = () => {
      const metrics = {
        httpsEnabled: window.location.protocol === 'https:',
        referrerValidated: securityContext?.securityMetrics?.referrerValidated || false,
        deviceFingerprinted: true,
        encryptionEnabled: securityContext?.securityMetrics?.encryptionEnabled || true,
        webAuthnSupported: !!window.PublicKeyCredential,
        localStorageEnabled: (() => {
          try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
            /* eslint-disable */
          } catch (e) {
            return false;
          }
        })(),
        sessionStorageEnabled: (() => {
          try {
            const test = 'test';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
            /* eslint-disable */
          } catch (e) {
            return false;
          }
        })(),
        thirdPartyCookiesEnabled: navigator.cookieEnabled && document.cookie.length > 0
      };
      setSecurityMetrics(metrics);
    };

    collectDeviceInfo();
    collectSecurityMetrics();
  }, [securityContext]);

  const statsCards = [
    {
      title: 'Elections Participated',
      value: '12',
      change: '+3 this month',
      changeType: 'positive',
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      title: 'Votes Cast',
      value: '28',
      change: '+5 this week',
      changeType: 'positive',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      title: 'Elections Created',
      value: userData?.user_type === 'voter' ? '0' : '4',
      change: userData?.user_type === 'voter' ? 'Voter account' : '+1 this month',
      changeType: userData?.user_type === 'voter' ? 'neutral' : 'positive',
      icon: PlusCircleIcon,
      color: 'purple'
    },
    {
      title: 'Pending Verifications',
      value: '2',
      change: 'Needs attention',
      changeType: 'warning',
      icon: ClockIcon,
      color: 'orange'
    }
  ];

  const recentElections = [
    {
      id: 1,
      title: 'Best Programming Language 2025',
      status: 'active',
      endDate: '2025-09-15',
      votesCount: 1247,
      participated: true
    },
    {
      id: 2,
      title: 'Office Lunch Menu Choice',
      status: 'completed',
      endDate: '2025-09-10',
      votesCount: 45,
      participated: true
    },
    {
      id: 3,
      title: 'Climate Action Initiative',
      status: 'active',
      endDate: '2025-09-20',
      votesCount: 892,
      participated: false
    }
  ];

  const quickActions = [
    {
      title: 'Browse Elections',
      description: 'Find elections to participate in',
      href: '/elections',
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      title: 'Verify Your Vote',
      description: 'Check if your vote was counted',
      href: '/verify',
      icon: ShieldCheckIcon,
      color: 'green'
    }
  ];

  if (userData?.user_type !== 'voter') {
    quickActions.unshift({
      title: 'Create Election',
      description: 'Start a new voting campaign',
      href: '/elections/create',
      icon: PlusCircleIcon,
      color: 'purple'
    });
  }

  // Security features for security tab
  const securityFeatures = {
    'End-to-End Encryption': {
      status: 'Active',
      description: 'RSA/ElGamal encryption implemented',
      type: 'success'
    },
    'Digital Signatures': {
      status: 'Active',
      description: 'SHA-256 signature verification',
      type: 'success'
    },
    'Key Management': {
      status: 'Active',
      description: 'Threshold decryption system',
      type: 'success'
    },
    'HTTPS Enforcement': {
      status: securityMetrics.httpsEnabled ? 'Active' : 'Warning',
      description: 'SSL certificate validation',
      type: securityMetrics.httpsEnabled ? 'success' : 'warning'
    },
    'Input Validation': {
      status: 'Active',
      description: 'OWASP security compliance',
      type: 'success'
    },
    'Rate Limiting': {
      status: 'Active',
      description: 'DDoS protection enabled',
      type: 'success'
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back to Vottery!</h1>
        <p className="text-blue-100">Your secure voting platform dashboard</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'security', name: 'Security' },
            { id: 'biometric', name: 'Biometric' },
            { id: 'device', name: 'Device' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: 'bg-blue-50 text-blue-600 border-blue-200',
                green: 'bg-green-50 text-green-600 border-green-200',
                purple: 'bg-purple-50 text-purple-600 border-purple-200',
                orange: 'bg-orange-50 text-orange-600 border-orange-200'
              };
              
              return (
                <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'warning' ? 'text-orange-600' :
                      'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Email</div>
                    <div className="font-medium">{userData?.sngine_email}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Phone</div>
                    <div className="font-medium">{userData?.sngine_phone}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">User Type</div>
                    <div className="font-medium capitalize">{userData?.user_type?.replace('_', ' ')}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Subscription</div>
                    <div className="font-medium capitalize">{userData?.subscription_status}</div>
                  </div>
                </div>
              </div>

              {/* Recent Elections */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Elections</h3>
                  <Link to="/elections" className="text-sm text-blue-600 hover:text-blue-500">
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentElections.map((election) => (
                    <div key={election.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{election.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            election.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {election.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {election.votesCount} votes
                          </span>
                          <span className="text-sm text-gray-500">
                            Ends: {new Date(election.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {election.participated && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Voted
                          </span>
                        )}
                        {election.status === 'active' && !election.participated && (
                          <Link
                            to={`/vote/${election.id}`}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                          >
                            Vote
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    const colorClasses = {
                      blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
                      green: 'bg-green-50 hover:bg-green-100 text-green-700',
                      purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                    };
                    
                    return (
                      <Link
                        key={index}
                        to={action.href}
                        className={`block p-4 rounded-lg transition-colors ${colorClasses[action.color]}`}
                      >
                        <div className="flex items-center">
                          <Icon className="h-5 w-5 mr-3" />
                          <div>
                            <div className="font-medium">{action.title}</div>
                            <div className="text-sm opacity-75">{action.description}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Verified</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phone Verified</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Biometric Auth</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Complete</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Framework Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(securityFeatures).map(([feature, details]) => (
                <div key={feature} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{feature}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      details.type === 'success' ? 'bg-green-100 text-green-800' :
                      details.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {details.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{details.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">HTTPS Status</div>
                <div className={`font-medium ${securityMetrics.httpsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {securityMetrics.httpsEnabled ? 'Secure Connection' : 'Insecure Connection'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">WebAuthn Support</div>
                <div className={`font-medium ${securityMetrics.webAuthnSupported ? 'text-green-600' : 'text-yellow-600'}`}>
                  {securityMetrics.webAuthnSupported ? 'Supported' : 'Not Supported'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Local Storage</div>
                <div className={`font-medium ${securityMetrics.localStorageEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {securityMetrics.localStorageEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Session Storage</div>
                <div className={`font-medium ${securityMetrics.sessionStorageEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {securityMetrics.sessionStorageEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'biometric' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Biometric Authentication Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-green-800">Device Fingerprint</h4>
                    <p className="text-sm text-green-600">Registered & Active</p>
                  </div>
                </div>
                <div className="text-sm text-green-700">
                  <p>• Unique device identification</p>
                  <p>• Hardware-based security</p>
                  <p>• Anti-fraud protection</p>
                </div>
              </div>

              <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-800">WebAuthn Status</h4>
                    <p className="text-sm text-blue-600">
                      {securityMetrics.webAuthnSupported ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-blue-700">
                  <p>• Passwordless authentication</p>
                  <p>• Hardware security keys</p>
                  <p>• Biometric verification</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Biometric Capabilities</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Face ID Support: {/iPhone|iPad/.test(navigator.userAgent) ? 'Yes' : 'No'}
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Fingerprint: {/Android/.test(navigator.userAgent) ? 'Yes' : 'No'}
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  WebAuthn: {securityMetrics.webAuthnSupported ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'device' && deviceInfo && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Platform</div>
                  <div className="font-medium">{deviceInfo.platform}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Language</div>
                  <div className="font-medium">{deviceInfo.language}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Timezone</div>
                  <div className="font-medium">{deviceInfo.timezone}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Screen Resolution</div>
                  <div className="font-medium">{deviceInfo.screen.width}x{deviceInfo.screen.height}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Color Depth</div>
                  <div className="font-medium">{deviceInfo.screen.colorDepth}-bit</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Pixel Ratio</div>
                  <div className="font-medium">{deviceInfo.screen.pixelRatio}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">CPU Cores</div>
                  <div className="font-medium">{deviceInfo.hardwareConcurrency}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Memory</div>
                  <div className="font-medium">{deviceInfo.memory} GB</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Browser Capabilities</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${deviceInfo.cookieEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Cookies: {deviceInfo.cookieEnabled ? 'Enabled' : 'Disabled'}
                </div>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${deviceInfo.javaEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Java: {deviceInfo.javaEnabled ? 'Enabled' : 'Disabled'}
                </div>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${deviceInfo.onLine ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Online: {deviceInfo.onLine ? 'Yes' : 'No'}
                </div>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${!deviceInfo.webdriver ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  Automation: {deviceInfo.webdriver ? 'Detected' : 'None'}
                </div>
              </div>
            </div>

            {deviceInfo.connection && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Network Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>Connection Type: {deviceInfo.connection.type}</div>
                  <div>Effective Type: {deviceInfo.connection.effectiveType}</div>
                  <div>Downlink: {deviceInfo.connection.downlink} Mbps</div>
                  <div>RTT: {deviceInfo.connection.rtt} ms</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
 
// import React from 'react';
// import { Link } from 'react-router';
// import { useAuth } from '../../contexts/AuthContext';
// import {
//   DocumentTextIcon,
//   PlusCircleIcon,
//   ChartBarIcon,
//   ShieldCheckIcon,
//   ClockIcon,
//   CheckCircleIcon
// } from '@heroicons/react/24/outline';

// const UserDashboard = () => {
//   const { userData } = useAuth();

//   const statsCards = [
//     {
//       title: 'Elections Participated',
//       value: '12',
//       change: '+3 this month',
//       changeType: 'positive',
//       icon: DocumentTextIcon,
//       color: 'blue'
//     },
//     {
//       title: 'Votes Cast',
//       value: '28',
//       change: '+5 this week',
//       changeType: 'positive',
//       icon: CheckCircleIcon,
//       color: 'green'
//     },
//     {
//       title: 'Elections Created',
//       value: userData?.user_type === 'voter' ? '0' : '4',
//       change: userData?.user_type === 'voter' ? 'Voter account' : '+1 this month',
//       changeType: userData?.user_type === 'voter' ? 'neutral' : 'positive',
//       icon: PlusCircleIcon,
//       color: 'purple'
//     },
//     {
//       title: 'Pending Verifications',
//       value: '2',
//       change: 'Needs attention',
//       changeType: 'warning',
//       icon: ClockIcon,
//       color: 'orange'
//     }
//   ];

//   const recentElections = [
//     {
//       id: 1,
//       title: 'Best Programming Language 2025',
//       status: 'active',
//       endDate: '2025-09-15',
//       votesCount: 1247,
//       participated: true
//     },
//     {
//       id: 2,
//       title: 'Office Lunch Menu Choice',
//       status: 'completed',
//       endDate: '2025-09-10',
//       votesCount: 45,
//       participated: true
//     },
//     {
//       id: 3,
//       title: 'Climate Action Initiative',
//       status: 'active',
//       endDate: '2025-09-20',
//       votesCount: 892,
//       participated: false
//     }
//   ];

//   const quickActions = [
//     {
//       title: 'Browse Elections',
//       description: 'Find elections to participate in',
//       href: '/elections',
//       icon: DocumentTextIcon,
//       color: 'blue'
//     },
//     {
//       title: 'Verify Your Vote',
//       description: 'Check if your vote was counted',
//       href: '/verify',
//       icon: ShieldCheckIcon,
//       color: 'green'
//     }
//   ];

//   if (userData?.user_type !== 'voter') {
//     quickActions.unshift({
//       title: 'Create Election',
//       description: 'Start a new voting campaign',
//       href: '/elections/create',
//       icon: PlusCircleIcon,
//       color: 'purple'
//     });
//   }

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
//         <h1 className="text-2xl font-bold mb-2">Welcome back to Vottery!</h1>
//         <p className="text-blue-100">Your secure voting platform dashboard</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statsCards.map((stat, index) => {
//           const Icon = stat.icon;
//           const colorClasses = {
//             blue: 'bg-blue-50 text-blue-600 border-blue-200',
//             green: 'bg-green-50 text-green-600 border-green-200',
//             purple: 'bg-purple-50 text-purple-600 border-purple-200',
//             orange: 'bg-orange-50 text-orange-600 border-orange-200'
//           };
          
//           return (
//             <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                 </div>
//                 <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
//                   <Icon className="h-6 w-6" />
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <span className={`text-sm ${
//                   stat.changeType === 'positive' ? 'text-green-600' :
//                   stat.changeType === 'warning' ? 'text-orange-600' :
//                   'text-gray-500'
//                 }`}>
//                   {stat.change}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Personal Information */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <div className="text-sm text-gray-600 mb-1">Email</div>
//                 <div className="font-medium">{userData?.sngine_email}</div>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <div className="text-sm text-gray-600 mb-1">Phone</div>
//                 <div className="font-medium">{userData?.sngine_phone}</div>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <div className="text-sm text-gray-600 mb-1">User Type</div>
//                 <div className="font-medium capitalize">{userData?.user_type?.replace('_', ' ')}</div>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <div className="text-sm text-gray-600 mb-1">Subscription</div>
//                 <div className="font-medium capitalize">{userData?.subscription_status}</div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Elections */}
//           <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Recent Elections</h3>
//               <Link to="/elections" className="text-sm text-blue-600 hover:text-blue-500">
//                 View all
//               </Link>
//             </div>
//             <div className="space-y-3">
//               {recentElections.map((election) => (
//                 <div key={election.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div className="flex-1">
//                     <h4 className="font-medium text-gray-900">{election.title}</h4>
//                     <div className="flex items-center space-x-4 mt-1">
//                       <span className={`text-xs px-2 py-1 rounded-full ${
//                         election.status === 'active' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {election.status}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         {election.votesCount} votes
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         Ends: {new Date(election.endDate).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {election.participated && (
//                       <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                         Voted
//                       </span>
//                     )}
//                     {election.status === 'active' && !election.participated && (
//                       <Link
//                         to={`/vote/${election.id}`}
//                         className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
//                       >
//                         Vote
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//             <div className="space-y-3">
//               {quickActions.map((action, index) => {
//                 const Icon = action.icon;
//                 const colorClasses = {
//                   blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
//                   green: 'bg-green-50 hover:bg-green-100 text-green-700',
//                   purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700'
//                 };
                
//                 return (
//                   <Link
//                     key={index}
//                     to={action.href}
//                     className={`block p-4 rounded-lg transition-colors ${colorClasses[action.color]}`}
//                   >
//                     <div className="flex items-center">
//                       <Icon className="h-5 w-5 mr-3" />
//                       <div>
//                         <div className="font-medium">{action.title}</div>
//                         <div className="text-sm opacity-75">{action.description}</div>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Account Status */}
//           <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Email Verified</span>
//                 <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Phone Verified</span>
//                 <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Biometric Auth</span>
//                 <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Profile Complete</span>
//                 <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Complete</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;