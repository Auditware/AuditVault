---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/dex
  - sector/infra
  - sector/staking
  - sector/zk
protocol: "[[Kakarot]]"
auditors:
  - "[[RadiantLabs]]"
report: "https://code4rena.com/reports/2024-09-kakarot"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[circuit-input-range-check]]"
---
# [H-01] Unauthorized contracts can bypass precompile authorization via `delegatecall` in [[Kakarot]] zkEVM

- id: 45168
- impact: HIGH
- protocol: Kakarot
- reporter: RadiantLabs (Code4rena)
- source: https://code4rena.com/reports/2024-09-kakarot

## Summary


The Kakarot zkEVM implementation has a vulnerability that allows unauthorized contracts to bypass the precompile authorization mechanism using the `delegatecall` function. This means that these unauthorized contracts can execute privileged functions intended only for authorized contracts, compromising the security of the system. The vulnerability is caused by the authorization mechanism only considering the code address and not the execution address, allowing unauthorized contracts to exploit this behavior. The impact of this vulnerability could be catastrophic, especially for DEXs that support callbacks. The recommended mitigation is to ensure that all whitelisted contracts are written with the assumption that they can also be `delegatecall`ed and to disable `delegatecall`s for custom precompiles. The severity of this vulnerability is high and has been confirmed and mitigated by the Kakarot team. 

## Details


In the Kakarot zkEVM implementation `exec_precompile`, unauthorized contracts can bypass the precompile authorization mechanism using the `delegatecall`. This allows unauthorized contracts to execute privileged precompile functions intended only for authorized (whitelisted) contracts, compromising the security and integrity of the system.

### Vulnerability Details:

Let's take a look at the `exec_precompile` function with the unessential part omitted for brevity:

```cairo
func exec_precompile{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    range_check_ptr,
    bitwise_ptr: BitwiseBuiltin*,
}(
    precompile_address: felt,
    input_len: felt,
    input: felt*,
    caller_code_address: felt,
    caller_address: felt,
) -> (output_len: felt, output: felt*, gas_used: felt, reverted: felt) {

    //SNIP...
    // Authorization for Kakarot precompiles
    let is_kakarot_precompile = PrecompilesHelpers.is_kakarot_precompile(precompile_address);
    if is_kakarot_precompile != 0 {
        // Check if caller is whitelisted
        let is_whitelisted = KakarotPrecompiles.is_caller_whitelisted(caller_code_address);
        if is_whitelisted == FALSE {
            jmp unauthorized_call;
        }
        // Proceed with precompile execution
        // ...
    } else {
        jmp unauthorized_call;
    }
}
```

The issue arises because the authorization mechanism relies solely on `caller_code_address`, which refers to the code being executed, and does not consider `caller_address`; the actual address of the contract making the call. This approach is insufficient and can be exploited using `delegatecall`.

If an EVM contract A `delegatecall`'s EVM contract B, and B is `allowlisted`, then the call to the Cairo precompile succeeds because the `allowlist` is based on the code address (of B) and not on the execution address (of A).

This means that an unauthorized contract (Contract A) can exploit this behavior to execute privileged operations by delegatecalling a whitelisted contract (Contract B) and passing the authorization check incorrectly.

As such, it is an issue for other whitelisted smart contracts allowing arbitrary calls to external smart contracts. For example, this is the case of some smart contracts allowing callbacks. In those situations, a malicious user could make a DEX execute a call to the malicious smart contract that would be able to access the precompiles pretending to be the DEX.

### Impact

This issue could allow unauthorized contracts to perform operations that should be restricted to whitelisted contracts like in the case of DEX that supports callbacks and has been added to the `allowistlist`. Moreover, all contracts within the `allowistlist` must be written with the assumption that they can also be `delegatecall`ed; i.e., they must not make any assumptions about their storage or their own EVM address (`address(this)`).

Prior to my discussion with the sponsor in a private thread about the implications of this attack surface, the sponsor intended to eventually remove the whitelist mechanism, not fully considering the dangers of delegatecalls to precompiles, which would have been a bad idea.

With the team’s plan to eventually remove the `allowlist`, prior to knowing about this attack surface, it gives any contract the opportunity to exploit this on KakarotEVM; which, as we’ve seen, can be catastrophic; especially in the case of [MoonBeam’s `msg.sender` impersonation disclosure](https://pwning.mirror.xyz/okyEG4lahAuR81IMabYL5aUdvAsZ8cRCbYBXh8RHFuE) by pwning.eth.

### Recommendation

In the interim, the obvious mitigation is to ensure that all whitelisted contracts are written with the assumption that they can also be `delegatecall`ed. And more importantly, the whitelist mechanism should never be removed, as this would open a floodgate of vulnerabilities to the protocol.

A permanent solution to this issue would be to disable `Delegatecall`s for custom precompiles.

### Assessed type

`call`/`delegatecall`

**[ClementWalter (Kakarot) confirmed and commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/124#issuecomment-2451969646):**
 > Severity: High<br>

**Kakarot mitigated:**
> [This PR](https://github.com/kkrt-labs/kakarot/pull/1567) fixes the issue raised during the audit about eventual honeypots that could lure a user and manipulate starknet tokens without explicit approvals:
> 1. Remove dependence on `the code_address for` whitelisting, which were reported dangerous.
> 2. Disable ability of having nested a delegatecall to `0x75001` at protocol level. (no longer possible to do User A `-call->` contract C `-delegatecall->DualVmToken -delegatecall->0x75001` as a byproduct of 1.
> 3. Added `noDelegateCall` modifier to L2KakarotMessaging and DualVMToken for extra security.
> 4. Added associated tests under Security.

**Status:** Mitigation confirmed.

***
