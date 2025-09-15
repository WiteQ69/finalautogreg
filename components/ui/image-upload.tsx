'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onImagesChange, maxImages = 6 }: ImageUploadProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, maxImages - images.length);
      const newImages = [...images, ...newFiles];
      onImagesChange(newImages);

      // Create previews
      const newPreviews = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [images, onImagesChange, maxImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: maxImages - images.length,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // Clean up preview URL
    if (previews[index]) {
      URL.revokeObjectURL(previews[index].url);
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Images Grid */}
      <AnimatePresence>
        {(images.length > 0 || previews.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {images.map((file, index) => {
              const preview = previews.find((p) => p.file === file);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-[4/3] bg-zinc-100 rounded-xl overflow-hidden"
                >
                  {preview ? (
                    <Image
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-zinc-400" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-zinc-900 text-white text-xs px-2 py-1 rounded">
                      Główne
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      {images.length < maxImages && (
        <div {...getRootProps()}>
          <motion.div
          whileHover={{ scale: 1.01 }}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive 
              ? 'border-zinc-900 bg-zinc-50' 
              : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-zinc-400 mx-auto mb-4" />
          <p className="text-sm font-medium text-zinc-900 mb-1">
            {isDragActive ? 'Upuść pliki tutaj...' : 'Przeciągnij zdjęcia lub kliknij aby wybrać'}
          </p>
          <p className="text-xs text-zinc-500">
            JPG, PNG lub WebP. Maksymalnie {maxImages} zdjęć. ({images.length}/{maxImages})
          </p>
        </motion.div>
        </div>
      )}
    </div>
  );
}