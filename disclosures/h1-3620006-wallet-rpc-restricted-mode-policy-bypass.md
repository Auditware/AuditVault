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
date: 2026-08-17
submitted: 2026-03-21T15:56:06.239Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/monero|Monero]]"
reporter: "usagirabbit"
source: "https://hackerone.com/reports/3620006"
title: "Wallet RPC Restricted-Mode Policy Bypass"
---
# Wallet RPC Restricted-Mode Policy Bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** Monero | **Disclosed:** 2026-08-17

- Report: [https://hackerone.com/reports/3620006](https://hackerone.com/reports/3620006)
- CWE: Improper Authentication - Generic
- Submitted: 2026-03-21T15:56:06.239Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **2026-03-22** @usagirabbit: Forgot to add, if bounty is paid out please use this address: 46Xi9JyEnEjYDuBWYrWNo8MLKyQ1BiL1VbFMJoZkrL2w8ZABc7ALQoyRspCgnkQKbwgPuM6wJEqoCF7U1Cpxo5981Uhr8TN
- **2026-03-23** @selsta: Could you please confirm if this fixes your reported issue?

https://github.com/monero-project/monero/pull/10378
- **2026-03-23** @usagirabbit: @selsta getting home in a hour, i’ll review then :)
- **2026-03-23** @usagirabbit: PR #10378 looks like a partial fix for the monero-wallet-rpc --restricted-rpc bypass, not a complete one.

  It does fix a large part of the surface I validated. The raw diff
  adds a restricted-mode check helper and applies it to handlers
  like src/wallet/wallet_rpc_server.cpp:706, src/wallet/
  wallet_rpc_server.cpp:732, src/wallet/wallet_rpc_server.cpp:950,
  src/wallet/wallet_rpc_server.cpp:2640, src/wallet/
  wallet_rpc_server.cpp:3148, src/wallet/
  wallet_rpc_server.cpp:3535, src/wallet/
  wallet_rpc_server.cpp:3592, src/wallet/
  wallet_rpc_server.cpp:3685, src/wallet/
  wallet_rpc_server.cpp:3756, src/wallet/
  wallet_rpc_server.cpp:3895, and src/wallet/
  wallet_rpc_server.cpp:4087. That covers the create/open/close/
  restore wallet paths, subaddress/account mutation, get_tx_key,
  export_key_images, and mining control.

  But it does not touch the proof and relay handlers that were also
  part of the bug surface I reviewed. The PR diff does not modify
  src/wallet/wallet_rpc_server.cpp:1918, src/wallet/
  wallet_rpc_server.cpp:2732, src/wallet/
  wallet_rpc_server.cpp:2799, or src/wallet/
  wallet_rpc_server.cpp:2849. So if your bug definition includes
  get_tx_proof, get_spend_proof, get_reserve_proof, and relay_tx,
  then #10378 is incomplete.
- **2026-03-24** @selsta: Could you please explain why get_tx_proof, get_spend_proof, get_reserve_proof, and relay_tx should be added?
- **2026-03-24** @usagirabbit: I have changed my mind, that’s not a good idea to add those 4 to the blocklist
- **2026-04-03** @usagirabbit: any updates?
- **2026-04-03** @selsta: You can follow progress on the linked GitHub pull request.
- **2026-04-08** @selsta: We have decided to unrestrict `get_tx_key` based on the argument here: https://github.com/monero-project/monero/pull/10378#issuecomment-4189043737
- **2026-04-19** @luigi1111w: Sent 0.5 XMR: dcebfaa2f60b27f8efa92ce02663dea70f9e8522d35a2b285c9881e42c811897
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
