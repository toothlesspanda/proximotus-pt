const https = require("https")

const API_HOST = "api.metrolisboa.pt"
const API_PORT = 8243

function proxyRequest(path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: API_HOST,
      port: API_PORT,
      path,
      method,
      headers,
      rejectUnauthorized: false,
    }, (res) => {
      let data = ""
      res.on("data", (chunk) => data += chunk)
      res.on("end", () => resolve({ status: res.statusCode, body: data }))
    })
    req.on("error", reject)
    if (body) req.write(body)
    req.end()
  })
}

exports.handler = async (event) => {
  const apiPath = event.path
    .replace(/^\/.netlify\/functions\/metro-proxy/, "")
    .replace(/^\/api\/metro/, "") || "/"

  console.log("Incoming path:", event.path, "→ API path:", apiPath)

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    }
  }

  const headers = { host: API_HOST }
  if (event.headers.authorization) headers.Authorization = event.headers.authorization
  if (event.headers["content-type"]) headers["Content-Type"] = event.headers["content-type"]
  if (event.headers.accept) headers.Accept = event.headers.accept

  try {
    const result = await proxyRequest(apiPath, event.httpMethod, headers, event.body)
    return {
      statusCode: result.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: result.body,
    }
  } catch (err) {
    console.error("Proxy error:", err.message)
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
