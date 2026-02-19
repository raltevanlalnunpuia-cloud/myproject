
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, RefreshCw, Menu, ChevronDown, ListFilter, ArrowUp, BarChart3, LayoutList, Sun, Moon } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import ProjectTable from './components/ProjectTable';
import ExportButtons from './components/ExportButtons';
import { fetchProjects } from './services/dataService';
import { Project, SectorType, ProjectStatus } from './types';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState<'Overview' | SectorType>('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGoTop, setShowGoTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 300000);
    return () => clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        p.name.toLowerCase().includes(term) ||
        p.ulb.toLowerCase().includes(term) ||
        p.slNo.toLowerCase().includes(term);
      
      const matchesView = currentView === 'Overview' || p.sector === currentView;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchesSearch && matchesView && matchesStatus;
    });
  }, [projects, searchTerm, currentView, statusFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <RefreshCw className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Initializing Data Stream...</p>
      </div>
    );
  }

  const getHeaderTitle = () => {
    if (currentView === 'Overview') return "Overview Dashboard";
    return currentView;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="lg:ml-72 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                  {getHeaderTitle()}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isRefreshing ? 'bg-blue-500 animate-spin' : 'bg-green-500 animate-pulse'}`}></div>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
                    {isRefreshing ? 'Syncing...' : 'Connected'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => loadData(true)}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <ExportButtons projects={filteredProjects} sectorName={currentView} />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-12 max-w-[1600px] mx-auto w-full">
          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                placeholder="Global search by Sl.No, Project Name or ULB..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm shadow-sm font-bold dark:text-white"
              />
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full appearance-none pl-12 pr-10 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm cursor-pointer dark:text-white"
              >
                <option value="All">All Statuses</option>
                <option value="Not started">Not Started</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Delay">Delayed</option>
              </select>
              <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Analytical Summary Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
               <BarChart3 className="w-5 h-5 text-blue-500" />
               <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Execution Metrics</h3>
            </div>
            <DashboardOverview projects={filteredProjects} />
          </section>

          {/* Project List Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <LayoutList className="w-5 h-5 text-blue-500" />
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Project Repository</h3>
              </div>
              <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">{filteredProjects.length} Units Found</span>
            </div>
            <ProjectTable projects={filteredProjects} searchTerm={searchTerm} />
          </section>
        </div>
      </main>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3.5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-2xl shadow-blue-500/40 transition-all duration-500 z-50 hover:scale-110 active:scale-95 ${
          showGoTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default App;
