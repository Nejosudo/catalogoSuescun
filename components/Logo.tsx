'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = "", width = 180, height = 50 }: LogoProps) {
  return (
    <Link href="/" className={`block ${className}`}>
      <Image
        src="/Logo.png"
        alt="Sublimados Suescun"
        width={width}
        height={height}
        className="object-contain h-auto"
        priority
      />
    </Link>
  );
}
