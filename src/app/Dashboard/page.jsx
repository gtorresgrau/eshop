
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import ClientLayout from '../ClientLayout';
import Dashboard from '../../components/DashboardCliente/Dashboard';

const AdminPage = () => {
  return (
      <ProtectedRoute>
        <ClientLayout title="Dashboard" className="flex flex-col ">
          <main className="flex-1 overflow-y-auto h-screen">
            <Dashboard />
          </main>
        </ClientLayout>
      </ProtectedRoute>
  )
};

export default AdminPage;
