import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Quick-hit talking points surfaced beneath the hero section.
const highlights = [
  {
    title: 'Happy Hour',
    description: 'Half-price share plates, craft cocktails, and local pours every day from 3–6pm.'
  },
  {
    title: 'Seasonal Features',
    description: 'Chef Elise and the brigade spotlight coastal flavors with rotating small plates and mains.'
  },
  {
    title: 'Chef’s Table',
    description: 'Reserve an immersive seven-course tasting menu with wine pairings each Thursday to Saturday.'
  }
];

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Cascade &amp; Coast Kitchen | Elevated Coastal Dining</title>
        <meta
          name="description"
          content="Discover Cascade & Coast Kitchen in Downtown Vancouver. Elevated comfort food, handcrafted cocktails, and a vibrant atmosphere across five locations."
        />
      </Helmet>
      <section className="relative overflow-hidden pb-24 pt-24">
        <div className="absolute inset-0 -z-10">
          {/* Soft gradient blobs reinforce the brand palette behind the hero. */}
          <div className="absolute -left-16 top-[-6rem] h-[24rem] w-[24rem] rounded-full bg-brand-200/40 blur-[140px]" />
          <div className="absolute right-[-12rem] top-28 h-[28rem] w-[28rem] rounded-full bg-orange-200/40 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85)_0%,transparent_55%)]" />
        </div>
        <Container className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.45em] text-brand-600">
              Cascade &amp; Coast Kitchen
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Coastal comfort with bright Vancouver energy.
            </h1>
            <p className="text-lg text-slate-600">
              A Downtown Vancouver staple blending wood-fired plates, BC spirits, and the hum of
              great conversation. Settle in for golden-hour spritzes, late-night snacks, or a table
              full of friends.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/menu">View Menu</Link>
              </Button>
              {/* Secondary CTA drives visitors toward the locations page. */}
              <Button asChild size="lg" variant="secondary">
                <Link to="/locations">Find a Location</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
              alt="Coastal-inspired dining table with cocktails and shared plates"
              className="w-full rounded-[36px] border border-white object-cover shadow-2xl shadow-brand-200/60"
              loading="lazy"
            />
            <div className="absolute -bottom-8 right-6 inline-flex flex-col rounded-[28px] border border-stone-200 bg-white/95 p-6 text-left shadow-xl shadow-brand-200/70 backdrop-blur">
              <span className="text-xs uppercase tracking-[0.4em] text-brand-600">
                Signature Cocktail
              </span>
              <span className="mt-2 font-display text-lg font-semibold text-slate-900">
                Seawall Spritz
              </span>
              <p className="mt-1 text-xs text-slate-600">
                Citrus gin, coastal botanicals, yuzu tonic
              </p>
            </div>
          </div>
        </Container>
      </section>
      <section className="pb-24">
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <Card key={highlight.title} className="!h-auto">
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  {highlight.title}
                </h3>
                <p className="mt-4 text-sm text-slate-600">{highlight.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
      <section className="pb-32">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Rooted in the Pacific Northwest
            </h2>
            <p className="mt-6 text-base text-slate-600">
              Cascade &amp; Coast Kitchen celebrates the flavors of the Pacific. From sustainable
              seafood to charred farm vegetables, our menu highlights seasonal ingredients and
              playful techniques. Our beverage program showcases small-batch distillers and BC wine
              estates.
            </p>
            <p className="mt-4 text-base text-slate-600">
              Join us across Downtown Vancouver for lunch, dinner, and late-night hospitality. Every
              room is designed for effortless gatherings, complete with plush seating, ambient
              lighting, and an upbeat soundtrack curated nightly by our resident DJs.
            </p>
          </div>
          <div className="space-y-6">
            <Card className="!h-auto">
              <h3 className="font-display text-lg font-semibold text-slate-900">Community First</h3>
              <p className="mt-3 text-sm text-slate-600">
                We partner with local producers, feature Indigenous-owned suppliers, and actively
                support food security initiatives through monthly chef collaborations.
              </p>
            </Card>
            <Card className="!h-auto">
              <h3 className="font-display text-lg font-semibold text-slate-900">Design for All</h3>
              <p className="mt-3 text-sm text-slate-600">
                Accessible entryways, inclusive washrooms, and dedicated seating zones make each
                location welcoming to every guest.
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
