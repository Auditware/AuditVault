---
tags:
  - lang/solidity
  - sector/governance
  - sector/multisig
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Perennial]]"
auditors:
  - "[[WATCHPUG]]"
report: "https://github.com/sherlock-audit/2023-07-perennial-judging"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[timelock-timestamp-bypass]]"
  - "[[treasury-multisig]]"
---
# H-3: Protocol fee from Market.sol is locked

- id: 24301
- impact: HIGH
- protocol: [[Perennial]]
- reporter: WATCHPUG (Sherlock)
- source: N/A

## Summary


This bug report is about an issue found in the MarketFactory#fund function in the Perennial Protocol. The function calls the Market#claimFee function which sends the protocolFee to the MarketFactory contract. However, the MarketFactory contract does not max approve any address to spend its tokens, and there is no function that can be used to get the funds out of the contract, so the funds are permanently locked in MarketFactory. This means that the protocol fees cannot be withdrawn. The code snippets for the MarketFactory#fund, Market#claimFee, and _claimFee functions can be found in the GitHub link provided in the report. 

The issue was found by 0x73696d616f, Emmanuel, WATCHPUG, bin2chen and was manually reviewed. It was recommended to add a withdraw function that protocol can use to get the protocolFee out of the contract. 

The issue was discussed by sherlock-admin, __141345__, n33k, arjun-io, Emedudu, and hrishibhat during the judging contest. Emedudu escalated the issue to high severity because the funds are permanently locked. Arjun-io fixed the issue by adding a pull request to the GitHub repository, however, Emedudu was not able to access the repo to review the fix. Arjun-io mentioned that the distinction here is that "funds stuck" are fixable via upgrades, whereas attacks which immediately drain funds or those which cause accounting errors are not after they are executed. Hrishibhat concluded that the issue should be considered as a valid high issue based on historical decisions on similar issues.

The issue was successfully resolved and the escalation status was accepted.

## Details

Source: https://github.com/sherlock-audit/2023-07-perennial-judging/issues/52 

## Found by 
0x73696d616f, Emmanuel, WATCHPUG, bin2chen

The `MarketFactory#fund` calls the specified market's `Market#claimFee` function.
This will send the protocolFee to the MarketFactory contract.
MarketFactory contract does not max approve any address to spend its tokens, and there is no function that can be used to get the funds out of the contract, so the funds are permanently locked in MarketFactory.

## Vulnerability Detail
Here is `MarketFactory#fund` function:

```solidity
  function fund(IMarket market) external {
        if (!instances(IInstance(address(market)))) revert FactoryNotInstanceError();
@>      market.claimFee();
    }
```

This is `Market#claimFee` function:

```solidity
    function claimFee() external {
        Global memory newGlobal = _global.read();

        if (_claimFee(address(factory()), newGlobal.protocolFee)) newGlobal.protocolFee = UFixed6Lib.ZERO;
        ...
    }
```

This is the internal `_claimFee` function:

```solidity
    function _claimFee(address receiver, UFixed6 fee) private returns (bool) {
        if (msg.sender != receiver) return false;

        token.push(receiver, UFixed18Lib.from(fee));
        emit FeeClaimed(receiver, fee);
        return true;
    }
```

As we can see, when `MarketFactory#fund` is called, Market#claimFee gets called which will send the protocolFee to msg.sender(MarketFacttory).
When you check through the MarketFactory contract, there is no place where another address(such as protocol multisig, treasury or an EOA) is approved to spend MarketFactory's funds, and also, there is no function in the contract that can be used to transfer MarketFactory's funds.
This causes locking of the protocol fees.

## Impact
Protocol fees cannot be withdrawn
## Code Snippet
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial/contracts/MarketFactory.sol#L89

https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L133

https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L145-L151

## Tool used

Manual Review

## Recommendation
Consider adding a `withdraw` function that protocol can use to get the protocolFee out of the contract.
You can have the withdraw function transfer the MarketFactory balance to the treasury or something.



## Discussion

**sherlock-admin**

2 comment(s) were left on this issue during the judging contest.

**__141345__** commented:
> h

**n33k** commented:
> medium



**arjun-io**

We originally wanted to keep the funds in the Factory (for a future upgrade) but it might make sense to instead allow the Factory Owner (Timelock) to claim these funds instead

**Emedudu**

Escalate

I believe this is of HIGH severity because funds are permanently locked

**sherlock-admin2**

 > Escalate
> 
> I believe this is of HIGH severity because funds are permanently locked

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**arjun-io**

Fixed https://github.com/equilibria-xyz/perennial-v2/pull/79

re: Escalation - since this contract can be upgraded the funds are not permanently locked

**Emedudu**

>Fixed https://github.com/equilibria-xyz/perennial-v2/pull/79

Can't access the repo to review the fix. It's probably a private repo.

> since this contract can be upgraded the funds are not permanently locked

While it's true that the contract can potentially be upgraded to address this issue, it's essential to acknowledge that the current code we audited does, in fact, contain a high severity vulnerability. Otherwise, implying that all upgradeable contracts are free of bugs simply because they can be upgraded to resolve them would be misleading.

**arjun-io**

> Otherwise, implying that all upgradeable contracts are free of bugs simply because they can be upgraded to resolve them would be misleading.

The distinction here is that "funds stuck" are fixable via upgrades, whereas attacks which immediately drain funds or those which cause accounting errors are not after they are executed.

**hrishibhat**

Result:
High
Has duplicates
Although Sponsor raises a valid point, perhaps Sherlock needs to have a rule with respect to smart contract upgrade-related issues. 
Historically smart contract upgrades have not weighed on the issue severity decisions but will be considered in future rule updates, however, this issue will be considered as a valid high issue based on historical decisions on similar issues. 

**sherlock-admin2**

Escalations have been resolved successfully!

Escalation status:
- [Emedudu](https://github.com/sherlock-audit/2023-07-perennial-judging/issues/52/#issuecomment-1695339981): accepted
