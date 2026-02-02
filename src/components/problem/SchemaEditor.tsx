import { Button, Card, Form, Input, Select, Checkbox, Row, Col, Grid } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { SchemaMetadata, Table, Column } from '../../types';
import { COLUMN_TYPES, COLUMN_CONSTRAINTS } from '../../utils/constants';

const { useBreakpoint } = Grid;

interface SchemaEditorProps {
  value?: SchemaMetadata;
  onChange?: (value: SchemaMetadata) => void;
}

export function SchemaEditor({ value, onChange }: SchemaEditorProps) {
  const tables = value?.tables || [];
  const screens = useBreakpoint();

  const updateTables = (newTables: Table[]) => {
    onChange?.({ tables: newTables });
  };

  const addTable = () => {
    updateTables([
      ...tables,
      { name: '', columns: [{ name: '', type: 'INT', nullable: true }] },
    ]);
  };

  const removeTable = (tableIndex: number) => {
    updateTables(tables.filter((_, i) => i !== tableIndex));
  };

  const updateTable = (tableIndex: number, updates: Partial<Table>) => {
    updateTables(
      tables.map((t, i) => (i === tableIndex ? { ...t, ...updates } : t))
    );
  };

  const addColumn = (tableIndex: number) => {
    const table = tables[tableIndex];
    updateTable(tableIndex, {
      columns: [
        ...table.columns,
        { name: '', type: 'INT', nullable: true },
      ],
    });
  };

  const removeColumn = (tableIndex: number, columnIndex: number) => {
    const table = tables[tableIndex];
    updateTable(tableIndex, {
      columns: table.columns.filter((_, i) => i !== columnIndex),
    });
  };

  const updateColumn = (
    tableIndex: number,
    columnIndex: number,
    updates: Partial<Column>
  ) => {
    const table = tables[tableIndex];
    updateTable(tableIndex, {
      columns: table.columns.map((c, i) =>
        i === columnIndex ? { ...c, ...updates } : c
      ),
    });
  };

  return (
    <div>
      {tables.map((table, tableIndex) => (
        <Card
          key={tableIndex}
          title={
            <Input
              placeholder="테이블명"
              value={table.name}
              onChange={(e) => updateTable(tableIndex, { name: e.target.value })}
              style={{ width: screens.sm ? 200 : '100%', maxWidth: 200 }}
            />
          }
          extra={
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeTable(tableIndex)}
            />
          }
          style={{ marginBottom: 16 }}
        >
          {table.columns.map((column, columnIndex) => (
            <Row key={columnIndex} gutter={[8, 8]} align="middle" style={{ marginBottom: 8 }}>
              <Col xs={24} sm={6}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Input
                    placeholder="컬럼명"
                    value={column.name}
                    onChange={(e) =>
                      updateColumn(tableIndex, columnIndex, { name: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={12} sm={5}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Select
                    placeholder="타입"
                    value={column.type}
                    onChange={(type) =>
                      updateColumn(tableIndex, columnIndex, { type })
                    }
                    style={{ width: '100%' }}
                    options={COLUMN_TYPES.map((t) => ({ label: t, value: t }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={12} sm={4}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Checkbox
                    checked={column.nullable}
                    onChange={(e) =>
                      updateColumn(tableIndex, columnIndex, {
                        nullable: e.target.checked,
                      })
                    }
                  >
                    Nullable
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col xs={20} sm={7}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Select
                    mode="multiple"
                    placeholder="제약조건"
                    value={column.constraints}
                    onChange={(constraints) =>
                      updateColumn(tableIndex, columnIndex, { constraints })
                    }
                    style={{ width: '100%' }}
                    options={COLUMN_CONSTRAINTS.map((c) => ({ label: c, value: c }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={4} sm={2}>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeColumn(tableIndex, columnIndex)}
                  disabled={table.columns.length <= 1}
                />
              </Col>
            </Row>
          ))}
          <Button
            type="dashed"
            onClick={() => addColumn(tableIndex)}
            icon={<PlusOutlined />}
            style={{ marginTop: 8 }}
          >
            컬럼 추가
          </Button>
        </Card>
      ))}
      <Button type="dashed" onClick={addTable} icon={<PlusOutlined />} block>
        테이블 추가
      </Button>
    </div>
  );
}
