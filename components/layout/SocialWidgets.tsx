'use client';

import dynamic from 'next/dynamic';

// dynamiczny import, żeby SDK/iframe ładowały się tylko w przeglądarce
const FacebookSlideWidget = dynamic(
  () => import('@/components/ui/FacebookSlideWidget'),
  { ssr: false }
);

const InstagramSlideWidget = dynamic(
  () => import('@/components/ui/InstagramSlideWidget'),
  { ssr: false }
);

const TikTokSlideWidget = dynamic(
  () => import('@/components/ui/TikTokSlideWidget'),
  { ssr: false }
);

export default function SocialWidgets() {
  return (
    <>
      <FacebookSlideWidget pageUrl="https://www.facebook.com/autopaczynski" />
      <InstagramSlideWidget pageUrl="https://www.instagram.com/autopaczynski/" />
      <TikTokSlideWidget pageUrl="https://www.tiktok.com/@autopaczynski" />
    </>
  );
}
