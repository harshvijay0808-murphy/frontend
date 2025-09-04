import { createBrowserRouter } from 'react-router-dom';

// project-imports
import PagesRoutes from './PagesRoutes';
import NavigationRoutes from './NavigationRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import FormsRoutes from './FormsRoutes';
import TablesRoutes from './TablesRoutes';
import ChartMapRoutes from './ChartMapRoutes';
import OtherRoutes from './OtherRoutes';
import UserManagementRoutes from './UserManagementRoutes';
import UserProfileRoute from './UserProfileRoute';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [NavigationRoutes, UserManagementRoutes, ComponentsRoutes, FormsRoutes, TablesRoutes, ChartMapRoutes, PagesRoutes, OtherRoutes, UserProfileRoute],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
