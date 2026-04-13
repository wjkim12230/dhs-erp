import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';
import AuthGuard from '@/components/guard/AuthGuard';
import RoleGuard from '@/components/guard/RoleGuard';
import AdminLayout from '@/components/layout/AdminLayout';

// Auth
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));

// Dashboard
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));

// Employee
const EmployeeListPage = lazy(() => import('@/features/employee/pages/EmployeeListPage'));
const EmployeeCreatePage = lazy(() => import('@/features/employee/pages/EmployeeCreatePage'));
const EmployeeUpdatePage = lazy(() => import('@/features/employee/pages/EmployeeUpdatePage'));

// Model
const ModelListPage = lazy(() => import('@/features/model/pages/ModelListPage'));
const ModelCreatePage = lazy(() => import('@/features/model/pages/ModelCreatePage'));
const ModelUpdatePage = lazy(() => import('@/features/model/pages/ModelUpdatePage'));
const ModelGroupListPage = lazy(() => import('@/features/model/pages/ModelGroupListPage'));
const ModelDetailListPage = lazy(() => import('@/features/model/pages/ModelDetailListPage'));

// Specification
const SpecificationListPage = lazy(() => import('@/features/specification/pages/SpecificationListPage'));
const SpecificationCreatePage = lazy(() => import('@/features/specification/pages/SpecificationCreatePage'));
const SpecificationDetailListPage = lazy(() => import('@/features/specification/pages/SpecificationDetailListPage'));

// Drawing
const DrawingListPage = lazy(() => import('@/features/drawing/pages/DrawingListPage'));
const DrawingCreatePage = lazy(() => import('@/features/drawing/pages/DrawingCreatePage'));
const DrawingUpdatePage = lazy(() => import('@/features/drawing/pages/DrawingUpdatePage'));

// Check Item
const CheckItemListPage = lazy(() => import('@/features/check-item/pages/CheckItemListPage'));
const CheckItemDetailListPage = lazy(() => import('@/features/check-item/pages/CheckItemDetailListPage'));

// Ordering
const OrderingListPage = lazy(() => import('@/features/ordering/pages/OrderingListPage'));
const OrderingCreatePage = lazy(() => import('@/features/ordering/pages/OrderingCreatePage'));
const OrderingUpdatePage = lazy(() => import('@/features/ordering/pages/OrderingUpdatePage'));
const OrderingCopyPage = lazy(() => import('@/features/ordering/pages/OrderingCopyPage'));

// Order Form - removed per user request

// Admin
const AdminListPage = lazy(() => import('@/features/admin-user/pages/AdminListPage'));

// Settings
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));

const Loading = () => <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress /></Box>;

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<AuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Employee */}
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route
              path="/employees/create"
              element={
                <RoleGuard roles={['SUPER', 'ADMIN']}>
                  <EmployeeCreatePage />
                </RoleGuard>
              }
            />
            <Route
              path="/employees/:id/edit"
              element={
                <RoleGuard roles={['SUPER', 'ADMIN']}>
                  <EmployeeUpdatePage />
                </RoleGuard>
              }
            />

            {/* Model */}
            <Route path="/model-groups" element={<ModelGroupListPage />} />
            <Route path="/models" element={<ModelListPage />} />
            <Route path="/models/create" element={<ModelCreatePage />} />
            <Route path="/models/:id/edit" element={<ModelUpdatePage />} />
            <Route path="/models/:modelId/details" element={<ModelDetailListPage />} />

            {/* Specification */}
            <Route path="/specifications" element={<SpecificationListPage />} />
            <Route path="/specifications/create" element={<SpecificationCreatePage />} />
            <Route path="/specifications/:specId/details" element={<SpecificationDetailListPage />} />

            {/* Drawing */}
            <Route path="/drawings" element={<DrawingListPage />} />
            <Route path="/drawings/create" element={<DrawingCreatePage />} />
            <Route path="/drawings/:id/edit" element={<DrawingUpdatePage />} />

            {/* Check Item */}
            <Route path="/check-items" element={<CheckItemListPage />} />
            <Route path="/check-items/:checkItemId/details" element={<CheckItemDetailListPage />} />

            {/* Ordering */}
            <Route path="/orderings" element={<OrderingListPage />} />
            <Route path="/orderings/create" element={<OrderingCreatePage />} />
            <Route path="/orderings/:id/edit" element={<OrderingUpdatePage />} />
            <Route path="/orderings/:id/copy" element={<OrderingCopyPage />} />

            {/* Order Form - removed per user request */}

            {/* System - SUPER only */}
            <Route
              path="/admins"
              element={
                <RoleGuard roles={['SUPER']}>
                  <AdminListPage />
                </RoleGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <RoleGuard roles={['SUPER', 'ADMIN']}>
                  <SettingsPage />
                </RoleGuard>
              }
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: 100 }}>
              <h1>404</h1>
              <p>페이지를 찾을 수 없습니다.</p>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
