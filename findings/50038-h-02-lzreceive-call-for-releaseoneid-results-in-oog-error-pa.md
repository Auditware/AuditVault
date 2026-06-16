---
tags:
  - lang/solidity
  - sector/bridge
  - sector/nft
  - sector/staking
  - has/github
  - has/poc
  - severity/high
protocol: "[[NFTMirror]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/NFTMirror-security-review_2024-12-30.md"
genome:
  - "[[dos-resistance]]"
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
---
# [H-02] `lzReceive()` call for `releaseOnEid()` results in OOG error

- id: 50038
- impact: HIGH
- protocol: NFTMirror_2024-12-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/NFTMirror-security-review_2024-12-30.md

## Summary


This bug report is about an issue with the release of a shadow NFT on a different chain. The severity of this bug is considered medium and the likelihood of it occurring is high. The problem lies in the `NFTShadow.releaseOnEid()` function, where the gas limit used for the execution of the `lzReceive()` call is insufficient. This can lead to an out-of-gas error and require multiple retries with a higher gas limit. A proof of concept has been provided to replicate the issue. The recommendation is to increase the amounts used in the calculation of the gas limit and allow users to manually adjust the gas limit for the `lzReceive()` call.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The release of a shadow NFT on a different chain is initiated in the `NFTShadow.releaseOnEid()` function. This function calculates the `options` parameter for the LayerZero message as follows:

```solidity
    uint128 private constant _BASE_OWNERSHIP_UPDATE_COST = 80_000;
    (...)
    uint128 private constant _INCREMENTAL_OWNERSHIP_UPDATE_COST = 20_000;
    (...)
    function getSendOptions(uint256[] calldata tokenIds) public pure returns (bytes memory) {
        uint128 totalGasRequired =
            _BASE_OWNERSHIP_UPDATE_COST + (_INCREMENTAL_OWNERSHIP_UPDATE_COST * uint128(tokenIds.length));

        return OptionsBuilder.newOptions().addExecutorLzReceiveOption(totalGasRequired, 0);
    }
```

The issue is that the gas limit used for the execution of the `lzReceive()` call in the target chain is insufficient. For example, if the target chain is another shadow chain, it might be required to mint or transfer the shadow NFT. Minting a new shadow NFT costs ~46,700 gas and transferring a shadow NFT costs ~27,300 gas. That amount might be much higher if a transfer validator contract is used, as a call to `validateTransfer()` would be made before each mint or transfer. However, in the calculation of the gas limit, only 20,000 gas is added for each token ID.

This will lead to an out-of-gas error when executing the `lzReceive()` call, always requiring to retry executing the message with a higher gas limit.

## Proof of concept

Add the following test to the file `NFTShadow.t.sol` and run `forge test --mt test_unlockShadowOOG -vvvv`.

```solidity
function test_unlockShadowOOG() public {
    uint256[] memory tokenIds = new uint256[](1);
    tokenIds[0] = tokenId;

    // Calculate gasLimit used on the lzReceive() call
    uint128 _BASE_OWNERSHIP_UPDATE_COST = 80_000;
    uint128 _INCREMENTAL_OWNERSHIP_UPDATE_COST = 20_000;
    uint128 totalGasRequired = _BASE_OWNERSHIP_UPDATE_COST + (_INCREMENTAL_OWNERSHIP_UPDATE_COST * uint128(tokenIds.length));

    vm.selectFork(apechainForkId);
    vm.startPrank(address(beacon.endpoint()));
    bytes memory transferMessage = abi.encode(bayc, recipient, tokenIds);
    Origin memory origin = Origin({srcEid: mainnetEid, sender: AddressCast.toBytes32(address(shadowLockbox)), nonce: 0});
    // DVN calls lzReceive() on the target chain
    beacon.lzReceive{ gas: totalGasRequired }(
        origin,
        bytes32(0),
        transferMessage,
        address(0),
        ""
    );
    vm.stopPrank();

    // Check that the message has been stored for retrial
    bytes32 payloadHash = beacon.payloadHashes(origin.srcEid, origin.sender, origin.nonce);
    assert(payloadHash != bytes32(0));
}
```

The snippet of the console logs:

```js
    │   │   ├─ [27985] NFTShadow::unlockTokens([8903], 0x5C04911bA3a457De6FA0357b339220e4E034e8F7)
    │   │   │   └─ ← [OutOfGas] EvmError: OutOfGas
    │   │   └─ ← [Revert] EvmError: Revert
```

## Recommendations

- Increase the amounts used in the calculation of the gas limit for the `lzReceive()` call in the `NFTShadow.getSendOptions()` function.
- Allow users to increase the gas limit for the `lzReceive()` call in the `NFTShadow.releaseOnEid()` function, beyond the default value.
