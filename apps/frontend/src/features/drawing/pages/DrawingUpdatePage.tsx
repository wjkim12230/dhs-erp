import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Spinner } from '@heroui/react';
import toast from 'react-hot-toast';
import { useDrawing, useUpdateDrawing } from '../hooks/useDrawings';
import ImageUpload from '@/components/common/ImageUpload';
import StickyActions from '@/components/common/StickyActions';

export default function DrawingUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useDrawing(Number(id));
  const mutation = useUpdateDrawing();
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (data?.data) setForm(data.data); }, [data]);
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  return (
    <Card className="w-full"><CardBody className="p-6">
      <h2 className="text-xl font-bold mb-2">도면 수정</h2>
      <StickyActions>
        <Button color="primary" onPress={() => mutation.mutate({ id: +id!, data: { imageUrl: form.imageUrl, lengthCount: form.lengthCount, version: form.version } }, { onSuccess: () => { toast.success('수정됨'); navigate('/drawings'); } })}>수정</Button>
        <Button variant="bordered" onPress={() => navigate('/drawings')}>취소</Button>
      </StickyActions>
      <div className="space-y-4 max-w-xl">
        <ImageUpload value={form.imageUrl} onChange={(url) => setForm((p: any) => ({...p, imageUrl: url}))} />
        <Input label="길이수" size="sm" type="number" value={form.lengthCount?.toString()||''} onValueChange={(v) => setForm((p: any) => ({...p, lengthCount: +v}))} />
      </div>
    </CardBody></Card>
  );
}
