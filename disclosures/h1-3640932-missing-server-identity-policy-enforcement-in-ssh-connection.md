---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/authentication-bypass-by-primary-weakness
  - env/web
substate: "not-applicable"
weakness: "Authentication Bypass by Primary Weakness"
enriched: true
body: true
date: 2026-04-03
submitted: 2026-03-31T22:47:17.893Z
bounty_usd: null
votes: 16
cve: "CVE-2022-27782", "CVE-2023-27538"
program: "[[programs/curl|curl]]"
reporter: "intrax71"
source: "https://hackerone.com/reports/3640932"
title: "Missing server identity policy enforcement in SSH connection reuse allows host key verification bypass via pool poisoning"
---
# Missing server identity policy enforcement in SSH connection reuse allows host key verification bypass via pool poisoning

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** curl | **Disclosed:** 2026-04-03

- Report: [https://hackerone.com/reports/3640932](https://hackerone.com/reports/3640932)
- CWE: Authentication Bypass by Primary Weakness | CVE: CVE-2022-27782, CVE-2023-27538
- Submitted: 2026-03-31T22:47:17.893Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Missing server identity policy enforcement in SSH connection reuse allows host key verification bypass via pool poisoning

---

## Summary

`ssh_config_matches()` in `lib/url.c` decides whether an existing SSH connection can be reused by a new transfer handle. It checks client key paths (`rsa`, `rsa_pub`) but never inspects the three options that control server identity verification: `STRING_SSH_KNOWNHOSTS`, `STRING_SSH_HOST_PUBLIC_KEY_MD5`, and `STRING_SSH_HOST_PUBLIC_KEY_SHA256`. A handle configured with strict host key pinning reuses a pooled connection that was established with zero server verification — the pinning check never fires because the SSH handshake is skipped entirely.

This is the same bug class as CVE-2022-27782 and CVE-2023-27538. Both fixed client-side key options. The server-side identity options were never added.

---

## Vulnerability Details

- **Vulnerability Type:** Authentication Bypass (Connection Pool Poisoning)
- **CVSS 3.1 Score:** 7.5 (High) — `AV:N/AC:H/PR:N/UI:N/S:C/C:H/I:N/A:N`
- **Affected Component:** `lib/url.c` → `ssh_config_matches()`
- **Affected Protocols:** SFTP, SCP

---

## Root Cause

The full function body at `lib/url.c`:

```c
static bool ssh_config_matches(struct connectdata *one,
                               struct connectdata *two)
{
  struct ssh_conn *sshc1, *sshc2;

  sshc1 = Curl_conn_meta_get(one, CURL_META_SSH_CONN);
  sshc2 = Curl_conn_meta_get(two, CURL_META_SSH_CONN);
  return sshc1 && sshc2 && Curl_safecmp(sshc1->rsa, sshc2->rsa) &&
          Curl_safecmp(sshc1->rsa_pub, sshc2->rsa_pub);
}
```

Three `data->set.str[]` entries are absent from this comparison:

| Option | String Key | Purpose |
|--------|------------|---------|
| `CURLOPT_SSH_KNOWNHOSTS` | `STRING_SSH_KNOWNHOSTS` | Path to known_hosts file for server fingerprint validation |
| `CURLOPT_SSH_HOST_PUBLIC_KEY_MD5` | `STRING_SSH_HOST_PUBLIC_KEY_MD5` | Expected MD5 hash of server's public key |
| `CURLOPT_SSH_HOST_PUBLIC_KEY_SHA256` | `STRING_SSH_HOST_PUBLIC_KEY_SHA256` | Expected SHA-256 hash of server's public key |

For contrast, the TLS backend enforces full parity on security-relevant fields during connection reuse — `verifypeer`, `verifyhost`, pinned certificates are all compared. The SSH backend has no equivalent enforcement.

---

## Steps to Reproduce

**Environment:**
- libcurl built with libssh2 (default SSH backend)
- Two easy handles sharing one connection pool via `CURLSH`
- Target: any SFTP server (e.g. `test.rebex.net`, public demo)

```
./poc
```

**Source (`poc.c`):**

```c
#include <curl/curl.h>
#include <stdio.h>

int main(void) {
    CURL *relaxed, *strict;
    CURLSH *pool;
    long new_connections = 0;

    curl_global_init(CURL_GLOBAL_DEFAULT);

    pool = curl_share_init();
    curl_share_setopt(pool, CURLSHOPT_SHARE, CURL_LOCK_DATA_CONNECT);

    relaxed = curl_easy_init();
    strict  = curl_easy_init();

    if(relaxed && strict && pool) {
        /* --- Transfer 1: no host verification --- */
        curl_easy_setopt(relaxed, CURLOPT_URL, "sftp://demo:password@test.rebex.net/readme.txt");
        curl_easy_setopt(relaxed, CURLOPT_SHARE, pool);
        // Silencing stderr for clean output
        curl_easy_setopt(relaxed, CURLOPT_NOBODY, 1L); 

        fprintf(stderr, "[*] Transfer 1 — no host key checks\n");
        curl_easy_perform(relaxed);

        /* --- Transfer 2: strict host key pinning requested --- */
        curl_easy_setopt(strict, CURLOPT_URL, "sftp://demo:password@test.rebex.net/readme.txt");
        curl_easy_setopt(strict, CURLOPT_SHARE, pool);
        curl_easy_setopt(strict, CURLOPT_SSH_KNOWNHOSTS, "/non/existent/file");
        curl_easy_setopt(strict, CURLOPT_NOBODY, 1L);

        fprintf(stderr, "[*] Transfer 2 — CURLOPT_SSH_KNOWNHOSTS set to non-existent file\n");
        curl_easy_perform(strict);

        curl_easy_getinfo(strict, CURLINFO_NUM_CONNECTS, &new_connections);

        if(new_connections == 0) {
            fprintf(stderr, "\n[!] VULNERABLE — Transfer 2 reused the unverified connection.\n"
                            "    CURLOPT_SSH_KNOWNHOSTS was silently ignored.\n"
                            "    No new TCP or SSH handshake occurred.\n");
        } else {
            fprintf(stderr, "\n[+] NOT VULNERABLE — new connection was established.\n");
        }
    }

    curl_easy_cleanup(relaxed);
    curl_easy_cleanup(strict);
    curl_share_cleanup(pool);
    curl_global_cleanup();

    return 0;
}
```

**Output on vulnerable build:**

```
[*] Transfer 1 — no host key checks
[*] Transfer 2 — CURLOPT_SSH_KNOWNHOSTS set to non-existent file

[!] VULNERABLE — Transfer 2 reused the unverified connection.
    CURLOPT_SSH_KNOWNHOSTS was silently ignored.
    No new TCP or SSH handshake occurred.
```

{F5648299}

**Expected behavior:** Transfer 2 opens a new connection, attempts to read `/tmp/does_not_exist_known_hosts`, fails, and returns `CURLE_SSH` error.

**Actual behavior:** Transfer 2 reuses the pooled connection from Transfer 1. `CURLINFO_NUM_CONNECTS` returns `0` — no handshake, no host key check, no error.

---

## Impact

In any environment where multiple transfer handles share a connection pool — `CURLM` multi-handle applications, `CURLSH` shared caches, PHP-FPM worker pools, proxy daemons — a connection established without server identity verification is reusable by handles that explicitly require it.

An attacker who performs a MITM on the initial unverified connection inherits access to every subsequent transfer on that pool, including those configured with host key pinning or `known_hosts` validation. Sensitive SFTP/SCP data (credentials, files, configuration) flows over the attacker-controlled channel. The developer's explicit security policy is discarded without error or warning.

This is not theoretical — `CURLSH` shared pools exist precisely for multi-tenant connection reuse. The TLS backend already prevents this exact pattern. The SSH backend does not.

**Prior art:**
- **CVE-2022-27782** — fixed TLS + partial SSH reuse checks ($2,400)
- **CVE-2023-27538** — fixed remaining client key options ($480)
- **This report** — server identity options remain unchecked

---

## Recommended Fix

Add three comparisons to `ssh_config_matches()`:

```c
static bool ssh_config_matches(struct connectdata *one,
                               struct connectdata *two)
{
  struct ssh_conn *sshc1, *sshc2;

  sshc1 = Curl_conn_meta_get(one, CURL_META_SSH_CONN);
  sshc2 = Curl_conn_meta_get(two, CURL_META_SSH_CONN);
  return sshc1 && sshc2 &&
         Curl_safecmp(sshc1->rsa, sshc2->rsa) &&
         Curl_safecmp(sshc1->rsa_pub, sshc2->rsa_pub) &&
         Curl_safecmp(one->data->set.str[STRING_SSH_KNOWNHOSTS],
                      two->data->set.str[STRING_SSH_KNOWNHOSTS]) &&
         Curl_safecmp(one->data->set.str[STRING_SSH_HOST_PUBLIC_KEY_MD5],
                      two->data->set.str[STRING_SSH_HOST_PUBLIC_KEY_MD5]) &&
         Curl_safecmp(one->data->set.str[STRING_SSH_HOST_PUBLIC_KEY_SHA256],
                      two->data->set.str[STRING_SSH_HOST_PUBLIC_KEY_SHA256]);
}
```

## Impact

## Summary:
An attacker who can perform a MITM against an initial unverified SFTP/SCP connection gains persistent access to all subsequent transfers on the same shared connection pool — including those from handles that explicitly require host key pinning via CURLOPT_SSH_KNOWNHOSTS or CURLOPT_SSH_HOST_PUBLIC_KEY_SHA256. The strict handle's SSH handshake never occurs; it inherits the compromised connection silently, with no error returned to the application. Sensitive file contents, credentials, and configuration transferred over SFTP/SCP are exposed to the attacker despite the developer having configured server identity verification.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2026-03-31** @intrax71: Hi Curl Team, i have an additional finding, since I can't get a signal and I don't have one, I can't make another report, so I'll just give you a brief overview of what it's about. If you're interested, let me know and I'll send you the proof of concept and everything.

# Additional finding: Security regression in cookie TAB validation

 I found that commit `a78a07d3a9` (2025-12-07, *"cookie: cleanups and improvements"*) regressed the TAB character validation fix originally introduced in `bfe9b59be4` (2022-10-05, reported by Trail of Bits).

The refactoring moved the TAB check from a position where it validated all `name=value` pairs (including cookie attributes like `path=` and `domain=`) into the first-pair block where it only validates the cookie name and value. As a result, a malicious server can inject TAB characters (`0x09`) into the `path` attribute of a `Set-Cookie` header, corrupting the Netscape cookie jar file and causing permanent cookie loss on re-read.
{F5648445}

| | |
|---|---|
| **Affected** | curl 8.18.0 through current HEAD |
| **Not affected** | curl 8.17.0 and earlier |
- **Report Not Applicable**
- **2026-04-01** @jimfuller2024: agree with @bagder (and this seems like a familiar report)
- **2026-04-01** @intrax71: hi, and how i can send you the second report, i can't create another one.
- **2026-04-01** @bagder: The point with the signal requirement is that we don't want your report if you don't have signal enough...
- **Agreed On Going Public**
- **Manually Disclosed**
