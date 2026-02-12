import { YoutubeTranscript } from 'youtube-transcript';

export async function getYouTubeTranscript(videoId: string): Promise<string> {
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptItems || transcriptItems.length === 0) {
      throw new Error('No transcript found (empty response)');
    }

    return transcriptItems.map(item => item.text).join(' ');
  } catch (error: any) {
    console.error('Transcript fetch error:', error);
    // Enhance error message for user
    if (error.message.includes('No transcript found')) {
         throw new Error('No transcript found. The video might not have captions, or they are disabled.');
    }
    throw new Error(`Failed to fetch transcript: ${error.message}`);
  }
}
