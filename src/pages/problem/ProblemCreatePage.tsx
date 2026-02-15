import { useState } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Card,
  Space,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MDEditor from '@uiw/react-md-editor';
import { PageHeader } from '../../components/common/PageHeader';
import { SchemaEditor } from '../../components/problem/SchemaEditor';
import { InitDataEditor } from '../../components/problem/InitDataEditor';
import { AnswerDataEditor } from '../../components/problem/AnswerDataEditor';
import { useCreateProblem } from '../../hooks/useProblems';
import { problemSchema, type ProblemFormData } from '../../utils/validation';
import type { CreateTestcaseInput } from '../../types';

const DEFAULT_TESTCASE: CreateTestcaseInput = {
  answerData: { columns: [''], rows: [['']] },
  isVisible: true,
};

export function ProblemCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateProblem();
  const [testcases, setTestcases] = useState<CreateTestcaseInput[]>([
    { ...DEFAULT_TESTCASE },
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 1,
      timeLimit: 5000,
      isOrderSensitive: false,
      schemaMetadata: { tables: [] },
      testcases: [{ ...DEFAULT_TESTCASE }],
    },
  });

  const schemaMetadata = useWatch({ control, name: 'schemaMetadata' });
  const tables = schemaMetadata?.tables || [];

  const addTestcase = () => {
    const newTestcases = [...testcases, { ...DEFAULT_TESTCASE }];
    setTestcases(newTestcases);
    setValue('testcases', newTestcases);
  };

  const removeTestcase = (index: number) => {
    if (testcases.length <= 1) return;
    const newTestcases = testcases.filter((_, i) => i !== index);
    setTestcases(newTestcases);
    setValue('testcases', newTestcases);
  };

  const updateTestcase = (index: number, updates: Partial<CreateTestcaseInput>) => {
    const newTestcases = testcases.map((tc, i) =>
      i === index ? { ...tc, ...updates } : tc
    );
    setTestcases(newTestcases);
    setValue('testcases', newTestcases);
  };

  const sanitizeValue = (value: unknown): unknown => {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'string') {
      const num = Number(value);
      if (!isNaN(num) && value.trim() !== '') {
        return num;
      }
    }
    return value;
  };

  const onSubmit = (data: ProblemFormData) => {
    const sanitizedData = {
      ...data,
      difficulty: data.difficulty as 1 | 2 | 3 | 4 | 5,
      testcases: data.testcases.map(tc => ({
        ...tc,
        answerData: {
          columns: tc.answerData.columns,
          rows: tc.answerData.rows.map(row =>
            row.map(cell => sanitizeValue(cell))
          )
        },
        initData: tc.initData ? {
          statements: tc.initData.statements.map(stmt => ({
            table: stmt.table,
            rows: stmt.rows.map(row => {
              const sanitized: Record<string, unknown> = {};
              for (const [key, value] of Object.entries(row)) {
                sanitized[key] = sanitizeValue(value);
              }
              return sanitized;
            })
          }))
        } : undefined
      }))
    };

    createMutation.mutate(sanitizedData, {
      onSuccess: () => navigate('/problems'),
    });
  };

  return (
    <div>
      <PageHeader title="문제 생성" backPath="/problems" />

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Card title="기본 정보" style={{ marginBottom: 16 }}>
          <Form.Item
            label="제목"
            required
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message}
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="문제 제목을 입력하세요" />
              )}
            />
          </Form.Item>

          <Space size="large" wrap>
            <Form.Item
              label="난이도"
              required
              validateStatus={errors.difficulty ? 'error' : ''}
            >
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: 120 }}
                    options={[
                      { label: 'Level 1', value: 1 },
                      { label: 'Level 2', value: 2 },
                      { label: 'Level 3', value: 3 },
                      { label: 'Level 4', value: 4 },
                      { label: 'Level 5', value: 5 },
                    ]}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="시간 제한 (ms)"
              required
              validateStatus={errors.timeLimit ? 'error' : ''}
            >
              <Controller
                name="timeLimit"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={1000}
                    max={60000}
                    step={1000}
                  />
                )}
              />
            </Form.Item>

            <Form.Item label="결과 순서 민감">
              <Controller
                name="isOrderSensitive"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} />
                )}
              />
            </Form.Item>
          </Space>

          <Form.Item
            label="문제 설명"
            required
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor
                  value={field.value}
                  onChange={(value) => field.onChange(value || '')}
                  height={300}
                />
              )}
            />
          </Form.Item>
        </Card>

        <Card title="스키마 정의" style={{ marginBottom: 16 }}>
          <Controller
            name="schemaMetadata"
            control={control}
            render={({ field }) => (
              <SchemaEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.schemaMetadata && (
            <div style={{ color: '#ff4d4f', marginTop: 8 }}>
              {errors.schemaMetadata.tables?.message || '스키마를 정의하세요'}
            </div>
          )}
        </Card>

        <Card title="테스트케이스" style={{ marginBottom: 16 }}>
          {testcases.map((testcase, index) => (
            <Card
              key={index}
              size="small"
              title={`테스트케이스 ${index + 1}`}
              extra={
                <Space>
                  <span style={{ fontSize: 13 }}>공개</span>
                  <Switch
                    size="small"
                    checked={testcase.isVisible}
                    onChange={(checked) =>
                      updateTestcase(index, { isVisible: checked })
                    }
                  />
                  {testcases.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeTestcase(index)}
                    />
                  )}
                </Space>
              }
              style={{ marginBottom: 16 }}
            >
              <Form.Item label="초기 데이터">
                <InitDataEditor
                  value={testcase.initData}
                  onChange={(initData) => updateTestcase(index, { initData })}
                  tables={tables}
                />
              </Form.Item>
              <Form.Item label="정답 데이터" required>
                <AnswerDataEditor
                  value={testcase.answerData}
                  onChange={(answerData) => updateTestcase(index, { answerData })}
                />
              </Form.Item>
            </Card>
          ))}
          <Button type="dashed" onClick={addTestcase} icon={<PlusOutlined />} block>
            테스트케이스 추가
          </Button>
          {errors.testcases && (
            <div style={{ color: '#ff4d4f', marginTop: 8 }}>
              {errors.testcases.message}
            </div>
          )}
        </Card>

        <Space>
          <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
            생성
          </Button>
          <Button onClick={() => navigate('/problems')}>취소</Button>
        </Space>
      </Form>
    </div>
  );
}
