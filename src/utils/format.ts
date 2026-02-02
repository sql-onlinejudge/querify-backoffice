import dayjs from 'dayjs';

export function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export function formatDateShort(date: string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function maskUserId(userId: string): string {
  if (userId.length <= 8) return userId;
  return `${userId.slice(0, 4)}...${userId.slice(-4)}`;
}
