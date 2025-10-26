import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Container from '../components/layout/Container';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Skeleton from '../components/ui/Skeleton';

const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <Container className="py-24">
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </Container>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
