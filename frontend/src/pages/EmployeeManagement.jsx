import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../services/api';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  UserPlus, 
  X,
  Loader2,
  Camera,
  Upload
} from 'lucide-react';
import { toast } from 'react-toastify';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    department: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees/');
      setEmployees(response.data);
    } catch (err) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      return toast.warn("Please upload a face image");
    }

    setRegistering(true);
    const data = new FormData();
    data.append('employee_id', formData.employee_id);
    data.append('name', formData.name);
    data.append('department', formData.department);
    data.append('image', formData.image);

    try {
      await api.post('/employees/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Employee registered successfully!");
      setShowModal(false);
      setFormData({ employee_id: '', name: '', department: '', image: null });
      setImagePreview(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      toast.success("Employee deleted");
      fetchEmployees();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white font-['Outfit']">Staff Directory</h2>
          <p className="text-slate-400 text-sm mt-1">Manage personnel records and biometric data.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 group"
        >
          <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          REGISTER NEW EMPLOYEE
        </button>
      </header>

      {/* Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Members</p>
            <p className="text-2xl font-bold text-white font-['Outfit']">{employees.length}</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 bg-white/[0.02] border-b border-white/5">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name or ID Reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Personnel Identity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Employee ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Department</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary opacity-20" />
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                          {emp.image_path ? (
                            <img 
                              src={`${BASE_URL}/uploads/${emp.image_path.replace(/\\/g, '/').split('/').pop()}`} 
                              alt={emp.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = ""; // Fallback logic
                              }}
                            />
                          ) : (
                            <span className="text-primary font-bold text-lg">{emp.name[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 group-hover:text-primary transition-colors">{emp.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Biometric Verified</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-xs text-slate-400">{emp.employee_id}</td>
                    <td className="px-8 py-5 text-sm text-slate-400">{emp.department}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                        ACTIVE
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(emp.id)}
                        className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center text-slate-500">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <Users className="w-8 h-8 text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">No personnel records discovered</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-surface-900 border border-white/10 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-3">
                    <UserPlus className="text-primary w-6 h-6" />
                    Enrollment
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">Biometric Onboarding System</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-500 hover:text-white rounded-xl bg-white/5 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Assigned ID</label>
                    <input
                      required
                      type="text"
                      className="input-field py-2.5 text-sm"
                      value={formData.employee_id}
                      onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                      placeholder="e.g. EMP-9982"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Legal Full Name</label>
                    <input
                      required
                      type="text"
                      className="input-field py-2.5 text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Samantha Miller"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Operational Unit</label>
                  <input
                    required
                    type="text"
                    className="input-field py-2.5 text-sm"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="e.g. Research & Development"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Biometric Profile</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="face-upload"
                    />
                    <label 
                      htmlFor="face-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-surface-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                            <Upload className="w-8 h-8 text-white mb-2" />
                            <p className="text-white text-[10px] font-bold uppercase tracking-widest">Replace Identity</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Camera className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-xs font-bold text-slate-300">UPLOAD FACE PROFILE</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">FRONT-FACING PHOTO</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={registering}
                  className="w-full btn-primary h-14 text-base font-bold flex items-center justify-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  {registering ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    "FINALIZE ENROLLMENT"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
