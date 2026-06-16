---
tags:
  - lang/rust
  - platform/auditware
  - severity/high
  - sector/infra
protocol: "[[Conduct]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[stale-price]]"
  - "[[wrong-state]]"
  - "[[timestamp-dependence]]"
---
# **AW-H-02: Reliance on Local System Time for Global Timestamp** {#aw-h-02:-reliance-on-local-system-time-for-global-timestamp}

**Severity:** *High*									**Status:** *Unmitigated*

**Code:**

* [crates/protocol/src/clock.rs\#L32-L37](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/clock.rs#L32-L37)

* [crates/protocol/src/production/block\_production.rs\#L75-L75](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/production/block_production.rs#L75-L75)

**Description:**  
The **global\_timestamp** function in **clock.rs** relies on the local system time to generate a global timestamp.

This timestamp is used in the block production process in **block\_production.rs**.

If the local system time changes unexpectedly or is manipulated, it can alter the global timestamp, affecting the timing of block production and potentially disrupting the entire blockchain's consensus mechanism.

**Recommendations:**

* Use a trusted time source, such as NTP (Network Time Protocol) servers, to obtain the current time.  
* Implement checks to detect significant deviations in the local system time and raise alerts or correct the time automatically.  
* Consider using a consensus-based approach to determine the current time across multiple nodes in the network.
