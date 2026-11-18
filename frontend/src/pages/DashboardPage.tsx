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
  Building2
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
      <div className="organic-card p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft-sm">
        <div>
          <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">
            Student Intelligence Workspace
          </span>
          <h1 className="text-3xl font-extrabold text-forest-900 mt-1">
            Hello, {user?.full_name || 'Student'}
          </h1>
          <p className="text-warm-muted text-sm mt-1">
            Track your investigated courses, verified claims, and saved educational decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/verify"
            className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-forest-sm transition-all flex items-center gap-2"
          >
            Investigate New Course <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/discover"
            className="px-5 py-3 rounded-xl bg-white hover:bg-warm-bg text-forest-900 font-bold text-xs border border-warm-border transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      </div>

      {/* Real Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="organic-card p-6 bg-white">
          <span className="text-xs font-bold text-warm-muted uppercase tracking-wider block mb-1">
            Courses Submitted
          </span>
          <div className="text-3xl font-extrabold text-forest-900 font-mono">
            {myCourses.length}
          </div>
          <span className="text-[11px] text-warm-muted mt-1 block">Investigations registered by you</span>
        </div>

        <div className="organic-card p-6 bg-white">
          <span className="text-xs font-bold text-warm-muted uppercase tracking-wider block mb-1">
            Saved Bookmarks
          </span>
          <div className="text-3xl font-extrabold text-forest-700 font-mono">
            {savedCourses.length}
          </div>
          <span className="text-[11px] text-warm-muted mt-1 block">Bookmarked for comparison</span>
        </div>

        <div className="organic-card p-6 bg-white">
          <span className="text-xs font-bold text-warm-muted uppercase tracking-wider block mb-1">
            Account Role
          </span>
          <div className="text-2xl font-extrabold capitalize text-forest-900">
            {user?.role || 'Student'}
          </div>
          <span className="text-[11px] text-warm-muted mt-1 block">Active verification access</span>
        </div>

        <div className="organic-card p-6 bg-white">
          <span className="text-xs font-bold text-warm-muted uppercase tracking-wider block mb-1">
            AI Agents Active
          </span>
          <div className="text-2xl font-extrabold text-forest-800 font-mono">
            3 Orchestrated
          </div>
          <span className="text-[11px] text-warm-muted mt-1 block">Extraction • Verification • Risk</span>
        </div>

      </div>

      {/* Main Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Your Submissions */}
        <div className="organic-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-forest-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-forest-700" />
              Your Course Investigations
            </h3>
            <Link to="/verify" className="text-xs font-bold text-forest-700 hover:underline">
              New +
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs text-warm-muted">Loading your courses...</div>
          ) : myCourses.length === 0 ? (
            <div className="p-8 rounded-2xl bg-warm-bg border border-warm-border text-center text-xs text-warm-muted">
              You haven't submitted any courses for investigation yet.{' '}
              <Link to="/verify" className="text-forest-700 font-bold underline">
                Start your first investigation
              </Link>.
            </div>
          ) : (
            <div className="space-y-3">
              {myCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/course/${c.id}`)}
                  className="p-4 rounded-xl bg-warm-bg/70 hover:bg-warm-bg border border-warm-border flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-forest-700">{c.provider}</span>
                    <h4 className="text-xs font-bold text-forest-900 group-hover:text-forest-700 transition-colors">
                      {c.title}
                    </h4>
                    <span className="text-[10px] text-warm-muted">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-warm-muted group-hover:text-forest-900 flex items-center gap-1">
                    Report <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Saved Courses */}
        <div className="organic-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-forest-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-forest-700" />
              Saved Courses
            </h3>
            <Link to="/discover" className="text-xs font-bold text-forest-700 hover:underline">
              Discover +
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs text-warm-muted">Loading saved courses...</div>
          ) : savedCourses.length === 0 ? (
            <div className="p-8 rounded-2xl bg-warm-bg border border-warm-border text-center text-xs text-warm-muted">
              No saved courses yet.{' '}
              <Link to="/discover" className="text-forest-700 font-bold underline">
                Explore courses to bookmark
              </Link>.
            </div>
          ) : (
            <div className="space-y-3">
              {savedCourses.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => navigate(`/course/${sc.course_id}`)}
                  className="p-4 rounded-xl bg-warm-bg/70 hover:bg-warm-bg border border-warm-border flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-forest-700">
                      {sc.course?.provider || 'Provider'}
                    </span>
                    <h4 className="text-xs font-bold text-forest-900 group-hover:text-forest-700 transition-colors">
                      {sc.course?.title || 'Saved Course'}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-warm-muted group-hover:text-forest-900 flex items-center gap-1">
                    View <ArrowRight className="w-3.5 h-3.5" />
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
