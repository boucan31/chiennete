'use client';

import Marquee from './Marquee';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(0, 255, 0, 0.06) 0%, rgba(255, 255, 0, 0.03) 50%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(255, 0, 51, 0.04) 0%, transparent 40%)
        `
      }}></div>

      {/* Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[150px] h-[150px] top-[15%] left-[10%] border opacity-15 animate-spin" style={{ animationDuration: '25s', borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
        <div className="absolute w-[200px] h-[200px] bottom-[20%] right-[10%] border border-[#FF0033] opacity-15 animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }}></div>
        <div className="absolute w-2 h-2 top-[30%] right-[25%] animate-pulse bg-gradient-to-r from-green-500 to-yellow-500"></div>
        <div className="absolute w-2 h-2 bg-[#FF0033] bottom-[35%] left-[20%] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Side labels */}
      <span className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 rotate-180 text-[0.55rem] tracking-[0.3em] text-[#666666] uppercase" style={{ writingMode: 'vertical-rl' }}>
        PARIS — 2025
      </span>
      <span className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 text-[0.55rem] tracking-[0.3em] text-[#666666] uppercase" style={{ writingMode: 'vertical-rl' }}>
        STREETWEAR BRUTAL
      </span>

      {/* Content */}
      <div className="text-center z-10 px-4 opacity-0 animate-[fadeUp_1s_ease_2.8s_forwards]">
        <div className="inline-flex items-center gap-4 px-6 py-3 border mb-10 relative" style={{ borderImage: 'linear-gradient(to right, rgba(0, 255, 0, 0.4), rgba(255, 255, 0, 0.4)) 1', background: 'linear-gradient(to right, rgba(0, 255, 0, 0.05), rgba(255, 255, 0, 0.05))' }}>
          <div className="w-2 h-2 animate-pulse bg-gradient-to-r from-green-500 to-yellow-500"></div>
          <span className="text-[0.6rem] tracking-[0.35em] uppercase bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">Drop 001 — Disponible bientôt</span>
        </div>

        <h1 className="font-['Dela_Gothic_One',sans-serif] text-[clamp(4rem,18vw,16rem)] leading-[0.85] tracking-[-0.02em] mb-4">
          <span className="block overflow-hidden">
            <span className="inline-block animate-[revealUp_1s_cubic-bezier(0.16,1,0.3,1)_3s_forwards] translate-y-full">LA</span>
          </span>
          <span className="block overflow-hidden">
            <span className="inline-block animate-[revealUp_1s_cubic-bezier(0.16,1,0.3,1)_3.15s_forwards] translate-y-full">
              <span className="bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">CHIEN</span>
              <span className="text-transparent" style={{ WebkitTextStroke: '3px white' }}>NETÉ</span>
            </span>
          </span>
        </h1>

        <p className="font-['Unbounded',sans-serif] text-[clamp(0.8rem,2vw,1rem)] font-normal text-[#999999] max-w-[500px] mx-auto my-8 leading-[1.8] tracking-[0.02em]">
          Pas de compromis. Pas d&apos;excuses.<br />
          <strong className="text-white font-medium">Du streetwear brut, authentique.</strong>
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <a
            href="#join"
            className="inline-flex items-center gap-3 px-10 py-5 font-['Unbounded',sans-serif] font-bold text-[0.7rem] tracking-[0.15em] uppercase no-underline bg-gradient-to-r from-green-500 to-yellow-500 text-black transition-all duration-400 relative overflow-hidden group"
          >
            <span className="relative z-10">Rejoindre la meute</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            <div className="absolute top-0 left-[-100%] w-full h-full bg-[#FF0033] transition-all duration-400 group-hover:left-0 z-0"></div>
          </a>
          <a
            href="#collection"
            className="inline-flex items-center gap-3 px-10 py-5 font-['Unbounded',sans-serif] font-bold text-[0.7rem] tracking-[0.15em] uppercase no-underline bg-transparent text-white border-2 border-white transition-all duration-400 hover:bg-white hover:text-black hover:skew-x-[-5deg]"
          >
            <span>Voir le drop</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0 animate-[fadeUp_1s_ease_3.5s_forwards]">
        <span className="text-[0.55rem] tracking-[0.3em] text-[#666666] uppercase">Scroll</span>
        <div className="w-px h-[60px] bg-gradient-to-b from-green-500 via-yellow-500 to-transparent animate-[scrollLine_2s_ease-in-out_infinite]"></div>
      </div>

      {/* Bottom Marquee */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-green-500 to-yellow-500 py-4 -rotate-1 scale-105 overflow-hidden">
        <Marquee speed={20}>
          <span className="font-['Dela_Gothic_One',sans-serif] text-base text-black tracking-[0.15em]">DROP 001</span>
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          <span className="font-['Dela_Gothic_One',sans-serif] text-base text-black tracking-[0.15em]">COMING SOON</span>
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          <span className="font-['Dela_Gothic_One',sans-serif] text-base text-black tracking-[0.15em]">LA CHIENNETÉ</span>
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          <span className="font-['Dela_Gothic_One',sans-serif] text-base text-black tracking-[0.15em]">PARIS</span>
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          <span className="font-['Dela_Gothic_One',sans-serif] text-base text-black tracking-[0.15em]">NO RULES</span>
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          <span className="font-['Dela_Gothic_One',sans-serif] text-base text-black tracking-[0.15em]">NO LIMITS</span>
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
        </Marquee>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes revealUp {
          to { transform: translateY(0); }
        }
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.5); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

