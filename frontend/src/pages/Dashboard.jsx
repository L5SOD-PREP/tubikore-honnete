import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { Car, Users, Gift, ClipboardList, CarFront, UserCircle, Tag, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDashboardStats();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700 font-medium">Failed to load dashboard data</p>
        <button onClick={fetchData} className="btn-primary mt-4">Retry</button>
      </div>
    );
  }

  const { stats, recent } = data;

  const summaryCards = [
    { label: 'Total Vehicles', value: stats.totalVehicles, icon: Car, gradient: 'from-gray-700 to-gray-900', iconBg: 'bg-gray-900/40', accent: 'bg-gray-500' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, gradient: 'from-gray-800 to-gray-950', iconBg: 'bg-gray-950/40', accent: 'bg-gray-600' },
    { label: 'Total Promotions', value: stats.totalPromotions, icon: Gift, gradient: 'from-gray-700 to-gray-900', iconBg: 'bg-gray-900/40', accent: 'bg-gray-500' },
    { label: 'Total Assignments', value: stats.totalAssignments, icon: ClipboardList, gradient: 'from-gray-800 to-gray-950', iconBg: 'bg-gray-950/40', accent: 'bg-gray-600' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to PMS System Overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group">
              {/* Decorative gradient blob */}
              <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${card.gradient} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Top section */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{card.value}</span>
                </div>
              </div>
              
              {/* Value */}
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              
              {/* Progress bar */}
              <div className={`h-1 w-full ${card.accent} rounded-full mt-4 opacity-30`}></div>
            </div>
          );
        })}
      </div>

      {/* Recent Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Vehicles */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <CarFront className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Vehicles</h3>
          </div>
          <div className="space-y-3">
            {recent.vehicles.slice(0, 5).map((v) => (
              <div key={v.VehicleID} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{v.Brand} {v.Model}</p>
                  <p className="text-xs text-gray-500">{v.Plate_Number}</p>
                </div>
                <span className={`badge ${
                  v.Status === 'Available' ? 'badge-available' :
                  v.Status === 'Rented' ? 'badge-rented' :
                  'badge-maintenance'
                }`}>{v.Status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Customers</h3>
          </div>
          <div className="space-y-3">
            {recent.customers.slice(0, 5).map((c) => (
              <div key={c.CustomerID} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.FirstName} {c.LastName}</p>
                  <p className="text-xs text-gray-500">{c.Email}</p>
                </div>
                <span className={`badge ${
                  c.Status === 'Active' ? 'badge-active' :
                  c.Status === 'Inactive' ? 'badge-inactive' :
                  'badge-blocked'
                }`}>{c.Status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Promotions */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Promotions</h3>
          </div>
          <div className="space-y-3">
            {recent.promotions.slice(0, 5).map((p) => (
              <div key={p.PromotionID} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.Title}</p>
                  <p className="text-xs text-gray-500">{p.Discount_Type}: {p.Discount_Value.toLocaleString()}</p>
                </div>
                <span className={`badge ${
                  p.Status === 'Active' ? 'badge-active' : 'badge-expired'
                }`}>{p.Status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
