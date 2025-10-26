/**
 * Application Entry Point
 *
 * This file bootstraps the React application and configures global providers:
 * - React Query for server state management (API data caching)
 * - React Router for client-side routing
 * - React Helmet for managing document head (title, meta tags)
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import router from './app/routes';
import './styles/globals.css';

/**
 * React Query Client Configuration
 *
 * Manages server state (API data) with intelligent caching:
 * - staleTime: 5 minutes - Data is considered "fresh" for 5 min, won't refetch
 * - retry: 2 - Failed requests retry twice with exponential backoff
 * - refetchOnWindowFocus: false - Don't refetch when user returns to tab
 *
 * Benefits:
 * - Automatic caching (reduces API calls)
 * - Background refresh when data becomes stale
 * - Loading/error states handled automatically
 * - Request deduplication (multiple components using same data = one request)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      retry: 2,                       // Retry twice on failure
      refetchOnWindowFocus: false     // Don't refetch on tab focus
    }
  }
});

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {/* HelmetProvider: Manages document <head> for SEO (title, meta tags) */}
      <HelmetProvider>
        {/* QueryClientProvider: Makes React Query available to all components */}
        <QueryClientProvider client={queryClient}>
          {/* RouterProvider: Handles client-side routing (/menu, /locations, etc.) */}
          <RouterProvider router={router} />
          {/* DevTools: Debug panel for React Query (development only) */}
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>
      </HelmetProvider>
    </StrictMode>
  );
}
