import { createServer } from "node:http"
import { request as httpsRequest } from "node:https"

const PORT = 3001
const API_HOST = "api.metrolisboa.pt"
const API_PORT = 8243

createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

  if (req.method === "OPTIONS") {
    res.writeHead(204)
    res.end()
    return
  }

  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: API_HOST },
    rejectUnauthorized: false,
  }
  delete options.headers.origin
  delete options.headers.referer

  const proxy = httpsRequest(options, (apiRes) => {
    res.writeHead(apiRes.statusCode, apiRes.headers)
    apiRes.pipe(res)
  })

  proxy.on("error", (e) => {
    console.error("Proxy error:", e.message)
    res.writeHead(502)
    res.end("Proxy error")
  })

  req.pipe(proxy)
}).listen(PORT, () => console.log(`Proxy on http://localhost:${PORT}`))
