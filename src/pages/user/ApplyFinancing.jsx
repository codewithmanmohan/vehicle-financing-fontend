import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X, Loader2, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ApplyFinancing = ({ vehicle, isOpen, onClose, initialType = 'loan' }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      applicationType: initialType,
      loanAmount: vehicle?.exShowroomPrice * 0.8 || 0,
      downPayment: vehicle?.exShowroomPrice * 0.2 || 0,
      tenure: 60,
      employmentType: user?.employmentType || '',
      monthlyIncome: user?.monthlyIncome || '',
      companyName: ''
    }
  });

  // Reset form when initialType changes (e.g. user clicks Lease button)
  useEffect(() => {
    if (isOpen) {
      reset({
        applicationType: initialType,
        loanAmount: initialType === 'lease' ? 0 : vehicle?.exShowroomPrice * 0.8,
        downPayment: initialType === 'lease' ? 0 : vehicle?.exShowroomPrice * 0.2,
        tenure: 60,
        employmentType: user?.employmentType || '',
        monthlyIncome: user?.monthlyIncome || '',
        companyName: ''
      });
      setStep(1);
      setIsSuccess(false);
      setServerError('');
    }
  }, [isOpen, initialType, vehicle, reset, user]);

  const watchValues = watch();
  
  // Industry Standard Calculations (India)
  const isLease = watchValues.applicationType === 'lease';
  const n = watchValues.tenure;
  
  let calculatedAmount = 0;
  let leaseDetails = null;

  if (isLease) {
    // Leasing Algorithm (Operating Lease)
    const rvMapping = { 12: 0.75, 24: 0.60, 36: 0.48, 48: 0.38, 60: 0.30, 84: 0.20 };
    const rvFactor = rvMapping[n] || 0.4;
    const residualValue = vehicle.exShowroomPrice * rvFactor;
    const depreciationBase = vehicle.exShowroomPrice - residualValue;
    
    const interestRate = 10.5; // Average Lease IRR in India
    const monthlyRate = (interestRate / 100) / 12;
    const interestComponent = (vehicle.exShowroomPrice + residualValue) / 2 * monthlyRate;
    const depreciationComponent = depreciationBase / n;
    
    const baseRental = depreciationComponent + interestComponent;
    const gstRate = 0.28;
    calculatedAmount = Math.round(baseRental * (1 + gstRate));
    leaseDetails = { residualValue, gst: baseRental * gstRate };
  } else {
    // Standard EMI Algorithm
    const p = watchValues.loanAmount;
    const r = (8.5 / 12) / 100;
    calculatedAmount = p > 0 ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  }

  const finalAmount = Math.round(calculatedAmount);

  const onSubmit = async (data) => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setServerError('');
    
    try {
      await api.post('/applications', {
        vehicleId: vehicle._id,
        applicationType: data.applicationType,
        loanAmount: data.loanAmount,
        tenure: data.tenure,
        interestRate: 8.5,
        downPayment: data.downPayment,
        emiAmount: finalAmount,
        employmentDetails: {
          employmentType: data.employmentType,
          monthlyIncome: data.monthlyIncome,
          companyName: data.companyName
        }
      });
      
      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6']
      });
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/30 bg-black/20 shrink-0">
            <div>
              <h2 className="text-2xl font-bold font-playfair text-white">
                {isSuccess ? 'Application Submitted!' : 'Apply for Financing'}
              </h2>
              {!isSuccess && <p className="text-sm text-muted-foreground mt-1">{vehicle.make} {vehicle.model}</p>}
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center text-gray-400 hover:text-white hover:border-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Congratulations!</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  Your application has been successfully submitted. Our team will review it and get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/dashboard/applications');
                  }}
                  className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
                >
                  Track Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Progress */}
                <div className="flex items-center justify-between mb-8 relative">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border/50 -z-10" />
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                        step >= i ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border/50 text-muted-foreground'
                      }`}
                    >
                      {i}
                    </div>
                  ))}
                </div>

                {serverError && (
                  <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center">
                    {serverError}
                  </div>
                )}

                <div className="min-h-[300px]">
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <h3 className="text-lg font-bold text-white mb-4">Loan Details</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <label className={`p-4 border rounded-xl cursor-pointer transition-colors ${watchValues.applicationType === 'loan' ? 'border-primary bg-primary/10' : 'border-border/50 bg-black/20 hover:border-primary/50'}`}>
                          <input type="radio" value="loan" {...register('applicationType')} className="sr-only" />
                          <div className="font-bold text-white text-center">Auto Loan</div>
                        </label>
                        <label className={`p-4 border rounded-xl cursor-pointer transition-colors ${watchValues.applicationType === 'lease' ? 'border-primary bg-primary/10' : 'border-border/50 bg-black/20 hover:border-primary/50'}`}>
                          <input type="radio" value="lease" {...register('applicationType')} className="sr-only" disabled={!vehicle.isAvailableForLease} />
                          <div className={`font-bold text-center ${!vehicle.isAvailableForLease ? 'text-gray-500' : 'text-white'}`}>
                            Lease {!vehicle.isAvailableForLease && '(N/A)'}
                          </div>
                        </label>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-300">Loan Amount (₹)</label>
                          <input type="number" {...register('loanAmount', { valueAsNumber: true })} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white font-mono" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-300">Down Payment (₹)</label>
                          <input type="number" {...register('downPayment', { valueAsNumber: true })} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white font-mono" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-300">Tenure</label>
                          <select {...register('tenure', { valueAsNumber: true })} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white">
                            <option value={12}>12 Months</option>
                            <option value={24}>24 Months</option>
                            <option value={36}>36 Months</option>
                            <option value={48}>48 Months</option>
                            <option value={60}>60 Months</option>
                            <option value={84}>84 Months</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <h3 className="text-lg font-bold text-white mb-4">Employment Profile</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-300">Employment Type</label>
                          <select {...register('employmentType')} required className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white">
                            <option value="">Select...</option>
                            <option value="salaried">Salaried</option>
                            <option value="self-employed">Self Employed</option>
                            <option value="business">Business Owner</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-300">Company Name</label>
                          <input type="text" {...register('companyName')} required className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white" placeholder="Current Employer" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-300">Monthly Net Income (₹)</label>
                          <input type="number" {...register('monthlyIncome', { valueAsNumber: true })} required className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white font-mono" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <h3 className="text-lg font-bold text-white mb-4">Review Summary</h3>
                      
                      <div className="bg-black/20 border border-border/30 p-4 rounded-xl space-y-4">
                        <div className="flex justify-between items-center border-b border-border/30 pb-3">
                          <span className="text-muted-foreground">Vehicle</span>
                          <span className="font-bold text-white">{vehicle.make} {vehicle.model}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-border/30 pb-3">
                          <span className="text-muted-foreground">{isLease ? 'Residual Value' : 'Loan Amount'}</span>
                          <span className="font-bold text-white font-mono">
                            {isLease ? formatCurrency(leaseDetails?.residualValue) : formatCurrency(watchValues.loanAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-border/30 pb-3">
                          <span className="text-muted-foreground">Tenure</span>
                          <span className="font-bold text-white">{watchValues.tenure} Months</span>
                        </div>
                        {isLease && (
                          <div className="flex justify-between items-center border-b border-border/30 pb-3">
                            <span className="text-muted-foreground">Incl. GST (28%)</span>
                            <span className="font-bold text-green-500 font-mono">+{formatCurrency(leaseDetails?.gst)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">{isLease ? 'Monthly Rental' : 'Est. Monthly EMI'}</span>
                          <span className="text-2xl font-bold text-primary font-mono">{formatCurrency(finalAmount)}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                        <p className="text-sm text-primary">By submitting this application, you agree to our terms and conditions and authorize us to fetch your credit report.</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-border/30">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 bg-card border border-border text-white font-medium rounded-xl hover:bg-card/80 transition-colors flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      step === 3 ? 'Submit Application' : <span className="flex items-center gap-2">Continue <ChevronRight className="w-4 h-4" /></span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplyFinancing;
