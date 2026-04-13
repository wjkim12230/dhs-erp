import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import ModelForm from '../components/ModelForm';
import { useModel, useUpdateModel } from '../hooks/useModels';

export default function ModelUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useModel(Number(id));
  const mutation = useUpdateModel();
  if (isLoading) return <Box sx={{ display:'flex', justifyContent:'center', py:10 }}><CircularProgress /></Box>;
  const model = data?.data;
  if (!model) return null;
  return <ModelForm initialValues={model} onSubmit={(v) => mutation.mutate({ id: model.id, data: {...v, version: model.version} }, { onSuccess: () => { enqueueSnackbar('수정됨', {variant:'success'}); navigate('/models'); } })} loading={mutation.isPending} />;
}
