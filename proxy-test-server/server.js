import "dotenv/config";
import express from "express";
import cors from "cors";
import { ProxyAgent, fetch } from "undici";

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.ALLOWED_ORIGIN;
const proxyUrl = process.env.PROXY_URL;

app.use(cors({
  origin(origin, callback) {
    if (!origin || !allowedOrigin || origin === allowedOrigin) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  }
}));

let lastCheck = 0;
app.get("/api/proxy-test", async (_req, res) => {
  if (!proxyUrl) return res.status(503).json({ ok: false, error: "PROXY_URL is not configured on the server." });
  if (Date.now() - lastCheck < 5000) return res.status(429).json({ ok: false, error: "Please wait before testing again." });
  lastCheck = Date.now();
  let dispatcher;
  try {
    dispatcher = new ProxyAgent(proxyUrl);
    const response = await fetch("https://api.ipify.org?format=json", {
      dispatcher,
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error("IP check service returned HTTP " + response.status);
    const data = await response.json();
    return res.json({ ok: true, ip: data.ip });
  } catch (error) {
    return res.status(502).json({ ok: false, error: "Proxy connection failed. Check the server-side proxy configuration." });
  } finally {
    if (dispatcher) await dispatcher.close();
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));
app.listen(port, () => console.log("Username Lab proxy tester listening on " + port));
