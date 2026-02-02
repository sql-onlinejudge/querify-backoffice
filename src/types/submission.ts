export type SubmissionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED';

export type SubmissionVerdict =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'INVALID_QUERY';

export interface Submission {
  id: number;
  problemId: number;
  userId: string;
  status: SubmissionStatus;
  verdict: SubmissionVerdict | null;
  createdAt: string;
}

export interface SubmissionDetail extends Submission {
  query: string;
}

export interface SubmissionFilters {
  status?: SubmissionStatus;
  verdict?: SubmissionVerdict;
}
