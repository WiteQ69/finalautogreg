'use client';

import SocialSlidePanel from './SocialSlidePanel';

type Props = {
  pageUrl?: string;
  width?: number;
  height?: number;
  offsetPx?: number;
};

export default function InstagramSlideWidget({
  pageUrl = 'https://www.instagram.com/autopaczynski/',
  width = 380,
  height = 520,
  offsetPx = 120,
}: Props) {
  return (
    <>
      {/* DESKTOP: wysuwany panel */}
      <SocialSlidePanel
        label="Instagram"
        tabText="Instagram"
        colorClass="bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]"
        width={width}
        height={height}
        offsetPx={offsetPx}
      >
        <div className="h-full w-full p-5 flex flex-col bg-white">
          <h3 className="text-xl font-semibold">Instagram @autopaczynski</h3>

          {/* środkowe logo */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src="/logo10.jpg"
              alt="AUTO GREG – Instagram"
              className="max-w-[240px] w-full h-auto rounded-xl shadow"
            />
          </div>

          <p className="text-zinc-600 mt-1">
            Zobacz nasze najnowsze zdjęcia i aktualności. Kliknij poniżej, aby otworzyć profil.
          </p>

          <div className="mt-4 flex justify-center">
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-3 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] shadow"
            >
              Otwórz Instagram
            </a>
          </div>
        </div>
      </SocialSlidePanel>

      {/* Mobile – pływający przycisk IG */}
<a
  href={pageUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="md:hidden fixed right-3 bottom-16 z-[1000]
             rounded-full p-3 shadow-xl
             text-white bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]"
  aria-label="Otwórz Instagram"
>
  {/* Instagram – Font Awesome 7 (mono) */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="h-6 w-6"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
  </svg>
</a>

    </>
  );
}
