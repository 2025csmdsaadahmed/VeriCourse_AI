import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Compass, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo - Crisp, prominent and uncompressed */}
        <Link to="/" className="flex items-center shrink-0 group">
          <img
            src="/assets/vericourse-logo.png"
            alt="VeriCourse AI - Education • Trust • Verification"
            className="h-14 sm:h-16 w-auto object-contain rounded-xl drop-shadow-md group-hover:scale-[1.03] transition-transform duration-300"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-6 2xl:gap-8">
          <Link
            to="/"
            className={`text-[13px] font-bold tracking-wide transition-colors uppercase whitespace-nowrap ${
              isActive('/') ? 'text-forest-900 border-b-2 border-forest-800 pb-0.5' : 'text-warm-charcoal/80 hover:text-forest-800'
            }`}
          >
            Home
          </Link>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-[13px] font-bold tracking-wide text-warm-charcoal/80 hover:text-forest-800 transition-colors uppercase whitespace-nowrap"
          >
            How It Works
          </button>
          <Link
            to="/discover"
            className={`text-[13px] font-bold tracking-wide transition-colors uppercase whitespace-nowrap flex items-center gap-1.5 ${
              isActive('/discover') ? 'text-forest-900 border-b-2 border-forest-800 pb-0.5' : 'text-warm-charcoal/80 hover:text-forest-800'
            }`}
          >
            <Compass className="w-4 h-4 text-forest-600" />
            Explore Courses
          </Link>
          <Link
            to="/compare"
            className={`text-[13px] font-bold tracking-wide transition-colors uppercase whitespace-nowrap ${
              isActive('/compare') ? 'text-forest-900 border-b-2 border-forest-800 pb-0.5' : 'text-warm-charcoal/80 hover:text-forest-800'
            }`}
          >
            Compare
          </Link>
          <Link
            to="/experiences"
            className={`text-[13px] font-bold tracking-wide transition-colors uppercase whitespace-nowrap ${
              isActive('/experiences') ? 'text-forest-900 border-b-2 border-forest-800 pb-0.5' : 'text-warm-charcoal/80 hover:text-forest-800'
            }`}
          >
            Student Experiences
          </Link>
          <button
            onClick={() => scrollToSection('about')}
            className="text-[13px] font-bold tracking-wide text-warm-charcoal/80 hover:text-forest-800 transition-colors uppercase whitespace-nowrap"
          >
            About
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="h-10 px-4 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 text-xs font-bold border border-forest-200 flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <LayoutDashboard className="w-4 h-4 text-forest-700" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-warm-cream/60 hover:bg-warm-cream text-warm-muted hover:text-terracotta transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="h-10 px-4 flex items-center text-xs font-bold text-warm-charcoal hover:text-forest-900 transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="h-10 px-5 rounded-xl bg-white hover:bg-warm-bg text-forest-900 font-bold text-xs border border-warm-border shadow-soft-sm transition-all flex items-center whitespace-nowrap hover:shadow-soft-md transform hover:-translate-y-0.5"
              >
                Create Account
              </Link>
              <Link
                to="/verify"
                className="h-10 px-5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-forest-sm transition-all flex items-center whitespace-nowrap transform hover:-translate-y-0.5"
              >
                Investigate Course
              </Link>
            </div>
          )}
        </div>

        {/* Mobile / Tablet Hamburger Button */}
        <div className="xl:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-warm-cream text-forest-900 hover:bg-forest-50 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-warm-bg border-b border-warm-border px-5 py-6 space-y-3 shadow-soft-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-bold py-1.5 ${isActive('/') ? 'text-forest-900' : 'text-warm-charcoal'}`}
          >
            Home
          </Link>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left text-sm font-bold text-warm-charcoal py-1.5 hover:text-forest-900"
          >
            How It Works
          </button>
          <Link
            to="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-bold py-1.5 ${isActive('/discover') ? 'text-forest-900' : 'text-warm-charcoal'}`}
          >
            Explore Courses
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-bold py-1.5 ${isActive('/compare') ? 'text-forest-900' : 'text-warm-charcoal'}`}
          >
            Compare Providers
          </Link>
          <Link
            to="/experiences"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-bold py-1.5 ${isActive('/experiences') ? 'text-forest-900' : 'text-warm-charcoal'}`}
          >
            Student Experiences
          </Link>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left text-sm font-bold text-warm-charcoal py-1.5 hover:text-forest-900"
          >
            About VeriCourse
          </button>

          <div className="pt-4 border-t border-warm-border flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-warm-cream text-terracotta font-bold text-xs"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white border border-warm-border text-forest-900 font-bold text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white border border-warm-border text-forest-900 font-bold text-xs"
                >
                  Create Account
                </Link>
                <Link
                  to="/verify"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs"
                >
                  Investigate a Course
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
