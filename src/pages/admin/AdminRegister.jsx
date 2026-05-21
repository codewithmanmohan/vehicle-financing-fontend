import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { ShieldAlert, Loader2, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';

const adminRegisterSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  adminSecret: z.string().min(1, 'Admin secret key is required'),
});

const AdminRegister = () => {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminRegisterSchema),
  });

  const onSubmit = async (data) => {
    // In a real project, adminSecret would be verified on backend
    // For now we use the separate admin register endpoint
    try {
      setServerError('');
      await api.post('/auth/admin/register', data);
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 3000);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to register admin');
    }
  };

  return (
    <AnimatedPage className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-primary hover:text-primary/80 transition-colors group font-medium">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        <div className="text-center mb-8">
          <ShieldAlert className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white font-playfair">Admin Registration</h1>
          <p className="text-muted-foreground mt-2">Create a new administrator account</p>
        </div>

        <div className="glass p-8 rounded-2xl border border-border/30">
          {success ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white">Admin Created!</h2>
              <p className="text-muted-foreground">Redirecting to admin login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center">
                  {serverError}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input {...register('name')} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg text-white" />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Work Email</label>
                <input {...register('email')} type="email" className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg text-white" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</label>
                <input {...register('phone')} className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg text-white" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input 
                    {...register('password')} 
                    type={showPassword ? "text" : "password"} 
                    className="w-full mt-1 px-4 py-3 bg-card border border-border/50 rounded-lg text-white pr-12" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[calc(50%+2px)] -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-primary uppercase tracking-wider">Admin Secret Key</label>
                <input {...register('adminSecret')} type="password" placeholder="System Authorization Key" className="w-full mt-1 px-4 py-3 bg-primary/5 border border-primary/30 rounded-lg text-white" />
                {errors.adminSecret && <p className="text-xs text-destructive mt-1">{errors.adminSecret.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Administrator'}
              </button>
            </form>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/admin/login" className="text-sm text-gray-400 hover:text-primary transition-colors font-medium">
            Back to Admin Login
          </Link>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AdminRegister;
