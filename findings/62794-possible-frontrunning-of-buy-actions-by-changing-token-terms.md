---
tags:
  - lang/solidity
  - sector/nft
  - sector/nft-marketplace
  - sector/stable
  - sector/token
  - platform/quantstamp
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
protocol: "[[Camp]]"
auditors:
  - "[[Paul Clemson]]"
report: "https://certificate.quantstamp.com/full/camp-nft/94cdb738-1a01-4f6c-8632-3bdec427161e/index.html"
genome:
  - "[[fee-manipulation]]"
  - "[[fee-theft]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[royalty-edge-cases]]"
---
# Possible Frontrunning of Buy Actions by Changing Token Terms

- id: 62794
- impact: HIGH
- protocol: [[Camp]] - NFT
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/camp-nft/94cdb738-1a01-4f6c-8632-3bdec427161e/index.html

## Summary


A bug has been found in the marketplace contract when buying token access. The terms for purchasing access can be changed by the token owner at any time, which can be exploited by changing the subscription price, duration, or payment token. This can result in the loss of native tokens and the potential for the token owner to receive more payment than expected. To fix this issue, the marketplace should check for native payments and implement term commitment by requiring buyers to specify expected terms and validating that they haven't changed. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `b09852d0c0cb9cae668cc523e1fc1e25a58da097`.

**File(s) affected:**`Marketplace.sol`

**Description:** Token access can be bought via the marketplace according to the conditions outlined in the token `terms`. These terms can be updated by the token owner at any point using the `updateTerms()` function. Despite classical frontrunning being mitigated by the private mempool of the Camp network, this can be exploited by speculatively or accidentally frontrunning a call to `buyAccess()` and changing the subscription price, duration, or payment token.

Payment can be made in either native or wrapped wCAMP tokens. In the case of wrapped tokens, the `buyAccess()` function in the marketplace does not check if native tokens were sent as well. If the payment token is changed to use wCAMP before the buy operation is executed, the transaction may consume both native and wrapped assets if the marketplace has sufficient approval for payment in wrapped tokens. The transaction will not revert, and the native tokens are lost in the marketplace.

Similarly, the duration of the subscription could be lowered to extract more value per timeframe, or the price updated to the current approval between buyer and marketplace.

Finally, when purchasing with ERC-20 tokens, the `_routeTokenPayment()` function transfers tokens directly from the buyer. IP owners may be able to expect incoming buy transactions, and exploit them by calling `updateTerms()` to increase the price to match the buyer's full token approval, effectively stealing all approved tokens rather than just the expected subscription price.

**Exploit Scenario:**

 Exploit A, updating the payment token:

1.   Mallory mints token 1 with payments in native token. 
2.   Bob submits transaction to buy access to token 1, sending along the payment in native tokens. 
3.   Mallory frontruns this transaction, and updates the terms to payment in wCAMP, with a price equal to the approval of Bob to the marketplace.
4.   Bobs' transaction is executed, according to the new price all approved wCAMP are send to Mallory, and the original native payment is lost. 

Exploit B, changing the price to exploit approvals:

1.   Alice wants to buy access to Bob's IP priced at 100 USDC for 30 days 
2.   Alice approves 1000 USDC to the Marketplace contract (perhaps for multiple purchases) 
3.   Alice submits `buyAccess(alice, tokenId)` expecting to pay 100 USDC 
4.   Bob monitors the mempool and detects Alice's transaction 
5.   Bob front-runs with `updateTerms(tokenId, newTerms)` where `newTerms.price = 1000 USDC`
6.   Alice's transaction executes with the manipulated terms 
7.   `_routeTokenPayment()` calls `SafeTransferLib.safeTransferFrom(token, msg.sender, treasury, protocolFee)` and transfers Alice's entire 1000 USDC approval 
8.   Bob receives the majority of the 1000 USDC as royalty payments instead of the expected 100 USDC

**Recommendation:** This issue has two causes, firstly that the marketplace does not check native payments, and secondly that terms may change after a buy transaction has been submitted. Therefore, there's two parts:

1.   In the `buyAccess()` function, ensure that `msg.value == 0` in case of wCAMP payments. 
2.   Additionally, implement term commitment by requiring buyers to specify expected terms and validate they haven't changed: 

```
function buyAccess(
    address buyer, 
    uint256 tokenId,
    uint256 expectedPrice,
    uint32 expectedDuration,
    address expectedPaymentToken
) external payable whenNotPaused {
    ...
    IpNFT.LicenseTerms memory terms = ipToken.getTerms(tokenId); // <-- retrieve and validate current terms
    if (terms.price != expectedPrice ||
        terms.duration != expectedDuration ||
        terms.paymentToken != expectedPaymentToken) {
        revert TermsMismatch();
    }
    ...
}
```
