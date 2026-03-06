'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

const CrushomeLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("text-2xl font-black flex items-center gap-3", className)}>
      <div className="relative w-10 h-10 shrink-0">
        <Image 
          src="/images/logo-crushia.png" 
          alt="CRUSHOME Logo" 
          fill 
          className="object-contain"
          priority
          onError={(e: any) => {
            // Fallback robusto a placeholder si la imagen física no existe en /public/images/
            e.currentTarget.src = 'https://picsum.photos/seed/crushome/100';
          }}
        />
      </div>
      <span className="text-foreground tracking-tighter">CRUSHOME</span>
    </div>
  );
};

export default CrushomeLogo;
