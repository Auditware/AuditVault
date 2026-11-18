---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/mobile
  - os/ios
  - os/macos
substate: "informative"
weakness: "Improper Certificate Validation"
enriched: true
body: true
date: 2025-10-09
submitted: 2025-10-07T15:37:19.499Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/curl|curl]]"
reporter: "giant_anteater"
source: "https://hackerone.com/reports/3374554"
title: "Apple SecTrust legacy path accepts untrusted certificates on pre-10.14 macOS/iOS when built with USE_APPLE_SECTRUST"
---
# Apple SecTrust legacy path accepts untrusted certificates on pre-10.14 macOS/iOS when built with USE_APPLE_SECTRUST

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** curl | **Disclosed:** 2025-10-09

- Report: [https://hackerone.com/reports/3374554](https://hackerone.com/reports/3374554)
- CWE: Improper Certificate Validation
- Submitted: 2025-10-07T15:37:19.499Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
When libcurl is built with USE_APPLE_SECTRUST and runs on Apple OS versions that lack SecTrustEvaluateWithError (macOS <10.14 / iOS <12), the legacy verification path miscompares OSStatus to SecTrustResultType and never checks the SecTrust result. This can cause untrusted certificates to be accepted.

[Statement clarifying if an AI was used to find the issue or generate the report]
This report was prepared with assistance from an AI code analysis tool; the core diagnosis and scope were validated by a combination of classical software, manual inspection of the code, and AI.

## Affected version
Reproduced on current master (as of 2025‑10‑07). Affects builds that enable `USE_APPLE_SECTRUST` and run on macOS <10.14 / iOS <12. The defect is in `lib/vtls/apple.c` and is independent of the TLS backend choice (it is reached via OpenSSL or GnuTLS when the native CA store is used).

## Steps To Reproduce:

### Code Verification (Any modern macOS):

1. Inspect the vulnerable code in `lib/vtls/apple.c` lines 263-275
2. Observe the type confusion: `status` (OSStatus) is compared to `kSecTrustResultType` enum values
3. Create test program demonstrating the logic bug (see verification artifacts)
4. Create untrusted certificate and verify system curl rejects it

### Runtime Exploitation (Requires macOS <10.14 or iOS <12):

**Note:** This requires an actual legacy system. Building with 
`-DCMAKE_OSX_DEPLOYMENT_TARGET=10.13` on modern macOS will NOT trigger 
the bug at runtime due to `__builtin_available` checks.

1. On a system running macOS 10.13.6 (High Sierra) or earlier, build curl:
   ```
   cmake -DUSE_APPLE_SECTRUST=ON -DCURL_USE_OPENSSL=ON \
         -DCMAKE_BUILD_TYPE=Release ..
   ```

2. Create untrusted certificates (as described)

3. Start test server: `openssl s_server -accept 8443 -www -key leaf.key -cert leaf.pem`

4. Test: `./src/curl -v https://localhost:8443/`
   - **Expected secure behavior:** Connection rejected
   - **Actual buggy behavior:** Connection succeeds

### Alternative Verification Without Legacy Hardware:

Since the bug is a clear logic error (comparing wrong variable), it can be 
confirmed through:
- Static code analysis (lines 270-271 compare `status` instead of `sec_result`)
- Logic demonstration (status=0 never equals kSecTrustResultUnspecified=4)
- The fact that `result` remains `CURLE_OK` when the conditions fail

## Supporting Material/References:

Problematic code (legacy fallback uses SecTrustEvaluate; compares `status` to SecTrustResultType instead of checking `sec_result`):

```263:275:lib/vtls/apple.c
#ifndef REQUIRES_SecTrustEvaluateWithError
SecTrustResultType sec_result;
status = SecTrustEvaluate(trust, &sec_result);

if(status != noErr) {
  failf(data, "Apple SecTrust verification failed: error %i", (int)status);
}
else if((status == kSecTrustResultUnspecified) ||
        (status == kSecTrustResultProceed)) {
  /* "unspecified" means system-trusted with no explicit user setting */
  result = CURLE_OK;
}
#endif /* REQUIRES_SecTrustEvaluateWithError */
```

Correct modern code path (only available on 10.14+/iOS 12+):
```238:240:lib/vtls/apple.c
result = SecTrustEvaluateWithError(trust, &error) ?
         CURLE_OK : CURLE_PEER_FAILED_VERIFICATION;
```

Behavioral gates where Apple SecTrust verification is invoked:
- OpenSSL:
```5165:5177:lib/vtls/openssl.c
if(!verified &&
   conn_config->verifypeer && ssl_config->native_ca_store &&
   (ossl_verify == X509_V_ERR_UNABLE_TO_GET_ISSUER_CERT_LOCALLY)) {
  result = ossl_apple_verify(..., &verified);
  ...
}
```
- GnuTLS:
```1666:1676:lib/vtls/gtls.c
if(!verified && ssl_config->native_ca_store &&
   (verify_status & GNUTLS_CERT_SIGNER_NOT_FOUND)) {
  result = glts_apple_verify(..., &verified);
  ...
}
```
```

## Impact

## Summary:
On affected configurations (USE_APPLE_SECTRUST builds running on pre‑10.14 Apple OS with native CA verification engaged), an attacker can bypass TLS certificate validation. This enables Man‑in‑the‑Middle interception, compromising confidentiality and integrity of HTTPS and other TLS‑protected transfers.

Scope caveats:
- Feature is compile‑time gated (`USE_APPLE_SECTRUST`) and off by default in CMake.
- Runtime reachability depends on backend conditions (OpenSSL “unable to get local issuer certificate” or GnuTLS “signer not found”).
- The bug only affects older Apple OS versions that lack `SecTrustEvaluateWithError`; modern Apple OS uses the correct code path.

## Timeline

- **Report Filed**
- **2025-10-07** @bagder: Thanks!

This is code not shipped in any release yet so by definition we don't count it as a security problem. I think it is better filed as a "normal bug".
- **2025-10-07** @giant_anteater: Ok, will include in a batch of normal bugs I will send over.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
