import { useNavigate } from 'react-router-dom';
import ModelForm from '../components/ModelForm';
import { useCreateModel } from '../hooks/useModels';
import type { ModelCreateDto } from '@dhs/shared';

export default function ModelCreatePage() {
  const navigate = useNavigate();
  const mutation = useCreateModel();
  return <ModelForm onSubmit={(v: ModelCreateDto) => mutation.mutate(v, { onSuccess: () => navigate('/models') })} loading={mutation.isPending} />;
}
