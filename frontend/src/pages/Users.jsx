import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

export default function Users() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', role: 'Admin' });

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.Role !== 'Admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ username: '', password: '', role: 'Admin' });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error('Username and password are required');
      return;
    }

    if (form.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      await createUser(form);
      toast.success('User created successfully');
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (user && user.Role !== 'Admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Admin-only: create and manage system users</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          Add User
        </button>
      </div>

      <div className="table-container">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <span className="text-sm text-gray-500">{users.length} users found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell">User ID</th>
                <th className="table-cell">Username</th>
                <th className="table-cell">Role</th>
                <th className="table-cell">Created At</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.UserID} className="table-row">
                    <td className="table-cell">{u.UserID}</td>
                    <td className="table-cell font-medium">{u.UserName}</td>
                    <td className="table-cell">
                      <span className="badge badge-active">{u.Role}</span>
                    </td>
                    <td className="table-cell text-gray-500">
                      {u.CreatedAt ? new Date(u.CreatedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="table-cell">
                      {u.UserName !== 'admin' && u.UserID !== user?.UserID ? (
                        <button
                          onClick={() => setDeleteConfirm(u)}
                          className="btn-danger text-xs py-1.5 px-3"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Protected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
              className="input-field"
              placeholder="e.g., manager1"
            />
            <p className="text-xs text-gray-400 mt-1">Min 3 characters. Letters, numbers, underscores only.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="input-field"
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({...form, role: e.target.value})}
              className="select-field"
            >
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        <p className="text-gray-600 mb-2">Are you sure you want to delete this user?</p>
        {deleteConfirm && (
          <p className="font-medium text-gray-900 mb-4">{deleteConfirm.UserName}</p>
        )}
        <p className="text-sm text-gray-800 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm.UserID)} className="btn-danger">Delete User</button>
        </div>
      </Modal>
    </div>
  );
}
