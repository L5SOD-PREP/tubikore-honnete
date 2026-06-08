import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
