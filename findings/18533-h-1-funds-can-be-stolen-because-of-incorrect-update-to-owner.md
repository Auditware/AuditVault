---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Y2K]]"
auditors:
  - "[[zeroknots]]"
report: "https://github.com/sherlock-audit/2023-03-Y2K-judging"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[oracle-freshness]]"
  - "[[circuit-input-range-check]]"
---
# H-1: Funds can be stolen because of incorrect update to `ownerToRollOverQueueIndex` for existing rollovers

- id: 18533
- impact: HIGH
- protocol: [[Y2K]]
- reporter: zeroknots (Sherlock)
- source: N/A

## Summary


This bug report is about a vulnerability found in the code of Y2K-Finance's Earthquake protocol. The vulnerability was discovered by a team of auditors, including 0Kage, 0x52, 0xMojito, 0xPkhatri, 0xRobocop, 0xnirlin, AlexCzm, Aymen0909, Bauer, Ch_301, Dug, ElKu, Emmanuel, HonorLt, Junnon, Respx, TrungOre, VAD37, ast3ros, auditor0517, berndartmueller, bin2chen, cccz, charlesjhongc, ck, climber2002, csanuragjain, datapunk, evan, hickuphh3, holyhansss, iglyx, immeas, jasonxiale, joestakey, kenzo, libratus, ltyu, minhtrng, mstpr-brainbot, ne0n, pfapostol, roguereddwarf, shaka, sinarette, spyrosonic10, toshii, twicek, volodya, warRoom, yixxas, and zeroknots.

The vulnerability is related to the `ownerToRollOverQueueIndex` variable, which incorrectly updates to the last queue index in the case where the owner has an existing rollover. This causes the `notRollingOver` check to be performed on the incorrect `_id`, which then allows the depositor to withdraw funds that should've been locked.

The code snippet responsible for the vulnerability is located at https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L252-L257 and https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L268 and https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L755-L760.

The

## Details

Source: https://github.com/sherlock-audit/2023-03-Y2K-judging/issues/2 

## Found by 
0Kage, 0x52, 0xMojito, 0xPkhatri, 0xRobocop, 0xnirlin, AlexCzm, Aymen0909, Bauer, Ch\_301, Dug, ElKu, Emmanuel, HonorLt, Junnon, Respx, TrungOre, VAD37, ast3ros, auditor0517, berndartmueller, bin2chen, cccz, charlesjhongc, ck, climber2002, csanuragjain, datapunk, evan, hickuphh3, holyhansss, iglyx, immeas, jasonxiale, joestakey, kenzo, libratus, ltyu, minhtrng, mstpr-brainbot, ne0n, pfapostol, roguereddwarf, shaka, sinarette, spyrosonic10, toshii, twicek, volodya, warRoom, yixxas, zeroknots

## Summary
In the case where the owner has an existing rollover, the `ownerToRollOverQueueIndex` incorrectly updates to the last queue index. This causes the `notRollingOver` check to be performed on the incorrect `_id`, which then allows the depositor to withdraw funds that should've been locked.

## Vulnerability Detail
In `enlistInRollover()`, if the user has an existing rollover, it overwrites the existing data:
```solidity
if (ownerToRollOverQueueIndex[_receiver] != 0) {
  // if so, update the queue
  uint256 index = getRolloverIndex(_receiver);
  rolloverQueue[index].assets = _assets;
  rolloverQueue[index].epochId = _epochId;
```

However, regardless of whether the user has an existing rollover, the `ownerToRolloverQueueIndex` points to the last item in the queue:
```solidity
ownerToRollOverQueueIndex[_receiver] = rolloverQueue.length;
```

Thus, the `notRollingOver` modifier will check the incorrect item for users with existing rollovers:
```solidity
QueueItem memory item = rolloverQueue[getRolloverIndex(_receiver)];
if (
    item.epochId == _epochId &&
    (balanceOf(_receiver, _epochId) - item.assets) < _assets
) revert AlreadyRollingOver();
```
allowing the user to withdraw assets that should've been locked.

## Impact
Users are able to withdraw assets that should've been locked for rollovers.

## Code Snippet
https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L252-L257
https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L268
https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L755-L760

## Tool used
Manual Review

## Recommendation
The `ownerToRollOverQueueIndex` should be pointing to the last item in the queue in the `else` case only: when the user does not have an existing rollover queue item.
```diff
} else {
  // if not, add to queue
  rolloverQueue.push(
      QueueItem({
          assets: _assets,
          receiver: _receiver,
          epochId: _epochId
      })
  );
+ ownerToRollOverQueueIndex[_receiver] = rolloverQueue.length;
}
- ownerToRollOverQueueIndex[_receiver] = rolloverQueue.length;
```



## Discussion

**3xHarry**

good catch

**3xHarry**

fix PR: https://github.com/Y2K-Finance/Earthquake/pull/128

**IAm0x52**

Fix looks good. Assigning index has been moved inside else block
