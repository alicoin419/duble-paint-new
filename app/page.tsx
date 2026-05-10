import Hero from "@/components/home/Hero";
import MarqueeStrip from "@/components/home/MarqueeStrip";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <MarqueeStrip />
      
      {/* Featured Finishes Section Placeholder */}
      <section className="py-32 px-[var(--grid-margin)]">
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-xl">
            <h2 className="text-display mb-8">Selected <span className="italic">Finishes.</span></h2>
            <p className="text-body opacity-70">A curated collection of textures designed to capture the essence of light and space.</p>
          </div>
          <button className="btn-ghost">View All Finishes &rarr;</button>
        </div>

        {/* Law #2: No Symmetrical Grids. Using 7col/5col split. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 aspect-[4/5] bg-stone relative group overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541824894976-3f0f90768e91?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/0 transition-colors" />
             <div className="absolute bottom-8 left-8 text-bone">
                <span className="text-[10px] uppercase tracking-widest opacity-60">Texture</span>
                <h3 className="text-title">Cappadocia</h3>
             </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex-1 bg-chalk relative group overflow-hidden aspect-video lg:aspect-auto">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615873966503-09717764670c?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute bottom-8 left-8 text-ink">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Pearlescent</span>
                  <h3 className="text-title">Marvellino</h3>
               </div>
            </div>
            <div className="flex-1 bg-stone relative group overflow-hidden aspect-video lg:aspect-auto">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute bottom-8 left-8 text-bone">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Stucco</span>
                  <h3 className="text-title">Stucco-tec</h3>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Rail */}
      <section className="border-y border-rule py-16 px-[var(--grid-margin)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-rule">
          {[
            { label: '65+ FINISHES', sub: 'Hand-crafted textures' },
            { label: '9 SHOWROOMS', sub: 'Across Nigeria' },
            { label: 'SON CERTIFIED', sub: 'Quality assured' },
            { label: 'MADE IN LAGOS', sub: 'Since 2015' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center px-4 first:pl-0 border-rule">
              <span className="text-ui mb-2">{item.label}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-40 italic">{item.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Lookbook Teaser */}
      <section className="bg-ink text-bone py-32 px-[var(--grid-margin)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-display mb-12">The <span className="italic">Lookbook.</span></h2>
            <p className="text-body opacity-70 mb-12">Chapters in materiality. Discover how Double Design transforms space through the dialogue between surface and light.</p>
            <button className="btn-outline border-bone text-bone hover:bg-bone hover:text-ink">Explore Chapters</button>
          </div>
          <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-square">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center scale-110 opacity-80" />
             <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
             <div className="absolute top-0 right-0 p-8">
                <span className="text-ui italic opacity-60">Chapter 01 — Mineral Silence</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
