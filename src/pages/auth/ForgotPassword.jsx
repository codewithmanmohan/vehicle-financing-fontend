import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Loader2, ChevronLeft, CheckCircle2 } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await api.post('/auth/forgotpassword', data);
      setIsSubmitted(true);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to send reset email');
    }
  };

  if (isSubmitted) {
    return (
      <AnimatedPage className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md glass p-10 rounded-3xl border border-border/30 text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white font-playfair">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent a password reset link to your email address. Please follow the instructions to reset your password.
          </p>
          <Link 
            to="/login" 
            className="inline-block w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
          >
            Back to Login
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 mb-8 text-primary hover:text-primary/80 transition-colors group font-medium">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
          <h1 className="text-3xl font-bold text-white font-playfair">Forgot Password?</h1>
          <p className="text-muted-foreground mt-2">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-12 pr-4 py-3 bg-card border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-gray-500 transition-colors"
                placeholder="name@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </AnimatedPage>
  );
};

export default ForgotPassword;
