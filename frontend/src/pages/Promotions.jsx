import { useState, useEffect, useCallback } from 'react';
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '../services/api';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const discountTypes = ['Free', 'Percentage', 'FLAT_RATE', 'CASHBACK', 'BUY_ONE_GET_ONE', 'Bundle', 'Amount'];

const emptyForm = {
  Title: '',
  Description: '',
  Discount_Type: 'Percentage',
  Discount_Value: '',
  Start_Date: '',
  End_Date: '',
  Status: 'Active'
};

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getPromotions({ search, page, limit: 10 });
      setPromotions(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load promotions');
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

  const openEdit = (promotion) => {
    setEditItem(promotion);
    setForm({
      Title: promotion.Title,
      Description: promotion.Description || '',
      Discount_Type: promotion.Discount_Type,
      Discount_Value: promotion.Discount_Value,
      Start_Date: promotion.Start_Date ? promotion.Start_Date.split('T')[0] : '',
      End_Date: promotion.End_Date ? promotion.End_Date.split('T')[0] : '',
      Status: promotion.Status
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.Title || !form.Discount_Type || form.Discount_Value === '' || !form.Start_Date || !form.End_Date) {
      toast.error('Please fill all required fields');
      return;
    }

    if (/^\d+$/.test(form.Title.trim())) {
      toast.error('Title must contain letters, not just numbers');
      return;
    }

    if (isNaN(form.Discount_Value) || Number(form.Discount_Value) < 0) {
      toast.error('Discount value must be a valid positive number');
      return;
    }

    if (form.Discount_Type === 'Percentage' && Number(form.Discount_Value) > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(form.Start_Date);
    const endDate = new Date(form.End_Date);

    if (startDate < today) {
      toast.error('Start date cannot be in the past');
      return;
    }

    if (endDate < today) {
      toast.error('End date cannot be in the past');
      return;
    }

    if (startDate > endDate) {
      toast.error('End date must be after start date');
      return;
    }

    setSaving(true);
    try {
      if (editItem) {
        await updatePromotion(editItem.PromotionID, form);
        toast.success('Promotion updated successfully');
      } else {
        await createPromotion(form);
        toast.success('Promotion added successfully');
      }
      setModalOpen(false);
      fetchData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save promotion');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotion(id);
      toast.success('Promotion deleted successfully');
      setDeleteConfirm(null);
      fetchData(pagination.page);
    } catch (err) {
      toast.error('Failed to delete promotion');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage promotional campaigns</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          Add Promotion
        </button>
      </div>

      <div className="table-container">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <SearchBar value={search} onChange={handleSearchChange} placeholder="Search promotions..." />
            </div>
            <span className="text-sm text-gray-500">{pagination.total} promotions found</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Title</th>
                <th className="table-cell">Discount Type</th>
                <th className="table-cell">Discount Value</th>
                <th className="table-cell">Start Date</th>
                <th className="table-cell">End Date</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">No promotions found</td>
                </tr>
              ) : (
                promotions.map((p) => (
                  <tr key={p.PromotionID} className="table-row">
                    <td className="table-cell font-medium">{p.Title}</td>
                    <td className="table-cell">{p.Discount_Type}</td>
                    <td className="table-cell">
                      {p.Discount_Type === 'Percentage' ? `${p.Discount_Value}%` : `${Number(p.Discount_Value).toLocaleString()} RWF`}
                    </td>
                    <td className="table-cell">{formatDate(p.Start_Date)}</td>
                    <td className="table-cell">{formatDate(p.End_Date)}</td>
                    <td className="table-cell">
                      <span className={`badge ${p.Status === 'Active' ? 'badge-active' : 'badge-expired'}`}>
                        {p.Status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="btn-success text-xs py-1.5 px-3">Edit</button>
                        <button onClick={() => setDeleteConfirm(p)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
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
        title={editItem ? 'Edit Promotion' : 'Add Promotion'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.Title} onChange={(e) => setForm({...form, Title: e.target.value.replace(/[0-9]/g, '')})} className="input-field" placeholder="e.g., New Year Sale" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.Description} onChange={(e) => setForm({...form, Description: e.target.value})} className="input-field" rows="3" placeholder="Promotion description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
              <select value={form.Discount_Type} onChange={(e) => setForm({...form, Discount_Type: e.target.value})} className="select-field">
                {discountTypes.map((dt) => <option key={dt} value={dt}>{dt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
              <input type="number" value={form.Discount_Value} onChange={(e) => setForm({...form, Discount_Value: e.target.value})} className="input-field" placeholder="e.g., 15 or 500000" onKeyDown={(e) => { if (/^[a-zA-Z]$/.test(e.key)) e.preventDefault() }} onPaste={(e) => { const pasted = e.clipboardData.getData('text'); if (/[a-zA-Z]/.test(pasted)) e.preventDefault(); }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="date" value={form.Start_Date} min={todayStr} onChange={(e) => setForm({...form, Start_Date: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input type="date" value={form.End_Date} min={todayStr} onChange={(e) => setForm({...form, End_Date: e.target.value})} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.Status} onChange={(e) => setForm({...form, Status: e.target.value})} className="select-field">
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editItem ? 'Update Promotion' : 'Add Promotion'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        <p className="text-gray-600 mb-2">Are you sure you want to delete this promotion?</p>
        {deleteConfirm && (
          <p className="font-medium text-gray-900 mb-4">{deleteConfirm.Title}</p>
        )}
        <p className="text-sm text-gray-800 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm.PromotionID)} className="btn-danger">Delete Promotion</button>
        </div>
      </Modal>
    </div>
  );
}
