import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/shared/ui/AppLayout';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ModulePlaceholderPage } from '@/shared/ui/ModulePlaceholderPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route
              path="attributes"
              element={
                <ModulePlaceholderPage
                  title="Gestión de Atributos"
                  subtitle="Módulo 02 — Define y organiza los atributos del catálogo"
                  secondaryAction="Exportar"
                  primaryAction="+ Nuevo atributo"
                />
              }
            />
            <Route
              path="products"
              element={
                <ModulePlaceholderPage
                  title="PDP / Búsqueda de Productos"
                  subtitle="Módulo 03 — Fichas de producto y motor de búsqueda"
                  secondaryAction="Filtros avanzados"
                  primaryAction="+ Nuevo producto"
                />
              }
            />
            <Route
              path="categories"
              element={
                <ModulePlaceholderPage
                  title="Categorías & Taxonomías"
                  subtitle="Gestión de jerarquías y clasificación del catálogo"
                  secondaryAction="Importar árbol"
                  primaryAction="+ Nueva categoría"
                />
              }
            />
            <Route
              path="import-export"
              element={
                <ModulePlaceholderPage
                  title="Import / Export"
                  subtitle="Módulo 05 — Importación y exportación masiva de datos"
                  secondaryAction="Exportar"
                  primaryAction="+ Nueva importación"
                />
              }
            />
            <Route
              path="mapping"
              element={
                <ModulePlaceholderPage
                  title="Mapping & Transformaciones"
                  subtitle="Motor de mapeo y transformación de campos entre sistemas"
                  secondaryAction="Probar mapeo"
                  primaryAction="+ Nueva regla"
                />
              }
            />
            <Route
              path="workflows"
              element={
                <ModulePlaceholderPage
                  title="Workflows"
                  subtitle="Flujos de aprobación y ciclo de vida del producto"
                  secondaryAction="Ver mis tareas"
                  primaryAction="+ Nuevo workflow"
                />
              }
            />
            <Route
              path="channels"
              element={
                <ModulePlaceholderPage
                  title="Canales & Conectividad"
                  subtitle="Módulo 09 — Gestión de canales de publicación y conectores"
                  secondaryAction="Sincronizar todos"
                  primaryAction="+ Nuevo canal"
                />
              }
            />
            <Route
              path="gdsn"
              element={
                <ModulePlaceholderPage
                  title="GDSN / GS1 Syndication"
                  subtitle="Sincronización global de datos de producto mediante estándares GS1"
                  secondaryAction="Ver publicaciones"
                  primaryAction="+ Enviar al pool"
                />
              }
            />
            <Route
              path="dam"
              element={
                <ModulePlaceholderPage
                  title="DAM — Gestión de Activos Digitales"
                  subtitle="Biblioteca centralizada de imágenes, vídeos y documentos"
                  secondaryAction="Vista galería"
                  primaryAction="↑ Subir activos"
                />
              }
            />
            <Route
              path="users"
              element={
                <ModulePlaceholderPage
                  title="Usuarios, Roles & Permisos"
                  subtitle="Módulo 07/08 — Control de acceso y gestión de equipo"
                  secondaryAction="Exportar usuarios"
                  primaryAction="+ Invitar usuario"
                />
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
