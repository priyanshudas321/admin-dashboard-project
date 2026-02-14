import ytdl from '@distube/ytdl-core';
import axios from 'axios';

async function testFetch() {
  const videoId = 'yC36gN-rqjo'; // The video causing the error
  console.log(`Fetching info for ${videoId}...`);
  
  try {
    const info = await ytdl.getInfo(videoId);
    const tracks = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!tracks || tracks.length === 0) {
        console.log('No tracks found.');
        return;
    }

    const track = tracks[0];
    console.log(`Found track: ${track.name?.simpleText} (${track.languageCode})`);
    console.log(`Base URL: ${track.baseUrl}`);

    const response = await axios.get(track.baseUrl);
    console.log('--- RAW XML START ---');
    console.log(response.data.substring(0, 1000)); // Print first 1000 chars
    console.log('--- RAW XML END ---');

  } catch (error) {
    console.error('Error:', error);
  }
}

testFetch();
