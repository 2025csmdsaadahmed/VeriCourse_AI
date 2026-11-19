import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-warm-cream/70 border-t border-warm-border pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-warm-border">
          
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block group">
              <img
                src="/assets/vericourse-logo.png"
                alt="VeriCourse AI - Education • Trust • Verification"
                className="h-12 w-auto object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-sm text-warm-muted leading-relaxed">
              Intelligent educational verification and continuous trust intelligence platform. Distinguishing genuine educational promises from misleading marketing claims.
            </p>
            <p className="text-xs text-forest-700 font-serif italic">
              “Your Future Deserves More Than Just Promises.”
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-warm-charcoal">
              <li><Link to="/discover" className="hover:text-forest-700 transition-colors">Explore Courses</Link></li>
              <li><Link to="/verify" className="hover:text-forest-700 transition-colors">Investigate a Course</Link></li>
              <li><Link to="/compare" className="hover:text-forest-700 transition-colors">Compare Providers</Link></li>
              <li><Link to="/experiences" className="hover:text-forest-700 transition-colors">Student Experiences</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-4">AI Verification Agents</h4>
            <ul className="space-y-2.5 text-sm text-warm-charcoal">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-forest-600" /> Claim Extraction Agent</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sage-dark" /> Evidence Verification Agent</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-terracotta" /> Risk Analysis Agent</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-gold" /> Transparent Scoring Engine</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-4">Integrity Standards</h4>
            <ul className="space-y-2.5 text-sm text-warm-charcoal">
              <li><a href="#rules" className="hover:text-forest-700 transition-colors">Scoring Methodology</a></li>
              <li><a href="#rules" className="hover:text-forest-700 transition-colors">SSRF-Protected Evidence Retrieval</a></li>
              <li><a href="#rules" className="hover:text-forest-700 transition-colors">Student Privacy Protection</a></li>
              <li><a href="#rules" className="hover:text-forest-700 transition-colors">Course Verification Disclaimers</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-warm-muted gap-4">
          <p>© {new Date().getFullYear()} VeriCourse AI Platform. All rights reserved.</p>
          <p>
            Evidence-based course evaluations independently corroborated with authentic student experiences.
          </p>
        </div>
      </div>
    </footer>
  );
};
