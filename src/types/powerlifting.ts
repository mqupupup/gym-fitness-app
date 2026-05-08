export interface PowerliftingAssessment {
  total: number;
  bodyWeight: number;
  coefficient: string;
  coefficientValue: number;
  normalizedScore: number;
  level: string;
}

export interface AssessmentResult {
  assessments: PowerliftingAssessment[];
  overallLevel: string;
}

export type Gender = "male" | "female";
export type CoefficientType = "ipf_gl" | "dots" | "wilks";

// API 相关类型
export interface ApiAssessmentRequest {
  gender: Gender;
  bodyWeight: number;
  squat: number;
  bench: number;
  deadlift: number;
  coefficientType: CoefficientType;
}

export interface ApiResponse {
  success: boolean;
  data?: AssessmentResult;
  error?: string;
}
