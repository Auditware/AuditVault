---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
  - sector/stable
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# DoS attack exhausting account space and halting spot trading

- id: 64507
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


This bug report describes a problem where an attacker can exploit a temporary spot client ID allocation system to cause a denial of service (DoS) condition. The system reserves space in two accounts but does not deallocate it when orders are created. This can lead to a gradual exhaustion of memory space, preventing legitimate users from operating normally. The bug has been fixed in the latest version of the software.

## Details

**Description:** The temporary spot client ID allocation system reserves space in both `client_infos_acc` and `client_infos2_acc` accounts when orders are created, but deallocation only occurs when specific cleanup functions are invoked. An attacker can exploit this by creating many small orders and avoiding cleanup paths, gradually exhausting available account space and causing a DoS condition.

**Attack Vector**: An attacker can create numerous small limit orders across multiple accounts, never invoke `move_spot_avail_funds`, and avoid any actions that would trigger `finalize_spot`. As a result, each temporary client ID remains allocated indefinitely. Over time, this leads to progressive exhaustion of memory space in both the `client_infos_acc` and `client_infos2_acc` accounts, preventing legitimate users from operating normally.

A Solana account has a maximum storage limit of a 10 megabytes. Based on the size of `SPOT_CLIENT_INFO_SIZE`(32 bytes), the `client_infos_acc`  and `client_infos2_acc` account can store approximately 312,500 entries. For an instrument such as XY/USDC, where the asset XY is priced at 1 USDC, a user would need to place an order of at minimum 2 XY tokens to create a single temporary client ID. To reach the full 312,500 allocations, the attacker would theoretically need 2 × 312,500 tokens.

**Impact:** It can cause a DoS of the spot functionality, but it would require the attacker to have sufficient funds to execute the attack.

**Recommended Mitigation:** Deallocate the space as soon as the user’s last order has been executed, or provide a dedicated deallocation mechanism that allows `finalize_spot` to be invoked for users when needed.

**Deriverse:** Fixed in commit [e0773a](https://github.com/deriverse/protocol-v1/commit/e0773a57954df33113befd2c2a93bc6f5c4192b6), [105e46](https://github.com/deriverse/protocol-v1/commit/105e463b8ae3aac6440959441c356975f14670bc).

**Cyfrin:** Verified.
