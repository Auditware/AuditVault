---
tags:
  - lang/solidity
  - sector/streaming
  - sector/token
  - platform/quantstamp
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[TokenOps]]"
auditors:
  - "[[Ruben Koch]]"
report: "https://certificate.quantstamp.com/full/token-ops/ee355b11-cb77-4c5a-b5f3-6bb3ebaf4536/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[timestamp-dependence]]"
---
# Vested, Unclaimed Tokens Become Frozen Once Admin Revokes the Grant

- id: 59721
- impact: HIGH
- protocol: [[TokenOps]]
- reporter: Ruben Koch (Quantstamp)
- source: https://certificate.quantstamp.com/full/token-ops/ee355b11-cb77-4c5a-b5f3-6bb3ebaf4536/index.html

## Summary


This bug report discusses an issue with the `TokenVesting.sol` file, where a user's revoked grant makes it impossible for them to withdraw their vested tokens. This occurs because the `isActive` flag is set to false during the revocation process, preventing the user from calling the `withdraw()` function. As a result, the user's vested tokens become stuck in the contract and cannot be withdrawn or assigned to new grants. The report provides a demonstration of this issue and suggests two possible solutions: allowing the `withdraw()` function to be called even with a revoked grant or revising the `revokeGrant()` function to transfer the vested tokens to the grant recipient. 

## Details

**Update**
Marked as "Fixed" by the client. The revoked grant can still be claimed by the original user now. Addressed in: `69baa49024fd33c181f2f0cbcd8ddcd26de3cf38`.

**File(s) affected:**`TokenVesting.sol`

**Description:** An admin can revoke a grant through function `revokeGrant()`, resulting in the vesting being stopped and all yet unvested tokens being freed to be used for other grants. Importantly, the unvested, yet unwithdrawn tokens by end-users should still be able to be withdrawn by them, as the user has rightfully vested all tokens until then.

However, this becomes impossible, as the user becomes unable to call the `withdraw()` function, as the modifier in the `hasActiveGrant()` function requires the `isActive` field to be `true` for a given user. This is however set to false during the revocation process.

These vested, but unwithdrawn funds, therefore, become stuck in the contract, as these funds are contained in the sum of reserved tokens `numTokensReservedForVesting` for granted users, but are non-withdrawable by the user with the revoked grant, as they are not able to perform any withdrawals anymore. Notice that the `isActive` flag can also never be toggled again to true, making the vested, unwithdrawn funds permanently stuck.

**Exploit Scenario:** (1) A user receives a grant. For simplicity, assume cliffAmount = 0 and linearVestingAmount = 100 with a vesting duration of 4 years, starting now. (2) Half way through the vesting, the grant is revoked by the admin via revokeGrant(). _grant.isActive() is set to false, _grant.deactivationTimestamp is set to block.timestamp. vestedSoFarAmt will be equal to 50, as, after 2 years, 50 tokens have been vested. Therefore, amountRemaining will be 100 - 50 = 50, which is correctly deducted from numTokensReservedForVesting, i.e. the unvested amount is freed again to be used for other grants. (3) The revoked grantee attempts to withdraw the two years' worth of vesting the accumulated before their grant was revoked. However, when calling the withdraw() function, the hasActiveGrant() modifier will cause the function to revert, as its second require() check will fail due to the grant being inactive. (4) The 50 vested tokens will therefore be stuck, not freeable to be assigned to new grants, and not withdrawable by the eligible grantee.

The PoC below demonstrates the above-mentioned process:

```
describe("Exploit Showcase", async function () {
it('Correctly vested, yet not withdrawn funds become permanently stuck in contract once claim is revoked', async () => {

  const [, owner2] = await ethers.getSigners();

  //Mostly taken from H-01 from https://code4rena.com/reports/2022-09-vtvl

  /** INITIAL SETUP */
  const {tokenContract, vestingContract} = await createPrefundedVestingContract({tokenName, tokenSymbol, initialSupplyTokens});
  const startTimestamp = await getLastBlockTs() + 100;
  const endTimestamp = startTimestamp + 2000;
  const terminationTimestamp = startTimestamp + 1000 + 50; // half-way vesting, plus half release interval which shall be discarded
  const releaseIntervalSecs = 100;

  /** No cliff, 100 tokens to vest */
  const cliffReleaseTimestamp = 0 ;
  const cliffAmount = 0;
  const linearVestAmount = 100; //let's ignore crazy decimals

  //** Pre claim, admin can has no tokens reserved
  expect(await vestingContract.numTokensReservedForVesting()).to.be.equal(0);
  await vestingContract.createGrant(owner2.address, startTimestamp, endTimestamp, cliffReleaseTimestamp, releaseIntervalSecs, linearVestAmount, cliffAmount);

  //** Post claim, the reserved tokens equals the one claim, i.e the admin can no longer use these funds for other grants
  expect(await vestingContract.numTokensReservedForVesting()).to.be.equal(linearVestAmount + cliffAmount);

  // move clock to termination timestamp (half-way the vesting period plus a bit, but less than release interval seconds)
  await ethers.provider.send("evm_mine", [terminationTimestamp]);

  /** Half of total vesting amount could be claimed... */
  expect(await vestingContract.claimableAmount(owner2.address)).to.be.equal(50); 

  /** REVOKE CLAIM: revoke the claim preserving the "already vested but not yet withdrawn amount" */
  await (await vestingContract.revokeGrant(owner2.address)).wait();

  /** Even though claim is revoked, the employee should continue to be able to withdraw half the total vested amount */
  expect(await vestingContract.claimableAmount(owner2.address)).to.be.equal(50); 

  /** Attempt withdrawal of already vested tokens */
  let userBalanceBefore = await tokenContract.balanceOf(owner2.address);

  /** Even though eligible, the withdraw attempt WILL REVERT */
  await expect(vestingContract.connect(owner2).withdraw()).to.be.revertedWith('NO_ACTIVE_GRANT'); 
  let userBalanceAfter = await tokenContract.balanceOf(owner2.address);

  /** BALANCES WERE AND REMAIN ZERO after withdrawal */
  expect(userBalanceBefore).to.be.equal(0);
  expect(userBalanceBefore).to.be.equal(userBalanceAfter);

  /** Even though the employee can not withdraw their vesting, the admin can also not use it! The half that the user was supposed to withdraw is stuck */
  expect(await vestingContract.numTokensReservedForVesting()).to.be.equal(50);

  });
});
```

**Recommendation:** We provide two possible fixes: (1) The `withdraw()` function should be callable even with a revoked grant, so former grantees can withdraw the remaining difference. (2) The `revokeGrant()` function should be revised to actively transfer the vested yet unwithdrawn tokens to the grant recipient.
