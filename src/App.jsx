import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AdminRoute } from './components/shared/AdminRoute';

import Landing from './pages/Landing';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { Toaster } from 'sonner';

import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/user/Dashboard';
import VehicleGallery from './pages/user/VehicleGallery';
import VehicleDetail from './pages/user/VehicleDetail';
import EMICalculator from './pages/user/EMICalculator';
import ApplicationStatus from './pages/user/ApplicationStatus';
import Profile from './pages/user/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationManager from './pages/admin/ApplicationManager';
import VehicleManager from './pages/admin/VehicleManager';
import CustomerList from './pages/admin/CustomerList';

const PublicLayout = ({ children, maxWidth = 'max-w-7xl' }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className={`flex-1 pt-24 pb-12 px-4 md:px-8 mx-auto w-full ${maxWidth}`}>
      {children}
    </main>
    <Footer />
  </div>
);

const StaticPage = ({ title }) => (
  <PublicLayout maxWidth="max-w-4xl">
    <h1 className="text-4xl font-bold text-white mb-6 font-playfair">{title}</h1>
    <div className="prose prose-invert max-w-none text-gray-400">
      <p className="mb-4 text-lg">This is the {title} page for DriveEase Finance.</p>
      <p>We are currently updating our legal and informational content. Please check back soon for the full version of our {title}.</p>
      <div className="mt-12 p-6 glass border border-border/30 rounded-2xl">
        <h3 className="text-white font-bold mb-2">Need immediate assistance?</h3>
        <p>Contact our support team at support@driveease.in or call our toll-free number.</p>
      </div>
    </div>
  </PublicLayout>
);

const NotFound = () => <div className="p-10 text-center text-2xl text-red-500">404 Not Found</div>;

function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors closeButton theme="dark" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Publicly Accessible Functional Routes */}
        <Route path="/vehicles" element={<PublicLayout><VehicleGallery /></PublicLayout>} />
        <Route path="/vehicles/:id" element={<PublicLayout><VehicleDetail /></PublicLayout>} />
        <Route path="/emi" element={<PublicLayout><EMICalculator /></PublicLayout>} />
        
        {/* Information Pages */}
        <Route path="/about" element={<StaticPage title="About Us" />} />
        <Route path="/terms" element={<StaticPage title="Terms & Conditions" />} />
        <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
        <Route path="/fair-practice" element={<StaticPage title="Fair Practice Code" />} />
        <Route path="/grievance" element={<StaticPage title="Grievance Redressal" />} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<ApplicationStatus />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="applications" element={<ApplicationManager />} />
          <Route path="vehicles" element={<VehicleManager />} />
          <Route path="customers" element={<CustomerList />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
