---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/stable
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - trigger/low-liquidity
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[ParaSpace]]"
auditors:
  - "[[minhquanym]]"
report: "https://code4rena.com/reports/2022-11-paraspace"
genome:
  - "[[decimal-mismatch]]"
  - "[[trigger/low-liquidity]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[flashloan-callback-auth]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[token-decimal-normalization]]"
---
# [H-05] Attacker can manipulate low TVL Uniswap V3 pool to borrow and swap to make Lending Pool in loss

- id: 15978
- impact: HIGH
- protocol: [[ParaSpace]]
- reporter: minhquanym (Code4rena)
- source: https://code4rena.com/reports/2022-11-paraspace

## Summary


This bug report is about a vulnerability in the Paraspace protocol, which allows users to use Uniswap V3 positions as collateral to borrow funds from Paraspace pools. Uniswap V3 has multiple pools for the same pairs of ERC20 tokens with different fee parameters. Attackers can abuse this vulnerability by creating low TVL pools where the liquidity mostly or fully belongs to their own position, and then deposit this position as collateral and borrow token in Paraspace pool. This would allow them to reduce the original value of the position and cause Paraspace pool to suffer a loss. 

The recommended mitigation steps for this vulnerability is to consider adding a whitelist, only allowing pools with enough TVL to be collateral in Paraspace protocol. This would help prevent attackers from creating low TVL pools and exploiting the vulnerability.

## Details


<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/UniswapV3OracleWrapper.sol#L176>

In Paraspace protocol, any Uniswap V3 position that are consist of ERC20 tokens that Paraspace support can be used as collateral to borrow funds from Paraspace pool. The value of the Uniswap V3 position will be sum of value of ERC20 tokens in it.

```solidity
function getTokenPrice(uint256 tokenId) public view returns (uint256) {
    UinswapV3PositionData memory positionData = getOnchainPositionData(
        tokenId
    );

    PairOracleData memory oracleData = _getOracleData(positionData);

    (uint256 liquidityAmount0, uint256 liquidityAmount1) = LiquidityAmounts
        .getAmountsForLiquidity(
            oracleData.sqrtPriceX96,
            TickMath.getSqrtRatioAtTick(positionData.tickLower),
            TickMath.getSqrtRatioAtTick(positionData.tickUpper),
            positionData.liquidity
        );

    (
        uint256 feeAmount0,
        uint256 feeAmount1
    ) = getLpFeeAmountFromPositionData(positionData);

    return // @audit can be easily manipulated with low TVL pool
        (((liquidityAmount0 + feeAmount0) * oracleData.token0Price) /
            10**oracleData.token0Decimal) +
        (((liquidityAmount1 + feeAmount1) * oracleData.token1Price) /
            10**oracleData.token1Decimal);
}
```

However, Uniswap V3 can have multiple pools for the **same pairs** of ERC20 tokens with **different fee** params. A fews has most the liquidity, while other pools have extremely little TVL or even not created yet. Attackers can abuse it, create low TVL pool where liquidity in this pool mostly (or fully) belong to attacker’s position, deposit this position as collateral and borrow token in Paraspace pool, swap to make the original position reduce the original value and cause Paraspace pool in loss.

### Proof of Concept

Consider the scenario where WETH and DAI are supported as collateral in Paraspace protocol.

1.  Alice (attacker) create a new WETH/DAI pool in Uniswap V3 and add liquidity with the following amount<br>
    `1e18 wei WETH - 1e6 wei DAI = 1 WETH - 1e-12 DAI ~= 1 ETH`<br>
    Let's just assume Alice position has price range from `[MIN_TICK, MAX_TICK]` so the math can be approximately like Uniswap V2 - constant product.<br>
    Note that this pool only has liquidity from Alice.
2. Alice deposit this position into Paraspace, value of this position is approximately `1 WETH` and Alice borrow maximum possible amount of USDC.
3. Alice make swap in her WETH/DAI pool in Uniswap V3 to make the position become<br>
    `1e6 wei WETH - 1e18 wei DAI = 1e-12 WETH - 1 DAI ~= 1 DAI`

Please note that the math I've done above is approximation based on Uniswap V2 formula `x * y = k` because Alice provided liquidity from `MIN_TICK` to `MAX_TICK`.<br>
For more information about Uniswap V3 formula, please check their whitepaper here: <https://uniswap.org/whitepaper-v3.pdf>.

### Recommended Mitigation Steps

Consider adding whitelist, only allowing pool with enough TVL to be collateral in Paraspace protocol.

**[LSDan (judge) commented](https://github.com/code-423n4/2022-11-paraspace-findings/issues/407#issuecomment-1376406262):** 
> Overinflated severity

**[minhquanym (warden) commented](https://github.com/code-423n4/2022-11-paraspace-findings/issues/407#issuecomment-1400899415):**
 > Hi @LSDan,
> Maybe there is a misunderstanding here. I believed I gave enough proof to make it a High issue and protocol can be at loss.<br>
> You can think of it as using Uniswap V3 pool as a price Oracle. However, it did not even use TWA price but spot price and pool with low liquidity is really easy to be manipulated. We all can see many examples about Price manipulation attacks recently and they had a common cause that price can be changed in one block.<br>
> About the Uniswap V3 pool with low liquidity, you can check out this one https://etherscan.io/address/0xbb256c2F1B677e27118b0345FD2b3894D2E6D487.<br>
> This is a USDC-USDT pool with only `$8k` in it.

**[LSDan (judge) commented](https://github.com/code-423n4/2022-11-paraspace-findings/issues/407#issuecomment-1403968688):**
 > This is not true because Alice's pool will be immediately arbed each time she attempts a price manipulation. Accordingly, this issue only exists when a pair has very low liquidity on UniV3 and no liquidity elsewhere. I would have accepted this as a QA, but it does not fall into the realm of a high risk issue.
> 
> I'm open to accepting this as a medium if you can give me a more concrete scenario where the value that Alice is extracting from the protocol through this attack is sustainable and significant enough to exceed the gas price of creating a new UniV3 pool.

**[minhquanym (warden) commented](https://github.com/code-423n4/2022-11-paraspace-findings/issues/407#issuecomment-1404042265):**
 > @LSDan, Please correct me if I'm wrong but I don't think Alice's pool can be arbed when the whole attack happens in 1 transaction. Because of that, I still believe that this is a High. For example, 
> 1. price before manipulation is `p1`
> 2. flash loan and swap to change the price to `p2`
> 3. add liquidity and borrow at price `p2`
> 4. change the price back to `p1`
> 5. repay the flash loan
> 
> That's basically the idea. You can see price is back to `p1` at the end. 

**[LSDan (judge) commented](https://github.com/code-423n4/2022-11-paraspace-findings/issues/407#issuecomment-1404876330):**
 > Ok yeah... I see what you're saying now. This could be used to drain the pool because the underlying asset price comes from a different oracle. So if Alice creates a pool with 100 USDC and 100 USDT, and drops 3mm USDC from a flash loan into it, the external oracle will value the LP at `$3mm`. High makes sense. Thanks for the additional clarity.



***
