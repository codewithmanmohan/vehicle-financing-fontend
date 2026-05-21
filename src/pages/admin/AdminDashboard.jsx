import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, CheckCircle, XCircle, Clock, IndianRupee } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!stats) return <div className="text-center text-white">Error loading stats</div>;

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <Users className="w-6 h-6 text-blue-500" />, color: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Total Applications', value: stats.totalApplications, icon: <FileText className="w-6 h-6 text-purple-500" />, color: 'bg-purple-500/10 border-purple-500/20' },
    { title: 'Pending Review', value: stats.pendingCount, icon: <Clock className="w-6 h-6 text-yellow-500" />, color: 'bg-yellow-500/10 border-yellow-500/20' },
    { title: 'Approved', value: stats.approvedCount, icon: <CheckCircle className="w-6 h-6 text-green-500" />, color: 'bg-green-500/10 border-green-500/20' },
    { title: 'Rejected', value: stats.rejectedCount, icon: <XCircle className="w-6 h-6 text-red-500" />, color: 'bg-red-500/10 border-red-500/20' },
    { title: 'Total Disbursed', value: formatCurrency(stats.totalLoanValue), icon: <IndianRupee className="w-6 h-6 text-primary" />, color: 'bg-primary/10 border-primary/20' },
  ];

  const pieData = [
    { name: 'Approved', value: stats.approvedCount, color: '#10B981' },
    { name: 'Rejected', value: stats.rejectedCount, color: '#EF4444' },
    { name: 'Pending', value: stats.pendingCount, color: '#F59E0B' },
  ];

  return (
    <AnimatedPage>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-playfair text-white">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Platform overview and key performance indicators.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass p-6 rounded-2xl border ${card.color} transition-colors`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl bg-card border ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <h3 className="text-2xl font-bold text-white font-mono">{card.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications Trend */}
        <div className="glass p-6 rounded-2xl border border-border/30 h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Applications Trend (Last 6 Months)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="applications" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass p-6 rounded-2xl border border-border/30 h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Approval Ratio (Last 6 Months)</h3>
          <div className="flex-1 w-full flex">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col justify-center space-y-4">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm text-gray-300">{item.name}</p>
                    <p className="font-bold text-white font-mono">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AdminDashboard;
