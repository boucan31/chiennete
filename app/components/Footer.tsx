'use client';

import Marquee from './Marquee';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-r from-green-500 to-yellow-500 text-black py-20 px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 border-t-[3px] border-r-[3px] border-black/10"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-[3px] border-l-[3px] border-black/10"></div>

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div>
            <a href="/" className="font-['Dela_Gothic_One',sans-serif] text-[clamp(2rem,5vw,4rem)] text-black no-underline block mb-6">
              LA CHIENNETÉ
            </a>
            <p className="text-sm text-black/50 max-w-[350px] leading-[1.8] mb-6">
              Streetwear brutal, authentique, made in France. Pas de compromis. Pas d&apos;excuses.
            </p>
            <div className="flex items-center gap-6 text-[0.6rem] tracking-[0.15em] text-black/30">
              <span>PARIS, FR</span>
              <span className="w-[30px] h-px bg-black/20"></span>
              <span>EST. 2025</span>
            </div>
          </div>

          <div className="text-right md:text-left">
            <div className="text-[0.55rem] tracking-[0.3em] text-black/30 uppercase mb-6">SUIVRE LA MEUTE</div>
            <div className="space-y-4">
              <a href="#" className="flex items-center justify-end md:justify-start gap-8 text-black no-underline mb-4 transition-opacity hover:opacity-50">
                <span className="text-[0.6rem] tracking-[0.1em] text-black/40">@LACHIENNETE</span>
                <span className="font-['Dela_Gothic_One',sans-serif] text-2xl">INSTAGRAM</span>
              </a>
              <a href="#" className="flex items-center justify-end md:justify-start gap-8 text-black no-underline mb-4 transition-opacity hover:opacity-50">
                <span className="text-[0.6rem] tracking-[0.1em] text-black/40">@LACHIENNETE</span>
                <span className="font-['Dela_Gothic_One',sans-serif] text-2xl">TIKTOK</span>
              </a>
              <a href="#" className="flex items-center justify-end md:justify-start gap-8 text-black no-underline mb-4 transition-opacity hover:opacity-50">
                <span className="text-[0.6rem] tracking-[0.1em] text-black/40">@LACHIENNETE_</span>
                <span className="font-['Dela_Gothic_One',sans-serif] text-2xl">TWITTER</span>
              </a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden mb-16">
          <Marquee speed={25}>
            <span className="font-['Dela_Gothic_One',sans-serif] text-[clamp(4rem,12vw,10rem)] text-black/6 whitespace-nowrap px-8">
              DROP 001 — NO RULES — NO LIMITS —
            </span>
          </Marquee>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-black/10">
          <div className="flex flex-wrap gap-8 justify-center">
            <a href="#" className="text-[0.55rem] tracking-[0.15em] text-black/40 no-underline uppercase transition-colors hover:text-black">
              CGV
            </a>
            <a href="#" className="text-[0.55rem] tracking-[0.15em] text-black/40 no-underline uppercase transition-colors hover:text-black">
              MENTIONS LÉGALES
            </a>
            <a href="#" className="text-[0.55rem] tracking-[0.15em] text-black/40 no-underline uppercase transition-colors hover:text-black">
              CONTACT
            </a>
            <a href="#" className="text-[0.55rem] tracking-[0.15em] text-black/40 no-underline uppercase transition-colors hover:text-black">
              PRESSE
            </a>
          </div>
          <p className="text-[0.55rem] tracking-[0.1em] text-black/40">
            © 2025 LA CHIENNETÉ — TOUS DROITS RÉSERVÉS
          </p>
        </div>
      </div>
    </footer>
  );
}

