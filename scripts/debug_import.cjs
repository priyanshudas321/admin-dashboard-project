const pkg = require('youtube-transcript-api');
console.log('Package exports:', pkg);
console.log('Keys:', Object.keys(pkg));
try {
  const { TranscriptClient } = pkg;
  console.log('TranscriptClient type:', typeof TranscriptClient);
} catch (e) {
  console.log('Error destructuring:', e.message);
}
