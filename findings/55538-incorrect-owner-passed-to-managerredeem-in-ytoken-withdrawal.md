---
tags:
  - lang/solidity
  - sector/stable
  - sector/staking
  - sector/vault
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Yieldfi]]"
auditors:
  - Immeas
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-04-24-cyfrin-yieldfi-v2.0.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[use-reentrancy-guard]]"
---
# Incorrect `owner` passed to `Manager::redeem` in YToken withdrawal flow

- id: 55538
- impact: HIGH
- protocol: Yieldfi
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-04-24-cyfrin-yieldfi-v2.0.md

## Summary


This bug report describes an issue with YieldFi's yield tokens, specifically with their withdrawal mechanism. The tokens use a central contract called the `Manager` to process withdrawal requests off-chain before executing them on-chain. However, there is a problem with the `YToken::_withdraw` and `YTokenL2::_withdraw` functions where the wrong address is passed to the `manager.redeem` function. This can cause issues when a third party initiates a withdrawal on behalf of another user, as the incorrect owner may be passed to `manager.redeem`. This can result in the withdrawal failing or, in a worst-case scenario, burning the wrong user's tokens. A proof of concept is provided to demonstrate the issue, and it is recommended to pass the correct `owner` to `manager.redeem` in both functions. This bug has been fixed in the latest commit, and it has been verified by another party. 

## Details

**Description:** YieldFi’s yield tokens (`YTokens`) implement a more complex withdrawal mechanism than a standard ERC-4626 vault. Instead of executing withdrawals immediately, they defer them to a central `Manager` contract, which queues the request for off-chain processing and later execution on-chain.

As with any ERC-4626 vault, third parties are allowed to initiate a withdrawal or redemption on behalf of a user, provided the appropriate allowances are in place.

However, in [`YToken::_withdraw`](https://github.com/YieldFiLabs/contracts/blob/40caad6c60625d750cc5c3a5a7df92b96a93a2fb/contracts/core/tokens/YToken.sol#L161-L172), the wrong address is passed to the `manager.redeem` function. The same issue is also present in [`YTokenL2::_withdraw`](https://github.com/YieldFiLabs/contracts/blob/40caad6c60625d750cc5c3a5a7df92b96a93a2fb/contracts/core/tokens/YTokenL2.sol#L170-L180):
```solidity
// Override _withdraw to request funds from manager
function _withdraw(address caller, address receiver, address owner, uint256 assets, uint256 shares) internal override nonReentrant notPaused {
    require(receiver != address(0) && owner != address(0) && assets > 0 && shares > 0, "!valid");
    require(!IBlackList(administrator).isBlackListed(caller) && !IBlackList(administrator).isBlackListed(receiver), "blacklisted");
    if (caller != owner) {
        _spendAllowance(owner, caller, shares);
    }
    // Instead of burning shares here, just redirect to Manager
    // The share burning will happen during order execution
    // Don't update totAssets here either, as the assets haven't left the system yet
    // @audit-issue `msg.sender` passed as owner
    IManager(manager).redeem(msg.sender, address(this), asset(), shares, receiver, address(0), "");
}
```

In this call, `msg.sender` is passed as the `owner` to `manager.redeem`, even though the correct `owner` is already passed into `_withdraw`. This works as expected when `msg.sender == owner`, but fails in delegated withdrawal scenarios where a third party is acting on the owner's behalf. In such cases, the `manager.redeem` call may revert, or worse, may burn the wrong user’s tokens if `msg.sender` happens to have shares.


**Impact:** When a third party initiates a withdrawal on behalf of another user (`caller != owner`), the incorrect owner is passed to `manager.redeem`. This can cause the call to revert, blocking the withdrawal. In a worst-case scenario, if `msg.sender` (the caller) also holds shares, it may result in unintended burning of their tokens instead of the intended owner's.

**Proof of Concept:** Place the following test in `yToken.ts` under `describe("Withdraw and Redeem")`, it should pass but fails with `"!balance"`:
```javascript
it("Should handle redeem request through third party", async function () {
  // Grant manager role to deployer for manager operations
  await administrator.grantRoles(MINTER_AND_REDEEMER, [deployer.address]);

  const sharesToRedeem = toN(50, 18); // 18 decimals for shares

  await ytoken.connect(user).approve(u1.address, sharesToRedeem);

  // Spy on manager.redeem call
  const redeemTx = await ytoken.connect(u1).redeem(sharesToRedeem, user.address, user.address);

  // Wait for transaction
  await redeemTx.wait();

  // to check if manager.redeem was called we can check the event of manager contract
  const events = await manager.queryFilter("OrderRequest");
  expect(events.length).to.be.greaterThan(0);
  expect(events[0].args[0]).to.equal(user.address); // owner, who's tokens should be burnt
  expect(events[0].args[1]).to.equal(ytoken.target); // yToken
  expect(events[0].args[2]).to.equal(usdc.target); // Asset
  expect(events[0].args[4]).to.equal(sharesToRedeem); // Amount
  expect(events[0].args[3]).to.equal(user.address); // Receiver
  expect(events[0].args[5]).to.equal(false); // isDeposit (false for redeem)
});
```

**Recommended Mitigation:** Pass the correct `owner` to `manager.redeem` in both `YToken::_withdraw` and `YTokenL2::_withdraw`, instead of using `msg.sender`.

**YieldFi:** Fixed in commit [`adbb6fb`](https://github.com/YieldFiLabs/contracts/commit/adbb6fb27bd23cdedccdaf9c1f484f7780cb354c)

**Cyfrin:** Verified. `owner` is now passed to `manager.redeem`.

\clearpage
