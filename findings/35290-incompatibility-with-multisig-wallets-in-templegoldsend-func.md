---
tags:
  - lang/solidity
  - platform/codehawks
  - has/poc
  - severity/high
  - sector/bridge
  - sector/multisig
protocol: "[[TempleGold]]"
auditors:
  - "[[n0kto]]"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Incompatibility with Multisig Wallets in `[[TempleGold]]::send` Function

- id: 35290
- impact: HIGH
- protocol: TempleGold
- reporter: n0kto (Codehawks)
- source: N/A

## Summary


The `TempleGold` smart contract has a bug that prevents users from transferring their tokens across different chains using the `send` function. This is a problem for users with multisig wallets, as these wallets often have different addresses on different chains. The bug is caused by a condition that checks if the sender's address matches the recipient's address, which fails for multisig wallet users. This restricts the usability of the contract and may deter users from adopting it. A proof of concept and recommendations for addressing the bug are provided. 

## Details

## Summary:

The `send` function in `TempleGold` smart contract is designed to facilitate cross-chain token transfers using LayerZero. However, it contains a restrictive condition that disallows transfers if the sender's address does not match the recipient's address. This creates a significant issue for users utilizing multisig wallets, as these wallets often have different addresses across different chains, preventing them from transferring their funds cross-chain.

## Vulnerability Detail:

The vulnerability lies in the address validation check: `if (msg.sender != _to) { revert ITempleGold.NonTransferrable(msg.sender, _to); }`. This condition ensures that the sender and the recipient addresses are identical, which is not the case for multisig wallets operating across different chains such as Ethereum and Arbitrum.

## Code Snippet:

```javascript
function send(
        SendParam calldata _sendParam,
        MessagingFee calldata _fee,
        address _refundAddress
    ) external payable virtual override(IOFT, OFTCore) returns (MessagingReceipt memory msgReceipt, OFTReceipt memory oftReceipt) {
        if (_sendParam.composeMsg.length > 0) { revert CannotCompose(); }
        /// cast bytes32 to address
        address _to = _sendParam.to.bytes32ToAddress();
        /// @dev user can cross-chain transfer to self
@>      if (msg.sender != _to) { revert ITempleGold.NonTransferrable(msg.sender, _to); }

        // @dev Applies the token transfers regarding this send() operation.
        (uint256 amountSentLD, uint256 amountReceivedLD) = _debit(
            msg.sender,
            _sendParam.amountLD,
            _sendParam.minAmountLD,
            _sendParam.dstEid
        );

        // @dev Builds the options and OFT message to quote in the endpoint.
        (bytes memory message, bytes memory options) = _buildMsgAndOptions(_sendParam, amountReceivedLD);

        // @dev Sends the message to the LayerZero endpoint and returns the LayerZero msg receipt.
        msgReceipt = _lzSend(_sendParam.dstEid, message, options, _fee, _refundAddress);
        // @dev Formulate the OFT receipt.
        oftReceipt = OFTReceipt(amountSentLD, amountReceivedLD);

        emit OFTSent(msgReceipt.guid, _sendParam.dstEid, msg.sender, amountSentLD, amountReceivedLD);
    }
```

## Impact:

This vulnerability prevents users of multisig wallets from performing cross-chain transfers of their tokens. The condition `if (msg.sender != _to)` fails for multisig wallet users due to differing addresses across chains, which:

* Restricts the usability of the contract for multisig wallet users.
* Limits the flexibility and accessibility of cross-chain token transfers.
* Potentially deters users from adopting the contract due to this inflexibility.

## Proof Of Concept:

1. User A, who owns a multisig wallet, attempts to transfer his temple tokens from Ethereum to Arbitrum using the `send` function.
2. The `send` function checks if the sender's address matches the recipient's address.
3. The condition `if (msg.sender != _to)` fails due to the differing addresses of the multisig wallet on Ethereum and Arbitrum.
4. The transaction reverts, preventing User A from completing the cross-chain transfer.

**Proof Of Code:**

Place the following code in the `TempleGoldLayerZero.t.sol` contract:

```javascript
    function test_FortisAudits_MultiSigWallet_LossFunds() public {
        address multisig_MainNet = makeAddr("multisig-mainnet"); // user's address
        address multisig_Arb = makeAddr("multisig-arb"); // user's same address which is undeployed in arbitrum
        vm.deal(multisig_MainNet, 100 ether);
        vm.deal(multisig_Arb, 100 ether);
        aTempleGold.mint(multisig_MainNet, 100 ether);
        uint256 tokensToSend = 1 ether;
        bytes memory options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(200_000, 0);
        SendParam memory sendParam =
            SendParam(bEid, addressToBytes32(multisig_Arb), tokensToSend, tokensToSend, options, "", "");

        MessagingFee memory fee1 = aTempleGold.quoteSend(sendParam, false);

        // If a msg.sender uses a mulitisig wallet in the destination chain, thus funds cannot be
        // transferred and DOS the user
        vm.startPrank(multisig_MainNet);
        vm.expectRevert(abi.encodeWithSelector(ITempleGold.NonTransferrable.selector, multisig_MainNet, multisig_Arb));
        aTempleGold.send{ value: fee1.nativeFee }(sendParam, fee1, multisig_MainNet);
        verifyPackets(bEid, addressToBytes32(address(bTempleGold)));
        vm.stopPrank();
    }
```

## Tools Used:

Manual code review

Foundry

## Recommendations:

1. **Remove or Modify Address Check**: Consider modifying or removing the restrictive address check to accommodate multisig wallet users. For example:

   ```javascript
   if (msg.sender != _to) {
     // Additional validation to check if msg.sender is a multisig wallet or other criteria
     // revert ITempleGold.NonTransferrable(msg.sender, _to);
   }
   ```

2. **Implement Whitelisting**: Implement a whitelisting mechanism for known multisig wallet addresses across chains to bypass the restrictive check.

3. **User Validation**: Introduce a more sophisticated user validation process that allows for different addresses on different chains but ensures the integrity of the cross-chain transfer.

By addressing this vulnerability, the contract will become more inclusive and practical for a broader range of users, particularly those using multisig wallets.
