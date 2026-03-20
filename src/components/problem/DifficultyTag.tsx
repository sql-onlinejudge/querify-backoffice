import { Tag } from 'antd';

interface DifficultyTagProps {
  level: number;
}

function getColor(level: number): string {
  if (level <= 5) return 'green';
  if (level <= 8) return 'cyan';
  if (level <= 11) return 'orange';
  if (level <= 13) return 'volcano';
  return 'red';
}

export function DifficultyTag({ level }: DifficultyTagProps) {
  return <Tag color={getColor(level)}>Lv.{level}</Tag>;
}
