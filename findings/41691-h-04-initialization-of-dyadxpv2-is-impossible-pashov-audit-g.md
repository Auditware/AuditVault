---
tags:
  - lang/move
  - lang/solidity
  - sector/oracle
  - sector/staking
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - vuln/dependency/upgradeable-contract
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[DYAD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md"
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[timestamp-dependence]]"
  - "[[upgrade-safety]]"
---
# [H-04] Initialization of DyadXPv2 is impossible

- id: 41691
- impact: HIGH
- protocol: [[DYAD]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md

## Summary


The bug report is about a loop in the `DyadXPv2.initialize()` function that is causing a high gas cost. The function loops through the supply of `DNFT` (a type of cryptocurrency) and calculates the gas cost for each iteration. The current total supply of `DNFT` is 882, which means the loop is using more than 30 million gas, which is the gas limit. The report suggests making changes to the code to reduce the gas cost, as it is not possible to run the code for all 882 iterations due to limitations. The report also includes a Proof of Concept (PoC) file that can be used to test the gas cost for a smaller number of iterations. The report recommends considering not looping through the entire supply of `DNFT` on initialization to reduce the gas cost. 

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

`DyadXPv2.initialize()` loops across the supply of `DNFT`:

```solidity
for (uint256 i = 0; i < dnftSupply; ++i) {
            noteData[i] = NoteXPData({
                lastAction: uint40(block.timestamp),
                keroseneDeposited: uint96(KEROSENE_VAULT.id2asset(i)),
                lastXP: noteData[i].lastXP,
                totalXP: noteData[i].lastXP,
                dyadMinted: DYAD.mintedDyad(i)
            });
        }
```

The current total supply of `DNFT` is 882.

gas used in 88 iterations is 3.130682e6

This means that the total cost of the loop is at least 3.130682e7, which exceeds the 3e7 (30M) gas limit.

**Proof of Concept**

Due to foundry limitations, it's not possible to run the PoC across all 882 iterations.

To calculate the gas used for 88 (10% of total) iterations, make the following change in `DyadXPv2.initialize()`:

```diff

            noteData[i] = NoteXPData({
                lastAction: uint40(block.timestamp),
                keroseneDeposited: uint96(KEROSENE_VAULT.id2asset(i)),
                lastXP: noteData[i].lastXP,
                totalXP: noteData[i].lastXP,
                dyadMinted: DYAD.mintedDyad(i)
            });

+         if (i == dnftSupply / 10 - 1) {
+              console.log("gas used in %s iterations is %e", i+1, gas - gasleft());
+               return;
+           }
```

Then add this PoC file to `test/` and run `test_InitCost`:

**Coded PoC**

```solidity
import {Test, console} from "forge-std/Test.sol";
import {DyadXPv2} from "../../src/staking/DyadXPv2.sol";

import {Kerosine} from "../../src/staking/Kerosine.sol";
import {DNft} from "../../src/core/DNft.sol";
import {KeroseneVault} from "../../src/core/VaultKerosene.sol";
import {Dyad} from "../../src/core/Dyad.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract StakingTest is Test {
    address VAULT_MANAGER = 0xB62bdb1A6AC97A9B70957DD35357311e8859f0d7;
    address dNFT_owner = 0xDeD796De6a14E255487191963dEe436c45995813;

    DyadXPv2 dyadXP_v2;

    Kerosine kerosine;
    DNft dnft;
    Dyad dyad;
    KeroseneVault keroseneVault;

    function setUp() external {
        string memory RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/vDqr_aMYwqkkAUs-sM3S07j92pkny3yE";
        vm.createSelectFork(RPC_URL);

        dyad = Dyad(0xFd03723a9A3AbE0562451496a9a394D2C4bad4ab);
        dnft = DNft(0xDc400bBe0B8B79C07A962EA99a642F5819e3b712);
        kerosine = Kerosine(0xf3768D6e78E65FC64b8F12ffc824452130BD5394);
        keroseneVault = KeroseneVault(0x4808e4CC6a2Ba764778A0351E1Be198494aF0b43);
    }

    function test_InitCost() public {
        // Deploy DyadXPv2 implementation
        DyadXPv2 impl = new DyadXPv2(
            VAULT_MANAGER,
            address(keroseneVault),
            address(dnft),
            address(dyad)
        );

        address xp_owner = 0xDeD796De6a14E255487191963dEe436c45995813;

        // Upgrade DyadXP->DyadXPv2
        vm.prank(xp_owner);
        UUPSUpgradeable xp_proxy = UUPSUpgradeable(payable(0xeF443646E52d1C28bd757F570D18F4Db30dB70F4));
        xp_proxy.upgradeToAndCall(address(impl), abi.encodeWithSignature("initialize(address)", address(this)));
        dyadXP_v2 = DyadXPv2(address(xp_proxy));
    }
}
```

**Console output:**

```bash
Ran 1 test for test/CantInit.t.sol:StakingTest
[PASS] test_InitCost() (gas: 4767974)
Logs:
  gas used in 89 iterations is 3.18022e6
```

## Recommendations

Consider not looping across the entire dnftSupply on initialization.
