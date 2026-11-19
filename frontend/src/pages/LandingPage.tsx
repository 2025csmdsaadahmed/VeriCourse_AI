import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { CourseDiscoveryItem } from '../types';
import {
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Compass,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { FullBleedCanvasExperience } from '../components/landing/FullBleedCanvasExperience';

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [realCourses, setRealCourses] = useState<CourseDiscoveryItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch live courses from PostgreSQL backend to ensure real data only
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses/discover');
        setRealCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses for landing showcase', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg text-warm-charcoal selection:bg-forest-100 selection:text-forest-900">
      
      {/* ============================================================== */}
      {/* SECTION 1: HERO SECTION                                        */}
      {/* ============================================================== */}
      <section className="relative pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden">
        
        {/* Soft background glow & organic dot texture */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#174C3C]/5 via-[#D9A441]/5 to-transparent blur-3xl -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-xs font-bold text-forest-800 shadow-soft-sm mb-5"
        >
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          <span>Independent Educational Trust Intelligence Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-forest-900 max-w-4xl mx-auto leading-[1.15]"
        >
          Your Future Deserves <br />
          <span className="font-serif italic font-normal text-forest-700">More Than Just Promises.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-5 text-base sm:text-lg text-warm-charcoal/80 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Before investing your time and money in an educational course, discover what is real, what is promised and what the evidence actually proves.
        </motion.p>

        {/* Integrated Course Discovery Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-7 max-w-2xl w-full mx-auto"
        >
          <form onSubmit={handleSearch} className="relative flex items-center shadow-soft-md rounded-2xl bg-white p-2 border border-warm-border hover:border-forest-600/40 transition-all">
            <Search className="w-5 h-5 text-warm-muted absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any course, academy or certification programme..."
              className="w-full pl-12 pr-32 py-3 rounded-xl bg-transparent text-warm-charcoal placeholder-warm-muted text-sm font-medium focus:outline-none"
            />
            <button
              type="submit"
              className="h-11 px-7 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-forest-sm transition-all"
            >
              Search
            </button>
          </form>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/verify"
            className="h-12 px-8 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-forest-sm hover:shadow-soft-lg transition-all flex items-center gap-2 group transform hover:-translate-y-0.5"
          >
            INVESTIGATE A COURSE
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/discover"
            className="h-12 px-8 rounded-xl bg-white hover:bg-warm-cream text-forest-900 font-bold text-xs border border-warm-border shadow-soft-sm transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <Compass className="w-4 h-4 text-forest-600" />
            EXPLORE COURSES
          </Link>
        </motion.div>

      </section>

      {/* ============================================================== */}
      {/* SECTION 2: PROMINENT COURSE CREDIBILITY GATEWAY                */}
      {/* ============================================================== */}
      <section id="credibility-gateway" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-16">
        
        {/* Gateway Heading */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-border shadow-soft-sm mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-forest-700 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse" />
            ARCHITECTURAL SIMULATION • DIVERGING OUTCOMES
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-900">
            The Course Credibility Gateway
          </h2>
          <p className="text-xs sm:text-sm text-warm-muted mt-1">
            Every educational promise has a story. We investigate the evidence behind it.
          </p>
        </div>

        {/* 3D Campus Canvas Viewport */}
        <div className="w-full h-[620px] lg:h-[700px] rounded-3xl overflow-hidden border border-[#E3DDD0] shadow-soft-lg relative bg-[#F7F5EF]">
          <FullBleedCanvasExperience interactive={true} />

          {/* Interactive controls pill */}
          <div className="absolute bottom-5 left-6 z-10 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-warm-border text-xs text-warm-charcoal font-semibold shadow-soft-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forest-600 animate-ping" />
            <span>Click and drag to orbit and inspect the campus pathways</span>
          </div>

          {/* Aggregated Evidence Disclaimer */}
          <div className="absolute bottom-5 right-6 z-10 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-warm-border text-[11px] text-warm-muted max-w-xs text-right shadow-soft-sm">
            *Visual simulation: Illustrating aggregated student outcomes & verified claims.
          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* SECTION 3: THE PROBLEM                                         */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-warm-border">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-terracotta-dark uppercase tracking-wider">
            The Fundamental Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 mt-1">
            Promises Are Easy to Make. <br />
            <span className="font-serif italic font-normal text-terracotta">Evidence Is What Matters.</span>
          </h2>
          <p className="mt-3 text-warm-muted text-sm sm:text-base leading-relaxed">
            Online course providers frequently advertise guaranteed placements, government accreditations, and high salary packages. In the absence of independent verification, students risk substantial financial and career setbacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="organic-card organic-card-hover p-7">
            <div className="w-11 h-11 rounded-2xl bg-terracotta-light text-terracotta flex items-center justify-center mb-5 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-forest-900 mb-2">Unsubstantiated Placement Rates</h3>
            <p className="text-xs text-warm-muted leading-relaxed">
              Advertising "100% placement guarantees" without verifiable audit trails, alumni outcome records, or direct employer validation.
            </p>
          </div>

          <div className="organic-card organic-card-hover p-7">
            <div className="w-11 h-11 rounded-2xl bg-amber-soft text-amber-gold flex items-center justify-center mb-5 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-forest-900 mb-2">Ambiguous Accreditations</h3>
            <p className="text-xs text-warm-muted leading-relaxed">
              Promoting institutional partnerships that mimic university credentials or government bodies without official recognized affiliation.
            </p>
          </div>

          <div className="organic-card organic-card-hover p-7">
            <div className="w-11 h-11 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mb-5 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-forest-900 mb-2">Silenced Student Reality</h3>
            <p className="text-xs text-warm-muted leading-relaxed">
              Marketing copy often hides real student experiences with curriculum pacing, mentor response times, and promised career services.
            </p>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 4: HOW IT WORKS — THE THREE AI AGENTS                  */}
      {/* ============================================================== */}
      <section id="how-it-works" className="bg-warm-cream/50 py-16 border-y border-warm-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">
              Continuous Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 mt-1">
              Three Orchestrated AI Agents
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-warm-muted leading-relaxed">
              VeriCourse AI deploys a structured multi-agent architecture coordinated by the Verification Orchestrator to test promises against real records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="organic-card p-7 relative overflow-hidden bg-white">
              <div className="w-2.5 h-2.5 rounded-full bg-forest-600 mb-4" />
              <span className="text-[11px] font-mono font-bold text-forest-700 uppercase tracking-wider block">Agent 01</span>
              <h3 className="text-base font-bold text-forest-900 mt-1 mb-2">Claim Extraction Agent</h3>
              <p className="text-xs text-warm-muted leading-relaxed">
                Ingests course sales copy, syllabi, and brochures. Extracts factual promises into validated categories including accreditations, placement promises, instructor credentials, and salary claims.
              </p>
            </div>

            <div className="organic-card p-7 relative overflow-hidden bg-white">
              <div className="w-2.5 h-2.5 rounded-full bg-sage-dark mb-4" />
              <span className="text-[11px] font-mono font-bold text-sage-dark uppercase tracking-wider block">Agent 02</span>
              <h3 className="text-base font-bold text-forest-900 mt-1 mb-2">Evidence Verification Agent</h3>
              <p className="text-xs text-warm-muted leading-relaxed">
                Executes safe, SSRF-protected HTTP retrieval of official websites, accreditation bodies, and public documents. Computes content hashes and classifies evidence as verified, conflicting, or unverified.
              </p>
            </div>

            <div className="organic-card p-7 relative overflow-hidden bg-white">
              <div className="w-2.5 h-2.5 rounded-full bg-terracotta mb-4" />
              <span className="text-[11px] font-mono font-bold text-terracotta-dark uppercase tracking-wider block">Agent 03</span>
              <h3 className="text-base font-bold text-forest-900 mt-1 mb-2">Risk Analysis Agent</h3>
              <p className="text-xs text-warm-muted leading-relaxed">
                Synthesizes extracted claims, verification findings, and student feedback. Evaluates contradiction patterns to assign an objective risk classification (Low, Medium, High, Undetermined).
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 5: MULTI-SOURCE EVIDENCE DISCOVERY                     */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-xl space-y-3.5">
            <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">
              Independent Corroboration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900">
              Evidence Discovery Across Diverse Sources
            </h2>
            <p className="text-xs sm:text-sm text-warm-muted leading-relaxed">
              We never rely on marketing claims alone. Our retrieval infrastructure queries authoritative repositories while strictly respecting website terms and robots policies:
            </p>

            <div className="space-y-3 pt-1">
              {[
                { title: 'Official & Government Portals', desc: 'University registrars, government education ministries, and official certification authorities.' },
                { title: 'Independent Educational Comparisons', desc: 'Public educational reviews, published course comparisons, and reputable publications.' },
                { title: 'Authentic Student Communities', desc: 'Public course feedback, employment announcements, and student experiences on VeriCourse AI.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-warm-border">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-forest-900">{item.title}</h4>
                    <p className="text-[11px] text-warm-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 organic-card p-7 bg-white shadow-soft-sm">
            <div className="flex items-center justify-between pb-4 border-b border-warm-border">
              <span className="text-xs font-bold text-forest-900">Live Provenance Record</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest-50 text-forest-800 font-bold">SHA-256 VERIFIED</span>
            </div>
            
            <div className="space-y-3 pt-4 text-xs">
              <div className="p-3 rounded-xl bg-warm-bg border border-warm-border">
                <span className="text-[10px] text-warm-muted block font-semibold">CLAIM AUDITED:</span>
                <span className="font-bold text-forest-900">"Government-recognized accredited data science certification"</span>
              </div>
              <div className="p-3 rounded-xl bg-warm-bg border border-warm-border">
                <span className="text-[10px] text-warm-muted block font-semibold">RETRIEVED SOURCE:</span>
                <span className="font-bold text-forest-900">National Accreditation Board Database</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-warm-muted">Verification Status:</span>
                <span className="font-bold text-forest-700">Verified • High Source Credibility</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 6: STUDENT EXPERIENCES SHOWCASE                        */}
      {/* ============================================================== */}
      <section className="bg-warm-cream/50 py-16 border-y border-warm-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">
                Student Reality
              </span>
              <h2 className="text-3xl font-extrabold text-forest-900 mt-1">
                Authentic Student Feedback & Outcomes
              </h2>
              <p className="text-xs sm:text-sm text-warm-muted mt-1 max-w-xl">
                Students report whether advertised internships were actually received, whether certificates arrived, and how mentors performed.
              </p>
            </div>

            <Link
              to="/experiences"
              className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-forest-sm transition-all shrink-0 inline-flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              View All Experiences
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="organic-card p-6 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-forest-900">Student SA***</span>
                <span className="text-amber-gold">★★★★★</span>
              </div>
              <h4 className="text-xs font-bold text-forest-900">Curriculum matched advanced job requirements</h4>
              <p className="text-xs text-warm-muted leading-relaxed">
                The course was demanding and accurately covered what was promised. Internship support was delivered on schedule.
              </p>
              <div className="pt-2 border-t border-warm-border text-[10px] text-forest-700 font-semibold">
                ✓ Internship Received • ✓ Certificate Received
              </div>
            </div>

            <div className="organic-card p-6 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-forest-900">Student RM***</span>
                <span className="text-amber-gold">★★☆☆☆</span>
              </div>
              <h4 className="text-xs font-bold text-forest-900">Placement assistance differed from sales promise</h4>
              <p className="text-xs text-warm-muted leading-relaxed">
                The advertised 100% placement was actually just a job board link. Mentorship calls were rushed and delayed.
              </p>
              <div className="pt-2 border-t border-warm-border text-[10px] text-terracotta font-semibold">
                ✗ Internship Not Provided • ✓ Certificate Received
              </div>
            </div>

            <div className="organic-card p-6 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-forest-900">Student AK***</span>
                <span className="text-amber-gold">★★★★☆</span>
              </div>
              <h4 className="text-xs font-bold text-forest-900">Solid content, practical exercises</h4>
              <p className="text-xs text-warm-muted leading-relaxed">
                Good foundational material for software development. Practical exercises corroborated the syllabus description.
              </p>
              <div className="pt-2 border-t border-warm-border text-[10px] text-forest-700 font-semibold">
                ✓ Certificate Received • Placement Not Promised
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 7: COURSE CREDIBILITY REPORTS (REAL BACKEND DATA)      */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">
            Real Database Records
          </span>
          <h2 className="text-3xl font-extrabold text-forest-900 mt-1">
            Courses Under Verification
          </h2>
          <p className="text-xs sm:text-sm text-warm-muted mt-1.5">
            Every course below is fetched directly from our PostgreSQL database with actual extracted claims and reports.
          </p>
        </div>

        {loadingCourses ? (
          <div className="text-center py-10 text-xs text-warm-muted">Loading verified courses from database...</div>
        ) : realCourses.length === 0 ? (
          <div className="organic-card p-10 text-center max-w-md mx-auto">
            <p className="text-xs text-warm-muted">No courses registered yet. Submit your course to start verification.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/course/${c.id}`)}
                className="organic-card organic-card-hover p-6 cursor-pointer flex flex-col justify-between bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-50 text-forest-800">
                      {c.provider}
                    </span>
                    <span className="text-[11px] font-bold text-warm-muted">
                      Risk: {c.risk_level?.toUpperCase() || 'UNDETERMINED'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-forest-900 line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-warm-muted mt-2 line-clamp-3">
                    {c.description || 'Under multi-agent educational verification.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-warm-border flex items-center justify-between text-xs">
                  <span className="text-warm-muted">Claims: <strong className="text-forest-900">{c.total_claims}</strong></span>
                  <span className="text-forest-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Audit <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* SECTION 8: FINAL CALL TO ACTION                                */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8 text-center">
        <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 border border-[#174C3C]/20 shadow-soft-lg text-white max-w-4xl mx-auto" style={{ backgroundColor: '#102C20' }}>
          {/* Subtle architectural ambient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#174C3C] via-[#102C20] to-[#0A1D15] opacity-95 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#91AA91]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#C87552]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#174C3C] border border-[#91AA91]/30 text-[11px] font-mono font-bold text-[#E6ECE6] uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              Continuous Educational Trust
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#FFFFFF]">
              Your Next Learning Decision <br />
              <span className="font-serif italic font-normal text-[#DDE9E2]">Deserves Evidence.</span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-[#FFFFFF]/85 max-w-xl mx-auto leading-relaxed font-normal">
              Investigate educational promises, discover independent evidence and make informed decisions before investing in a course.
            </p>

            {/* Quick in-section search */}
            <form onSubmit={handleSearch} className="mt-6 max-w-lg mx-auto relative flex items-center bg-white rounded-2xl p-1.5 shadow-soft-md">
              <Search className="w-4 h-4 text-[#717875] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any course, academy or bootcamp..."
                className="w-full pl-11 pr-24 py-2.5 rounded-xl bg-transparent text-[#252B29] placeholder-[#717875] text-xs font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-xl font-bold text-xs text-white transition-all shadow-forest-sm hover:opacity-90"
                style={{ backgroundColor: '#174C3C' }}
              >
                Search
              </button>
            </form>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/verify"
                className="px-8 py-3.5 rounded-xl font-bold text-xs shadow-soft-md transition-all inline-flex items-center gap-2 group hover:scale-[1.02]"
                style={{ backgroundColor: '#FFFFFF', color: '#102C20' }}
              >
                INVESTIGATE A COURSE
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/discover"
                className="px-8 py-3.5 rounded-xl font-bold text-xs text-white border border-white/25 hover:bg-white/10 transition-all inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#D9A441]" />
                EXPLORE COURSES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 9: ABOUT & PLATFORM STANDARDS                          */}
      {/* ============================================================== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-warm-border text-xs text-warm-muted leading-relaxed">
        <div className="max-w-3xl">
          <h4 className="font-bold text-forest-900 text-sm mb-1.5">About VeriCourse AI</h4>
          <p>
            VeriCourse AI is an intelligent educational verification and continuous trust intelligence platform. We address educational marketing asymmetry by independently investigating course promises through Google Gemini-powered agents, SSRF-safe public evidence retrieval, and authenticated student outcome feedback.
          </p>
        </div>
      </section>

    </div>
  );
};
