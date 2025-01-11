import Admin from '@/components/Admin/Admin';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

const AdminPage = () => {
  return (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
  )
};

export default AdminPage;
