'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNotes } from '@/lib/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { BrainCircuit, Loader2, Save, Trash } from 'lucide-react';
import { useAI } from '@/lib/hooks/useAI';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotePage() {
  const params = useParams();
  const noteId = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const { getNote, updateNote, deleteNote } = useNotes();
  const { summarize } = useAI();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  
  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId),
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation error',
        description: 'Title and content are required',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateNote({ id: noteId, title, content });
      toast({
        title: 'Note updated',
        description: 'Your note has been saved successfully',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update note. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(noteId);
      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted successfully',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete note. Please try again.',
      });
    }
  };

  const handleGenerateSummary = async () => {
    if (!content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Content required',
        description: 'Please write some content to summarize',
      });
      return;
    }

    setIsSummarizing(true);

    try {
      const summary = await summarize({ content });
      
      await updateNote({ 
        id: noteId, 
        summary 
      });
      
      toast({
        title: 'Summary generated',
        description: 'AI summary has been created for your note',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const formatContent = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('## ')) {
          return <h2 key={i} className="mb-3 mt-6 text-xl font-bold">{line.substring(3)}</h2>;
        } else if (line.startsWith('# ')) {
          return <h1 key={i} className="mb-4 mt-8 text-2xl font-bold">{line.substring(2)}</h1>;
        } else if (line.startsWith('- ')) {
          return <li key={i} className="ml-5">{line.substring(2)}</li>;
        } else if (line === '') {
          return <br key={i} />;
        } else {
          return <p key={i} className="mb-2">{line}</p>;
        }
      });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container flex-1 py-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center justify-between">
              <Skeleton className="h-9 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
            <Skeleton className="h-[600px] w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container flex-1 py-6">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <h2 className="text-lg font-semibold">Note not found</h2>
              <p className="mt-2">The note you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            {activeTab === 'edit' ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold"
              />
            ) : (
              <h1 className="text-2xl font-bold">{title}</h1>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleGenerateSummary}
                disabled={isSummarizing || isSubmitting}
              >
                {isSummarizing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                Summarize
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="view">View</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                {note.summary && <TabsTrigger value="summary">AI Summary</TabsTrigger>}
              </TabsList>
              
              {activeTab === 'edit' && (
                <Button onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save
                </Button>
              )}
            </div>
            
            <TabsContent value="view" className="bg-card p-6 border rounded-md min-h-[400px]">
              <div className="prose dark:prose-invert max-w-none">
                {formatContent(content)}
              </div>
            </TabsContent>
            
            <TabsContent value="edit" className="mt-0">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] font-mono"
              />
            </TabsContent>
            
            {note.summary && (
              <TabsContent value="summary" className="bg-primary/5 p-6 border border-primary/20 rounded-md min-h-[200px]">
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">AI-Generated Summary</h2>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {formatContent(note.summary)}
                </div>
              </TabsContent>
            )}
          </Tabs>
          
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span>Created: {new Date(note.created_at).toLocaleString()}</span>
            </div>
            <div>
              <span>Updated: {new Date(note.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}