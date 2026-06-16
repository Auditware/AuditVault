---
tags:
  - lang/solidity
  - sector/lending
  - sector/options
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Lyra Finance]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/lyra-finance/review.pdf"
genome:
  - "[[liquidation-logic]]"
  - "[[frontrun]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# Bids Can Be Blocked By Sending Option To Liquidator

- id: 26268
- impact: HIGH
- protocol: [[Lyra Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/lyra-finance/review.pdf

## Summary


This bug report discusses an issue with the DutchAuction.sol contract which is integral to the proper operation of the Lyra protocol. This issue arises from the requirement that the bidder must only hold the cash asset when performing a bid. An attacker can exploit this requirement by frontrunning an executeBid() call and transferring a non-risk adding asset to the bidder right before the executeBid() function is called. This would cause the executeBid() function to revert, preventing liquidations from taking place. The attacker would only need to transfer 1 WEI of an asset to the bidder to perform this attack.

The development team has addressed this issue by adding an approval process to option and base assets before an asset can be transferred to a user. This has been addressed in pull request #263.

The second bug report discusses an issue with SVIlibrary which calculates volume based on a chosen strike price. Certain values from conﬁgured bounds of a,forwardPrice , taoand strike variables will result in reverts in getVol() function reading accepted volume data. This will prevent users from bidding in auctions on insolvent accounts, aﬀecting liquidations.

The development team has addressed this issue by implementing a check to prevent use of zero strike prices and certain bounds on kand w parameters within the LyraVolFeed.getVol(). This has been addressed in pull request #12.

In summary, two bug reports have been discussed. The first bug report is related to the DutchAuction.sol contract and the issue arises from the requirement that the bidder must only hold the cash asset when performing a bid. An attacker can exploit this requirement by frontrunning an executeBid() call and transferring a non-risk adding asset to the bidder. The development team has addressed this issue by adding an approval process to option and base assets before an asset can be transferred to a user. The second bug report is related to SVIlibrary which calculates volume based on a chosen strike price. The development team has addressed this issue by implementing a check to prevent use of zero strike prices and certain bounds on kand w parameters within the LyraVolFeed.getVol().

## Details

Description
It is possible to prevent liquidations by frontrunning an executeBid() call.
To provide context, liquidations through the DutchAuction.sol contract are integral to the proper operation of the
Lyra protocol. This is primarily due to their role in executing risk management processes - liquidating high-risk accounts
and, in turn, minimizing the risk of the protocol becoming insolvent.
The issue arises due to the requirement that the bidder must only hold the cash asset when performing a bid. This is
due to the high gas costs of performing a risk check during liquidation.
However due to this requirement, an attacker could transfer a non-risk adding asset to the bidder right before the
executeBid() function is called, through frontrunning their transaction. If this occurs, the executeBid() function will
revert, eﬀectively preventing liquidations from taking place.
The attacker would only need to transfer 1 WEI of an asset to the bidder to perform this attack. Additionally this attack
can be performed permissionlessly as the transfer of non-risk adding assets does not require asset allowances.
Recommendations
Consider allowing the bidder to hold other assets when bidding on an auction, and perform a risk check on the bidder
once all assets have been transferred.
Resolution
This issue has been addressed in pull request #263.
The development team has added an approval process to option and base assets before an asset can be transferred to
a user.
Page | 8
Lyra V2 Detailed Findings
LYRA-03 Denial-of-Service (DoS) During Manager Health Checks Aﬀects Liquidations
Asset SVI.sol ,LyraVolFeed.sol ,StandardManager.sol ,DutchAuction.sol ,
Status Resolved: See Resolution
Rating Severity: Critical Impact: High Likelihood: High
Description
Conﬁgured SVI feed bounds can cause denial-of-service (DoS) during Manager health checks, aﬀecting liquidations.
SVIlibrary calculates volume based on a chosen strike price. Certain values from conﬁgured bounds of a,forwardPrice ,
taoand strike variables will result in reverts in getVol() function reading accepted volume data. Reverts in SVI will
prevent users from bidding in auctions on insolvent accounts, aﬀecting liquidations.
Code comments located in the SVI.sol suggest that the following bounds are acceptable:
*@param strike desired strike for which to get vol for, in range [0, inf)
*@param a SVI parameter in range (-inf,inf)
*@param b SVI parameter in range [0, inf)
*@param rho SVI parameter in range (-1, 1)
*@param m SVI parameter in range (-inf,inf)
*@param sigma SVI parameter in range (0, inf)
*@param forwardPrice forward price in range [0, inf)
*@param tao time to expiry (in years )in range [0, inf)
However, the following exceptions will occur if parameters are set within these expected ranges:
•ifstrikePrice is set to zero, the function will revert with Overflow
•ifforwardPrice exceeds type(uint56).max , the function will revert with Overflow
•ifforwardPrice ortaoare set to zero, the function will revert with division by modulo 0
•ifais set to a negative non-zero number, the function will revert with SVI_InvalidParameters
Since a,forwardPrice and taovariables are set during calls to LyraVolFeed.acceptData() where the feed owner has
to approve signers to submit data, potential security implications are limited.
However, strike variable is controlled by those creating new options. If a user accepts an option with zero
value as strike price, it will cause an overﬂow in all LyraVolFeed.getVol() calculations. Subsequently, any call to
StandardManager.getMarginAndMarkToMarket() will fail as well due to volFeeds[marketId].getVol() call on line [ 679].
During bids on insolvent auctions, the DutchAuction contract makes a call to
ILiquidatableManager(manager).getMarginAndMarkToMarket(accountId, false, scenarioId) on line [ 676], which will
subsequently revert, preventing auctions on insolvent accounts to complete.
Page | 9
Lyra V2 Detailed Findings
Recommendations
Enforce forwardPrice ,taoand strike to only accept non-zero values within their expected range and ato be a positive
integer (including zero).
It is also recommended to revist all SVI parameters bounds to ensure there are no inconsistencies between expected
input into the library parameters and what values options might take on.
Resolution
The issue has been addressed in pull request #12.
The development team has implemented a check to prevent use of zero strike prices and certain bounds on kand w
parameters within the LyraVolFeed.getVol() .
The development team has also noted that the main issue surrounds extreme strike price values, as signers misbe-
haviour is a risk they accept within the overall system behaviour given the signers already hold a high trust assumption.
Page | 10
Lyra V2 Detailed Findings
LYRA-04 Liquidator Can Bid With Insuﬃcient Cash
