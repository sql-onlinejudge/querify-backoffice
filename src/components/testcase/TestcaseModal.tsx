import { Modal, Form, Input, Button, Space, Card, Grid } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { Testcase, InitData, AnswerData, InitStatement } from '../../types';

const { useBreakpoint } = Grid;

interface TestcaseModalProps {
  open: boolean;
  testcase: Testcase | null;
  onClose: () => void;
  onSubmit: (data: { initData: InitData; answerData: AnswerData }) => void;
  loading?: boolean;
}

export function TestcaseModal({
  open,
  testcase,
  onClose,
  onSubmit,
  loading,
}: TestcaseModalProps) {
  const screens = useBreakpoint();
  const [initStatements, setInitStatements] = useState<InitStatement[]>([]);
  const [answerColumns, setAnswerColumns] = useState<string[]>([]);
  const [answerRowsJson, setAnswerRowsJson] = useState('');

  useEffect(() => {
    if (testcase) {
      setInitStatements(testcase.initData?.statements || []);
      setAnswerColumns(testcase.answerData?.columns || []);
      setAnswerRowsJson(JSON.stringify(testcase.answerData?.rows || [], null, 2));
    } else {
      setInitStatements([]);
      setAnswerColumns([]);
      setAnswerRowsJson('[]');
    }
  }, [testcase, open]);

  const handleSubmit = () => {
    let rows: unknown[][] = [];
    try {
      rows = JSON.parse(answerRowsJson);
    } catch {
      return;
    }

    onSubmit({
      initData: { statements: initStatements },
      answerData: { columns: answerColumns, rows },
    });
  };

  const addStatement = () => {
    setInitStatements([...initStatements, { table: '', rows: [] }]);
  };

  const removeStatement = (index: number) => {
    setInitStatements(initStatements.filter((_, i) => i !== index));
  };

  const updateStatement = (index: number, field: 'table' | 'rows', value: string) => {
    setInitStatements(
      initStatements.map((s, i) => {
        if (i !== index) return s;
        if (field === 'table') return { ...s, table: value };
        try {
          return { ...s, rows: JSON.parse(value) };
        } catch {
          return s;
        }
      })
    );
  };

  return (
    <Modal
      title={testcase ? '테스트케이스 수정' : '테스트케이스 추가'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={screens.md ? 800 : '95vw'}
    >
      <Form layout="vertical">
        <Form.Item label="초기 데이터">
          {initStatements.map((statement, index) => (
            <Card key={index} size="small" style={{ marginBottom: 8 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Input
                    placeholder="테이블명"
                    value={statement.table}
                    onChange={(e) => updateStatement(index, 'table', e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeStatement(index)}
                  />
                </Space>
                <Input.TextArea
                  placeholder='행 데이터 (JSON 배열): [{"id": 1, "name": "test"}]'
                  value={JSON.stringify(statement.rows, null, 2)}
                  onChange={(e) => updateStatement(index, 'rows', e.target.value)}
                  rows={3}
                />
              </Space>
            </Card>
          ))}
          <Button type="dashed" onClick={addStatement} icon={<PlusOutlined />}>
            초기 데이터 추가
          </Button>
        </Form.Item>

        <Form.Item label="정답 컬럼">
          <Input
            placeholder="컬럼명 (쉼표로 구분)"
            value={answerColumns.join(', ')}
            onChange={(e) =>
              setAnswerColumns(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
            }
          />
        </Form.Item>

        <Form.Item label="정답 행">
          <Input.TextArea
            placeholder='행 데이터 (JSON 2차원 배열): [[1, "test"], [2, "test2"]]'
            value={answerRowsJson}
            onChange={(e) => setAnswerRowsJson(e.target.value)}
            rows={5}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
