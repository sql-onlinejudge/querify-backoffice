import { Button, Card, Col, Input, Row, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { InitData, InitStatement, Table } from '../../types';

interface InitDataEditorProps {
  value?: InitData;
  onChange?: (value: InitData | undefined) => void;
  tables: Table[];
}

export function InitDataEditor({ value, onChange, tables }: InitDataEditorProps) {
  const statements = value?.statements || [];

  const update = (newStatements: InitStatement[]) => {
    onChange?.(newStatements.length > 0 ? { statements: newStatements } : undefined);
  };

  const addStatement = () => {
    update([...statements, { table: '', rows: [{}] }]);
  };

  const removeStatement = (index: number) => {
    update(statements.filter((_, i) => i !== index));
  };

  const updateStatement = (index: number, stmt: InitStatement) => {
    update(statements.map((s, i) => (i === index ? stmt : s)));
  };

  const getTableColumns = (tableName: string) => {
    return tables.find((t) => t.name === tableName)?.columns || [];
  };

  return (
    <div>
      {statements.map((stmt, stmtIndex) => {
        const columns = getTableColumns(stmt.table);
        return (
          <Card
            key={stmtIndex}
            size="small"
            title={
              <Select
                placeholder="테이블 선택"
                value={stmt.table || undefined}
                onChange={(table) =>
                  updateStatement(stmtIndex, { ...stmt, table, rows: [{}] })
                }
                style={{ width: 200 }}
                options={tables.map((t) => ({ label: t.name, value: t.name }))}
              />
            }
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeStatement(stmtIndex)}
              />
            }
            style={{ marginBottom: 8 }}
          >
            {columns.length > 0 && (
              <>
                <Row gutter={8} style={{ marginBottom: 4 }}>
                  {columns.map((col) => (
                    <Col key={col.name} flex="1">
                      <strong>{col.name}</strong>{' '}
                      <span style={{ color: '#999', fontSize: 12 }}>({col.type})</span>
                    </Col>
                  ))}
                  <Col flex="32px" />
                </Row>
                {stmt.rows.map((row, rowIndex) => (
                  <Row key={rowIndex} gutter={8} style={{ marginBottom: 4 }}>
                    {columns.map((col) => (
                      <Col key={col.name} flex="1">
                        <Input
                          size="small"
                          placeholder={col.nullable ? 'NULL' : ''}
                          value={(row[col.name] as string) || ''}
                          onChange={(e) => {
                            const newRows = stmt.rows.map((r, ri) =>
                              ri === rowIndex
                                ? { ...r, [col.name]: e.target.value }
                                : r
                            );
                            updateStatement(stmtIndex, { ...stmt, rows: newRows });
                          }}
                        />
                      </Col>
                    ))}
                    <Col flex="32px">
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          const newRows = stmt.rows.filter((_, ri) => ri !== rowIndex);
                          updateStatement(stmtIndex, {
                            ...stmt,
                            rows: newRows.length > 0 ? newRows : [{}],
                          });
                        }}
                        disabled={stmt.rows.length <= 1}
                      />
                    </Col>
                  </Row>
                ))}
                <Button
                  type="dashed"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    updateStatement(stmtIndex, {
                      ...stmt,
                      rows: [...stmt.rows, {}],
                    })
                  }
                  style={{ marginTop: 4 }}
                >
                  행 추가
                </Button>
              </>
            )}
            {columns.length === 0 && stmt.table && (
              <span style={{ color: '#999' }}>
                스키마에서 해당 테이블을 먼저 정의하세요
              </span>
            )}
          </Card>
        );
      })}
      <Button type="dashed" onClick={addStatement} icon={<PlusOutlined />} block>
        초기 데이터 추가
      </Button>
    </div>
  );
}
