import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-gray-950 border-b border-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-white">PMS System</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300 font-medium">
            {user?.UserName}
          </span>
          <span className="px-2.5 py-0.5 bg-gray-800 text-gray-200 rounded-full text-xs font-medium">
            {user?.Role}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
