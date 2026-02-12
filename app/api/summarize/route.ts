import { NextResponse } from 'next/server';
import { getYouTubeTranscript } from '@/app/lib/youtubeTranscript';
import { summarizeWithGemini } from '@/app/lib/geminiAI';

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    // Get transcript
    const transcript = await getYouTubeTranscript(videoId);
    
    // Generate AI summary
    const summary = await summarizeWithGemini(transcript);
    
    return NextResponse.json({ 
      summary,
      transcript_length: transcript.length
    });
    
  } catch (error: any) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to summarize video',
        details: 'The video might not have captions or the API key might be invalid'
      },
      { status: 500 }
    );
  }
}
