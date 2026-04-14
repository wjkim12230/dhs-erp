import { Chip } from '@heroui/react';
import { OrderStatus, ORDER_STATUS_LABELS } from '@dhs/shared';

const colors: Record<OrderStatus, 'primary' | 'success' | 'default'> = {
  [OrderStatus.ACTIVE]: 'primary',
  [OrderStatus.COMPLETED]: 'success',
  [OrderStatus.DELETED]: 'default',
};

export default function StatusTag({ status }: { status: OrderStatus }) {
  return <Chip size="sm" color={colors[status]} variant="flat">{ORDER_STATUS_LABELS[status]}</Chip>;
}
