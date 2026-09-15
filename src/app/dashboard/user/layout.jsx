import { userRole } from '@/lib/core/session';
import React from 'react';

const UserLayout = async ({ children }) => {
  await userRole('buyer');
  return children;
};

export default UserLayout;