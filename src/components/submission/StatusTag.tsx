import { Tag } from 'antd';
import type { SubmissionStatus } from '../../types';
import { STATUS_CONFIG } from '../../utils/constants';

interface StatusTagProps {
  status: SubmissionStatus;
}

export function StatusTag({ status }: StatusTagProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return <Tag>{status}</Tag>;
  return <Tag color={config.color}>{config.label}</Tag>;
}
