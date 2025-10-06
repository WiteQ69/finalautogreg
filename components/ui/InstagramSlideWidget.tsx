'use client';
import React from 'react';

type Props = {
  pageUrl?: string;
};

export default function InstagramSlideWidget({
  pageUrl = 'https://www.instagram.com/autopaczynski/',
}: Props) {
  return (
    <>
      {/* DESKTOP: tylko klikane ucho – bez wysuwania */}
      <a
        href={pageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          hidden md:flex
          fixed right-0 top-[50%] z-[1000]
          h-[100px] w-[60px]
          items-center justify-center
          rounded-l-md
          bg-gradient-to-br from-[#808080] via-[#808080] via-[#808080] to-[#808080]
          text-white cursor-pointer select-none shadow-lg
        "
        style={{ transform: 'translateY(-50%)' }}
        aria-label='Instagram'
      >
        <div className='flex items-center justify-center -rotate-90'>
          <span className='font-semibold tracking-wide'>Instagram</span>
        </div>
      </a>

      {/* MOBILE: pływająca ikonka (zostaje) */}
      <a
        href={pageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          md:hidden fixed right-3 top-[10rem] z-[1000]
          rounded-full p-3 shadow-xl
          text-white bg-gradient-to-br from-[#f58529] via-[#dd2a7b] via-[#8134af] to-[#515bd4]
        "
        aria-label='Otwórz Instagram'
      >
        {/* Instagram – Font Awesome 7 (mono) */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 448 512'
          className='h-6 w-6'
          fill='currentColor'
          aria-hidden='true'
        >
          <path d='M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'/>
        </svg>
      </a>
    </>
  );
}
