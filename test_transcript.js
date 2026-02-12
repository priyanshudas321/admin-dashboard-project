async function test() {
  const videoId = '8dWL3wF_OMw';
  
  try {
    console.log('Trying youtube-transcript...');
    const { YoutubeTranscript } = require('youtube-transcript');
    let t = await YoutubeTranscript.fetchTranscript(videoId);
    console.log('youtube-transcript length:', t.length);
  } catch (e) {
    console.log('youtube-transcript failed:', e.message);
  }

  try {
    console.log('Trying youtube-transcript-api...');
    const TranscriptClient = require('youtube-transcript-api').default;
    const client = new TranscriptClient();
    
    console.log('Initializing client...');
    await client.ready; // Wait for initialization if needed (the constructor has a ready promise)
    
    console.log('Fetching transcript...');
    let t2 = await client.getTranscript(videoId);
    console.log('youtube-transcript-api length:', t2 ? t2.length : 'null');
    if (t2) console.log('First line:', JSON.stringify(t2).substring(0, 100));
  } catch (e) {
     console.log('youtube-transcript-api failed:', e.message);
     console.error(e);
  }
}

test();
