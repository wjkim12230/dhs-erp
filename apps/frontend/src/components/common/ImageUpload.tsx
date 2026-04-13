import { useRef, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/stores/authStore';
import apiClient from '@/services/apiClient';

interface Props { value?: string; onChange?: (url: string) => void; maxSize?: number; }

export default function ImageUpload({ value, onChange, maxSize = 10 }: Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { enqueueSnackbar('이미지 파일만 업로드 가능합니다.', { variant: 'error' }); return; }
    if (file.size / 1024 / 1024 > maxSize) { enqueueSnackbar(`${maxSize}MB 이하 파일만 업로드 가능합니다.`, { variant: 'error' }); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post('/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange?.(res.data.data.url);
      enqueueSnackbar('업로드 완료', { variant: 'success' });
    } catch {
      enqueueSnackbar('업로드 실패', { variant: 'error' });
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Box>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      {value ? (
        <Box sx={{ position: 'relative', width: 160, height: 160, borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0', cursor: 'pointer' }} onClick={() => inputRef.current?.click()}>
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      ) : (
        <Button variant="outlined" startIcon={loading ? <CircularProgress size={18} /> : <CloudUpload />} onClick={() => inputRef.current?.click()} disabled={loading}
          sx={{ width: 160, height: 160, flexDirection: 'column', borderStyle: 'dashed', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ mt: 1 }}>{loading ? '업로드중...' : '이미지 선택'}</Typography>
        </Button>
      )}
    </Box>
  );
}
