import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { People, Description, CheckCircle, Assignment } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, color }}>{icon}</Box>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: emp } = useQuery({ queryKey: ['dashboard', 'employees'], queryFn: async () => { const r = await apiClient.get('/employees?limit=1&employmentStatus=ACTIVE'); return r.data.meta?.total ?? 0; } });
  const { data: ord } = useQuery({ queryKey: ['dashboard', 'orderings'], queryFn: async () => { const r = await apiClient.get('/orderings?limit=1&status=ACTIVE'); return r.data.meta?.total ?? 0; } });
  const { data: comp } = useQuery({ queryKey: ['dashboard', 'completed'], queryFn: async () => { const r = await apiClient.get('/orderings?limit=1&status=COMPLETED'); return r.data.meta?.total ?? 0; } });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>대시보드</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="재직 직원" value={emp ?? '-'} icon={<People />} color="#005BAC" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="진행중 수주" value={ord ?? '-'} icon={<Description />} color="#ed6c02" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="완료 수주" value={comp ?? '-'} icon={<CheckCircle />} color="#2e7d32" /></Grid>
      </Grid>
    </Box>
  );
}
