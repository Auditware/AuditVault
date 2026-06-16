---
tags:
  - lang/solidity
  - sector/governance
  - platform/immunefi
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/precision-loss
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Alchemix]]"
auditors:
  - "[[marchev]]"
genome:
  - "[[precision-loss]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[integer-bounds]]"
---
# Precision loss causes minor loss of FLUX when claiming with NFTs

- id: 38185
- impact: HIGH
- protocol: [[Alchemix]]
- reporter: marchev (Immunefi)
- source: N/A

## Summary


This bug report is about a smart contract called `FluxToken` on the GitHub platform. This contract allows users to exchange their Alchemech or alETH NFTs for FLUX tokens. However, there is an error in the calculation within the contract that causes users to lose a small amount of FLUX. This happens because of an unnecessary calculation that leads to precision loss. This bug has been identified and a proof of concept has been provided to demonstrate the issue. 

## Details

Report type: Smart Contract


Target: https://github.com/alchemix-finance/alchemix-v2-dao/blob/main/src/FluxToken.sol

Impacts:
- Contract fails to deliver promised returns, but doesn't lose value

## Description
## Brief/Intro

The `FluxToken` contract allows users to claim FLUX tokens in exchange for their Alchemech or alETH NFTs. However, an error in the calculation within the contract leads to precision loss, causing users to lose small a dust amount of FLUX.

## Vulnerability Details

Users can claim FLUX tokens by calling the `FluxToken#nftClaim()` function with their Alchemech or alETH NFTs. This function relies on the `FluxToken#getClaimableFlux()` function to determine the amount of FLUX the user should receive. The `claimableFlux` is calculated as follows:

```sol
claimableFlux = (((bpt * veMul) / veMax) * veMax * (fluxPerVe + BPS)) / BPS / fluxMul;
```

In this formula, there is an unnecessary division by `veMax` followed by a multiplication by the same `veMax` value. This redundant operation introduces precision loss which in turn causes the user to lose a small (dust) amount of FLUX.

## Impact Details

The `claimableFlux` formula contains an unnecessary calculation that leads to a precision loss which causes a loss of dust for the users.

## References

https://github.com/alchemix-finance/alchemix-v2-dao/blob/f1007439ad3a32e412468c4c42f62f676822dc1f/src/FluxToken.sol#L224


## Proof of Concept

The following coded PoC demonstrates the issue.

Add the following test case to `FluxToken.t.sol`:

```sol
    function test_getClaimableFlux_causes_unnecessary_lost_of_dust_due_to_incorrect_calculation() external {
        address dummyNFT = address(0x31337);
        uint256 amount = 10 ether;

        uint256 veMul = VotingEscrow(flux.veALCX()).MULTIPLIER();
        uint256 veMax = VotingEscrow(flux.veALCX()).MAXTIME();
        uint256 fluxPerVe = VotingEscrow(flux.veALCX()).fluxPerVeALCX();
        uint256 fluxMul = VotingEscrow(flux.veALCX()).fluxMultiplier();

        uint256 expectedClaimableFlux = ((amount * flux.bptMultiplier() * veMul) * (fluxPerVe + BPS)) / BPS / fluxMul;
        uint256 actualClaimableFlux = flux.getClaimableFlux(amount, dummyNFT);
        
        console2.log("Expected claimable FLUX: %s", expectedClaimableFlux);
        console2.log("Actual claimable FLUX: %s", actualClaimableFlux);
    }
```

Make sure the following entries are updated in `Makefile`:

```sh
## file to test 
FILE=FluxToken

## specific test to run
TEST=test_getClaimableFlux_causes_unnecessary_lost_of_dust_due_to_incorrect_calculation
```

Run the PoC via:

```sh
make test_file_test
```

PoC output:

```sh
Ran 1 test for src/test/FluxToken.t.sol:FluxTokenTest
[PASS] test_getClaimableFlux_causes_unnecessary_lost_of_dust_due_to_incorrect_calculation() (gas: 35008)
Logs:
  Expected claimable FLUX: 300000000000000000000
  Actual claimable FLUX: 299999999999992086000

Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 15.84s (649.51ms CPU time)

Ran 1 test suite in 16.97s (15.84s CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```
