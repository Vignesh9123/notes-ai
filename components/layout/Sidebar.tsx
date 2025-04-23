'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, FolderOpen, Home, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotes } from '@/lib/hooks/useNotes';

export function Sidebar() {
  const pathname = usePathname();
  const { data: notes } = useNotes();

  const routes = useMemo(() => [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      icon: FileText,
      label: 'All Notes',
      href: '/notes',
      active: pathname === '/notes',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      active: pathname === '/settings',
    },
  ], [pathname]);

  const recentNotes = useMemo(() => {
    if (!notes) return [];
    return notes
      .slice()
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5);
  }, [notes]);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-5 w-5" />
          <span>NotesAI</span>
        </Link>
      </div>
      <div className="px-4 py-2">
        <Link href="/notes/new">
          <Button className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                route.active ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <route.icon className="mr-2 h-4 w-4" />
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
        {recentNotes.length > 0 && (
          <div className="py-2">
            <h2 className="relative px-7 text-xs font-semibold text-muted-foreground">
              Recent Notes
            </h2>
            <div className="mt-2 space-y-1">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    pathname === `/notes/${note.id}` ? 'bg-accent text-accent-foreground' : 'transparent'
                  )}
                >
                  <FolderOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{note.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}