'use client';

const ITEMS = [
  'Polished Plaster',
  'Travertine Effects',
  'Metallic Stucco',
  'Architectural Concrete',
  'Pearl Glazes',
  'Venetian Marble',
];

export default function MarqueeStrip() {
  const content = [...ITEMS, ...ITEMS, ...ITEMS]; // Repeat for seamless loop

  return (
    <div className="h-16 border-b border-rule flex items-center overflow-hidden bg-bone whitespace-nowrap">
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {content.map((item, i) => (
          <div key={i} className="flex items-center px-8">
            <span className="text-ui text-ink/60 tracking-widest uppercase">{item}</span>
            <span className="ml-16 w-1.5 h-1.5 bg-petra" />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
