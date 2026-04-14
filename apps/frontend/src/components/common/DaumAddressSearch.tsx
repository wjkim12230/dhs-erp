import { useEffect, useRef } from 'react';
import { Input, Button } from '@heroui/react';
import { Search } from 'lucide-react';

declare global { interface Window { daum: any; } }

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
          if (data.buildingName) extra += extra ? ', ' + data.buildingName : data.buildingName;
          addr += extra ? ' (' + extra + ')' : '';
        }
        onChange?.(addr);
      },
    }).open();
  };

  return (
    <div className="flex gap-2">
      <Input size="sm" value={value || ''} placeholder="주소 검색" readOnly className="flex-1 cursor-pointer" onClick={handleSearch} />
      <Button size="sm" variant="bordered" startContent={<Search size={14} />} onPress={handleSearch}>주소 검색</Button>
    </div>
  );
}
