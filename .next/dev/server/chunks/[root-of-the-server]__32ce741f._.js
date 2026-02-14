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
"[project]/app/api/summarize/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
;
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns){
        const match = url.match(pattern);
        if (match) return match[1];
    }
    // If input is just the ID (11 chars)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    return null;
}
async function getOEmbedMetadata(videoId) {
    try {
        const resp = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (resp.ok) {
            const data = await resp.json();
            return {
                title: data.title || "Untitled Video"
            };
        }
    } catch (err) {
        console.error("oEmbed metadata extraction failed:", err);
    }
    return {
        title: "Untitled Video"
    };
}
function decodeHtmlEntities(text) {
    return text.replace(/&amp;#39;/g, "'").replace(/&amp;quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n/g, " ").trim();
}
async function getTranscript(videoId) {
    // 1. Get official title via oEmbed (most reliable on Vercel)
    const { title: oEmbedTitle } = await getOEmbedMetadata(videoId);
    // 2. Try YouTube player API with ANDROID client for transcript and description
    let playerResponse;
    try {
        playerResponse = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "com.google.android.youtube/19.09.37 (Linux; U; Android 13; en_US; SM-S918B; Build/TP1A.220624.014)",
                "X-YouTube-Client-Name": "3",
                "X-YouTube-Client-Version": "19.09.37",
                "X-Goog-Api-Format-Version": "2"
            },
            body: JSON.stringify({
                videoId,
                context: {
                    client: {
                        clientName: "ANDROID",
                        clientVersion: "19.09.37",
                        androidSdkVersion: 33,
                        hl: "en",
                        gl: "US"
                    }
                }
            })
        });
    } catch (err) {
        console.error("Player API fetch failed:", err);
        return {
            title: oEmbedTitle,
            description: "",
            isFallback: true
        };
    }
    if (!playerResponse.ok) {
        return {
            title: oEmbedTitle,
            description: "",
            isFallback: true
        };
    }
    const data = await playerResponse.json();
    const title = data.videoDetails?.title || oEmbedTitle;
    const description = data.videoDetails?.shortDescription || "";
    // 3. Extract transcript
    const captionTracks = data.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!captionTracks || captionTracks.length === 0) {
        return {
            title,
            description,
            isFallback: true
        };
    }
    try {
        const enTrack = captionTracks.find((t)=>t.languageCode === "en") || captionTracks.find((t)=>t.languageCode?.startsWith("en")) || captionTracks[0];
        if (!enTrack?.baseUrl) {
            return {
                title,
                description,
                isFallback: true
            };
        }
        const captionResponse = await fetch(enTrack.baseUrl);
        if (!captionResponse.ok) {
            return {
                title,
                description,
                isFallback: true
            };
        }
        const xml = await captionResponse.text();
        if (!xml || xml.length === 0) {
            return {
                title,
                description,
                isFallback: true
            };
        }
        let segments = [];
        const textMatches = xml.match(/<text[^>]*>([^<]*)<\/text>/g);
        if (textMatches && textMatches.length > 0) {
            segments = textMatches.map((seg)=>{
                const m = seg.match(/<text[^>]*>([^<]*)<\/text>/);
                return m ? decodeHtmlEntities(m[1]) : "";
            });
        }
        if (segments.length === 0) {
            const pMatches = xml.match(/<p[^>]*>([^<]*)<\/p>/g);
            if (pMatches && pMatches.length > 0) {
                segments = pMatches.map((seg)=>{
                    const m = seg.match(/<p[^>]*>([^<]*)<\/p>/);
                    return m ? decodeHtmlEntities(m[1]) : "";
                });
            }
        }
        if (segments.length === 0) {
            return {
                title,
                description,
                isFallback: true
            };
        }
        const transcript = segments.filter((t)=>t !== "").join(" ");
        if (!transcript.trim()) {
            return {
                title,
                description,
                isFallback: true
            };
        }
        return {
            title,
            description,
            transcript,
            isFallback: false
        };
    } catch (err) {
        console.error("Transcript processing failed:", err);
        return {
            title,
            description,
            isFallback: true
        };
    }
}
async function summarizeWithGemini(metadata) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        // Fallback for development if not set
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn("GEMINI_API_KEY not set. Using mock response.");
        // throw new Error('GEMINI_API_KEY is not configured');
        }
        throw new Error("GEMINI_API_KEY is not configured");
    }
    const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
    // Updated models list
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
    ];
    let context = "";
    if (metadata.isFallback) {
        context = `The exact transcript for this video is currently unavailable due to data restrictions. 
However, we know the video is titled: "${metadata.title}".
Description: ${metadata.description}

Please use your extensive knowledge of the web and this specific YouTube video to generate comprehensive, highly accurate study notes as if you had read the transcript.`;
    } else {
        context = `**Video Title:** ${metadata.title}
**Transcript:**
${metadata.transcript?.substring(0, 30000)}`;
    }
    const prompt = `You are an expert study notes generator. Analyze the following video information and create comprehensive, well-structured study notes.

${context}

---

Generate the output in the following format (use plain text with markdown-like formatting):

## 📌 Video Summary
Write a concise 3-4 sentence summary of the video's main message.

## 🎯 Key Takeaways
- List 5-8 key points from the video
- Each point should be clear and actionable

## 📝 Detailed Study Notes

### Topic 1: [Name]
- Detailed explanation
- Sub-points with examples

### Topic 2: [Name]
- Continue for all major topics covered

## 💡 Important Quotes or Facts
- List any notable quotes, statistics, or facts mentioned

## 🔗 Related Topics to Explore
- Suggest 3-5 related topics the viewer might want to study next

Make the notes clear, concise, and student-friendly. Use bullet points for readability.`;
    for (const modelName of models){
        try {
            const model = genAI.getGenerativeModel({
                model: modelName
            });
            const result = await model.generateContent(prompt);
            const response = result.response;
            return response.text();
        } catch (err) {
            const message = err instanceof Error ? err.message : "";
            if (message.includes("429") || message.includes("quota") || message.includes("not found")) {
                console.log(`Model ${modelName} issue (${message}), trying next...`);
                continue;
            }
            throw err;
        }
    }
    throw new Error("All AI models failed or rate-limited. Please try again.");
}
async function POST(request) {
    try {
        const body = await request.json();
        const { url, videoId: rawVideoId } = body;
        // Support both source 'url' and target 'videoId' input
        let videoId = rawVideoId;
        if (url) {
            const extracted = extractVideoId(url);
            if (extracted) videoId = extracted;
        }
        if (!videoId && !url) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "YouTube URL is required"
            }, {
                status: 400
            });
        }
        // Final check
        if (!videoId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid YouTube URL. Please paste a valid YouTube video link."
            }, {
                status: 400
            });
        }
        // Extract metadata and transcript
        const videoData = await getTranscript(videoId);
        // Generate study notes
        const notes = await summarizeWithGemini(videoData);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            title: videoData.title,
            videoId,
            notes,
            isFallback: videoData.isFallback
        });
    } catch (error) {
        console.error("AI Summarize error:", error);
        const message = error instanceof Error ? error.message : "Failed to generate notes";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__32ce741f._.js.map