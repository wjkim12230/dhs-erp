import { ReactNode } from 'react';
import { Space } from 'antd';

interface StickyActionsProps {
  children: ReactNode;
}

export default function StickyActions({ children }: StickyActionsProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#fff',
        padding: '12px 0',
        marginBottom: 16,
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Space>{children}</Space>
    </div>
  );
}
