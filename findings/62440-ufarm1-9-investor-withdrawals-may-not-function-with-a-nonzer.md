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
  - "[[dos-resistance]]"
  - "[[use-reentrancy-guard]]"
---
# [UFARM1-9] Investor withdrawals may not function with a nonzero withdrawalLockupPeriod

- id: 62440
- impact: HIGH
- protocol: Ufarm
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-06-10-Ufarm.md

## Summary


This bug report is about a problem in the code that allows investors to withdraw their funds without following the correct steps. This can only happen if a certain condition is met, and it prevents investors from withdrawing their funds. The report suggests two ways to fix this issue and mentions that the problem has been resolved.

## Details

**Severity:** High

**Path:** contracts/main/contracts/pool/UFarmPool.sol#L517

**Description:** `UFarmPool::withdraw` allows for a permissionless two-step withdrawal process for non-member investors if a nonzero `withdrawalLockupPeriod` is set in the pool’s config. In this case, 
`_withdrawalRequests` parameters are first validated before a uniqueness check is performed on the request’s hash. If the hash is unique, then the hash and current `block.timestamp` are saved in the `pendingWithdrawalsRequests` mapping in the first call to withdraw. On the second call, the request’s unlock time is calculated. If the unlock time has passed, the pool’s status is changed to deactivating. 

By design, in either step of the withdrawal, the function will return before the withdrawal request is added to the withdrawal queue and `sendQuexRequest` is called. `ARCHITECTURE.md` states that after this, ”the actual withdrawal will be queued on a subsequent call or by the fund manager once assets are ready”.

However, this means that as long as `config.withdrawalLockupPeriod` is above zero, an investor’s withdrawal calls will always return before the request contents are queued. As `withdrawQueue.push` on line 537 can never be reached, the investor’s actual withdrawal request values are never recorded. This effectively prevents investors from withdrawing if `config.withdrawalLockupPeriod > 0`, requiring the pool’s config to be manually changed.
```
//contracts/main/contracts/pool/UFarmPool.sol#L496-L540
...
    function withdraw(
        SignedWithdrawalRequest calldata _withdrawalRequest
    ) external override ufarmIsNotPaused nonReentrant {
        _checkStatusForFinancing(false);
        IPoolAdmin.PoolConfig memory config = IPoolAdmin(poolAdmin).getConfig();

        if (msg.sender == ufarmFund) {
            withdrawQueue.push(
                QueueItem(
                    _withdrawalRequest.body.sharesToBurn,
                    keccak256(abi.encode(blockhash(block.number), totalSupply())),
                    msg.sender,
                    valueToken
                )
            );
        } else {
            uint256 sharesToBurn;
            address investor;
            bytes32 withdrawalRequestHash;
            (investor, sharesToBurn, withdrawalRequestHash) = validateWithdrawalRequest(_withdrawalRequest);

            if (config.withdrawalLockupPeriod > 0) {
                if (pendingWithdrawalsRequests[withdrawalRequestHash] == 0) {
                    // Set the withdrawal request timestamp
                    pendingWithdrawalsRequests[withdrawalRequestHash] = block.timestamp;
                    emit WithdrawRequestReceived(investor, withdrawalRequestHash, block.timestamp);
                } else {
                    // Check if the lockup period has passed
                    uint256 unlockTime = pendingWithdrawalsRequests[withdrawalRequestHash] +
                        config.withdrawalLockupPeriod;
                    if (block.timestamp < unlockTime) {
                        // Safe because of the check above
                        revert LockupPeriodNotPassed(unlockTime);
                    } else {
                        _changeStatus(PoolStatus.Deactivating);
                    }
                }
                return;
            }

            withdrawQueue.push(QueueItem(sharesToBurn, withdrawalRequestHash, investor, valueToken));
        }

        sendQuexRequest();
    }
...
```


**Remediation:**  As withdrawals are permitted regardless of pool status and the first investor to pass the unlock time changes the pool’s overall status to deactivating, consider either of the following mitigations:

To preserve the 2-step nature of investor withdrawals after a pool status has been set to deactivating, consider queueing the withdrawal if the pool status is already deactivating on the second call with withdrawal, similar to the following:
```
//contracts/main/contracts/pool/UFarmPool.sol#L496-L540
...
    function withdraw(
        SignedWithdrawalRequest calldata _withdrawalRequest
    ) external override ufarmIsNotPaused nonReentrant {
        ...
            if (config.withdrawalLockupPeriod > 0) {
               ...
                    if (block.timestamp < unlockTime) {
                        // Safe because of the check above
                        revert LockupPeriodNotPassed(unlockTime);
                    } else {
++                      if (status == PoolStatus.Deactivating) {
++                          withdrawQueue.push(QueueItem(sharesToBurn, withdrawalRequestHash, investor, valueToken));
++                          sendQuexRequest();
++                      }
++                      else {
++                          _changeStatus(PoolStatus.Deactivating);
                        }  
                    }
                }
                return;
            }
            withdrawQueue.push(QueueItem(sharesToBurn, withdrawalRequestHash, investor, valueToken));
        }

        sendQuexRequest();
    }
...
```
Alternatively, only execute the two-step check if the pool’s status is not deactivating given a lockup period. Note that this will effectively nullify other investor unlock times once the pool is in deactivation mode.
```
//contracts/main/contracts/pool/UFarmPool.sol#L496-L540
...
    function withdraw(
        SignedWithdrawalRequest calldata _withdrawalRequest
    ) external override ufarmIsNotPaused nonReentrant {
        ...
--            if (config.withdrawalLockupPeriod > 0) {
++            if (config.withdrawalLockupPeriod > 0 && (status != PoolStatus.Deactivating)) {
              ...
              }
              return;
            }

            withdrawQueue.push(QueueItem(sharesToBurn, withdrawalRequestHash, investor, valueToken));
        }

        sendQuexRequest();
    }
...
```

**Status:**   Fixed


- - -
