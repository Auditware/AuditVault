---
tags:
  - lang/solidity
  - sector/dex
  - sector/stable
  - sector/staking
  - sector/token
  - platform/quantstamp
  - severity/high
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/fee-theft
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[31Third]]"
auditors:
  - "[[Guillermo Escobero]]"
report: "https://certificate.quantstamp.com/full/31-third/d11ac960-91e8-49c2-9cb3-c44e11e442f9/index.html"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[fee-theft]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[reentrancy-guard]]"
  - "[[vote-delegation-loop]]"
---
# User Can Pass Any Calldata

- id: 60955
- impact: HIGH
- protocol: [[31Third]]
- reporter: Guillermo Escobero (Quantstamp)
- source: https://certificate.quantstamp.com/full/31-third/d11ac960-91e8-49c2-9cb3-c44e11e442f9/index.html

## Summary


This bug report discusses a potential vulnerability in the 31Third trading contract. The contract previously allowed for users to pass in call data for a trade that differed from what was specified in the contract, potentially resulting in unintended functions being called and funds being drained. The report also mentions a second exploit scenario involving stealing fee tokens. The report recommends implementing measures to validate input data and protect against reentrancy attacks.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `b166e5b` and `6529d31`. All trade data must now be signed by 31Third's key in order to be accepted by the contract. This means that the responsibility for validation now lies in off-chain code, which is not within the scope of the audit. We recommend that the 31Third team designs the off-chain validation logic with the greatest care and considers getting that code audited. A reentrancy lock is now protecting `batchTrade()` to avoid potential reentrancy issues. The client provided the following explanation: _Fixed by adding a signature to the trade struct to be able to verify on chain, that the sent data comes from our API. Docs on the API can be found under https://docs.31third.com/31third-api/overview_

**File(s) affected:**`BatchTrade.sol`

**Description:** 31Third is highly dependant on external exchanges. As external exchanges can add or remove functionalities, the 31Third team should be very careful when adding new exchanges and stay updated about possible vulnerabilities in these systems.

When users call `BatchTrade.batchTrade()`, they can pass call data for a swap that differs from what is specified in the `Trade` struct. For example, if a user is trading using the 0x adapter, the actual call data sent to the 0x contract could target any available function. This could result in the user being able to call unintended functions in external contracts that could in turn drain `BatchTrade` of any funds held within.

**Exploit Scenario:**

1. A malicious actor creates the call data for a trade on 0x that swaps `USDC` -->`ETH` across a Uniswap V3 pool and sets the recipient as the malicious actor wallet.

```
bytes memory zeroXCalldata = abi.encodeWithSignature(
  "sellTokenForEthToUniswapV3(bytes memory encodedPath, uint256 sellAmount, uint256 minBuyAmount, address recipient)",
  encodePath(USDC, WETH, 3000), // Uniswap V3 path
  IERC20(USDC).balanceOf(address(BatchTrade)),  // From token amount
  0, // Min amount received
  <MALICIOUS_ACTOR_ADDRESS>  // Recipient
);
```

2. Malicious actor creates a trade with mismatched data using the 0x adapter.

```
BatchTrade.batchTrade(
  [
    BatchTrade.Trade(
      "ZeroExExchangeV4", // Exchange name
      FakeTokenA, // Fake from token
      FakeTokenB,  // Fake to token
      1000000,  // Fake from amount
      0, // Fake min amount received
      zeroXCalldata // Actual call data
    )
  ]
)
```

3. `BatchTrade` assumes that the trade occurring on 0x is `FakeTokenA` -->`FakeTokenB`, but the call data will execute the swap `USDC` -->`ETH`.

4. Malicious actor drains `BatchTrade` of all its `USDC` (or any token), declaring himself as the `taker`.

**Second Example Exploit**:

1.   Suppose an attacker wants to steal all the `LINK` token fees stored within `BatchTrade`. 
2.   The attacker starts by creating several failed transactions with `_batchTradeConfig.revertOnError` in order to increase the allowance of the exchange spender contract to spend the `LINK` tokens belonging to `BatchTrade`. See the issue **Inflation Of Approvals Through Failed Trades** for more details on how to do this.
3.   The attacker can deploy their own token contract, which reports incorrect or misleading balances in order to subvert any balance checks done by the `BatchTrade` contract. 
4.   The attacker then calls the `batchTrade` function with a `Trade` struct that has:
    *   The attacker's token contract is the `from` token.
    *   `DAI` as the `to` token.
    *   `data` which represents a call to 0x to swap `LINK` for `DAI`

5.   The actual swap is from the contract's `LINK` fee tokens to `DAI` tokens. The `DAI` tokens are sent back to the attacker.
6.   The attacker has effectively stolen all the `LINK` fee tokens.
7.   This attack could be done with any other fee token.

**Recommendation:**

1.   The protocol should validate the input data of the trade and block all the features that are not supported by 31Third. Another approach could be delegating the creation of signed `Trade` input to an external system. This signature could be checked then by the smart contracts.
2.   Either call data passed in by the user should be fully validated to match the rest of the `Trade` struct, or the contract should be redesigned to construct the call data itself.
3.   If appropriate, consider having a whitelist of tokens to be traded. This would prevent manipulation through custom malicious tokens.
4.   We also recommend protecting `batchTrade()` with a reentrancy lock. This function is just expected to be called using the 31Third front end.
