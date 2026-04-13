import { Table, Card, Space } from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { PAGE_SIZE_OPTIONS } from '@dhs/shared';

interface DataTableProps<T> extends Omit<TableProps<T>, 'onChange'> {
  title?: string;
  extra?: React.ReactNode;
  total?: number;
  page?: number;
  limit?: number;
  onTableChange?: (params: {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }) => void;
}

export default function DataTable<T extends object>({
  title,
  extra,
  total = 0,
  page = 1,
  limit = 20,
  onTableChange,
  ...tableProps
}: DataTableProps<T>) {
  const handleChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    onTableChange?.({
      page: pagination.current || 1,
      limit: pagination.pageSize || 20,
      sort: s.field as string,
      order: s.order === 'ascend' ? 'asc' : 'desc',
    });
  };

  return (
    <Card
      title={title}
      extra={extra}
      styles={{ body: { padding: 0, overflow: 'auto' } }}
    >
      <Table<T>
        {...tableProps}
        onChange={handleChange}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
          showTotal: (t) => `총 ${t}건`,
          style: { padding: '0 16px' },
        }}
        scroll={{ x: 'max-content' }}
        size="middle"
        style={{ minWidth: 0 }}
      />
    </Card>
  );
}
