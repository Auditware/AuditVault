---
tags:
  - lang/solidity
  - sector/dex
  - sector/oracle
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Notional]]"
auditors:
  - "[[shw]]"
report: "https://code4rena.com/reports/2022-01-notional"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[treasury-multisig]]"
---
# [H-03] A Malicious Treasury Manager Can Burn Treasury Tokens By Setting `makerFee` To The Amount The Maker Receives

- id: 24657
- impact: HIGH
- protocol: [[Notional]]
- reporter: shw (Code4rena)
- source: https://code4rena.com/reports/2022-01-notional

## Summary


A bug was found in the treasury manager contract of Notional that allows malicious actors to burn treasury tokens without any cost to them. This bug occurs due to the fact that the `_validateOrder` function does not check that the `takerFee` and `makerFee` are set to zero. This can be abused to effectively burn treasury tokens at no cost to the order taker. 

To fix this bug, it is recommended that the `EIP1271Wallet._validateOrder` checks that `makerFee == 0` and `takerFee == 0` so that the treasury manager cannot sign unfair orders which severely impact the `TreasuryManager` contract. This bug was confirmed and will be fixed by Notional.

## Details

_Submitted by leastwood_

The treasury manager contract holds harvested assets/`COMP` from Notional which are used to perform `NOTE` buybacks or in other areas of the protocol. The manager account is allowed to sign off-chain orders used on 0x to exchange tokens to `WETH` which can then be deposited in the Balancer LP and distributed to `sNOTE` holders.

However, `_validateOrder` does not validate that `takerFee` and `makerFee` are set to zero, hence, it is possible for a malicious manager to receive tokens as part of a swap, but the treasury manager contract receives zero tokens as `makerFee` is set to the amount the maker receives. This can be abused to effectively burn treasury tokens at no cost to the order taker.

#### Proof of Concept

<https://github.com/0xProject/0x-monorepo/blob/0571244e9e84b9ad778bccb99b837dd6f9baaf6e/contracts/exchange/contracts/src/MixinExchangeCore.sol#L196-L250>

<https://github.com/0xProject/0x-monorepo/blob/0571244e9e84b9ad778bccb99b837dd6f9baaf6e/contracts/exchange-libs/contracts/src/LibFillResults.sol#L59-L91>

<https://github.com/code-423n4/2022-01-notional/blob/main/contracts/utils/EIP1271Wallet.sol#L147-L188>
```solidity
function _validateOrder(bytes memory order) private view {
    (
        address makerToken,
        address takerToken,
        address feeRecipient,
        uint256 makerAmount,
        uint256 takerAmount
    ) = _extractOrderInfo(order);

    // No fee recipient allowed
    require(feeRecipient == address(0), "no fee recipient allowed");

    // MakerToken should never be WETH
    require(makerToken != address(WETH), "maker token must not be WETH");

    // TakerToken (proceeds) should always be WETH
    require(takerToken == address(WETH), "taker token must be WETH");

    address priceOracle = priceOracles[makerToken];

    // Price oracle not defined
    require(priceOracle != address(0), "price oracle not defined");

    uint256 slippageLimit = slippageLimits[makerToken];

    // Slippage limit not defined
    require(slippageLimit != 0, "slippage limit not defined");

    uint256 oraclePrice = _toUint(
        AggregatorV2V3Interface(priceOracle).latestAnswer()
    );

    uint256 priceFloor = (oraclePrice * slippageLimit) /
        SLIPPAGE_LIMIT_PRECISION;

    uint256 makerDecimals = 10**ERC20(makerToken).decimals();

    // makerPrice = takerAmount / makerAmount
    uint256 makerPrice = (takerAmount * makerDecimals) / makerAmount;

    require(makerPrice >= priceFloor, "slippage is too high");
}
```

#### Recommended Mitigation Steps

Consider checking that `makerFee == 0` and `takerFee == 0` in `EIP1271Wallet._validateOrder` s.t. the treasury manager cannot sign unfair orders which severely impact the `TreasuryManager` contract.

**[jeffywu (Notional) confirmed and commented](https://github.com/code-423n4/2022-01-notional-findings/issues/230#issuecomment-1030839051):**
 > Confirmed, we will fix this.

**[pauliax (judge) commented](https://github.com/code-423n4/2022-01-notional-findings/issues/230#issuecomment-1041560475):**
 > Good job warden for identifying this issue with 0x integration.



***
