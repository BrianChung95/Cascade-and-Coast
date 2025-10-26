import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';

// Lazy-load each top-level page so the initial bundle stays focused on the shared shell.
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const MenuPage = lazy(() => import('../pages/Menu/MenuPage'));
const LocationsPage = lazy(() => import('../pages/Locations/LocationsPage'));

// App renders the frame (navbar/footer). Child routes swap their content via <Outlet />.
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'menu',
        element: <MenuPage />
      },
      {
        path: 'locations',
        element: <LocationsPage />
      }
    ]
  }
]);

export default router;
