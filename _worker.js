const BOT_PATTERNS = /bot|crawler|spider|scraper|crawling|facebookexternalhit|linkedinbot|twitterbot|slurp|baiduspider|yandex|semrush|ahrefs|mj12bot|dotbot/i;

function parseSource(referer) {
  if (!referer) return "direct";
  try {
    const host = new URL(referer).hostname;
    if (host.includes("linkedin.com")) return "linkedin";
    if (host.includes("github.com")) return "github";
    return "other";
  } catch {
    return "other";
  }
}

async function hashFingerprint(ip, ua) {
  const data = new TextEncoder().encode(`${ip}|${ua}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    const url = new URL(request.url);
    if (url.pathname !== "/") return response;

    const ua = request.headers.get("User-Agent") || "";
    if (BOT_PATTERNS.test(ua)) return response;

    const ip = request.headers.get("CF-Connecting-IP") || "";
    const fingerprint = await hashFingerprint(ip, ua);
    const dedupKey = `dedup:${fingerprint}`;

    const already = await env.VIEWS.get(dedupKey);
    if (already) return response;

    const source = parseSource(request.headers.get("Referer"));

    await Promise.all([
      env.VIEWS.put(dedupKey, "1", { expirationTtl: 3600 }),
      env.VIEWS.put("views:total", String((parseInt(await env.VIEWS.get("views:total") || "0") + 1))),
      env.VIEWS.put(`views:${source}`, String((parseInt(await env.VIEWS.get(`views:${source}`) || "0") + 1))),
    ]);

    return response;
  },
};
