import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const PUBLISHER_ID = 'ca-pub-7585012232388119';

/**
 * Google AdSense 광고 컴포넌트
 *
 * @param slot - AdSense에서 생성한 광고 슬롯 ID
 * @param format - 광고 형식 (기본: auto)
 * @param responsive - 반응형 여부 (기본: true)
 */
export function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  style,
  className = ''
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;

    try {
      if (adRef.current && window.adsbygoogle) {
        window.adsbygoogle.push({});
        isLoaded.current = true;
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

/**
 * 페이지 상단 배너 광고 (728x90 또는 반응형)
 */
export function AdBannerTop({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <AdSense
      slot={slot}
      format="horizontal"
      className={`my-4 ${className}`}
    />
  );
}

/**
 * 페이지 하단 배너 광고
 */
export function AdBannerBottom({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <AdSense
      slot={slot}
      format="horizontal"
      className={`my-4 ${className}`}
    />
  );
}

/**
 * 콘텐츠 중간 광고 (인피드 스타일)
 */
export function AdInFeed({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <AdSense
      slot={slot}
      format="fluid"
      className={`my-6 ${className}`}
    />
  );
}

/**
 * 사이드바 또는 결과 페이지용 사각형 광고 (300x250)
 */
export function AdRectangle({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <AdSense
      slot={slot}
      format="rectangle"
      className={`my-4 flex justify-center ${className}`}
    />
  );
}

/**
 * 개발 환경용 광고 플레이스홀더
 */
export function AdPlaceholder({
  type = 'banner',
  className = ''
}: {
  type?: 'banner' | 'rectangle' | 'infeed';
  className?: string;
}) {
  const sizes = {
    banner: { width: '100%', height: '90px', maxWidth: '728px' },
    rectangle: { width: '300px', height: '250px' },
    infeed: { width: '100%', height: '120px' },
  };

  return (
    <div
      className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm ${className}`}
      style={sizes[type]}
    >
      광고 영역 ({type})
    </div>
  );
}
