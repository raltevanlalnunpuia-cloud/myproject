
import React from 'react';
import { LayoutDashboard, ExternalLink, Menu, X, ChevronRight, Layers } from 'lucide-react';
import { SECTORS, IMPORTANT_LINKS } from '../constants';
import { SectorType } from '../types';

interface SidebarProps {
  currentView: 'Overview' | SectorType;
  onViewChange: (view: 'Overview' | SectorType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  isOpen,
  setIsOpen 
}) => {
  const NavItem: React.FC<{ id: any, label: string, icon: React.ReactNode, isActive: boolean }> = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => {
        onViewChange(id);
        if (window.innerWidth < 1024) setIsOpen(false);
      }}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
      }`}
    >
      <div className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
      {isActive && <ChevronRight className="ml-auto w-4 h-4 flex-shrink-0 animate-pulse" />}
    </button>
  );

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Layers className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white leading-none">AMRUT 2.0</h1>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Dashboard</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-4">Overview</p>
              <NavItem 
                id="Overview" 
                label="Main Dashboard" 
                icon={<LayoutDashboard className="w-5 h-5" />} 
                isActive={currentView === 'Overview'} 
              />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-4">Sector Components</p>
              <div className="space-y-1">
                {SECTORS.map((sector) => (
                  <NavItem 
                    key={sector.id}
                    id={sector.id} 
                    label={sector.label} 
                    icon={sector.icon} 
                    isActive={currentView === sector.id} 
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-4">Important Links</p>
              <div className="space-y-1">
                {IMPORTANT_LINKS.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                  >
                    <div className="flex-shrink-0 group-hover:scale-110 transition-transform">{link.icon}</div>
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{link.label}</span>
                    <ExternalLink className="ml-auto w-3 h-3 flex-shrink-0 opacity-30 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-auto border-t border-slate-200 dark:border-slate-800">
            <div className="text-center px-2 py-4">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">System Crafted By</p>
              <p className="text-xs font-black text-slate-900 dark:text-slate-100 mt-0.5">May-a Ralte @2026</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
