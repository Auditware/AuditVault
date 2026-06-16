---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Ufarm]]"
auditors:
  - Hexens
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-06-10-Ufarm.md"
genome:
  - "[[signature-malleability]]"
  - "[[variant]]"
---
# [UFARM1-1] The approve top-up role can replay the same deposit/withdrawal request

- id: 62438
- impact: HIGH
- protocol: Ufarm
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-06-10-Ufarm.md

## Summary


This bug report discusses a problem with the `UFarmPool::approveDeposits()` function in the `UFarmPool.sol` contract. This function allows certain roles to approve multiple deposit requests, but there is a bug where duplicate requests can be executed multiple times, potentially pulling more funds from users than expected. This can be exploited by the deposit top-up role to misuse user funds. The report suggests adding validation or a check for completion status to prevent this issue. The bug has been fixed.

## Details

**Severity:** High

**Path:** contracts/main/contracts/pool/UFarmPool.sol#L404-L415
contracts/main/contracts/pool/UFarmPool.sol#L451-L461

**Description:** The `UFarmPool::approveDeposits()` function allows the approve top-up role (`Permissions.Pool.ApprovePoolTopup` & `Permissions.Fund.ApprovePoolTopup`) to approve multiple deposit requests. It validates each request and pushes them to the `depositQueue`, then executes all requests in that queue using `sendQuexRequest()`.
```
for (uint256 i; i < requestsLength; ++i) {
    try this.validateDepositRequest(_depositRequests[i]) returns (
        address investor,
        uint256 amountToInvest,
        bytes32 depositRequestHash,
        address bearerToken
    ) {
        depositQueue.push(QueueItem(amountToInvest, depositRequestHash, investor, bearerToken));
    } catch {
        continue;
    }
}
sendQuexRequest();
```
However, there is no check for duplicate requests in the loop, since the validation in the `validateDepositRequest()` function only verifies whether a request has been completed.
```
if (__usedDepositsRequests[depositRequestHash]) revert UFarmErrors.ActionAlreadyDone();
```
When all deposit requests in the `depositQueue` are executed in the `quexCallback()` function, there is no validation to prevent a completed request from being executed again. As a result, a deposit request may be executed multiple times, pulling more funds from the user than expected. The deposit top-up role could exploit this behavior to misuse user funds if the user has approved more than necessary.
```
while (requestsLength > 0) {
    // Validate each deposit request
    depositItem = depositQueue[requestsLength - 1];
    amountToInvest = depositItem.amount;
    investor = depositItem.investor;
    depositRequestHash = depositItem.requestHash;

    // Process the deposit
    try this.safeTransferToPool(investor, amountToInvest, depositItem.bearerToken) {
        sharesToMint = _mintSharesByQuote(investor, amountToInvest, _totalCost);

        // Adjust the total cost and total deposit
        _totalCost += amountToInvest;
        totalDeposit += amountToInvest;

        emit Deposit(investor, depositItem.bearerToken, amountToInvest, sharesToMint);

        if (depositRequestHash != bytes32(0)) {
            __usedDepositsRequests[depositRequestHash] = true;
            emit DepositRequestExecuted(investor, depositRequestHash);
        }
    } catch {
        depositQueue.pop();
        requestsLength = depositQueue.length;
        continue;
    }

    depositQueue.pop();
    requestsLength = depositQueue.length;
}
```
Similarly, the withdrawal top-up role can approve the same withdrawal request multiple times using approveWithdrawals(), potentially withdrawing more of the user's shares than expected.

**Remediation:**  There should be validation to prevent repeated requests in approveDeposits() and approveWithdrawals(), or a check for the completion status when executing requests in `quexCallback()`.

**Status:**  Fixed

- - -
