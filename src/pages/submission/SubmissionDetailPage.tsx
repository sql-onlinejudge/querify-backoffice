import { Card, Descriptions } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { VerdictTag } from '../../components/submission/VerdictTag';
import { StatusTag } from '../../components/submission/StatusTag';
import { SqlViewer } from '../../components/submission/SqlViewer';
import { useSubmission } from '../../hooks/useSubmissions';
import { formatDate, maskUserId } from '../../utils/format';

export function SubmissionDetailPage() {
  const { problemId, submissionId } = useParams<{
    problemId: string;
    submissionId: string;
  }>();

  const { data: submission, isLoading } = useSubmission(
    Number(problemId),
    Number(submissionId)
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!submission) {
    return <div>제출을 찾을 수 없습니다</div>;
  }

  return (
    <div>
      <PageHeader
        title={`제출 상세 #${submission.id}`}
        backPath="/submissions"
      />

      <Card title="제출 정보" style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="제출 ID">{submission.id}</Descriptions.Item>
          <Descriptions.Item label="문제">
            <Link to={`/problems/${submission.problemId}`}>
              #{submission.problemId}
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="사용자">
            {maskUserId(submission.userId)}
          </Descriptions.Item>
          <Descriptions.Item label="제출 시간">
            {formatDate(submission.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="상태">
            <StatusTag status={submission.status} />
          </Descriptions.Item>
          <Descriptions.Item label="결과">
            <VerdictTag verdict={submission.verdict} />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="제출 쿼리">
        <SqlViewer code={submission.query} />
      </Card>
    </div>
  );
}
