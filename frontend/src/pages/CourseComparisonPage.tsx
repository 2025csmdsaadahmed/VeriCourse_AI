import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CourseComparisonItem, CourseDiscoveryItem } from '../types';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';

export const CourseComparisonPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [comparisonData, setComparisonData] = useState<CourseComparisonItem[]>([]);
  const [allCourses, setAllCourses] = useState<CourseDiscoveryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const idsParam = searchParams.get('ids') || '';

  useEffect(() => {
    api.get('/courses/discover').then((res) => setAllCourses(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!idsParam) {
      setComparisonData([]);
      return;
    }

    setLoading(true);
    api.get(`/courses/compare?ids=${idsParam}`)
      .then((res) => {
        setComparisonData(res.data.courses || []);
      })
      .catch((err) => {
        console.error('Failed to load comparison', err);
      })
      .finally(() => setLoading(false));
  }, [idsParam]);

  const addCourseToComparison = (courseId: number) => {
    const current = idsParam.split(',').filter(Boolean);
    if (current.includes(String(courseId))) return;
    if (current.length >= 3) {
      alert('Maximum 3 courses can be compared at once.');
      return;
    }
    const updated = [...current, String(courseId)].join(',');
    setSearchParams({ ids: updated });
  };

  const removeCourseFromComparison = (courseId: number) => {
    const current = idsParam.split(',').filter(Boolean);
    const updated = current.filter((id) => id !== String(courseId)).join(',');
    setSearchParams(updated ? { ids: updated } : {});
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-warm-bg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">
            Objective Side-by-Side Analysis
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 mt-1">
            Compare Educational Providers
          </h1>
          <p className="text-warm-muted text-sm mt-1">
            Examine verified claims, conflicting evidence, real student placement rates, and credibility side-by-side.
          </p>
        </div>

        {/* Course Quick Adder */}
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              if (e.target.value) {
                addCourseToComparison(Number(e.target.value));
                e.target.value = '';
              }
            }}
            className="px-4 py-2 rounded-xl bg-white border border-warm-border text-xs text-warm-charcoal font-semibold focus:border-forest-600 focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>+ Add Course to Compare</option>
            {allCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.title} ({c.provider})</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="organic-card p-16 text-center">
          <div className="w-8 h-8 border-4 border-forest-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-warm-muted">Loading side-by-side comparison...</p>
        </div>
      ) : comparisonData.length === 0 ? (
        <div className="organic-card p-16 text-center border-dashed">
          <Scale className="w-12 h-12 text-forest-600 mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-bold text-forest-900">No Courses Selected for Comparison</h3>
          <p className="text-xs text-warm-muted mt-2 mb-6">
            Select 2 or 3 courses from the catalog to compare their fees, claims, evidence, and outcomes.
          </p>
          <Link
            to="/discover"
            className="px-6 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="organic-card overflow-x-auto shadow-soft-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-warm-border bg-warm-cream/50">
                <th className="p-5 font-bold text-warm-muted uppercase tracking-wider w-1/4">Comparison Metric</th>
                {comparisonData.map((item) => (
                  <th key={item.course.id} className="p-5 font-bold text-forest-900 w-1/4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-forest-700">{item.course.provider}</span>
                      <button
                        onClick={() => removeCourseFromComparison(item.course.id)}
                        className="text-xs text-warm-muted hover:text-terracotta"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-sm font-extrabold text-forest-900 line-clamp-2">
                      {item.course.title}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-warm-border/60">
              
              <tr className="hover:bg-warm-bg/60">
                <td className="p-5 font-bold text-warm-charcoal">Credibility Score</td>
                {comparisonData.map((item) => (
                  <td key={item.course.id} className="p-5">
                    {item.credibility_score !== null && item.credibility_score !== undefined ? (
                      <span className="text-xl font-mono font-extrabold text-forest-800">
                        {item.credibility_score}/100
                      </span>
                    ) : (
                      <span className="text-xs text-warm-muted italic">Insufficient Evidence</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-warm-bg/60">
                <td className="p-5 font-bold text-warm-charcoal">Risk Level</td>
                {comparisonData.map((item) => (
                  <td key={item.course.id} className="p-5 capitalize font-bold text-forest-900">
                    {item.risk_level}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-warm-bg/60">
                <td className="p-5 font-bold text-warm-charcoal">Advertised Fee</td>
                {comparisonData.map((item) => (
                  <td key={item.course.id} className="p-5 font-semibold text-warm-charcoal">
                    {item.course.fee ? `$${item.course.fee}` : 'Free / Not Specified'}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-warm-bg/60">
                <td className="p-5 font-bold text-warm-charcoal">Claims Breakdown</td>
                {comparisonData.map((item) => (
                  <td key={item.course.id} className="p-5 space-y-1">
                    <div className="flex items-center gap-1.5 text-forest-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.verified_claims} Verified</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-terracotta font-semibold">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{item.conflicting_claims} Conflicting</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-gold font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{item.unverified_claims} Unverified</span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-warm-bg/60">
                <td className="p-5 font-bold text-warm-charcoal">Evidence Coverage</td>
                {comparisonData.map((item) => (
                  <td key={item.course.id} className="p-5 font-mono text-forest-900 font-bold">
                    {item.evidence_coverage ? `${item.evidence_coverage}%` : '0%'}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-warm-bg/60">
                <td className="p-5 font-bold text-warm-charcoal">Student Placement Outcomes</td>
                {comparisonData.map((item) => (
                  <td key={item.course.id} className="p-5 text-xs text-warm-charcoal">
                    {item.student_metrics && item.student_metrics.total_reviews > 0 ? (
                      <div className="space-y-1">
                        <div>Internships: {item.student_metrics.internships_received} / {item.student_metrics.internships_promised} received</div>
                        <div>Placements: {item.student_metrics.placements_received} / {item.student_metrics.placements_promised} received</div>
                        <div className="text-amber-gold font-bold">★ {item.student_metrics.average_rating} ({item.student_metrics.total_reviews} reviews)</div>
                      </div>
                    ) : (
                      <span className="text-warm-muted italic">No student reports yet</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-5 font-bold text-warm-charcoal">Detailed Report</td>
                {comparisonData.map((item) => (
                  <td key={item.course.id} className="p-5">
                    <Link
                      to={`/course/${item.course.id}`}
                      className="px-4 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 font-bold text-xs inline-flex items-center gap-1 transition-colors border border-forest-200"
                    >
                      Audit Report <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
