import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination, Select, SelectItem, Card, CardHeader, CardBody } from '@heroui/react';
import { ReactNode } from 'react';

interface Column { key: string; label: string; width?: number; render?: (value: any, row: any) => ReactNode; }

interface DataTableProps {
  title?: string;
  extra?: ReactNode;
  columns: Column[];
  rows: any[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export default function DataTable({ title, extra, columns, rows, loading, total = 0, page = 1, pageSize = 20, onPageChange, onPageSizeChange }: DataTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Card className="w-full">
      {(title || extra) && (
        <CardHeader className="flex justify-between items-center px-6 py-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {extra}
        </CardHeader>
      )}
      <CardBody className="p-0 overflow-auto">
        <Table aria-label="data table" removeWrapper classNames={{ th: 'bg-gray-50 text-xs text-gray-500 font-semibold uppercase', td: 'py-3' }}>
          <TableHeader>
            {columns.map(col => <TableColumn key={col.key} width={col.width}>{col.label}</TableColumn>)}
          </TableHeader>
          <TableBody isLoading={loading} loadingContent={<Spinner />} emptyContent="데이터 없음">
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>표시</span>
              <select className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white" value={pageSize}
                onChange={(e) => onPageSizeChange?.(+e.target.value)}>
                {[10, 20, 50].map(n => <option key={n} value={n}>{n}개</option>)}
              </select>
              <span className="ml-2">총 {total}건</span>
            </div>
            <Pagination total={totalPages} page={page} onChange={onPageChange} size="sm" showControls color="primary" />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
