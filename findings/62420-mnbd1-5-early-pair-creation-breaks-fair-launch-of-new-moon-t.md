---
tags:
  - lang/solidity
  - sector/dex
  - sector/launchpad
  - sector/token
  - platform/hexens
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Moonbound]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-05-26-Moonbound.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[timestamp-dependence]]"
---
# [MNBD1-5] Early Pair Creation Breaks Fair Launch of New Moon Tokens And Gives An Attacker The Possibility To Steal All KAS from BondingCurvePool

- id: 62420
- impact: HIGH
- protocol: [[Moonbound]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-05-26-Moonbound.md

## Summary


A critical bug has been found in the BondingCurvePool contract that can be exploited by attackers to manipulate the pricing of new tokens. This can be done by creating a Zealous pair and controlling the reserves or pricing. The attacker can add a large amount of KAS and a small amount of the new token, resulting in an extremely low price for buying KAS with the new token. This can lead to the attacker draining the pool and extracting most or all of the newly added KAS. The bug can be fixed by implementing a modified version of the ZealousSwapFactory contract to ensure that the token has graduated before allowing the creation of a pair. The bug has been fixed.

## Details

**Severity:** Critical

**Path:** contracts/BondingCurvePool.sol#L234-L265 

**Description:** A bonding curve is designed to create fair and manipulation-resistant pricing for new tokens in their early stages. However, if someone can create a Zealous pair and control the reserves or pricing, they can influence how the token is valued after its graduation.

For example, an attacker could exploit this by purchasing tokens from MoonBound and then creating a liquidity pair for the token using `ZealousSwapRouter` by calling the `addLiquidityKAS` function. They could add a large amount of KAS (e.g., 1e10 tokens) and just 1 wei of the newly created moon token. This results in an extremely low price for buying KAS with moon tokens.

The pricing formula used when adding liquidity is:
```
amountB = (amountA * reserveB) / reserveA;
```
In simple terms:
```
kasAmount = (moonTokenAmount * kasReserves) / moonTokenReserves;
```
After a token is launched and reaches the "graduated" state, it typically calls `addLiquidityKAS` on the `ZealousSwapRouter`, supplying a certain amount of KAS (X) and a portion of the token supply (Y), usually around 25% of the total supply.

However, due to the severe imbalance in reserves caused by the attacker, the router ends up transferring nearly all of the KAS and only a negligible amount of moon tokens.

A malicious user can then swap their moon tokens and extract most or all of the newly added KAS, effectively draining the pool.
```
ERC20(token).approve(zealousSwapRouter, tokenForLiquidity);
IZealousSwapRouter02(zealousSwapRouter).addLiquidityKAS{ value: kasCollected }(
  token,
  tokenForLiquidity,
  0,
  0,
  address(this),
  block.timestamp + 15 minutes
);
```


**Remediation:**  The `ZealousSwapPair` contract should only be deployed after the MoonBound token has completed its `graduate()` process. In other words, the protocol should implement a modified version of the `ZealousSwapFactory` contract that includes a check to ensure the token has graduated before allowing the `createPair()` function to execute successfully.

It’s essential to ensure that the token is marked as graduated before any liquidity is added to the pair. In the `graduateToken()` function, move the `tokenManager.graduateToken(token)` call to occur before adding liquidity:
```
function graduateToken() internal {
    // -- snip -- 
    
++  tokenManager.graduateToken(token);
    
    ERC20(token).approve(zealousSwapRouter, tokenForLiquidity);
    IZealousSwapRouter02(zealousSwapRouter).addLiquidityKAS{ value: kasCollected }(
      token,
      tokenForLiquidity,
      0,
      0,
      address(this),
      block.timestamp + 15 minutes
    );

    // Mark the token as graduated in the TokenManager
    // This will disable trading on the bonding curve
--  tokenManager.graduateToken(token);
    
    // -- snip -- 
}

```

**Status:**  Fixed


- - -
