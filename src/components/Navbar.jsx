import React from 'react';
import { MonitorPlay, Settings } from 'lucide-react';

const Navbar = ({ onNavigate }) => (
  <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 text-white">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <MonitorPlay size={20} className="text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight">CoView</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-sm text-slate-400 hidden sm:block">v1.0.0 (Beta)</div>
      <button className="p-2 hover:bg-slate-800 rounded-full transition-colors">
        <Settings size={20} className="text-slate-300" />
      </button>
    </div>
  </nav>
);

export default Navbar;