import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Compass, LogOut, LayoutDashboard, Menu, X, ShieldAlert, Scale, MessageSquare, Sparkles } from 'lucide-react';

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
        {/* Exact Order: 1. HOME 2. HOW IT WORKS 3. EXPLORE COURSES 4. INVESTIGATE COURSE 5. COMPARE 6. STUDENT EXPERIENCES 7. ABOUT */}
        <div className="hidden xl:flex items-center gap-5 2xl:gap-7">
          {/* 1. HOME */}
          <Link
            to="/"
            className={`text-sm font-extrabold tracking-wide transition-colors uppercase whitespace-nowrap ${
              isActive('/') ? 'text-forest-900 border-b-2 border-forest-800 pb-1' : 'text-warm-charcoal/80 hover:text-forest-800'
            }`}
          >
            Home
          </Link>

          {/* 2. HOW IT WORKS */}
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-extrabold tracking-wide text-warm-charcoal/80 hover:text-forest-800 transition-colors uppercase whitespace-nowrap cursor-pointer"
          >
            How It Works
          </button>

          {/* 3. EXPLORE COURSES */}
          <Link
            to="/discover"
            className={`text-sm font-extrabold tracking-wide transition-colors uppercase whitespace-nowrap flex items-center gap-1.5 ${
              isActive('/discover') ? 'text-forest-900 border-b-2 border-forest-800 pb-1' : 'text-warm-charcoal/80 hover:text-forest-800'
            }`}
          >
            Explore Courses
          </Link>

          {/* 4. INVESTIGATE COURSE - Primary button treatment positioned between Explore and Compare */}
          <Link
            to="/verify"
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all flex items-center gap-1.5 whitespace-nowrap shadow-forest-sm transform hover:-translate-y-0.5 ${
              isActive('/verify')
                ? 'bg-forest-800 text-white ring-2 ring-forest-500'
                : 'bg-forest-900 hover:bg-forest-800 text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-gold" />
            Investigate Course
          </Link>

          {/* 5. COMPARE */}
          <Link
            to="/compare"
            className={`text-sm font-extrabold tracking-wide transition-colors uppercase whitespace-nowrap ${
              isActive('/compare') ? 'text-forest-900 border-b-2 border-forest-800 pb-1' : 'text-warm-charcoal/80 hover:text-forest-800'
            }`}
          >
            Compare
          </Link>

          {/* 6. STUDENT EXPERIENCES */}
          <Link
            to="/experiences"
            className={`text-sm font-extrabold tracking-wide transition-colors uppercase whitespace-nowrap ${
              isActive('/experiences') ? 'text-forest-900 border-b-2 border-forest-800 pb-1' : 'text-warm-charcoal/80 hover:text-forest-800'
            }`}
          >
            Student Experiences
          </Link>

          {/* 7. ABOUT */}
          <button
            onClick={() => scrollToSection('about')}
            className="text-sm font-extrabold tracking-wide text-warm-charcoal/80 hover:text-forest-800 transition-colors uppercase whitespace-nowrap cursor-pointer"
          >
            About
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className={`h-11 px-5 rounded-xl text-xs font-extrabold border flex items-center gap-2 transition-all whitespace-nowrap shadow-soft-sm ${
                  isActive('/dashboard')
                    ? 'bg-forest-900 text-white border-forest-900'
                    : 'bg-forest-50 hover:bg-forest-100 text-forest-900 border-forest-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-forest-700" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="h-11 px-4 flex items-center gap-1.5 rounded-xl bg-warm-cream/70 hover:bg-terracotta-light text-warm-charcoal hover:text-terracotta border border-warm-border text-xs font-extrabold transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="h-11 px-5 flex items-center text-xs font-extrabold text-forest-900 hover:text-forest-700 transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="h-11 px-6 rounded-xl bg-white hover:bg-warm-bg text-forest-900 font-extrabold text-xs border border-warm-border shadow-soft-sm transition-all flex items-center whitespace-nowrap hover:shadow-soft-md transform hover:-translate-y-0.5"
              >
                Create Account
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
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-warm-bg border-b border-warm-border px-5 py-6 space-y-3.5 shadow-soft-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-base font-extrabold py-2 ${isActive('/') ? 'text-forest-900 border-l-4 border-forest-800 pl-2' : 'text-warm-charcoal'}`}
          >
            1. Home
          </Link>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left text-base font-extrabold text-warm-charcoal py-2 hover:text-forest-900"
          >
            2. How It Works
          </button>
          <Link
            to="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-base font-extrabold py-2 ${isActive('/discover') ? 'text-forest-900 border-l-4 border-forest-800 pl-2' : 'text-warm-charcoal'}`}
          >
            3. Explore Courses
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center py-3 rounded-xl bg-forest-900 text-white font-extrabold text-sm shadow-forest-sm"
          >
            4. Investigate Course
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-base font-extrabold py-2 ${isActive('/compare') ? 'text-forest-900 border-l-4 border-forest-800 pl-2' : 'text-warm-charcoal'}`}
          >
            5. Compare
          </Link>
          <Link
            to="/experiences"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-base font-extrabold py-2 ${isActive('/experiences') ? 'text-forest-900 border-l-4 border-forest-800 pl-2' : 'text-warm-charcoal'}`}
          >
            6. Student Experiences
          </Link>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left text-base font-extrabold text-warm-charcoal py-2 hover:text-forest-900"
          >
            7. About
          </button>

          <div className="pt-4 border-t border-warm-border flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-forest-900 text-white font-extrabold text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-warm-cream text-warm-charcoal hover:text-terracotta font-extrabold text-xs"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 rounded-xl bg-warm-cream text-forest-900 font-extrabold text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 rounded-xl bg-white text-forest-900 border border-warm-border font-extrabold text-xs shadow-soft-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
