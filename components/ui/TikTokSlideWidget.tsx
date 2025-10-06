'use client';

import SocialSlidePanel from './SocialSlidePanel';

type Props = {
  pageUrl?: string;
  width?: number;
  height?: number;
  offsetPx?: number;
};

export default function TikTokSlideWidget({
  pageUrl = 'https://www.tiktok.com/@autopaczynski',
  width = 380,
  height = 520,
  offsetPx = 240,
}: Props) {
  return (
    <>
      {/* DESKTOP: wysuwany panel */}
      <SocialSlidePanel
        label="TikTok"
        tabText="TikTok"
        colorClass="bg-black"
        width={width}
        height={height}
        offsetPx={offsetPx}
      >
        <div className="h-full w-full p-5 flex flex-col bg-white">
          <h3 className="text-xl font-semibold">TikTok @autopaczynski</h3>

          {/* środkowe logo */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src="/logo10.jpg"
              alt="AUTO GREG – TikTok"
              className="max-w-[240px] w-full h-auto rounded-xl shadow"
            />
          </div>

          <p className="text-zinc-600 mt-1">
            Krótkie wideo z naszej oferty i dostaw. Kliknij poniżej, aby otworzyć profil.
          </p>

          <div className="mt-4 flex justify-center">
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-3 rounded-xl font-semibold text-white bg-black shadow"
            >
              Otwórz TikTok
            </a>
          </div>
        </div>
      </SocialSlidePanel>
{/* Mobile – pływający przycisk TT */}
<a
  href={pageUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="md:hidden fixed right-3 bottom-28 z-[1000]
             rounded-full p-3 shadow-xl bg-black text-white"
  aria-label="Otwórz TikTok"
>
  {/* TikTok – Font Awesome 7 (mono) */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="h-6 w-6"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M448.5 209.9c-44 .1-87-13.6-122.8-39.2l0 178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6-64.8 13.5-96.9 5.3-60.9-25.9-82.7-50.8-35.3-56-39-88.9 2.9-66.1 18.6-95.2 40-52.7 69.6-67.7 62.9-20.5 95.7-16l0 89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3-14 28.1-13.9 43.9 5.2 31 14.5 43.7 22.4 22.1 37.4 26.9 31.1 4.8 46-.1 28-14.4 37.2-27.1 14.2-28.1 14.2-43.8l0-349.4 88 0c-.1 7.4 .6 14.9 1.9 22.2 3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1l0 87.4z"/>
  </svg>
</a>

    </>
  );
}
