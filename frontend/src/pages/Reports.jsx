import { useState, useEffect, useCallback, useRef } from 'react';
import { getReports } from '../services/api';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';

export default function Reports() {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const printRef = useRef();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReports({ search });
      setData(res.data.data);
      setCustomers(res.data.customers);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules || [])
            .map((rule) => rule.cssText)
            .join('');
        } catch {
          return '';
        }
      })
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>PMS Report</title>
          <style>${styles}</style>
          <style>
            body { padding: 40px; font-family: Arial, sans-serif; }
            .print-header { text-align: center; margin-bottom: 30px; }
            .print-header h1 { color: #0F172A; margin: 0; }
            .print-header p { color: #666; margin: 5px 0 0; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #0F172A; color: white; padding: 10px; text-align: left; font-size: 12px; }
            td { padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 12px; }
            tr:nth-child(even) { background: #f8fafc; }
            .no-print { display: none; }
            .print-footer { text-align: center; margin-top: 20px; font-size: 11px; color: #999; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Promotion & Marketing Subsystem</h1>
            <p>SwiftWheels Enterprises - Performance Report</p>
            <p style="font-size:12px">Generated: ${new Date().toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Vehicle Brand</th>
                <th>Vehicle Model</th>
                <th>Promotion Title</th>
                <th>Discount Value</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((row) => `
                <tr>
                  <td>${row.CustomerName}</td>
                  <td>${row.Brand}</td>
                  <td>${row.Model}</td>
                  <td>${row.PromotionTitle}</td>
                  <td>${row.Discount_Type === 'Percentage' ? row.Discount_Value + '%' : Number(row.Discount_Value).toLocaleString() + ' RWF'}</td>
                  <td>${row.Performance || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="print-footer">
            <p>PMS System &copy; ${new Date().getFullYear()} SwiftWheels Enterprises</p>
          </div>
          <script>
            window.print();
            window.onafterprint = function() { window.close(); };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    const headers = ['Customer Name', 'Vehicle Brand', 'Vehicle Model', 'Promotion Title', 'Discount Value', 'Performance'];
    const csvRows = [headers.join(',')];

    data.forEach((row) => {
      const values = [
        row.CustomerName,
        row.Brand,
        row.Model,
        row.PromotionTitle,
        `${row.Discount_Type === 'Percentage' ? row.Discount_Value + '%' : Number(row.Discount_Value).toLocaleString() + ' RWF'}`,
        row.Performance || '-'
      ];
      csvRows.push(values.map(v => `"${v}"`).join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PMS_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const filteredData = selectedCustomer
    ? data.filter((row) => row.CustomerName === selectedCustomer)
    : data;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">View and export promotion performance reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-gray text-sm py-2 px-4">
            Export CSV
          </button>
          <button onClick={handlePrint} className="btn-primary text-sm py-2 px-4">
            Print Report
          </button>
        </div>
      </div>

      <div className="table-container" ref={printRef}>
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <SearchBar value={search} onChange={setSearch} placeholder="Search reports..." />
            </div>
            <div className="w-48">
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="select-field text-sm"
              >
                <option value="">All Customers</option>
                {customers.map((c) => (
                  <option key={c.CustomerID} value={c.CustomerName}>{c.CustomerName}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500">{filteredData.length} records</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Customer Name</th>
                <th className="table-cell">Vehicle Brand</th>
                <th className="table-cell">Vehicle Model</th>
                <th className="table-cell">Promotion Title</th>
                <th className="table-cell">Discount Value</th>
                <th className="table-cell">Performance</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">No records found</td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr key={idx} className="table-row">
                    <td className="table-cell font-medium">{row.CustomerName}</td>
                    <td className="table-cell">{row.Brand}</td>
                    <td className="table-cell">{row.Model}</td>
                    <td className="table-cell">{row.PromotionTitle}</td>
                    <td className="table-cell">
                      {row.Discount_Type === 'Percentage'
                        ? `${row.Discount_Value}%`
                        : `${Number(row.Discount_Value).toLocaleString()} RWF`}
                    </td>
                    <td className="table-cell text-gray-500">{row.Performance || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
