"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  fallbackSrc?: string;
}

// Curated fallback images for different types of destinations
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80", // Mountain landscape
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80", // Beach/coast
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&q=80", // City skyline
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop&q=80", // Temple/historic
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop&q=80", // Lake/nature
  "https://images.unsplash.com/photo-1502780402662-acc01917949e?w=800&h=600&fit=crop&q=80", // Desert/exotic
];

export function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  fallbackSrc,
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [hasTriedFallbacks, setHasTriedFallbacks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src);
    setFallbackIndex(0);
    setHasTriedFallbacks(false);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);

    if (!hasTriedFallbacks) {
      // First, try the custom fallback if provided
      if (fallbackSrc && imageSrc !== fallbackSrc) {
        setImageSrc(fallbackSrc);
        setIsLoading(true);
        return;
      }

      // Then try our curated fallback images
      if (fallbackIndex < FALLBACK_IMAGES.length) {
        const nextFallback = FALLBACK_IMAGES[fallbackIndex];
        if (imageSrc !== nextFallback) {
          setImageSrc(nextFallback);
          setFallbackIndex((prev) => prev + 1);
          setIsLoading(true);
          return;
        }
      }

      // Finally, use the local fallback
      setHasTriedFallbacks(true);
      setImageSrc("/landing/landing-01.jpg");
      setIsLoading(true);
    } else {
      // All fallbacks failed
      setHasError(true);
    }
  };

  const commonProps = {
    src: imageSrc,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    placeholder: "blur" as const,
    blurDataURL:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="text-sm">Image unavailable</div>
            </div>
          </div>
        )}

        <Image
          {...commonProps}
          fill
          alt={alt}
          className={`${className} ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
        />
      </div>
    );
  }

  return (
    <div
      className="relative"
      style={{ width: width || 800, height: height || 600 }}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-sm">Image unavailable</div>
          </div>
        </div>
      )}

      <Image
        {...commonProps}
        width={width || 800}
        height={height || 600}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
      />
    </div>
  );
}
