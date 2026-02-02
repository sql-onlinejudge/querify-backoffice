import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface SqlViewerProps {
  code: string;
}

export function SqlViewer({ code }: SqlViewerProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    message.success('복사되었습니다');
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button
        icon={<CopyOutlined />}
        size="small"
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        onClick={handleCopy}
      />
      <CodeMirror
        value={code}
        extensions={[sql()]}
        editable={false}
        theme="light"
        minHeight="100px"
      />
    </div>
  );
}
