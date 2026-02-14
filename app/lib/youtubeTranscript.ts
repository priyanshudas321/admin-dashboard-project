// import ytdl from '@distube/ytdl-core';

export async function getYouTubeTranscript(videoId: string): Promise<string> {
  const minText = (str: string) => str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  let sessionCookies: string[] = [];

  const log = (msg: string) => {
      try { console.log(msg.replace(/[^\x00-\x7F]/g, "?")); } catch {}
  };

  const fetchUrl = async (url: string): Promise<string> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      try {
          const headers: HeadersInit = {
              'User-Agent': USER_AGENT,
              'Accept-Language': 'en-US,en;q=0.9',
              'Referer': `https://www.youtube.com/watch?v=${videoId}`,
          };

          if (sessionCookies.length > 0) {
              headers['Cookie'] = sessionCookies.join('; ');
          }

          const response = await fetch(url, {
              headers,
              signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
              throw new Error(`Fetch failed: ${response.status}`);
          }
          
          // Extract Set-Cookie
          // Node 18+ uses headers.getSetCookie()
          // @ts-ignore
          if (typeof response.headers.getSetCookie === 'function') {
               // @ts-ignore
               const newCookies = response.headers.getSetCookie() as string[];
               if (newCookies && newCookies.length) {
                   sessionCookies = [...sessionCookies, ...newCookies];
               }
          } else {
              // Fallback
              const newCookie = response.headers.get('set-cookie');
              if (newCookie) {
                  sessionCookies.push(newCookie);
              }
          }

          return await response.text();
      } catch (error: any) {
          clearTimeout(timeoutId);
          throw error;
      }
  };

  let info: any;
  let method = 'scrape';

  try {
    log(`[Transcript] Fetching info for video ${videoId}...`);

    try {
        log('[Transcript] Starting manual scrape...');
        const html = await fetchUrl(`https://www.youtube.com/watch?v=${videoId}`);

        // Try extracting ytInitialPlayerResponse
        let jsonMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
        if (!jsonMatch) {
            jsonMatch = html.match(/var\s+ytInitialPlayerResponse\s*=\s*({.+?});/);
        }
        
        if (jsonMatch) {
            info = { player_response: JSON.parse(jsonMatch[1]) };
        } else {
             throw new Error('Could not scrape ytInitialPlayerResponse');
        }
    } catch (scrapeError: any) {
        throw new Error(`Manual scrape failed: ${scrapeError.message}`);
    }

    const captions = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!captions || captions.length === 0) {
        throw new Error('No captions found for this video.');
    }

    const track = captions.find((t: any) => t.languageCode === 'en') || captions[0];
    log(`[Transcript] Found caption track (${track.languageCode})`);

    const transcriptUrl = track.baseUrl as string;
    if (!transcriptUrl) throw new Error('No transcript URL found');

    // Fetch XML
    let parsedText = '';
    try {
        const xml = await fetchUrl(transcriptUrl);
        const regex = /<text[^>]*>([^<]*)<\/text>/g;
        let match;
        while ((match = regex.exec(xml)) !== null) {
            if (match[1]) parsedText += minText(match[1]) + ' ';
        }
        parsedText = parsedText.trim();
    } catch (e: any) {
        log(`[Transcript] XML fetch failed: ${e.message}`);
    }

    // Fetch JSON3 fallback
    if (!parsedText) {
        log('[Transcript] XML empty. Trying fmt=json3...');
        try {
            const jsonStr = await fetchUrl(`${transcriptUrl}&fmt=json3`);
            try {
                const json = JSON.parse(jsonStr);
                if (json?.events) {
                    parsedText = json.events
                        .map((e: any) => e.segs ? e.segs.map((s: any) => s.utf8).join('') : '').join(' ').trim();
                }
            } catch {
                log('[Transcript] JSON3 parse failed or empty body');
            }
        } catch (e: any) {
            log(`[Transcript] JSON3 fetch failed: ${e.message}`);
        }
    }

    if (!parsedText) throw new Error('Parsed transcript is empty. The video might restrict caption access.');
    return parsedText;

  } catch (error: any) {
    if (error.message.includes('Parsed transcript is empty') || error.message.includes('No captains found')) {
        log('[Transcript] Node fetch failed. Trying Python fallback...');
        try {
            const { spawn } = await import('child_process');
            const pythonProcess = spawn('python', ['scripts/get_transcript.py', videoId]);
            
            let dataString = '';
            let errorString = '';

            for await (const chunk of pythonProcess.stdout) {
                dataString += chunk;
            }
            
            for await (const chunk of pythonProcess.stderr) {
                errorString += chunk;
            }

            const exitCode = await new Promise((resolve) => {
                pythonProcess.on('close', resolve);
            });

            if (exitCode !== 0) {
                 throw new Error(`Python script exited with code ${exitCode}: ${errorString}`);
            }

            const result = JSON.parse(dataString);
            if (result.success) {
                return result.transcript;
            } else {
                throw new Error(result.error);
            }

        } catch (pyError: any) {
             throw new Error(`Python fallback failed: ${pyError.message}`);
        }
    }

    console.error('[Transcript] Error:', error.message);
    throw new Error(`Failed to fetch transcript: ${error.message}`);
  }
}
