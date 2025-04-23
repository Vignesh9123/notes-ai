'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/lib/provider/AuthProvider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from '@/components/layout/UserNav';
import { Sidebar } from '@/components/layout/Sidebar';

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  if (pathname.startsWith('/auth/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] pr-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">NotesAI</span>
          </Link>
        </div>
        
        <div className="hidden md:flex md:items-center md:gap-2">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">NotesAI</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user && (
            <Link href="/notes/new">
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline-flex">New Note</span>
              </Button>
            </Link>
          )}
          <ModeToggle />
          {user ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}