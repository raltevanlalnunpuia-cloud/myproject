
import React from 'react';
import { Project, ProjectStatus } from '../types';
import { Calendar, MapPin, CheckCircle, Clock, AlertCircle, Info } from 'lucide-react';

interface Props {
  projects: Project[];
  searchTerm: string;
}

const ProjectTable: React.FC<Props> = ({ projects, searchTerm }) => {
  const highlightText = (text: string) => {
    if (!searchTerm || !text) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() 
            ? <mark key={i} className="highlight">{part}</mark> 
            : part
        )}
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: ProjectStatus }) => {
    const styles = {
      'Not started': 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      'Ongoing': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'Completed': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      'Delay': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    const icons = {
      'Not started': <Clock className="w-3 h-3" />,
      'Ongoing': <Clock className="w-3 h-3" />,
      'Completed': <CheckCircle className="w-3 h-3" />,
      'Delay': <AlertCircle className="w-3 h-3" />,
    };

    return (
      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const ProgressBar = ({ value, color = "bg-blue-500", label, subValue }: { value: number, color?: string, label?: string, subValue?: string }) => (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <div className="flex flex-col">
          {label && <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase leading-none">{label}</span>}
          {subValue && <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">{subValue}</span>}
        </div>
        <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
          {Math.min(value, 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
        <div 
          className={`h-full ${color} transition-all duration-700 ease-out`} 
          style={{ width: `${Math.min(value, 100)}%` }} 
        />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-5">Sl.No</th>
              <th className="px-6 py-5">Name of Project</th>
              <th className="px-6 py-5">ULB</th>
              <th className="px-6 py-5 min-w-[200px]">Financial Summary</th>
              <th className="px-6 py-5 min-w-[150px]">Duration</th>
              <th className="px-6 py-5 min-w-[150px]">Physical Progress</th>
              <th className="px-6 py-5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {projects.map((p) => {
              const finProgressPct = p.approvedCost > 0 ? (p.financialProgress / p.approvedCost) * 100 : 0;
              return (
                <tr key={`${p.sector}-${p.slNo}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-400 dark:text-slate-500">
                    {highlightText(p.slNo)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {highlightText(p.name)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      {highlightText(p.ulb)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                         <span className="text-slate-500">Outlay: ₹{p.approvedCost.toLocaleString()} L</span>
                         <span className="text-indigo-600 dark:text-indigo-400">Spent: ₹{p.financialProgress.toLocaleString()} L</span>
                      </div>
                      <ProgressBar 
                        value={finProgressPct} 
                        color="bg-indigo-500" 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-emerald-500" />
                        <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">{p.commencementDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-rose-500" />
                        <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">{p.targetCompletionDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ProgressBar 
                      value={p.physicalProgress} 
                      color="bg-emerald-500" 
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {projects.map((p) => {
          const finProgressPct = p.approvedCost > 0 ? (p.financialProgress / p.approvedCost) * 100 : 0;
          return (
            <div key={`${p.sector}-${p.slNo}`} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Project #{highlightText(p.slNo)}</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    {highlightText(p.ulb)}
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {highlightText(p.name)}
              </h4>
              
              <div className="space-y-5">
                <ProgressBar 
                  value={finProgressPct} 
                  color="bg-indigo-500" 
                  label="Financial Progress"
                  subValue={`Spent ₹${p.financialProgress} of ₹${p.approvedCost} L`}
                />
                
                <ProgressBar 
                  value={p.physicalProgress} 
                  color="bg-emerald-500" 
                  label="Physical Execution" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <p className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider mb-1">Start Date</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.commencementDate}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider mb-1">Target Date</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.targetCompletionDate}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
           <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-slate-400 dark:text-slate-500" />
           </div>
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No results found</h3>
           <p className="text-sm text-slate-500 dark:text-slate-400 px-4">The search term "{searchTerm}" did not match any projects.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;
