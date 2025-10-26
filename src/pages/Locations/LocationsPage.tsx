import { Helmet } from 'react-helmet-async';
import Container from '../../components/layout/Container';
import LocationCard from '../../components/locations/LocationCard';
import { LOCATIONS } from '../../lib/constants';

const LocationsPage = () => {
  return (
    <>
      <Helmet>
        <title>Cascade &amp; Coast Kitchen | Downtown Vancouver Locations</title>
        <meta
          name="description"
          content="Find Cascade & Coast Kitchen across Downtown Vancouver, from Coal Harbour to Yaletown. View hours, amenities, and directions."
        />
      </Helmet>
      <section className="py-20">
        <Container className="space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-600">Visit Us</p>
            <h1 className="font-display text-4xl font-semibold text-slate-900">
              Five rooms, one hospitality standard
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-slate-600">
              Each Cascade &amp; Coast Kitchen location captures the pulse of its neighborhood while
              keeping the menu and service consistent. Explore detailed hours, transit tips, and
              accessibility notes below.
            </p>
          </header>
          {/* Render the full location catalogue so guests can compare hours and amenities. */}
          <div className="grid gap-10">
            {LOCATIONS.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default LocationsPage;
