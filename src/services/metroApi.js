const API_CREDENTIALS = import.meta.env.VITE_METRO_API_TOKEN
const BASE = import.meta.env.VITE_METRO_API_URL

let cachedToken = null
let tokenExpiry = 0
let tokenPromise = null

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  if (tokenPromise) return tokenPromise

  tokenPromise = fetch(`${BASE}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${API_CREDENTIALS}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Token request failed: ${res.status}`)
      return res.json()
    })
    .then((data) => {
      cachedToken = data.access_token
      tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
      tokenPromise = null
      return cachedToken
    })
    .catch((e) => {
      tokenPromise = null
      throw e
    })

  return tokenPromise
}

export async function fetchWaitTimes(lineName) {
  const token = await getToken()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const res = await fetch(`${BASE}/estadoServicoML/1.0.1/tempoEspera/Linha/${lineName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Wait times ${lineName}: ${res.status}`)
    return res.json()
  } finally {
    clearTimeout(timeout)
  }
}
