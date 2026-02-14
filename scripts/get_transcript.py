import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

def get_transcript(video_id):
    try:
        # Instantiate the API if needed, or check if it's a class method
        # Based on error, fetch is an instance method
        api = YouTubeTranscriptApi()
        # Try to fetch transcript in common languages
        # 'en' = English, 'hi' = Hindi, 'es' = Spanish, 'fr' = French, 'de' = German, 'ja' = Japanese
        languages = [
            'en', 'hi', 'hi-IN', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'ko', 'it', 'nl', 'tr', 'pl',
            'th', 'vi', 'id', 'zh-Hans', 'zh-Hant'
        ]
        
        # If fetch fails, we could try list_transcripts, but fetch handles the search
        transcript_list = api.fetch(video_id, languages=languages)
        # Format: [{'text': '...', 'start': 0.0, 'duration': 1.0}, ...]
        # Or objects with attributes
        full_text = " ".join([item.text if hasattr(item, 'text') else str(item) for item in transcript_list])
        print(json.dumps({"success": True, "transcript": full_text}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No video ID provided"}))
    else:
        video_id = sys.argv[1]
        get_transcript(video_id)
