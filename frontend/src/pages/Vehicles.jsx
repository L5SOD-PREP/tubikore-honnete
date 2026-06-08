import { useState, useEffect, useCallback } from 'react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../services/api';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const emptyForm = {
  Plate_Number: '',
  Brand: '',
  Model: '',
  Year: new Date().getFullYear(),
  Vehicle_Type: '',
  Purchase_Price: '',
  Status: 'Available'
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
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
      const res = await getVehicles({ search, page, limit: 10 });
      setVehicles(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load vehicles');
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

  const openEdit = (vehicle) => {
    setEditItem(vehicle);
    setForm({
      Plate_Number: vehicle.Plate_Number,
      Brand: vehicle.Brand,
      Model: vehicle.Model,
      Year: vehicle.Year,
      Vehicle_Type: vehicle.Vehicle_Type,
      Purchase_Price: vehicle.Purchase_Price,
      Status: vehicle.Status
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.Plate_Number || !form.Brand || !form.Model || !form.Year || !form.Vehicle_Type || !form.Purchase_Price) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(form.Brand.trim())) {
      toast.error('Brand must only contain letters and spaces');
      return;
    }

    if (isNaN(form.Year) || !Number.isInteger(Number(form.Year)) || Number(form.Year) < 1900 || Number(form.Year) > 2100) {
      toast.error('Year must be a valid whole number between 1900 and 2100');
      return;
    }

    if (isNaN(form.Purchase_Price) || Number(form.Purchase_Price) <= 0) {
      toast.error('Purchase price must be a valid positive number');
      return;
    }

    setSaving(true);
    try {
      if (editItem) {
        await updateVehicle(editItem.VehicleID, form);
        toast.success('Vehicle updated successfully');
      } else {
        await createVehicle(form);
        toast.success('Vehicle added successfully');
      }
      setModalOpen(false);
      fetchData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVehicle(id);
      toast.success('Vehicle deleted successfully');
      setDeleteConfirm(null);
      fetchData(pagination.page);
    } catch (err) {
      toast.error('Failed to delete vehicle');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your vehicle fleet</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          Add Vehicle
        </button>
      </div>

      <div className="table-container">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <SearchBar value={search} onChange={handleSearchChange} placeholder="Search vehicles..." />
            </div>
            <span className="text-sm text-gray-500">{pagination.total} vehicles found</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Plate Number</th>
                <th className="table-cell">Brand</th>
                <th className="table-cell">Model</th>
                <th className="table-cell">Year</th>
                <th className="table-cell">Type</th>
                <th className="table-cell">Price (RWF)</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">No vehicles found</td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.VehicleID} className="table-row">
                    <td className="table-cell font-medium">{v.Plate_Number}</td>
                    <td className="table-cell">{v.Brand}</td>
                    <td className="table-cell">{v.Model}</td>
                    <td className="table-cell">{v.Year}</td>
                    <td className="table-cell">{v.Vehicle_Type}</td>
                    <td className="table-cell">{Number(v.Purchase_Price).toLocaleString()}</td>
                    <td className="table-cell">
                      <span className={`badge ${
                        v.Status === 'Available' ? 'badge-available' :
                        v.Status === 'Rented' ? 'badge-rented' :
                        'badge-maintenance'
                      }`}>{v.Status}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(v)} className="btn-success text-xs py-1.5 px-3">Edit</button>
                        <button onClick={() => setDeleteConfirm(v)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Vehicle' : 'Add Vehicle'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
              <input type="text" value={form.Plate_Number} onChange={(e) => setForm({...form, Plate_Number: e.target.value})} className="input-field" placeholder="e.g., RAB001A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <input type="text" value={form.Brand} onChange={(e) => setForm({...form, Brand: e.target.value.replace(/[0-9]/g, '')})} className="input-field" placeholder="e.g., Toyota" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input type="text" value={form.Model} onChange={(e) => setForm({...form, Model: e.target.value.replace(/[0-9]/g, '')})} className="input-field" placeholder="e.g., RAV4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input type="number" value={form.Year} onChange={(e) => setForm({...form, Year: e.target.value.replace(/\D/g, '')})} className="input-field" min="1900" max="2100" onKeyDown={(e) => { if (/^[a-zA-Z]$/.test(e.key)) e.preventDefault() }} onPaste={(e) => { const pasted = e.clipboardData.getData('text'); if (/\D/.test(pasted)) e.preventDefault(); }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
              <select value={form.Vehicle_Type} onChange={(e) => setForm({...form, Vehicle_Type: e.target.value})} className="select-field">
                <option value="">Select type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (RWF) *</label>
              <input type="number" value={form.Purchase_Price} onChange={(e) => setForm({...form, Purchase_Price: e.target.value})} className="input-field" placeholder="e.g., 35000000" onKeyDown={(e) => { if (/^[a-zA-Z]$/.test(e.key)) e.preventDefault() }} onPaste={(e) => { const pasted = e.clipboardData.getData('text'); if (/[a-zA-Z]/.test(pasted)) e.preventDefault(); }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.Status} onChange={(e) => setForm({...form, Status: e.target.value})} className="select-field">
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editItem ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        <p className="text-gray-600 mb-2">Are you sure you want to delete this vehicle?</p>
        {deleteConfirm && (
          <p className="font-medium text-gray-900 mb-4">{deleteConfirm.Plate_Number} - {deleteConfirm.Brand} {deleteConfirm.Model}</p>
        )}
        <p className="text-sm text-gray-800 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm.VehicleID)} className="btn-danger">
            Delete Vehicle
          </button>
        </div>
      </Modal>
    </div>
  );
}
