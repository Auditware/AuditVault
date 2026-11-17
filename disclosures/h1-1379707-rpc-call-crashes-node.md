---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2022-08-20
submitted: 2021-10-24T15:19:11.435Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/monero|Monero]]"
reporter: "xfang"
source: "https://hackerone.com/reports/1379707"
title: "RPC call crashes node"
---
# RPC call crashes node

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Monero | **Disclosed:** 2022-08-20

- Report: [https://hackerone.com/reports/1379707](https://hackerone.com/reports/1379707)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2021-10-24T15:19:11.435Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-10-24** @xfang: I will verify and update.
- **2021-10-24** @moneromooo: nvm, I got a stack from someone else, looks like unhandled OOM in library code, which *should* be fixed by restricting the DoS vector.
- **2021-10-24** @xfang: confirmed: 
`Oct 23 18:09:42 monero-check systemd[599]: vte-spawn-bca8968b-3c8e-44b4-a23d-297749dd004a.scope: A process of this unit has been killed by the OOM killer.`
- **2021-10-24** @xfang: By the way, follow-up attack vector will be to try to do repeated cache misses by randomly varying `start_height` and `amount` contents. I think it's for the best that any fix include mitigation for that, instead of having two back-to-back vulnerabilities on same function.
- **2021-10-24** @moneromooo: Fair point.
- **2021-10-24** @moneromooo: I'll PR this in a couple days, just before next release:
```
commit a919c0174a8396f4dae69b9bd427eb93e1c7b0f8
Author: moneromooo-monero <moneromooo-monero@users.noreply.github.com>
Date:   Sun Oct 24 16:49:11 2021 +0000

    rpc: fix DoS vector in get_output_distribution
    
    This will prevent people spending old pre-rct outputs using a a
    stranger's node, which may be a good thing

diff --git a/src/rpc/core_rpc_server.cpp b/src/rpc/core_rpc_server.cpp
index 5bfb3fea6..ad2d4c968 100644
--- a/src/rpc/core_rpc_server.cpp
+++ b/src/rpc/core_rpc_server.cpp
@@ -3007,6 +3007,14 @@ namespace cryptonote
     if (use_bootstrap_daemon_if_necessary<COMMAND_RPC_GET_OUTPUT_DISTRIBUTION>(invoke_http_mode::JON_RPC, "get_output_distribution", req, res, r))
       return r;
 
+    const bool restricted = m_restricted && ctx;
+    if (restricted && req.amounts != std::vector<uint64_t>(1, 0))
+    {
+      error_resp.code = CORE_RPC_ERROR_CODE_RESTRICTED;
+      error_resp.message = "Restricted RPC can only get output distribution for rct outputs. Use your own node.";
+      return false;
+    }
+
     size_t n_0 = 0, n_non0 = 0;
     for (uint64_t amount: req.amounts)
       if (amount) ++n_non0; else ++n_0;
@@ -3048,6 +3056,13 @@ namespace cryptonote
     if (use_bootstrap_daemon_if_necessary<COMMAND_RPC_GET_OUTPUT_DISTRIBUTION>(invoke_http_mode::BIN, "/get_output_distribution.bin", req, res, r))
       return r;
 
+    const bool restricted = m_restricted && ctx;
+    if (restricted && req.amounts != std::vector<uint64_t>(1, 0))
+    {
+      res.status = "Restricted RPC can only get output distribution for rct outputs. Use your own node.";
+      return false;
+    }
+
     size_t n_0 = 0, n_non0 = 0;
     for (uint64_t amount: req.amounts)
       if (amount) ++n_non0; else ++n_0;
```
- **2021-10-24** @xfang: Many thanks!
- **2021-10-24** @xfang: Since there's a point release coming very soon, I should mention that I'm pretty sure I know what caused the blue spikes in Justin's graphs: https://github.com/monero-project/research-lab/issues/86

I still have to collect the data and make my case, but I'm 90% sure I'm right, and that it represents a privacy leak. If you'd like my opinion informally, feel free to reach out. 

Sorry to hijack this issue. I would ordinarily just wait to put my case together, but it sounds like there might be a time crunch.
- **2021-10-24** @moneromooo: I've not followed that discussion. If you want, I think you can open a new H1 bug for it for now, and complement with your data later.
- **2021-10-24** @xfang: Sounds good.
- **2021-10-25** @xfang: I found this vulnerability while auditing havenprotocol code. I'm happy to contribute to upstream, and am eager to include a fix in Haven's impending release in the coming days
- **2021-11-26** @selsta: https://github.com/monero-project/monero/pull/8083
https://github.com/monero-project/monero/pull/8084
- **2021-12-07** @selsta: Thanks again for the report, this issue is now resolved in v0.17.3.0. I'll ping luigi for the bounty.

I'll also ask here, do you want to get credited in the release notes for this report?
- **2021-12-08** @xfang: Thank you. Yes, I would be pleased to be credited as xfang. I would also prefer list myself as a haven protocol community member. However, since this seems to upset some folks, I don’t mind you omitting the affiliation. People can figure it out on their own.
- **2021-12-08** @xfang: Thank you for crediting my affiliation. I felt it best to leave it to your discretion, and by your honoring my affiliation without being required to do so, we build goodwill.
- **2021-12-08** @xfang: I would very much appreciate if rather than sending to the above address, to use the address below instead

████

The previous address will still work, so there is no cause for concern, but this would be much preferred.

Thank you for being classy! Hopefully I find nothing else in the future, but in case I do, I look forward to working with you again.
- **2021-12-09** @selsta: The payout wasn't sent yet so the new address should be fine.

>  I look forward to working with you again

Great to hear and thanks again :)
- **2021-12-19** @luigi1111w: Sent 5 XMR: <75e453db88eb432c46592f047c0143c76f528b32d894f06f01ae3d9abe526b32>
- **Swag Awarded**
- **Report Resolved**
- **2021-12-20** @xfang: Thank you.
- **Agreed On Going Public**
- **2022-08-19** @xfang: Disclosure is OK if payment addresses are redacted.
- **2022-08-19** @selsta: Redacted the payment addresses.
- **Agreed On Going Public**
- **Report Became Public**
