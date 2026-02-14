module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/lib/youtubeTranscript.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import ytdl from '@distube/ytdl-core';
__turbopack_context__.s([
    "getYouTubeTranscript",
    ()=>getYouTubeTranscript
]);
async function getYouTubeTranscript(videoId) {
    const minText = (str)=>str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    let sessionCookies = [];
    const log = (msg)=>{
        try {
            console.log(msg.replace(/[^\x00-\x7F]/g, "?"));
        } catch  {}
    };
    const fetchUrl = async (url)=>{
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), 10000); // 10s timeout
        try {
            const headers = {
                'User-Agent': USER_AGENT,
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': `https://www.youtube.com/watch?v=${videoId}`
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
                const newCookies = response.headers.getSetCookie();
                if (newCookies && newCookies.length) {
                    sessionCookies = [
                        ...sessionCookies,
                        ...newCookies
                    ];
                }
            } else {
                // Fallback
                const newCookie = response.headers.get('set-cookie');
                if (newCookie) {
                    sessionCookies.push(newCookie);
                }
            }
            return await response.text();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };
    let info;
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
                info = {
                    player_response: JSON.parse(jsonMatch[1])
                };
            } else {
                throw new Error('Could not scrape ytInitialPlayerResponse');
            }
        } catch (scrapeError) {
            throw new Error(`Manual scrape failed: ${scrapeError.message}`);
        }
        const captions = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        if (!captions || captions.length === 0) {
            throw new Error('No captions found for this video.');
        }
        const track = captions.find((t)=>t.languageCode === 'en') || captions[0];
        log(`[Transcript] Found caption track (${track.languageCode})`);
        const transcriptUrl = track.baseUrl;
        if (!transcriptUrl) throw new Error('No transcript URL found');
        // Fetch XML
        let parsedText = '';
        try {
            const xml = await fetchUrl(transcriptUrl);
            const regex = /<text[^>]*>([^<]*)<\/text>/g;
            let match;
            while((match = regex.exec(xml)) !== null){
                if (match[1]) parsedText += minText(match[1]) + ' ';
            }
            parsedText = parsedText.trim();
        } catch (e) {
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
                        parsedText = json.events.map((e)=>e.segs ? e.segs.map((s)=>s.utf8).join('') : '').join(' ').trim();
                    }
                } catch  {
                    log('[Transcript] JSON3 parse failed or empty body');
                }
            } catch (e) {
                log(`[Transcript] JSON3 fetch failed: ${e.message}`);
            }
        }
        if (!parsedText) throw new Error('Parsed transcript is empty. The video might restrict caption access.');
        return parsedText;
    } catch (error) {
        if (error.message.includes('Parsed transcript is empty') || error.message.includes('No captains found')) {
            log('[Transcript] Node fetch failed. Trying Python fallback...');
            try {
                const { spawn } = await __turbopack_context__.A("[externals]/child_process [external] (child_process, cjs, async loader)");
                const pythonProcess = spawn('python', [
                    'scripts/get_transcript.py',
                    videoId
                ]);
                let dataString = '';
                let errorString = '';
                for await (const chunk of pythonProcess.stdout){
                    dataString += chunk;
                }
                for await (const chunk of pythonProcess.stderr){
                    errorString += chunk;
                }
                const exitCode = await new Promise((resolve)=>{
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
            } catch (pyError) {
                throw new Error(`Python fallback failed: ${pyError.message}`);
            }
        }
        console.error('[Transcript] Error:', error.message);
        throw new Error(`Failed to fetch transcript: ${error.message}`);
    }
}
}),
"[project]/app/lib/geminiAI.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateSummary",
    ()=>generateSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
// This reads from environment variables - NEVER// Initialize Gemini API
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY || '');
async function generateSummary(transcript) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
    }
    const prompt = `
    You are an expert video summarizer.
    Summarize the following YouTube video transcript in a concise, bullet-point format.
    Highlight the key takeaways and important details.
    
    Transcript:
    ${transcript.substring(0, 30000)} // Limit length to avoid token limits
  `;
    try {
        // Try Flash model first
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.warn('Gemini 1.5 Flash failed, retrying with Gemini Pro...', error.message);
        try {
            // Fallback to Gemini Pro
            const modelPro = genAI.getGenerativeModel({
                model: "gemini-pro"
            });
            const resultPro = await modelPro.generateContent(prompt);
            return resultPro.response.text();
        } catch (finalError) {
            console.error('Gemini API Error:', finalError);
            throw new Error(`AI Generation Failed: ${finalError.message}. Check your API Key.`);
        }
    }
}
}),
"[project]/app/api/summarize/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$youtubeTranscript$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/youtubeTranscript.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$geminiAI$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/geminiAI.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const { videoId } = await request.json();
        if (!videoId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Video ID is required'
            }, {
                status: 400
            });
        }
        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Gemini API key not configured. Please add GEMINI_API_KEY to environment variables.'
            }, {
                status: 500
            });
        }
        // Get transcript
        const transcript = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$youtubeTranscript$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getYouTubeTranscript"])(videoId);
        // Generate AI summary
        const summary = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$geminiAI$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSummary"])(transcript);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            summary,
            transcript_length: transcript.length
        });
    } catch (error) {
        console.error('Summarization error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to summarize video',
            details: 'The video might not have captions or the API key might be invalid'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0f72ec12._.js.map