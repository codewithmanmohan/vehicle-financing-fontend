import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle2, XCircle, Clock, FileText, ChevronRight, X } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/admin/applications');
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.userId?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    return status ? status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';
  };

  const handleStatusUpdate = async (status) => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/applications/${selectedApp._id}/status`, {
        status,
        message: actionMessage || `Application ${getStatusText(status).toLowerCase()}`,
        rejectionReason: status === 'rejected' ? actionMessage : undefined
      });
      
      // Update local state for real-time feel
      setApplications(applications.map(app => 
        app._id === selectedApp._id 
          ? { ...app, status } 
          : app
      ));
      
      setIsModalOpen(false);
      setSelectedApp(null);
      setActionMessage('');
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
    setActionMessage('');
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <AnimatedPage>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-playfair text-white">Application Manager</h1>
          <p className="text-muted-foreground mt-2">Review and process vehicle financing applications in real-time.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border/50 rounded-lg text-white text-sm outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="documents_required">Docs Required</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white text-sm w-full md:w-64 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/40 text-gray-300 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-5">App ID / Date</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Vehicle</th>
                <th className="px-6 py-5">Loan Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredApplications.map((app) => (
                <tr key={app._id} className="hover:bg-white/[0.03] transition-colors group cursor-pointer" onClick={() => openModal(app)}>
                  <td className="px-6 py-4">
                    <div className="font-mono text-white mb-1">#{app._id.slice(-8).toUpperCase()}</div>
                    <div className="text-[10px] uppercase font-bold text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-bold mb-1">{app.userId?.name}</div>
                    <div className="text-xs font-mono text-gray-500">{app.userId?.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium mb-1">{app.vehicleId?.make} {app.vehicleId?.model}</div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-tighter">{app.applicationType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-primary font-bold font-mono mb-1">{formatCurrency(app.loanAmount)}</div>
                    <div className="text-[10px] text-gray-500 font-bold">{app.tenure} MONTHS @ 8.5%</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(app.status)}`}>
                      {getStatusText(app.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2.5 bg-card border border-border rounded-xl text-white group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all shadow-lg">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail/Review Modal */}
      <AnimatePresence>
        {isModalOpen && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/30 bg-black/20 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold font-playfair text-white">Review Application</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">ID: {selectedApp._id}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2 border-b border-border/30 pb-2">Customer Profile</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Name</p><p className="font-medium text-white">{selectedApp.userId?.name}</p></div>
                      <div><p className="text-muted-foreground">Email</p><p className="font-medium text-white">{selectedApp.userId?.email}</p></div>
                      <div><p className="text-muted-foreground">Phone</p><p className="font-medium text-white">{selectedApp.userId?.phone}</p></div>
                      <div><p className="text-muted-foreground">Emp. Type</p><p className="font-medium text-white capitalize">{selectedApp.employmentDetails?.employmentType}</p></div>
                      <div><p className="text-muted-foreground">Company</p><p className="font-medium text-white">{selectedApp.employmentDetails?.companyName || 'N/A'}</p></div>
                      <div><p className="text-muted-foreground">Income</p><p className="font-medium text-white font-mono">{formatCurrency(selectedApp.employmentDetails?.monthlyIncome)}</p></div>
                    </div>
                  </div>

                  {/* Loan Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2 border-b border-border/30 pb-2">Loan Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Vehicle</p><p className="font-medium text-white">{selectedApp.vehicleId?.make} {selectedApp.vehicleId?.model}</p></div>
                      <div><p className="text-muted-foreground">Type</p><p className="font-medium text-white uppercase">{selectedApp.applicationType}</p></div>
                      <div><p className="text-muted-foreground">Loan Amount</p><p className="font-bold text-primary font-mono">{formatCurrency(selectedApp.loanAmount)}</p></div>
                      <div><p className="text-muted-foreground">Down Payment</p><p className="font-medium text-white font-mono">{formatCurrency(selectedApp.downPayment)}</p></div>
                      <div><p className="text-muted-foreground">Tenure</p><p className="font-medium text-white">{selectedApp.tenure} Months</p></div>
                      <div><p className="text-muted-foreground">EMI</p><p className="font-bold text-primary font-mono">{formatCurrency(selectedApp.emiAmount)}</p></div>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-black/20 rounded-xl p-6 border border-border/30">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Current Status</h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold border mb-6 ${getStatusColor(selectedApp.status)}`}>
                    {getStatusText(selectedApp.status)}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-border/30 bg-black/40 shrink-0">
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-300 block mb-2">Remarks / Message to Customer</label>
                  <textarea 
                    value={actionMessage}
                    onChange={(e) => setActionMessage(e.target.value)}
                    className="w-full bg-card border border-border/50 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                    placeholder="Enter approval conditions, rejection reason, or required documents..."
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={actionLoading || selectedApp.status === 'approved'}
                    className="flex-1 py-3 bg-green-500/20 text-green-500 border border-green-500/50 hover:bg-green-500/30 font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate('documents_required')}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-orange-500/20 text-orange-500 border border-orange-500/50 hover:bg-orange-500/30 font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Request Docs
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={actionLoading || selectedApp.status === 'rejected'}
                    className="flex-1 py-3 bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AnimatedPage>
  );
};

export default ApplicationManager;
