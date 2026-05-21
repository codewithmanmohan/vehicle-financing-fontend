import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Fuel, Calendar, Settings, 
  ArrowRight, IndianRupee, Zap, ShieldCheck, Loader2, Info
} from 'lucide-react';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';

const VehicleGallery = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    fuelType: '',
    search: '',
  });

  const categories = ['All', 'suv', 'sedan', 'hatchback', 'ev', 'luxury', 'bike', 'commercial'];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.category !== 'All') queryParams.append('category', filters.category);
        if (filters.fuelType) queryParams.append('fuelType', filters.fuelType);
        if (filters.search) queryParams.append('search', filters.search);

        const { data } = await api.get(`/vehicles?${queryParams.toString()}`);
        setVehicles(data);
      } catch (error) {
        console.error('Failed to fetch vehicles', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <AnimatedPage>
      <div className="mb-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold font-playfair text-white tracking-tight">Our Premium Fleet</h1>
            <p className="text-muted-foreground mt-2 text-lg">Select a vehicle to view customized financing and leasing options.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search make or model..."
                className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white text-sm w-full md:w-72 transition-all outline-none"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({...filters, category: cat})}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                filters.category === cat 
                  ? 'bg-primary text-primary-foreground border-primary shadow-[0_10px_20px_rgba(245,158,11,0.2)] scale-105' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-80 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading collection...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="glass p-20 rounded-3xl text-center border border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No vehicles found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          <button 
            onClick={() => setFilters({category: 'All', fuelType: '', search: ''})}
            className="mt-6 px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all font-bold"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {vehicles.map((vehicle) => (
              <motion.div 
                key={vehicle._id}
                variants={itemVariants}
                layout
                className="group relative"
              >
                <div className="glass rounded-[2rem] overflow-hidden border border-white/10 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-full bg-gradient-to-b from-white/[0.08] to-transparent">
                  {/* Image Container */}
                  <div className="aspect-[16/11] relative overflow-hidden bg-black/40">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img 
                        src={vehicle.images[0].url} 
                        alt={`${vehicle.make} ${vehicle.model}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">Image coming soon</div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 w-fit">
                        <Zap className="w-3 h-3 text-primary fill-primary" /> {vehicle.category}
                      </span>
                      {vehicle.isAvailableForLease && (
                        <span className="px-3 py-1 bg-green-500/80 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg w-fit">
                          Lease Available
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-xs font-bold text-white uppercase tracking-tighter">
                      {vehicle.fuelType}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{vehicle.make} {vehicle.model}</h3>
                        <div className="bg-primary/10 px-2 py-1 rounded text-[10px] font-bold text-primary border border-primary/20">
                          {vehicle.year}
                        </div>
                      </div>
                      <p className="text-gray-400 font-medium text-sm">{vehicle.variant}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ex-Showroom</p>
                        <p className="text-lg font-bold text-white font-mono">{formatCurrency(vehicle.exShowroomPrice)}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Est. EMI</p>
                        <p className="text-lg font-bold text-primary font-mono">₹{Math.round(vehicle.exShowroomPrice * 0.018).toLocaleString()}/mo*</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="flex items-center gap-1 text-xs"><Settings className="w-3 h-3" /> {vehicle.transmission}</div>
                        <div className="flex items-center gap-1 text-xs"><ShieldCheck className="w-3 h-3 text-green-500" /> Warranty</div>
                      </div>
                      <Link 
                        to={`/vehicles/${vehicle._id}`}
                        className="p-3 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="mt-16 p-8 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Can't find your dream car?</h4>
            <p className="text-gray-400 text-sm">Our inventory updates daily. Contact us for custom procurement.</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all">
          Request Call Back
        </button>
      </div>
    </AnimatedPage>
  );
};

export default VehicleGallery;
