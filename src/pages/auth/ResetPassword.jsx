import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await api.put(`/auth/resetpassword/${token}`, { password: data.password });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to reset password');
    }
  };

  if (isSuccess) {
    return (
      <AnimatedPage className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md glass p-10 rounded-3xl border border-border/30 text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white font-playfair">Success!</h1>
          <p className="text-muted-foreground">
            Your password has been reset successfully. Redirecting you to login...
          </p>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white font-playfair">Reset Password</h1>
          <p className="text-muted-foreground mt-2">Create a new, strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                {...register('password')}
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-3 bg-card border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-gray-500 transition-colors"
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                {...register('confirmPassword')}
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-3 bg-card border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-gray-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      </div>
    </AnimatedPage>
  );
};

export default ResetPassword;
