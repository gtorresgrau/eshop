import React from 'react'
import dynamic from 'next/dynamic';
const Admin = dynamic(() => import( '@/components/Admin/Admin'))
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

const AdminPage = () => {
  return (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
  )
};

export default AdminPage;
