import { Tag } from 'antd';
import type { SubmissionVerdict } from '../../types';
import { VERDICT_CONFIG } from '../../utils/constants';

interface VerdictTagProps {
  verdict: SubmissionVerdict | null;
}

export function VerdictTag({ verdict }: VerdictTagProps) {
  if (!verdict) return <Tag>-</Tag>;
  const config = VERDICT_CONFIG[verdict];
  if (!config) return <Tag>{verdict}</Tag>;
  return <Tag color={config.color}>{config.label}</Tag>;
}
