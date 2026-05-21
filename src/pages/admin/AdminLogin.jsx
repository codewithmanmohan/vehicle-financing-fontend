import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const AdminLogin = () => {
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const user = await login(data.email, data.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        setServerError('Access denied. This portal is for administrators only.');
        // Optionally logout if it's not an admin
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <AnimatedPage className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-primary hover:text-primary/80 transition-colors group font-medium">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold font-playfair text-white">DriveEase<span className="text-primary">Admin</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white font-playfair">Internal Login</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage the financing platform</p>
        </div>

        <div className="glass p-8 rounded-2xl border border-border/30">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center font-medium">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Admin Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-gray-500 transition-colors"
                placeholder="admin@driveease.in"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-gray-500 transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Admin Portal'}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Unauthorized access is strictly prohibited and monitored.
        </p>
      </div>
    </AnimatedPage>
  );
};

export default AdminLogin;
