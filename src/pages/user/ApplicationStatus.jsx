import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await api.get('/applications/my');
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusInfo = (status) => {
    switch(status) {
      case 'submitted': return { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: <FileText className="w-5 h-5 text-yellow-500" /> };
      case 'under_review': return { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <Clock className="w-5 h-5 text-blue-500" /> };
      case 'documents_required': return { color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', icon: <AlertCircle className="w-5 h-5 text-orange-500" /> };
      case 'approved': return { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> };
      case 'rejected': return { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: <XCircle className="w-5 h-5 text-red-500" /> };
      case 'disbursed': return { color: 'text-teal-500 bg-teal-500/10 border-teal-500/20', icon: <CheckCircle2 className="w-5 h-5 text-teal-500" /> };
      default: return { color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', icon: <FileText className="w-5 h-5 text-gray-500" /> };
    }
  };

  const getStatusText = (status) => {
    return status ? status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <AnimatedPage>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-playfair text-white">My Applications</h1>
        <p className="text-muted-foreground mt-2">Track the status of your financing applications.</p>
      </div>

      {applications.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center border border-border/30">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-6">You haven't applied for any financing yet.</p>
          <Link to="/dashboard/vehicles" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app, index) => {
            const statusInfo = getStatusInfo(app.status);
            
            return (
              <motion.div 
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl border border-border/30 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-border/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/20">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1">APP ID: {app._id.slice(-8).toUpperCase()}</p>
                    <h3 className="text-xl font-bold text-white">
                      {app.vehicleId ? `${app.vehicleId.make} ${app.vehicleId.model}` : 'Vehicle Details Unavailable'}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {getStatusText(app.status)}
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Loan Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Loan Amount</p>
                        <p className="font-bold text-white font-mono">{formatCurrency(app.loanAmount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Tenure</p>
                        <p className="font-bold text-white">{app.tenure} Months</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">EMI</p>
                        <p className="font-bold text-primary font-mono">{formatCurrency(app.emiAmount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Interest Rate</p>
                        <p className="font-bold text-white">{app.interestRate}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Application History</h4>
                    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
                      {app.statusTimeline?.map((timelineItem, i) => {
                        const itemStatus = getStatusInfo(timelineItem.status);
                        return (
                          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6 last:pb-0">
                            {/* Icon */}
                            <div className={`flex items-center justify-center w-5 h-5 rounded-full border border-border/50 bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 ${i === app.statusTimeline.length - 1 ? 'ring-2 ring-primary bg-primary' : ''}`}>
                              {i === app.statusTimeline.length - 1 ? <div className="w-2 h-2 rounded-full bg-black"></div> : null}
                            </div>
                            
                            {/* Card */}
                            <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-border/30 bg-black/20 shadow">
                              <div className="flex items-center justify-between mb-1">
                                <div className={`font-bold text-sm ${itemStatus.color.split(' ')[0]}`}>{getStatusText(timelineItem.status)}</div>
                                <time className="text-xs font-mono text-muted-foreground">{new Date(timelineItem.timestamp).toLocaleDateString()}</time>
                              </div>
                              <div className="text-xs text-gray-400">{timelineItem.message}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer action if applicable */}
                {app.status === 'rejected' && app.rejectionReason && (
                  <div className="bg-red-500/10 border-t border-red-500/20 p-4">
                    <p className="text-sm text-red-400"><strong className="font-semibold">Reason for rejection:</strong> {app.rejectionReason}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatedPage>
  );
};

export default ApplicationStatus;
