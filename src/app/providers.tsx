"use client";

import React from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { CoreInitializer } from '@/core/core-initializer';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';

/**
 * @fileOverview Client-side Providers wrapper.
 * Establece el límite estricto entre Server Components y Client Components.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <CoreInitializer>
        <Header>
          {children}
        </Header>
        <Toaster />
      </CoreInitializer>
    </FirebaseProvider>
  );
}
