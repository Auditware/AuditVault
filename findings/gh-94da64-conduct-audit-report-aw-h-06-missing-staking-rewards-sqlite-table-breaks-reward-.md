---
tags:
  - lang/rust
  - platform/auditware
  - severity/high
  - sector/staking
protocol: "[[Conduct]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[missing-check]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# **AW-H-06: Missing Staking Rewards SQLite Table Breaks Reward Functionality** {#aw-h-06:-missing-staking-rewards-sqlite-table-breaks-reward-functionality}

**Severity:** *High*									**Status:** *Unmitigated*

**Code:**

* [crates/protocol/src/db/blockchain.rs\#L105-L105](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/db/blockchain.rs#L105-L105) 

**Description:**  
The following functions:

* **init\_staker\_rewards**  
* **shift\_staker\_fee\_reward**  
* **remove\_staker**  
* **exit\_staker**  
* **unexit\_staker**  
* **shift\_staker\_accumulated\_fees**  
* **get\_staker\_rewards**

attempt to read from or write staking reward data to the **staker\_rewards** table. However, the **staker\_rewards** table has not been created in the database initialization process, which will cause these functions to fail.

Triggering these functions will cause the application to fail or behave unexpectedly, potentially leading to data inconsistency or denial of service on the staking rewards protocol.

**Recommendations:**

* Add the creation of the **staker\_rewards** table to the database initialization process.
