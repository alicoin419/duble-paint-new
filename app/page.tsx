import Hero from "@/components/home/Hero";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <MarqueeStrip />

      {/* Featured Finishes Section */}
      <section className="py-20 md:py-28 lg:py-40 px-[var(--grid-margin)]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12 md:mb-16 lg:mb-20">
          <div className="max-w-xl">
            <h2 className="text-display mb-5 md:mb-8 lg:mb-10">Selected <span className="italic">Finishes.</span></h2>
            <p className="text-body opacity-70 leading-relaxed">A curated collection of textures designed to capture the essence of light and space.</p>
          </div>
          <Link href="/finishes" className="btn-ghost btn-lift self-start sm:self-auto whitespace-nowrap">View All Finishes &rarr;</Link>
        </div>

        {/* Law #2: No Symmetrical Grids. 7col/5col split. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-10">
          <div className="lg:col-span-7 aspect-[4/3] sm:aspect-[4/5] bg-stone relative group overflow-hidden">
            <div className="absolute inset-0 bg-[url('/posts/649871712_18424424908137654_7323097420623266103_n.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/0 transition-colors" />
            <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-10 text-bone">
              <span className="text-xs uppercase tracking-widest opacity-80">Stucco</span>
              <h3 className="text-title" style={{ color: 'white' }}>5 Stunning Stucco Finishes</h3>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6 lg:gap-10">
            <div className="flex-1 bg-chalk relative group overflow-hidden aspect-video lg:aspect-auto min-h-[200px]">
              <div className="absolute inset-0 bg-[url('/posts/656425529_18428235988137654_5437037602706613576_n.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8">
                <span className="text-xs uppercase tracking-widest opacity-70 text-ink">Pearlescent</span>
                <h3 className="text-title">Marvellino</h3>
              </div>
            </div>
            <div className="flex-1 bg-stone relative group overflow-hidden aspect-video lg:aspect-auto min-h-[200px]">
              <div className="absolute inset-0 bg-[url('/posts/641279800_2110078083158893_6285086235248295224_n.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 text-bone">
                <span className="text-xs uppercase tracking-widest opacity-80">Stucco</span>
                <h3 className="text-title" style={{ color: 'white' }}>Tuscania</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Rail */}
      <section className="border-y border-rule py-10 md:py-16 lg:py-20 px-[var(--grid-margin)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-10">
          {[
            { label: '65+ FINISHES', sub: 'Hand-crafted textures' },
            { label: '9 SHOWROOMS', sub: 'Across Nigeria' },
            { label: 'PGN ENDORSED', sub: "Painters' Guild of Nigeria" },
            { label: 'MADE IN LAGOS', sub: 'Since 2015' },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col items-center text-center px-2 md:px-4 ${i !== 0 ? 'border-l border-rule' : ''}`}>
              <span className="text-ui mb-2 md:mb-3">{item.label}</span>
              <span className="text-xs uppercase tracking-wider opacity-60 italic">{item.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PGN Endorsement Banner */}
      <section className="py-14 md:py-20 px-[var(--grid-margin)] bg-chalk border-y border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="md:col-span-4 lg:col-span-3 relative aspect-[4/3] overflow-hidden">
            <img
              src="/posts/658436103_18428684548137654_4294175725695157346_n.jpg"
              alt="Painters Guild of Nigeria Official Product Endorsement"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <span className="text-xs uppercase tracking-widest text-forest block mb-4">Official Endorsement</span>
            <h2 className="text-title mb-4 md:mb-5">Endorsed by the <span className="italic">Painters&apos; Guild of Nigeria.</span></h2>
            <p className="text-body opacity-70 max-w-2xl leading-relaxed">
              Double Design Paints has been officially endorsed by the Painters&apos; Guild of Nigeria (PGN) for demonstrated quality performance, consistent industry support, and established trust among professional painters across Nigeria. Valid 2026–2028.
            </p>
          </div>
        </div>
      </section>

      {/* Lookbook Teaser */}
      <section className="bg-ink text-bone py-20 md:py-28 lg:py-40 px-[var(--grid-margin)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 lg:gap-20 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <h2 className="text-display mb-8 md:mb-10 lg:mb-14" style={{ color: 'white' }}>The <span className="italic">Lookbook.</span></h2>
            <p className="text-body opacity-70 mb-8 md:mb-10 lg:mb-14 leading-relaxed">Chapters in materiality. Discover how Double Design transforms space through the dialogue between surface and light.</p>
            <Link href="/lookbook" className="btn-lift border border-bone px-5 md:px-6 py-3.5 md:py-3 uppercase text-bone hover:bg-bone hover:text-ink transition-all duration-300 text-ui tracking-widest inline-block min-h-[48px] flex items-center w-fit">
              Explore Chapters
            </Link>
          </div>
          <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-square order-1 lg:order-2">
            <div className="absolute inset-0 bg-[url('/posts/651591691_18425213830137654_6239825968475969113_n.jpg')] bg-cover bg-center scale-110 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute top-0 right-0 p-5 md:p-8 lg:p-10">
              <span className="text-ui italic opacity-60">Chapter 01 — Mineral Silence</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
