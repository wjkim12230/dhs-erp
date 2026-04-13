import { useEffect, useRef } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { Search } from '@mui/icons-material';

declare global {
  interface Window { daum: any; }
}

interface Props { value?: string; onChange?: (v: string) => void; }

export default function DaumAddressSearch({ value, onChange }: Props) {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    const s = document.createElement('script');
    s.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    s.async = true;
    document.head.appendChild(s);
    loaded.current = true;
  }, []);

  const handleSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        let addr = data.address;
        let extra = '';
        if (data.addressType === 'R') {
          if (data.bname) extra += data.bname;
          if (data.buildingName) extra += extra ? `, ${data.buildingName}` : data.buildingName;
          addr += extra ? ` (${extra})` : '';
        }
        onChange?.(addr);
      },
    }).open();
  };

  return (
    <Stack direction="row" spacing={1}>
      <TextField value={value || ''} placeholder="주소 검색" InputProps={{ readOnly: true }} onClick={handleSearch} sx={{ flex: 1, cursor: 'pointer' }} size="small" />
      <Button variant="outlined" startIcon={<Search />} onClick={handleSearch} sx={{ whiteSpace: 'nowrap' }}>주소 검색</Button>
    </Stack>
  );
}
