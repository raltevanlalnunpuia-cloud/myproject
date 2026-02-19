
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Project, DashboardStats, ProjectStatus } from '../types';
import { CheckCircle, Layers, DollarSign, Download, CreditCard, Activity } from 'lucide-react';

interface Props {
  projects: Project[];
}

const COLORS = {
  'Not started': '#94a3b8',
  'Ongoing': '#3b82f6',
  'Completed': '#22c55e',
  'Delay': '#ef4444',
};

const DashboardOverview: React.FC<Props> = ({ projects }) => {
  const stats: DashboardStats = React.useMemo(() => {
    const s: DashboardStats = {
      totalProjects: projects.length,
      totalApprovedCost: 0,
      totalReceived: 0,
      totalSpent: 0,
      statusCounts: { 'Not started': 0, 'Ongoing': 0, 'Completed': 0, 'Delay': 0 },
      sectorStats: {},
    };

    projects.forEach(p => {
      s.totalApprovedCost += p.approvedCost;
      s.totalReceived += p.receivedAmount;
      s.totalSpent += p.financialProgress;
      s.statusCounts[p.status]++;

      if (!s.sectorStats[p.sector]) {
        s.sectorStats[p.sector] = { allocated: 0, spent: 0 };
      }
      s.sectorStats[p.sector].allocated += p.approvedCost;
      s.sectorStats[p.sector].spent += p.financialProgress;
    });

    return s;
  }, [projects]);

  const barData = Object.entries(stats.sectorStats).map(([name, val]) => ({
    name: name.split(' ')[0], // Short name for charts
    fullName: name,
    allocated: Number(val.allocated.toFixed(2)),
    spent: Number(val.spent.toFixed(2)),
  }));

  const pieData = Object.entries(stats.statusCounts).map(([name, value]) => ({
    name,
    value,
  })).filter(d => d.value > 0);

  const StatCard = ({ icon: Icon, label, value, color, prefix = "" }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-start gap-4 transition-all hover:shadow-md">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 leading-none">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
          {prefix}{typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : value}
          {prefix && value !== 0 && <span className="text-[10px] font-bold text-slate-400 ml-1">L</span>}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Layers} label="Total Projects" value={stats.totalProjects} color="bg-blue-600" />
        <StatCard icon={DollarSign} label="Approved Cost" value={stats.totalApprovedCost} prefix="₹" color="bg-emerald-600" />
        <StatCard icon={Download} label="Received" value={stats.totalReceived} prefix="₹" color="bg-amber-600" />
        <StatCard icon={CreditCard} label="Expenditure" value={stats.totalSpent} prefix="₹" color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-l-4 border-slate-400 dark:border-slate-600 shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Not Started</p>
          <p className="text-xl font-black text-slate-800 dark:text-slate-100">{stats.statusCounts['Not started']}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-l-4 border-blue-500 shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ongoing</p>
          <p className="text-xl font-black text-slate-800 dark:text-slate-100">{stats.statusCounts['Ongoing']}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-l-4 border-green-500 shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Completed</p>
          <p className="text-xl font-black text-slate-800 dark:text-slate-100">{stats.statusCounts['Completed']}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-l-4 border-red-500 shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Delayed</p>
          <p className="text-xl font-black text-slate-800 dark:text-slate-100">{stats.statusCounts['Delay']}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex flex-col">
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 uppercase tracking-tight">
                <Activity className="w-5 h-5 text-blue-600" />
                Sector Analysis
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase ml-7">Allocated vs Spent (Lakhs)</p>
            </div>
          </div>
          <div className="h-[350px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={barData} 
                margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  style={{ fontSize: '9px', fontWeight: '800' }}
                  tick={{ fill: 'currentColor' }}
                  axisLine={{ stroke: '#e2e8f0', opacity: 0.3 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis 
                  style={{ fontSize: '9px', fontWeight: '700' }} 
                  tick={{ fill: 'currentColor' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', opacity: 0.1 }} 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    backgroundColor: '#1e293b',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '11px',
                    color: '#fff',
                    zIndex: 100
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="center"
                  height={40} 
                  iconType="circle"
                  wrapperStyle={{ 
                    fontSize: '9px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase',
                    paddingBottom: '10px'
                  }}
                />
                <Bar 
                  dataKey="allocated" 
                  fill="#3b82f6" 
                  radius={[3, 3, 0, 0]} 
                  name="Allocated" 
                  maxBarSize={30}
                />
                <Bar 
                  dataKey="spent" 
                  fill="#10b981" 
                  radius={[3, 3, 0, 0]} 
                  name="Spent" 
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-2 uppercase tracking-tight">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Project Progress
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as ProjectStatus]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none',
                    backgroundColor: '#1e293b',
                    fontSize: '11px',
                    color: '#fff',
                    zIndex: 100
                  }} 
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  wrapperStyle={{ 
                    fontSize: '9px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase',
                    paddingTop: '20px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
