export const ENDPOINTS = {
  auth: {
    login: '/admin/login',
  },
  problems: {
    base: '/problems',
    byId: (id: number) => `/problems/${id}`,
  },
  testcases: {
    base: (problemId: number) => `/problems/${problemId}/testcases`,
    byId: (problemId: number, testcaseId: number) =>
      `/problems/${problemId}/testcases/${testcaseId}`,
  },
  submissions: {
    base: '/admin/submissions',
    byProblem: (problemId: number) => `/problems/${problemId}/submissions`,
    byId: (problemId: number, submissionId: number) =>
      `/problems/${problemId}/submissions/${submissionId}`,
  },
} as const;
