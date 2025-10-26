import type { Location } from '../../lib/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import MapEmbed from './MapEmbed';

interface LocationCardProps {
  location: Location;
}

const LocationCard = ({ location }: LocationCardProps) => {
  const { notes } = location;

  return (
    <Card className="space-y-6 p-0">
      <div className="grid gap-8 p-6 md:grid-cols-5 md:gap-10">
        <div className="md:col-span-2">
          <MapEmbed title={`${location.name} map`} src={location.mapsEmbedUrl} />
        </div>
        <div className="space-y-6 md:col-span-3">
          <div>
            <h3 className="font-display text-2xl font-semibold text-slate-900">{location.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{location.address}</p>
            <p className="mt-3 text-sm text-slate-600">{notes.neighborhood}</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500">
              <li>Parking: {notes.parking}</li>
              <li>Transit: {notes.transit}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
              Hours
            </h4>
            <dl className="mt-4 space-y-2 text-sm">
              {Object.entries(location.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-6 border-b border-stone-100 pb-2 last:border-0">
                  <dt className="min-w-[6rem] font-medium capitalize text-slate-700">{day}</dt>
                  <dd className="text-slate-600">{hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-stone-200 bg-stone-100/60 px-6 py-4 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="font-semibold text-slate-900">Reservations</span>
          <a href={`tel:${location.phone}`} className="ml-2 text-brand-600 hover:text-brand-500">
            {location.phone}
          </a>
        </div>
        <Button asChild size="sm" variant="primary">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
            target="_blank"
            rel="noreferrer"
          >
            Directions
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default LocationCard;
