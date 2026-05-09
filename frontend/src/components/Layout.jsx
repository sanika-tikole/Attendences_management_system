import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, User } from 'lucide-react';

const Layout = () => {
  return (
    <div className="flex w-full min-h-screen bg-surface-950 font-['Inter']">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-surface-950/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-surface-900/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface-950"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/5"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white leading-none">Admin User</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center border-2 border-white/10">
                <User className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto bg-gradient-mesh">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
