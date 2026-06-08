import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/vehicles', label: 'Vehicles' },
  { path: '/customers', label: 'Customers' },
  { path: '/promotions', label: 'Promotions' },
  { path: '/promotion-vehicles', label: 'Promotion Vehicle' },
  { path: '/reports', label: 'Reports' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isAdmin = user?.Role === 'Admin';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-950 z-40 flex flex-col">
      {/* Logo Area */}
      <div className="px-6 py-5 border-b border-gray-900/50">
        <h2 className="text-white text-xl font-bold tracking-tight">PMS System</h2>
        <p className="text-gray-300 text-xs mt-0.5">SwiftWheels Enterprises</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            Users
          </NavLink>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-gray-900/50 pt-4">
        <button
          onClick={handleLogout}
          className="w-full text-left sidebar-link text-gray-400 hover:text-white hover:bg-gray-800/50"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
