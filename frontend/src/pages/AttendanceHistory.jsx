import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  History, 
  Search, 
  Download, 
  Filter, 
  Calendar,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-toastify';

const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchHistory = async () => {
    try {
      const response = await api.get('/recognition/history');
      setHistory(response.data);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const exportCSV = () => {
    if (history.length === 0) return;
    
    const headers = ['ID', 'Employee ID', 'Name', 'Date', 'Time', 'Status'];
    const rows = history.map(r => [
      r.id, r.employee_id, r.name, r.date, r.time, r.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report downloaded!");
  };

  const filteredHistory = history.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? record.date === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white font-['Outfit']">Attendance Logs</h2>
          <p className="text-slate-400 text-sm mt-1">Review historical records and generate documentation.</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={history.length === 0}
          className="btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 flex items-center gap-2 group"
        >
          <FileSpreadsheet className="w-5 h-5 group-hover:scale-110 transition-transform" />
          GENERATE CSV REPORT
        </button>
      </header>

      <div className="glass-card overflow-hidden">
        {/* Filters Area */}
        <div className="p-8 bg-white/[0.02] border-b border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Search Directory</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Name or Employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Filter by Date</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm color-scheme-dark"
              />
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Employee Identity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">ID Reference</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary opacity-20" />
                  </td>
                </tr>
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-white">{record.date}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{record.time}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                          {record.name[0]}
                        </div>
                        <span className="font-bold text-slate-200 group-hover:text-primary transition-colors">{record.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">{record.employee_id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-32 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <Search className="w-8 h-8 text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">No audit logs found matching criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
