---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Notional]]"
auditors:
  - "[[shw]]"
report: "https://code4rena.com/reports/2022-01-notional"
genome:
  - "[[missing-modifier]]"
  - "[[use-reentrancy-guard]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
---
# [H-01] Treasury cannot claim COMP tokens & COMP tokens are stuck

- id: 24655
- impact: HIGH
- protocol: [[Notional]]
- reporter: shw (Code4rena)
- source: https://code4rena.com/reports/2022-01-notional

## Summary


This bug report is about an issue with the `TreasuryAction.claimCOMPAndTransfer` function in the TreasuryAction smart contract. The function uses pre- and post-balances of the COMP token to check which ones to transfer. The issue is that anyone can claim COMP tokens on behalf of any address, and the COMP tokens are then stuck in the contract and cannot be retrieved. This can lead to a denial of service attack, as the protocol could have to upgrade to regain access to the tokens. The severity of the bug was disputed, but it was eventually classified as high severity. The recommended mitigation steps are to not use pre- and post-balances, and instead use the entire balance.

## Details

_Submitted by cmichel, also found by leastwood_

The `TreasuryAction.claimCOMPAndTransfer` function uses pre- and post-balances of the `COMP` token to check which ones to transfer:

```solidity
function claimCOMPAndTransfer(address[] calldata cTokens)
    external
    override
    onlyManagerContract
    nonReentrant
    returns (uint256)
{
    // Take a snasphot of the COMP balance before we claim COMP so that we don't inadvertently transfer
    // something we shouldn't.
    uint256 balanceBefore = COMP.balanceOf(address(this));
    // @audit anyone can claim COMP on behalf of this contract and then it's stuck. https://github.com/compound-finance/compound-protocol/blob/master/contracts/Comptroller.sol#L1328
    COMPTROLLER.claimComp(address(this), cTokens);
    // NOTE: If Notional ever lists COMP as a collateral asset it will be cCOMP instead and it
    // will never hold COMP balances directly. In this case we can always transfer all the COMP
    // off of the contract.
    uint256 balanceAfter = COMP.balanceOf(address(this));
    uint256 amountClaimed = balanceAfter.sub(balanceBefore);
    // NOTE: the onlyManagerContract modifier prevents a transfer to address(0) here
    COMP.safeTransfer(treasuryManagerContract, amountClaimed);
    // NOTE: TreasuryManager contract will emit a COMPHarvested event
    return amountClaimed;
}
```

Note that anyone can claim COMP tokens on behalf of any address (see [`Comptroller.claimComp`](https://github.com/compound-finance/compound-protocol/blob/master/contracts/Comptroller.sol#L1328)).
An attacker can claim COMP tokens on behalf of the contract and it'll never be able to claim any compound itself.
The COMP claimed by the attacker are stuck in the contract and cannot be retrieved.
(One can eventually get back the stuck COMP by creating a cCOMP market and then transferring it through `transferReserveToTreasury`.)

#### Recommended Mitigation Steps

Don't use pre-and post-balances, can you use the entire balance?

**[jeffywu (Notional) disagreed with severity and commented](https://github.com/code-423n4/2022-01-notional-findings/issues/192#issuecomment-1030843184):**
 > Dispute as a high risk bug. Would categorize this as medium risk.
> 
> There is no profit to be gained by doing this from the attacker besides denial of service. The protocol could simply upgrade to regain access to the tokens. We will fix this regardless.

**[pauliax (judge) commented](https://github.com/code-423n4/2022-01-notional-findings/issues/192#issuecomment-1041504305):**
 > Very good find. 
> 
> It is a tough decision if this should be classified as High or Medium severity. An exploiter cannot acquire those assets, and the contracts are upgradeable if necessary, however, I think this time I will leave it in favor of wardens who both are experienced enough and submitted this as of high severity:
> _3 - High: Assets can be stolen/lost/compromised directly (or indirectly if there is a valid attack path that does not have hand-wavy hypotheticals)._



***
