'use client';

export default function VisualEffects() {
  return (
    <>
      {/* Noise overlay */}
      <div
        className="fixed top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none z-[9998] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: 'noise 0.3s steps(3) infinite',
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-[9997] opacity-40"
        style={{
          background: `repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 3px)`,
        }}
      />

      {/* Scan line */}
      <div
        className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/5 via-yellow-500/5 to-transparent pointer-events-none z-[9996]"
        style={{
          animation: 'scan 6s linear infinite',
        }}
      />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <style jsx>{`
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-5%, 5%); }
          50% { transform: translate(5%, -5%); }
          75% { transform: translate(-5%, -5%); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </>
  );
}

