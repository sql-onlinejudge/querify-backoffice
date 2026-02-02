export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export type LogType = 'api' | 'judge' | 'app';

export interface LogEntry {
  '@timestamp': string;
  level: LogLevel;
  message: string;
  logger?: string;
  thread?: string;
  stack_trace?: string;
  [key: string]: unknown;
}

export interface LogSearchParams {
  index: LogType;
  startTime: string;
  endTime: string;
  level?: LogLevel;
  keyword?: string;
  size?: number;
}
