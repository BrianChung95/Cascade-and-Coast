interface MapEmbedProps {
  title: string;
  src: string;
}

const MapEmbed = ({ title, src }: MapEmbedProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-brand-100/60">
      <iframe
        title={title}
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        className="h-64 w-full"
      />
    </div>
  );
};

export default MapEmbed;
