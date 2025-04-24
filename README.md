# NotesAI - Smart Note-Taking with AI

NotesAI is a modern note-taking application that combines the simplicity of traditional note-taking with the power of AI-driven summarization. Built with Next.js, TypeScript, and Supabase, it offers a seamless experience for creating, organizing, and enhancing your notes.

## Features

- **Smart Summarization**: Automatically generate concise summaries of your notes using AI
- **User Authentication**: Secure login with email/password or Google OAuth
- **Rich Text Support**: Basic Markdown-style formatting for better note organization
- **Dark Mode**: Built-in dark mode support for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 13 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vignesh9123/notes-ai.git
   cd notesai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     GOOGLE_GENERATIVE_AI_API_KEY=your-google-generative-ai-api-key
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The application requires a Supabase database with the following tables:
- `notes`: Stores user notes with AI-generated summaries
- `profiles`: Manages user profile information

The database schema and migrations are included in the `supabase/migrations` directory.

## Usage

### Creating Notes

1. Log in to your account
2. Click the "New Note" button
3. Enter your note title and content
4. Click "Generate Summary" to create an AI-powered summary
5. Save your note

### Managing Notes

- **View**: Click on any note to view its contents
- **Edit**: Switch to the "Edit" tab to modify your note
- **Delete**: Use the delete button to remove unwanted notes

### AI Summarization

The AI summarization feature extracts key points from your notes:
1. Write or update your note content
2. Click the "Summarize" button
3. Review the AI-generated summary in the "Summary" tab

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
