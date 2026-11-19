import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Course, StudentExperience } from '../types';
import {
  MessageSquare,
  ShieldCheck,
  Star,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const StudentExperiencesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseIdParam = searchParams.get('course_id');

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>(
    courseIdParam ? Number(courseIdParam) : ''
  );
  const [experiences, setExperiences] = useState<StudentExperience[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [enrollmentStatus, setEnrollmentStatus] = useState('completed');
  const [completionStatus, setCompletionStatus] = useState(true);
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  const [internshipPromised, setInternshipPromised] = useState(true);
  const [internshipReceived, setInternshipReceived] = useState(false);
  const [placementPromised, setPlacementPromised] = useState(true);
  const [placementReceived, setPlacementReceived] = useState(false);
  const [certificateReceived, setCertificateReceived] = useState(true);
  const [rating, setRating] = useState(3);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/courses/discover').then((res) => setCourses(res.data)).catch(() => {});
  }, []);

  const fetchExperiences = async (courseId: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/experiences/course/${courseId}`);
      setExperiences(res.data);
    } catch (err) {
      console.error('Failed to load experiences', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      fetchExperiences(Number(selectedCourseId));
    } else {
      setExperiences([]);
    }
  }, [selectedCourseId]);

  const handleSubmitExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('vericourse_token');
    if (!token) {
      alert('Please sign in or register to submit your student experience.');
      navigate('/login');
      return;
    }

    if (!selectedCourseId) {
      alert('Please select a course.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/experiences/', {
        course_id: Number(selectedCourseId),
        enrollment_status: enrollmentStatus,
        completion_status: completionStatus,
        amount_paid: amountPaid === '' ? null : Number(amountPaid),
        internship_promised: internshipPromised,
        internship_received: internshipReceived,
        placement_promised: placementPromised,
        placement_received: placementReceived,
        certificate_received: certificateReceived,
        rating,
        review_title: reviewTitle || null,
        review_text: reviewText
      });

      alert('Experience submitted successfully!');
      setShowSubmitModal(false);
      setReviewTitle('');
      setReviewText('');
      fetchExperiences(Number(selectedCourseId));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 bg-warm-bg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-forest-700 uppercase tracking-wider">
            Verified Student Outcomes
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-900 mt-1">
            Real Student Experiences
          </h1>
          <p className="text-warm-muted text-sm mt-1">
            Anonymous and protected feedback from enrolled students documenting promise fulfilment versus reality.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-forest-sm hover:shadow-soft-lg transition-all shrink-0"
        >
          + Submit Your Experience
        </button>
      </div>

      {/* Course Filter Selector */}
      <div className="organic-card p-4 flex items-center gap-3">
        <label className="text-xs font-bold text-forest-900">Filter by Course:</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value === '' ? '' : Number(e.target.value))}
          className="px-3.5 py-2 rounded-xl bg-warm-bg border border-warm-border text-xs text-warm-charcoal font-semibold focus:border-forest-600 focus:outline-none flex-1 max-w-md"
        >
          <option value="">Select a Course...</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title} — {c.provider}</option>
          ))}
        </select>
      </div>

      {/* Review Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-2xl w-full organic-card p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-soft-lg">
            <h3 className="text-xl font-bold text-forest-900 mb-1">Share Course Experience</h3>
            <p className="text-xs text-warm-muted mb-6">
              Your personal identity is strictly protected. Experiences are published as anonymized student feedback.
            </p>

            <form onSubmit={handleSubmitExperience} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-forest-900 font-bold mb-1">Course</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal font-medium"
                >
                  <option value="">Select Course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title} ({c.provider})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-forest-900 font-bold mb-1">Enrollment Status</label>
                  <select
                    value={enrollmentStatus}
                    onChange={(e) => setEnrollmentStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal font-medium"
                  >
                    <option value="enrolled">Currently Enrolled</option>
                    <option value="completed">Completed Course</option>
                    <option value="dropped_out">Dropped Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-forest-900 font-bold mb-1">Fee Paid (Approximate)</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1500"
                    className="w-full px-3 py-2 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal font-medium"
                  />
                </div>
              </div>

              {/* Promises vs Reality Checklist */}
              <div className="p-4 rounded-xl bg-warm-bg border border-warm-border space-y-3">
                <span className="font-bold text-forest-900 block text-xs">Promises vs. Outcomes</span>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-warm-charcoal font-medium">
                    <input
                      type="checkbox"
                      checked={internshipPromised}
                      onChange={(e) => setInternshipPromised(e.target.checked)}
                      className="rounded border-warm-border text-forest-700"
                    />
                    Internship Promised?
                  </label>
                  <label className="flex items-center gap-2 text-forest-800 font-bold">
                    <input
                      type="checkbox"
                      checked={internshipReceived}
                      onChange={(e) => setInternshipReceived(e.target.checked)}
                      className="rounded border-warm-border text-forest-700"
                    />
                    Internship Received?
                  </label>

                  <label className="flex items-center gap-2 text-warm-charcoal font-medium">
                    <input
                      type="checkbox"
                      checked={placementPromised}
                      onChange={(e) => setPlacementPromised(e.target.checked)}
                      className="rounded border-warm-border text-forest-700"
                    />
                    Job Placement Promised?
                  </label>
                  <label className="flex items-center gap-2 text-forest-800 font-bold">
                    <input
                      type="checkbox"
                      checked={placementReceived}
                      onChange={(e) => setPlacementReceived(e.target.checked)}
                      className="rounded border-warm-border text-forest-700"
                    />
                    Job Placement Received?
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-forest-900 font-bold mb-1">Overall Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-xl ${rating >= star ? 'text-amber-gold' : 'text-warm-border'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-forest-900 font-bold mb-1">Review Title</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summary of your experience..."
                  className="w-full px-3 py-2 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal"
                />
              </div>

              <div>
                <label className="block text-forest-900 font-bold mb-1">Detailed Written Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Describe instructor quality, curriculum modernness, internship support, or discrepancies between marketing promises and real outcomes..."
                  className="w-full px-3 py-2 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-warm-cream text-warm-charcoal font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-forest-900 text-white font-bold"
                >
                  {submitting ? 'Submitting...' : 'Post Experience'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Experiences List */}
      {!selectedCourseId ? (
        <div className="organic-card p-16 text-center border-dashed">
          <MessageSquare className="w-10 h-10 text-forest-600 mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-forest-900">Select a Course to View Student Outcomes</h3>
          <p className="text-xs text-warm-muted mt-1">
            Choose any course from the dropdown above to inspect enrolled student reports.
          </p>
        </div>
      ) : loading ? (
        <div className="organic-card p-16 text-center">
          <div className="w-8 h-8 border-4 border-forest-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-warm-muted">Loading student reviews...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="organic-card p-16 text-center border-dashed">
          <p className="text-sm text-forest-900 font-bold">No student experiences submitted for this course yet.</p>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="mt-4 px-5 py-2 rounded-xl bg-forest-900 text-white font-bold text-xs"
          >
            Be the First to Submit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="organic-card p-6 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-forest-900 text-sm">{exp.student_name}</span>
                  <span className="block text-[10px] text-warm-muted">
                    Status: {exp.enrollment_status.toUpperCase()}
                  </span>
                </div>
                <span className="text-amber-gold text-sm">
                  {'★'.repeat(exp.rating)}{'☆'.repeat(5 - exp.rating)}
                </span>
              </div>

              {exp.review_title && (
                <h4 className="text-xs font-bold text-forest-900">{exp.review_title}</h4>
              )}

              <p className="text-xs text-warm-charcoal leading-relaxed">{exp.review_text}</p>

              <div className="pt-3 border-t border-warm-border flex flex-wrap gap-2 text-[11px]">
                <span className={`px-2 py-0.5 rounded font-bold ${exp.internship_received ? 'bg-forest-50 text-forest-700' : 'bg-terracotta-light text-terracotta'}`}>
                  Internship: {exp.internship_received ? 'Received' : 'Not received'}
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${exp.placement_received ? 'bg-forest-50 text-forest-700' : 'bg-terracotta-light text-terracotta'}`}>
                  Placement: {exp.placement_received ? 'Placed' : 'Not placed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
