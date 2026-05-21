import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CarFront, Loader2, ChevronRight, ChevronLeft, Check, Eye, EyeOff } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import { useAuth } from '../../hooks/useAuth';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Validation schemas for multi-step
const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be exactly 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const step2Schema = z.object({
  employmentType: z.enum(['salaried', 'self-employed', 'business'], { required_error: 'Please select employment type' }),
  monthlyIncome: z.coerce.number().min(10000, 'Minimum income must be ₹10,000'),
  city: z.string().min(2, 'City is required'),
});

const step3Schema = z.object({
  aadhaarNumber: z.string().regex(/^[0-9]{12}$/, 'Must be exactly 12 digits'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
});

import { toast } from 'sonner';

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  // Determine current schema
  const currentSchema = step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema;

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    getValues
  } = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onChange'
  });

  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setStep((prev) => prev + 1);
    } else {
      toast.error('Please fix the errors in this step');
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    if (step !== 3) return;

    try {
      const formData = getValues();
      const payload = {
        ...formData,
        address: { city: formData.city }
      };
      
      await authRegister(payload);
      toast.success('Account created successfully! Welcome to DriveEase.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AnimatedPage className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative bg-card overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        <div className="relative z-10 p-12 text-center max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CarFront className="w-16 h-16 text-primary mx-auto mb-8" />
            <h2 className="text-4xl font-playfair font-bold text-white mb-6">Join DriveEase</h2>
            <div className="space-y-6 text-left">
              {[
                "Instant loan approval in 15 minutes",
                "Lowest interest rates starting at 7.9%",
                "100% digital process, zero paperwork",
                "Flexible tenure up to 84 months"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-gray-300 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 text-primary hover:text-primary/80 transition-colors group font-medium">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white font-playfair">Create Account</h1>
            <p className="text-muted-foreground mt-2">Start your vehicle financing journey</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={cn("text-xs font-medium", step >= i ? "text-primary" : "text-muted-foreground")}>
                  Step {i}
                </div>
              ))}
            </div>
            <div className="h-2 bg-card rounded-full overflow-hidden flex">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: '33%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-300">Full Name</label>
                      <input {...register('name')} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white" placeholder="John Doe" />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Email Address</label>
                      <input {...register('email')} type="email" className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white" placeholder="john@example.com" />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Phone Number</label>
                      <input {...register('phone')} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white" placeholder="9876543210" />
                      {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                    </div>
                    <div className="relative">
                      <input 
                        {...register('password')} 
                        type={showPassword ? "text" : "password"} 
                        className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white pr-12" 
                        placeholder="••••••••" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[calc(50%+2px)] -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-300">Employment Type</label>
                      <select {...register('employmentType')} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white">
                        <option value="">Select type...</option>
                        <option value="salaried">Salaried</option>
                        <option value="self-employed">Self Employed</option>
                        <option value="business">Business</option>
                      </select>
                      {errors.employmentType && <p className="text-xs text-destructive mt-1">{errors.employmentType.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Monthly Income (₹)</label>
                      <input {...register('monthlyIncome')} type="number" className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white" placeholder="50000" />
                      {errors.monthlyIncome && <p className="text-xs text-destructive mt-1">{errors.monthlyIncome.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">City</label>
                      <input {...register('city')} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white" placeholder="Mumbai" />
                      {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                      <p className="text-sm text-primary text-center">For KYC verification, please provide your document details.</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Aadhaar Number</label>
                      <input {...register('aadhaarNumber')} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white" placeholder="123456789012" />
                      {errors.aadhaarNumber && <p className="text-xs text-destructive mt-1">{errors.aadhaarNumber.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">PAN Number</label>
                      <input {...register('panNumber')} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white uppercase" placeholder="ABCDE1234F" />
                      {errors.panNumber && <p className="text-xs text-destructive mt-1">{errors.panNumber.message}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3 px-4 bg-card border border-border text-white font-medium rounded-lg hover:bg-card/80 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Register;
