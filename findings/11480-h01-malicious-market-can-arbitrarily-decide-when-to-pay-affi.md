---
tags:
  - lang/solidity
  - sector/prediction
  - sector/staking
  - platform/openzeppelin
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Augur]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/augur-core-v2-audit-components/"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# [H01] Malicious market can arbitrarily decide when to pay affiliate fees

- id: 11480
- impact: HIGH
- protocol: [[Augur]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/augur-core-v2-audit-components/

## Summary


This bug report is about an attack vector in the Augur protocol. It is possible for any user to create a malicious Augur market that can arbitrarily decide when to pay affiliate fees, including the 20% that should be directed to the source trader account. The attack works by setting the '_affiliateValidator' parameter of the 'MarketFactory' contract to an attacker-controlled contract that implements the 'IAffiliateValidator' interface. This address is then set during initialization of the 'Market' contract without any kind of validation. 

When the 'recordMarketCreatorFees' function of the 'Market' contract is called, the 'Market' contract attempts to call a 'validateReference' function in the attacker-controlled 'affiliateValidator' address. At this point, the attacker is in full control of the execution and can arbitrarily determine whether or not the call is successful. If it is not, then the 'getAndValidateReferrer' function will return the zero address. As a consequence, the '_affiliateAddress' local variable will be set to zero, which will prevent paying out the trading fees to the '_sourceAccount' and accumulating affiliate fees. 

The solution to this attack is to limit the kind of affiliate validator contract that a market creator can set, and to entirely disallow market creators to set potentially malicious contracts in a market’s 'affiliateValidator' address. This bug was fixed in commit '8e62ffe8'.

## Details

It is possible for any user to create a malicious Augur market that can arbitrarily decide when to pay affiliate fees (including the 20% that should be directed to the source trader account).


Any attacker can create a `Market` through the [`createMarket` function](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/factories/MarketFactory.sol#L27) of the `MarketFactory` contract. The `_affiliateValidator` parameter may be the address of an attacker-controlled contract implementing the [`IAffiliateValidator` interface](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/external/IAffiliateValidator.sol). This address is then [set during initialization of the `Market` contract](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L77) without any kind of validation.


Once the [`recordMarketCreatorFees` function](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L337) of the `Market` contract is called, the `Market` contract [executes a call to the `getAndValidateReferrer` function of the `Affiliates` contract](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L340), passing the attacker-controlled `affiliateValidator` address as the second argument. In turn, the `getAndValidateReferrer` function will [attempt to call a `validateReference` function](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Affiliates.sol#L48) in the attacker-controlled `affiliateValidator` address, providing the two accounts as parameters. At this point, the attacker is in full control of the execution and can arbitrarily determine whether or not the call is successful. If it is not, then the `getAndValidateReferrer` function [will return the zero address](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Affiliates.sol#L55-L57). As a consequence, back in the `Market` contract, the [`_affiliateAddress` local variable](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L340) will be set to zero, which will [prevent paying out the trading fees to the `_sourceAccount` and accumulating affiliate fees](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L347-L355).


It must be stressed that the decision of *if* and *when* to pay fees does not currently depend on the Augur protocol at all, but rather on arbitrary logic chosen by the creator of the market in the `affiliateValidator` address.


Trying to prevent this attack by limiting the gas forwarded to the potentially malicious `AffiliateValidator` contract does not seem to be a complete solution. Consider putting more strict limitations on the kind of affiliate validator contract that a market creator can set. Ultimately, consider entirely disallowing market creators to set potentially malicious contracts in a market’s `affiliateValidator` address, and instead deploying and setting legitimate `AffiliateValidator` contracts programmatically during a `Market` initialization.


**Update**: *Fixed in [commit `8e62ffe8`](https://github.com/AugurProject/augur/commit/8e62ffe80226c385d01dcb0ffc9fc1d601dd7da6). Anyone can create a new `AffiliateValidator` instance using the known contract template, and the `Market` contract ensures the specified validator is one of these instances.*
