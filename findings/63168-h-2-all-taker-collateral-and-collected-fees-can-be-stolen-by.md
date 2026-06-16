---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/oracle/spot-price
  - vuln/reentrancy/single-function
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/fee-theft
  - trigger/price-manipulation
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-reentrancy-guard
  - fix/use-twap
  - trigger/reentrancy-callback
protocol: "[[Ammplify]]"
auditors:
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[spot-price]]"
  - "[[single-function]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[fee-theft]]"
  - "[[trigger/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# H-2: All taker collateral and collected fees can be stolen by re-entering via `RFTLib.settle` to manipulate uniswap spot price when adding Maker liquidity

- id: 63168
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


The bug report discusses a vulnerability in the Ammplify contract that allows an attacker to manipulate the Uniswap pool price and steal funds from the contract. This can be done by exploiting a re-entrancy vulnerability in the `Maker.newMaker` and `Maker.adjustMaker` functions. The attacker can manipulate the price and steal funds from the contract, including user collateral and Uniswap fees. This can have a significant impact on users, as it can result in lost funds and failed transactions. To mitigate this vulnerability, it is recommended to verify that the amounts spent during Uniswap mint match the amounts charged from the user. 

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/58 

## Found by 
panprog

### Summary

When any user adds maker liquidity (via `newMaker` or `adjustMaker`), the amounts of `token0` and `token1` required from the user are calculated in the `data.xBalance` and `data.yBalance`, however the actual amounts spent to mint the required liquidity are never checked, the contract simply sends whatever amounts of both tokens are given by the uniswap pool in the mint callback. When the funds are settled for the maker liquidity change, the following functions are called:
```solidity
    RFTLib.settle(msg.sender, tokens, balances, rftData);
    PoolWalker.settle(pInfo, asset.lowTick, asset.highTick, data);
```

`RFTLib.settle` calls user contract:
```solidity
    // If the payer is an RFTPayer, we make the request now.
    if (isRFTPayer) {
        cbData = IRFTPayer(payer).tokenRequestCB(tokens, balanceChanges, data);
    }
```

This allows the user to manipulate the uniswap pool spot price to a different value via the `RFTLib` callback. `PoolWalker.settle` will then proceed to mint the required liquidity, but will use amounts of `token0` and `token1` different from the ones calculated and received from the user. Moreover, the total value of these tokens will always be higher than the value of tokens received from the user. When user manipulates the price back to initial value, he will have profit from this manipulation, stealing `token0` and/or `token1` from the contract.

As the contract uses Diamond proxy, this contract holds all token balances at the same address which is used to mint uniswap liquidity. In particular, the following funds are under risk:
- All Takers collateral
- All fees collected from the uniswap pool

### Root Cause

Re-entrancy in `Maker.newMaker` and `Maker.adjustMaker` which allows to manipulate uniswap pool before the pool positions are minted to the Ammplify:
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/facets/Maker.sol#L49-L50
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/facets/Maker.sol#L79-L80

### Internal Pre-conditions

None.

### External Pre-conditions

None.

### Attack Path

Note: `a0` is used for amount of `token0`, `a1` for amount of `token1`
1. Current `price = 100`
2. Takers have a total collateral of 100 `a0` and 10000 `a1` (these are contract balances)
3. There is liquidity of 1 in the range[100;10000]
3. Attacker adds 111 maker liquidity in the range [100;10000], paying 10 `a0`
4. In the `RFTLib.settle` attacker manipulates the price to 10000
4.1. Attacker pays `a1`: -90
4.2. Attacker receives `a0`: +0.09
5. Attacker returns from the `RFTLib` callback, 111 liquidity is minted to Ammplify, taking 10000 `a1` from it
6. Attacker manipulates the price back to 100:
6.1. Attacker pays `a0`: -10
6.2. Attacker receives `a1`: +10000
7. Attacker waits for jit penalty time to pass and withdraws his 111 maker liquidity, receiving 10 `a0`

Contract balances:
- before: 100 `a0` + 10000 `a1` = $20000
- after: 110 `a0` + 0 `a1` = $11000

Attacker balances:
- `a0`: -10 + 0.09 - 10 + 10 = -9.91 [-$991]
- `a1`: -90 + 10000 = +9910 [+$9910]
- uniswap manipulation fees (0.3%): (90 + 10000) * 0.003 = -$30
Total: $9910 - $991 - $30 = +$8889

Attack is performed in a single transaction except the final withdrawal, however even with jit fees this is highly profitable to attacker. The same attack can be performed in a different direction (stealing most `a0`).

The attack allows to steal almost entire `a0` and `a1` balances of the Ammplify.

### Impact

1. Most (90-99%) Ammplify contract balances can be stolen, including:
- Taker collateral
- Uniswap fees collected but not yet claimed by the users
2. When there are near-0 balances, multiple actions expecting positive balance will revert for users:
- Takers will be unable to get back their collateral
- Non-compounding Makers will be unable to adjust their balances, because all such actions will send them their expected uniswap pool fees, but the contract will not have them, so will revert with not enough funds.

### Mitigation

Verify that the amounts spent during uniswap mint match the amounts charged from the user.
