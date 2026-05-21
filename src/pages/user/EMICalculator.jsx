import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Loader2, IndianRupee, Calendar, Percent, Info, 
  ArrowRight, CheckCircle2, AlertCircle, TrendingUp,
  X, ShieldCheck, Zap
} from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const EMICalculator = () => {
  const { user } = useAuth();
  const [inputs, setInputs] = useState({
    vehiclePrice: 1200000,
    downPaymentPct: 20,
    interestRate: 8.5,
    tenure: 60, // months
    calculationType: 'loan', // 'loan' or 'lease'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  // Derived state
  const downPaymentAmt = Math.round((inputs.vehiclePrice * inputs.downPaymentPct) / 100);
  const loanAmount = inputs.vehiclePrice - downPaymentAmt;

  const handleCalculate = async () => {
    setLoading(true);
    try {
      if (inputs.calculationType === 'lease') {
        const { data } = await api.post('/emi/lease-calculate', {
          vehiclePrice: inputs.vehiclePrice,
          tenure: inputs.tenure
        });
        setResult({
          ...data,
          emi: data.monthlyRental,
          totalPayable: data.totalLeaseCost,
          totalInterest: data.gst * inputs.tenure,
          principal: data.baseRental * inputs.tenure,
          residualValue: data.residualValue
        });
      } else {
        const { data } = await api.post('/emi/calculate', {
          principal: loanAmount,
          rate: inputs.interestRate,
          tenure: inputs.tenure
        });
        setResult(data);
      }
    } catch (error) {
      console.error("Failed to calculate", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async () => {
    if (!user) {
      alert("Please login to check eligibility");
      return;
    }
    setCheckingEligibility(true);
    try {
      const { data } = await api.post('/api/check/eligibility', {
        amount: isLease ? inputs.vehiclePrice : loanAmount,
        tenure: inputs.tenure,
        monthlyIncome: user.monthlyIncome || 50000,
        employmentType: user.employmentType || 'salaried'
      });
      setEligibilityResult(data);
      setShowEligibilityModal(true);
    } catch (error) {
      console.error("Eligibility check failed", error);
    } finally {
      setCheckingEligibility(false);
    }
  };

  // Auto-calculate on input change
  useEffect(() => {
    const timer = setTimeout(handleCalculate, 500);
    return () => clearTimeout(timer);
  }, [inputs]);

  const isLease = inputs.calculationType === 'lease';
  
  const chartData = result ? (
    isLease 
      ? [
          { name: 'Depreciation & Interest', value: result.principal },
          { name: 'GST (28%)', value: result.totalInterest },
        ]
      : [
          { name: 'Principal Amount', value: result.principal },
          { name: 'Total Interest', value: result.totalInterest },
        ]
  ) : [];

  const COLORS = isLease ? ['#3B82F6', '#10B981'] : ['#F59E0B', '#6366F1'];

  return (
    <AnimatedPage>
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold font-playfair text-white">Finance Planner</h1>
        <p className="text-muted-foreground mt-2 text-lg">Compare smart ownership via Loans vs. flexible Leasing.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Input Panel */}
        <div className="xl:col-span-5 space-y-8">
          <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
            
            {/* Type Selector */}
            <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5">
              {['loan', 'lease'].map((type) => (
                <button
                  key={type}
                  onClick={() => setInputs({...inputs, calculationType: type})}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all capitalize flex items-center justify-center gap-2 ${
                    inputs.calculationType === type 
                      ? 'bg-primary text-primary-foreground shadow-xl' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {type === 'loan' ? 'Traditional Loan' : 'Smart Lease'}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {/* Vehicle Price */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" /> Vehicle Price (Ex-Showroom)
                  </label>
                  <span className="text-xl font-bold text-white font-mono">{formatCurrency(inputs.vehiclePrice)}</span>
                </div>
                <input 
                  type="range" min="300000" max="10000000" step="50000"
                  value={inputs.vehiclePrice}
                  onChange={(e) => setInputs({...inputs, vehiclePrice: Number(e.target.value)})}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <AnimatePresence mode="wait">
                {!isLease ? (
                  <motion.div 
                    key="loan-inputs"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 overflow-hidden"
                  >
                    {/* Down Payment */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Down Payment ({inputs.downPaymentPct}%)
                        </label>
                        <span className="text-xl font-bold text-white font-mono">{formatCurrency(downPaymentAmt)}</span>
                      </div>
                      <input 
                        type="range" min="0" max="80" step="5"
                        value={inputs.downPaymentPct}
                        onChange={(e) => setInputs({...inputs, downPaymentPct: Number(e.target.value)})}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                          <Percent className="w-4 h-4" /> Annual Interest Rate
                        </label>
                        <span className="text-xl font-bold text-white font-mono">{inputs.interestRate}%</span>
                      </div>
                      <input 
                        type="range" min="7" max="18" step="0.1"
                        value={inputs.interestRate}
                        onChange={(e) => setInputs({...inputs, interestRate: Number(e.target.value)})}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="lease-info"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl"
                  >
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-200">
                        Leasing requires **Zero Down Payment**. Monthly rentals include GST and offer significant tax benefits for corporate professionals.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tenure */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Tenure (Months)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[12, 24, 36, 48, 60, 84].map((t) => (
                    <button
                      key={t}
                      onClick={() => setInputs({...inputs, tenure: t})}
                      className={`py-2 rounded-xl text-sm font-bold transition-all border ${
                        inputs.tenure === t 
                          ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                          : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-7 space-y-8">
          {result ? (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl border border-white/10 h-full flex flex-col"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-white/5 mb-8">
                <div className="text-center md:text-left">
                  <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">
                    {isLease ? 'Monthly Rental' : 'Monthly EMI'}
                  </p>
                  <h2 className="text-6xl font-bold text-white font-mono">
                    {formatCurrency(result.emi)}
                  </h2>
                </div>
                <div className="h-32 w-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total Outflow</p>
                    <p className="text-2xl font-bold text-white font-mono">{formatCurrency(result.totalPayable)}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[0] }} /> 
                        {isLease ? 'Base Usage Cost' : 'Principal Loan'}
                      </span>
                      <span className="font-bold text-white">{formatCurrency(result.principal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[1] }} /> 
                        {isLease ? 'Total GST (28%)' : 'Total Interest'}
                      </span>
                      <span className="font-bold text-white">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    {isLease && (
                      <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                        <span className="text-gray-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" /> Residual Value (Buyback)
                        </span>
                        <span className="font-bold text-green-400">{formatCurrency(result.residualValue)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" /> Key Advantages
                    </h4>
                    <ul className="space-y-3">
                      {(isLease ? [
                        'Zero Upfront Down Payment',
                        'Tax deduction up to 30%',
                        'Hassle-free upgrades',
                        'Insurance included (Optional)'
                      ] : [
                        'Complete Ownership from Day 1',
                        'Unlimited Kilometers usage',
                        'Build Asset Equity over time',
                        'Lower total cost if kept long-term'
                      ]).map((item, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={handleCheckEligibility}
                    disabled={checkingEligibility}
                    className="w-full mt-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {checkingEligibility ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Check Eligibility <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full glass rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center p-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-400">Loading your customized financial plan...</p>
            </div>
          )}
        </div>
      </div>

      {/* Eligibility Modal */}
      <AnimatePresence>
        {showEligibilityModal && eligibilityResult && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-lg w-full rounded-3xl border border-white/10 p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowEligibilityModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${eligibilityResult.eligible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {eligibilityResult.eligible ? <ShieldCheck className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{eligibilityResult.message}</h3>
                <p className="text-gray-400">Based on your monthly income of {formatCurrency(user.monthlyIncome)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Credit Score</p>
                  <p className="text-2xl font-bold text-primary font-mono">{eligibilityResult.score}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Approval Prob.</p>
                  <p className="text-2xl font-bold text-green-400 font-mono">{eligibilityResult.probability}%</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Income to EMI Ratio</span>
                  <span className={`font-bold ${eligibilityResult.foir > 50 ? 'text-red-400' : 'text-green-400'}`}>{eligibilityResult.foir}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${eligibilityResult.foir}%` }}
                    className={`h-full ${eligibilityResult.foir > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                  />
                </div>
              </div>

              {eligibilityResult.reasons.length > 0 && (
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 mb-8">
                  <p className="text-xs font-bold text-red-400 uppercase mb-2">Key Insights</p>
                  <ul className="space-y-2">
                    {eligibilityResult.reasons.map((reason, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-sm text-gray-300 mb-1">Maximum Eligible Loan Amount</p>
                <p className="text-3xl font-bold text-white font-mono">{formatCurrency(eligibilityResult.maxEligibleAmount)}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default EMICalculator;
