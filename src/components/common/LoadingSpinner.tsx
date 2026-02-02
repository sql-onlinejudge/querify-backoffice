import { Spin } from 'antd';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export function LoadingSpinner({ fullScreen }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 48
    }}>
      <Spin size="large" />
    </div>
  );
}
