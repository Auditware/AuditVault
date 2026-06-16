---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[Frankencoin]]"
auditors:
  - "[[cccz]]"
report: "https://code4rena.com/reports/2023-04-frankencoin"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[frontrun-exposure]]"
---
# [H-03] When the challenge is successful, the user can send tokens to the position to avoid the position's cooldown period being extended

- id: 20018
- impact: HIGH
- protocol: [[Frankencoin]]
- reporter: cccz (Code4rena)
- source: https://code4rena.com/reports/2023-04-frankencoin

## Summary


This bug report is about an issue with the internalWithdrawCollateral function in the Position contract of the Frankencoin project. The issue occurs when a user sends collateral to the position in advance before the challenge is successful. The problem is that the cooldown period of the position will not be extended.

For example, consider a position with WETH:ZCHF=2000:1, with a challenge period of 3 days and a minimum amount of collateral of 1 WETH. If Alice clones the position offering 1 WETH to mint 0 zchf, Bob offers 1 WETH to launch the challenge and Charlie bids 1800 zchf, Bob has already covered all collateral, and after 3 days the challenge expires. If Bob calls end() to end the challenge, Alice can use MEV to send 1 WETH to the position in advance and Bob's transaction will be executed, giving Charlie the 1 WETH collateral in the position and Alice most of the bid. Since the position balance is still 1 WETH, the position cooldown period does not extend to the position expiration, allowing Alice to use that price to mint 10e8 zchf.

The recommended mitigation step is to consider extending the cooldown period of the position even if the challenge is successful. Luziusmeisser from the Frankencoin project commented that they will implement a 1 day cooldown on successful challenges.

## Details


When the challenge is successful, internalWithdrawCollateral will be called to transfer the collateral in the position. Note that the cooldown period of the position will be extended until the position expires only if the collateral in the position is less than minimumCollateral, if the user sends collateral to the position in advance, then the cool down period of the position will not be extended.

```solidity
    function internalWithdrawCollateral(address target, uint256 amount) internal returns (uint256) {
        IERC20(collateral).transfer(target, amount);
        uint256 balance = collateralBalance();
        if (balance < minimumCollateral){
            cooldown = expiration;
        }
        emitUpdate();
        return balance;
    }
```

I will use the following example to illustrate the severity of the issue.

Consider WETH:ZCHF=2000:1, the position has a challenge period of 3 days and the minimum amount of collateral is 1 WETH.

1.  alice clones the position, offering 1 WETH to mint 0 zchf.
2.  alice adjusts the price to 10e8, the cooldown period is extended to 3 days later.
3.  bob offers 1 WETH to launch the challenge and charlie bids 1800 zchf.
4.  Since bob has already covered all collateral, other challengers are unprofitable and will not launch new challenges
5.  After 3 days, the cooldown period ends and the challenge expires.
6.  bob calls end() to end the challenge.
7.  alice observes bob's transaction and uses MEV to send 1 WETH to the position in advance.
8.  bob's transaction is executed, charlie gets the 1 WETH collateral in the position, and alice gets most of the bid.
9.  Since the position balance is still 1 WETH, the position cooldown period does not extend to the position expiration.

10.Since the position is not cooldown and there is no challenge at this point, alice uses that price to mint 10e8 zchf.

### Proof of Concept

<https://github.com/code-423n4/2023-04-frankencoin/blob/1022cb106919fba963a89205d3b90bf62543f68f/contracts/Position.sol#L268-L276> <br><https://github.com/code-423n4/2023-04-frankencoin/blob/1022cb106919fba963a89205d3b90bf62543f68f/contracts/Position.sol#L329-L354> <br><https://github.com/code-423n4/2023-04-frankencoin/blob/1022cb106919fba963a89205d3b90bf62543f68f/contracts/MintingHub.sol#L252-L276>


### Recommended Mitigation Steps

Consider extending the cooldown period of the position even if the challenge is successful


**[luziusmeisser (Frankencoin) commented](https://github.com/code-423n4/2023-04-frankencoin-findings/issues/691#issuecomment-1528913130):**
 > Excellent finding! Will implement 1 day cooldown on successful challenges.

***
