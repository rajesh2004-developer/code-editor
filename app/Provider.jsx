'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/Sidebar';
import Navbar from './_components/Navbar';

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider {...props}>
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </NextThemesProvider>
  );
}
