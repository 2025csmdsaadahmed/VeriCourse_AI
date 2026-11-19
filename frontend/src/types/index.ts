export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Course {
  id: number;
  title: string;
  provider: string;
  course_url?: string;
  description?: string;
  fee?: number;
  category?: string;
  duration?: string;
  submitted_by?: number;
  created_at: string;
}

export interface CourseDiscoveryItem extends Course {
  credibility_score?: number | null;
  evidence_coverage?: number | null;
  risk_level?: 'low' | 'medium' | 'high' | 'undetermined';
  total_claims: number;
  verified_claims: number;
  student_rating?: number | null;
  total_reviews: number;
}

export interface Claim {
  id: number;
  course_id: number;
  claim_text: string;
  claim_category: string;
  verification_status: 'verified' | 'conflicting' | 'unverified' | 'insufficient_evidence' | 'not_checked';
  extracted_at: string;
}

export interface EvidenceItem {
  id: number;
  claim_id: number;
  source_name: string;
  source_url?: string;
  evidence_description?: string;
  evidence_status: string;
  source_credibility?: string;
  evidence_relevance?: string;
  verification_explanation?: string;
  verification_limitations?: string;
  page_title?: string;
  content_hash?: string;
  fetched_at?: string;
  checked_at: string;
}

export interface VerificationReport {
  id: number;
  course_id: number;
  overall_status: string;
  risk_level: 'low' | 'medium' | 'high' | 'undetermined';
  credibility_score?: number | null;
  evidence_coverage?: number | null;
  summary?: string;
  recommendations?: string;
  generated_at: string;
}

export interface StudentExperience {
  id: number;
  course_id: number;
  user_id: number;
  enrollment_status: string;
  completion_status: boolean;
  amount_paid?: number;
  internship_promised: boolean;
  internship_received: boolean;
  placement_promised: boolean;
  placement_received: boolean;
  certificate_received: boolean;
  rating: number;
  review_title?: string;
  review_text: string;
  moderation_status: string;
  is_verified_student: boolean;
  created_at: string;
  student_name?: string;
  course_title?: string;
}

export interface ExperienceAggregation {
  total_reviews: number;
  average_rating: number;
  internships_promised: number;
  internships_received: number;
  placements_promised: number;
  placements_received: number;
  certificates_received: number;
  positive_count: number;
  mixed_count: number;
  negative_count: number;
}

export interface CourseComparisonItem {
  course: Course;
  credibility_score?: number | null;
  evidence_coverage?: number | null;
  risk_level?: string;
  total_claims: number;
  verified_claims: number;
  conflicting_claims: number;
  unverified_claims: number;
  student_metrics?: ExperienceAggregation | null;
}
