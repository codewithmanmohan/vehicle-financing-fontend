import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CarFront, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { scrollY } = useScroll();
  
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(10, 14, 26, 0)", "rgba(10, 14, 26, 0.9)"]
  );
  
  const navBackdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );

  const navBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(245, 158, 11, 0)", "rgba(245, 158, 11, 0.2)"]
  );

  return (
    <motion.nav 
      style={{ 
        backgroundColor: navBackground,
        backdropFilter: navBackdropBlur,
        borderBottomColor: navBorder,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid'
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <CarFront className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold font-playfair tracking-tight text-white">
                DriveEase<span className="text-primary">Finance</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/vehicles" className="text-gray-300 hover:text-white transition-colors">Vehicles</Link>
            <Link to="/emi" className="text-gray-300 hover:text-white transition-colors">EMI Calculator</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium shimmer-btn transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background border-b border-border/30"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/vehicles" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-card rounded-md">Vehicles</Link>
            <Link to="/emi" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-card rounded-md">EMI Calculator</Link>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-card rounded-md">Dashboard</Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-card rounded-md">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-card rounded-md">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary hover:text-primary/80 hover:bg-card rounded-md">Get Started</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
