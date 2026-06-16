---
tags:
  - lang/solidity
  - lang/vyper
  - sector/dex
  - platform/0x52
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[Adapterfi]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2024-05-03-AdapterFi.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-01] Malicious proposer can use pregen_info to drain vault assets through sandwich attack

- id: 55659
- impact: HIGH
- protocol: [[Adapterfi]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2024-05-03-AdapterFi.md

## Summary


The bug report is about a vulnerability in the AdapterVault code, specifically in the function that handles claiming fees. The issue is that when claiming fees, funds must be removed from adapters to pay the claimants. However, there is a possibility for an attacker to manipulate the system by providing false data through the pregen_info parameter, which can force the vault to swap at very low prices. This can lead to a sandwich attack, where the attacker can buy PT at a fraction of its actual value and profit from the difference. The recommendation is to set the \_balanceAdapters call to `withdraw_only == true` to prevent this vulnerability. The bug has been fixed in the code.

## Details

**Details**

[AdapterVault.vy#L662](https://github.com/adapter-fi/AdapterVault/blob/3c2895a69ad5eb2c4be16d454f63a6f2f074f351/contracts/AdapterVault.vy#L662)

    self._balanceAdapters(claim_amount, pregen_info)

When claiming fees, funds must be removed from adapters to pay the claimants.

[PendleAdapter.vy#L313-L328](https://github.com/adapter-fi/AdapterVault/blob/3c2895a69ad5eb2c4be16d454f63a6f2f074f351/contracts/adapters/PendleAdapter.vy#L313-L328)

    pg: PregenInfo = empty(PregenInfo)
    if len(pregen_info) > 0:
        pg = _abi_decode(pregen_info, PregenInfo)
    else:
        #Info not provided, compute it expensively
        pg.approx_params_swapExactYtForPt = self.default_approx_params()
        pg.approx_params_swapExactTokenForPt = self.default_approx_params()
        ytToPTL: uint256 = 0
        pg.mint_returns, ytToPTL = self.estimate_mint_returns(asset_amount)
        pg.spot_returns = self.estimate_spot_returns(asset_amount)
        #we already paid the tax... why not reuse it...
        pg.approx_params_swapExactTokenForPt.guessOffchain = pg.spot_returns
        pg.approx_params_swapExactYtForPt.guessOffchain = ytToPTL

    #mint if minting price is better, then sell the YT.
    if pg.mint_returns > pg.spot_returns:

pregen_info allows the caller to provide data to control whether an adapter deposits via swapping or minting. This data must be trusted as it can force the vault to swap at very low prices. The proposer is NOT a trusted party and can easily abuse this.

The attack would be structured as follows on an imbalanced pool:

1. Swap a large amount of PT to asset to lower the price
2. Force vault to rebalance by swapping at low prices
3. Swap back into the pool and return the price to normal

Performing a sandwich attack allows the attacker to buy all the pools PT at a fraction of what they are worth to profit from the difference.

**Lines of Code**

[AdapterVault.vy#L645-L692](https://github.com/adapter-fi/AdapterVault/blob/3c2895a69ad5eb2c4be16d454f63a6f2f074f351/contracts/AdapterVault.vy#L645-L692)

**Recommendation**

The \_balanceAdapters call should be set to `withdraw_only == true`

**Remediation**

Fixed are recommended.
