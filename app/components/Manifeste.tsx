'use client';

export default function Manifeste() {
  return (
    <section id="manifeste" className="py-32 px-12 relative overflow-hidden bg-[#111111] z-10">
      <div className="max-w-[800px] mx-auto">
        <h2 className="font-['Unbounded',sans-serif] text-[clamp(1.8rem,4vw,3.5rem)] font-bold leading-[1.15] mb-8">
          On fait pas du streetwear pour <span className="bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent italic">plaire</span>.<br />
          On le fait pour <span className="text-[#FF0033]">exister</span>.
        </h2>
        <p className="text-sm text-[#999999] leading-[2] mb-6 max-w-[500px]">
          La Chienneté c&apos;est l&apos;attitude de ceux qui n&apos;ont rien à prouver mais tout à montrer. Du textile premium, des coupes qui parlent, une identité qui dérange.
        </p>
        <p className="text-sm text-[#999999] leading-[2] mb-6 max-w-[500px]">
          Chaque pièce est pensée à Saint-Jacques, limitée en quantité. <strong className="text-white font-semibold">Pas de restock. Pas de seconde chance. Tu l&apos;as ou tu l&apos;as pas.</strong>
        </p>
      </div>
    </section>
  );
}

