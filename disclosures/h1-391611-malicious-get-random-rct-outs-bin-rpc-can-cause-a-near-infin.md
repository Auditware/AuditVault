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
body: true
date: 2018-09-28
submitted: 2018-08-07T21:32:40.904Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/monero|Monero]]"
reporter: "ahook"
source: "https://hackerone.com/reports/391611"
title: "Malicious get_random_rct_outs.bin rpc can cause a near-infinite loop"
---
# Malicious get_random_rct_outs.bin rpc can cause a near-infinite loop

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Monero | **Disclosed:** 2018-09-28

- Report: [https://hackerone.com/reports/391611](https://hackerone.com/reports/391611)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2018-08-07T21:32:40.904Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An unsanitized get_random_rct_outs.bin rpc request can cause the rpc handler to go into an effectively infinite-loop, peg the cpu, and block other requests from completing.

**Description:**
The rpc endpoint /get_random_rct_outs.bin takes a uint64 outs_count as input and will return that many random outputs:
https://github.com/monero-project/monero/blob/9315e12d34a58970b311133f98f2b3e651f0ceb3/src/rpc/core_rpc_server.cpp#L479

There is no sanitization of the req.outs_count input in this function. (Other similar functions make sure the client does not request too many outputs at once).

The function then calls into Blockchain::get_random_rct_outs to get the outputs, again with no checking of the range of req.outs_count:
https://github.com/monero-project/monero/blob/master/src/cryptonote_core/blockchain.cpp#L1848

A naive hacker could send something like MAX_UINT64 and this function will send back all valid outputs. As of testing, this was around 6mm outs and resulted in a response of around 500MB. This in itself is a nuisance, as it ties up the thread, pegs the cpu to 100%, and has to allocate a GB or so of memory. But the rpc will eventually complete in such a case.

A better attacker could take advantage of the triangular distribution applied to the random number generator:
https://github.com/monero-project/monero/blob/master/src/cryptonote_core/blockchain.cpp#L1900

This math makes it very unlikely to land on very low txn indexes. For example, based on some empirical evidence, in order to get the 0th index, the random number (mod 2^53) would need to be in the range [0-205]. If my math is right, the probability of landing on the 0th index would be roughly (2^8/2^53 + 2^8/2^11), which is extremely unlikely.

This function loops until it finds outs_count random txns. If an attacker sends an outs_count equal to (or very close to) the total valid outputs, it will attempt to loop until it randomly chooses all/most unique values between [0-num_outs), which will most likely never complete since the triangular distribution makes it extremely unlikely to land on the low indexes.

## Releases Affected:
This rpc was added years ago and hasn't changed much, so any current release is affected.

## Steps To Reproduce:
This can be triggered with a simple curl command. In the below example, a hex representation of a valid serialized request is sent to the target's endpoint as a binary post. Replace <target_host>:<target_port> with the target (e.g. localhost:18081). The last 8 bytes (16 hex chars) is the little-endian outs_count value.

When I was testing, a value of 6,772,629 (0x59557670000000000) was sufficiently close to num_outs to cause the daemon to go into an effectively infinite loop. This number changes as more txns are added to the chain, so the attacker would just need to operate their own node, or query a fully synced node in some way, in order to know the current num_outs to request.

```
$ # NOTE: piping the result to wc so it just displays the size of the output (if it ever returns)
$ echo "011101010101020101040a6f7574735f636f756e74059557670000000000" | xxd -r -p | curl -i -X POST --data-binary @- http://<target_host>:<target_port>/get_random_rctouts.bin | wc
```

## Impact

If monerod's rpc port is publicly open, an attacker can lock up the node by sending a malicious curl. CPU will spike to 100%. It also holds on to Blockchain::m_blockchain_lock, so any other requests that need that lock will stall (in some cases even the p2p port can become unresponsive as well but I'm not 100% sure in which scenarios that occurs).

I wasn't sure what to set the severity to for this bug. For a node with an open rpc port, I'd consider this critical. But not all nodes have the port open. A quick scan of 168 live nodes yielded 41 which had this port open and would be susceptible. So I think about 25% of the network would be affected as of right now.

## Timeline

- **Report Filed**
- **2018-08-07** @ahook: Update: the list of 168 nodes I checked were drawn from this guy's site: https://www.xmr.be/. Which on second look is limited only to "open" nodes, so that 25% is actually most likely something like 2.5%.
- **2018-08-13** @moneromooo: OK. Not critical since it is only a DoS that affects people who expose their RPC port to the world, though. I started added some rough sanity checks to some a while back, but that RPC's obsolete, so I guess I'll remove it.

I have a preliminary branch which requires the client to mine a certain amount based on the amount of work required (https://github.com/moneromooo-monero/bitmonero/commits/share-rpc) which will get rid of the actual DoS.
- **2018-08-14** @moneromooo: https://github.com/monero-project/monero/pull/4253

This might break the mymonero server, so if so it won't go in, and I'll just add a sanity check on the amount of outputs.
- **Report Triaged**
- **2018-08-14** @ahook: Cool, yeah, I think a simple sanity check on the outs_count should suffice.
- **Report Resolved**
- **2018-09-28** @ahook: Awesome, thanks!

44Yg7iSGmrqdow2XKhLWxDMF17JR6SmyHQkNzaeaCiYL2YpMhUcapJ6XvHR1S5Kj87bRoeCmrgTK2Lrn58XiPFSJHtPKgXe
- **2018-09-28** @luigi1111w: Sent 3 XMR: <a1de8a4db49b8e231c1da14304abb8ddfcbef61c6a1ae66e01e1c877b45b18e5>
- **Swag Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
