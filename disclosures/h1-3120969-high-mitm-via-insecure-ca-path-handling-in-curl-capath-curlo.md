---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/reliance-on-untrusted-inputs-in-a-security-decision
  - env/web
  - trigger/victim-interaction
substate: "not-applicable"
weakness: "Reliance on Untrusted Inputs in a Security Decision"
enriched: true
body: true
date: 2025-06-30
submitted: 2025-05-01T05:57:31.765Z
bounty_usd: null
votes: 10
cve: "CVE-2022-32221"
program: "[[programs/curl|curl]]"
reporter: "oicus"
source: "https://hackerone.com/reports/3120969"
title: "[High] MITM via Insecure CA Path Handling in cURL (--capath, CURLOPT_CAPATH) (CWE-494: Download of Code Without Integrity Check)"
---
# [High] MITM via Insecure CA Path Handling in cURL (--capath, CURLOPT_CAPATH) (CWE-494: Download of Code Without Integrity Check)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** curl | **Disclosed:** 2025-06-30

- Report: [https://hackerone.com/reports/3120969](https://hackerone.com/reports/3120969)
- CWE: Reliance on Untrusted Inputs in a Security Decision | CVE: CVE-2022-32221
- Submitted: 2025-05-01T05:57:31.765Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
The --capath option in cURL and CURLOPT_CAPATH in libcurl accept any directory path without validation. If an attacker provides a custom CA path containing a fake root certificate, cURL will trust malicious HTTPS endpoints signed with that fake root. This allows for full Man-in-the-Middle (MITM) attacks and silent decryption of HTTPS traffic without user warnings.

## Affected version
Affected Asset:

Component: cURL CLI and libcurl
Versions: 7.82.0 to 8.4.0
Platform: All OS (Linux, macOS, Windows)


## Steps To Reproduce:
Works across OS, no user interaction required, and reproducible without root.
1.Create Fake Root CA:
 openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout fake.key -out fake.crt \
  -subj "/CN=FakeMITMRoot" -days 365

2.Prepare a directory:
mkdir -p /tmp/fake-ca
cp fake.crt /tmp/fake-ca

3.Run vulnerable cURL command:
curl --capath /tmp/fake-ca https://example.com

4.If the server’s TLS certificate was signed by this fake CA, cURL connects successfully and exposes decrypted HTTPS data.
Environment Tested:

curl 7.85.0 (x86_64-pc-linux-gnu) libcurl/7.85.0 OpenSSL/3.0.2

## Supporting Material/References:
References:

CWE-494: https://cwe.mitre.org/data/definitions/494.html
Similar CVE: CVE-2022-32221
cURL Docs: https://curl.se/docs/manpage.html

Recommendation:

Add a whitelist or allowlist of trusted CA directories (e.g., /etc/ssl/certs/, /usr/share/ca-certificates/).
Warn users if non-standard --capath is used.
Consider validating contents with signed manifests or checksum hashes.

Disclosure Policy:

PoC and full exploit details available upon request.
I adhere to a 90-day responsible disclosure timeline.

## Impact

| Vector               | Risk Description                                                                 |

| MITM & Decryption    | Attacker silently decrypts HTTPS (credentials, tokens, sessions).                |
| Silent Exploitation  | No TLS warning shown, making the attack stealthy.                                |
| Cross-Platform Abuse | Affects Linux, Windows, macOS, containers, and CI/CD tools using `libcurl`.      |
| Supply Chain Attack  | Tools and apps that dynamically set `CURLOPT_CAPATH` can be abused automatically.|

## Timeline

- **Report Filed**
- **2025-05-01** @dfandrich: I don't understand the issue. If the user provides a CA path, curl uses it. If the user puts good certificates in the CA path, curl uses them. If the user puts bad certificates in the CA path, curl uses them. Are you saying that somehow curl is somehow supposed to second guess the user?
- **Report Not Applicable**
- **2025-05-02** @jimfuller2024: this falls into the 'dont do that' bucket ... the expectation hat curl should not ever use world writeable file paths is a wrong one.
- **Agreed On Going Public**
- **Manually Disclosed**
