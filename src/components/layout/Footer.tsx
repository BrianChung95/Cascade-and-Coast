import Container from './Container';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-gradient-to-b from-white to-stone-100 py-12">
      <Container className="grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src="/src/assets/logo.svg" alt="Cascade & Coast logomark" className="h-10 w-10" />
            <span className="font-display text-xl font-semibold text-slate-900">
              Cascade &amp; Coast Kitchen
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-slate-600">
            Crafted coastal fare, curated cocktails, and the warmth of Vancouver hospitality. Join
            us for happy hour daily from 3–6pm.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Visit</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Open late daily &mdash; last seating at 11pm</li>
            <li>Group dining for up to 24 guests</li>
            <li>
              Contact:{' '}
              <a href="tel:+16045551234" className="text-brand-600 hover:text-brand-500">
                (604) 555-1234
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            Newsletter
          </h2>
          <p className="mt-4 text-sm text-slate-600">
            Seasonal menus, events, and exclusive tastings straight to your inbox.
          </p>
          <form className="mt-4 flex gap-2" aria-label="Join our newsletter">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-stone-400 focus:ring-2 focus:ring-brand-300"
            />
            <button
              type="submit"
              className="focus-ring rounded-2xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Join
            </button>
          </form>
        </div>
      </Container>
      <Container className="mt-10 flex flex-col gap-4 border-t border-stone-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {year} Cascade &amp; Coast Hospitality Group. All rights reserved.</p>
        <div className="flex gap-4 text-slate-500">
          <a href="/" className="hover:text-brand-600">
            Privacy
          </a>
          <a href="/" className="hover:text-brand-600">
            Accessibility
          </a>
          <a href="/" className="hover:text-brand-600">
            Careers
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
