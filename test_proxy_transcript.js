const axios = require('axios');

async function test() {
  const videoId = '8dWL3wF_OMw';
  try {
    console.log(`Fetching via lemnoslife proxy for ${videoId}...`);
    const response = await axios.get(
      `https://yt.lemnoslife.com/noKey/captions?video_id=${videoId}`
    );
    
    // Check response structure
    console.log('Response status:', response.status);
    if (response.data) {
        console.log('Success (Lemnos)!');
        console.log('Data keys:', Object.keys(response.data));
    } else {
        console.log('Failed: empty response');
    }
  } catch (e) {
    console.error('Error:', e.message);
    if (e.response) console.error(e.response.data);
  }
}

test();
