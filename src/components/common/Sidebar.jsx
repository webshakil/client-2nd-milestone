import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';
import {
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UsersIcon,
  Cog6ToothIcon,
  EyeIcon,
  ClipboardDocumentCheckIcon,
  PresentationChartLineIcon,
  MegaphoneIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { hasPermission, isAdmin, getUserRole } = useAuth();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Navigation items based on role and permissions
  const getNavigationItems = () => {
    const role = getUserRole().toLowerCase();
    const userIsAdmin = isAdmin();
    
    const baseNavigation = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
        show: true
      },
      {
        name: 'Elections',
        href: '/elections-2',
        icon: DocumentTextIcon,
        show: true
      }
    ];

    const roleSpecificNavigation = [];

    // Election Creation - For creators and admins
    if (hasPermission('manage_elections') || hasPermission('manage_content')) {
      roleSpecificNavigation.push({
        name: 'Create Election',
        href: '/elections/create',
        icon: PlusCircleIcon,
        show: true
      });
    }

    // Analytics - For analysts and admins
    if (hasPermission('view_analytics')) {
      roleSpecificNavigation.push({
        name: 'Analytics',
        href: '/analytics',
        icon: ChartBarIcon,
        show: true
      });
    }

    // Verification - For all users
    roleSpecificNavigation.push({
      name: 'Verify Votes',
      href: '/verify',
      icon: ShieldCheckIcon,
      show: true
    });
      roleSpecificNavigation.push({
      name: 'List of All Election',
      href: '/elections-2',
      icon: ShieldCheckIcon,
      show: true
    });
       // {
      //   name: 'Elections',
      //   href: '/elections',
      //   icon: DocumentTextIcon,
      //   show: true
      // }

    // Audit - For auditors and admins
    if (hasPermission('view_audit')) {
      roleSpecificNavigation.push({
        name: 'Audit Trail',
        href: '/audit',
        icon: EyeIcon,
        show: true
      });
    }

    // User Management - Admin only
    if (userIsAdmin) {
      roleSpecificNavigation.push({
        name: 'User Management',
        href: '/admin/users',
        icon: UsersIcon,
        show: true
      });
    }

    // Role-specific sections
    const roleSpecific = [];
    
    switch (role) {
      case 'moderator':
        roleSpecific.push({
          name: 'Content Moderation',
          href: '/moderation',
          icon: ClipboardDocumentCheckIcon,
          show: hasPermission('manage_content')
        });
        break;
        
      case 'editor':
        roleSpecific.push({
          name: 'Content Editor',
          href: '/editor',
          icon: PencilSquareIcon,
          show: hasPermission('manage_content')
        });
        break;
        
      case 'advertiser':
        roleSpecific.push({
          name: 'Campaigns',
          href: '/campaigns',
          icon: MegaphoneIcon,
          show: hasPermission('manage_ads')
        });
        break;
        
      case 'analyst':
        roleSpecific.push({
          name: 'Reports',
          href: '/reports',
          icon: PresentationChartLineIcon,
          show: hasPermission('view_analytics')
        });
        break;
    }

    return [...baseNavigation, ...roleSpecificNavigation, ...roleSpecific].filter(item => item.show);
  };

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Vottery</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {getNavigationItems().map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Quick Actions
          </h3>
          
          {hasPermission('manage_elections') && (
            <Link
              to="/elections/create"
              onClick={() => onClose()}
              className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              New Election
            </Link>
          )}
          
          <Link
            to="/verify"
            onClick={() => onClose()}
            className="flex items-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg"
          >
            <ShieldCheckIcon className="mr-2 h-4 w-4" />
            Verify Vote
          </Link>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {getUserRole().charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {getUserRole()}
            </p>
            <p className="text-xs text-gray-500">
              {isAdmin() ? 'Administrator' : 'User'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
                  <NavigationContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200">
          <NavigationContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;