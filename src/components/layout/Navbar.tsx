import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import Container from './Container';
import Button from '../ui/Button';

const prefetchMap: Record<string, () => Promise<unknown>> = {
  '/': () => import('../../pages/Home/HomePage'),
  '/menu': () => import('../../pages/Menu/MenuPage'),
  '/locations': () => import('../../pages/Locations/LocationsPage')
};

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Locations', to: '/locations' }
];

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggle = () => setIsMobileOpen((prev) => !prev);
  const handleClose = () => setIsMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 focus-ring" onClick={handleClose}>
          <img src="/src/assets/logo.svg" alt="Cascade & Coast Kitchen logo" className="h-10 w-10" />
          <span className="font-display text-xl font-semibold tracking-wide text-slate-900">
            Cascade &amp; Coast
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'text-sm font-medium transition-colors hover:text-brand-500 focus-ring',
                  {
                    'text-brand-600': isActive,
                    'text-slate-600': !isActive
                  }
                )
              }
              onPointerEnter={() => prefetchMap[to]?.()}
              onFocus={() => prefetchMap[to]?.()}
            >
              {label}
            </NavLink>
          ))}
          <Button asChild variant="primary">
            <a
              href="https://calendar.app.google/"
              target="_blank"
              rel="noreferrer"
              className="focus-ring"
            >
              Reserve Now
            </a>
          </Button>
        </nav>
        <button
          type="button"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 bg-white/80 text-slate-700 shadow-sm transition hover:bg-white md:hidden"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          <span className="sr-only">Toggle menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileOpen ? (
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>
      {isMobileOpen ? (
        <div id="mobile-menu" className="border-t border-stone-200 bg-white/95 md:hidden">
          <Container className="flex flex-col gap-5 py-6">
            {navItems.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx('text-base font-medium', {
                    'text-brand-600': isActive,
                    'text-slate-700': !isActive
                  })
                }
                onClick={handleClose}
              >
                {label}
              </NavLink>
            ))}
            <Button asChild variant="primary" onClick={handleClose}>
              <a href="https://calendar.app.google/" target="_blank" rel="noreferrer">
                Reserve Now
              </a>
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
