'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useNotes } from '@/lib/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { FileText, Pencil, Plus, Search, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotesPage() {
  const { data: notes, isLoading, deleteNote } = useNotes();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        toast({
          title: 'Note deleted',
          description: 'Your note has been deleted successfully',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete note. Please try again.',
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container py-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">All Notes</h1>
          <Link href="/notes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-[250px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[100px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ) : filteredNotes && filteredNotes.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>
                      <Link href={`/notes/${note.id}`} className="font-medium hover:text-primary hover:underline">
                        {note.title}
                      </Link>
                    </TableCell>
                    <TableCell>{format(new Date(note.updated_at), 'PPP p')}</TableCell>
                    <TableCell>{format(new Date(note.created_at), 'PPP')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/notes/${note.id}?tab=edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={(e) => handleDelete(note.id, e)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-md border border-border bg-card p-8 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No notes found</h2>
            <p className="text-muted-foreground">
              {searchTerm
                ? `No notes matching "${searchTerm}"`
                : "You haven't created any notes yet"}
            </p>
            <Button className="mt-4" asChild>
              <Link href="/notes/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first note
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}