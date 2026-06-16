---
tags:
  - lang/solidity
  - sector/oracle
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - fix/use-multi-oracle
protocol: "[[Vader Protocol]]"
auditors:
  - "[[WATCHPUG]]"
report: "https://code4rena.com/reports/2021-11-vader"
genome:
  - "[[manipulable-twap]]"
  - "[[use-multi-oracle]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-04] TwapOracle doesn't calculate VADER:USDV exchange rate correctly

- id: 42334
- impact: HIGH
- protocol: [[Vader Protocol]]
- reporter: WatchPug (Code4rena)
- source: https://code4rena.com/reports/2021-11-vader

## Summary


This bug report, submitted by TomFrenchBlockchain, discusses an issue found in the code for the Vader project. The impact of this finding is described in detail, and a proof of concept is provided to show where the issue is located in the code. The bug appears to be in the calculation for the exchange rate, as it is not properly accounting for the number of decimals in the token. This is marked as a high severity issue, as the exchange rate is used in a minting mechanism and the correctness of the oracle is important for the project. The recommended mitigation steps for this bug are to replace the incorrect line of code with the correct one. The project lead, SamSteinGG, has confirmed the issue and stated that the TWAP oracle module has been removed and redesigned from scratch for the new audit.

## Details

_Submitted by TomFrenchBlockchain_

#### Impact

Detailed description of the impact of this finding.

#### Proof of Concept

<https://github.com/code-423n4/2021-11-vader/blob/3a43059e33d549f03b021d6b417b7eeba66cf62e/contracts/twap/TwapOracle.sol#L156>

On L156 of `TwapOracle` we perform the calculation:

    result = ((sumUSD * IERC20Metadata(token).decimals()) / sumNative);

This seems extremely odd as for an 18 decimal token we're then calculating

    result = ((sumUSD * 18) / sumNative);

This is just plain weird. I expect what was meant is to replace this line with the below so we're properly scaling for `token`'s number of decimals.

    uint256 scalingFactor = 10 ** IERC20Metadata(token).decimals()
    result = (sumUSD * scalingFactor) / sumNative;

Marked as high severity as this exchange rate appears to be used in [some form of minting mechanism](https://github.com/code-423n4/2021-11-vader/blob/3a43059e33d549f03b021d6b417b7eeba66cf62e/contracts/tokens/Vader.sol#L18-L19) and correctness of the oracle is listed as one of the key focuses of the audit.

#### Recommended Mitigation Steps

As above.

**[SamSteinGG (Vader) confirmed](https://github.com/code-423n4/2021-11-vader-findings/issues/19)**
> The TWAP oracle module has been completely removed and redesigned from scratch as LBTwap that is subject of the new audit.
