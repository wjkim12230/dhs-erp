import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Steps, Button, Card, Form, Input, DatePicker, Row, Col, Typography, Space, Table, Select, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import { useOrderingWizardStore } from '@/stores/orderingWizardStore';
import { useCreateOrdering } from '../hooks/useOrderings';
import EmployeeSelect from '@/components/common/EmployeeSelect';
import type { Model } from '@dhs/shared';

const { Title } = Typography;

const STEPS = ['기본정보', '모델선택', '사양선택', '검사항목', '담당자배정'];

export default function OrderingCreatePage() {
  const navigate = useNavigate();
  const store = useOrderingWizardStore();
  const createMut = useCreateOrdering();
  const [basicForm] = Form.useForm();

  useEffect(() => { store.reset(); }, []);

  // Models list
  const { data: modelsData } = useQuery({
    queryKey: ['models', 'all'],
    queryFn: async () => { const res = await apiClient.get('/models?limit=200'); return res.data.data as Model[]; },
  });

  // Selected model full data
  const { data: modelDetail } = useQuery({
    queryKey: ['models', store.selectedModel?.id],
    queryFn: async () => { const res = await apiClient.get(`/models/${store.selectedModel!.id}`); return res.data.data as Model; },
    enabled: !!store.selectedModel?.id,
  });

  const handleBasicNext = () => {
    basicForm.validateFields().then((values) => {
      store.setFormData({
        ...values,
        orderDate: values.orderDate?.format('YYYY-MM-DD'),
        dueDate: values.dueDate?.format('YYYY-MM-DD'),
        expectedDeliveryDate: values.expectedDeliveryDate?.format('YYYY-MM-DD'),
      });
      store.nextStep();
    });
  };

  const handleSubmit = () => {
    const dto = store.buildCreateDto();
    createMut.mutate(dto, { onSuccess: () => { store.reset(); navigate('/orderings'); } });
  };

  return (
    <Card title="수주 등록">
      <Steps current={store.currentStep} items={STEPS.map((t) => ({ title: t }))} style={{ marginBottom: 32 }} />

      {/* Step 0: Basic Info */}
      {store.currentStep === 0 && (
        <>
          <Form form={basicForm} layout="vertical" initialValues={store.formData} style={{ maxWidth: 800 }}>
            <Row gutter={16}>
              <Col span={8}><Form.Item name="customerName" label="고객명" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="orderNumber" label="수주번호" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="siteName" label="현장명"><Input /></Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}><Form.Item name="orderer" label="발주자"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="customerContact" label="연락처"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="quantity" label="수량"><Input /></Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}><Form.Item name="orderDate" label="수주일"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
              <Col span={8}><Form.Item name="dueDate" label="납기일"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
              <Col span={8}><Form.Item name="expectedDeliveryDate" label="출하예정일"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            </Row>
            <Form.Item name="memo" label="메모"><Input.TextArea rows={2} /></Form.Item>
          </Form>
          <Button type="primary" onClick={handleBasicNext}>다음</Button>
        </>
      )}

      {/* Step 1: Model Selection */}
      {store.currentStep === 1 && (
        <>
          <Title level={5}>모델을 선택하세요</Title>
          <Table rowKey="id" dataSource={modelsData ?? []} size="small" pagination={{ pageSize: 10 }}
            rowSelection={{ type: 'radio', selectedRowKeys: store.selectedModel ? [store.selectedModel.id] : [],
              onChange: (_, rows) => { if (rows[0]) store.setModel(rows[0]); } }}
            columns={[
              { title: '모델명', dataIndex: 'name' },
              { title: '수주명', dataIndex: 'orderingName' },
            ]} />
          <Space style={{ marginTop: 16 }}>
            <Button onClick={store.prevStep}>이전</Button>
            <Button type="primary" disabled={!store.selectedModel} onClick={store.nextStep}>다음</Button>
          </Space>
        </>
      )}

      {/* Step 2: Specification */}
      {store.currentStep === 2 && (
        <>
          <Title level={5}>사양 선택</Title>
          {modelDetail?.specifications?.map((spec) => (
            <Card key={spec.id} size="small" title={spec.name} style={{ marginBottom: 8 }}>
              <Select placeholder="사양 상세 선택" allowClear style={{ width: 300 }}
                options={spec.specificationDetails?.map((d) => ({ label: d.name, value: d.id }))}
                onChange={(detailId) => {
                  const newSpecs = store.selectedSpecs.filter((s) => s.specificationId !== spec.id);
                  if (detailId) newSpecs.push({ specificationId: spec.id, specificationDetailId: detailId });
                  store.setSpecs(newSpecs);
                }}
                value={store.selectedSpecs.find((s) => s.specificationId === spec.id)?.specificationDetailId}
              />
            </Card>
          ))}
          <Space style={{ marginTop: 16 }}>
            <Button onClick={store.prevStep}>이전</Button>
            <Button type="primary" onClick={store.nextStep}>다음</Button>
          </Space>
        </>
      )}

      {/* Step 3: Check Items */}
      {store.currentStep === 3 && (
        <>
          <Title level={5}>검사항목</Title>
          {modelDetail?.checkItems?.map((ci) => (
            <Card key={ci.id} size="small" title={ci.name} style={{ marginBottom: 8 }}>
              {ci.checkItemDetails?.map((d) => {
                const checked = store.selectedChecks.some((c) => c.checkItemDetailId === d.id);
                return (
                  <Button key={d.id} size="small" type={checked ? 'primary' : 'default'}
                    style={{ marginRight: 8, marginBottom: 4 }}
                    onClick={() => {
                      if (checked) store.setChecks(store.selectedChecks.filter((c) => c.checkItemDetailId !== d.id));
                      else store.setChecks([...store.selectedChecks, { checkItemDetailId: d.id }]);
                    }}>{d.name}</Button>
                );
              })}
            </Card>
          ))}
          <Space style={{ marginTop: 16 }}>
            <Button onClick={store.prevStep}>이전</Button>
            <Button type="primary" onClick={store.nextStep}>다음</Button>
          </Space>
        </>
      )}

      {/* Step 4: Employee Assignment */}
      {store.currentStep === 4 && (
        <>
          <Title level={5}>담당자 배정</Title>
          <Row gutter={16} style={{ maxWidth: 800 }}>
            <Col span={12}>
              <Form.Item label="수주 담당자">
                <EmployeeSelect onChange={(v) => store.setFormData({ orderEmployeeId: v as number })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="접수 담당자">
                <EmployeeSelect onChange={(v) => store.setFormData({ receiptEmployeeId: v as number })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="포장 담당자">
                <EmployeeSelect onChange={(v) => store.setFormData({ packagingEmployeeId: v as number })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="출하 담당자">
                <EmployeeSelect onChange={(v) => store.setFormData({ shippingEmployeeId: v as number })} />
              </Form.Item>
            </Col>
          </Row>
          <Space style={{ marginTop: 16 }}>
            <Button onClick={store.prevStep}>이전</Button>
            <Button type="primary" loading={createMut.isPending} onClick={handleSubmit}>등록</Button>
          </Space>
        </>
      )}
    </Card>
  );
}
