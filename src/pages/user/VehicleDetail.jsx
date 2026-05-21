import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Fuel, Calendar, Settings, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Loader2, AlertCircle, Calculator
} from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';
import ApplyFinancing from './ApplyFinancing';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(null); // null, 'loan', or 'lease'
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/vehicles/${id}`);
        setVehicle(data);
        
        // Real-time Availability Check
        const availRes = await api.get(`/check/availability/${id}`);
        setAvailability(availRes.data);
      } catch (error) {
        console.error('Failed to fetch vehicle', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  if (!vehicle) return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="text-center glass p-10 rounded-2xl border border-border">
        <h2 className="text-2xl font-bold text-white mb-4">Vehicle not found</h2>
        <Link to="/vehicles" className="text-primary hover:underline">Back to Gallery</Link>
      </div>
    </div>
  );

  const insurance = Math.round(vehicle.exShowroomPrice * 0.04);
  const rto = vehicle.onRoadPrice - vehicle.exShowroomPrice - insurance;

  return (
    <AnimatedPage>
      {/* Breadcrumbs & Availability */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
          <span>/</span>
          <span className="text-white font-medium">{vehicle.make} {vehicle.model}</span>
        </div>

        {availability && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold border backdrop-blur-md ${
              availability.available 
                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {availability.available ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {availability.available ? 'In Stock & Ready' : availability.message}
            {availability.available && <span className="text-white/40 ml-2 font-medium">| {availability.estimatedDelivery}</span>}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
        
        {/* Left Col - Image Gallery (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            layoutId={`vehicle-image-${vehicle._id}`}
            className="aspect-[16/10] bg-black/40 rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl group"
          >
            {vehicle.images && vehicle.images.length > 0 ? (
              <img 
                src={vehicle.images[activeImage].url} 
                alt={`${vehicle.make} ${vehicle.model}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image Available</div>
            )}
            
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-primary/90 backdrop-blur-xl text-primary-foreground text-xs font-black rounded-xl uppercase tracking-widest shadow-lg">
                {vehicle.category}
              </span>
            </div>
          </motion.div>

          {/* Thumbnail Strip */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide px-2">
              {vehicle.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-28 aspect-[16/10] rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                    activeImage === idx 
                      ? 'border-primary shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105' 
                      : 'border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Features - Desktop (Hidden on mobile, moved below) */}
          <div className="hidden lg:block pt-10 border-t border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" /> Highlight Features
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {vehicle.features?.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-400 group">
                  <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <span className="text-sm font-medium group-hover:text-white transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - Details & Actions (5 Columns) */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold font-playfair text-white leading-tight"
            >
              {vehicle.make} <span className="text-primary italic">{vehicle.model}</span>
            </motion.h1>
            <p className="text-2xl text-gray-400 font-medium tracking-tight">{vehicle.variant}</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center group hover:border-primary/20 transition-colors">
              <Calendar className="w-6 h-6 text-primary mb-2" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Model Year</p>
              <p className="text-lg font-bold text-white">{vehicle.year}</p>
            </div>
            <div className="glass p-4 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center group hover:border-primary/20 transition-colors">
              <Fuel className="w-6 h-6 text-primary mb-2" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fuel Type</p>
              <p className="text-lg font-bold text-white capitalize">{vehicle.fuelType}</p>
            </div>
            <div className="glass p-4 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center group hover:border-primary/20 transition-colors">
              <Settings className="w-6 h-6 text-primary mb-2" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Transmission</p>
              <p className="text-lg font-bold text-white capitalize">{vehicle.transmission}</p>
            </div>
            <div className="glass p-4 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center group hover:border-primary/20 transition-colors">
              <Zap className="w-6 h-6 text-primary mb-2" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Efficiency</p>
              <p className="text-lg font-bold text-white">{vehicle.mileageKmpl} <span className="text-sm font-normal text-gray-500">kmpl</span></p>
            </div>
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-10 -mt-10" />
            
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6">Commercial Summary</h3>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between text-gray-400">
                <span className="font-sans font-medium">Ex-Showroom</span>
                <span className="text-white font-bold">{formatCurrency(vehicle.exShowroomPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-sans font-medium">RTO & Insurance (Est.)</span>
                <span className="text-white font-bold">{formatCurrency(rto + insurance)}</span>
              </div>
              
              <div className="pt-6 border-t border-white/10 mt-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs font-sans font-medium text-primary uppercase tracking-wider">Final On-Road</p>
                    <p className="text-4xl font-bold text-white leading-none tracking-tighter">
                      {formatCurrency(vehicle.onRoadPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-sans font-medium text-gray-500 uppercase">EMI Starts at</p>
                    <p className="text-xl font-bold text-primary">₹{Math.round(vehicle.exShowroomPrice * 0.018).toLocaleString()}*</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowApplyModal('loan')}
                className="w-full py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all flex justify-center items-center gap-3 text-xl shimmer-btn shadow-lg"
              >
                Apply for Financing <ArrowRight className="w-6 h-6" />
              </button>
              
              {vehicle.isAvailableForLease && (
                <button 
                  onClick={() => setShowApplyModal('lease')}
                  className="w-full py-4 bg-white/5 text-white border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                >
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  Corporate Lease Available
                  <span className="ml-1 text-xs text-gray-500 font-normal group-hover:text-gray-300">(Zero Down Payment)</span>
                </button>
              )}
            </div>

            <Link 
              to="/emi"
              className="flex items-center justify-center gap-2 py-4 text-sm font-bold text-gray-400 hover:text-white transition-colors border-t border-white/5 mt-4"
            >
              <Calculator className="w-4 h-4" /> Compare different EMI plans
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest pt-4">
            <ShieldCheck className="w-4 h-4 text-gray-700" /> Secure Application Processing via DriveEase
          </div>
        </div>

        {/* Mobile Features (Only visible on small screens) */}
        <div className="lg:hidden col-span-1 border-t border-white/5 pt-10">
          <h3 className="text-xl font-bold text-white mb-6">Key Features</h3>
          <div className="grid grid-cols-1 gap-4">
            {vehicle.features?.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <ApplyFinancing 
        vehicle={vehicle} 
        isOpen={!!showApplyModal} 
        initialType={showApplyModal || 'loan'}
        onClose={() => setShowApplyModal(null)} 
      />
    </AnimatedPage>
  );
};

export default VehicleDetail;
