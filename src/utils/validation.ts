import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

export const columnSchema = z.object({
  name: z.string().min(1, '컬럼명을 입력하세요'),
  type: z.string().min(1, '타입을 선택하세요'),
  nullable: z.boolean().optional(),
  constraints: z.array(z.string()).optional(),
});

export const tableSchema = z.object({
  name: z.string().min(1, '테이블명을 입력하세요'),
  columns: z.array(columnSchema).min(1, '컬럼을 1개 이상 추가하세요'),
});

export const schemaMetadataSchema = z.object({
  tables: z.array(tableSchema).min(1, '테이블을 1개 이상 추가하세요'),
});

const initStatementSchema = z.object({
  table: z.string().min(1, '테이블을 선택하세요'),
  rows: z.array(z.record(z.string(), z.unknown())).min(1, '행을 1개 이상 추가하세요'),
});

const initDataSchema = z.object({
  statements: z.array(initStatementSchema).min(1),
});

const answerDataSchema = z.object({
  columns: z.array(z.string().min(1, '컬럼명을 입력하세요')).min(1, '컬럼을 1개 이상 추가하세요'),
  rows: z.array(z.array(z.unknown())).min(1, '행을 1개 이상 추가하세요'),
});

export const testcaseInputSchema = z.object({
  initData: initDataSchema.optional(),
  answerData: answerDataSchema,
  isVisible: z.boolean(),
});

export const problemSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
  description: z.string().min(1, '문제 설명을 입력하세요'),
  difficulty: z.number().min(1).max(5),
  timeLimit: z.number().min(1000).max(60000),
  isOrderSensitive: z.boolean(),
  schemaMetadata: schemaMetadataSchema,
  testcases: z.array(testcaseInputSchema).min(1, '테스트케이스를 1개 이상 추가하세요'),
});

export const updateProblemSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
  description: z.string().min(1, '문제 설명을 입력하세요'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ProblemFormData = z.infer<typeof problemSchema>;
export type UpdateProblemFormData = z.infer<typeof updateProblemSchema>;
