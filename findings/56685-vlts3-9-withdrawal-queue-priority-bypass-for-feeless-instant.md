---
tags:
  - lang/solidity
  - sector/token
  - has/github
  - severity/high
protocol: "[[Valantis]]"
auditors:
  - Hexens
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-03-17-Valantis.md"
genome:
  - "[[reentrancy-guard]]"
  - "[[use-reentrancy-guard]]"
---
# [VLTS3-9] Withdrawal queue priority bypass for feeless instant withdrawal

- id: 56685
- impact: HIGH
- protocol: Valantis
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-03-17-Valantis.md

## Summary


This bug report describes a problem where the withdrawal process for a certain token is not working correctly. This is a serious issue that could cause users to lose their funds. The problem occurs because the system does not properly track when withdrawals can be made, and it does not take into account the size of the withdrawals. As a result, some users are able to bypass the queue and make feeless instant withdrawals, while others may not be able to withdraw their funds at all. This issue has been fixed by updating the system to properly track withdrawal requests and ensure that users have the right to claim their funds.

## Details

**Severity:** High

**Description:** When a `Withdrawal` is created, it references the `cumulativeAmountToken1ClaimableLPWithdrawalCheckpoint` pointer to track when a claim is allowed, according to the existing withdrawal queue.
```
  LPWithdrawals[idLPWithdrawal] = LPWithdrawalRequest({
      recipient: _recipient,
      amountToken1: amountToken1.toUint96(),
      cumulativeAmountToken1ClaimableLPWithdrawalCheckpoint: cumulativeAmountToken1ClaimableLPWithdrawal
  });
```
However, `cumulativeAmountToken1ClaimableLPWithdrawal` only gets updated after a call to the `update` function and only if the HYPE was received from the Overseer. So any withdrawal request made after another one while it's not claimable yet are in the same queue at the same cumulative amount:
```
if (address(this).balance <= amountToken1ClaimableLPWithdrawalCache) {
        amountToken1ClaimableLPWithdrawal = address(this).balance;
        return;
}
```
Moreover, it does not keep withdrawal sizes in mind. If a user withdraws 100 ETH, and the `cumulativeAmountToken1ClaimableLPWithdrawalCheckpoint` is X, they can claim the withdrawal at X + 100.

The following logic allows smaller deposits to be bypass the priority queue and effectively gain feeless instant withdrawals of their stHYPE to HYPE.
```
if (
    cumulativeAmountToken1ClaimableLPWithdrawal
        < request.cumulativeAmountToken1ClaimableLPWithdrawalCheckpoint + request.amountToken1
) {
    revert stHYPEWithdrawalModule__claim_cannotYetClaim();
}
```
Consider the following situation:

1. User 1 withdraws 10 ETH (`cumulativeAmountToken1ClaimableLPWithdrawalCheckpoint = X`), so they can withdraw at  `X + 10`.

2. The burn request is filled and redeemed, the Overseer sends 10 ETH to the Withdrawal Module.

3. User 2 withdraws 1 ETH.

4. Update is now called and fills 10 ETH.

5. User 2 can claim.

6. User 1 can claim but reverts due to not enough funds (only 9 ETH available).
```
    function burnToken0AfterWithdraw(uint256 _amountToken0, address _recipient)
        external
        override
        onlySTEX
        nonReentrant
    {
        // stHYPE is rebase, hence to need for conversion
        uint256 amountToken1 = _amountToken0;

        amountToken1PendingLPWithdrawal += amountToken1;

        emit LPWithdrawalRequestCreated(idLPWithdrawal, amountToken1, _recipient);

        LPWithdrawals[idLPWithdrawal] = LPWithdrawalRequest({
            recipient: _recipient,
            amountToken1: amountToken1.toUint96(),
            cumulativeAmountToken1ClaimableLPWithdrawalCheckpoint: cumulativeAmountToken1ClaimableLPWithdrawal
        });
        idLPWithdrawal++;
    }
```

**Remediation:**  The creation of the LP withdrawal request should only take the order into account, e.g. by keeping a cumulative withdrawn amount that can then be used in `claim` to ensure that the claimer has the rights to the claimable ETH.

**Status:**   Fixed


- - -
