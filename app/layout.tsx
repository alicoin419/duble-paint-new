import type { Metadata } from "next";
import "./globals.css";
import UtilityBar from "@/components/global/UtilityBar";
import Navigation from "@/components/global/Navigation";

export const metadata: Metadata = {
  title: "Double Design Paints | Scientific Luxury Surfaces",
  description: "Bespoke architectural coatings and premium finishes for designers and architects. Made in Lagos since 2015.",
  keywords: ["paint", "luxury surfaces", "architectural coatings", "polished plaster", "travertine", "Lagos", "Nigeria"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-ui bg-bone text-ink">
        <UtilityBar />
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        {/* Footer placeholder */}
        <footer className="bg-ink text-bone p-16 mt-32">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-bone/10 pt-12">
            <div className="flex flex-col gap-4">
              <span className="font-display text-2xl">Double Design</span>
              <p className="text-xs opacity-60">Made in Lagos since 2015. SON Certified.</p>
            </div>
            <div>
              <h4 className="text-ui mb-4">Finishes</h4>
              <ul className="text-xs space-y-2 opacity-60">
                <li>Texture</li>
                <li>Pearlescent</li>
                <li>Stucco</li>
                <li>Metallic</li>
              </ul>
            </div>
            <div>
              <h4 className="text-ui mb-4">Company</h4>
              <ul className="text-xs space-y-2 opacity-60">
                <li>About</li>
                <li>The Dossier</li>
                <li>Contact</li>
                <li>Trade Program</li>
              </ul>
            </div>
            <div>
              <h4 className="text-ui mb-4">Newsletter</h4>
              <p className="text-xs opacity-60 mb-4">Subscribe for technical dossiers and new finish releases.</p>
              <div className="border-b border-bone/30 py-2 flex justify-between items-center">
                <span className="text-xs opacity-30 italic">Email address</span>
                <button className="text-xs uppercase tracking-widest hover:text-petra transition-colors">Join</button>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-bone/10 flex justify-between items-center text-[10px] opacity-40 uppercase tracking-widest">
            <span>© 2025 Double Design Paints</span>
            <div className="flex gap-8">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
