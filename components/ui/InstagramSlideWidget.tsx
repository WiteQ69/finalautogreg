'use client';

type Props = { pageUrl?: string };

export default function InstagramSlideWidget({ pageUrl }: Props) {
  const href = pageUrl || 'https://www.instagram.com/autopaczynski/';
  return (
    <div className="fixed right-0 top-[calc(50%+64px)] -translate-y-1/2 z-40">
      <a href={href} target="_blank" rel="noopener noreferrer" className="group relative flex items-center"
         aria-label="Instagram AutoPaczyński">
        <span className="absolute right-[56px] rounded-l-xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743]
                         text-white text-sm font-semibold px-3 py-2 shadow-lg opacity-0 translate-x-2
                         group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          Instagram
        </span>
        <div className="h-[48px] w-[48px] rounded-l-xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]
                        shadow-lg flex items-center justify-center text-white transition-transform duration-200
                        hover:-translate-x-1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
          </svg>
        </div>
      </a>
    </div>
  );
}
