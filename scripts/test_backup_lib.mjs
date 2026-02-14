import { TranscriptClient } from 'youtube-transcript-api';

async function testBackup() {
  const videoId = 'yC36gN-rqjo'; 
  console.log(`Testing youtube-transcript-api for ${videoId}...`);
  
  try {
    const client = new TranscriptClient(videoId);
    const transcript = await client.getTranscript();
    
    console.log('✅ Success!');
    console.log('Length:', transcript.length);
    console.log('First Item:', transcript[0]);
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

testBackup();
