import { useRef, useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/services/apiClient';

interface Props { value?: string; onChange?: (url: string) => void; maxSize?: number; }

export default function ImageUpload({ value, onChange, maxSize = 10 }: Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('이미지 파일만 업로드 가능합니다.'); return; }
    if (file.size / 1024 / 1024 > maxSize) { toast.error(maxSize + 'MB 이하만 가능합니다.'); return; }
    setLoading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await apiClient.post('/files/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange?.(res.data.data.url);
      toast.success('업로드 완료');
    } catch { toast.error('업로드 실패'); }
    finally { setLoading(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      {value ? (
        <div className="w-40 h-40 rounded-xl overflow-hidden border border-gray-200 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <img src={value} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <Button variant="bordered" className="w-40 h-40 flex-col border-dashed" onPress={() => inputRef.current?.click()} isDisabled={loading}>
          {loading ? <Spinner size="sm" /> : <Upload size={24} className="text-gray-400" />}
          <span className="text-xs text-gray-500 mt-1">{loading ? '업로드중...' : '이미지 선택'}</span>
        </Button>
      )}
    </div>
  );
}
