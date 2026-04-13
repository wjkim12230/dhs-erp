import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Card, CardContent, CardHeader } from '@mui/material';
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
  // 컬럼에 flex가 없으면 남은 공간을 채우도록 마지막 non-action 컬럼에 flex 추가
  const adjustedColumns = columns.map((col, i) => {
    if (col.flex) return col;
    if (col.field === 'actions') return col;
    // 마지막 데이터 컬럼(actions 제외)에 flex:1 부여
    const dataColumns = columns.filter(c => c.field !== 'actions');
    if (i === columns.indexOf(dataColumns[dataColumns.length - 1]) && !col.flex) {
      return { ...col, flex: 1, minWidth: col.width || 100 };
    }
    return col;
  });

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
          onPaginationModelChange={onPaginationChange}
          localeText={{
            ...koKR.components.MuiDataGrid.defaultProps.localeText,
            MuiTablePagination: {
              labelRowsPerPage: '페이지당 행:',
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}-${to} / 총 ${count !== -1 ? count : `${to}+`}건`,
            },
          }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            width: '100%',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#f9fafb' },
            '& .MuiDataGrid-cell': { borderColor: '#f0f0f0' },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #f0f0f0',
            },
            '& .MuiTablePagination-root': {
              overflow: 'visible',
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
