import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

        <footer className="bg-ink text-bone p-20 mt-40">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14 border-t border-bone/10 pt-14">
            <div className="flex flex-col gap-5">
              <Image
                src="/logo.webp"
                alt="Dubble Paint Logo"
                width={200}
                height={66}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
              {/* opacity-80 passes 4.5:1 on bg-ink (#2F363F) for text-xs */}
              <p className="text-xs opacity-80">Made in Lagos since 2015. SON Certified.</p>
            </div>

            {/* h3 instead of h4 — fixes heading order (Lighthouse accessibility) */}
            <div>
              <h3 className="text-ui mb-5" style={{ color: 'white' }}>Finishes</h3>
              <ul className="text-xs space-y-3 opacity-75">
                <li><Link href="/finishes" className="hover:opacity-100 transition-opacity">All Finishes</Link></li>
                <li><Link href="/finishes?category=Texture" className="hover:opacity-100 transition-opacity">Texture</Link></li>
                <li><Link href="/finishes?category=Pearlescent" className="hover:opacity-100 transition-opacity">Pearlescent</Link></li>
                <li><Link href="/lookbook" className="hover:opacity-100 transition-opacity">Lookbook</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-ui mb-5" style={{ color: 'white' }}>Company</h3>
              <ul className="text-xs space-y-3 opacity-75">
                <li><Link href="/architectural" className="hover:opacity-100 transition-opacity">Coatings</Link></li>
                <li><Link href="/showrooms" className="hover:opacity-100 transition-opacity">Showrooms</Link></li>
                <li><Link href="/trade" className="hover:opacity-100 transition-opacity">Trade Programme</Link></li>
                <li><Link href="/discover" className="hover:opacity-100 transition-opacity">Discover</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-ui mb-5" style={{ color: 'white' }}>Newsletter</h3>
              <p className="text-xs opacity-75 mb-5">Subscribe for technical dossiers and new finish releases.</p>
              <div className="border-b border-bone/30 py-2 flex justify-between items-center">
                {/* opacity-60 on bone text against ink bg passes 4.5:1 at text-xs */}
                <span className="text-xs opacity-60 italic">Email address</span>
                <button className="text-xs uppercase tracking-widest hover:text-petra transition-colors">Join</button>
              </div>
            </div>
          </div>

          {/* Bottom bar — opacity-60 on bone text at 10px passes ~3.5:1; bump to text-xs + opacity-70 for compliance */}
          <div className="mt-20 pt-8 border-t border-bone/10 flex justify-between items-center text-xs opacity-70 uppercase tracking-widest">
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
