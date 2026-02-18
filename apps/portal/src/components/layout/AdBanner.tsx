interface AdBannerProps {
  type: 'leaderboard' | 'rectangle' | 'mobile-banner';
  className?: string;
}

const adSizes = {
  leaderboard: {
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 100 },
  },
  rectangle: {
    desktop: { width: 300, height: 250 },
    mobile: { width: 300, height: 250 },
  },
  'mobile-banner': {
    desktop: { width: 320, height: 100 },
    mobile: { width: 320, height: 100 },
  },
};

export function AdBanner({ type, className = '' }: AdBannerProps) {
  const sizes = adSizes[type];

  return (
    <div className={`flex justify-center ${className}`}>
      {/* Desktop Ad */}
      <div
        className="hidden md:flex ad-placeholder"
        style={{
          width: sizes.desktop.width,
          height: sizes.desktop.height,
        }}
      >
        <span>AD {sizes.desktop.width}x{sizes.desktop.height}</span>
      </div>

      {/* Mobile Ad */}
      <div
        className="flex md:hidden ad-placeholder"
        style={{
          width: sizes.mobile.width,
          height: sizes.mobile.height,
        }}
      >
        <span>AD {sizes.mobile.width}x{sizes.mobile.height}</span>
      </div>
    </div>
  );
}

// Google AdSense integration component (for future use)
export function GoogleAd({ slot, format = 'auto' }: { slot: string; format?: string }) {
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense ID
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
