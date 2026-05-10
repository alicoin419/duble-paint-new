import TextureMagnifier from "@/components/finish/TextureMagnifier";
import Link from "next/link";

// Mock Data for demonstration
const MOCK_FINISH = {
  name: 'Cappadocia',
  category: 'Texture',
  tagline: 'Travertine memory in fine quartz.',
  sku: 'DDP-TEX-001',
  description: 'A deeply textured finish that evokes the ancient stone landscapes of Anatolia. Cappadocia captures light in its rugged pits and smooth ridges, creating a surface that feels both geological and refined.',
  image: 'https://images.unsplash.com/photo-1541824894976-3f0f90768e91?q=80&w=2670&auto=format&fit=crop',
  macro: 'https://images.unsplash.com/photo-1541824894976-3f0f90768e91?q=80&w=2670&auto=format&fit=crop',
  specs: [
    { label: 'TYPE OF SURFACE', value: 'Plaster / Cement' },
    { label: 'BASE COAT', value: 'DDP Primer XL' },
    { label: 'APPLICATION', value: 'Stainless Trowel' },
    { label: 'COVERAGE', value: '14–16m²/32kg drum' },
    { label: 'DRYING TIME', value: '12-24 Hours' },
    { label: 'PACK SIZE', value: '32kg Drum' },
  ]
};

export default function FinishPage() {
  const finish = MOCK_FINISH;

  return (
    <div className="flex flex-col min-h-screen bg-bone">
      {/* Above Fold: Two-Panel Layout (Law #2: Asymmetric) */}
      <section className="grid grid-cols-1 lg:grid-cols-10 border-b border-rule">
        {/* Left 60%: Visuals */}
        <div className="lg:col-span-6 relative border-r border-rule">
          <TextureMagnifier 
            src={finish.image} 
            magnifiedSrc={finish.macro} 
          />
          <div className="absolute top-8 left-8">
            <Link href="/finishes" className="btn-ghost !px-0 flex items-center gap-2 group">
              <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Collection
            </Link>
          </div>
          <div className="absolute bottom-8 left-8">
            <span className="bg-ink text-bone text-[10px] uppercase tracking-widest px-3 py-1">
              {finish.category}
            </span>
          </div>
        </div>

        {/* Right 40%: Details */}
        <div className="lg:col-span-4 p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-display mb-4">{finish.name}</h1>
            <div className="hr-rule mb-6" />
            <p className="text-title italic opacity-70 mb-8">{finish.tagline}</p>
            <p className="text-body opacity-60 leading-relaxed mb-12">
              {finish.description}
            </p>
            
            <div className="flex flex-col gap-4">
              <button className="btn-primary w-full">Order Sample</button>
              <button className="btn-ghost w-full">Add to Moodboard</button>
              <button className="btn-outline w-full">Find in Showroom</button>
            </div>
          </div>

          <div className="mt-auto pt-12 border-t border-rule">
            <span className="text-spec uppercase tracking-widest opacity-40">SKU: {finish.sku}</span>
          </div>
        </div>
      </section>

      {/* Specification Section */}
      <section className="py-24 px-[var(--grid-margin)] bg-chalk">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-title mb-12 uppercase tracking-widest flex items-center gap-4">
            Technical Dossier
            <div className="h-[1px] flex-1 bg-rule" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {finish.specs.map((spec) => (
              <div key={spec.label} className="flex justify-between items-end border-b border-rule pb-4 group">
                <span className="text-ui opacity-40 group-hover:opacity-100 transition-opacity">{spec.label}</span>
                <span className="text-body font-mono text-right">{spec.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <button className="btn-outline border-ink">Download Full Specification PDF</button>
          </div>
        </div>
      </section>
    </div>
  );
}
