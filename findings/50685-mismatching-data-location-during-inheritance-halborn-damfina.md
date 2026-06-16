---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/oracle
protocol: "[[LMCV]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/damfinance/lmcv-part-3-smart-contract-security-assessment"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[chainlink-round-completeness]]"
---
# MISMATCHING DATA LOCATION DURING INHERITANCE

- id: 50685
- impact: HIGH
- protocol: [[LMCV]] part 3
- reporter: Halborn
- source: https://www.halborn.com/audits/damfinance/lmcv-part-3-smart-contract-security-assessment

## Summary


The dPrimeConnectorHyperlane contract was found to be incompatible with the latest Hyperlane protocol and may cause users to lose their dPrime tokens during cross-chain transfers. This is because the storage location of the _message parameter was changed in a newer version of Hyperlane, causing the contract to read invalid data. The issue was identified by the Solidity team and has been fixed by the DAMfinance team by changing the storage location and fixing the versions of Hyperlane contracts in the package.json file. 

## Details

##### Description

It was identified that the `dPrimeConnectorHyperlane` contract was incompatible with the latest `Hyperlane` protocol and might not work with new versions of `Hyperlane Inbox` contracts, which can lead to users losing their `dPrime` tokens during cross-chain transfers.

The `dPrimeConnectorHyperlane` contract is inherited from the `Hyperlane Router` abstract contract. When receiving a message from another chain, the `handle` function is called by the corresponding `Hyperlane Inbox` contract. This function calls the internal `_handle` function that can be overridden in the derived contracts.

The following code is an example from the `Hyperlane Router` version `0.5.0`:

#### @hyperlane-xyz/app/contracts/Router.sol (0.5.0)

```
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _message
    ) external virtual override onlyInbox onlyRemoteRouter(_origin, _sender) {
        // TODO: callbacks on success/failure
        _handle(_origin, _sender, _message);
    }

    // ============ Virtual functions ============
    function _handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _message
    ) internal virtual;

```

The `_handle` function was overridden in the `dPrimeConnectorHyperlane` contract:

#### hyperlane/dPrimeConnectorHyperlane.sol

```
    function _handle(
        uint32 _origin,
        bytes32,
        bytes memory _message
    ) internal override alive {

```

However, from `Hyperlane` version `0.5.1`, the storage location of the `_message` parameter was changed from `memory` to `calldata`:

#### @hyperlane-xyz/app/contracts/Router.sol (0.5.1)

```
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external virtual override onlyInbox onlyRemoteRouter(_origin, _sender) {
        // TODO: callbacks on success/failure
        _handle(_origin, _sender, _message);
    }

    // ============ Virtual functions ============
    function _handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) internal virtual;

```

[A bug concerning data location during inheritance](https://blog.soliditylang.org/2022/05/17/data-location-inheritance-bug/) was identified in Solidity on May 17, 2022. According to the Solidity team, the `calldata` pointer in these cases is interpreted as a `memory` pointer which results in reading invalid data from memory.

It is also noted that the current protocol is not configured with a fixed version of `Hyperlane` dependencies. In the `package.json` configuration file, floating versions are used, which means that the contract might be deployed with an incompatible `Hyperlane` messaging protocol:

#### package.json

```
  "dependencies": {
    "@chainlink/contracts": "^0.4.1",
    "@hyperlane-xyz/app": "^0.5.0",
    "@hyperlane-xyz/sdk": "^0.5.0",
    "@layerzerolabs/solidity-examples": "^0.0.4",
    "@openzeppelin/contracts": "^4.5.0",
    "solc": "^0.8.15"
  }

```

As proof of concept, the `dPrimeConnectorHyperlane` contract was deployed with `Hyperlane` version `0.5.0`. It was possible to mint tokens by calling the `handle` function:

![missmatching_data_locations_2_memory.png](https://halbornmainframe.com/proxy/audits/images/659eb9e4a1aa3698c0ed3fdd)

The contract was also deployed using the `Hyperlane` version `0.5.1`. Calling the `handle` function with the same parameters resulted in an error and corrupted data:

![missmatching_data_locations_2_calldata.png](https://halbornmainframe.com/proxy/audits/images/659eb9e3a1aa3698c0ed3fda)

Note that it is not possible to recover the tokens from corrupted data using the `retry` function of the `dPrimeConnectorHyperlane` contract.

##### Score

Impact: 4  
Likelihood: 4

##### Recommendation

**SOLVED**: The `DAMfinance team` solved the issue in commit [c19b217](https://github.com/DecentralizedAssetManagement/lmcv/commit/c19b217a1818dcdfd58def452f81840aa1907cfd) by changing the storage location of the `_message` parameter from `memory` to `calldata` and fixing the versions of the `Hyperlane` contracts in the `package.json` configuration file.
