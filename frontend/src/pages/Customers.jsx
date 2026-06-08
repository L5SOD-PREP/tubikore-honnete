import { useState, useEffect, useCallback } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const emptyForm = {
  FirstName: '',
  LastName: '',
  Email: '',
  PhoneNumber: '',
  Status: 'Active'
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getCustomers({ search, page, limit: 10 });
      setCustomers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData(1);
  }, [search, fetchData]);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (customer) => {
    setEditItem(customer);
    setForm({
      FirstName: customer.FirstName,
      LastName: customer.LastName,
      Email: customer.Email,
      PhoneNumber: customer.PhoneNumber,
      Status: customer.Status
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.FirstName || !form.LastName || !form.Email || !form.PhoneNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(form.FirstName.trim())) {
      toast.error('First name must only contain letters and spaces');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(form.LastName.trim())) {
      toast.error('Last name must only contain letters and spaces');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
      toast.error('Invalid email format');
      return;
    }

    setSaving(true);
    try {
      if (editItem) {
        await updateCustomer(editItem.CustomerID, form);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(form);
        toast.success('Customer added successfully');
      }
      setModalOpen(false);
      fetchData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      toast.success('Customer deleted successfully');
      setDeleteConfirm(null);
      fetchData(pagination.page);
    } catch (err) {
      toast.error('Failed to delete customer');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer records</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          Add Customer
        </button>
      </div>

      <div className="table-container">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <SearchBar value={search} onChange={handleSearchChange} placeholder="Search customers..." />
            </div>
            <span className="text-sm text-gray-500">{pagination.total} customers found</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell">First Name</th>
                <th className="table-cell">Last Name</th>
                <th className="table-cell">Email</th>
                <th className="table-cell">Phone</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">No customers found</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.CustomerID} className="table-row">
                    <td className="table-cell font-medium">{c.FirstName}</td>
                    <td className="table-cell">{c.LastName}</td>
                    <td className="table-cell text-gray-700">{c.Email}</td>
                    <td className="table-cell">{c.PhoneNumber}</td>
                    <td className="table-cell">
                      <span className={`badge ${
                        c.Status === 'Active' ? 'badge-active' :
                        c.Status === 'Inactive' ? 'badge-inactive' : 'badge-blocked'
                      }`}>{c.Status}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="btn-success text-xs py-1.5 px-3">Edit</button>
                        <button onClick={() => setDeleteConfirm(c)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          onPageChange={fetchData}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Customer' : 'Add Customer'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input type="text" value={form.FirstName} onChange={(e) => setForm({...form, FirstName: e.target.value.replace(/[0-9]/g, '')})} className="input-field" placeholder="First name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input type="text" value={form.LastName} onChange={(e) => setForm({...form, LastName: e.target.value.replace(/[0-9]/g, '')})} className="input-field" placeholder="Last name" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.Email} onChange={(e) => setForm({...form, Email: e.target.value})} className="input-field" placeholder="email@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input type="text" value={form.PhoneNumber} onChange={(e) => setForm({...form, PhoneNumber: e.target.value})} className="input-field" placeholder="e.g., 0788001001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.Status} onChange={(e) => setForm({...form, Status: e.target.value})} className="select-field">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editItem ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        <p className="text-gray-600 mb-2">Are you sure you want to delete this customer?</p>
        {deleteConfirm && (
          <p className="font-medium text-gray-900 mb-4">{deleteConfirm.FirstName} {deleteConfirm.LastName}</p>
        )}
        <p className="text-sm text-gray-800 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm.CustomerID)} className="btn-danger">Delete Customer</button>
        </div>
      </Modal>
    </div>
  );
}
