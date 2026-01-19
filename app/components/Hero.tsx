'use client';

import Marquee from './Marquee';
import Image from 'next/image';

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
        

        <div className="mb-4 overflow-hidden">
          <div className="inline-block animate-[revealUp_1s_cubic-bezier(0.16,1,0.3,1)_3s_forwards] translate-y-full">
            <Image
              src="/images/PHOTO-2025-12-28-15-29-42 2.jpg"
              alt="La Chienneté"
              width={1200}
              height={400}
              className="w-auto h-auto max-w-[clamp(40rem,90vw,80rem)] object-contain"
              priority
            />
          </div>
        </div>

        <p className="font-['Unbounded',sans-serif] text-[clamp(0.8rem,2vw,1rem)] font-normal text-[#999999] max-w-[500px] mx-auto my-8 leading-[1.8] tracking-[0.02em]">
          Pas de compromis. Pas d&apos;excuses.<br />
          <strong className="text-white font-medium">Du streetwear brut, authentique.</strong>
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0 animate-[fadeUp_1s_ease_3.5s_forwards]">
        <span className="text-[0.55rem] tracking-[0.3em] text-[#666666] uppercase">Scroll</span>
        <div className="w-px h-[60px] bg-gradient-to-b from-green-500 via-yellow-500 to-transparent animate-[scrollLine_2s_ease-in-out_infinite]"></div>
      </div>

      {/* Bottom Marquee */}
      <div className="absolute bottom-0 left-0 w-full bg-transparent py-4 -rotate-1 scale-105 overflow-hidden">
        <Marquee />
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

