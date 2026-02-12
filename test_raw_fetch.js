const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const videoId = '8dWL3wF_OMw';
  try {
    console.log('Fetching video page...');
    const videoPage = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    
    // Extract captions json
    const split = videoPage.split('"captions":');
    if (split.length <= 1) {
       console.log('No "captions": found in page');
       return;
    }
    
    const jsonPart = split[1].split(',"videoDetails')[0].replace('\n', '');
    const captions = JSON.parse(jsonPart);
    const tracks = captions.playerCaptionsTracklistRenderer.captionTracks;
    
    if (!tracks || tracks.length === 0) {
      console.log('No caption tracks found');
      return;
    }
    
    console.log('Found tracks:', tracks.length);
    const track = tracks[0];
    console.log('Fetching track:', track.name.simpleText, track.languageCode);
    console.log('Original BaseURL:', track.baseUrl);
    const url = track.baseUrl + '&fmt=json3';
    console.log('Fetching JSON URL:', url);
    
    const result = await new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            console.log('Status Code:', res.statusCode);
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                console.log('Redirect to:', res.headers.location);
                // Simple redirect follow
                https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
                     let data = '';
                     res2.on('data', chunk => data += chunk);
                     res2.on('end', () => resolve(data));
                }).on('error', reject);
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });

    console.log('Transcript Body Preview (first 500 chars):');
    console.log(result.substring(0, 500));
    
  } catch (e) {
    console.error(e);
  }
}

run();
