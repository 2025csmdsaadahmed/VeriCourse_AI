import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, AlertTriangle, Check, X, Flag } from 'lucide-react';
import { StudentExperience, User } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [experiences, setExperiences] = useState<StudentExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ovRes, uRes, expRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/users'),
        api.get('/admin/experiences/pending')
      ]);
      setOverview(ovRes.data);
      setUsersList(uRes.data);
      setExperiences(expRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleModerate = async (experienceId: number, action: string) => {
    try {
      await api.put(`/admin/experiences/${experienceId}/moderate?action=${action}`);
      alert(`Review has been ${action}d.`);
      fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Moderation failed');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center max-w-xl mx-auto bg-warm-bg">
        <AlertTriangle className="w-12 h-12 text-terracotta mx-auto mb-4" />
        <h2 className="text-xl font-bold text-forest-900 mb-2">Access Denied</h2>
        <p className="text-xs text-warm-muted">
          Administrator privileges are required to access this control center.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-warm-bg">
      
      {/* Header */}
      <div>
        <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">
          Compliance & Moderation
        </span>
        <h1 className="text-3xl font-extrabold text-forest-900 mt-1">Platform Admin Center</h1>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="organic-card p-5 bg-white">
            <span className="text-[10px] font-bold text-warm-muted uppercase">Registered Students</span>
            <div className="text-2xl font-bold text-forest-900 mt-1">{overview.total_users}</div>
          </div>
          <div className="organic-card p-5 bg-white">
            <span className="text-[10px] font-bold text-warm-muted uppercase">Courses Verified</span>
            <div className="text-2xl font-bold text-forest-700 mt-1">{overview.total_courses}</div>
          </div>
          <div className="organic-card p-5 bg-white">
            <span className="text-[10px] font-bold text-warm-muted uppercase">Student Reviews</span>
            <div className="text-2xl font-bold text-forest-900 mt-1">{overview.total_experiences}</div>
          </div>
          <div className="organic-card p-5 bg-white">
            <span className="text-[10px] font-bold text-warm-muted uppercase">Flagged Reviews</span>
            <div className="text-2xl font-bold text-terracotta mt-1">{overview.flagged_experiences}</div>
          </div>
        </div>
      )}

      {/* Moderation Queue */}
      <div className="organic-card p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-forest-900">Student Experience Moderation Queue</h3>
        
        {loading ? (
          <p className="text-xs text-warm-muted">Loading moderation queue...</p>
        ) : experiences.length === 0 ? (
          <p className="text-xs text-warm-muted italic">No reviews require moderation at this time.</p>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl bg-warm-bg border border-warm-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest-900">{exp.student_name}</span>
                    <span className="text-warm-muted">• {exp.course_title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      exp.moderation_status === 'approved' ? 'bg-forest-50 text-forest-800' : 'bg-terracotta-light text-terracotta'
                    }`}>
                      {exp.moderation_status}
                    </span>
                  </div>
                  <p className="text-warm-charcoal italic">"{exp.review_text}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleModerate(exp.id, 'approve')}
                    className="px-3 py-1.5 rounded-lg bg-forest-50 text-forest-800 font-bold hover:bg-forest-100 flex items-center gap-1 border border-forest-200"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleModerate(exp.id, 'flag')}
                    className="px-3 py-1.5 rounded-lg bg-amber-soft text-amber-gold font-bold hover:bg-amber-100 flex items-center gap-1 border border-amber-300"
                  >
                    <Flag className="w-3.5 h-3.5" /> Flag
                  </button>
                  <button
                    onClick={() => handleModerate(exp.id, 'reject')}
                    className="px-3 py-1.5 rounded-lg bg-terracotta-light text-terracotta font-bold hover:bg-terracotta/20 flex items-center gap-1 border border-terracotta/30"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
