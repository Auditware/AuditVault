---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/token
protocol: "[[Rubicon]]"
auditors:
  - "[[carrotsmuggler]]"
report: "https://code4rena.com/reports/2023-04-rubicon"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[cross-contract-state-consistency]]"
---
# [H-10] Some offers can't be cancelled

- id: 48949
- impact: HIGH
- protocol: [[Rubicon]]
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2023-04-rubicon

## Summary


The bug report states that there is an issue with the `cancel` function in the `SimpleMarket` API. When a user creates an offer using this API, the offer is not inserted into the linked list `_rank`. This means that when the user tries to cancel their offer, they are unable to do so because the offer was never sorted properly. This creates an opportunity for exploitation, as shown in the "Exploit" section of the report. To fix this issue, the report recommends overriding the `offer` function in `SimpleMarket` with the `offer` function in `RubiconMarket`. This fix has been confirmed by the developer.

## Details


A normal user can't cancel their offer when using a specific API.

### Proof of Concept

1.  The function [`offer`](https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/RubiconMarket.sol#L511) of `SimpleMarket` is not overridden by the `RubiconMarket` contract.
*Note: that this function is called in the testing [example](https://github.com/code-423n4/2023-04-rubicon/blob/main/test/foundry-tests/ProtocolDeployment.t.sol#L89)*
2.  The [`cancel`](https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/RubiconMarket.sol#L452) function inside `SimpleMarket` is overridden by the [`cancel`](https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/RubiconMarket.sol#L871) function in `RubiconMarket`.

When a normal user creates an offer with the `SimpleMarket` API(1), the offer is not inserted into the linked list `_rank`.

After some time the user wants to cancel their order. They can only call `RubiconMarket`'s `cancel` function(2). When they call `cancel` what will happen is:

1.  [`isOfferSorted`](https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/RubiconMarket.sol#L876) will return `false` because the offer was never inserted into `_rank`.
2.  [`_hide`](https://github.com/code-423n4/2023-04-rubicon/blob/main/contracts/RubiconMarket.sol#L879) will also return `false`, Because the offer was not inserted into the unsorted list `_near`.
3.  Require check will fail because `_hide` returned `false`.

Therefore, the user won't be able to cancel their offer.

### Exploit

Can't cancel when creating an offer with `SimpleMarket`'s `offer`. Add this to `ProtocolDeployment.t.sol`:

```solidity
function test_ExploitCantCancel() public {
  uint id;
  // Create an offer with the function `offer(uint256,ERC20,uint256,ERC20,address,address)` in `SimpleMarket`
  id = market.offer(90e6, TUSDC, 100e18, TEST, address(this), owner);

  // The created offer can't be cancelled! The following line will revert with "Reason: can't hide"
  vm.expectRevert("can't hide");
  market.cancel(id);
}
```

### Recommended Mitigation Steps

Override the `offer` function in `SimpleMarket` with the `offer` function in `RubiconMarket`.
Add this offer function:

```solidity
function offer(
    uint256 pay_amt,
    ERC20 pay_gem,
    uint256 buy_amt,
    ERC20 buy_gem,
    address owner,
    address recipient
) public override can_offer returns (uint256) {
    return
        offer(
            pay_amt,
            pay_gem,
            buy_amt,
            buy_gem,
            0,
            true,
            owner,
            recipient
        );
  }
```

**[daoio (Rubicon) confirmed](https://github.com/code-423n4/2023-04-rubicon-findings/issues/766#issuecomment-1534221304)**

***
