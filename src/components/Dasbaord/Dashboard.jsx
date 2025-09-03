import React, { useState, useEffect } from 'react';
import ComingSoon from './ComingSoon';
import DashboardHeader from './DashboardHeader';
import NavigationTabs from './NavigationTabs';
import RoleBasedPermissions from './RoleBasedPermissions';
import { useSecurity } from '../../contexts/SecurityContext';
import AdminDashboard from './Dashboards/AdminDashboard';
import ModeratorDashboard from './Dashboards/ModeratorDashboard';
import AuditorDashboard from './Dashboards/AuditorDashboard';
import UserDashboard from './Dashboards/UserDashboard';
import { useAuth } from '../../contexts/AuthContext';
import SecurityTab from './Tabs/SecurityTab';
import BiometricTab from './Tabs/BiometricTab';
import DeviceTab from './Tabs/DeviceTab';

const Dashboard = () => {
  const { userData, logout, isAdmin, getUserRole, hasPermission, rolePermissions, updateUserRoleAndType } = useAuth();
  const securityContext = useSecurity();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [securityMetrics, setSecurityMetrics] = useState({});
  
  // User Management State
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedAdminRole, setSelectedAdminRole] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Get current user role and permissions
  const currentUserRole = getUserRole();
  const isUserAdmin = isAdmin();
  const canViewAnalytics = hasPermission('view_analytics');
  const canManageUsers = hasPermission('manage_users');
  const canManageElections = hasPermission('manage_elections');
  const canManageContent = hasPermission('manage_content');
  const canViewAudit = hasPermission('view_audit');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleLogout = () => {
    logout();
  };

  // Handle user role update
  const handleUpdateUserRole = async () => {
    if (!selectedUserId || !selectedAdminRole || !selectedUserType || !selectedSubscription) {
      alert('Please fill all fields');
      return;
    }

    try {
      setIsUpdatingRole(true);
      await updateUserRoleAndType(
        selectedUserId,
        selectedAdminRole,
        selectedUserType,
        selectedSubscription
      );
      
      // Reset form
      setSelectedUserId('');
      setSelectedAdminRole('');
      setSelectedUserType('');
      setSelectedSubscription('');
      
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Security features demo
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

  // Role-based dashboard selector
  const getDashboardContent = () => {
    const role = currentUserRole.toLowerCase();
    
    switch (role) {
      case 'manager':
      case 'admin':
        return (
          <AdminDashboard 
            canManageUsers={canManageUsers}
            canViewAudit={canViewAudit}
            canViewAnalytics={canViewAnalytics}
            hasPermission={hasPermission}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            selectedAdminRole={selectedAdminRole}
            setSelectedAdminRole={setSelectedAdminRole}
            selectedUserType={selectedUserType}
            setSelectedUserType={setSelectedUserType}
            selectedSubscription={selectedSubscription}
            setSelectedSubscription={setSelectedSubscription}
            isUpdatingRole={isUpdatingRole}
            handleUpdateUserRole={handleUpdateUserRole}
          />
        );
      case 'moderator':
        return (
          <ModeratorDashboard
            canManageContent={canManageContent}
            canManageElections={canManageElections}
          />
        );
      case 'auditor':
        return (
          <AuditorDashboard
            canViewAudit={canViewAudit}
            hasPermission={hasPermission}
          />
        );
      case 'analyst':
        return <AnalystDashboard />;
      case 'editor':
      case 'advertiser':
        return (
          <ModeratorDashboard 
            canManageContent={canManageContent}
            canManageElections={canManageElections}
          />
        );
      default:
        return <UserDashboard userData={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        currentTime={currentTime}
        userData={userData}
        currentUserRole={currentUserRole}
        isUserAdmin={isUserAdmin}
        handleLogout={handleLogout}
      />

      <NavigationTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && getDashboardContent()}

        {activeTab === 'security' && (
          <SecurityTab
            securityFeatures={securityFeatures}
            securityMetrics={securityMetrics}
          />
        )}

        {activeTab === 'biometric' && (
          <BiometricTab securityMetrics={securityMetrics} />
        )}

        {activeTab === 'device' && deviceInfo && (
          <DeviceTab deviceInfo={deviceInfo} />
        )}

        {/* Role-based permissions display */}
        {activeTab === 'overview' && (
          <RoleBasedPermissions 
            currentUserRole={currentUserRole}
            isUserAdmin={isUserAdmin}
            rolePermissions={rolePermissions}
          />
        )}

        {/* Coming Soon Features */}
        <ComingSoon/>
      </main>
    </div>
  );
};

export default Dashboard;