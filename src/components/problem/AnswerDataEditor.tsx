import { Button, Col, Input, Row, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { AnswerData } from '../../types';

interface AnswerDataEditorProps {
  value?: AnswerData;
  onChange?: (value: AnswerData) => void;
}

export function AnswerDataEditor({ value, onChange }: AnswerDataEditorProps) {
  const columns = value?.columns || [];
  const rows = value?.rows || [];

  const update = (newColumns: string[], newRows: unknown[][]) => {
    onChange?.({ columns: newColumns, rows: newRows });
  };

  const addColumn = () => {
    const newColumns = [...columns, ''];
    const newRows = rows.map((row) => [...row, '']);
    update(newColumns, newRows);
  };

  const removeColumn = (index: number) => {
    if (columns.length <= 1) return;
    const newColumns = columns.filter((_, i) => i !== index);
    const newRows = rows.map((row) => row.filter((_, i) => i !== index));
    update(newColumns, newRows);
  };

  const updateColumnName = (index: number, name: string) => {
    const newColumns = columns.map((c, i) => (i === index ? name : c));
    update(newColumns, rows);
  };

  const addRow = () => {
    update(columns, [...rows, columns.map(() => '')]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    update(
      columns,
      rows.filter((_, i) => i !== index)
    );
  };

  const updateCell = (rowIndex: number, colIndex: number, val: string) => {
    const newRows = rows.map((row, ri) =>
      ri === rowIndex
        ? row.map((cell, ci) => (ci === colIndex ? val : cell))
        : row
    );
    update(columns, newRows);
  };

  return (
    <div>
      <Space style={{ marginBottom: 8 }} wrap>
        {columns.map((col, colIndex) => (
          <Space.Compact key={colIndex}>
            <Input
              size="small"
              placeholder="컬럼명"
              value={col}
              onChange={(e) => updateColumnName(colIndex, e.target.value)}
              style={{ width: 120 }}
            />
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeColumn(colIndex)}
              disabled={columns.length <= 1}
            />
          </Space.Compact>
        ))}
        <Button size="small" icon={<PlusOutlined />} onClick={addColumn}>
          컬럼
        </Button>
      </Space>

      {columns.length > 0 && (
        <>
          {rows.map((row, rowIndex) => (
            <Row key={rowIndex} gutter={8} style={{ marginBottom: 4 }}>
              {columns.map((_, colIndex) => (
                <Col key={colIndex} flex="1">
                  <Input
                    size="small"
                    value={(row[colIndex] as string) || ''}
                    onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                  />
                </Col>
              ))}
              <Col flex="32px">
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeRow(rowIndex)}
                  disabled={rows.length <= 1}
                />
              </Col>
            </Row>
          ))}
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            onClick={addRow}
            style={{ marginTop: 4 }}
          >
            행 추가
          </Button>
        </>
      )}
    </div>
  );
}
