// Lets students search, filter, and sort courses in the discovery view.
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CourseDiscoveryItem } from '../types';
import {
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Scale,
  Sparkles,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';

export const CourseDiscoveryPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseDiscoveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const navigate = useNavigate();

  const categories = [
    'All',
    'Full Stack Development',
    'Data Science & AI',
    'Python & Backend',
    'Cloud & DevOps',
    'Cybersecurity',
    'UI/UX Design'
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append('query', query.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (sortBy) params.append('sort_by', sortBy);

      const res = await api.get(`/courses/discover?${params.toString()}`);
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCourses = async () => {
    try {
      const token = localStorage.getItem('vericourse_token');
      if (!token) return;
      const res = await api.get('/saved-courses/');
      setSavedIds(res.data.map((item: any) => item.course_id));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSavedCourses();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  const toggleSave = async (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('vericourse_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (savedIds.includes(courseId)) {
        await api.delete(`/saved-courses/${courseId}`);
        setSavedIds((prev) => prev.filter((id) => id !== courseId));
      } else {
        await api.post(`/saved-courses/${courseId}`);
        setSavedIds((prev) => [...prev, courseId]);
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const toggleComparison = (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedForComparison.includes(courseId)) {
      setSelectedForComparison((prev) => prev.filter((id) => id !== courseId));
    } else {
      if (selectedForComparison.length >= 3) {
        alert('You can compare a maximum of 3 courses at a time.');
        return;
      }
      setSelectedForComparison((prev) => [...prev, courseId]);
    }
  };

  const getRiskBadge = (level?: string) => {
    switch (level) {
      case 'low':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-forest-50 text-forest-800 border border-forest-200">Low Risk</span>;
      case 'medium':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-soft text-amber-gold border border-amber-300">Medium Risk</span>;
      case 'high':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-terracotta-light text-terracotta border border-terracotta/30">High Risk</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-warm-cream text-warm-muted border border-warm-border">Undetermined</span>;
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-warm-bg">
      
      {/* Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">Independent Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 mt-1">Explore & Investigate Courses</h1>
          <p className="text-warm-muted text-sm mt-1">
            Discover courses with objective evidence coverage, extracted claim audits, and verified student feedback.
          </p>
        </div>

        {selectedForComparison.length > 0 && (
          <div className="organic-card p-3 px-5 flex items-center gap-4 border-forest-600/30 shadow-soft-md animate-pulse">
            <span className="text-xs text-forest-900 font-bold">
              {selectedForComparison.length} of 3 selected to compare
            </span>
            <button
              onClick={() => navigate(`/compare?ids=${selectedForComparison.join(',')}`)}
              className="px-4 py-1.5 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800"
            >
              Compare Now
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="organic-card p-4 mb-8 flex flex-col md:flex-row gap-4">
        
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-warm-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course title, keywords, or provider name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-xs font-medium focus:border-forest-600 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal text-xs font-semibold focus:border-forest-600 focus:outline-none"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="credibility">Sort by: Credibility Score</option>
            <option value="rating">Sort by: Student Rating</option>
          </select>
        </div>

      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-forest-900 text-white shadow-forest-sm'
                : 'bg-white text-warm-muted hover:text-forest-900 border border-warm-border hover:border-warm-borderLight'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-white/60 animate-pulse border border-warm-border" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="organic-card p-16 text-center max-w-xl mx-auto border-dashed">
          <Sparkles className="w-10 h-10 text-forest-600 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-forest-900">No Courses Found</h3>
          <p className="text-xs text-warm-muted mt-2 mb-6">
            No courses matched your query. Be the first to submit this course for AI investigation!
          </p>
          <Link
            to="/verify"
            className="px-6 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800"
          >
            Submit & Verify Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/course/${c.id}`)}
              className="organic-card organic-card-hover p-6 flex flex-col justify-between cursor-pointer group relative bg-white"
            >
              <div>
                {/* Header row: provider & bookmark */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-forest-50 text-forest-800 border border-forest-100">
                    {c.provider}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleSave(c.id, e)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        savedIds.includes(c.id)
                          ? 'text-forest-700 bg-forest-50'
                          : 'text-warm-muted hover:text-forest-900'
                      }`}
                      title={savedIds.includes(c.id) ? 'Saved' : 'Save Course'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                    {getRiskBadge(c.risk_level)}
                  </div>
                </div>

                {/* Course Title */}
                <h3 className="text-base font-bold text-forest-900 group-hover:text-forest-700 transition-colors line-clamp-2">
                  {c.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-warm-muted mt-2 line-clamp-3 leading-relaxed">
                  {c.description || 'Verified through independent multi-agent educational investigation.'}
                </p>
              </div>

              {/* Metrics */}
              <div className="pt-6 mt-6 border-t border-warm-border space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-warm-muted font-medium">Credibility Score</span>
                  <span className="font-extrabold text-forest-900">
                    {c.credibility_score !== null && c.credibility_score !== undefined ? (
                      <span className="text-forest-700 font-mono text-sm">{c.credibility_score}/100</span>
                    ) : (
                      <span className="text-warm-muted italic text-[11px]">Insufficient evidence</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-warm-muted font-medium">Claims Audited</span>
                  <span className="text-warm-charcoal font-semibold">
                    {c.verified_claims} / {c.total_claims} verified
                  </span>
                </div>

                {/* Action Footer */}
                <div className="pt-3 flex items-center justify-between border-t border-warm-border/60">
                  <button
                    onClick={(e) => toggleComparison(c.id, e)}
                    className={`text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                      selectedForComparison.includes(c.id)
                        ? 'text-forest-800'
                        : 'text-warm-muted hover:text-forest-900'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    {selectedForComparison.includes(c.id) ? 'Selected' : 'Compare'}
                  </button>

                  <span className="text-xs font-bold text-forest-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Report <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
