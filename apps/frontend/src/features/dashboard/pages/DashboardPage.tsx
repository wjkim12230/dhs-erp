import { Card, CardBody } from '@heroui/react';
import { Users, FileText, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';

function Stat({ title, value, icon: Icon, color }: { title: string; value: any; icon: any; color: string }) {
  return (
    <Card><CardBody className="flex flex-row items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}><Icon size={22} className="text-white" /></div>
      <div><p className="text-sm text-gray-500">{title}</p><p className="text-2xl font-bold">{value ?? '-'}</p></div>
    </CardBody></Card>
  );
}

export default function DashboardPage() {
  const { data: emp } = useQuery({ queryKey: ['d','emp'], queryFn: async () => { const r = await apiClient.get('/employees?limit=1&employmentStatus=ACTIVE'); return r.data.meta?.total ?? 0; } });
  const { data: ord } = useQuery({ queryKey: ['d','ord'], queryFn: async () => { const r = await apiClient.get('/orderings?limit=1&status=ACTIVE'); return r.data.meta?.total ?? 0; } });
  const { data: comp } = useQuery({ queryKey: ['d','comp'], queryFn: async () => { const r = await apiClient.get('/orderings?limit=1&status=COMPLETED'); return r.data.meta?.total ?? 0; } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat title="재직 직원" value={emp} icon={Users} color="bg-brand" />
        <Stat title="진행중 수주" value={ord} icon={FileText} color="bg-orange-500" />
        <Stat title="완료 수주" value={comp} icon={CheckCircle} color="bg-green-600" />
      </div>
    </div>
  );
}
