import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { BrainCircuit, FileText, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">NotesAI</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/auth/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto py-24 md:py-32">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                Your Notes, <span className="text-primary">Supercharged</span> with AI
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                NotesAI helps you capture ideas and organize thoughts with the power of AI
                to summarize and extract key insights from your notes.
              </p>
              <div className="flex gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden rounded-xl border border-border bg-card p-8 shadow-lg md:flex md:items-center md:justify-center">
              <div className="absolute -top-3 -right-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                AI-powered
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
                  <div className="mb-2 text-sm font-medium">My long meeting notes</div>
                  <div className="text-sm text-muted-foreground line-clamp-3">
                    Today we discussed the quarterly goals and set new targets for the upcoming release. 
                    The team brought up several concerns about the timeline...
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                    <span>AI Summary</span>
                  </div>
                  <div className="text-sm">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Quarterly goals and targets set</li>
                      <li>Team raised timeline concerns</li>
                      <li>Action items assigned to respective owners</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40">
          <div className="container mx-auto py-16 md:py-24">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Features that make note-taking better
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <FileText className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Easy Note Creation</h3>
                <p className="text-muted-foreground">
                  Create, edit, and organize your notes with a clean, distraction-free interface.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <BrainCircuit className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-xl font-bold">AI Summaries</h3>
                <p className="text-muted-foreground">
                  Get instant AI-generated summaries that extract key points from your notes.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <Sparkles className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Seamless Experience</h3>
                <p className="text-muted-foreground">
                  Access your notes from any device with real-time synchronization.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">NotesAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NotesAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}