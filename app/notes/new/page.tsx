'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNotes } from '@/lib/hooks/useNotes';
import { useAuth } from '@/lib/provider/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Loader2, Save } from 'lucide-react';
import { useAI } from '@/lib/hooks/useAI';

export default function NewNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { createNote } = useNotes();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { summarize } = useAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please log in to create notes',
      });
      router.push('/auth/login');
      return;
    }

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
      const newNote = await createNote({ title, content });
      toast({
        title: 'Note created',
        description: 'Your note has been saved successfully',
      });
      router.push(`/notes/${newNote.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create note. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
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
      setContent((prev) => `${prev}\n\n## AI Summary\n${summary}`);
      toast({
        title: 'Summary generated',
        description: 'AI summary has been added to your note',
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">New Note</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleGenerateSummary}
                disabled={isSummarizing || isSubmitting || !content.trim()}
              >
                {isSummarizing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                Generate Summary
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] resize-none"
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}