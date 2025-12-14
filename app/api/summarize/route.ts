import { NextResponse } from 'next/server';
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

async function generateSummary(noteText: string): Promise<string> {

  const model = google('gemini-2.5-flash')
  const {text} = await generateText({
    model,
    system:'You are a note text summarizer. You will be given a note text and you will generate a summary of the textThe summary should be clear and concise. The summary should be formatted in markdown, with title, headings, and bullet points if needed. Bullet points should start with - not *. Also please dont use ** for bold text. Also restrict yourself to # and ## heading levels',
    prompt:`Summarize the following note text: ${noteText}`
  })

  return text
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }
    
    const summary = await generateSummary(text);
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json(
      { error: 'Failed to summarize text' },
      { status: 500 }
    );
  }
}