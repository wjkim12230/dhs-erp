import { DataGrid, GridColDef, GridPaginationModel, GridSlots } from '@mui/x-data-grid';
import { Card, CardContent, CardHeader, Box, Typography, Select, MenuItem, IconButton, Stack } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { koKR } from '@mui/x-data-grid/locales';

interface DataTableProps {
  title?: string;
  extra?: React.ReactNode;
  columns: GridColDef[];
  rows: any[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPaginationChange?: (model: GridPaginationModel) => void;
}

function CustomFooter({ page, pageSize, total, onChange }: { page: number; pageSize: number; total: number; onChange: (m: GridPaginationModel) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderTop: '1px solid #f0f0f0', flexWrap: 'wrap', gap: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary">표시</Typography>
        <Select
          size="small"
          value={pageSize}
          onChange={(e) => onChange({ page: 0, pageSize: +e.target.value })}
          sx={{ minWidth: 70, height: 32, '& .MuiSelect-select': { py: 0.5 } }}
        >
          {[10, 20, 50].map((n) => (
            <MenuItem key={n} value={n}>{n}개</MenuItem>
          ))}
        </Select>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          {total > 0 ? `${from}-${to} / 총 ${total}건` : '데이터 없음'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <IconButton size="small" disabled={page === 0} onClick={() => onChange({ page: page - 1, pageSize })}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="body2" sx={{ mx: 1, fontWeight: 600 }}>
            {page + 1} / {totalPages}
          </Typography>
          <IconButton size="small" disabled={page >= totalPages - 1} onClick={() => onChange({ page: page + 1, pageSize })}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}

export default function DataTable({
  title,
  extra,
  columns,
  rows,
  loading,
  total = 0,
  page = 0,
  pageSize = 20,
  onPaginationChange,
}: DataTableProps) {
  const adjustedColumns = columns.map((col, i) => {
    if (col.flex) return col;
    if (col.field === 'actions') return col;
    const dataColumns = columns.filter(c => c.field !== 'actions');
    if (i === columns.indexOf(dataColumns[dataColumns.length - 1]) && !col.flex) {
      return { ...col, flex: 1, minWidth: col.width || 100 };
    }
    return col;
  });

  const handleChange = (model: GridPaginationModel) => {
    onPaginationChange?.(model);
  };

  return (
    <Card sx={{ width: '100%' }}>
      {(title || extra) && (
        <CardHeader
          title={title}
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          action={extra}
        />
      )}
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <DataGrid
          rows={rows}
          columns={adjustedColumns}
          loading={loading}
          rowCount={total}
          pageSizeOptions={[10, 20, 50]}
          paginationModel={{ page, pageSize }}
          paginationMode="server"
          onPaginationModelChange={handleChange}
          localeText={koKR.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
          autoHeight
          hideFooter
          sx={{
            border: 'none',
            width: '100%',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#f9fafb' },
            '& .MuiDataGrid-cell': { borderColor: '#f0f0f0' },
          }}
        />
        <CustomFooter page={page} pageSize={pageSize} total={total} onChange={handleChange} />
      </CardContent>
    </Card>
  );
}
