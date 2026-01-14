'use client';

export default function YouTubeBackground() {
  const videoId = '1HwKXR-BLjA';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`;

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none">
      {/* Overlay beaucoup moins opaque sur mobile pour que la vidéo soit très visible */}
      <div className="absolute inset-0 bg-black/40 md:bg-black/40 bg-black/10 z-10"></div>
      <iframe
        className="absolute top-[-15%] md:top-0 left-0 w-full h-full scale-[1.8] md:scale-100"
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
