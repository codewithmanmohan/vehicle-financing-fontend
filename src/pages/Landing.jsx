import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AnimatedPage from '../components/shared/AnimatedPage';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, CarFront } from 'lucide-react';

const Landing = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative overflow-hidden min-h-[95vh] flex items-center pt-20">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                India's #1 Digital Auto Loan Platform
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold font-playfair text-white leading-tight">
                Drive Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">Dream</span>,<br />
                Finance it Smart.
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Experience zero-paperwork, instant approvals, and the lowest interest rates starting from 7.9% p.a. Your dream car is just a click away.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/vehicles" 
                  className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shimmer-btn flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all"
                >
                  Explore Vehicles <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/emi" 
                  className="px-8 py-4 rounded-full bg-card border border-border text-white font-bold text-lg flex items-center justify-center hover:bg-card/80 transition-colors"
                >
                  Calculate EMI
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-border/30">
                <div>
                  <h4 className="text-3xl font-bold text-white font-mono">500<span className="text-primary">Cr+</span></h4>
                  <p className="text-sm text-muted-foreground mt-1">Amount Financed</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white font-mono">10<span className="text-primary">k+</span></h4>
                  <p className="text-sm text-muted-foreground mt-1">Happy Customers</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white font-mono">50<span className="text-primary">+</span></h4>
                  <p className="text-sm text-muted-foreground mt-1">Partner Brands</p>
                </div>
              </div>
            </motion.div>

            {/* 3D-like Vehicle Silhouette */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative hidden lg:block h-[500px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[120%] h-[120%] bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center rounded-[2rem] glass overflow-hidden border-border/50 transform perspective-1000 rotate-y-[-10deg] rotate-x-[5deg] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-transparent"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-card/50 border-y border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-playfair text-white mb-4">How It Works</h2>
              <p className="text-muted-foreground">Get your vehicle financed in 3 simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border/50">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  className="h-full bg-primary"
                />
              </div>

              {[
                { icon: <CarFront className="w-8 h-8 text-background" />, title: "Choose Vehicle", desc: "Browse from 50+ brands and select your dream car or bike." },
                { icon: <Zap className="w-8 h-8 text-background" />, title: "Check Eligibility", desc: "Provide basic details and get instant loan approval." },
                { icon: <ShieldCheck className="w-8 h-8 text-background" />, title: "Drive Home", desc: "Sign documents digitally and drive home the same day." }
              ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="relative flex flex-col items-center text-center glass p-8 rounded-2xl z-10 hover:border-primary/50 transition-colors"
                >
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
      </div>
    </AnimatedPage>
  );
};

export default Landing;
