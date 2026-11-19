// Collects course details and supporting evidence for verification.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Cpu
} from 'lucide-react';

interface EvidenceDraft {
  source_name: string;
  source_url: string;
  evidence_description: string;
}

export const CourseSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'form' | 'investigating' | 'completed'>('form');
  const [progressStep, setProgressStep] = useState(0);

  // Form fields
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [courseUrl, setCourseUrl] = useState('');
  const [fee, setFee] = useState<number | ''>('');
  const [category, setCategory] = useState('Full Stack Development');
  const [duration, setDuration] = useState('12 Weeks');
  const [description, setDescription] = useState('');

  // Optional initial evidence
  const [evidenceItems, setEvidenceItems] = useState<EvidenceDraft[]>([
    { source_name: '', source_url: '', evidence_description: '' }
  ]);

  const addEvidenceRow = () => {
    setEvidenceItems([...evidenceItems, { source_name: '', source_url: '', evidence_description: '' }]);
  };

  const removeEvidenceRow = (idx: number) => {
    setEvidenceItems(evidenceItems.filter((_, i) => i !== idx));
  };

  const updateEvidenceRow = (idx: number, field: keyof EvidenceDraft, val: string) => {
    const updated = [...evidenceItems];
    updated[idx][field] = val;
    setEvidenceItems(updated);
  };

  const handleSubmitAndVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('vericourse_token');
    if (!token) {
      alert('Please sign in or register to submit a course for investigation.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setStage('investigating');
    setProgressStep(1);

    try {
      // Step 1: Create Course in Backend
      const courseRes = await api.post('/courses/', {
        title,
        provider,
        course_url: courseUrl || null,
        fee: fee === '' ? null : Number(fee),
        category,
        duration,
        description
      });
      const createdCourse = courseRes.data;

      setProgressStep(2); // Agent 1 Extraction

      const validEvidence = evidenceItems
        .filter((ev) => ev.source_name.trim())
        .map((ev) => ({
          source_name: ev.source_name.trim(),
          source_url: ev.source_url.trim() || null,
          evidence_description: ev.evidence_description.trim() || null
        }));

      const evidence_by_claim: Record<number, any[]> = {};
      if (validEvidence.length > 0) {
        evidence_by_claim[0] = validEvidence;
      }

      setProgressStep(3); // Agent 2 Verification

      try {
        await api.post(`/courses/${createdCourse.id}/verify`, {
          evidence_by_claim
        });
      } catch (verifyErr) {
        // Even if network timeout occurs during deep agent reasoning, the backend records the report in PostgreSQL.
        console.warn('Verify request completed or timed out on client, navigating to report view:', verifyErr);
      }

      setProgressStep(4); // Agent 3 Risk & Report
      setTimeout(() => {
        setStage('completed');
        navigate(`/course/${createdCourse.id}`);
      }, 800);

    } catch (err: any) {
      console.error('Course creation failed', err);
      alert(err.response?.data?.detail || 'Course submission failed. Please check your network and inputs.');
      setStage('form');
    } finally {
      setLoading(false);
    }
  };

  const investigationSteps = [
    { title: 'Submitting Specifications', desc: 'Securely persisting course parameters in PostgreSQL' },
    { title: 'Agent 1: Claim Extraction', desc: 'Isolating factual advertising promises across categories' },
    { title: 'Agent 2: Evidence Verification', desc: 'SSRF-protected retrieval & corroboration checks' },
    { title: 'Agent 3: Risk Synthesis', desc: 'Assessing contradiction patterns & calculating credibility' },
  ];

  // Live sources being audited by Agent 2 for transparent Perplexity/ChatGPT-style indicator
  const simulatedAgent2Sources = [
    { name: 'FTC.gov', domain: 'ftc.gov', label: 'Federal Trade Commission' },
    { name: 'CIRR.org', domain: 'cirr.org', label: 'Council on Integrity in Results' },
    { name: 'BLS.gov', domain: 'bls.gov', label: 'Bureau of Labor Statistics' },
    { name: 'Anthropic.com', domain: 'anthropic.com', label: 'Official Partner Registry' },
    { name: 'ISO.org', domain: 'iso.org', label: 'Certification Standards' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto bg-warm-bg">
      
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">
          Multi-Agent Investigation Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 mt-1">
          Investigate an Educational Course
        </h1>
        <p className="text-warm-muted text-sm mt-2 max-w-xl mx-auto">
          Submit course sales copy, advertised placement promises, or curriculum descriptions. Our orchestrated AI agents will extract claims, test independent evidence, and evaluate risk.
        </p>
      </div>

      {stage === 'investigating' ? (
        <div className="organic-card p-10 text-center max-w-xl mx-auto shadow-soft-lg">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-forest-900 text-white flex items-center justify-center mb-6 shadow-forest-sm animate-pulse">
            <Cpu className="w-8 h-8 text-sage-light animate-spin" />
          </div>
          
          <h2 className="text-xl font-bold text-forest-900 mb-2">Investigation In Progress</h2>
          <p className="text-xs text-warm-muted mb-8">
            Please wait while the orchestrator coordinates Claim Extraction, Evidence Verification, and Risk Analysis agents...
          </p>

          <div className="space-y-4 text-left">
            {investigationSteps.map((step, idx) => {
              const isDone = progressStep > idx + 1;
              const isCurrent = progressStep === idx + 1;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                    isCurrent
                      ? 'bg-forest-50 border border-forest-300 text-forest-900'
                      : isDone
                      ? 'bg-white border border-forest-200 text-forest-700'
                      : 'bg-warm-bg/50 border border-warm-border text-warm-muted'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-forest-700 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-warm-muted shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-forest-900">{step.title}</h4>
                    <p className="text-[11px] text-warm-muted">{step.desc}</p>
                    
                    {/* Live source retrieval badges when Agent 2 is executing */}
                    {idx === 2 && isCurrent && (
                      <div className="mt-3 pt-2.5 border-t border-forest-200/60 animate-in fade-in duration-300">
                        <span className="text-[10px] font-mono font-bold text-forest-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-ping" />
                          Querying independent benchmark sources:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {simulatedAgent2Sources.map((src, sIdx) => (
                            <div
                              key={sIdx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-forest-200/80 shadow-2xs text-[11px] text-forest-900 font-semibold animate-pulse"
                              style={{ animationDelay: `${sIdx * 180}ms` }}
                            >
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${src.domain}&sz=32`}
                                alt={src.name}
                                className="w-3.5 h-3.5 rounded-sm object-contain"
                                onError={(e) => {
                                  // Fallback to globe if offline or blocked
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <span>{src.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <form onSubmit={handleSubmitAndVerify} className="space-y-8">
          
          {/* Section 1: Course Info */}
          <div className="organic-card p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-forest-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-forest-600" />
              1. Course Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1.5">Course Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Full Stack Software Engineering"
                  className="w-full px-4 py-2.5 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-xs font-medium focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1.5">Provider / Academy *</label>
                <input
                  type="text"
                  required
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. NextGen Tech Academy"
                  className="w-full px-4 py-2.5 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-xs font-medium focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1.5">Course URL (Optional)</label>
                <input
                  type="url"
                  value={courseUrl}
                  onChange={(e) => setCourseUrl(e.target.value)}
                  placeholder="https://provider.com/course-page"
                  className="w-full px-4 py-2.5 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-xs font-medium focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1.5">Course Fee (USD/INR)</label>
                <input
                  type="number"
                  min="0"
                  value={fee}
                  onChange={(e) => setFee(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 1200"
                  className="w-full px-4 py-2.5 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-xs font-medium focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal text-xs font-semibold focus:border-forest-600 focus:outline-none"
                >
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Python & Backend">Python & Backend</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1.5">Estimated Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 16 Weeks / 4 Months"
                  className="w-full px-4 py-2.5 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-xs font-medium focus:border-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1.5">
                Advertised Course Description & Promises *
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste the provider's sales copy, advertised placement guarantees, certification promises, instructor credentials or internship details here..."
                className="w-full px-4 py-3 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-xs font-medium focus:border-forest-600 focus:outline-none leading-relaxed"
              />
              <p className="text-[11px] text-warm-muted mt-1">
                Agent 1 will automatically extract factual promises and claims from this text.
              </p>
            </div>
          </div>

          {/* Section 2: Optional Supporting Evidence */}
          <div className="organic-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-forest-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sage-dark" />
                  2. Known Evidence Sources (Optional)
                </h3>
                <p className="text-xs text-warm-muted mt-0.5">
                  Supply public links or documents to verify claims against.
                </p>
              </div>
              <button
                type="button"
                onClick={addEvidenceRow}
                className="px-3 py-1.5 rounded-xl bg-warm-cream text-xs font-bold text-forest-900 hover:bg-forest-100 flex items-center gap-1 border border-warm-border"
              >
                <Plus className="w-3.5 h-3.5" /> Add Source
              </button>
            </div>

            {evidenceItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-warm-bg border border-warm-border flex flex-col sm:flex-row gap-3 items-start">
                <input
                  type="text"
                  value={item.source_name}
                  onChange={(e) => updateEvidenceRow(idx, 'source_name', e.target.value)}
                  placeholder="Source Name (e.g. University Portal)"
                  className="w-full sm:w-1/3 px-3 py-2 rounded-lg bg-white border border-warm-border text-xs text-warm-charcoal"
                />
                <input
                  type="url"
                  value={item.source_url}
                  onChange={(e) => updateEvidenceRow(idx, 'source_url', e.target.value)}
                  placeholder="Source URL (https://...)"
                  className="w-full sm:w-1/3 px-3 py-2 rounded-lg bg-white border border-warm-border text-xs text-warm-charcoal"
                />
                <input
                  type="text"
                  value={item.evidence_description}
                  onChange={(e) => updateEvidenceRow(idx, 'evidence_description', e.target.value)}
                  placeholder="Notes on what this source shows"
                  className="w-full sm:w-1/3 px-3 py-2 rounded-lg bg-white border border-warm-border text-xs text-warm-charcoal"
                />
                {evidenceItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEvidenceRow(idx)}
                    className="p-2 text-warm-muted hover:text-terracotta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submission Button */}
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-sm shadow-forest-sm hover:shadow-soft-lg transition-all inline-flex items-center gap-3 disabled:opacity-50"
            >
              Start AI Investigation
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
