import { Tag } from 'antd';
import { OrderStatus, ORDER_STATUS_LABELS } from '@dhs/shared';

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.ACTIVE]: 'processing',
  [OrderStatus.COMPLETED]: 'success',
  [OrderStatus.DELETED]: 'default',
};

interface StatusTagProps {
  status: OrderStatus;
}

export default function StatusTag({ status }: StatusTagProps) {
  return <Tag color={STATUS_COLORS[status]}>{ORDER_STATUS_LABELS[status]}</Tag>;
}
