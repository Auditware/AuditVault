---
tags:
  - lang/solidity
  - sector/gaming
  - sector/oracle
  - platform/shieldify
  - has/github
  - severity/high
protocol: "[[Penguingotchi]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/PenguinGotchi-Security-Review.md"
genome:
  - "[[weak-randomness]]"
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[admin-is-honest]]"
  - "[[add-access-control]]"
---
# [H-01] Predictable Randomness in Activity Outcomes

- id: 57907
- impact: HIGH
- protocol: Penguingotchi
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/PenguinGotchi-Security-Review.md

## Summary


The report highlights a bug in the `PenguinManager.doActivity()` function which makes the game predictable and can be exploited by attackers. This is because the randomness generation in the function relies on inputs controlled by the user, making it possible for attackers to simulate and predict outcomes before execution. The severity of this bug is high as it can lead to unfair advantages for attackers. The affected code can be found in the `Game.sol` and `PenguinManager.sol` files. The recommendation is to use a more secure randomness solution or add an expiration time to signatures to make attacks harder. The team has fixed the bug.

## Details

## Severity

High Risk

## Description

The randomness generation in `PenguinManager.doActivity()` is predictable due to reliance on `block.timestamp` and inputs controlled by the user. If the caller of `Game.doActivity()` is a contract, it can simulate and predict activity outcomes before execution, then only proceed when favorable results are expected.

```solidity
uint256 dRandomNumber = uint256(keccak256(abi.encodePacked(params.penguinId, block.timestamp, params.salt)))
    % (100 * PERCENT_DENOMINATOR);
uint256 sRandomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, params.salt, params.penguinId)))
    % (100 * PERCENT_DENOMINATOR);
uint256 dropRandomNumber = uint256(keccak256(abi.encodePacked(params.salt, params.penguinId, block.timestamp)))
    % (100 * PERCENT_DENOMINATOR);
```

The vulnerability is severe because:

1. The signature in `Game.doActivity()` has no expiration time
2. The `salt` and `penguinId` are user-controlled

```solidity
//@audit only check signer, no timeout
modifier validSignature(bytes32 paramsHash, bytes calldata signature) {
    address signer = CoSignable.isValidSignature(paramsHash, signature);

    if (!isSigner(signer)) {
        revert SignerIsNotAuthorized(signer);
    }
    _;
}
```

For example:

1. Attacker creates a malicious contract to buy a penguin and implements the following attack flow:

```solidity
function executeAttack(uint256 activityId, uint256[] calldata penguinIds, bytes calldata salt, bytes calldata signature) external {
   // Simulate the random numbers using the same inputs
   uint256 dRandomNumber = calculateDRandomNumber(penguinIds[0], block.timestamp, salt);
   uint256 sRandomNumber = calculateSRandomNumber(block.timestamp, salt, penguinIds[0]);
   uint256 dropRandomNumber = calculateDropRandomNumber(salt, penguinIds[0], block.timestamp);

   // Check if outcomes are favorable (e.g., no death, guaranteed success, desired item drop)
   Activity memory activity = game.getActivity(activityId);
   if (dRandomNumber >= activity.deathChance && sRandomNumber < activity.successChance) {
       // Only execute when conditions are favorable
       game.doActivity(activityId, penguinIds, salt, signature);
   }
   // else revert
}
```

2. The attacker obtains a valid signature for the contract from an authorized signer to execute `doActivity()` as a regular user.
3. The attacker repeatedly calls their contract with different transaction timestamps until they find a favourable outcome.
4. When a favourable simulation is found, the transaction executes, guaranteeing:
   - No penguin deaths
   - Successful activities
   - Preferred item drops (backpack or shield)
   - Maximum rewards
5. The attacker can repeat this process indefinitely, as signatures have no expiration.
6. Attackers can leverage MEV infrastructure like flashbot-if the outcome isn't what they want, they just `revert`. Since failed transactions don’t hit the chain, these services charge no fees, drastically lowering attack costs.

## Location of Affected Code

File: [Game.sol](https://github.com/WebitLabs/pengu-sc/blob/cd9e0fd078f55dbd1067be0fd4b25002ac59a425/src/Game.sol)

File: [PenguinManager.sol](https://github.com/WebitLabs/pengu-sc/blob/cd9e0fd078f55dbd1067be0fd4b25002ac59a425/src/PenguinManager.sol)

## Impact

The attacker can wait for their desired outcome before executing `doActivity()`, which breaks the game's randomness and creates unfairness.

## Recommendation

Use a more robust randomness solution like Chainlink VRF, or add an expiration time to signatures to make attacks harder.

## Team Response

Fixed.
