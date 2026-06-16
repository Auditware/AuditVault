---
tags:
  - lang/solidity
  - sector/dex
  - sector/launchpad
  - sector/perpetuals
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[GTE]]"
auditors:
  - "[[levantequarini]]"
report: "https://code4rena.com/reports/2025-08-gte-perps-and-launchpad"
genome:
  - "[[frozen-funds]]"
  - "[[frontrun]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# [H-09] DOS of Launchpad Graduation via `addLiquidity` with 1 Wei donation

- id: 64857
- impact: HIGH
- protocol: [[GTE]]
- reporter: levantequarini (Code4rena)
- source: https://code4rena.com/reports/2025-08-gte-perps-and-launchpad

## Summary


This bug report discusses an issue in the `launchpad/Launchpad.sol` contract where an attacker can prevent the graduation of Launchpad tokens by front-running with a small donation to the target pair and calling `sync()`. This causes the router's `addLiquidity` function to fail during graduation, effectively causing a denial-of-service (DOS) attack on the graduation process. The root cause of this issue is that the router's `quote()` function requires both reserves to be greater than 0, which is not the case when `sync()` is called. This vulnerability can be mitigated by checking for one-sided reserves and using a different path for the `addLiquidity` function.

## Details



`launchpad/Launchpad.sol` [# L500](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/launchpad/Launchpad.sol# L500)

An attacker can prevent Launchpad token graduation by front-running with a small donation to the target pair and calling `sync()`. This causes the router’s `addLiquidity` function to revert during graduation, effectively DOSing the graduation process .

### Root Cause Analysis

**The Problem**

1. Attacker donates small amount of quote token to target pair before graduation
2. **Calls sync()**: This sets reserves to one-sided: `(reserveA=0, reserveB>0)`
```

// 1. Attacker sees  created token
// 2. sends  donation + call  sync
IERC20(quoteToken).transfer(targetPair, 1 wei);
IUniswapV2Pair(targetPair).sync();
```

3. **Router Fails**: `addLiquidity` calls `quote()` which requires both reserves > 0
   as per sponsor comment

**yes for the router, you can assume it is identical to uniswap. The only difference between vanilla and gte univ2 (aside from solc version) would be the fee accrual in Pair.sol, and the factory needing to be customized so we could pass more information to the constructor of Pair
<https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/inbox/16?replyUid=257>**

4. **Graduation DOS**: Launchpad graduation reverts, preventing token launch completion

**UniswapV2Library.quote() - Used by Router**
```

function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB) {
    require(amountA > 0, 'UniswapV2Library: INSUFFICIENT_AMOUNT');
    require(reserveA > 0 && reserveB > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY'); // ← FAILS HERE
    amountB = amountA.mul(reserveB) / reserveA;
}
```

**Launchpad.\_graduate() - Vulnerable Call**
```

uniV2Router.addLiquidity({
    tokenA: token,
    tokenB: address(data.quote),
    amountADesired: tokensToLock,
    amountBDesired: quoteToLock,
    amountAMin: 0,        // ← Won't help, fails before this check
    amountBMin: 0,        // ← Won't help, fails before this check
    to: address(launchpadLPVault),
    deadline: block.timestamp
});
```

### Impact

This will cause a temporary DOS on the graduation of that pair.

### Recommended mitigation steps
```

function _graduate(address token) internal {
    // ... existing code ...

    // Check if pair has one-sided reserves
    (uint112 reserve0, uint112 reserve1,) = pair.getReserves();

    if (reserve0 == 0 || reserve1 == 0) {
        // Bypass router, use direct pair.mint()
        token.safeTransfer(address(pair), tokensToLock);
        data.quote.safeTransfer(address(pair), quoteToLock);
        pair.mint(address(launchpadLPVault));
    } else {
        // Normal router path
        uniV2Router.addLiquidity({...});
    }
}
```

[View detailed Proof of Concept](https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/submissions/F-17)

---
