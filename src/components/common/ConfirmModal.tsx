import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmModalProps {
  title: string;
  content: string;
  onConfirm: () => void;
}

export function showConfirmModal({ title, content, onConfirm }: ConfirmModalProps) {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText: '확인',
    cancelText: '취소',
    onOk: onConfirm,
  });
}
