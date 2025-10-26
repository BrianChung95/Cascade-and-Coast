import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';

const HomePage = lazy(() => import('../pages/Home/HomePage'));
const MenuPage = lazy(() => import('../pages/Menu/MenuPage'));
const LocationsPage = lazy(() => import('../pages/Locations/LocationsPage'));

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
