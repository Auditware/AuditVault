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
  - impact/loss-of-funds/direct-drain
protocol: "[[GTE]]"
auditors:
  - "[[Nyxaris]]"
report: "https://code4rena.com/reports/2025-08-gte-perps-and-launchpad"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fee-accounting]]"
  - "[[fot-slippage]]"
---
# [H-04] Attacker can drain funds from `GTELaunchPadV2Pair` using `swap`

- id: 64852
- impact: HIGH
- protocol: [[GTE]]
- reporter: Nyxaris (Code4rena)
- source: https://code4rena.com/reports/2025-08-gte-perps-and-launchpad

## Summary


The bug report discusses an issue with the `GTELaunchpadV2Pair` contract in the Uniswap protocol. The problem arises when an attacker calls the `swap` function and manipulates the amount of tokens transferred into the contract. This is due to an incorrect calculation that includes swap fees in the balances, while the reserves do not. This allows the attacker to repeatedly drain funds from the protocol in one transaction. The report recommends subtracting accrued fees from balances and reserves when calculating the amount of tokens transferred, and adjusting the k invariant to account for accrued fees. This bug can result in the theft of all tokens held by the contract. The report provides a detailed proof of concept for further understanding. 

## Details



`launchpad/uniswap/GTELaunchpadV2Pair.sol` [# L250-L251](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/launchpad/uniswap/GTELaunchpadV2Pair.sol# L250-L251)

If we consider a situation where there are some non-zero accrued launchpad fees on the `GTELaunchPadV2Pair`, then the reserves are calculated as current balances subtract accrued fees within the `_update` function (GTELaunchPadV2Pair.sol lines 154-155):
```

        reserve0 = _reserve0 = uint112(balance0) - totalLaunchpadFee0;
        reserve1 = _reserve1 = uint112(balance1) - totalLaunchpadFee1;
```

Now an attacker can call `swap` and the function infers the amount(s) transferred into the pair based on the below calculation (lines 250-251):
```

        uint256 amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
```

The issue is that `balance0` and `balance1` are inclusive of swap fees, but `reserve0` and `reserve1` are not. Let’s say the attacker chooses `amount0Out = totalLaunchpadFee0` and does not transfer any tokens into the contract prior to calling `swap`. In this case `balance0` (the balance measured after transferring `amount0Out` to the attacker) is just the same as reserves. Therefore:

`amount0In = balance0 - (_reserve0 - amount0Out) = _reserve0 - (_reserve0 - totalLaunchpadFee0) = totalLaunchpadFee0`

The contract incorrectly infers that the attacker has transferred tokens in when they haven’t transferred anything. To make it work, the attacker needs to reduce `amount0Out` by 0.3% so the k invariant is still satisfied when considering fees. The same principle applies for `amount1` also.

After the attacker’s call to `swap`, the issue can be exploited again due to the fact that the reserves are just updated to be current balances minus the accrued swap fees (assume the attacker performs the attack within the same block as when the fees were accrued, so this way the accrued fees are not cleared). Therefore the attacker can repeatedly execute `swap` in this manner in one transaction and drain a large amount of funds from the protocol.

Additionally, the pair does not correctly implement the k invariant as we can see on lines 256-261:
```

            uint256 balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
            uint256 balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));

            if (balance0Adjusted.mul(balance1Adjusted) < uint256(_reserve0).mul(_reserve1).mul(1000 ** 2)) {
                revert("UniswapV2: K");
            }
```

This is because the adjusted balances are actually inflated by the inclusion of accrued swap fees in them.

Impact: theft of up to 100% of tokens held by the pair.

### Recommended mitigation steps

When inferring the amount(s) transferred in by the user, subtract off the accrued launchpad fees so the amounts can be accurately measured. Also, you need to take away the accrued fees from the balances before checking the k invariant.

Essentially, the accrued launchpad fees are no longer part of the available liquidity of the protocol, and so this needs to be carefully considered.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/submissions/F-2)

---
