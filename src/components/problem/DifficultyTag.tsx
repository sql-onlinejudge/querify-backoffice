import { Tag } from 'antd';
import { DIFFICULTY_CONFIG } from '../../utils/constants';

interface DifficultyTagProps {
  level: 1 | 2 | 3 | 4 | 5;
}

export function DifficultyTag({ level }: DifficultyTagProps) {
  const config = DIFFICULTY_CONFIG[level];
  return <Tag color={config.color}>{config.label}</Tag>;
}
