---
tags:
  - lang/solidity
  - sector/oracle
  - has/github
  - severity/high
protocol: "[[Ufarm]]"
auditors:
  - Hexens
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-06-10-Ufarm.md"
genome:
  - "[[dos-resistance]]"
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
---
# [UFARM1-2] Quex callback can be permanently DoSed by congesting queues

- id: 62437
- impact: HIGH
- protocol: Ufarm
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-06-10-Ufarm.md

## Summary


The UFarmPool contract has a critical bug that allows an attacker to create a large number of deposit requests and cause the `quexCallback` function to run out of gas, leading to a denial of service (DoS) attack. This is due to unbounded loops in the handling of the deposit and withdrawal queues. The bug has been fixed by limiting the number of requests that can be handled in the `quexCallback` function. 

## Details

**Severity:** Critical

**Path:** main/contracts/pool/UFarmPool.sol:quexCallback (L881-1007)

**Description:** The UFarmPool contract uses the Quex Oracle to query off-chain information, namely the total value of the pool (`_totalCost`). 

Any deposit or withdrawal action will add this action to the corresponding queue (`depositQueue` and `withdrawQueue`) and fire a Quex request. The Quex core contract will call into `quexCallback` to resolve the request with the queried data.

The issue here however, is that `quexCallback` contains unbounded loops in the handling of the queues. More specifically, it will loop over the entire `depositQueue` and `withdrawQueue`, and execute each action in there:
```
requestsLength = depositQueue.length;
while (requestsLength > 0) {
    [..]
}
```
An attacker can arbitrarily create a large amount of deposit requests without the need for assets (the tokens are only transferred in the callback). As a result, the `quexCallback` will always revert with out-of-gas. The Quex flow currently has a constant gas limit of 1m gas, which can be easily filled.

Moreover, in the current implementation the deposit queue and withdraw queue can only be reduced/popped inside of the callback. So if it (forcibly) grows outside of maximum gas capabilities, then the pool would have no way of recovering from the DoS attack.
```
function quexCallback(uint256 receivedRequestId, DataItem memory response) external {
    [..]
    {
        uint256 sharesToMint;
        uint256 amountToInvest;
        uint256 totalDeposit;
        bytes32 depositRequestHash;
        QueueItem memory depositItem;

        requestsLength = depositQueue.length;
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

        highWaterMark += totalDeposit;
    }
    [..]
}
```

**Remediation:**  The `quexCallback` function should better manage gas limitations by only handling a maximum number of deposit/withdraw requests.

**Status:**  Fixed


- - -
