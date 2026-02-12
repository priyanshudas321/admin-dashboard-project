const { Innertube, UniversalCache } = require('youtubei.js');

async function test() {
  const videoId = '8dWL3wF_OMw';
  try {
    console.log('Initializing Innertube...');
    const yt = await Innertube.create({
        cache: new UniversalCache(false),
        generate_session_locally: true
    });
    
    console.log(`Fetching info for ${videoId}...`);
    const info = await yt.getInfo(videoId);
    
    console.log('Got info. Fetching transcript...');
    const transcriptData = await info.getTranscript();
    
    if (transcriptData && transcriptData.transcript) {
        console.log('Success (Innertube)!');
        const text = transcriptData.transcript.content.body.initial_segments.map(s => s.snippet.text).join(' ');
        console.log('Transcript preview:', text.substring(0, 100));
    } else {
        console.log('Failed: no transcript found in response');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
