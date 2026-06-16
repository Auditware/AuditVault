---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Perennial]]"
auditors:
  - "[[WATCHPUG]]"
report: "https://github.com/sherlock-audit/2023-07-perennial-judging"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
  - "[[pyth-oracle-completeness]]"
  - "[[timestamp-dependence]]"
---
# H-1: Oracle request timestamp and pending position timestamp mismatch can make most position updates invalid

- id: 24299
- impact: HIGH
- protocol: [[Perennial]]
- reporter: WATCHPUG (Sherlock)
- source: N/A

## Summary


This bug report is about the Oracle request timestamp and pending position timestamp mismatch which can make most position updates invalid. When a new pending position is added, its timestamp is set to `currentTimestamp` returned by oracle's `status` function, which is a timestamp at certain granularities rounding up into the future, which means that most of the time it's greater than `block.timestamp`. However, when `request` is called for the oracle, the request timestamp is set to `block.timestamp`. This mismatch leads to invalid oracle versions, completely breaking the protocol's functionality. 

The impact of this bug is unexpectedly long position commit times and possible funds loss due to this. For example, if User A opens a position long = 1 at timestamp = 100, and User B opens a position at timestamp = 10100, User A will only be filled when the next user trades after him, which happens much later than expected with a very different price, resulting in unexpected losses. Furthermore, this bug can lead to a bank run and loss of funds for users due to desync of global and local positions. 

The code snippet section explains the details of the bug. Oracle `status()` returns timestamp which is in the future, and pending position's timestamp is taken from oracle `status()`. PythOracle `request()` stores `block.timestamp` in the request list (called `versionList`), and PythOracle `commitRequested()` sets price at `versionList` timestamp. 

The bug was fixed via a pull request. The recommendation is to make timestamp of pending positions and timestamp of oracle request match. Record `current()` as a timestamp for the `request()`.

## Details

Source: https://github.com/sherlock-audit/2023-07-perennial-judging/issues/42 

## Found by 
KingNFT, WATCHPUG, minhtrng, panprog

When a new pending position is added, its timestamp is set to `currentTimestamp` returned by oracle's `status` function, which is a timestamp at certain granularities rounding up into the future, which means that most of the time it's greater than `block.timestamp`. However, when `request` is called for the oracle, the request timestamp is set to `block.timestamp`. Due to this mismatch, when the oracle price is commited, it is commited with request's timestamp, but when the position is settled, it tries to read the price at position's timestamp, which is a different time. As such, if the oracle price is commited for each request, it's still easily possible that all pending positions will have invalid oracle versions, completely breaking the protocol's functionality.

## Vulnerability Detail

An example of what happens exactly:

1. PythOracle granularity is set to 100.
2. User opens position at timestamp = 101. Pending position is stored with timestamp = 200 (because PythOracle returns currentTimestamp = 200)
3. At the same time `oracle.request()` is called, which stores 101 (current timestamp) into `versionList`
4. User calls `oracle.commitRequested()`, which stores current price into `_prices[101]`
5. Later when that pending position is settled, it requests `oracle.at(200)` which doesn't have a price set (is invalid).

The same will happen to all pending positions - so most of them will easily be invalid, which will completely break the protocol and cause all kinds of problems due to pending positions being invalid and not updating profit and loss properly.

## Impact

The most straightforward impact is unexpectedly long position commit times and possible funds loss due to this, if the oracle commit flow is the normal expected flow (only commit requested versions). For example:
T=1:   User A requests to open position long = 1. Position timestamp = 100. Oracle request timestamp = 1
T=15:  Oracle commits requested version at timestamp = 1, price = $100.
T=10010: User B requests to open position. Position timestamp = 10100. Oracle request timestamp = 10010
T=10025: Oracle commits requested version at timestamp = 10010, price = $110.

User A expects to be filled at price close to $100. However, he's only filled when the next user trades after him, which happens much later than expected with a very different price ($110), so User A has lost $10 unexpectedly. Basically, each user will only be settled when the next user trades. In quiet markets this can lead to very long settlement times and very bad prices for users.

User A, however, can notice these long waiting times and can fix it by voluntary commiting non-requested versions. For example, he can commit at T=120 and be filled with the correct price. However, this will mean that all commits must be made non-requested, thus they will not be rewarded with the keeper fees. So the user will pay keeper fees when trading, but will also be forced to lose gas fees for oracle commits, so either broken and long waiting times, or broken oracle non-rewarded updates: both are high impacts.

Another impact is completely broken internal accounting due to a lot of invalid oracle versions. There is a different bug reported by me about desync of global and local positions during invalid oracles. This bug, when coupled with the desync of global and local positions, will lead to catastrophic consequences and complete breakage of accounting of collateral, bank run and loss of funds for users. Scenario of what can (and will) happen:
User B has active open position maker=2 with collateral = 100
T=99: User A opens long=1 with collateral=100: update(0,1,0,100) (pending position timestamp = 100)
T=101: User A decides to close: update(0,0,0,0) (pending position timestamp = 200)
T=130: Oracle commited for timestamp=110, price = $100 (user A position at timestamp = 100 is invalid)
T=150: User B settles: update(2,0,0,0)
T=220: Oracle commited for timestamp=205, price = $90
after settlement of user A and user B:
user A will have collateral = $100 (local pending position long = 1 at timestamp = 100 will be invalidated and ignored)
user B will have collateral = $110 (global pending position long = 1 will be current at timestamp 110 and accumulate pnl from timestamp 110 to timestamp=205)

So total deposit of both users is $100 + $100 = $200
Total collateral in the end: $100 + $110 = $210
But protocol only has $200 in funds, so users will be unable to withdraw everything, which can cause bank run and loss of funds for the last user.

Such situations will happen all the time by themselves due to lots of invalid oracle versions, so this will mess up accounting completely.

For the details of this bug, you can refer to my other report.

## Code Snippet

1. Oracle `status()` returns timestamp which is in the future.

Oracle `status()` returns timestamp directly from current provider's `status()`:
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/Oracle.sol#L47

PythOracle `status()` timestamp is taken from `current()`, which in turn returns `current()` from PythFactory:
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/pyth/PythOracle.sol#L101

PythFactory `current()` returns timestamp which is granulated into the future using ceilDiv, which rounds up:
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory.sol#L76

2. Pending position's timestamp is taken from oracle `status()`.

`context.currentTimestamp` is set to timestamp from `oracle.status()`:
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L312
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L575

New pending positions (global and local) timestamp is set to `context.currentTimestamp`:
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L267-L269

And `request()` from oracle is done at the same time:
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L284

3. PythOracle `request()` stores `block.timestamp` in the request list (called `versionList`) (**not** `current()` timestamp):
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/pyth/PythOracle.sol#L77-L81

4. PythOracle `commitRequested()` sets price at `versionList` timestamp (i.e. `block.timestamp` at the time `request()` was made)

`versionToCommit` is stored request's timestamp:
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/pyth/PythOracle.sol#L135

The commit price is stored at the `versionToCommit` timestamp:
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/pyth/PythOracle.sol#L154
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/pyth/PythOracle.sol#L202-L203

## Tool used

Manual Review

## Recommendation

Make timestamp of pending positions and timestamp of oracle request match. Record `current()` as a timestamp for the `request()`:
```solidity
 function request(address) external onlyAuthorized { 
     uint nextTimestamp = current();
     if (versionList.length == 0 || versionList[versionList.length - 1] < nextTimestamp) { 
         versionList.push(nextTimestamp);
     } 
 } 
```



## Discussion

**sherlock-admin**

1 comment(s) were left on this issue during the judging contest.

**__141345__** commented:
> h



**arjun-io**

Fixed via: https://github.com/equilibria-xyz/perennial-v2/pull/57
