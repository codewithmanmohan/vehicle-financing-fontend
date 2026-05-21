import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, Calculator } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeApplications: 0,
    totalLoanAmount: 0,
    latestStatus: null,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/applications/my');
        
        const activeApps = data.filter(app => !['rejected', 'disbursed'].includes(app.status));
        const totalLoan = activeApps.reduce((sum, app) => sum + (app.loanAmount || 0), 0);
        
        setStats({
          activeApplications: activeApps.length,
          totalLoanAmount: totalLoan,
          latestStatus: data.length > 0 ? data[0].status : null,
        });
        
        setRecentApplications(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'under_review': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'documents_required': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'disbursed': return 'text-teal-500 bg-teal-500/10 border-teal-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusText = (status) => {
    return status ? status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'No Applications';
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <AnimatedPage>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-playfair text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your financing journey.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Applications</p>
              <h3 className="text-2xl font-bold text-white">{stats.activeApplications}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Latest Status</p>
              <div className={`mt-1 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(stats.latestStatus)}`}>
                {getStatusText(stats.latestStatus)}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requested Loan Value</p>
              <h3 className="text-2xl font-bold text-white font-mono">{formatCurrency(stats.totalLoanAmount)}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Applications</h2>
            <Link to="/dashboard/applications" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="glass p-12 rounded-2xl text-center border border-border/30">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6">Start your journey by exploring our vehicle gallery.</p>
              <Link to="/vehicles" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
                Browse Vehicles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app._id} className="glass p-4 sm:p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-card overflow-hidden shrink-0">
                      {app.vehicleId?.images?.[0] ? (
                        <img src={app.vehicleId.images[0].url} alt="Vehicle" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-card border border-border/50">
                          <Car className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{app.vehicleId?.make} {app.vehicleId?.model}</h4>
                      <p className="text-sm text-muted-foreground">Loan: {formatCurrency(app.loanAmount)} • {app.tenure} Months</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {getStatusText(app.status)}
                    </div>
                    <Link to="/dashboard/applications" className="text-sm text-primary hover:text-primary/80 transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          
          <Link to="/vehicles" className="block p-6 glass rounded-2xl border border-border/30 hover:border-primary/50 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Apply for Financing</h3>
                <p className="text-sm text-muted-foreground">Find a vehicle and apply</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-border">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          <Link to="/emi" className="block p-6 glass rounded-2xl border border-border/30 hover:border-primary/50 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">EMI Calculator</h3>
                <p className="text-sm text-muted-foreground">Plan your monthly budget</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors border border-border text-white">
                <Calculator className="w-5 h-5" />
              </div>
            </div>
          </Link>

          <div className="p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-500 font-medium mb-1">Complete your Profile</h4>
                <p className="text-sm text-amber-500/80 mb-3">Add your employment details and PAN for faster approvals.</p>
                <Link 
                  to="/dashboard/profile"
                  className="inline-block text-xs font-bold px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 rounded-lg transition-colors"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
