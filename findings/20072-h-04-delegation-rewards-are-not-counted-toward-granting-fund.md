---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/precision-loss
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Ajna Protocol]]"
auditors:
  - "[[REACH]]"
report: "https://code4rena.com/reports/2023-05-ajna"
genome:
  - "[[precision-loss]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
  - "[[proposal-state-check]]"
  - "[[reward-accounting]]"
  - "[[vote-delegation-loop]]"
---
# [H-04] Delegation rewards are not counted toward granting fund

- id: 20072
- impact: HIGH
- protocol: [[Ajna Protocol]]
- reporter: REACH (Code4rena)
- source: https://code4rena.com/reports/2023-05-ajna

## Summary


A bug has been reported in the code for the Ajna Grants project, where the `claimDelegateReward()` function does not account for the claimed reward towards treasury granting. This can lead to the treasury technically reserving up to 90% in each period while actually granting 100%.

The issue is caused by the `Maths.wmul()` function, which automatically rounds the multiplication result up or down. This leads to a potential loss of precision for small decimal amounts and token holders typically having small fractions of tokens down to `1 wei`. It is uncertain, but the total actual paid rewards could be more than 10%, leading to an insignificant loss of precision in the treasury.

The bug can be confirmed via duplicate issue `#263` and the severity has been increased to High by Picodes (judge). A proof of concept code has been provided to append and run in the file `ajna-grants/test/unit/StandardFunding.t.sol` and the test should pass without errors.

## Details


<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-grants/src/grants/base/StandardFunding.sol#L236-L265><br>
<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-grants/src/grants/base/StandardFunding.sol#L216-L217>

Each period reserves a reward for granting up to [3% (GBC: Global Budget Constraint)](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-grants/src/grants/base/StandardFunding.sol#L27). The GBC is split into two parts:

1.  90% for proposal granting. Any proposal requesting more than 90% will [revert](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-grants/src/grants/base/StandardFunding.sol#L390-L391). The total amount requested across winning proposals must not [exceed this percentage](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-grants/src/grants/base/StandardFunding.sol#L447-L450).
2.  10% for voters who have participated in that distribution period as an incentive.

Voters who have participated can claim their reward after the period has ended via `claimDelegateReward()`. However, the claim function does not account for the claimed reward towards treasury granting. As a result, the treasury technically reserves up to 90% in each period while actually granting 100%.

Consider this example:

1.  The treasury has a total of `1000 AJNA`. 3% is reserved for this period, resulting in a GBC of `30 AJNA`. The treasury is updated to `1000 - 30 = 970 AJNA`.
2.  90% is for proposals (`27 AJNA`) and 10% is for voters (`3 AJNA`).
3.  Assume all `27 AJNA` are fully granted among winning proposals.
4.  Assume 10 voters in total, all fully voted and have equal voting power. Each voter receives `0.3 AJNA`, totaling `3 AJNA`.
5.  The treasury has spent `27 AJNA + 3 AJNA`, leaving an actual balance of `970 AJNA`.
6.  This round has ended and the treasury updates its balance before starting a new one using [this logic](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-grants/src/grants/base/StandardFunding.sol#L217). `970 += (30 - 27)` = `973`.
7.  The treasury accounts for `973 AJNA` while having only `970 AJNA` in actuality.

### More detailed analysis

When the current period has ended and before starting a new one, the treasury will [re-account its amount in case the last period did not utilize all the reserved reward](https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-grants/src/grants/base/StandardFunding.sol#L217). For example, if the last period granted only 80% of the GBC among winning proposals, the remaining 10% will be re-added to the treasury.

```solidity
File: ajna-grants/src/grants/base/StandardFunding.sol

197:    function _updateTreasury(
198:        uint24 distributionId_
199:    ) private {
200:        bytes32 fundedSlateHash = _distributions[distributionId_].fundedSlateHash;
201:        uint256 fundsAvailable  = _distributions[distributionId_].fundsAvailable;
202:
203:        uint256[] memory fundingProposalIds = _fundedProposalSlates[fundedSlateHash];
204:
205:        uint256 totalTokensRequested;
206:        uint256 numFundedProposals = fundingProposalIds.length;
207:
208:        for (uint i = 0; i < numFundedProposals; ) {
209:            Proposal memory proposal = _standardFundingProposals[fundingProposalIds[i]];
210:
211:            totalTokensRequested += proposal.tokensRequested;
212:
213:            unchecked { ++i; }
214:        }
215:
216:        // readd non distributed tokens to the treasury
217:        treasury += (fundsAvailable - totalTokensRequested);
```

In the code block above, `fundsAvailable` represents 100% of the GBC and `totalTokensRequested` represents up to 90% of the GBC. As a result, the treasury always adds 10% of the reserve back to its accounting.

### Proof of Concept

The following PoC code is quite long because it must go through all stages. Please append and run this function in the file `ajna-grants/test/unit/StandardFunding.t.sol`. The test should pass without errors.

```solidity
File: ajna-grants/test/unit/StandardFunding.t.sol
    /*
        1. startDistributionPeriod
        2. proposeStandard
        3. screeningVote
        4. fundingVote
        5. updateSlate
        6. executeStandard
        7. claimDelegateReward
    */
        function testPoCTreasuryPrecisionLoss() public {
        // 14 tokenholders self delegate their tokens to enable voting on the proposals
        _selfDelegateVoters(_token, _votersArr);
        uint allVotersInitBalance = 50_000_000 * 1e18;
        emit log_named_uint("Treasury initial amount", _grantFund.treasury());

        vm.roll(_startBlock + 150);

        /* =========================
        1. startDistributionPeriod()
        ========================= */
        assertEq(_token.balanceOf(address(_grantFund)), 500_000_000 * 1e18, "No token should have left the treasury");
        uint24 distributionId = _grantFund.startNewDistributionPeriod();
        assertEq(_grantFund.getDistributionId(), distributionId, "Should have the same ID");
        uint oldTreasury = _grantFund.treasury();
        emit log_named_uint("Treasury after start, deduct 3%", oldTreasury);

        (, , , uint128 gbc, , ) = _grantFund.getDistributionPeriodInfo(distributionId);
        assertEq(gbc, 15_000_000 * 1e18);
        emit log_named_uint("GBC", uint(gbc));
        assertEq(oldTreasury + gbc, 500_000_000 * 1e18, "Should be equal to the initial treasury fund");

        /* =================
        2. proposeStandard()
        ================= */
        // Request 9/10 of GBC (maximal)
        // 9/10 of GBC = 13_500_000 == 8_500_000 + 5_000_000 (all in WAD uint)
        TestProposalParams[] memory testProposalParams = new TestProposalParams[](2);
        testProposalParams[0] = TestProposalParams(address(this), 8_500_000 * 1e18);
        testProposalParams[1] = TestProposalParams(address(this), 5_000_000 * 1e18);
        TestProposal[] memory testProposals = _createNProposals(_grantFund, _token, testProposalParams);
        assertEq(testProposals.length, 2, "Should created exact 2 proposals");
        vm.roll(_startBlock + 200);

        /* ===============
        3. screeningVote()
        =============== */
        // Demonstrate only 6 voters, all fully use their vote power (50_000_000 * 1e18)
        // #0 got 2 votes
        // #1 got 4 votes
        _screeningVote(_grantFund, _tokenHolder1, testProposals[0].proposalId, _getScreeningVotes(_grantFund, _tokenHolder1));
        _screeningVote(_grantFund, _tokenHolder2, testProposals[0].proposalId, _getScreeningVotes(_grantFund, _tokenHolder2));
        _screeningVote(_grantFund, _tokenHolder3, testProposals[1].proposalId, _getScreeningVotes(_grantFund, _tokenHolder3));
        _screeningVote(_grantFund, _tokenHolder4, testProposals[1].proposalId, _getScreeningVotes(_grantFund, _tokenHolder4));
        _screeningVote(_grantFund, _tokenHolder5, testProposals[1].proposalId, _getScreeningVotes(_grantFund, _tokenHolder5));
        _screeningVote(_grantFund, _tokenHolder6, testProposals[1].proposalId, _getScreeningVotes(_grantFund, _tokenHolder6));

        // /* =============
        // 4. fundingVote()
        // ============= */
        // skip time to move from screening period to funding period
        vm.roll(_startBlock + 600_000);

        GrantFund.Proposal[] memory proposals = _getProposalListFromProposalIds(_grantFund, _grantFund.getTopTenProposals(distributionId));
        assertEq(proposals.length, 2);

        // Proposals should be sorted descending according to votes received so #1 should be the first and #0 should be the second
        assertEq(proposals[0].proposalId, testProposals[1].proposalId, "Should have the correct proposalId #1");
        assertEq(proposals[0].votesReceived, 200_000_000 * 1e18, "Should have the voting score of 4 voters");
        assertEq(proposals[1].proposalId, testProposals[0].proposalId, "Should have the correct proposalId #0");
        assertEq(proposals[1].votesReceived, 100_000_000 * 1e18, "Should have the voting score of 2 voters");

        // funding period votes for two competing slates, 1, or 2 and 3
        // #1 got 3 funding votes
        // #0 got 3 funding votes
        _fundingVote(_grantFund, _tokenHolder1, proposals[0].proposalId, voteYes, 50_000_000 * 1e18);
        _fundingVote(_grantFund, _tokenHolder2, proposals[1].proposalId, voteYes, 50_000_000 * 1e18);
        _fundingVote(_grantFund, _tokenHolder3, proposals[1].proposalId, voteYes, 50_000_000 * 1e18);
        _fundingVote(_grantFund, _tokenHolder4, proposals[1].proposalId, voteYes, 50_000_000 * 1e18);
        _fundingVote(_grantFund, _tokenHolder5, proposals[0].proposalId, voteYes, 50_000_000 * 1e18);
        _fundingVote(_grantFund, _tokenHolder6, proposals[0].proposalId, voteYes, 50_000_000 * 1e18);

        // Ensure that all 6 holders have fully voted.
        for (uint i = 0; i < 6; i++) {
            (uint128 voterPower, uint128 votingPowerRemaining, uint256 votesCast) = _grantFund.getVoterInfo(distributionId, _votersArr[i]);
            assertEq(voterPower, 2_500_000_000_000_000 * 1e18, "Should have 50m^2 voting power");
            assertEq(votingPowerRemaining, 0, "Should have fully voted");
        }

        // /* =============
        // 5. updateSlate()
        // ============= */
        // skip to the end of the DistributionPeriod
        vm.roll(_startBlock + 650_000);

        // Updating potential Proposal Slate to include proposal that is in topTenProposal (funding Stage)
        uint256[] memory slate = new uint256[](proposals.length); // length = 2
        slate[0] = proposals[0].proposalId;
        slate[1] = proposals[1].proposalId;
        require(_grantFund.updateSlate(slate, distributionId), "Should update slate success");
        (, , , , , bytes32 slateHash) = _grantFund.getDistributionPeriodInfo(distributionId);
        assertTrue(slateHash != bytes32(0));
        proposals = _getProposalListFromProposalIds(_grantFund, _grantFund.getFundedProposalSlate(slateHash));

        // /* =================
        // 6. executeStandard()
        // ================= */
        // skip to the end of the Distribution's challenge period
        vm.roll(_startBlock + 700_000);

        // execute funded proposals
        assertEq(_token.balanceOf(address(this)), 0, "This contract should have 0 token amount");
        _grantFund.executeStandard(testProposals[0].targets, testProposals[0].values, testProposals[0].calldatas, keccak256(bytes(testProposals[0].description)));
        _grantFund.executeStandard(testProposals[1].targets, testProposals[1].values, testProposals[1].calldatas, keccak256(bytes(testProposals[1].description)));
        
        assertEq(testProposals[0].tokensRequested + testProposals[1].tokensRequested, _token.balanceOf(address(this)), "The contract should received correct granted amount");
        emit log_named_uint("totalTokensRequested", _token.balanceOf(address(this)));
        assertEq(_token.balanceOf(address(this)), gbc * 9/10, "Should be equal to 90% of GBC");
        
        proposals = _getProposalListFromProposalIds(_grantFund, _grantFund.getFundedProposalSlate(slateHash));
        assertTrue(proposals[0].executed && proposals[1].executed, "Should have successfully executed");

        // /* =================
        // 7. claimDelegateReward()
        // ================= */
        // Claim delegate reward for all delegatees
        // delegates who didn't vote with their full power receive fewer rewards
        uint totalDelegationRewards;
        for (uint i = 0; i < _votersArr.length; i++) {
            uint estimatedRewards = _grantFund.getDelegateReward(distributionId, _votersArr[i]);
            changePrank(_votersArr[i]);
            if (i > 5) {
                // these are holders who haven't participated in this period, should have 0 reward
                // _tokenHolder7 and above
                vm.expectRevert(IStandardFunding.DelegateRewardInvalid.selector);
                uint actualRewards = _grantFund.claimDelegateReward(distributionId);
                assertTrue(estimatedRewards == 0 && actualRewards == 0, "Should be ineligible for rewards");
                assertFalse(_grantFund.hasClaimedReward(distributionId, _votersArr[i]), "Should unable to claim");
                assertEq(_token.balanceOf(_votersArr[i]), allVotersInitBalance, "Balance should be the same as starting");
            }
            else {
                // these are holders who have voted
                // _tokenHolder1 - 6
                uint actualRewards = _grantFund.claimDelegateReward(distributionId);
                assertEq(estimatedRewards, actualRewards, "Should received the exact reward amount");
                assertTrue(estimatedRewards != 0 && actualRewards != 0, "Should be eligible for rewards");
                assertTrue(_grantFund.hasClaimedReward(distributionId, _votersArr[i]), "Should claim successfully");

                assertEq(_token.balanceOf(_votersArr[i]), allVotersInitBalance + actualRewards, "Should have the final balance equal to init+reward");
                totalDelegationRewards += actualRewards;
            }
        }

        emit log_named_uint("Total claimed rewards", totalDelegationRewards);
        assertEq(totalDelegationRewards, gbc / 10, "Should be equal to 10% of GBC");
        assertEq(totalDelegationRewards + _token.balanceOf(address(this)), gbc, "10% + 90% = 100%");
        assertEq(totalDelegationRewards + _token.balanceOf(address(this)) + oldTreasury, 500_000_000 * 1e18, "10% + 90% + remaining = initial treasury");
        emit log_named_uint("Treasury at the end of the period (should be the same as started)", _grantFund.treasury());

        // Put the treasury back to the same value as the last period to have the same GBC for easier to compare.
        // Remember this equation? "10% + 90% + remaining = initial treasury"
        // Current _grantFund.treasury() = remaining.
        // _token.balanceOf(address(this)) = 90%
        // _grantFund.startNewDistributionPeriod() -> _grantFund._updateTreasury() = 10% (because of the invalid logic)
        changePrank(address(this));
        _token.approve(address(_grantFund), _token.balanceOf(address(this)));

        // only put 90% back to the treasury
        _grantFund.fundTreasury(_token.balanceOf(address(this)));

        // 10% + (90%&remaining) = initial treasury
        assertEq(totalDelegationRewards + _grantFund.treasury(), 500_000_000 * 1e18, "Should be equal to the initial treasury");

        // The function put 10% back in, while in the actual all 100% has been spent. Loss 10%.
        _grantFund.startNewDistributionPeriod();
        emit log_named_uint("Treasury at the new period (got updated)", _grantFund.treasury());
        assertEq(_token.balanceOf(address(_grantFund)), 498_500_000 * 1e18, "Should be initial-10%");
        emit log_named_uint("treasury actual balance", _token.balanceOf(address(_grantFund)));

        // The same GBC evidenced that treasury = 500_000_000 * 1e18 at the time it was calculated,
        // But the actual balance is 500_000_000 * 1e18 - 10% = 498_500_000 * 1e18.
        (, , , uint128 newGbc, , ) = _grantFund.getDistributionPeriodInfo(distributionId);
        assertEq(oldTreasury + gbc, _grantFund.treasury() + gbc, "Should have the same GBC as previous period");
        assertEq(gbc, newGbc, "Should have the same GBC as previous period");
    }
```

```shell
run: forge test --match-test testPoCTreasuryPrecisionLoss -vv

Running 1 test for test/unit/StandardFunding.t.sol:StandardFundingGrantFundTest
[PASS] testPoCTreasuryPrecisionLoss() (gas: 3451937)
Logs:
  Treasury initial amount: 500000000000000000000000000
  Treasury after start, deduct 3%: 485000000000000000000000000
  GBC: 15000000000000000000000000
  totalTokensRequested: 13500000000000000000000000
  Total claimed rewards: 1500000000000000000000000
  Treasury at the end of the period (should be the same as started): 485000000000000000000000000
  Treasury at the new period (got updated): 485000000000000000000000000
  treasury actual balance: 498500000000000000000000000

Test result: ok. 1 passed; 0 failed; finished in 1.20s
```

### Tools Used

*   Manual review
*   Foundry

### Recommended Mitigation Steps

If it is safe to assume that all periods will always have 10% for delegation rewards, the contract should calculate only 90% of `fundsAvailable` when updating the treasury.

```diff
File: ajna-grants/src/grants/base/StandardFunding.sol

197:    function _updateTreasury(
198:        uint24 distributionId_
199:    ) private {
200:        bytes32 fundedSlateHash = _distributions[distributionId_].fundedSlateHash;
201:        uint256 fundsAvailable  = _distributions[distributionId_].fundsAvailable;

            ...

216:        // readd non distributed tokens to the treasury
+217:        treasury += ((fundsAvailable * 9/10) - totalTokensRequested);      

```

### Remark

The `claimDelegateReward()` function uses `Maths.wmul()`, which automatically rounds the multiplication result up or down. For example, `Maths.wmul(1, 0.5 * 1e18) = 1` (rounding up) while `Maths.wmul(1, 0.49 * 1e18) = 0` (rounding down). As a result, `rewardClaimed_` can lose precision for small decimal amounts and token holders typically have small fractions of tokens down to `1 wei`. It is uncertain, but the total actual paid rewards could be more than 10% if rounded up, resulting in an insignificant loss of precision in the treasury. However, if `rewardClaimed_` is deducted from `fundsAvailable`, it could lead to an integer underflow revert if `fundsAvailable - totalClaimed - totalTokensRequested = 100% - 10.xx% - 90%`, which exceeds 100%.

**[Picodes (judge) increased severity to High](https://github.com/code-423n4/2023-05-ajna-findings/issues/450#issuecomment-1568861837)**

**[MikeHathaway (Ajna) confirmed via duplicate issue `#263`](https://github.com/code-423n4/2023-05-ajna-findings/issues/263#issuecomment-1555119925)**



***
