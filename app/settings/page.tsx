'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/lib/provider/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Moon, Save, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [autosave, setAutosave] = useState(true);
  const [saveInterval, setSaveInterval] = useState(30);
  
  const handleSaveSettings = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated',
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto py-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-3xl font-bold tracking-tight">Settings</h1>
          
          <div className="space-y-6">
            <div className="rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account settings
              </p>
              <Separator className="my-4" />
              
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the email associated with your account
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold">AI Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure the AI settings for note summarization
              </p>
              <Separator className="my-4" />
              
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key (optional)</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add your own API key for extended features and higher rate limits
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">
                Customize how the application looks
              </p>
              <Separator className="my-4" />
              
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {darkMode ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Toggle between light and dark theme
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold">Editor Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure your note editor preferences
              </p>
              <Separator className="my-4" />
              
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autosave">Autosave</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically save notes while typing
                    </p>
                  </div>
                  <Switch
                    id="autosave"
                    checked={autosave}
                    onCheckedChange={setAutosave}
                  />
                </div>
                
                {autosave && (
                  <div className="grid gap-2">
                    <Label htmlFor="save-interval">Autosave Interval (seconds)</Label>
                    <Input
                      id="save-interval"
                      type="number"
                      min="5"
                      max="120"
                      value={saveInterval}
                      onChange={(e) => setSaveInterval(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}