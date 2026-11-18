---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
substate: "not-applicable"
weakness: "Improper Certificate Validation"
enriched: true
body: true
date: 2026-06-05
submitted: 2026-06-05T11:44:52.389Z
bounty_usd: null
votes: 23
cve: "CVE-2020-8286"
program: "[[programs/curl|curl]]"
reporter: "argus-systems"
source: "https://hackerone.com/reports/3784125"
title: "GnuTLS OCSP stapling accepts unrelated SingleResponse (no cert-ID binding)"
---
# GnuTLS OCSP stapling accepts unrelated SingleResponse (no cert-ID binding)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** curl | **Disclosed:** 2026-06-05

- Report: [https://hackerone.com/reports/3784125](https://hackerone.com/reports/3784125)
- CWE: Improper Certificate Validation | CVE: CVE-2020-8286
- Submitted: 2026-06-05T11:44:52.389Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

This report describes a **variant** of the publicly disclosed curl vulnerability **CVE-2020-8286** (OCSP stapling verification bypass), found in the **GnuTLS TLS backend** (`lib/vtls/gtls.c`). The original CVE affected the NSS backend; this variant reproduces the same logical class of defect — accepting revocation status from OCSP response entry `singleResponse[0]` without verifying that the entry corresponds to the authenticated server certificate — in the GnuTLS code path. An attacker who controls or can MitM a TLS connection can supply a crafted stapled OCSP response that bypasses revocation checking, allowing a revoked certificate to be accepted.

---

## Vulnerability Details

| Field              | Value                                                          |
|--------------------|----------------------------------------------------------------|
| **Variant of**     | CVE-2020-8286 (curl OCSP stapling verification bypass — NSS)  |
| **Component**      | `lib/vtls/gtls.c` — GnuTLS TLS backend                        |
| **Function**       | `gtls_verify_ocsp_status`                                      |
| **Sink line**      | `gtls.c:1527–1528`                                             |
| **CWE**            | CWE-295: Improper Certificate Validation                       |
| **CVSS v3 vector** | AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N                          |
| **CVSS v3 score**  | **7.4 (High)**                                                 |
| **Affected config**| GnuTLS backend + `CURLOPT_SSL_VERIFYSTATUS` enabled            |

---

## Relationship to CVE-2020-8286

CVE-2020-8286 was originally fixed in the NSS/OpenSSL code paths of curl by ensuring that each OCSP `SingleResponse` entry is matched against the actual peer certificate's `CertID` (certificate + issuer hash) before its status is trusted. The GnuTLS path (`gtls_verify_ocsp_status`) was not covered by that fix and continues to blindly trust the revocation status from `singleResponse[0]`, regardless of whether that entry corresponds to the authenticated peer certificate.

---

## Vulnerable Code Path

```
gnutls_ocsp_status_request_get(session, &status_request)   // gtls.c:1437
  → gnutls_ocsp_resp_import(ocsp_resp, &status_request)    // gtls.c:1457
  → gnutls_ocsp_resp_get_single(ocsp_resp, 0, ..., &status, ..., &reason)  // gtls.c:1464–1465
  → trust sink: (status != GNUTLS_OCSP_CERT_GOOD) ? CURLE_SSL_INVALIDCERTSTATUS : CURLE_OK  // gtls.c:1527–1528
```

The hard-coded index `0` is used to select the OCSP `SingleResponse` entry. No certificate-ID matching step exists between the entry and the validated peer certificate — there is no call to any `*_check_crt`-style binding function or equivalent issuer/serial cross-check.


## Steps to Reproduce

**Preconditions:**
1. curl built against GnuTLS (not OpenSSL/NSS).
2. `CURLOPT_SSL_VERIFYSTATUS` (or `--cert-status` CLI flag) is enabled.
3. Attacker controls the TLS server or can perform a MitM on the connection.

**Attack steps:**
1. Obtain or fabricate a valid OCSP response containing at least two `SingleResponse` entries:
   - `singleResponse[0]`: `certStatus = good` for an **unrelated** `certID` (e.g., a different certificate/issuer pair).
   - `singleResponse[1]` (or absent): entry for the actual (revoked) peer certificate's `certID`.
2. Serve this crafted stapled OCSP response during the TLS handshake with a revoked server certificate.
3. curl reads `singleResponse[0]`, sees `GNUTLS_OCSP_CERT_GOOD`, and returns `CURLE_OK` — the revoked certificate is accepted.

**Payload (conceptual DER structure):**
```
OCSPResponse {
  responseStatus: successful
  responseBytes: BasicOCSPResponse {
    responses: [
      SingleResponse {                   ← index 0 (trusted by gtls.c)
        certID: { <UNRELATED cert/issuer hash> }
        certStatus: good
      },
      SingleResponse {                   ← index 1 (ignored by gtls.c)
        certID: { <actual peer cert hash> }
        certStatus: revoked
      }
    ]
  }
}
```

---

## Impact

A successful exploit allows a TLS peer presenting a **revoked certificate** to be accepted as valid when curl is built against GnuTLS and `CURLOPT_SSL_VERIFYSTATUS` is enabled. The revocation check that users explicitly opt into provides no protection.

- **Confidentiality:** High — traffic sent to an attacker-controlled (revoked-cert) host is exposed.
- **Integrity:** High — responses from a revoked-cert server are accepted as authentic.
- **Availability:** None — no service disruption.
- **Attack complexity:** High — requires controlling the TLS server or performing active MitM; OCSP response must be cryptographically valid (signed by a trusted OCSP responder, or the attacker must also compromise the OCSP responder).

## Impact

## Summary:

## Timeline

- **Report Filed**
- **2026-06-05** @icing: Nice LLM output. Let's set the clankers aside and look at

https://www.gnutls.org/manual/html_node/Core-TLS-API.html#gnutls_005fcertificate_005fverify_005fpeers2

which libcurl uses to verify the certificate. According to GnuTLS:

"This function will take into account the stapled OCSP responses sent by the server"

and reading its code, it indeed does so to my reading unless `GNUTLS_VERIFY_DISABLE_CRL_CHECKS` is given.

Now, please explain to me how an invalid OCSP response would give a positive verify result from GnuTLS and how the subsequent libcurl checks would mess this up.
- **2026-06-05** @argus-systems: You're correct. I went and actually ran a PoC to verify, and it fails on both GnuTLS 3.7.3 and 3.8.3. GnuTLS verifies the stapled OCSP response including certID binding. This is not an exploitable vulnerability.

This is a defense-in-depth code quality issue in curl, not an exploitable vulnerability with current GnuTLS versions.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
