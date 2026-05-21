import { Link } from 'react-router-dom';
import { CarFront, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <CarFront className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-playfair text-white">
                DriveEase<span className="text-primary">Finance</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              India's Smartest Vehicle Financing Platform. Making your dream car a reality with transparent, fast, and digital loan processing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg font-playfair">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/vehicles" className="text-muted-foreground hover:text-primary transition-colors text-sm">Browse Vehicles</Link></li>
              <li><Link to="/emi" className="text-muted-foreground hover:text-primary transition-colors text-sm">EMI Calculator</Link></li>
              <li><Link to="/register" className="text-muted-foreground hover:text-primary transition-colors text-sm">Apply for Loan</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg font-playfair">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/fair-practice" className="text-muted-foreground hover:text-primary transition-colors text-sm">Fair Practice Code</Link></li>
              <li><Link to="/grievance" className="text-muted-foreground hover:text-primary transition-colors text-sm">Grievance Redressal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg font-playfair">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">123, Financial District, Bandra Kurla Complex, Mumbai, 400051</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">1800-123-4567 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">support@driveease.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RBI Disclaimer */}
        <div className="border-t border-border/30 pt-8 mt-8 text-center md:text-left">
          <p className="text-xs text-muted-foreground mb-4">
            <strong className="text-primary/80">RBI Disclaimer:</strong> DriveEase Finance is an authorized facilitator. Loan disbursal is subject to credit appraisal and document verification by our partner NBFCs and Banks. Interest rates and processing fees may vary based on your credit profile.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DriveEase Finance. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
