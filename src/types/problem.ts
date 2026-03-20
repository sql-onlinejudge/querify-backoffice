import type { CreateTestcaseInput } from './testcase';

export interface Column {
  name: string;
  type: string;
  nullable?: boolean;
  constraints?: string[];
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface SchemaMetadata {
  tables: Table[];
}

export type TrialStatus = 'NOT_ATTEMPTED' | 'ATTEMPTED' | 'SOLVED';

export interface Problem {
  id: number;
  title: string;
  description: string;
  schemaSql: string;
  schemaMetadata: SchemaMetadata;
  difficulty: number;
  timeLimit: number;
  isOrderSensitive: boolean;
  solvedCount: number;
  submissionCount: number;
  trialStatus: TrialStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemListItem {
  id: number;
  title: string;
  difficulty: number;
  solvedCount: number;
  submissionCount: number;
  trialStatus: TrialStatus;
  createdAt: string;
}

export interface CreateProblemRequest {
  title: string;
  description: string;
  schemaMetadata: SchemaMetadata;
  difficulty: number;
  timeLimit: number;
  isOrderSensitive: boolean;
  testcases: CreateTestcaseInput[];
}

export interface UpdateProblemRequest {
  title?: string;
  description?: string;
}

export interface ProblemFilters {
  keyword?: string;
  minDifficulty?: number;
  maxDifficulty?: number;
}
