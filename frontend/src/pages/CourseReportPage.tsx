import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Course,
  Claim,
  EvidenceItem,
  VerificationReport,
  StudentExperience,
  ExperienceAggregation
} from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Award,
  Layers,
  ArrowLeft
} from 'lucide-react';

export const CourseReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [evidenceMap, setEvidenceMap] = useState<Record<number, EvidenceItem[]>>({});
  const [experiences, setExperiences] = useState<StudentExperience[]>([]);
  const [experienceSummary, setExperienceSummary] = useState<ExperienceAggregation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const cRes = await api.get(`/courses/${id}`);
        setCourse(cRes.data);

        const rRes = await api.get(`/courses/${id}/reports/`);
        if (rRes.data && rRes.data.length > 0) {
          setReport(rRes.data[rRes.data.length - 1]);
        }

        const clRes = await api.get(`/courses/${id}/claims/`);
        setClaims(clRes.data);

        const evMap: Record<number, EvidenceItem[]> = {};
        for (const claim of clRes.data) {
          try {
            const evRes = await api.get(`/claims/${claim.id}/evidence/`);
            evMap[claim.id] = evRes.data;
          } catch {
            evMap[claim.id] = [];
          }
        }
        setEvidenceMap(evMap);

        try {
          const expRes = await api.get(`/experiences/course/${id}`);
          setExperiences(expRes.data);

          const sumRes = await api.get(`/experiences/course/${id}/summary`);
          setExperienceSummary(sumRes.data);
        } catch {
          // ignore
        }

      } catch (err) {
        console.error('Failed to load course report', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto text-center bg-warm-bg">
        <div className="w-10 h-10 border-4 border-forest-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-warm-muted">Loading comprehensive credibility report...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto text-center bg-warm-bg">
        <h2 className="text-xl font-bold text-forest-900 mb-2">Course Not Found</h2>
        <Link to="/discover" className="text-forest-700 text-xs font-bold underline">
          Return to catalog
        </Link>
      </div>
    );
  }

  const getClaimStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-forest-50 text-forest-800 border border-forest-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </span>
        );
      case 'conflicting':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-terracotta-light text-terracotta border border-terracotta/30">
            <XCircle className="w-3.5 h-3.5" /> Conflicting Evidence
          </span>
        );
      case 'unverified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-soft text-amber-gold border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" /> Unverified Promise
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-warm-cream text-warm-muted border border-warm-border">
            <HelpCircle className="w-3.5 h-3.5" /> Insufficient Evidence
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 bg-warm-bg">
      
      {/* Back button */}
      <Link to="/discover" className="inline-flex items-center gap-2 text-xs font-bold text-warm-muted hover:text-forest-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {/* Header: Course Title & Overview */}
      <div className="organic-card p-8 sm:p-10 shadow-soft-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-forest-50 text-forest-800 border border-forest-200">
                {course.provider}
              </span>
              <span className="text-xs text-warm-muted font-medium">
                Submitted {new Date(course.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight">
              {course.title}
            </h1>
            {course.course_url && (
              <a
                href={course.course_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:underline"
              >
                View Advertised Course Page <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <Link
            to={`/experiences?course_id=${course.id}`}
            className="px-5 py-2.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 font-bold text-xs border border-forest-200 inline-flex items-center gap-2 transition-colors shrink-0"
          >
            <MessageSquare className="w-4 h-4 text-forest-700" />
            Share Your Experience
          </Link>
        </div>
      </div>

      {/* OVERALL ASSESSMENT METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Credibility Score */}
        <div className="organic-card p-6 bg-white shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">Credibility Score</span>
            <ShieldCheck className="w-4 h-4 text-forest-700" />
          </div>
          {report?.credibility_score !== null && report?.credibility_score !== undefined ? (
            <div>
              <div className="text-3xl font-extrabold text-forest-900 font-mono">
                {report.credibility_score}<span className="text-base text-warm-muted">/100</span>
              </div>
              <p className="text-[11px] text-warm-muted mt-1">Empirically computed from claims & verified records</p>
            </div>
          ) : (
            <div>
              <div className="text-sm font-bold text-amber-gold mt-1">Unavailable</div>
              <p className="text-[11px] text-warm-muted mt-1">Insufficient evidence retrieved to compute score</p>
            </div>
          )}
        </div>

        {/* Evidence Coverage */}
        <div className="organic-card p-6 bg-white shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">Evidence Coverage</span>
            <Layers className="w-4 h-4 text-sage-dark" />
          </div>
          <div className="text-3xl font-extrabold text-forest-900 font-mono">
            {report?.evidence_coverage || 0}%
          </div>
          <p className="text-[11px] text-warm-muted mt-1">
            Percentage of claims tested against independent sources
          </p>
        </div>

        {/* Risk Level */}
        <div className="organic-card p-6 bg-white shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">Risk Level</span>
            <AlertTriangle className="w-4 h-4 text-amber-gold" />
          </div>
          <div className="text-2xl font-extrabold capitalize text-forest-900">
            {report?.risk_level || 'Undetermined'}
          </div>
          <p className="text-[11px] text-warm-muted mt-1">
            Risk rating evaluated by Agent 3
          </p>
        </div>

        {/* Total Claims Evaluated */}
        <div className="organic-card p-6 bg-white shadow-soft-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">Claims Audited</span>
            <Award className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-3xl font-extrabold text-forest-900 font-mono">
            {claims.length}
          </div>
          <p className="text-[11px] text-warm-muted mt-1">
            Extracted promises categorized by Agent 1
          </p>
        </div>

      </div>

      {/* CLAIMS ANALYSIS & ASSOCIATED EVIDENCE */}
      <section className="organic-card p-8 sm:p-10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-600" />
            Extracted Claims & Evidence Corroboration
          </h2>
          <p className="text-xs text-warm-muted mt-1">
            Every explicit advertising claim extracted from the course description, along with retrieved evidence and findings.
          </p>
        </div>

        {claims.length === 0 ? (
          <p className="text-xs text-warm-muted italic">No claims have been extracted yet.</p>
        ) : (
          <div className="space-y-4">
            {claims.map((claim, idx) => {
              const evidenceList = evidenceMap[claim.id] || [];
              return (
                <div key={claim.id} className="p-6 rounded-2xl bg-warm-bg/70 border border-warm-border space-y-3">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-forest-700">
                      Claim #{idx + 1} • {claim.claim_category.replace(/_/g, ' ')}
                    </span>
                    <div>{getClaimStatusBadge(claim.verification_status)}</div>
                  </div>

                  <p className="text-sm font-bold text-forest-900 leading-relaxed">
                    “{claim.claim_text}”
                  </p>

                  {evidenceList.length > 0 ? (
                    <div className="pt-3 border-t border-warm-border space-y-2">
                      <span className="text-[11px] font-bold text-warm-muted uppercase tracking-wider block">
                        Corroborating Evidence ({evidenceList.length} Source{evidenceList.length > 1 ? 's' : ''}):
                      </span>

                      {evidenceList.map((ev) => {
                        // Extract hostname/domain for real website favicon
                        let domain = 'education-standards.org';
                        try {
                          if (ev.source_url && ev.source_url.startsWith('http')) {
                            domain = new URL(ev.source_url).hostname.replace('www.', '');
                          } else if (ev.source_name.toLowerCase().includes('ftc')) {
                            domain = 'ftc.gov';
                          } else if (ev.source_name.toLowerCase().includes('cirr')) {
                            domain = 'cirr.org';
                          } else if (ev.source_name.toLowerCase().includes('anthropic')) {
                            domain = 'anthropic.com';
                          } else if (ev.source_name.toLowerCase().includes('iso')) {
                            domain = 'iso.org';
                          } else if (ev.source_name.toLowerCase().includes('bls')) {
                            domain = 'bls.gov';
                          }
                        } catch {
                          domain = 'education-standards.org';
                        }

                        return (
                          <div key={ev.id} className="p-4 rounded-xl bg-white border border-warm-border text-xs space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-6 h-6 rounded-md bg-warm-bg border border-warm-border flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                  <img
                                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                                    alt={ev.source_name}
                                    className="w-4 h-4 object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                                <span className="font-bold text-forest-900 text-xs sm:text-sm truncate">
                                  {ev.source_name}
                                </span>
                              </div>
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-forest-50 border border-forest-200 text-forest-800 font-mono font-bold shrink-0">
                                Credibility: {ev.source_credibility || 'Unknown'}
                              </span>
                            </div>

                            {ev.source_url && (
                              <a
                                href={ev.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-forest-700 font-semibold hover:underline flex items-center gap-1.5 text-[11px] truncate max-w-lg pl-8.5"
                              >
                                <span className="truncate">{ev.source_url}</span> <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            )}

                            {ev.verification_explanation && (
                              <p className="text-warm-charcoal/90 text-xs leading-relaxed pl-8.5 pt-0.5">
                                {ev.verification_explanation}
                              </p>
                            )}

                            {ev.verification_limitations && (
                              <p className="text-warm-muted italic text-[11px] pl-8.5">
                                Limitation: {ev.verification_limitations}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-warm-muted italic pt-2 border-t border-warm-border/60">
                      No independent documentary evidence was provided or retrieved for this claim.
                    </p>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* STUDENT EXPERIENCE & OUTCOME INTELLIGENCE */}
      <section className="organic-card p-8 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sage-dark" />
              Student Experience & Outcome Intelligence
            </h2>
            <p className="text-xs text-warm-muted mt-1">
              Self-reported metrics from verified enrolled students comparing advertised promises to real outcomes.
            </p>
          </div>
          <Link
            to={`/experiences?course_id=${course.id}`}
            className="text-xs font-bold text-forest-700 hover:underline"
          >
            Submit Review +
          </Link>
        </div>

        {experienceSummary && experienceSummary.total_reviews > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-2">
            <div className="p-4 rounded-xl bg-warm-bg border border-warm-border text-center">
              <span className="text-[10px] uppercase font-bold text-warm-muted">Internships Promised</span>
              <div className="text-xl font-bold text-forest-900 mt-1">{experienceSummary.internships_promised}</div>
            </div>
            <div className="p-4 rounded-xl bg-warm-bg border border-warm-border text-center">
              <span className="text-[10px] uppercase font-bold text-warm-muted">Internships Received</span>
              <div className="text-xl font-bold text-forest-700 mt-1">{experienceSummary.internships_received}</div>
            </div>
            <div className="p-4 rounded-xl bg-warm-bg border border-warm-border text-center">
              <span className="text-[10px] uppercase font-bold text-warm-muted">Placements Promised</span>
              <div className="text-xl font-bold text-forest-900 mt-1">{experienceSummary.placements_promised}</div>
            </div>
            <div className="p-4 rounded-xl bg-warm-bg border border-warm-border text-center">
              <span className="text-[10px] uppercase font-bold text-warm-muted">Placements Received</span>
              <div className="text-xl font-bold text-forest-700 mt-1">{experienceSummary.placements_received}</div>
            </div>
          </div>
        ) : null}

        {experiences.length === 0 ? (
          <div className="p-6 rounded-2xl bg-warm-bg border border-warm-border text-center text-xs text-warm-muted">
            No student experiences reported for this course yet.{' '}
            <Link to={`/experiences?course_id=${course.id}`} className="text-forest-700 font-bold underline">
              Be the first to share your experience
            </Link>.
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-5 rounded-xl bg-warm-bg border border-warm-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-forest-900">{exp.student_name || 'Enrolled Student'}</span>
                  <span className="text-amber-gold">{'★'.repeat(exp.rating)}{'☆'.repeat(5 - exp.rating)}</span>
                </div>
                {exp.review_title && (
                  <h4 className="text-xs font-bold text-forest-900">{exp.review_title}</h4>
                )}
                <p className="text-xs text-warm-charcoal leading-relaxed">{exp.review_text}</p>
                <div className="flex flex-wrap gap-2 text-[10px] text-warm-muted pt-2 border-t border-warm-border/60">
                  <span>Internship: {exp.internship_received ? '✓ Received' : '✗ Not Received'}</span>
                  <span>•</span>
                  <span>Placement: {exp.placement_received ? '✓ Received' : '✗ Not Received'}</span>
                  <span>•</span>
                  <span>Certificate: {exp.certificate_received ? '✓ Received' : '✗ Pending'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* RISK ANALYSIS & RECOMMENDATIONS */}
      {report && (
        <section className="organic-card p-8 sm:p-10 space-y-4">
          <h2 className="text-lg font-bold text-forest-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
            Agent 3: Risk Assessment & Recommendation
          </h2>

          <div className="space-y-4 text-xs text-warm-charcoal leading-relaxed">
            <div>
              <h4 className="font-bold text-forest-900 uppercase tracking-wider mb-1">Investigation Summary</h4>
              <p className="p-4 rounded-xl bg-warm-bg border border-warm-border">
                {report.summary || 'Summary pending verification.'}
              </p>
            </div>

            {report.recommendations && (
              <div>
                <h4 className="font-bold text-forest-900 uppercase tracking-wider mb-1">Actionable Recommendations</h4>
                <div className="p-4 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal whitespace-pre-line leading-relaxed">
                  {report.recommendations}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
};
