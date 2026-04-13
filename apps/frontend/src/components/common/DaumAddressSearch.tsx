import { useEffect, useRef } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

declare global {
  interface Window {
    daum: any;
  }
}

interface DaumAddressSearchProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function DaumAddressSearch({ value, onChange }: DaumAddressSearchProps) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
    scriptLoaded.current = true;
  }, []);

  const handleSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') extraAddress += data.bname;
          if (data.buildingName !== '') {
            extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        onChange?.(fullAddress);
      },
    }).open();
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="주소 검색"
        readOnly
        style={{ cursor: 'pointer' }}
        onClick={handleSearch}
      />
      <Button icon={<SearchOutlined />} onClick={handleSearch}>
        주소 검색
      </Button>
    </Space.Compact>
  );
}
