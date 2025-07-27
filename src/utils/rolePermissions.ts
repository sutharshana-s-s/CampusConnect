import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Profile['role'];

  // Define all possible routes in the application
  export const ROUTES = {
    // Student routes
    DASHBOARD: '/dashboard',
    MARKETPLACE: '/marketplace',
    CLUBS: '/clubs',
    CANTEEN: '/canteen',
    ORDER_TRACKING: '/order-tracking',
    HOSTEL: '/hostel',
    MESSAGES: '/messages',
    SETTINGS: '/settings',
  
  // Admin routes
  CLUB_MANAGEMENT: '/club-management',
  HOSTEL_COMPLAINTS: '/hostel-complaints',
  CANTEEN_ORDERS: '/canteen-orders',
  CANTEEN_MANAGEMENT: '/canteen-management',
  USER_MANAGEMENT: '/user-management',
  SYSTEM_SETTINGS: '/system-settings',
} as const;

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, {
  canAccess: (typeof ROUTES)[keyof typeof ROUTES][];
  canManage: string[];
  canView: string[];
  canEdit: string[];
  canDelete: string[];
  canCreate: string[];
}> = {
  student: {
    canAccess: [
      ROUTES.DASHBOARD,
      ROUTES.MARKETPLACE,
      ROUTES.CLUBS,
      ROUTES.CANTEEN,
      ROUTES.HOSTEL,
      ROUTES.MESSAGES,
      ROUTES.SETTINGS,
    ],
    canManage: [],
    canView: ['own_profile', 'marketplace_items', 'clubs', 'canteen_items', 'own_orders', 'own_complaints'],
    canEdit: ['own_profile', 'own_orders'],
    canDelete: ['own_marketplace_items'],
    canCreate: ['marketplace_items', 'orders', 'complaints', 'club_applications'],
  },

  club_head: {
    canAccess: [
      ROUTES.DASHBOARD,
      ROUTES.CLUBS,
      ROUTES.CLUB_MANAGEMENT,
      ROUTES.MESSAGES,
      ROUTES.SETTINGS,
    ],
    canManage: ['own_club', 'club_members', 'club_events'],
    canView: ['own_club', 'club_members', 'club_applications', 'own_profile'],
    canEdit: ['own_club', 'club_members', 'own_profile'],
    canDelete: ['club_members'],
    canCreate: ['club_events', 'club_announcements'],
  },

  canteen_vendor: {
    canAccess: [
      ROUTES.DASHBOARD,
      ROUTES.CANTEEN,
      ROUTES.CANTEEN_ORDERS,
      ROUTES.CANTEEN_MANAGEMENT,
      ROUTES.MESSAGES,
      ROUTES.SETTINGS,
    ],
    canManage: ['canteen_orders', 'canteen_items', 'order_status'],
    canView: ['canteen_orders', 'canteen_items', 'customer_details', 'own_profile'],
    canEdit: ['canteen_items', 'order_status', 'own_profile'],
    canDelete: ['canteen_items'],
    canCreate: ['canteen_items', 'order_notifications'],
  },

  hostel_admin: {
    canAccess: [
      ROUTES.DASHBOARD,
      ROUTES.HOSTEL,
      ROUTES.HOSTEL_COMPLAINTS,
      ROUTES.MESSAGES,
      ROUTES.SETTINGS,
    ],
    canManage: ['hostel_complaints', 'hostel_rooms', 'student_assignments'],
    canView: ['all_complaints', 'hostel_rooms', 'student_details', 'own_profile'],
    canEdit: ['complaint_status', 'room_assignments', 'own_profile'],
    canDelete: ['resolved_complaints'],
    canCreate: ['room_assignments', 'maintenance_schedules'],
  },

  super_admin: {
    canAccess: [
      ROUTES.DASHBOARD,
      ROUTES.CLUBS,
      ROUTES.CLUB_MANAGEMENT,
      ROUTES.CANTEEN,
      ROUTES.CANTEEN_ORDERS,
      ROUTES.CANTEEN_MANAGEMENT,
      ROUTES.HOSTEL,
      ROUTES.HOSTEL_COMPLAINTS,
      ROUTES.MARKETPLACE,
      ROUTES.MESSAGES,
      ROUTES.USER_MANAGEMENT,
      ROUTES.SYSTEM_SETTINGS,
      ROUTES.SETTINGS,
    ],
    canManage: ['all_systems', 'users', 'roles', 'permissions'],
    canView: ['all_data', 'system_logs', 'user_activity'],
    canEdit: ['all_data', 'user_roles', 'system_settings'],
    canDelete: ['all_data', 'users'],
    canCreate: ['users', 'roles', 'system_configurations'],
  },
};

// Helper functions for role-based access control
export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole];
  return (
    permissions.canManage.includes(permission) ||
    permissions.canView.includes(permission) ||
    permissions.canEdit.includes(permission) ||
    permissions.canDelete.includes(permission) ||
    permissions.canCreate.includes(permission)
  );
};

export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  return ROLE_PERMISSIONS[userRole].canAccess.includes(route as any);
};

export const canManage = (userRole: UserRole, resource: string): boolean => {
  return ROLE_PERMISSIONS[userRole].canManage.includes(resource);
};

export const canView = (userRole: UserRole, resource: string): boolean => {
  return ROLE_PERMISSIONS[userRole].canView.includes(resource);
};

export const canEdit = (userRole: UserRole, resource: string): boolean => {
  return ROLE_PERMISSIONS[userRole].canEdit.includes(resource);
};

export const canDelete = (userRole: UserRole, resource: string): boolean => {
  return ROLE_PERMISSIONS[userRole].canDelete.includes(resource);
};

export const canCreate = (userRole: UserRole, resource: string): boolean => {
  return ROLE_PERMISSIONS[userRole].canCreate.includes(resource);
};

// Get navigation items based on user role
export const getNavigationItems = (userRole: UserRole) => {
  const baseItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
    { name: 'Messages', path: ROUTES.MESSAGES, icon: 'MessageSquare' },
    { name: 'Settings', path: ROUTES.SETTINGS, icon: 'Settings' },
  ];

  const roleSpecificItems = {
    student: [
      { name: 'Marketplace', path: ROUTES.MARKETPLACE, icon: 'ShoppingBag' },
      { name: 'Clubs', path: ROUTES.CLUBS, icon: 'Users' },
      { name: 'Canteen', path: ROUTES.CANTEEN, icon: 'Utensils' },
      { name: 'My Orders', path: ROUTES.ORDER_TRACKING, icon: 'Package' },
      { name: 'Hostel', path: ROUTES.HOSTEL, icon: 'Home' },
    ],
    club_head: [
      { name: 'Clubs', path: ROUTES.CLUBS, icon: 'Users' },
      { name: 'Club Management', path: ROUTES.CLUB_MANAGEMENT, icon: 'Settings' },
    ],
    canteen_vendor: [
      { name: 'Canteen', path: ROUTES.CANTEEN, icon: 'Utensils' },
      { name: 'Canteen Orders', path: ROUTES.CANTEEN_ORDERS, icon: 'ShoppingCart' },
      { name: 'Canteen Management', path: ROUTES.CANTEEN_MANAGEMENT, icon: 'Settings' },
    ],
    hostel_admin: [
      { name: 'Hostel', path: ROUTES.HOSTEL, icon: 'Home' },
      { name: 'Hostel Complaints', path: ROUTES.HOSTEL_COMPLAINTS, icon: 'AlertTriangle' },
    ],
    super_admin: [
      { name: 'Marketplace', path: ROUTES.MARKETPLACE, icon: 'ShoppingBag' },
      { name: 'Clubs', path: ROUTES.CLUBS, icon: 'Users' },
      { name: 'Club Management', path: ROUTES.CLUB_MANAGEMENT, icon: 'Settings' },
      { name: 'Canteen', path: ROUTES.CANTEEN, icon: 'Utensils' },
      { name: 'Canteen Orders', path: ROUTES.CANTEEN_ORDERS, icon: 'ShoppingCart' },
      { name: 'Canteen Management', path: ROUTES.CANTEEN_MANAGEMENT, icon: 'Settings' },
      { name: 'Hostel', path: ROUTES.HOSTEL, icon: 'Home' },
      { name: 'Hostel Complaints', path: ROUTES.HOSTEL_COMPLAINTS, icon: 'AlertTriangle' },
      { name: 'User Management', path: ROUTES.USER_MANAGEMENT, icon: 'Users' },
      { name: 'System Settings', path: ROUTES.SYSTEM_SETTINGS, icon: 'Settings' },
    ],
  };

  return [...baseItems, ...(roleSpecificItems[userRole] || [])];
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    student: 'Student',
    club_head: 'Club Manager',
    canteen_vendor: 'Canteen Vendor',
    hostel_admin: 'Hostel Manager',
    super_admin: 'Super Admin',
  };
  return roleNames[role];
};

// Check if user can access a specific feature
export const canAccessFeature = (userRole: UserRole, feature: string): boolean => {
  const featurePermissions: Record<string, UserRole[]> = {
    // Basic features - accessible to students
    'marketplace': ['student', 'super_admin'],
    'clubs': ['student', 'club_head', 'super_admin'],
    'canteen': ['student', 'super_admin'],
    'hostel': ['student', 'hostel_admin', 'super_admin'],
    
    // Management features - restricted access
    'club_management': ['club_head', 'super_admin'],
    'canteen_orders': ['canteen_vendor', 'super_admin'],
    'canteen_management': ['canteen_vendor', 'super_admin'],
    'hostel_complaints': ['hostel_admin', 'super_admin'],
    'user_management': ['super_admin'],
    'system_settings': ['super_admin'],
  };

  return featurePermissions[feature]?.includes(userRole) || false;
}; 