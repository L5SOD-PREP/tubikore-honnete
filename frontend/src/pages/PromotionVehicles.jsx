import { useState, useEffect, useCallback } from 'react';
import { getPromotionVehicles, createPromotionVehicle, updatePromotionVehicle, deletePromotionVehicle } from '../services/api';
import { getAllVehicles } from '../services/api';
import { getAllPromotions } from '../services/api';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const emptyForm = {
  PromotionID: '',
  VehicleID: '',
  Performance: ''
};

export default function PromotionVehicles() {
  const [assignments, setAssignments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getPromotionVehicles({ search, page, limit: 10 });
      setAssignments(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [search]);

  const fetchDropdowns = async () => {
    try {
      const [vRes, pRes] = await Promise.all([getAllVehicles(), getAllPromotions()]);
      setVehicles(vRes.data);
      setPromotions(pRes.data);
    } catch (err) {
      console.error('Failed to load dropdown data:', err);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [search, fetchData]);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const openAdd = async () => {
    await fetchDropdowns();
    setEditItem(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = async (item) => {
    await fetchDropdowns();
    setEditItem(item);
    setForm({
      PromotionID: item.PromotionID,
      VehicleID: item.VehicleID,
      Performance: item.Performance || ''
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.PromotionID || !form.VehicleID) {
      toast.error('Please select both promotion and vehicle');
      return;
    }

    setSaving(true);
    try {
      if (editItem) {
        await updatePromotionVehicle(editItem.PromotionVehicleID, form);
        toast.success('Assignment updated successfully');
      } else {
        await createPromotionVehicle(form);
        toast.success('Assignment created successfully');
      }
      setModalOpen(false);
      fetchData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotionVehicle(id);
      toast.success('Assignment deleted successfully');
      setDeleteConfirm(null);
      fetchData(pagination.page);
    } catch (err) {
      toast.error('Failed to delete assignment');
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
          <h1 className="text-2xl font-bold text-gray-900">Promotion Vehicle</h1>
          <p className="text-sm text-gray-500 mt-1">Assign promotions to vehicles</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          Assign Promotion
        </button>
      </div>

      <div className="table-container">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <SearchBar value={search} onChange={handleSearchChange} placeholder="Search assignments..." />
            </div>
            <span className="text-sm text-gray-500">{pagination.total} assignments found</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Promotion</th>
                <th className="table-cell">Vehicle</th>
                <th className="table-cell">Plate Number</th>
                <th className="table-cell">Discount Type</th>
                <th className="table-cell">Performance</th>
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
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">No assignments found</td>
                </tr>
              ) : (
                assignments.map((a) => (
                  <tr key={a.PromotionVehicleID} className="table-row">
                    <td className="table-cell font-medium">{a.PromotionTitle}</td>
                    <td className="table-cell">{a.Brand} {a.Model}</td>
                    <td className="table-cell">{a.Plate_Number}</td>
                    <td className="table-cell">{a.Discount_Type}</td>
                    <td className="table-cell text-gray-500">{a.Performance || '-'}</td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(a)} className="btn-success text-xs py-1.5 px-3">Edit</button>
                        <button onClick={() => setDeleteConfirm(a)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
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
        title={editItem ? 'Edit Assignment' : 'Assign Promotion to Vehicle'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Promotion *</label>
            <select value={form.PromotionID} onChange={(e) => setForm({...form, PromotionID: e.target.value})} className="select-field">
              <option value="">Select promotion</option>
              {promotions.map((p) => (
                <option key={p.PromotionID} value={p.PromotionID}>{p.Title} ({p.Status})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle *</label>
            <select value={form.VehicleID} onChange={(e) => setForm({...form, VehicleID: e.target.value})} className="select-field">
              <option value="">Select vehicle</option>
              {vehicles.map((v) => (
                <option key={v.VehicleID} value={v.VehicleID}>{v.Plate_Number} - {v.Brand} {v.Model} ({v.Status})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Performance</label>
            <textarea value={form.Performance} onChange={(e) => setForm({...form, Performance: e.target.value})} className="input-field" rows="2" placeholder="Notes on performance..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editItem ? 'Update Assignment' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        <p className="text-gray-600 mb-2">Are you sure you want to delete this assignment?</p>
        {deleteConfirm && (
          <p className="font-medium text-gray-900 mb-4">{deleteConfirm.PromotionTitle} - {deleteConfirm.Plate_Number}</p>
        )}
        <p className="text-sm text-gray-800 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm.PromotionVehicleID)} className="btn-danger">Delete Assignment</button>
        </div>
      </Modal>
    </div>
  );
}
