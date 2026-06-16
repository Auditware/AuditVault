---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/governance
  - sector/options
protocol: "[[XDAO]]"
auditors:
  - "[[István Böhm]]"
report: "https://certificate.quantstamp.com/full/xdao/2670863d-2e1c-42e6-a15c-5572dd4fef85/index.html"
genome:
  - "[[centralization]]"
  - "[[ownership-takeover]]"
  - "[[quorum-supply-drift]]"
---
# Governance Takeover via Unrestricted `elections_master` Deployment

- id: 61875
- impact: HIGH
- protocol: [[XDAO]]
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/xdao/2670863d-2e1c-42e6-a15c-5572dd4fef85/index.html

## Summary


The report discusses a bug in the code that allows an attacker to bypass governance controls and execute arbitrary actions on the protocol. The bug is caused by the `make_action()` function in the `master` contract not verifying that the `elections_master` contract was deployed through the legitimate `create_elections()` flow. To fix this, the team suggests implementing one of two options - either using a centralized dict to store all legitimate `elections_master` addresses, or implementing a specific initialization phase in the `elections_master` contract. The second option is more scalable but has a side effect of invalidating outdated contracts. The bug has been fixed in commit `745f983f3` and the team recommends adding code comments to explain the changes for future maintenance. 

## Details

**Update**
The team fixed the issue in commit `745f983f3`. The fix uses a tweaked approach based on recommendation option 2. It introduces the `op::init` operation and a "nonce" that acts both as an `is_initialized` flag and as a possible reference to the cell holding the initialization data. The `op::init` operation compares the provided data with the cell referenced by the "nonce" and flags the nonce reference as `false`, effectively nullifying the "nonce" field since it is a "maybe reference cell".

Since the approach might be non-intuitive, we recommend adding code comments to explain the intention, which will aid future maintenance.

Addressed in: `745f983f3d51688557ea047f8ce3cdb026c7290a`.

**File(s) affected:**`contracts/master.fc`, `contracts/elections_master.fc`

**Description:** The `make_action()` function in the `master` contract recalculates the expected `elections_master` address from input parameters but does not verify that the contract was deployed through the legitimate `create_elections()` flow. An attacker can independently deploy a malicious `elections_master` with a low vote threshold, satisfy it, and invoke `make_action()`, bypassing DAO governance controls and executing arbitrary actions (including contract upgrades).

**Exploit Scenario:**

1.   Attacker deploys `elections_master` independently with `success_amount = 1`.
2.   Attacker casts one vote to immediately reach quorum.
3.   Malicious contract calls `make_action()` on `master`.
4.   `master` validates only the reconstructed address and executes the attacker’s chosen governance action, allowing protocol takeover.

**Recommendation:** There are some possible directions, please consider implementing one of the following:

1.   Have a centralized dict that stores all `elections_master` addresses that are deployed through the `create_elections()` function in the `master` contract. This will require a garbage cleaning mechanism that removes expired `elections_master` addresses from the dict to avoid reaching the contract storage limit.

2.   Make the `elections_master` contract have a specific `init` op phase, and set most storage data in that phase instead. During the deployment of the `elections_master` contract, the state init will only include the `master` contract address and a `nonce` (new data). The `nonce` can potentially be a counter in the `master` contract or obtained via an alternative process. Then, the `elections_master` is initialized (`op::init`) with a check that the sender is the `master` contract and sets an `is_initialized` flag. This flag can prevent other actions from being executed if not already set by the `master` contract's `op::init` call. Later, in the `master` contract's `make_action()`, it validates the sender to be the same address from the expected state init of the `master` contract address + nonce, instead of the original state init with multiple values.

The second option is more scalable compared to the first one. However, it has a side effect in that the current sender address validation automatically invalidates outdated `elections_wallet_code` and `jetton_wallet_code`, which will no longer be applied after the change.
