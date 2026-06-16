---
tags:
  - lang/solidity
  - sector/bridge
  - sector/stable
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[Next Generation]]"
auditors:
  - 0xvd
report: "https://code4rena.com/reports/2025-01-next-generation"
genome:
  - "[[permit-fork-replay]]"
  - "[[replay]]"
  - "[[variant]]"
  - "[[bridge-is-secure]]"
  - "[[signature-is-unique]]"
  - "[[add-nonce]]"
  - "[[cross-chain-message]]"
---
# [H-01] Cross-chain signature replay attack due to user-supplied `domainSeparator` and missing deadline check

- id: 56703
- impact: HIGH
- protocol: Next Generation
- reporter: 0xvd (Code4rena)
- source: https://code4rena.com/reports/2025-01-next-generation

## Summary


This bug report highlights a vulnerability in the `_verifySig` function of the `Forwarder.sol` contract. This function accepts the `domainSeparator` as a user-provided input, making it possible for an attacker to replay valid signatures on different chains if the user's nonce matches. This could lead to unauthorized fund transfers. Additionally, there is no deadline check, meaning signatures remain valid indefinitely and could be used for future attacks. To mitigate this issue, it is recommended to compute the `domainSeparator` on-chain, enforce a deadline check, and use chain-specific identifiers. The severity of this vulnerability has been increased to high due to the project's intention to deploy across multiple chains. It is also noted that the major stable coins have different addresses on different chains, making it less likely for this vulnerability to be exploited. The sponsors of the project have confirmed the severity of this finding and have emphasized the importance of incorporating a salt and `block.chainid` for the security of the `Forwarder` implementation.

## Details



<https://github.com/code-423n4/2025-01-next-generation/blob/499cfa50a56126c0c3c6caa30808d79f82d31e34/contracts/Forwarder.sol# L101>

<https://github.com/code-423n4/2025-01-next-generation/blob/499cfa50a56126c0c3c6caa30808d79f82d31e34/contracts/Forwarder.sol# L153>

### Finding description

The `_verifySig` function in `Forwarder.sol` accepts the `domainSeparator` as a user-provided input instead of computing it internally. This introduces a vulnerability where signatures can be replayed across different chains if the user’s nonce matches on both chains.

Additionally, there is no deadline check, meaning signatures remain valid indefinitely. This lack of expiration increases the risk of signature replay attacks and unauthorized transaction execution.

### Impact

1. **Cross-Chain Signature Replay Attack** – An attacker can reuse a valid signature on a different chain where the user’s nonce is the same, potentially leading to unauthorized fund transfers.
2. **Indefinite Signature Validity** – Without a deadline check, an attacker could store valid signatures and execute them at any point in the future.

### Proof of Concept

**Affected Code**

1. `_verifySig` function (user-controlled `domainSeparator` and no deadline check):
```

function _verifySig(
    ForwardRequest memory req,
    bytes32 domainSeparator,
    bytes32 requestTypeHash,
    bytes memory suffixData,
    bytes memory sig
) internal view {
    require(typeHashes[requestTypeHash], "NGEUR Forwarder: invalid request typehash");
    bytes32 digest = keccak256(
        abi.encodePacked("\x19\x01", domainSeparator, keccak256(_getEncoded(req, requestTypeHash, suffixData)))
    );
    require(digest.recover(sig) == req.from, "NGEUR Forwarder: signature mismatch");
}
```

2. `_getEncoded` function (included in the signature computation):
```

function _getEncoded(
    ForwardRequest memory req,
    bytes32 requestTypeHash,
    bytes memory suffixData
) public pure returns (bytes memory) {
    return abi.encodePacked(
        requestTypeHash,
        abi.encode(req.from, req.to, req.value, req.gas, req.nonce, keccak256(req.data)),
        suffixData
    );
}
```

3. `execute` function (where `_verifySig` is used):
```

function execute(
    ForwardRequest calldata req,
    bytes32 domainSeparator,
    bytes32 requestTypeHash,
    bytes calldata suffixData,
    bytes calldata sig
) external payable returns (bool success, bytes memory ret) {
    _verifyNonce(req);
    _verifySig(req, domainSeparator, requestTypeHash, suffixData, sig);
    _updateNonce(req);

    require(req.to == _eurfAddress, "NGEUR Forwarder: can only forward NGEUR transactions");

    bytes4 transferSelector = bytes4(keccak256("transfer(address,uint256)"));
    bytes4 reqTransferSelector = bytes4(req.data[:4]);

    require(reqTransferSelector == transferSelector, "NGEUR Forwarder: can only forward transfer transactions");

    (success, ret) = req.to.call{gas: req.gas, value: req.value}(abi.encodePacked(req.data, req.from));
    require(success, "NGEUR Forwarder: failed tx execution");

    _eurf.payGaslessBasefee(req.from, _msgSender());

    return (success, ret);
}
```

### Exploitation scenario

1. A user signs a valid transaction on Chain A.
2. An attacker copies the signature and submits it on Chain B (where the user has the same nonce).
3. Since `domainSeparator` is not verified by the contract, the signature is accepted on both chains.
4. The attacker successfully executes a transaction on Chain B without the user’s consent.

**Additional Risk:** The absence of a deadline check means an attacker could store a signature indefinitely and execute it at any time in the future.

### Recommended mitigation steps

1. **Compute `domainSeparator` On-Chain:** Instead of accepting `domainSeparator` as a function argument, compute it within the contract using `block.chainid` to ensure domain uniqueness.
2. **Enforce a Deadline Check:** Introduce a deadline verification within `_verifySig` to ensure signatures expire after a reasonable time. Example:

   
```

   if (block.timestamp > req.deadline) revert DeadlineExpired(req.deadline);
   
```

3. **Use Chain-Specific Identifiers:** Incorporate `block.chainid` into the domain separator computation to prevent cross-chain signature reuse.

By implementing these fixes, the contract can prevent signature replay attacks and unauthorized transactions across different chains.

**[0xsomeone (judge) increased severity to High and commented](https://code4rena.com/audits/2025-01-next-generation/submissions/F-3?commentParent=nJRngNAwLte):**

> The submission and its duplicates outline that the domain separator is passed in as an argument to the `Forwarder` and thus a replay attack is possible due to this trait.
>
> The replay attack would be possible only if the trusted forwarder is re-deployed without any modifications, an event that is considered unlikely. Any upgrade of the `Forwarder` would need to inherit the utilized nonces of the previous implementation and thus would prevent a replay from occurring, at least in the scenario a few of the submissions focus on.
>
> The in-scope documentation of the project, however, states that the system is expected to be deployed across three distinct blockchains rendering the attack feasible and thus the vulnerability to be of high severity justifiably.
>
> Any submission that did not highlight the cross-chain aspect of the vulnerability will be penalized by 25% (i.e. rewarded 75%) as the local-chain redeployment should *normally* not be exploitable and would be considered a medium-severity flaw.
>
> To note, L-5 of the bot report has identified this vulnerability but has failed to give it the attention it requires. Specifically, the bot report marked it as a low-severity finding even though it is a high-severity one based on the project’s intentions to be deployed across chains. As the severity has effectively shifted two levels (`L -> H`), I consider this submission to be in-scope in accordance with previous rulings.

**[givn (warden) commented](https://code4rena.com/audits/2025-01-next-generation/submissions/F-3?commentParent=nJRngNAwLte&commentChild=uTAf7TrrQvk):**

> Having the domain separator supplied from the caller is definitely an issue and should be fixed. There is one thing that’s interesting about this attack path that wasn’t mentioned anywhere.
>
> One part of the signed data is `ForwardRequest.to`, which contains the EURF contract address. If we sign a transfer on chain A, then an attacker submits the same tx on chain B, for the exploit to succeed the EURF contract should be deployed on the same address. Otherwise, the following require statement will revert the tx on chain B:
> `require(req.to == _eurfAddress, "NGEUR Forwarder: can only forward NGEUR transactions");`
>
> Did a quick check on the contracts for the major stable coins and all of them had different addresses across various chains. What are the odds that EURF will be deployed on the same address?

**[0xsomeone (judge) commented](https://code4rena.com/audits/2025-01-next-generation/submissions/F-3?commentParent=nJRngNAwLte&commentChild=Ljqmoksvd2n):**

> Hey @givn, the major stable coins have been deployed several years in the past, prior to consistent addresses across chains becoming the norm (i.e. via `create2` or other similar avenues of deterministic deployment addresses).
>
> The issue outlined is significant and applicable to the concept of the cross-chain deployment that the project intends, especially when we consider that the MPC system they will deploy will lead to a consistent address across chains and thus a potentially consistent deployment address for the contracts on each chain.
>
> I would like to note that the sponsors have also confirmed the severity of this finding directly, indicating that they anticipate their deployment will be at the same address across multiple chains, and consider the inclusion of both a salt and a `block.chainid` to be imperative for the security of the `Forwarder` implementation.

---


