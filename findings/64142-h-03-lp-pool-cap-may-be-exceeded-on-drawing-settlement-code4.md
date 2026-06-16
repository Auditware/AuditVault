---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/prediction
  - sector/stable
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/known-pattern
protocol: "[[Megapot]]"
auditors:
  - "[[h2134]]"
report: "https://code4rena.com/reports/2025-11-megapot"
genome:
  - "[[frozen-funds]]"
  - "[[wrong-state]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# [H-03] LP pool cap may be exceeded on drawing settlement

- id: 64142
- impact: HIGH
- protocol: [[Megapot]]
- reporter: h2134 (Code4rena)
- source: https://code4rena.com/reports/2025-11-megapot

## Summary


The bug report discusses a vulnerability found in the JackpotLPManager.sol contract of the 2025-11-megapot project on GitHub. The vulnerability allows the LP pool cap to be exceeded during the drawing settlement process, which can lead to unfair betting and a denial of service (DOS) attack. The report suggests enforcing the same pool cap logic for the calculation of the new LP value to mitigate this issue. A proof of concept is also provided in the form of a Solidity test file.

## Details



<https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/JackpotLPManager.sol# L378>

<https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/JackpotLPManager.sol# L391>

### Finding description and impact

Jackpot enforces pool cap as the following:

[File: 2025-11-megapot/contracts/Jackpot.sol](https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/Jackpot.sol# L1469-L1476)
```

1469:     function _calculateLpPoolCap(uint256 _normalBallMax) internal view returns (uint256) {
1470:         // We use MAX_BIT_VECTOR_SIZE because that's the max number that can be packed in a uint256 bit vector
1471:         uint256 maxAllowableTickets = Combinations.choose(_normalBallMax, NORMAL_BALL_COUNT) * (MAX_BIT_VECTOR_SIZE - _normalBallMax);
1472:         uint256 maxPrizePool = maxAllowableTickets * ticketPrice * (PRECISE_UNIT - lpEdgeTarget) / PRECISE_UNIT;
1473:
1474:         // We need to make sure that the lpPoolCap is not greater than the governance pool cap
1475:         return Math.min(maxPrizePool * PRECISE_UNIT / (PRECISE_UNIT - reserveRatio), governancePoolCap);
1476:     }
```

This is to ensure the following:

* `bonusBallMax` + `normalBallMax` <= `MAX_BIT_VECTOR_SIZE`
* Pool cap does not exceed governance pool cap

Otherwise, TicketComboTracker cannot properly store purchased Ticket on max bonus ball, since the following will revert with overflow:

[File: 2025-11-megapot/contracts/lib/TicketComboTracker.sol](https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/lib/TicketComboTracker.sol# L142)
```

142:         ticketNumbers = set |= 1 << (_bonusball + _tracker.normalMax);
```

However, LP pool cap can be exceeded on drawing settlement, because new LP value calculation does not enforce the same pool cap logic:

[File: 2025-11-megapot/contracts/JackpotLPManager.sol](https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/JackpotLPManager.sol# L371-L392)
```

371:     function processDrawingSettlement(
372:         uint256 _drawingId,
373:         uint256 _lpEarnings,
374:         uint256 _userWinnings,
375:         uint256 _protocolFeeAmount
376:     ) external onlyJackpot() returns (uint256 newLPValue, uint256 newAccumulator) {
377:         LPDrawingState storage currentLP = lpDrawingState[_drawingId];
378:@>       uint256 postDrawLpValue = currentLP.lpPoolTotal + _lpEarnings - _userWinnings - _protocolFeeAmount;
...
391:@>       newLPValue = postDrawLpValue + currentLP.pendingDeposits - withdrawalsInUSDC;
392:     }
```

Since LP value can grow by up to `lpEdgeTarget = 30%` on every draw without any jackpot winner, governance cap or calculated limit can be exceeded, if previous total pool was just below the surface.

### Impact

Important invariants can be broken on settlement drawing:

[File: 2025-11-megapot/documentation/auditor-intro.md](https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/documentation/auditor-intro.md# L1996)
```

1996: - **Pool Cap Compliance**: Total pool never exceeds governance limits
```

[File: 2025-11-megapot/documentation/auditor-intro.md](https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/documentation/auditor-intro.md# L2068-L2069)
```

2068: // Pool cap enforcement:
2069: lpPoolTotal + pendingDeposits <= governancePoolCap
```

[File: /home/user/develop/code4rena/2025-11-megapot/documentation/auditor-intro.md](https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/documentation/auditor-intro.md# L31)
```

31: 11) Is all the bitpacking logic sound? Are there any potential boundary errors that could arise either between the lower bits where the normals are or the higher bits where bonusball must be less than 255 - normalBall Max?
```

Especially, when new pool cap exceeds calculated safe limit, `bonusBallMax` can be greater than `255 - normalBallMax`.

This will lead to DOS on `normalBallMax` betting and ultimately lead to unfair betting.

### Recommended mitigation steps

Enforce the same cap to `newLPValue` calculation.

Expand for detailed Proof of Concept

### Proof of Concept

I acknowledge that POC should be put in `C4PoC.spec.ts`.

However, I prepared POC in foundry due to the following reasons:

* When I tried to demonstrate invariant break with `C4PoC.spec.ts`, the test reverts without providing any helpful message, in spite of my best effort
* At the time of submission, my signal is 75, so I don’t have to follow mandatory POC rule, so I decided to do what’s best for protocol team and me

First, follow the guide in this [secret gist](https://gist.github.com/g-lightspeed/d0f0ac49c6125cbde69ee3c6f4069105)

Then, put the following into `test/POC.t.sol`:
```

pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import {IJackpot} from "contracts/interfaces/IJackpot.sol";
import {IJackpotLPManager} from "contracts/interfaces/IJackpotLPManager.sol";
import {Jackpot} from "contracts/Jackpot.sol";
import {JackpotTicketNFT} from "contracts/JackpotTicketNFT.sol";
import {JackpotLPManager} from "contracts/JackpotLPManager.sol";
import {JackpotBridgeManager} from "contracts/JackpotBridgeManager.sol";
import {GuaranteedMinimumPayoutCalculator} from "contracts/GuaranteedMinimumPayoutCalculator.sol";
import {ScaledEntropyProvider} from "contracts/ScaledEntropyProvider.sol";
import {USDCMock} from "contracts/mocks/USDCMock.sol";
import {ScaledEntropyProviderMock} from "contracts/mocks/ScaledEntropyProviderMock.sol";
import {BaseTest} from "test/BaseTest.t.sol";

contract POC is BaseTest {
    address buyer = makeAddr("buyer");

    function setUp() public override {
        super.setUp();
        // normalBallMax is overridden to 15, but the vulnerability is not limited to small ball numbers
        // POC uses smaller normal ball number to reduce the iteration
        deploymentParams.normalBallMax = 15;
        // Safe limit: C(15, 3) * (255 - 15) * 0.7 / 0.8 = 630630
        // Governance Cap: 630000
        deploymentParams.governancePoolCap = 630000e6;
        _deployJackpot();

        vm.startPrank(admin);
        jackpot.initializeLPDeposits(deploymentParams.governancePoolCap);
        uint256 lpPoolCap = _calculateLpPoolCap();
        // LP pool equals to the cap
        deal(address(USDC), address(admin), lpPoolCap);
        USDC.approve(address(jackpot), lpPoolCap);
        jackpot.lpDeposit(lpPoolCap);
        jackpot.initializeJackpot(DRAWING_DURATION_IN_SECONDS);
        vm.stopPrank();

        {
            // buyer purchases 10000 tickets
            vm.startPrank(buyer);
            vm.pauseGasMetering();
            uint8[] memory normals = new uint8[](NORMAL_BALL_COUNT);
            for (uint256 i; i < NORMAL_BALL_COUNT; i++) {
                normals[i] = uint8(i + 1); // normals: 1,2,3,4,5
            }
            uint8 bonus = uint8(NORMAL_BALL_COUNT + 1); // bonus: 6
            for (uint256 i; i < 100; i++) {
                _buyTickets(buyer, normals, bonus, 100);
            }
            vm.resumeGasMetering();
            vm.stopPrank();
        }
    }

    function testSubmissionValidity() external {
        skip(DRAWING_DURATION_IN_SECONDS);
        _runJackpot();
        uint8[NORMAL_BALL_COUNT] memory normalWinnings = [6, 7, 8, 9, 10];
        uint8 bonusWinning = 11;
        // there is no winner, all ticket sale goes to LP profit
        _declareWinningNumbers(normalWinnings, bonusWinning);

        Jackpot.DrawingState memory drawingState = jackpot.getDrawingState(2);
        // Invariant broken: lpPoolTotal > governancePoolCap
        IJackpotLPManager.LPDrawingState memory lpDrawingState = jackpotLPManager.getLPDrawingState(2);
        assertGt(lpDrawingState.lpPoolTotal, deploymentParams.governancePoolCap);
        assertGt(lpDrawingState.lpPoolTotal, jackpotLPManager.lpPoolCap());
        // Invariant broken: bonusballMax > 255 - normalBallMax
        assertGt(drawingState.bonusballMax, MAX_BIT_VECTOR_SIZE - deploymentParams.normalBallMax);
        {
            uint8[] memory normals = new uint8[](NORMAL_BALL_COUNT);
            for (uint256 i; i < NORMAL_BALL_COUNT; i++) {
                normals[i] = uint8(i + 1); // normals: 1,2,3,4,5
            }
            uint8 bonus = drawingState.bonusballMax; // bonus: 244
            uint256 usdcAmount = deploymentParams.ticketPrice;
            deal(address(USDC), buyer, usdcAmount);
            vm.startPrank(buyer);
            USDC.approve(address(jackpot), usdcAmount);
            IJackpot.Ticket[] memory tickets = new IJackpot.Ticket[](1);
            tickets[0] = IJackpot.Ticket({normals: normals, bonusball: bonus});
            address[] memory referrers = new address[](0);
            uint256[] memory referralSplit = new uint256[](0);
            // max bonus ball purchase reverts due to overflow
            vm.expectRevert(abi.encodeWithSignature("Panic(uint256)", 0x11));
            jackpot.buyTickets(tickets, buyer, referrers, referralSplit, "test");
            vm.stopPrank();
        }
    }
}
```

Then run `forge test --mt testSubmissionValidity --via-ir` to run the POC.

---
