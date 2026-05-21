import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X, Upload, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import AnimatedPage from '../../components/shared/AnimatedPage';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';

import { toast } from 'sonner';

const VehicleManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
      toast.error('Could not refresh vehicle list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setValue('make', vehicle.make);
    setValue('model', vehicle.model);
    setValue('variant', vehicle.variant);
    setValue('year', vehicle.year);
    setValue('category', vehicle.category);
    setValue('fuelType', vehicle.fuelType);
    setValue('transmission', vehicle.transmission);
    setValue('exShowroomPrice', vehicle.exShowroomPrice);
    setValue('onRoadPrice', vehicle.onRoadPrice);
    setValue('mileageKmpl', vehicle.mileageKmpl);
    setValue('features', vehicle.features.join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const toastId = toast.loading('Deleting vehicle...');
      try {
        await api.delete(`/vehicles/${id}`);
        setVehicles(vehicles.filter(v => v._id !== id));
        toast.success('Vehicle permanently removed', { id: toastId });
      } catch (error) {
        console.error('Failed to delete vehicle', error);
        toast.error('Failed to delete vehicle', { id: toastId });
      }
    }
  };

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    const toastId = toast.loading(editingVehicle ? 'Updating vehicle...' : 'Adding vehicle...');
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'features' || key === 'colorOptions') {
          formData.append(key, JSON.stringify(data[key].split(',').map(s => s.trim())));
        } else {
          formData.append(key, data[key]);
        }
      });
      
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      if (editingVehicle) {
        const { data: updated } = await api.put(`/vehicles/${editingVehicle._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setVehicles(vehicles.map(v => v._id === editingVehicle._id ? updated : v));
        toast.success('Vehicle updated successfully', { id: toastId });
      } else {
        const { data: created } = await api.post('/vehicles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setVehicles([created, ...vehicles]);
        toast.success('New vehicle added to inventory', { id: toastId });
      }
      
      setIsModalOpen(false);
      reset();
      setEditingVehicle(null);
      setImageFiles([]);
    } catch (error) {
      console.error('Failed to save vehicle', error);
      toast.error('Failed to save vehicle. Check all fields.', { id: toastId });
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <AnimatedPage>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-playfair text-white">Vehicle Manager</h1>
          <p className="text-muted-foreground mt-2">Manage your vehicle inventory and listings in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search make or model..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 text-white text-sm w-full md:w-64" 
            />
          </div>
          <button 
            onClick={() => { reset(); setEditingVehicle(null); setImageFiles([]); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Add Vehicle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle._id} className="glass rounded-2xl overflow-hidden border border-border/30 hover:border-primary/30 transition-all flex flex-col group">
            <div className="h-48 bg-card relative overflow-hidden">
              {vehicle.images?.[0] ? (
                <img src={vehicle.images[0].url} alt={vehicle.model} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
              )}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(vehicle)} className="p-2 bg-background/90 backdrop-blur text-white rounded-xl hover:text-primary transition-colors border border-border/50 shadow-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(vehicle._id)} className="p-2 bg-background/90 backdrop-blur text-red-500 rounded-xl hover:bg-red-500/20 transition-colors border border-border/50 shadow-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${vehicle.isActive ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-red-500/20 text-red-500 border border-red-500/20'}`}>
                  {vehicle.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-lg">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-xs text-muted-foreground">{vehicle.variant}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Price</span>
                  <span className="font-bold text-primary font-mono">{formatCurrency(vehicle.exShowroomPrice)}</span>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-border/20 flex justify-between text-[11px] text-gray-400">
                <span>{vehicle.fuelType.toUpperCase()}</span>
                <span>{vehicle.transmission.toUpperCase()}</span>
                <span>{vehicle.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-border/50 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-border/30 bg-black/20 shrink-0">
                <h2 className="text-xl font-bold text-white">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <form id="vehicleForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-border/30 pb-1">Basic Info</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs text-gray-400">Make</label><input {...register('make', {required:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white focus:ring-1 focus:ring-primary/50 outline-none" placeholder="e.g. BMW" /></div>
                        <div><label className="text-xs text-gray-400">Model</label><input {...register('model', {required:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white focus:ring-1 focus:ring-primary/50 outline-none" placeholder="e.g. 3 Series" /></div>
                        <div><label className="text-xs text-gray-400">Variant</label><input {...register('variant')} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white focus:ring-1 focus:ring-primary/50 outline-none" placeholder="e.g. M340i" /></div>
                        <div><label className="text-xs text-gray-400">Year</label><input type="number" {...register('year', {required:true, valueAsNumber:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white focus:ring-1 focus:ring-primary/50 outline-none" /></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-border/30 pb-1">Technical Specs</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400">Category</label>
                          <select {...register('category', {required:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white outline-none">
                            <option value="hatchback">Hatchback</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="muv">MUV</option>
                            <option value="luxury">Luxury</option>
                            <option value="ev">EV</option>
                            <option value="bike">Bike</option>
                            <option value="commercial">Commercial</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Fuel Type</label>
                          <select {...register('fuelType', {required:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white outline-none">
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="cng">CNG</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Transmission</label>
                          <select {...register('transmission', {required:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white outline-none">
                            <option value="manual">Manual</option>
                            <option value="automatic">Automatic</option>
                            <option value="amt">AMT</option>
                            <option value="dct">DCT</option>
                          </select>
                        </div>
                        <div><label className="text-xs text-gray-400">Mileage (kmpl)</label><input type="number" step="0.1" {...register('mileageKmpl', {valueAsNumber:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white outline-none" /></div>
                        <div><label className="text-xs text-gray-400">Engine (CC)</label><input type="number" {...register('engineCC', {valueAsNumber:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white outline-none" /></div>
                        <div><label className="text-xs text-gray-400">Seats</label><input type="number" {...register('seatingCapacity', {valueAsNumber:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white outline-none" /></div>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 space-y-4">
                      <div className="flex items-center justify-between border-b border-border/30 pb-1">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Commercials & Leasing</h3>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="isAvailableForLease" {...register('isAvailableForLease')} className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/50 bg-background" />
                          <label htmlFor="isAvailableForLease" className="text-xs text-gray-400">Available for Lease</label>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2"><label className="text-xs text-gray-400">Ex-Showroom Price (₹)</label><input type="number" {...register('exShowroomPrice', {required:true, valueAsNumber:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white font-mono outline-none" /></div>
                        <div className="lg:col-span-2"><label className="text-xs text-gray-400">On-Road Price (₹)</label><input type="number" {...register('onRoadPrice', {required:true, valueAsNumber:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white font-mono outline-none" /></div>
                        <div><label className="text-xs text-gray-400">Lease Rent (₹/mo)</label><input type="number" {...register('leaseMonthlyRent', {valueAsNumber:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white font-mono outline-none" /></div>
                        <div><label className="text-xs text-gray-400">Min Loan (₹)</label><input type="number" {...register('minLoanAmount', {valueAsNumber:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white font-mono outline-none" /></div>
                        <div><label className="text-xs text-gray-400">Max Loan (₹)</label><input type="number" {...register('maxLoanAmount', {valueAsNumber:true})} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white font-mono outline-none" /></div>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                      <label className="text-xs text-gray-400">Features (Comma separated)</label>
                      <textarea {...register('features')} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white min-h-[80px] outline-none" placeholder="Sunroof, ADAS, 360 Camera, 10-inch Display" />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="text-xs text-gray-400">Description</label>
                      <textarea {...register('description')} className="w-full mt-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-white min-h-[80px] outline-none" placeholder="Briefly describe the vehicle's unique selling points..." />
                    </div>

                    {!editingVehicle && (
                      <div className="col-span-1 md:col-span-2">
                        <label className="text-xs text-gray-400">Images</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border/50 border-dashed rounded-lg bg-background hover:border-primary/50 transition-colors">
                          <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-400">
                              <label className="relative cursor-pointer bg-card rounded-md font-medium text-primary hover:text-primary/80 px-2 py-1">
                                <span>Upload files</span>
                                <input type="file" multiple accept="image/*" className="sr-only" onChange={(e) => setImageFiles(Array.from(e.target.files))} />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">{imageFiles.length} files selected</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-border/30 bg-black/40 shrink-0 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border text-white rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" form="vehicleForm" disabled={submitLoading} className="px-8 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-2 transition-all">
                  {submitLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default VehicleManager;
