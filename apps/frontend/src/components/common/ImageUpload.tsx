import { useState } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useAuthStore } from '@/stores/authStore';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  maxSize?: number; // MB
}

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export default function ImageUpload({ value, onChange, maxSize = 10 }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.token);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('이미지 파일만 업로드 가능합니다.');
      return false;
    }
    const isLt = file.size / 1024 / 1024 < maxSize;
    if (!isLt) {
      message.error(`${maxSize}MB 이하 파일만 업로드 가능합니다.`);
      return false;
    }
    return true;
  };

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      const url = info.file.response?.data?.url;
      if (url) {
        onChange?.(url);
        message.success('업로드 완료');
      }
    }
    if (info.file.status === 'error') {
      setLoading(false);
      message.error('업로드 실패');
    }
  };

  return (
    <Upload
      name="file"
      listType="picture-card"
      showUploadList={false}
      action={`${API_BASE}/files/upload`}
      headers={{ Authorization: `Bearer ${token}` }}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {value ? (
        <img src={value} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>{loading ? '업로드중' : '이미지 선택'}</div>
        </div>
      )}
    </Upload>
  );
}
