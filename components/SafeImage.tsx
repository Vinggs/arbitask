"use client";

import { useState, useEffect } from "react";

export default function SafeImage({
  src,
  fallbackSrc,
  alt,
  className,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  // Jika URL gambar dari database berubah, perbarui state
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
