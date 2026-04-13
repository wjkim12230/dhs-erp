import { Chip } from '@mui/material';
import { OrderStatus, ORDER_STATUS_LABELS } from '@dhs/shared';

const STATUS_COLORS: Record<OrderStatus, 'info' | 'success' | 'default'> = {
  [OrderStatus.ACTIVE]: 'info',
  [OrderStatus.COMPLETED]: 'success',
  [OrderStatus.DELETED]: 'default',
};

export default function StatusTag({ status }: { status: OrderStatus }) {
  return <Chip label={ORDER_STATUS_LABELS[status]} color={STATUS_COLORS[status]} size="small" />;
}
