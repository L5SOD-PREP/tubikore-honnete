import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    };
    doLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
    </div>
  );
}
