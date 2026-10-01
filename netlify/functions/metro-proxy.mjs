const API_TARGET = "https://api.metrolisboa.pt:8243"

export default async (req) => {
  const url = new URL(req.url)
  const apiPath = url.pathname.replace(/^\/api\/metro/, "")

  const headers = {}
  for (const [key, value] of req.headers.entries()) {
    if (["host", "connection", "origin", "referer"].includes(key)) continue
    headers[key] = value
  }

  try {
    const apiRes = await fetch(`${API_TARGET}${apiPath}`, {
      method: req.method,
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    })

    const body = await apiRes.text()
    return new Response(body, {
      status: apiRes.status,
      headers: {
        "Content-Type": apiRes.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    })
  } catch (err) {
    console.error("Proxy error:", err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const config = {
  path: "/api/metro/*",
}
