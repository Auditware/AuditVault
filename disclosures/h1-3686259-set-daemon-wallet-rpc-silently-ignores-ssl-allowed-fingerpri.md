---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
substate: "resolved"
weakness: "Improper Certificate Validation"
enriched: true
body: true
date: 2026-08-05
submitted: 2026-04-21T03:05:35.579Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/monero|Monero]]"
reporter: "benisprlh"
source: "https://hackerone.com/reports/3686259"
title: "`set_daemon` wallet-rpc silently ignores `ssl_allowed_fingerprints` → pinning bypassed, wallet↔daemon MITM"
---
# `set_daemon` wallet-rpc silently ignores `ssl_allowed_fingerprints` → pinning bypassed, wallet↔daemon MITM

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Monero | **Disclosed:** 2026-08-05

- Report: [https://hackerone.com/reports/3686259](https://hackerone.com/reports/3686259)
- CWE: Improper Certificate Validation
- Submitted: 2026-04-21T03:05:35.579Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Repository:** [`monero-project/monero`](https://github.com/monero-project/monero) — `src/wallet/wallet_rpc_server.cpp` (shared vulnerable code also reached via `contrib/epee/src/net_ssl.cpp`). Affected branches: `master` (commit `230de3794`), `release-v0.18`, `release-v0.17` (and every release since the RPC was introduced in commit `67aa4adcf`, March 2019).

## Summary

The `set_daemon` JSON-RPC in `monero-wallet-rpc` accepts an `ssl_allowed_fingerprints` array and is supposed to pin the daemon's TLS cert to the listed SHA-256 digests. The handler never hex-decodes those strings — it just copies each character into the fingerprint buffer as a byte. A normal 64-char hex fingerprint ends up stored as 64 bytes of ASCII instead of 32 bytes of raw digest. `has_fingerprint()` later compares the real 32-byte SHA-256 of the peer cert against those 64-byte blobs with `std::binary_search`, so the check can never succeed. Because the command's default `ssl_support` is `"autodetect"`, the verify callback turns "nothing matched" into a `MWARNING` and accepts the connection anyway. Pinning is silently discarded.

The sibling CLI flag `--daemon-ssl-allowed-fingerprints` on the exact same binary goes through `epee::from_hex_locale::to_vector` and enforces `SSL_FINGERPRINT_SIZE == 32`. So the two paths accept the same documented input format and produce opposite security outcomes.

Buggy block, `src/wallet/wallet_rpc_server.cpp` (current master `230de3794`):

```cpp
std::vector<std::vector<uint8_t>> ssl_allowed_fingerprints;
ssl_allowed_fingerprints.reserve(req.ssl_allowed_fingerprints.size());
for (const std::string &fp: req.ssl_allowed_fingerprints)
{
  ssl_allowed_fingerprints.push_back({});
  std::vector<uint8_t> &v = ssl_allowed_fingerprints.back();
  for (auto c: fp)
    v.push_back(c);
}
```

Correct block, `src/wallet/wallet2.cpp` (CLI startup):

```cpp
std::vector<std::vector<uint8_t>> ssl_allowed_fingerprints{ daemon_ssl_allowed_fingerprints.size() };
std::transform(daemon_ssl_allowed_fingerprints.begin(), daemon_ssl_allowed_fingerprints.end(),
               ssl_allowed_fingerprints.begin(), epee::from_hex_locale::to_vector);
for (const auto &fpr: ssl_allowed_fingerprints)
{
  THROW_WALLET_EXCEPTION_IF(fpr.size() != SSL_FINGERPRINT_SIZE, tools::error::wallet_internal_error,
      "SHA-256 fingerprint should be " BOOST_PP_STRINGIZE(SSL_FINGERPRINT_SIZE) " bytes long.");
}
```

The decisive check in `contrib/epee/src/net_ssl.cpp`:

```cpp
if (!verified && !has_fingerprint(ctx))
{
  if (support != ssl_support_t::e_ssl_support_autodetect)
  {
    MERROR("SSL certificate is not in the allowed list, connection dropped");
    return false;
  }
  MWARNING("SSL peer has not been verified");
}
return true;
```

With `autodetect` (the command's default in `wallet_rpc_server_commands_defs.h`: `KV_SERIALIZE_OPT(ssl_support, (std::string)"autodetect")`) the branch falls through to `return true` and the daemon's cert is accepted.

## Releases Affected

Every release since the `set_daemon` RPC was added in commit `67aa4adcf` (March 2019) — i.e. `v0.14.x` through `v0.18.x` and current `master @ 230de3794`. I checked `release-v0.17` and `release-v0.18` branches directly; the ASCII-copy block is byte-identical to master. The Ubuntu 22.04 `monero` package (`0.17.2.0`) also reproduces.

## Steps to Reproduce

I packaged the whole thing as a self-contained script (no `sudo` needed on Ubuntu 22.04, it uses `apt-get download` + `dpkg-deb -x` into `/tmp`):

```
./poc_set_daemon_pinning_bypass.sh
```

Run it with `bash ./poc_set_daemon_pinning_bypass.sh`.

What it does, briefly:

1. Pulls `monerod` and `monero-wallet-rpc` from the Ubuntu `monero` .deb into `/tmp/monero_extract`.
2. Generates two distinct self-signed certs, `real.crt` (fingerprint `$FP_REAL`) and `evil.crt` (fingerprint `$FP_EVIL`).
3. Starts two regtest daemons: real on `127.0.0.1:48080` with `real.crt`, evil on `127.0.0.1:49080` with `evil.crt`. Both in `--offline` mode so they cannot talk to each other.
4. Starts `monero-wallet-rpc`, creates a fresh wallet, and mines 5 blocks on the **evil** daemon only. Direct `get_block_count` now returns `1` on real and `6` on evil.
5. Pins the wallet to `$FP_REAL` and points it at the real daemon (baseline). `refresh` + `get_height` returns height 1. Good.
6. Calls `set_daemon` again to point the wallet at the **evil** daemon, keeping `ssl_allowed_fingerprints=[$FP_REAL]` and `ssl_support="autodetect"`. `refresh` returns:

   ```json
   {"result":{"blocks_fetched":5,"received_money":true}}
   ```

   and `get_height` returns `6`. The wallet, still "pinned" to the real fingerprint, just absorbed the evil daemon's chain. The only log trace is:

   ```
   WARNING  net.ssl  contrib/epee/src/net_ssl.cpp  SSL peer has not been verified
   ```

   No log line says the fingerprint list was malformed or ignored.

7. For contrast, the script restarts the same binary with the CLI flag instead:

   ```
   monero-wallet-rpc --daemon-address 127.0.0.1:49080 --daemon-ssl enabled \
                     --daemon-ssl-allowed-fingerprints "$FP_REAL"
   ```

   `refresh` now fails closed:

   ```json
   {"error":{"code":-38,"message":"no connection to daemon"}}
   ```

   with `SSL certificate is not in the allowed list, connection dropped` in the log. Same binary, same fingerprint, same daemon — the only difference is which decoder the operator's configuration went through.

If you prefer to do it by hand instead of via the script, the core five calls are:

```bash
FP_REAL=$(openssl x509 -noout -fingerprint -sha256 -in real.crt \
          | sed 's/.*=//' | tr -d ':' | tr '[:upper:]' '[:lower:]')

# baseline
curl -s http://127.0.0.1:48090/json_rpc -H 'Content-Type: application/json' -d "$(cat <<EOF
{"jsonrpc":"2.0","id":"0","method":"set_daemon","params":{
  "address":"127.0.0.1:48080","trusted":true,"ssl_support":"autodetect",
  "ssl_allowed_fingerprints":["$FP_REAL"]}}
EOF
)"

# bypass
curl -s http://127.0.0.1:48090/json_rpc -H 'Content-Type: application/json' -d "$(cat <<EOF
{"jsonrpc":"2.0","id":"0","method":"set_daemon","params":{
  "address":"127.0.0.1:49080","trusted":true,"ssl_support":"autodetect",
  "ssl_allowed_fingerprints":["$FP_REAL"]}}
EOF
)"

curl -s http://127.0.0.1:48090/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"refresh"}' -H 'Content-Type: application/json'
curl -s http://127.0.0.1:48090/json_rpc -d '{"jsonrpc":"2.0","id":"0","method":"get_height"}' -H 'Content-Type: application/json'
```
{F5770401}
## Possible Solution

Make the RPC handler do what the CLI path already does:

```cpp
std::vector<std::vector<uint8_t>> ssl_allowed_fingerprints;
ssl_allowed_fingerprints.reserve(req.ssl_allowed_fingerprints.size());
for (const std::string &fp : req.ssl_allowed_fingerprints)
{
  std::vector<uint8_t> decoded;
  try { decoded = epee::from_hex_locale::to_vector(fp); }
  catch (const std::exception &) {
    er.code = WALLET_RPC_ERROR_CODE_NO_DAEMON_CONNECTION;
    er.message = "ssl_allowed_fingerprints[] entries must be hex-encoded SHA-256";
    return false;
  }
  if (decoded.size() != SSL_FINGERPRINT_SIZE) {
    er.code = WALLET_RPC_ERROR_CODE_NO_DAEMON_CONNECTION;
    er.message = "Each fingerprint must decode to exactly 32 bytes";
    return false;
  }
  ssl_allowed_fingerprints.emplace_back(std::move(decoded));
}
```

A couple of defense-in-depth suggestions while you're there:

- The `ssl_options_t(std::vector<std::vector<uint8_t>>, std::string)` constructor in `contrib/epee/src/net_ssl.cpp` should also reject any entry whose size is not `SSL_FINGERPRINT_SIZE`. That would catch any future caller that forgets to hex-decode.
- `has_strong_verification()` currently only looks at the `verification` enum and happily says "strong" for a list of 1000 garbage entries. It should additionally require that every entry have `SSL_FINGERPRINT_SIZE` bytes.
- When `!fingerprints_.empty()` and `has_fingerprint()` returns false, log an `MERROR` that reports the sizes of the stored entries vs the computed digest. Right now an operator has no way to tell "server cert rotated" from "my pinning list was discarded".

## Impact

Anyone who uses `set_daemon` over RPC to pin their daemon's TLS cert (a standard automation pattern for exchanges, payment processors, and pool operators running wallet-rpc against a remote daemon) gets zero pinning. A network attacker between wallet and daemon can swap in any self-signed cert, complete the handshake and MITM the channel: daemon HTTP digest credentials, `/get_outs` and key-image-spent queries, decoy-ring responses used during tx construction, signed transactions submitted for relay, `/start_mining` control payloads. The operator's log shows nothing beyond the same `SSL peer has not been verified` line that you'd get from any `autodetect` connection — so you can't even tell from the log that pinning silently died.

## Note

The proof-of-concept script in `./reports/poc_set_daemon_pinning_bypass.sh` was written with AI assistance to speed up the reproduction scaffolding (cert generation, daemon lifecycle, JSON-RPC plumbing). The vulnerable code path, line references, and manual verification against `release-v0.17`, `release-v0.18`, and `master @ 230de3794` are mine.

## Bounty

If this qualifies for a payout, XMR can be sent to:

`45BYNkdWvv45fovzeSgnNdMcZ8Pn9bdnegRyDcggz9XBUbrrgDhwfx63rpvesZMwWEKKQFms81v8hPbCX2eSCb3m9nFk9ZX`

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Triaged**
- **2026-04-22** @benisprlh: Thank you for triaging the report and for the swift action on PR #10432 — I appreciate the transparency throughout the process.

I wanted to ask about the bounty pool status. The forum page (forum.getmonero.org/8/funding-required/87597) appears blank when I visit it, so I was unable to verify whether funds are currently available. Could you confirm the current status of the pool?

Thank you for your time.
- **2026-04-22** @selsta: The forum had to be taken down due to the forum software being unmaintained and full of vulnerabilities. I don't know the current pool, I'd guess around 700 XMR.

I classified this report as "low severity" due to it being "is not easily exploitable or is low impact". Programmatically setting daemon connection is rarely used with wallet rpc, and fingerprint is even more rare. The impact of MITM wallet <-> daemon connection is also limited.
- **External User Joined**
- **2026-05-08** @luigi1111w: Sent 0.5 XMR: 0fee1d0484f80327f6ba919d244ccac30f5385ba82050ef90cc309c60e2544ee
- **2026-05-08** @benisprlh: Thanks for the bounty!
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
