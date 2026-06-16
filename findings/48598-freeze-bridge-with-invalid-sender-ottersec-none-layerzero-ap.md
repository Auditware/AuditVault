---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/bridge
  - sector/lending
protocol: "[[LayerZero]]"
auditors:
  - "[[Robert Chen]]"
report: "https://layerzero.network/"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[bridge-sender-auth]]"
  - "[[dos-resistance]]"
---
# Freeze Bridge with Invalid Sender

- id: 48598
- impact: HIGH
- protocol: [[LayerZero Aptos]]
- reporter: Robert Chen (OtterSec)
- source: https://layerzero.network/

## Summary


The bug report discusses an issue where any user agent (UA) can send messages to any other endpoint, even though only the bridge UA is supposed to have this capability. This behavior is not enforced at the relayer level, causing potential denial of service attacks and freezing the bridge. The report recommends redesigning the relayer to better isolate message channels and advises application developers to pay attention to the affected functionality. The issue has been patched in a recent commit.

## Details

## LayerZero Audit 04 | Vulnerabilities

Only the bridge UA is intended to send messages to the bridge contract. However, this behavior is not enforced at the relayer level.

As shown below, any UA can send messages to any other endpoint.

```move
sources/endpoint.move
public fun send<UA>(dst_chain_id: u64, dst_address: vector<u8>,
payload: vector<u8>, fee: Coin<AptosCoin>, _cap: &UaCapability<UA>): (u64, Coin<AptosCoin>) acquires [..] {
    let ua_addr = type_address<UA>();
    let packet = packet::new_packet(
        global_store.local_chain_id, // src_chain_id
        bcs::to_bytes(&ua_addr), // src_address
        dst_chain_id,
        dst_address,
        [..]
    );
}
```

When a different UA sends a message to the bridge endpoint, the message is sent directly to the bridge’s packet queue, causing it to be returned when the bridge processes the next packet in receive. As expected, the packet sender is checked afterward, causing the `lz_receive` function to abort in the `assert_trusted_packet` function.

```move
sources/endpoint.move
public entry fun lz_receive<CoinType>(src_chain_id: u64, receiver: address) acquires CoinStore, GlobalStore {
    // receive packet
    let packet = endpoint::receive<BridgeUA>(src_chain_id, &global_store.lz_cap);
    assert_trusted_packet(global_store, &packet, src_chain_id);
}
```

```move
fun assert_trusted_packet(global_store: &GlobalStore, packet: &Packet, src_chain_id: u64) {
    assert!(table::contains(&global_store.trusted_remotes, src_chain_id), error::not_found(EBRIDGE_REMOTE_BRIDGE_NOT_FOUND));
    let src_bridge_addr = table::borrow(&global_store.trusted_remotes, src_chain_id);
    assert!(packet::src_address(packet) == *src_bridge_addr, error::permission_denied(EBRIDGE_INVALID_REMOTE_BRIDGE));
}
```

Because the packet is not cleared from the packet queue, it is impossible to retrieve the remaining packets out of the queue, so the bridge will remain frozen.

## Remediation

At its core, the bridge receive function is susceptible to denial of service attacks because any aborts will cause the transaction to revert, leaving the unprocessable packet behind.

To mitigate this particular attack scenario, we discussed it with LayerZero and recommended redesigning the relayer to better isolate message channels. By ensuring message channels are scoped on both `chain_id` and UA address, applications building on top of LayerZero are able to better reason about who they should be processing messages from.

At the same time, we recommend application developers building on top of LayerZero’s Aptos endpoints should be aware of this feature and pay extra attention to the `lz_receive` functionality to avoid potential denial of service scenarios.

## Patch

This issue was mitigated with isolated message channels in commit `efa7cf8`.

```move
sources/channel.move
struct Channels<phantom UA> has key {
    states: Table<Remote, Channel>
}
``` 

© 2022 OtterSec LLC. All Rights Reserved.
