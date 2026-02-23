'use client';
import Image, { ImageProps } from 'next/image';
import SoldOverlay from './SoldOverlay';

type SoldLike = boolean | 'sold' | 'Sprzedane' | null | undefined;
const isSold = (v: SoldLike) => (typeof v === 'boolean' ? v : !!v && String(v).toLowerCase() === 'sold');

type Props = ImageProps & {
  sold?: SoldLike;
  containerClassName?: string;
  imageClassName?: string;
};

export default function CarImage({
  sold,
  containerClassName = '',
  imageClassName = '',
  ...imgProps
}: Props) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${containerClassName}`.trim()}>
      <Image {...imgProps} className={imageClassName} />
      {isSold(sold) && <SoldOverlay />}
    </div>
  );
}
