import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Card, CardContent, CardHeader, Box } from '@mui/material';
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
  return (
    <Card>
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
          columns={columns}
          loading={loading}
          rowCount={total}
          pageSizeOptions={[10, 20, 50]}
          paginationModel={{ page, pageSize }}
          paginationMode="server"
          onPaginationModelChange={onPaginationChange}
          localeText={koKR.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#f9fafb' },
            '& .MuiDataGrid-cell': { borderColor: '#f0f0f0' },
          }}
        />
      </CardContent>
    </Card>
  );
}
