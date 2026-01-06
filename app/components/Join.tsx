'use client';

import { useState } from 'react';

export default function Join() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      (e.target as HTMLFormElement).reset();
    }, 2500);
  };

  return (
    <section id="join" className="py-32 px-12 bg-[#111111] relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 255, 0, 0.03) 0%, rgba(255, 255, 0, 0.015) 50%, transparent 60%)'
      }}></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[300px] h-[300px] top-[20%] left-[20%] border rounded-full animate-spin opacity-5" style={{ animationDuration: '20s', borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
        <div className="absolute w-[400px] h-[400px] bottom-[20%] right-[20%] border border-[#FF0033]/3 rounded-full animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
      </div>

      <div className="max-w-[700px] mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-6 mb-12">
          <span className="font-['IBM_Plex_Mono',monospace] text-sm bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">03</span>
          <span className="w-20 h-px bg-gradient-to-r from-green-500 to-yellow-500"></span>
          <span className="text-[0.6rem] tracking-[0.3em] text-[#666666] uppercase">Rejoindre</span>
          <span className="w-20 h-px bg-gradient-to-r from-green-500 to-yellow-500"></span>
        </div>

        <div className="text-6xl mb-6 animate-[bounce_2s_ease-in-out_infinite]">🐕</div>

        <h2 className="font-['Dela_Gothic_One',sans-serif] text-[clamp(3rem,10vw,7rem)] leading-none mb-6">
          REJOINS LA <span className="relative inline-block">
            <span className="relative z-10">MEUTE</span>
            <span className="absolute bottom-[0.1em] left-0 w-full h-[0.15em] bg-gradient-to-r from-green-500 to-yellow-500 -skew-x-[10deg]"></span>
          </span>
        </h2>

        <p className="text-sm text-[#999999] max-w-[450px] mx-auto mb-10 leading-[1.8]">
          Accès anticipé aux drops. Pièces exclusives. Pas de spam, juste l&apos;essentiel.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-[500px] mx-auto mb-6">
          <input
            type="email"
            placeholder="ton@email.com"
            required
            className="flex-1 px-6 py-5 bg-black border-2 border-black text-white font-['IBM_Plex_Mono',monospace] text-sm tracking-[0.05em] outline-none transition-all focus:border-green-500 focus:border-yellow-500"
            style={{ borderImage: 'linear-gradient(to right, transparent, transparent) 1' }}
          />
          <button
            type="submit"
            className={`px-8 py-5 font-['Dela_Gothic_One',sans-serif] text-lg tracking-[0.05em] cursor-pointer transition-all duration-300 ${
              submitted
                ? 'bg-[#FF0033] text-white'
                : 'bg-gradient-to-r from-green-500 to-yellow-500 text-black hover:bg-[#FF0033] hover:text-white hover:-skew-x-[5deg]'
            }`}
          >
            {submitted ? '✓ BIENVENUE' : "J'Y SUIS →"}
          </button>
        </form>

        <p className="text-[0.65rem] text-[#666666] tracking-[0.1em] mb-12">
          +2,847 membres dans la meute — Zéro bullshit garanti
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-16 pt-12 border-t border-white/10">
          <div className="text-center">
            <div className="font-['Dela_Gothic_One',sans-serif] text-[2.5rem] text-white">2.8K+</div>
            <div className="text-[0.55rem] tracking-[0.2em] text-[#666666] uppercase mt-2">EN ATTENTE</div>
          </div>
          <div className="text-center">
            <div className="font-['Dela_Gothic_One',sans-serif] text-[2.5rem] text-white">14</div>
            <div className="text-[0.55rem] tracking-[0.2em] text-[#666666] uppercase mt-2">JOURS</div>
          </div>
          <div className="text-center">
            <div className="font-['Dela_Gothic_One',sans-serif] text-[2.5rem] text-white">08</div>
            <div className="text-[0.55rem] tracking-[0.2em] text-[#666666] uppercase mt-2">PIÈCES</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) rotate(0); }
          25% { transform: translateY(-10px) rotate(-10deg); }
          75% { transform: translateY(-5px) rotate(10deg); }
        }
      `}</style>
    </section>
  );
}

