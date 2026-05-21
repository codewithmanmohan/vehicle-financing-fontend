import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, MapPin, Briefcase, IndianRupee, Save, Loader2, ShieldCheck } from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';
import { useAuth } from '../../hooks/useAuth';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
  }),
  employmentType: z.enum(['salaried', 'self-employed', 'business', 'student', 'other']),
  monthlyIncome: z.number().min(0, 'Monthly income must be positive'),
  aadhaarNumber: z.string().regex(/^[0-9]{12}$/, 'Aadhaar must be 12 digits'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
});

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        reset({
          name: data.name,
          phone: data.phone,
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            zipCode: data.address?.zipCode || '',
          },
          employmentType: data.employmentType || 'salaried',
          monthlyIncome: data.monthlyIncome || 0,
          aadhaarNumber: data.aadhaarNumber || '',
          panNumber: data.panNumber || '',
        });
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setSuccessMessage('');
      setErrorMessage('');
      await api.put('/auth/profile', data);
      await checkAuth(); // Refresh user in context
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Update profile error:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <AnimatedPage>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-playfair text-white">Account Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your personal information and documents.</p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {successMessage && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-center font-medium animate-pulse">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* Personal Info Section */}
          <div className="glass p-6 md:p-8 rounded-2xl border border-border/30">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-white">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input {...register('name')} className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Work Email (Cannot be changed)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input value={user?.email} disabled className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/50 rounded-xl text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input {...register('phone')} className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50" />
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Documents & Finance Section */}
          <div className="glass p-6 md:p-8 rounded-2xl border border-border/30">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-white">Identity & Employment</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Aadhaar Number (12 digits)</label>
                <input {...register('aadhaarNumber')} className="w-full px-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50" placeholder="1234 5678 9012" />
                {errors.aadhaarNumber && <p className="text-xs text-red-500">{errors.aadhaarNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">PAN Number</label>
                <input {...register('panNumber')} className="w-full px-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50 uppercase" placeholder="ABCDE1234F" />
                {errors.panNumber && <p className="text-xs text-red-500">{errors.panNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Employment Type</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select {...register('employmentType')} className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50 appearance-none">
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business">Business</option>
                    <option value="student">Student</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Monthly Income (INR)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="number" 
                    {...register('monthlyIncome', { valueAsNumber: true })} 
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
                {errors.monthlyIncome && <p className="text-xs text-red-500">{errors.monthlyIncome.message}</p>}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="glass p-6 md:p-8 rounded-2xl border border-border/30">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-white">Current Address</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-400">Street Address</label>
                <input {...register('address.street')} className="w-full px-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                {errors.address?.street && <p className="text-xs text-red-500">{errors.address.street.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">City</label>
                <input {...register('address.city')} className="w-full px-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                {errors.address?.city && <p className="text-xs text-red-500">{errors.address.city.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">State</label>
                <input {...register('address.state')} className="w-full px-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                {errors.address?.state && <p className="text-xs text-red-500">{errors.address.state.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Zip Code</label>
                <input {...register('address.zipCode')} className="w-full px-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                {errors.address?.zipCode && <p className="text-xs text-red-500">{errors.address.zipCode.message}</p>}
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="glass p-6 md:p-8 rounded-2xl border border-border/30">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-white">Account Security</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">Leave blank if you don't want to change your password.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">New Password</label>
                  <input 
                    type="password" 
                    {...register('password')} 
                    className="w-full px-4 py-2.5 bg-card border border-border/50 rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none" 
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AnimatedPage>
  );
};

export default Profile;
