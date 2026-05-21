import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  Calculator, 
  Settings, 
  LogOut,
  ChevronRight,
  Home,
  User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = user?.role === 'admin' 
    ? [
        { name: 'Back to Home', path: '/', icon: <Home className="w-5 h-5" /> },
        { name: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Applications', path: '/admin/applications', icon: <FileText className="w-5 h-5" /> },
        { name: 'Vehicles', path: '/admin/vehicles', icon: <Car className="w-5 h-5" /> },
        { name: 'Customers', path: '/admin/customers', icon: <Settings className="w-5 h-5" /> },
      ]
    : [
        { name: 'Back to Home', path: '/', icon: <Home className="w-5 h-5" /> },
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Vehicle Gallery', path: '/vehicles', icon: <Car className="w-5 h-5" /> },
        { name: 'My Applications', path: '/dashboard/applications', icon: <FileText className="w-5 h-5" /> },
        { name: 'EMI Calculator', path: '/emi', icon: <Calculator className="w-5 h-5" /> },
        { name: 'My Profile', path: '/dashboard/profile', icon: <User className="w-5 h-5" /> },
      ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : window.innerWidth >= 1024 ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-20 left-0 bottom-0 w-64 bg-card border-r border-border/30 z-40 overflow-y-auto flex flex-col"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary shrink-0 uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isHome = item.path === '/';
              const isActive = !isHome && (
                location.pathname === item.path || 
                (item.path !== '/dashboard' && item.path !== '/admin' && location.pathname.startsWith(item.path))
              );
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                  onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("transition-colors", isActive ? "text-primary-foreground" : "group-hover:text-primary")}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-border/30">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
