import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Camera, 
  History, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Attendance', path: '/recognition', icon: Camera },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <aside className="flex flex-col w-64 bg-surface-900/80 backdrop-blur-xl border-r border-white/5 h-screen sticky top-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Camera className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
              FaceAuth
            </h1>
            <span className="text-[10px] text-primary-light font-bold uppercase tracking-[0.2em]">
              PRO SYSTEM
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className={`w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110`} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-surface-800/40 rounded-3xl p-4 border border-white/5 mb-4">
          <p className="text-xs text-slate-400 text-center">System v2.1.0</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3.5 text-sm font-medium text-slate-400 rounded-2xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
