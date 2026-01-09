'use client';

export default function Manifeste() {
  return (
    <section id="manifeste" className="py-32 px-12 relative overflow-hidden bg-[#111111]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-['Dela_Gothic_One',sans-serif] text-[clamp(15rem,35vw,35rem)] text-white/5 pointer-events-none whitespace-nowrap">
        MANIFESTE
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex items-center gap-6 mb-16">
          <span className="font-['IBM_Plex_Mono',monospace] text-sm bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">01</span>
          <span className="w-20 h-px bg-gradient-to-r from-green-500 to-yellow-500"></span>
          <span className="text-[0.6rem] tracking-[0.3em] text-[#666666] uppercase">Le Manifeste</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square max-w-[400px] mx-auto lg:mx-0 bg-transparent">
            <div className="absolute inset-8 border opacity-20" style={{ borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
            <div className="absolute inset-4 border border-white/5"></div>
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 bg-gradient-to-r from-green-500 to-yellow-500" style={{ borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 bg-gradient-to-r from-green-500 to-yellow-500" style={{ borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 bg-gradient-to-r from-green-500 to-yellow-500" style={{ borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 bg-gradient-to-r from-green-500 to-yellow-500" style={{ borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
            </div>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-['Dela_Gothic_One',sans-serif] text-[clamp(8rem,20vw,14rem)] opacity-8 animate-[float_6s_ease-in-out_infinite] bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
              LC
            </span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] border border-[#FF0033]/30 animate-spin" style={{ animationDuration: '15s' }}></div>
            <span className="absolute top-8 left-8 text-[0.5rem] tracking-[0.15em] text-[#666666]">001</span>
            <span className="absolute top-8 right-8 text-[0.5rem] tracking-[0.15em] text-[#666666]">PARIS</span>
            <span className="absolute bottom-8 left-8 text-[0.5rem] tracking-[0.15em] text-[#666666]">2025</span>
            <span className="absolute bottom-8 right-8 text-[0.5rem] tracking-[0.15em] text-[#666666]">FR</span>
          </div>

          <div>
            <h2 className="font-['Unbounded',sans-serif] text-[clamp(1.8rem,4vw,3.5rem)] font-bold leading-[1.15] mb-8">
              On fait pas du streetwear pour <span className="bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent italic">plaire</span>.<br />
              On le fait pour <span className="text-[#FF0033]">exister</span>.
            </h2>
            <p className="text-sm text-[#999999] leading-[2] mb-6 max-w-[500px]">
              La Chienneté c&apos;est l&apos;attitude de ceux qui n&apos;ont rien à prouver mais tout à montrer. Du textile premium, des coupes qui parlent, une identité qui dérange.
            </p>
            <p className="text-sm text-[#999999] leading-[2] mb-6 max-w-[500px]">
              Chaque pièce est pensée à Paris, produite en France, limitée en quantité. <strong className="text-white font-semibold">Pas de restock. Pas de seconde chance. Tu l&apos;as ou tu l&apos;as pas.</strong>
            </p>

            {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12 pt-12 border-t border-white/10">
              <div>
                <div className="font-['Dela_Gothic_One',sans-serif] text-[clamp(2rem,4vw,3.5rem)] leading-none bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">08</div>
                <div className="text-[0.55rem] tracking-[0.15em] text-[#666666] uppercase mt-2">Pièces uniques</div>
              </div>
              <div>
                <div className="font-['Dela_Gothic_One',sans-serif] text-[clamp(2rem,4vw,3.5rem)] leading-none bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">100%</div>
                <div className="text-[0.55rem] tracking-[0.15em] text-[#666666] uppercase mt-2">Made in France</div>
              </div>
              <div>
                <div className="font-['Dela_Gothic_One',sans-serif] text-[clamp(2rem,4vw,3.5rem)] leading-none bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">00</div>
                <div className="text-[0.55rem] tracking-[0.15em] text-[#666666] uppercase mt-2">Restock prévu</div>
              </div>
              <div>
                <div className="font-['Dela_Gothic_One',sans-serif] text-[clamp(2rem,4vw,3.5rem)] leading-none bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">∞</div>
                <div className="text-[0.55rem] tracking-[0.15em] text-[#666666] uppercase mt-2">Attitude</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) rotate(-5deg); }
          50% { transform: translate(-50%, -50%) rotate(5deg); }
        }
      `}</style>
    </section>
  );
}

