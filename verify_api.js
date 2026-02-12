const axios = require('axios');

async function verify() {
  const videoId = '8dWL3wF_OMw'; // The video ID from the user's URL
  try {
    console.log('Testing /api/summarize with videoId:', videoId);
    const response = await axios.post('http://localhost:3000/api/summarize', {
      videoId: videoId
    });
    console.log('Status:', response.status);
    console.log('Summary Preview:', response.data.summary.substring(0, 100) + '...');
    console.log('SUCCESS: API is working!');
  } catch (error) {
    console.error('FAILED:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
  }
}

verify();
