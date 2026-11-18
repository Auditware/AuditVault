---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-of-cryptographically-weak-pseudo-random-number-generator
  - env/web
  - stack/node
substate: "resolved"
weakness: "Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG)"
enriched: true
body: true
date: 2022-10-26
submitted: 2022-09-02T19:03:49.776Z
bounty_usd: null
votes: 11
cve: "CVE-2022-35255"
program: "[[programs/nodejs|Node.js]]"
reporter: "bnoordhuis"
source: "https://hackerone.com/reports/1690000"
title: "Weak randomness in WebCrypto keygen"
---
# Weak randomness in WebCrypto keygen

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js | **Disclosed:** 2022-10-26

- Report: [https://hackerone.com/reports/1690000](https://hackerone.com/reports/1690000)
- CWE: Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG) | CVE: CVE-2022-35255
- Submitted: 2022-09-02T19:03:49.776Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

https://github.com/nodejs/node/pull/35093 introduced a call to `EntropySource()` in `SecretKeyGenTraits::DoKeyGen()` in `src/crypto/crypto_keygen.cc`. There are two problems with this:

1. It does not check the return value, it assumes `EntropySource()` always succeeds, but it can (and sometimes will) fail.

2. The random data returned by`EntropySource()` may not be cryptographically strong and therefore not suitable as keying material.

An example is a freshly booted system or a system without `/dev/random` or `getrandom(2)`.

## Impact

`EntropySource()` calls out to openssl's `RAND_poll()` and `RAND_bytes()` in a best-effort attempt to obtain random data.

OpenSSL has a built-in CSPRNG but that can fail to initialize, in which case it's possible either:

1. No random data gets written to the output buffer, i.e., the output is unmodified, or

2. Weak random data is written. It's theoretically possible for the output to be fully predictable because the CSPRNG starts from a predictable state.

The output buffer is allocated in `SecretKeyGenTraits::DoKeyGen()` using `OPENSSL_malloc()` (alias for `CRYPTO_malloc()`), which in turn calls `malloc()`.

`malloc()` does not zero the buffer but its contents may be predicted or manipulated by an external attacker, e.g. by manipulating an arraybuffer, then forcing the GC to reclaim it.

Users can override the CSPRNG (and do) so there are probably more failure modes. A buggy CSPRNG could write out only zeroes, for example, comparable to (2).

I have a (trivial!) patch available. H1 gives this a really high CVSS score but I suppose that's appropriate when the worst case failure mode is a complete breakdown of confidentiality and integrity.

## Timeline

- **Report Filed**
- **2022-09-02** @bnoordhuis: Forgot to add, this change was introduced in commit https://github.com/nodejs/node/commit/dae283d96f from August 2020 and seems to affect all releases starting with v15.0.0.
- **Report Triaged**
- **2022-09-02** @tniessen: Coincidentally, I was going to create a public PR addressing this as a follow-up to [#44479](https://github.com/nodejs/node/pull/44479) and [#44493](https://github.com/nodejs/node/pull/44493), but I think it's fair to treat this as a vulnerability. Once these two PRs are merged, checking the return value of `EntropySource` and returning `KeyGenJobStatus::FAILED` should be sufficient, I think. In the long term, I was going to remove calls to `EntropySource` altogether.
- **2022-09-02** @bnoordhuis: Of course! I spotted another instance of the same bug in `RandomBytesTraits::DeriveBits()`.

This patch conflicts with https://github.com/nodejs/node/pull/44493 (which was the lead that put me on the trail.)
```diff
diff --git a/src/crypto/crypto_keygen.cc b/src/crypto/crypto_keygen.cc
index af489967144..57eeff6aef6 100644
--- a/src/crypto/crypto_keygen.cc
+++ b/src/crypto/crypto_keygen.cc
@@ -81,8 +81,10 @@ KeyGenJobStatus SecretKeyGenTraits::DoKeyGen(
     SecretKeyGenConfig* params) {
   CHECK_LE(params->length, INT_MAX);
   params->out = MallocOpenSSL<char>(params->length);
-  EntropySource(reinterpret_cast<unsigned char*>(params->out), params->length);
-  return KeyGenJobStatus::OK;
+  unsigned char* out = reinterpret_cast<unsigned char*>(params->out);
+  if (EntropySource(out, params->length))
+    return KeyGenJobStatus::OK;
+  return KeyGenJobStatus::FAILED;
 }
 
 Maybe<bool> SecretKeyGenTraits::EncodeKey(
diff --git a/src/crypto/crypto_random.cc b/src/crypto/crypto_random.cc
index d0736a9cf12..504ddbdcbea 100644
--- a/src/crypto/crypto_random.cc
+++ b/src/crypto/crypto_random.cc
@@ -66,8 +66,7 @@ bool RandomBytesTraits::DeriveBits(
     Environment* env,
     const RandomBytesConfig& params,
     ByteSource* unused) {
-  CheckEntropy();  // Ensure that OpenSSL's PRNG is properly seeded.
-  return RAND_bytes(params.buffer, params.size) != 0;
+  return EntropySource(params.buffer, params.size);
 }
 
 void RandomPrimeConfig::MemoryInfo(MemoryTracker* tracker) const {
diff --git a/src/crypto/crypto_util.cc b/src/crypto/crypto_util.cc
index 324dd11e301..6ed0814f015 100644
--- a/src/crypto/crypto_util.cc
+++ b/src/crypto/crypto_util.cc
@@ -76,10 +76,8 @@ void CheckEntropy() {
 bool EntropySource(unsigned char* buffer, size_t length) {
   // Ensure that OpenSSL's PRNG is properly seeded.
   CheckEntropy();
-  // RAND_bytes() can return 0 to indicate that the entropy data is not truly
-  // random. That's okay, it's still better than V8's stock source of entropy,
-  // which is /dev/urandom on UNIX platforms and the current time on Windows.
-  return RAND_bytes(buffer, length) != -1;
+  // Return true only when the data is suitable for cryptographic purposes.
+  return RAND_bytes(buffer, length) == 1;
 }
 
 int PasswordCallback(char* buf, int size, int rwflag, void* u) {
diff --git a/src/crypto/crypto_util.h b/src/crypto/crypto_util.h
index 4afae1884fe..5353cb71817 100644
--- a/src/crypto/crypto_util.h
+++ b/src/crypto/crypto_util.h
@@ -133,8 +133,8 @@ struct MarkPopErrorOnReturn {
 // do anything about.
 void CheckEntropy();
 
-// Generate length bytes of random data. If this returns false, the data
-// may not be truly random but it's still generally good enough.
+// Generate |length| bytes of random data. If this returns false,
+// the data is not suitable for cryptographic purposes.
 bool EntropySource(unsigned char* buffer, size_t length);
 
 int PasswordCallback(char* buf, int size, int rwflag, void* u);
```
- **2022-09-02** @bnoordhuis: Oops, sorry Tobias, missed your comment. Yes, I think it'd be good to eventually get rid of `EntropySource()` because it's clearly easy to misuse (but sadly so are direct `RAND_bytes()` calls...)
- **2022-09-04** @mcollina: Should we include this in the upcoming security release? @tniessen @bnoordhuis would you mind doing a PR against node-private?
- **2022-09-04** @bnoordhuis: Can do if you add me.
- **2022-09-04** @trott: > Can do if you add me.

https://github.com/nodejs/TSC/issues/1278
- **2022-09-11** @bnoordhuis: https://github.com/nodejs-private/node-private/pull/346
- **2022-09-12** @vdeturckheim: @bnoordhuis should I credit you on the blogpost for this one? :)
- **2022-09-13** @bnoordhuis: Yes, please. I'll take my bug bounty in gold Kruger rands if you don't mind.

(I kid, I kid. Can I suggest donating it to the GiveWell Foundation, their malaria programs in particular?)
- **2022-09-13** @mcollina: Unfortunately we can't claim the bounty ourselves. You'd need to claim yourself and then send it to the GiveWell Foundation.
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
