'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNotes } from '@/lib/hooks/useNotes';
import { useAuth } from '@/lib/provider/AuthProvider';
import { formatDistanceToNow } from 'date-fns';
import { CalendarDays, FileText, Plus, Trash } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: notes, isLoading: notesLoading, deleteNote } = useNotes();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (mounted && !authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router, mounted]);

  const isLoading = authLoading || notesLoading || !mounted;

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto flex-1 items-start py-8 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r border-border md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-4">
                <div className="px-4 py-2">
                  <h2 className="mb-2 text-lg font-semibold tracking-tight">
                    Dashboard
                  </h2>
                  <div className="space-y-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start gap-2"
                      asChild
                    >
                      <Link href="/dashboard">
                        <FileText className="h-4 w-4" />
                        All Notes
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2"
                      asChild
                    >
                      <Link href="/notes/new">
                        <Plus className="h-4 w-4" />
                        New Note
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <main className="w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Your Notes</h1>
            <Link href="/notes/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </Link>
          </div>
          <div className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <Skeleton className="h-5 w-3/4" />
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Skeleton className="h-14 w-full" />
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Skeleton className="h-5 w-2/5" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : notes && notes.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <Link key={note.id} href={`/notes/${note.id}`}>
                    <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md">
                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardDescription className="line-clamp-3">
                          {note.content}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-4 pt-0">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                          onClick={(e: React.MouseEvent) => handleDelete(note.id, e)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>No notes found</AlertTitle>
                <AlertDescription>
                  You haven&apos;t created any notes yet. Click the &quot;New Note&quot; button to get started.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}