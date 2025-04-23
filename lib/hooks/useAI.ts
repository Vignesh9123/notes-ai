'use client';

import { useState } from 'react';

type SummarizeParams = {
  content: string;
  apiKey?: string;
};

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function summarize({ content, apiKey }: SummarizeParams): Promise<string> {
    setLoading(true);
    setError(null);
    
    try {

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
        },
        body: JSON.stringify({ text: content }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to summarize text');
      }
      
      const data = await response.json();
      return data.summary;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return '';
    } finally {
      setLoading(false);
    }
  }
  
  return {
    summarize,
    loading,
    error,
  };
}