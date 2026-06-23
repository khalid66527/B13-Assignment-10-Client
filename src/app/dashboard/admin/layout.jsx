import { adminRole } from '@/lib/core/session';
import React from 'react';

const AdminDashboardLayout = async({children}) => {
    await adminRole('admin')
    return children
};

export default AdminDashboardLayout;