'use client';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export default function Marquee({ children, direction = 'left', speed = 20, className = '' }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex"
        style={{
          animation: `marquee ${speed}s linear infinite ${direction === 'right' ? 'reverse' : ''}`,
        }}
      >
        <div className="flex items-center gap-12 px-8 whitespace-nowrap">
          {children}
        </div>
        <div className="flex items-center gap-12 px-8 whitespace-nowrap">
          {children}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

