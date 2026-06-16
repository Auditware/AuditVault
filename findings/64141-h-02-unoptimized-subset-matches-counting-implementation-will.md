---
tags:
  - blockchain/evm
  - blockchain/evm/base
  - lang/solidity
  - sector/gaming
  - sector/governance
  - sector/oracle
  - sector/stable
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Megapot]]"
auditors:
  - "[[harry]]"
report: "https://code4rena.com/reports/2025-11-megapot"
genome:
  - "[[gas-limit]]"
  - "[[permanent]]"
  - "[[use-reentrancy-guard]]"
  - "[[account-ownership]]"
  - "[[pyth-oracle-completeness]]"
  - "[[reentrancy-guard]]"
  - "[[weak-randomness]]"
---
# [H-02] Unoptimized subset matches counting implementation will exceed tx gas limit on base chain

- id: 64141
- impact: HIGH
- protocol: [[Megapot]]
- reporter: harry (Code4rena)
- source: https://code4rena.com/reports/2025-11-megapot

## Summary


Bug report summary:

A bug was found in the code of the Megapot project on GitHub. During a drawing settlement, there is a very expensive calculation that counts all subset matches, causing the gas limit to exceed the transaction gas limit on the base chain. This means that the Pyth network's entropy provider will not be able to invoke the callback, resulting in the drawing never being settled. To fix this bug, the subsets can be cached or a hardcoded limit can be defined for the bonusballMax. A proof of concept is provided to demonstrate the validity of the bug.

## Details



<https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/lib/TicketComboTracker.sol# L157-L160>

### Finding description and impact

During a drawing settlement, there is a very expensive calculation that counts all subset matches:

The stacktrace is displayed here:

[File: 2025-11-megapot/contracts/Jackpot.sol](https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/Jackpot.sol# L1626)
```

717:     function scaledEntropyCallback(
718:         bytes32,
719:         uint256[][] memory _randomNumbers,
720:         bytes memory
721:     )
722:         external
723:         nonReentrant
724:         onlyEntropy
725:     {
... // @audit trace 1
732:@>       (uint256 winningNumbers, uint256 drawingUserWinnings) = _calculateDrawingUserWinnings(currentDrawingState, _randomNumbers);
...
1614:     function _calculateDrawingUserWinnings(
1615:         DrawingState storage _currentDrawingState,
1616:         uint256[][] memory _unPackedWinningNumbers
1617:     )
1618:         internal
1619:         returns(uint256 winningNumbers, uint256 drawingUserWinnings)
1620:     {
1621:         // Note that the total amount of winning tickets for a given tier is the sum of result and dupResult
1622:         (
1623:             uint256 winningTicket,
1624:             uint256[] memory uniqueResult,
1625:             uint256[] memory dupResult
// @audit trace 2
1626:@>       ) = TicketComboTracker.countTierMatchesWithBonusball(drawingEntries[currentDrawingId],
1627:             _unPackedWinningNumbers[0].toUint8Array(),      // normal balls
1628:             _unPackedWinningNumbers[1][0].toUint8()         // bonusball
1629:         );
```

[File: 2025-11-megapot/contracts/lib/TicketComboTracker.sol](https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/lib/TicketComboTracker.sol# L250-L263)
```

250:     function countTierMatchesWithBonusball(
251:         Tracker storage _tracker,
252:         uint8[] memory _normalBalls,
253:         uint8 _bonusball
254:     )
255:         internal
256:         view
257:         returns (uint256 winningTicket, uint256[] memory uniqueResult, uint256[] memory dupResult)
258:     {
...// @audit trace 3
263:@>       (uint256[] memory matches, uint256[] memory dupMatches) = _countSubsetMatches(_tracker, set, _bonusball);
...
145:     function _countSubsetMatches(
146:         Tracker storage _tracker,
147:         uint256 _normalBallsBitVector,
148:         uint8 _bonusball
149:     )
150:         private
151:         view
152:         returns (uint256[] memory matches, uint256[] memory dupMatches)
153:     {
154:         matches = new uint256[]((_tracker.normalTiers+1)*2);
155:         dupMatches = new uint256[]((_tracker.normalTiers+1)*2);
156:// @audit trace 4: the final culprit
157:@>       for (uint8 i = 1; i <= _tracker.bonusballMax; i++) {
158:@>           for (uint8 k = 1; k <= _tracker.normalTiers; k++) {
159:@>               uint256[] memory subsets = Combinations.generateSubsets(_normalBallsBitVector, k);
```

We’re generating subsets of `_normalBallsBitVector` for `bonusballMax * 5` times.

For sufficiently high `bonusballMax`, the gas limit will exceed tx gas limit of [25M on base chain](https://docs.base.org/base-chain/network-information/block-building# per-transaction-gas-maximum).

For example, as we’ll see in the POC, in the following configuration:

* normallBallMax: 30
* poolCap: `16Me6` USDC (worth of 16M USD)
* bonusBallMax: 129

Gas consumption is estimated to be 25,834,562

Impact

* Due to tx gas limit violation , Pyth network’s entropy provider [will not be able to invoke the callback](https://docs.pyth.network/entropy/generate-random-numbers/evm#:~:text=If%20it%20returns%20an%20error%2C%20the%20keeper%20will%20not%20be%20able%20to%20invoke%20the%20callback.)
* As a result, drawing can never be settled

### Recommended mitigation steps

1. `subsets` can be cached in the following way:
```

diff --git a/contracts/lib/TicketComboTracker.sol b/contracts/lib/TicketComboTracker.sol
index 3545a8a..36b1c02 100644
--- a/contracts/lib/TicketComboTracker.sol
+++ b/contracts/lib/TicketComboTracker.sol
@@ -153,10 +153,13 @@ library TicketComboTracker {
     {
         matches = new uint256[]((_tracker.normalTiers+1)*2);
         dupMatches = new uint256[]((_tracker.normalTiers+1)*2);

+        uint256[][] memory subsetsArr = new uint256[][](_tracker.normalTiers);
+        for (uint i; i<_tracker.normalTiers; i++) {
+            subsetsArr[i] = Combinations.generateSubsets(_normalBallsBitVector, i + 1);
+        }
         for (uint8 i = 1; i <= _tracker.bonusballMax; i++) {
             for (uint8 k = 1; k <= _tracker.normalTiers; k++) {
-                uint256[] memory subsets = Combinations.generateSubsets(_normalBallsBitVector, k);
+                uint256[] memory subsets = subsetsArr[k - 1];
                 for (uint256 l = 0; l < subsets.length; l++) {
                     if (i == _bonusball) {
                         matches[(k*2)+1] += _tracker.comboCounts[i][subsets[l]].count;
```

2. Define a hardcoded limit of `bonusballMax`

Expand for detailed Proof of Concept

### Proof of Concept

The following POC shows that, for 16M USD pool, entropy callback gas consumption will exceed 25M tx gas limit on base chain.
```

import { ethers } from "hardhat";
import DeployHelper from "@utils/deploys";

import { getWaffleExpect, getAccounts } from "@utils/test/index";
import { ether, usdc } from "@utils/common";
import { Account } from "@utils/test";

import { PRECISE_UNIT } from "@utils/constants";

import {
  GuaranteedMinimumPayoutCalculator,
  Jackpot,
  JackpotBridgeManager,
  JackpotLPManager,
  JackpotTicketNFT,
  MockDepository,
  ReentrantUSDCMock,
  ScaledEntropyProviderMock,
} from "@utils/contracts";
import {
  Address,
  JackpotSystemFixture,
  RelayTxData,
  Ticket,
} from "@utils/types";
import { deployJackpotSystem } from "@utils/test/jackpotFixture";
import {
  calculatePackedTicket,
  calculateTicketId,
  generateClaimTicketSignature,
  generateClaimWinningsSignature,
} from "@utils/protocolUtils";
import { ADDRESS_ZERO } from "@utils/constants";
import {
  takeSnapshot,
  SnapshotRestorer,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

const expect = getWaffleExpect();

describe("C4", () => {
  let owner: Account;
  let buyerOne: Account;
  let buyerTwo: Account;
  let referrerOne: Account;
  let referrerTwo: Account;
  let referrerThree: Account;
  let solver: Account;

  let jackpotSystem: JackpotSystemFixture;
  let jackpot: Jackpot;
  let jackpotNFT: JackpotTicketNFT;
  let jackpotLPManager: JackpotLPManager;
  let payoutCalculator: GuaranteedMinimumPayoutCalculator;
  let usdcMock: ReentrantUSDCMock;
  let entropyProvider: ScaledEntropyProviderMock;
  let snapshot: SnapshotRestorer;
  let jackpotBridgeManager: JackpotBridgeManager;
  let mockDepository: MockDepository;

  beforeEach(async () => {
    [
      owner,
      buyerOne,
      buyerTwo,
      referrerOne,
      referrerTwo,
      referrerThree,
      solver,
    ] = await getAccounts();

    jackpotSystem = await deployJackpotSystem();
    jackpot = jackpotSystem.jackpot;
    jackpotNFT = jackpotSystem.jackpotNFT;
    jackpotLPManager = jackpotSystem.jackpotLPManager;
    payoutCalculator = jackpotSystem.payoutCalculator;
    usdcMock = jackpotSystem.usdcMock;
    entropyProvider = jackpotSystem.entropyProvider;

    await jackpot
      .connect(owner.wallet)
      .initialize(
        usdcMock.getAddress(),
        await jackpotLPManager.getAddress(),
        await jackpotNFT.getAddress(),
        entropyProvider.getAddress(),
        await payoutCalculator.getAddress(),
      );
    const governancePoolCap = usdc(16000000);
    await jackpot.connect(owner.wallet).initializeLPDeposits(governancePoolCap);

    await usdcMock
      .connect(owner.wallet)
      .approve(jackpot.getAddress(), governancePoolCap);
    await jackpot.connect(owner.wallet).lpDeposit(governancePoolCap);

    await jackpot
      .connect(owner.wallet)
      .initializeJackpot(
        BigInt(await time.latest()) +
          BigInt(jackpotSystem.deploymentParams.drawingDurationInSeconds),
      );

    jackpotBridgeManager =
      await jackpotSystem.deployer.deployJackpotBridgeManager(
        await jackpot.getAddress(),
        await jackpotNFT.getAddress(),
        await usdcMock.getAddress(),
        "MegapotBridgeManager",
        "1.0.0",
      );

    mockDepository = await jackpotSystem.deployer.deployMockDepository(
      await usdcMock.getAddress(),
    );

    snapshot = await takeSnapshot();
  });

  beforeEach(async () => {
    await snapshot.restore();
  });

  describe("PoC", async () => {
    it("demonstrates the C4 submission's validity", async () => {
      await time.increase(
        jackpotSystem.deploymentParams.drawingDurationInSeconds,
      );
      const drawingState = await jackpot.getDrawingState(1);
      console.log("drawingState.bonusballMax", drawingState.bonusballMax);
      const value =
        jackpotSystem.deploymentParams.entropyFee +
        (jackpotSystem.deploymentParams.entropyBaseGasLimit +
          jackpotSystem.deploymentParams.entropyVariableGasLimit *
            drawingState.bonusballMax) *
          10_000_000n;
      await jackpot.runJackpot({ value });
      const winningNumbers = [[6n, 7n, 8n, 9n, 10n], [11n]];
      await entropyProvider.randomnessCallback(winningNumbers);
    });
  });
});
```

Console output:
```

$ hardhat test ./test/poc/C4PoC.spec.ts

C4
    PoC
drawingState.bonusballMax 129n
      ✔ demonstrates the C4 submission's validity (1088ms)
...
|  ScaledEntropyProviderMock          ·                                                                                   │
······································|·················|···············|·················|················|···············
|      randomnessCallback             ·              -  ·            -  ·     25,834,562  ·             1  ·           -  │
```

After applying the mitigation:
```

$ hardhat test ./test/poc/C4PoC.spec.ts

C4
    PoC
drawingState.bonusballMax 129n
...
|  ScaledEntropyProviderMock          ·                                                                                   │
······································|·················|···············|·················|················|···············
|      randomnessCallback             ·              -  ·            -  ·     15,769,995  ·             1  ·           -  │
```

---
