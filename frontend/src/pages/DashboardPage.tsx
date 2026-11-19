import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Course } from '../types';
import {
  Clock,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Search,
  UserCheck,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [savedCourses, setSavedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [coursesRes, savedRes] = await Promise.all([
          api.get('/courses/'),
          api.get('/saved-courses/')
        ]);
        setMyCourses(coursesRes.data);
        setSavedCourses(savedRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-warm-bg">
      
      {/* Top Banner */}
      <div className="organic-card p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft-md border border-warm-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            Student Intelligence Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Hello, {user?.full_name || 'Student'}
          </h1>
          <p className="text-warm-muted text-sm sm:text-base mt-2 font-medium max-w-2xl">
            Track your investigated courses, verified claims, risk assessments, and bookmarked educational choices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/verify"
            className="px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-sm shadow-forest-md hover:shadow-forest-lg transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            Investigate New Course <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/discover"
            className="px-5 py-3.5 rounded-xl bg-white hover:bg-warm-bg text-forest-900 font-extrabold text-sm border border-warm-border transition-all shadow-sm hover:border-forest-600"
          >
            Explore Catalog
          </Link>
        </div>
      </div>

      {/* Real Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Courses Submitted */}
        <div className="organic-card p-6 bg-white border border-warm-border hover:-translate-y-1 hover:shadow-soft-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">
              Courses Submitted
            </span>
            <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-forest-900 font-mono">
            {myCourses.length}
          </div>
          <span className="text-xs text-warm-muted mt-2 block font-medium">Investigations registered by you</span>
        </div>

        {/* Card 2: Saved Bookmarks */}
        <div className="organic-card p-6 bg-white border border-warm-border hover:-translate-y-1 hover:shadow-soft-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">
              Saved Bookmarks
            </span>
            <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-dark">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-forest-700 font-mono">
            {savedCourses.length}
          </div>
          <span className="text-xs text-warm-muted mt-2 block font-medium">Bookmarked for comparison</span>
        </div>

        {/* Card 3: Account Role */}
        <div className="organic-card p-6 bg-white border border-warm-border hover:-translate-y-1 hover:shadow-soft-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">
              Account Role
            </span>
            <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold capitalize text-forest-900 tracking-tight">
            {user?.role || 'Student'}
          </div>
          <span className="text-xs text-forest-700 mt-2 block font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse"></span>
            Active verification access
          </span>
        </div>

        {/* Card 4: AI Agents Active */}
        <div className="organic-card p-6 bg-white border border-warm-border hover:-translate-y-1 hover:shadow-soft-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">
              AI Agents Active
            </span>
            <div className="w-9 h-9 rounded-xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-900">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-forest-800 font-mono">
            3 Orchestrated
          </div>
          <span className="text-xs text-warm-muted mt-2 block font-medium">Extraction • Verification • Risk</span>
        </div>

      </div>

      {/* Main Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Your Submissions */}
        <div className="organic-card p-6 sm:p-8 space-y-5 border border-warm-border">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border">
            <h3 className="text-lg font-extrabold text-forest-900 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-forest-700" />
              Course Investigations
            </h3>
            <Link 
              to="/verify" 
              className="px-3 py-1.5 rounded-lg bg-forest-50 hover:bg-forest-100 border border-forest-200 text-xs font-extrabold text-forest-800 transition-colors flex items-center gap-1"
            >
              Start Investigation +
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-14 text-sm font-medium text-warm-muted animate-pulse">
              Loading course investigations...
            </div>
          ) : myCourses.length === 0 ? (
            <div className="p-8 rounded-2xl bg-warm-cream/50 border border-dashed border-warm-border text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center mx-auto text-forest-700">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-forest-900">No courses submitted yet</h4>
              <p className="text-xs sm:text-sm text-warm-muted max-w-sm mx-auto">
                Paste any course link or syllabus promises to trigger our multi-agent verification system.
              </p>
              <Link
                to="/verify"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-xs shadow-forest-sm transition-all"
              >
                Investigate Your First Course <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {myCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/course/${c.id}`)}
                  className="p-4 rounded-xl bg-white hover:bg-warm-cream/40 border border-warm-border hover:border-forest-600 flex items-center justify-between cursor-pointer transition-all group shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-forest-700 uppercase tracking-wider block">
                      {c.provider}
                    </span>
                    <h4 className="text-sm font-extrabold text-forest-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                      {c.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-warm-muted font-medium">
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                      {c.category && (
                        <span className="px-2 py-0.5 rounded-md bg-warm-bg text-[10px] text-warm-charcoal font-semibold">
                          {c.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-forest-800 group-hover:text-forest-900 flex items-center gap-1.5 pl-4 shrink-0">
                    View Report <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Saved Courses */}
        <div className="organic-card p-6 sm:p-8 space-y-5 border border-warm-border">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border">
            <h3 className="text-lg font-extrabold text-forest-900 flex items-center gap-2.5">
              <Bookmark className="w-5 h-5 text-forest-700" />
              Saved Courses
            </h3>
            <Link 
              to="/discover" 
              className="px-3 py-1.5 rounded-lg bg-warm-bg hover:bg-warm-cream border border-warm-border text-xs font-extrabold text-forest-800 transition-colors flex items-center gap-1"
            >
              Browse Catalog +
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-14 text-sm font-medium text-warm-muted animate-pulse">
              Loading saved bookmarks...
            </div>
          ) : savedCourses.length === 0 ? (
            <div className="p-8 rounded-2xl bg-warm-cream/50 border border-dashed border-warm-border text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto text-gold-dark">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-forest-900">No saved courses yet</h4>
              <p className="text-xs sm:text-sm text-warm-muted max-w-sm mx-auto">
                Explore our catalog of verified educational courses and bookmark the ones you wish to compare.
              </p>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-xs shadow-forest-sm transition-all"
              >
                Explore Course Catalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {savedCourses.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => navigate(`/course/${sc.course_id}`)}
                  className="p-4 rounded-xl bg-white hover:bg-warm-cream/40 border border-warm-border hover:border-forest-600 flex items-center justify-between cursor-pointer transition-all group shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-forest-700 uppercase tracking-wider block">
                      {sc.course?.provider || 'Provider'}
                    </span>
                    <h4 className="text-sm font-extrabold text-forest-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                      {sc.course?.title || 'Saved Course'}
                    </h4>
                    <span className="text-xs text-warm-muted font-medium block">
                      Added {new Date(sc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-forest-800 group-hover:text-forest-900 flex items-center gap-1.5 pl-4 shrink-0">
                    Compare <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
