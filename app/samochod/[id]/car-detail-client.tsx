'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CarDetailClientProps {
  images: string[];
  carTitle: string;
}

export default function CarDetailClient({ images, carTitle }: CarDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main Image */}
        <div 
          className="relative aspect-[4/3] mb-4 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setShowLightbox(true)}
        >
          <Image
            src={images[selectedImageIndex]}
            alt={carTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <span className="text-sm font-medium text-zinc-900">Powiększ</span>
            </div>
          </div>
          
          {/* Navigation arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                index === selectedImageIndex 
                  ? 'border-zinc-900' 
                  : 'border-transparent hover:border-zinc-300'
              }`}
            >
              <Image
                src={image}
                alt={`${carTitle} - zdjęcie ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          <div className="relative max-w-4xl max-h-[80vh] w-full h-full">
            <Image
              src={images[selectedImageIndex]}
              alt={carTitle}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}