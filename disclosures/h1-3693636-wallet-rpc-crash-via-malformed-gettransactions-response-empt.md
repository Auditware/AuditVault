---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/null-pointer-dereference
  - env/web
  - vuln/path-traversal
  - vuln/code-injection
  - vuln/dos
  - vuln/misconfiguration
  - impact/rce
substate: "resolved"
weakness: "NULL Pointer Dereference"
enriched: true
body: true
date: 2026-08-05
submitted: 2026-04-24T16:08:57.050Z
bounty_usd: null
votes: 44
cve: []
program: "[[programs/monero|Monero]]"
reporter: "bebensap"
source: "https://hackerone.com/reports/3693636"
title: "wallet-rpc crash via malformed /gettransactions response (empty txs → vector::front() in check_tx_key / check_tx_proof)"
---
# wallet-rpc crash via malformed /gettransactions response (empty txs → vector::front() in check_tx_key / check_tx_proof)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 44 | **Program:** Monero | **Disclosed:** 2026-08-05

- Report: [https://hackerone.com/reports/3693636](https://hackerone.com/reports/3693636)
- CWE: NULL Pointer Dereference
- Submitted: 2026-04-24T16:08:57.050Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Repository:** [`monero-project/monero`](https://github.com/monero-project/monero) — `src/wallet/wallet2.cpp` (same response type `COMMAND_RPC_GET_TRANSACTIONS` in `src/rpc/core_rpc_server_commands_defs.h`). Affected branch: `master` (commit `474657ad4`, 2026-04-24).

## Summary

`wallet2` calls the daemon HTTP endpoint `/gettransactions` and treats the answer as trustworthy enough to drive payment verification. The guard only insists that **either** the structured array `txs` **or** the legacy array `txs_as_hex` has length 1:

```cpp
THROW_WALLET_EXCEPTION_IF(!ok || (res.txs.size() != 1 && res.txs_as_hex.size() != 1),
  error::wallet_internal_error, "Failed to get transaction from daemon");
```

If the daemon (or anything on the HTTP path) returns `status: OK`, `txs: []`, and a single blob in `txs_as_hex` whose hash matches the requested txid, the code takes the `else` branch, parses the transaction from hex, runs the crypto checks, then still pulls **pool height and confirmation metadata** from `res.txs.front()` — even though `txs` was empty the whole time. That is undefined behaviour in C++ (`std::vector::front()` on an empty vector). On a normal Release build you usually get an immediate segfault; with ASan you get a clean `vector::front` report.

The same pattern exists in `check_tx_proof` after the identical guard and `if (res.txs.size() == 1) / else` split.

There is a second, narrower footgun on the **cold hardware** `get_tx_key` path: after the same `(txs XOR txs_as_hex)` guard, the code **always** loads the blob from `res.txs_as_hex.front()` (see snippet below) and never branches on `res.txs.size() == 1` first. A response with `txs` populated and `txs_as_hex` empty passes the guard when `txs.size()==1`, but then `txs_as_hex.front()` is the one that blows up. That is a different corner case from the main `check_tx_key` crash, same root cause class: the wallet assumes the two representations stay in sync.

`check_tx_key_helper` (txid overload), current `master`:

```cpp
void wallet2::check_tx_key_helper(const crypto::hash &txid, const crypto::key_derivation &derivation, ...)
{
  ...
  ok = epee::net_utils::invoke_http_json("/gettransactions", req, res, *m_http_client);
  THROW_WALLET_EXCEPTION_IF(!ok || (res.txs.size() != 1 && res.txs_as_hex.size() != 1),
    error::wallet_internal_error, "Failed to get transaction from daemon");

  if (res.txs.size() == 1)
    ok = get_pruned_tx(res.txs.front(), tx, tx_hash);
  else {
    ok = string_tools::parse_hexstr_to_binbuff(res.txs_as_hex.front(), tx_data);
    ...
    tx_hash = cryptonote::get_transaction_hash(tx);
  }
  ...
  check_tx_key_helper(tx, derivation, additional_derivations, address, received);

  in_pool = res.txs.front().in_pool;   // ← txs may still be empty
  ...
}
```

`check_tx_proof` (txid overload), same file — same bug after `check_tx_proof(tx, ...)`:

```cpp
  if (!check_tx_proof(tx, address, is_subaddress, message, sig_str, received))
    return false;

  in_pool = res.txs.front().in_pool;
  ...
  if (err.empty())
    confirmations = bc_height - res.txs.front().block_height;
```

Cold `get_tx_key` when `tx_prefix_hash` has to be filled from the daemon:

```cpp
    THROW_WALLET_EXCEPTION_IF(!ok || (res.txs.size() != 1 && res.txs_as_hex.size() != 1),
                                error::wallet_internal_error, "Failed to get transaction from daemon");
    ...
    bool ok = string_tools::parse_hexstr_to_binbuff(res.txs_as_hex.front(), tx_data);
```

This is **not** the same issue as `./reports/critical-wallet-check-tx-proof-is-out-to-acc-oob-and-uninit-derivation.md` (proof math / `is_out_to_acc` / derivation). That report is about bogus proof *content*; here the wallet dies on bogus *envelope* shape before you get a clean error string.

## Releases Affected

`master @ 474657ad4` (2026-04-24) still contains the snippets above. The guard and the `front()` uses have been this way for a long time; any release that ships the current `wallet2` `/gettransactions` integration is exposed. Severity for bounty triage is usually capped where the attacker already sits on the wallet→daemon HTTP leg (malicious remote node, MITM on cleartext HTTP, broken reverse proxy). There is no RCE claim here — process death / UB only.

## Steps to Reproduce

**Prerequisites — build once (same dependency set as the rest of the Monero tree; roughly an hour on a typical Linux box):**

```bash
sudo apt-get install -y build-essential cmake pkg-config libssl-dev \
  libzmq3-dev libunbound-dev libminiupnpc-dev libboost-all-dev \
  libhidapi-dev libusb-1.0-0-dev

export MONERO_SRC="$HOME/src/monero"    # or wherever you cloned github.com/monero-project/monero
cd "$MONERO_SRC"
git checkout master && git pull --ff-only origin master

mkdir -p build/release && cd build/release
cmake -D CMAKE_BUILD_TYPE=Release -D BUILD_TESTS=OFF ../..
make -j"$(nproc)" monerod monero-wallet-rpc
# Binaries: $MONERO_SRC/build/release/bin/monerod
#           $MONERO_SRC/build/release/bin/monero-wallet-rpc
```

Copy (or symlink) the two PoC files from your checkout root into the same tree if they are not already there:

- `./reports/poc_proxy_malicious_gettransactions.py`
- `./reports/poc_gettransactions_empty_txs_crash.sh`

The shell script looks for `monerod` / `monero-wallet-rpc` in `build/release/bin` under the repo that contains the `reports/` directory, or you can point it anywhere with:

```bash
export MONERO_BIN="$MONERO_SRC/build/release/bin"
```

**Run (~1–2 min, regtest only, no public network):**

```bash
cd "$MONERO_SRC"    # repo root that contains ./reports/
bash ./reports/poc_gettransactions_empty_txs_crash.sh
```

What it does, in order:

1. Starts `monerod --regtest --fixed-difficulty 1` on a loopback RPC port (default `38081` in the script).
2. Starts `monero-wallet-rpc`, `create_wallet`, mines a short chain, does a self-`transfer` with `get_tx_key` so we have a real `txid` / `tx_key` / address triplet.
3. Calls the **real** daemon `/gettransactions` with `prune:false`, `split:false` and pulls the full tx hex blob (what a honest node would return in `txs_as_hex`).
4. Starts the Python MITM on `127.0.0.1:47147` (override with `PROXY_PORT` if that port is busy). The proxy forwards everything to the real `monerod` except: for `POST /gettransactions` bodies that list the target txid in `txs_hashes`, it returns HTTP 200 JSON with `status:"OK"`, `txs:[]`, `txs_as_hex:[<captured hex>]`, `missed_tx:[]`.
5. Restarts `monero-wallet-rpc` with `--daemon-address http://127.0.0.1:$PROXY_PORT` and `--daemon-ssl disabled`, reloads the same wallet, then issues `set_daemon` (same URL, ssl disabled) so the HTTP client does a clean reconnect after the heavy refresh — otherwise the epee client occasionally thinks it is still connected when the TCP session is already half-dead and the PoC fails before the hijacked body is applied.
6. Calls `check_tx_key` over wallet JSON-RPC. The wallet parses the blob, matches `tx_hash == txid`, then hits `res.txs.front()`.

**Expected output (abridged):**

- `monero-wallet-rpc` dies with **signal 11** (`Segmentation fault`) on the `check_tx_key` call.
- The curl client shows **`curl: (52) Empty reply from server`** because the RPC worker process is gone mid-request.
- Proxy log shows one `POST /gettransactions` `200` and a stderr line similar to:
  - `[poc-proxy] HIJACK /gettransactions → txs=[], txs_as_hex=len=<N>`

{F5794759}

{F5794760}
**Lab-only transport detail (not part of the security bug):** the PoC proxy adds `Connection: close` on every response. Without that, Python's default HTTP server behaviour combined with epee's post-response handling can leave the wallet thinking the socket is still up after the server closed it, so the next `/gettransactions` fails before you reach the malicious branch. Production MITMs usually speak proper HTTP/1.1; this is scaffolding hygiene.

If you prefer not to use the script, the shape you need is:

1. Honest `/gettransactions` once to capture the canonical hex for txid `T`.
2. MITM wallet→daemon HTTP; on `POST /gettransactions` when the JSON body contains `"txs_hashes":["<T>..."]`, respond with `{"status":"OK","untrusted":false,"credits":0,"top_hash":"","txs":[],"txs_as_hex":["<hex>"],"missed_tx":[]}` (plus `Connection: close` if your server drops the socket aggressively).
3. `monero-wallet-rpc` → `check_tx_key` with that `T` and the real `tx_key` / address from the wallet that created the tx.

## Possible Solution

1. After `/gettransactions`, if you need `in_pool`, `block_height`, or `confirmations` from `COMMAND_RPC_GET_TRANSACTIONS::entry`, require **`res.txs.size() == 1`** and treat any other combination as `wallet_internal_error` with a clear message — or re-query the daemon using a response contract that always includes structured metadata.

2. Split metadata extraction to mirror the branch that actually supplied the blob (`txs.front()` vs synthesizing defaults when only legacy hex is present).

3. Cold `get_tx_key`: mirror the `if (res.txs.size()==1) get_pruned_tx else parse txs_as_hex` structure; do not assume `txs_as_hex` is non-empty whenever `txs` has an entry.

4. Add deserialization / integration tests for `(txs empty, txs_as_hex len 1)` and `(txs len 1, txs_as_hex empty)` so this cannot regress silently. Issue [#8311](https://github.com/monero-project/monero/issues/8311) is a good reminder that real daemons have returned odd shapes before; the wallet should fail closed, not UB.

## Impact

Anyone who points a wallet at a node they do not fully trust over **cleartext HTTP**, or who sits behind a misconfigured TLS-terminating proxy, can have `check_tx_key` or `check_tx_proof` turned into a hard crash of `monero-wallet-rpc` (or the CLI wallet process) with a single crafted `/gettransactions` response. That is a straight availability hit on payment verification and any automation that wraps these RPCs.

No remote code execution is demonstrated; the failure mode observed in testing is SIGSEGV on `vector::front`.

## Note

The end-to-end shell + Python MITM (`poc_gettransactions_empty_txs_crash.sh`, `poc_proxy_malicious_gettransactions.py`) was put together with editor/AI help for the regtest plumbing and the HTTP keep-alive workaround. The vulnerable control flow and line references were checked against `master` by reading `wallet2.cpp` directly.

## Bounty

If this qualifies for a payout, XMR can be sent to:

`47TUANy82gtBFMvsFwyA3hE98PzgKSmxNia3n9fpvSadDWs234M7oWfevXqYxKmy3d9hSp1TH82gX4JWvNEUupse2s92maV`

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Triaged**
- **2026-04-24** @bebensap: Yes — this patch fixes the reported crash/undefined behavior by requiring res.txs.size() == 1 before using res.txs.front() in check_tx_key (via check_tx_key_helper), get_tx_proof, and the txid-based check_tx_proof path, so the malicious shape txs: [] with a valid blob only in txs_as_hex no longer reaches an empty-vector front().

It achieves that by dropping the previous dual-path parsing (txs vs txs_as_hex); as a result, legacy txs_as_hex-only responses are no longer accepted on those code paths, which should be confirmed against current daemon behaviour and any supported compatibility expectations.

The cold get_tx_key path is still inconsistent with the stricter sites: it continues to depend on top-level txs_as_hex and does not add a structured-res.txs[0] fallback when that array is populated but txs_as_hex is empty (so it avoids the old UB there by failing closed, but is not as complete as it could be). Separately, the added bc_height > res.txs.front().block_height guard in check_tx_proof addresses confirmation underflow and is unrelated to the empty-txs front() issue.
- **2026-04-24** @selsta: https://github.com/monero-project/monero/pull/10454

I removed all references to txs_as_hex as every single node supports regular txs. Also yes, the underflow check is unrelated but it was missing and I was already changing those functions anyway.
- **2026-04-24** @bebensap: Sounds good. Dropping txs_as_hex is fine if everything still talks the structured txs shape. Thanks for the underflow fix too.
- **2026-04-24** @bebensap: Hi, I wanted to follow up on one point from the fix.

In my confirmation comment, I noted that the bc_height > res.txs.front().block_height guard addresses a confirmation underflow issue — and you acknowledged it was unrelated to the empty-txs front() crash I originally reported.

Since this is a distinct bug (integer underflow in confirmations calculation vs. UB from empty vector access), I'd like to ask: will it be considered for a separate additional bounty reward, or will the entire report be treated as a single payout?

Happy to open a dedicated report for it if that would help with triage. Thanks again for the quick turnaround on the fix.
- **2026-04-24** @selsta: The underflow issue isn't something that was pointed out in your original report and it's also not something that would be eligible for a bounty anyway since from what I can tell it can't cause a crash.
- **2026-04-24** @bebensap: Understood, thanks for the clarification!
- **2026-05-08** @luigi1111w: Sent 0.5 XMR: 0a0dbd87437dd8ab044e481813a2eacece487bc38cd273c9bce76cd1317aa8a0
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
