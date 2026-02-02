export interface InitStatement {
  table: string;
  rows: Record<string, unknown>[];
}

export interface InitData {
  statements: InitStatement[];
}

export interface AnswerData {
  columns: string[];
  rows: unknown[][];
}

export interface Testcase {
  id: number;
  initSql: string;
  answer: string;
  initData: InitData;
  answerData: AnswerData;
}

export interface CreateTestcaseInput {
  initSql?: string;
  answer?: string;
}

export interface CreateTestcaseRequest {
  initData: InitData;
  answerData: AnswerData;
}

export interface UpdateTestcaseRequest {
  initData?: InitData;
  answerData?: AnswerData;
}
