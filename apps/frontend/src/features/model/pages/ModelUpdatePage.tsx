import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import ModelForm from '../components/ModelForm';
import { useModel, useUpdateModel } from '../hooks/useModels';
import type { ModelCreateDto } from '@dhs/shared';

export default function ModelUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useModel(Number(id));
  const mutation = useUpdateModel();
  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  const model = data?.data;
  if (!model) return null;
  return <ModelForm initialValues={model}
    onSubmit={(v: ModelCreateDto) => mutation.mutate({ id: model.id, data: { ...v, version: model.version } }, { onSuccess: () => navigate('/models') })}
    loading={mutation.isPending} />;
}
