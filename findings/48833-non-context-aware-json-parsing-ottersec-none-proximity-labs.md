---
tags:
  - lang/rust
  - lang/solidity
  - platform/ottersec
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - sector/infra
protocol: "[[Proximity Labs]]"
auditors:
  - "[[Robert Chen]]"
report: "https://www.proximity.dev/"
genome:
  - "[[message-spoofing]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Non-context-aware JSON Parsing

- id: 48833
- impact: HIGH
- protocol: [[Proximity Labs]]
- reporter: Robert Chen (OtterSec)
- source: https://www.proximity.dev/

## Summary


The Near-Eth Contract is using a non-context-aware JSON parsing method which allows for unintended actions and transactions to be injected. This could potentially lead to a loss of user funds if maliciously-formed JSON input is used. The vulnerability is rated as High due to its potential impact. A proof of concept and remediation steps are provided. Additionally, general findings regarding inefficient string splitting procedures and suggested changes to Rust compiler flags are mentioned.

## Details

## Custom JSON Parsing in Near-Eth Contract

Custom JSON parsing is used within the Near-Eth Contract. This parsing method is non-context-aware, which allows for the injection of unintended actions and transactions when transmitting JSON bodies.

## Example Scenario

As an example, consider an application **X** with a Near account. The Near-Eth Contract is deployed on **X**, and it is providing a service **Y** as a REST API. This API is configured to send `FunctionCalls` to a Near contract, possibly taking user input according to the sample pseudocode provided below:

```pseudo
route('/api/call'):
    action = get_json_input()
    /* JSON Input:
    {
        type: 'FunctionCall',
        method_name: method_name,
        args: args,
        amount: '2.2',
        gas: '50000000000000',
    }
    */
    check(action.gas, action.amount)
    transaction = {
        nonce: get_c_nonce(),
        transactions: [
            {
                receiver_id: 'arbitraryContract.near',
                actions: [
                    action
                ]
            }
        ]
    }
    res = contract.function_call({
        name: 'execute',
        args: gen_args(transaction)
    })
    return res.is_ok()
```

Provided with maliciously-formed JSON input, the on-chain program could mistakenly send untrusted actions and transactions. For example, this could allow an attacker to spoof the **Transfer** action, leading to a loss of user funds. Maliciously-formed JSON input causing a loss of funds is exemplified below:

```json
{
    type: 'FunctionCall',
    method_name: 'I_am_a_Function',
    args: '6161',
    amount: '2.2',
    gas: '50000000000000',
    attack_controlled_object: {
        split: 'start]},{end',
        receiver_id: 'attacker.near',
        actions: [{
            type: 'Transfer',
            amount: '1337'
        }]
    }
}
```

This occurs because the user is able to create new key arrays in the transaction and action fields, allowing them to take advantage of the non-context-aware JSON parsing and create unintended actions. Another example of maliciously-formed JSON user input, as well as its result, is shown below:

```json
{
    nonce: 'pew',
    transactions: [
        {
            receiver_id: 'testnet',
            actions: [
                {
                    type: 'FunctionCall',
                    method_name: 'create_account',
                    args: {
                        "pew": "},{xxd",
                        "type": "GG",
                        "ARGS": "ARE OP"
                    },
                    amount: '2.2',
                    gas: '50000000000000',
                }
            ]
        }
    ]
}
```

### Potential Impact

While this vulnerability does require that a user is able to submit JSON bodies as part of their input, it nevertheless is rated as **High** due to its potential to spoof highly important actions.

## Proof of Concept

1. Attacker accesses service **Y** running on application **X** and uploads malformed JSON data as user input.
2. Attacker utilizes non-context-aware JSON parsing to inject an unintended/malicious transaction action, which is then sent to the Near-Eth contract and processed, leading to loss of funds.

## Remediation

Instead of using a custom JSON parsing solution, we recommend storing all values and keys as hex-encoded binaries. Chunks of data would be split by delimiters and decoded using `hex::decode` and `readChunk` in combination. Three context-specific delimiters would be used to separate transactions, actions, and chunks.

## Patch

We worked closely with Proximity Labs to rewrite the format of the structured data. The parsing code now uses length indicators to properly delineate data segments, instead of splitting on JSON delimiters. This makes it much harder for a malicious user to inject their own packets into the data stream.

### Example Code

```rust
while transaction_data_copy.len() > 0 {
    let transaction_len: usize = expect(transaction_data_copy[HEADER_OFFSET..HEADER_SIZE].parse().ok());
    transaction_data_copy = &transaction_data_copy[PAYLOAD_START + transaction_len..];
    num_txs += 1;
}
```

We also worked with the team to introduce a receivers list at the start of the payload to make it much harder for an adversary to hide malicious receivers. This way, a user can easily inspect the payload and identify which addresses are involved in the transaction.

```rust
receivers_data = &receivers_data[PAYLOAD_START..PAYLOAD_START + receivers_len];
let mut receivers: Vec<&str> = receivers_data.split(",").collect();
if num_receivers != receivers.len() || receivers_len != receivers_data.len() {
    sys::panic();
}
```

## General Findings

Here we present a discussion of general findings during our audit. While these findings do not present an immediate security impact, they do represent anti-patterns and could introduce a vulnerability in the future.

| ID              | Description                                     |
|-----------------|-------------------------------------------------|
| OS-PRX-SUG-00   | `contract/src/lib.rs` contains inefficient string splitting procedures. |
| OS-PRX-SUG-01   | Rust compiler flags could be changed for optimization’s sake. |
