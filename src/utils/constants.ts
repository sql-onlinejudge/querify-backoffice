import type { SubmissionStatus, SubmissionVerdict, LogLevel } from '../types';

export const DIFFICULTY_CONFIG: Record<number, { color: string; label: string }> = {
  1: { color: 'green', label: 'Level 1' },
  2: { color: 'cyan', label: 'Level 2' },
  3: { color: 'orange', label: 'Level 3' },
  4: { color: 'red', label: 'Level 4' },
  5: { color: 'purple', label: 'Level 5' },
};

export const VERDICT_CONFIG: Record<SubmissionVerdict, { color: string; label: string }> = {
  ACCEPTED: { color: 'success', label: '정답' },
  WRONG_ANSWER: { color: 'error', label: '오답' },
  TIME_LIMIT_EXCEEDED: { color: 'warning', label: '시간 초과' },
  RUNTIME_ERROR: { color: 'purple', label: '런타임 에러' },
  INVALID_QUERY: { color: 'volcano', label: '잘못된 쿼리' },
};

export const STATUS_CONFIG: Record<SubmissionStatus, { color: string; label: string }> = {
  PENDING: { color: 'default', label: '대기중' },
  RUNNING: { color: 'processing', label: '채점중' },
  COMPLETED: { color: 'success', label: '완료' },
};

export const LOG_LEVEL_CONFIG: Record<LogLevel, { color: string }> = {
  DEBUG: { color: 'default' },
  INFO: { color: 'blue' },
  WARN: { color: 'orange' },
  ERROR: { color: 'red' },
};

export const COLUMN_TYPES = [
  'INT',
  'BIGINT',
  'VARCHAR(50)',
  'VARCHAR(100)',
  'VARCHAR(255)',
  'TEXT',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'BOOLEAN',
  'DECIMAL(10,2)',
  'FLOAT',
  'DOUBLE',
];

export const COLUMN_CONSTRAINTS = [
  'PRIMARY KEY',
  'UNIQUE',
  'NOT NULL',
  'AUTO_INCREMENT',
];
