import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from '@heroui/react';
import toast from 'react-hot-toast';
import ModelForm from '../components/ModelForm';
import { useModel, useUpdateModel } from '../hooks/useModels';

export default function ModelUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useModel(Number(id));
  const mutation = useUpdateModel();
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  const model = data?.data;
  if (!model) return null;
  return <ModelForm initialValues={model} onSubmit={(v) => mutation.mutate({ id: model.id, data: {...v, version: model.version} }, { onSuccess: () => { toast.success('수정됨'); navigate('/models'); } })} loading={mutation.isPending} />;
}
