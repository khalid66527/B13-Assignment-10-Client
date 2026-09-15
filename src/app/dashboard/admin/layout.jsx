import { adminRole } from '@/lib/core/session';
import React from 'react';

const AdminLayout = async ({ children }) => {
  await adminRole('admin');
  return children;
};

export default AdminLayout;

