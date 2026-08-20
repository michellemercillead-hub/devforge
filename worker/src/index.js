// Creates a GitHub issue on behalf of the devforge dashboard so the
// front end never holds a token. GITHUB_TOKEN is a Cloudflare secret,
// set via `wrangler secret put GITHUB_TOKEN` (never committed here).

const ALLOWED_LABELS = new Set(['bug', 'enhancement', 'task']);
const MAX_TITLE_LENGTH = 200;
const MAX_BODY_LENGTH = 4000;

function corsHeaders(env) {
    return {
        'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin'
    };
}

function jsonResponse(body, status, env) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders(env), 'Content-Type': 'application/json' }
    });
}

export default {
    async fetch(request, env) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(env) });
        }

        if (request.method !== 'POST') {
            return jsonResponse({ error: 'Method not allowed' }, 405, env);
        }

        // CORS only stops browsers from reading the response; check the
        // request's own Origin header too so this endpoint can't be
        // driven from arbitrary sites/scripts.
        if (request.headers.get('Origin') !== env.ALLOWED_ORIGIN) {
            return jsonResponse({ error: 'Origin not allowed' }, 403, env);
        }

        let payload;
        try {
            payload = await request.json();
        } catch {
            return jsonResponse({ error: 'Invalid JSON body' }, 400, env);
        }

        const title = String(payload.title || '').trim().slice(0, MAX_TITLE_LENGTH);
        const body = String(payload.body || '').trim().slice(0, MAX_BODY_LENGTH);
        const label = ALLOWED_LABELS.has(payload.label) ? payload.label : null;

        if (!title) {
            return jsonResponse({ error: 'Title is required' }, 400, env);
        }

        const githubResponse = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'User-Agent': 'devforge-issue-worker'
            },
            body: JSON.stringify({ title, body, labels: label ? [label] : [] })
        });

        const data = await githubResponse.json();

        if (!githubResponse.ok) {
            return jsonResponse({ error: data.message || 'GitHub request failed' }, githubResponse.status, env);
        }

        return jsonResponse({ url: data.html_url, number: data.number }, 201, env);
    }
};
