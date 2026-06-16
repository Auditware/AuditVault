---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Blueberry]]"
auditors:
  - "[[Vagner]]"
report: "https://github.com/sherlock-audit/2023-07-blueberry-judging"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-freshness]]"
---
# H-2: CurveTricryptoOracle incorrectly assumes that WETH is always the last token in the pool which leads to bad LP pricing

- id: 24317
- impact: HIGH
- protocol: [[Blueberry]]
- reporter: Vagner (Sherlock)
- source: N/A

## Summary


A bug report has been identified in the CurveTricryptoOracle.sol code which incorrectly assumes that WETH is always the last token in the pool. This issue was found by 0x52 and Vagner and can lead to LP being highly overvalued. The code snippet from the CurveTricryptoOracle.sol file which is causing the issue is located at line 53-63. This issue can cause LP to be massively overvalued, leading to overborrowing and protocol insolvency. A manual review was used to identify this bug. 

The recommended resolution to this issue is to not assume that WETH is the last token in the pool and instead pull the price for each asset and input it into lpPrice. The bug report was escalated by 0x52, who noted that this issue could cause a large number of tricrypto pools to be overvalued, which presents a serious risk to the protocol. Shogoki agreed with the escalation and noted that #98 was the duplicate with #20 and #105 was duplicate with #42. Hrishibhat concluded that this is a valid high issue. Finally, the escalations were successfully resolved.

## Details

Source: https://github.com/sherlock-audit/2023-07-blueberry-judging/issues/98 

## Found by 
0x52, Vagner

CurveTricryptoOracle assumes that WETH is always the last token in the pool (`tokens[2]`). This is incorrect for a majority of tricrypto pools and will lead to LP being highly overvalued.

## Vulnerability Detail

[CurveTricryptoOracle.sol#L53-L63](https://github.com/sherlock-audit/2023-07-blueberry/blob/main/blueberry-core/contracts/oracle/CurveTricryptoOracle.sol#L53-L63)

        if (tokens.length == 3) {
            /// tokens[2] is WETH
            uint256 ethPrice = base.getPrice(tokens[2]);
            return
                (lpPrice(
                    virtualPrice,
                    base.getPrice(tokens[1]),
                    ethPrice,
                    base.getPrice(tokens[0])
                ) * 1e18) / ethPrice;
        }

When calculating LP prices, CurveTricryptoOracle#getPrice always assumes that WETH is the second token in the pool. This isn't the case which will cause the LP to be massively overvalued.

There are 6 tricrypto pools currently deployed on mainnet. Half of these pools have an asset other than WETH as token[2]:

        0x4ebdf703948ddcea3b11f675b4d1fba9d2414a14 - CRV
        0x5426178799ee0a0181a89b4f57efddfab49941ec - INV
        0x2889302a794da87fbf1d6db415c1492194663d13 - wstETH

## Impact

LP will be massively overvalued leading to overborrowing and protocol insolvency

## Code Snippet

[CurveTricryptoOracle.sol#L48-L65](https://github.com/sherlock-audit/2023-07-blueberry/blob/main/blueberry-core/contracts/oracle/CurveTricryptoOracle.sol#L48-L65)

## Tool used

Manual Review

## Recommendation

There is no need to assume that WETH is the last token. Simply pull the price for each asset and input it into lpPrice.





## Discussion

**IAm0x52**

Escalate

This is not a dupe of #105. This will cause a large number of tricrypto pools to be overvalued which presents a serious risk to the protocol.

**sherlock-admin2**

 > Escalate
> 
> This is not a dupe of #105. This will cause a large number of tricrypto pools to be overvalued which presents a serious risk to the protocol.

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**Shogoki**

Agree. 
This is not a duplicate of #105 
This can become its own main report and #20 is a duplicate of it.

There were some issues with (de)duplication. I would resolve like this.
#98 is the duplicate with #20 
#105 is duplicate with #42 

**hrishibhat**

Result:
High 
Has duplicates
This is a valid high issue based on the description

**sherlock-admin2**

Escalations have been resolved successfully!

Escalation status:
- [IAm0x52](https://github.com/sherlock-audit/2023-07-blueberry-judging/issues/98/#issuecomment-1694746548): accepted
