'use client';

export default function YouTubeBackground() {
  const videoId = '1HwKXR-BLjA';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <iframe
        className="absolute inset-0 w-full h-full"
        src={embedUrl}
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
