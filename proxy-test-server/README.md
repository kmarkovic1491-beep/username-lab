# Username Lab proxy connection tester

This small backend tests whether your server can make an outbound request through an Oxylabs-style HTTP(S) residential proxy. It only calls ipify to display the outbound IP. It does **not** contact Discord, check usernames, rotate proxies, or bypass rate limits.

## Deploy

1. Deploy this folder as a Node.js web service on a host that supports outbound proxy connections.
2. Set the start command to `npm start`.
3. Add these environment variables in the hosting dashboard:
   - `PROXY_URL`: your provider's full proxy URL, including credentials.
   - `ALLOWED_ORIGIN`: `https://kmarkovic1491-beep.github.io`
   - `PORT`: usually supplied automatically by the host.
4. Do not commit a real `.env` file or put proxy credentials in `index.html`.
5. Copy the deployed service's base URL into the Proxy connection section on Username Lab.

The endpoint is rate-limited to one test every five seconds. The proxy password stays in the server environment and is never returned to the browser.
