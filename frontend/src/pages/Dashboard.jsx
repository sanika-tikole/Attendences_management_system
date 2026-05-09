import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_employees: 0,
    today_attendance: 0,
    recent_records: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/recognition/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const data = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 8 },
    { name: 'Fri', count: 6 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="glass-card p-6 glass-card-hover group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2 font-['Outfit']">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white font-['Outfit'] tracking-tight">System Intelligence</h2>
          <p className="text-slate-400 mt-1 text-sm font-medium">Real-time biometric monitoring and analytics.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live System Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Personnel"
          value={stats.total_employees}
          icon={Users}
          color="bg-primary/10 text-primary border border-primary/20"
          trend="+2.5% this month"
        />
        <StatCard
          title="Today's Turnout"
          value={stats.today_attendance}
          icon={UserCheck}
          color="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          trend="Above average"
        />
        <StatCard
          title="Efficiency Rate"
          value={stats.total_employees ? `${Math.round((stats.today_attendance / stats.total_employees) * 100)}%` : '0%'}
          icon={TrendingUp}
          color="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
        <StatCard
          title="Security Status"
          value="Encrypted"
          icon={AlertCircle}
          color="bg-purple-500/10 text-purple-400 border border-purple-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 bg-gradient-to-br from-surface-900 to-surface-950">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white font-['Outfit']">Attendance Trends</h3>
            <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 7 Days</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 700 }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white font-['Outfit']">Recent Activity</h3>
            <Clock className="w-5 h-5 text-slate-500" />
          </div>
          <div className="space-y-6">
            {stats.recent_records.length > 0 ? (
              stats.recent_records.map((record, index) => (
                <div key={index} className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                    {record.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{record.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{record.time}</p>
                  </div>
                  <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">
                    IN
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3 opacity-20" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No Activity Today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
