import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { CarFront, Loader2, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import { useAuth } from '../../hooks/useAuth';

import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const Login = () => {
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
      const user = await login(data.email, data.password);
      toast.success('Welcome back! Login successful.');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <AnimatedPage className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative bg-card overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        <div className="relative z-10 p-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CarFront className="w-20 h-20 text-primary mx-auto mb-8" />
            <h2 className="text-4xl font-playfair font-bold text-white mb-4">Welcome Back</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Access your DriveEase dashboard to track applications, calculate EMI, and explore new vehicles.
            </p>
          </motion.div>
        </div>

        {/* Abstract Geometry */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-600/20 rounded-full blur-[100px]" />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 text-primary hover:text-primary/80 transition-colors group font-medium">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white font-playfair">Sign In</h1>
            <p className="text-muted-foreground mt-2">Enter your email and password to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-gray-500 transition-colors"
                placeholder="name@example.com"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
              </div>
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
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Login;
