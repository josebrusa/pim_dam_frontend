import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/shared/ui/AppLayout';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { PublicRoute } from '@/shared/ui/PublicRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { AttributesPage } from '@/features/attributes/pages/AttributesPage';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage';
import { ImportExportPage } from '@/features/importExport/pages/ImportExportPage';
import { MappingPage } from '@/features/mapping/pages/MappingPage';
import { WorkflowsPage } from '@/features/workflows/pages/WorkflowsPage';
import { ChannelsPage } from '@/features/channels/pages/ChannelsPage';
import { GdsnPage } from '@/features/gdsn/pages/GdsnPage';
import { DamPage } from '@/features/dam/pages/DamPage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="attributes" element={<AttributesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="import-export" element={<ImportExportPage />} />
            <Route path="mapping" element={<MappingPage />} />
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route path="channels" element={<ChannelsPage />} />
            <Route path="gdsn" element={<GdsnPage />} />
            <Route path="dam" element={<DamPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
