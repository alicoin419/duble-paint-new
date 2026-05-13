import { notFound } from 'next/navigation';
import TextureMagnifier from '@/components/finish/TextureMagnifier';
import Link from 'next/link';
import { getFinishBySlug, FINISH_CATALOG } from '@/lib/data/catalog';
import AddToSampleBoxButton from '@/components/finish/AddToSampleBoxButton';

export function generateStaticParams() {
  return FINISH_CATALOG.map((f) => ({ slug: f.id }));
}

export default async function FinishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const finish = getFinishBySlug(slug);
  if (!finish) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-bone">
      {/* Above Fold: Two-Panel Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-10 border-b border-rule">
        {/* Left 60%: Visuals */}
        <div className="lg:col-span-6 relative border-r border-rule">
          <TextureMagnifier
            src={finish.image}
            magnifiedSrc={finish.image}
          />
          {/* Colour swatch overlay at bottom of image */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{ backgroundColor: finish.hex }}
          />
          <div className="absolute top-8 left-8">
            <Link href="/finishes" className="btn-ghost !px-0 flex items-center gap-2 group">
              <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Collection
            </Link>
          </div>
          <div className="absolute bottom-10 left-8">
            <span className="bg-ink text-bone text-[10px] uppercase tracking-widest px-3 py-1">
              {finish.category}
            </span>
          </div>
        </div>

        {/* Right 40%: Details */}
        <div className="lg:col-span-4 p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-12">
            {/* Colour chip */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 border border-rule" style={{ backgroundColor: finish.hex }} />
              <span className="text-spec uppercase tracking-widest opacity-40">{finish.hex}</span>
            </div>

            <h1 className="text-display mb-4">{finish.name}</h1>
            <div className="hr-rule mb-6" />
            <p className="text-title italic opacity-70 mb-8">{finish.tagline}</p>
            <p className="text-body opacity-60 leading-relaxed mb-12">
              {finish.description}. A premium architectural surface finish, hand-crafted in Lagos using mineral pigments and natural aggregates.
            </p>

            <div className="flex flex-col gap-4">
              <AddToSampleBoxButton finish={{ id: finish.id, name: finish.name, category: finish.category, image: finish.image }} />
              <Link href="/showrooms" className="btn-outline w-full text-center">Find in Showroom</Link>
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

      {/* Related Finishes */}
      <section className="py-24 px-[var(--grid-margin)]">
        <h2 className="text-title mb-12 uppercase tracking-widest">
          More in <span className="italic">{finish.category}</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FINISH_CATALOG
            .filter((f) => f.category === finish.category && f.id !== finish.id)
            .slice(0, 4)
            .map((related) => (
              <Link
                key={related.id}
                href={`/finishes/${related.id}`}
                className="group relative aspect-square overflow-hidden"
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundColor: related.hex }}
                />
                <img
                  src={related.image}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-ui text-bone">{related.name}</h3>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
