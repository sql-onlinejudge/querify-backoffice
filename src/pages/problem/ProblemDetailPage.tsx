import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Card,
  Tabs,
  Space,
  Statistic,
  Row,
  Col,
  message,
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MDEditor from '@uiw/react-md-editor';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { SchemaEditor } from '../../components/problem/SchemaEditor';
import { TestcaseList } from '../../components/testcase/TestcaseList';
import { TestcaseModal } from '../../components/testcase/TestcaseModal';
import { showConfirmModal } from '../../components/common/ConfirmModal';
import { useProblem, useUpdateProblem, useDeleteProblem } from '../../hooks/useProblems';
import { useTestcases, useCreateTestcase, useDeleteTestcase } from '../../hooks/useTestcases';
import { testcasesApi } from '../../api/testcases';
import { updateProblemSchema, type UpdateProblemFormData } from '../../utils/validation';
import type { Testcase, InitData, AnswerData, UpdateTestcaseRequest } from '../../types';

export function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const problemId = Number(id);

  const { data: problem, isLoading: problemLoading } = useProblem(problemId);
  const { data: testcases, isLoading: testcasesLoading } = useTestcases(problemId);

  const updateMutation = useUpdateProblem(problemId);
  const deleteMutation = useDeleteProblem();
  const createTestcaseMutation = useCreateTestcase(problemId);
  const deleteTestcaseMutation = useDeleteTestcase(problemId);

  const updateTestcaseMutation = useMutation({
    mutationFn: ({ testcaseId, data }: { testcaseId: number; data: UpdateTestcaseRequest }) =>
      testcasesApi.update(problemId, testcaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testcases', problemId] });
      message.success('테스트케이스가 수정되었습니다');
    },
    onError: () => {
      message.error('테스트케이스 수정에 실패했습니다');
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestcase, setEditingTestcase] = useState<Testcase | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProblemFormData>({
    resolver: zodResolver(updateProblemSchema),
  });

  useEffect(() => {
    if (problem) {
      reset({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        timeLimit: problem.timeLimit,
        isOrderSensitive: problem.isOrderSensitive,
        schemaMetadata: problem.schemaMetadata,
      });
    }
  }, [problem, reset]);

  if (problemLoading) {
    return <LoadingSpinner />;
  }

  if (!problem) {
    return <div>문제를 찾을 수 없습니다</div>;
  }

  const onSubmit = (data: UpdateProblemFormData) => {
    updateMutation.mutate({
      ...data,
      difficulty: data.difficulty as 1 | 2 | 3 | 4 | 5,
    });
  };

  const handleDelete = () => {
    showConfirmModal({
      title: '문제 삭제',
      content: '정말 삭제하시겠습니까?',
      onConfirm: () => {
        deleteMutation.mutate(problemId, {
          onSuccess: () => navigate('/problems'),
        });
      },
    });
  };

  const handleTestcaseEdit = (testcase: Testcase) => {
    setEditingTestcase(testcase);
    setModalOpen(true);
  };

  const handleTestcaseSubmit = (data: { initData: InitData; answerData: AnswerData }) => {
    if (editingTestcase) {
      updateTestcaseMutation.mutate(
        { testcaseId: editingTestcase.id, data },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditingTestcase(null);
          },
        }
      );
    } else {
      createTestcaseMutation.mutate(data, {
        onSuccess: () => {
          setModalOpen(false);
        },
      });
    }
  };

  const pieData = [
    { name: '정답', value: problem.solvedCount },
    { name: '오답', value: problem.submissionCount - problem.solvedCount },
  ];
  const COLORS = ['#52c41a', '#ff4d4f'];

  const tabItems = [
    {
      key: 'info',
      label: '기본 정보',
      children: (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="제목"
            required
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message}
          >
            <Controller
              name="title"
              control={control}
              defaultValue={problem.title}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Space size="large" wrap>
            <Form.Item label="난이도" required>
              <Controller
                name="difficulty"
                control={control}
                defaultValue={problem.difficulty}
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

            <Form.Item label="시간 제한 (ms)" required>
              <Controller
                name="timeLimit"
                control={control}
                defaultValue={problem.timeLimit}
                render={({ field }) => (
                  <InputNumber {...field} min={1000} max={60000} step={1000} />
                )}
              />
            </Form.Item>

            <Form.Item label="결과 순서 민감">
              <Controller
                name="isOrderSensitive"
                control={control}
                defaultValue={problem.isOrderSensitive}
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
              defaultValue={problem.description}
              render={({ field }) => (
                <MDEditor
                  value={field.value}
                  onChange={(value) => field.onChange(value || '')}
                  height={300}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="스키마 정의">
            <Controller
              name="schemaMetadata"
              control={control}
              defaultValue={problem.schemaMetadata}
              render={({ field }) => (
                <SchemaEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
            저장
          </Button>
        </Form>
      ),
    },
    {
      key: 'testcases',
      label: '테스트케이스',
      children: (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setEditingTestcase(null);
              setModalOpen(true);
            }}
            style={{ marginBottom: 16 }}
          >
            테스트케이스 추가
          </Button>
          <TestcaseList
            data={testcases || []}
            loading={testcasesLoading}
            onEdit={handleTestcaseEdit}
            onDelete={(id) => deleteTestcaseMutation.mutate(id)}
          />
        </div>
      ),
    },
    {
      key: 'stats',
      label: '제출 통계',
      children: (
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="총 제출 수" value={problem.submissionCount} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="정답 수" value={problem.solvedCount} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="정답률"
                value={
                  problem.submissionCount > 0
                    ? ((problem.solvedCount / problem.submissionCount) * 100).toFixed(1)
                    : 0
                }
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="정답/오답 비율">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`문제 상세 #${problem.id}`}
        backPath="/problems"
        extra={
          <Button danger onClick={handleDelete}>
            삭제
          </Button>
        }
      />

      <Tabs items={tabItems} />

      <TestcaseModal
        open={modalOpen}
        testcase={editingTestcase}
        onClose={() => {
          setModalOpen(false);
          setEditingTestcase(null);
        }}
        onSubmit={handleTestcaseSubmit}
        loading={createTestcaseMutation.isPending || updateTestcaseMutation.isPending}
      />
    </div>
  );
}
