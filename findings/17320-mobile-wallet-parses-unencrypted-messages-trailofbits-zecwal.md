---
tags:
  - lang/solidity
  - sector/privacy
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[ZecWallet]]"
auditors:
  - "[[TrailOfBits]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/zecwallet.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Mobile wallet parses unencrypted messages

- id: 17320
- impact: HIGH
- protocol: [[ZecWallet]]
- reporter: 2019: Initial report delivered Final report delivered (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/zecwallet.pdf

## Summary


This bug report concerns the authentication system of a mobile application. It describes how the message parsing code within the application allows for unencrypted messages to bypass the requirement for a shared secret key, which can lead to malicious messages being sent. This is due to the decryption and underlying parsing of messages being completed within the same function on mobile devices. If the nonce field exists in the JSON message, the application will perform the decryption and a recursive call to parse it. If the payload field does not exist, it is assumed the payload has been decrypted and is loaded accordingly. This means that the mobile application will parse unencrypted responses and present unauthenticated information to the user.

The bug report also describes an exploit scenario. If an attacker has knowledge of the IP address of the desktop wallet server, they can poison the network to redirect traffic to their own server code or assign themselves the server's previous IP address when it is released. If the mobile client connects to the malicious server, the attacker can ignore all encrypted incoming traffic and leverage the implications of TOB-ZEC-001 to force the mobile app to parse unencrypted responses to requests that were never sent. This would allow the attacker to spoof information such as balances, transaction history and receive addresses for the wallet, potentially leading to the loss of funds.

The bug report recommends that, in the short term, the parseResponse function should be split into two functions: one to perform decryption of the payload and one to parse decrypted payloads. In the long term, any invariants related to cryptography should be noted and ensured that they hold and are not subject to conditions an attacker could leverage. A proof of concept python server is included in Appendix B which replicates this issue.

## Details

## Authentication
## Target: Mobile Authentication

**Difficulty:** Low

### Description
Message parsing code in the mobile application allows the parsing of unencrypted messages, bypassing the requirement for a shared secret key to send malicious messages. The decryption and underlying parsing of messages is completed within the same function on mobile devices. If the nonce field exists in the JSON message, it is assumed the payload is awaiting decryption, in which case the application will perform the decryption and a recursive call to parse it. If the payload field does not exist, it is assumed the payload has been decrypted, and it is loaded accordingly. Consequently, the mobile application will parse unencrypted responses and present unauthenticated information to the user.

```kotlin
fun parseResponse(response: String): ParseResponse {
    // Parse response JSON
    // [...]
    
    // Check if input string is encrypted
    if (json.containsKey("nonce")) {
        val decrypted = decrypt(json["nonce"].toString(), json["payload"].toString())
        if (decrypted.startsWith("error")) {
            return ParseResponse(false, "Encryption Error: $decrypted", true)
        }
        return parseResponse(decrypted)
    }
    // Parse underlying commands
    // [...]
}
```

*Figure 1: Response parsing excerpt (DataModel.kt#L73-L79)*

Furthermore, decryption and parsing recursion based on the existence of a nonce field means that a user could pre-compute a message which has undergone many rounds of encryption. This message could then be spammed to the user to force the mobile app to perform all necessary rounds of decryption.

### Exploit Scenario
With knowledge about Alice’s desktop wallet server’s IP, Eve could poison the network to redirect traffic to her own server code, or assign herself the server’s previous IP when it is released. In the event that the mobile client connects to Eve’s malicious server, Eve could ignore all encrypted incoming traffic and leverage the implications of TOB-ZEC-001 to force Alice’s mobile client to parse unencrypted responses to requests that were never sent, or that Eve has no knowledge of.

This would allow Eve to spoof information such as balances, transaction history, and the receive addresses for Alice’s wallet. Assuming Bob wishes to send Alice funds, Alice could unknowingly share a malicious receive-address with Bob, resulting in the loss of Bob’s funds.

### Recommendation
Short term, the `parseResponse` function should be split into two functions: a function which performs decryption of the payload, and a function which parses decrypted payloads. This way, encryption will always be expected.

Long term, make a note of any invariants related to cryptography, such as the expectation of encryption on some packets. Ensure these invariants hold and are not subject to conditions an attacker could leverage.

Appendix B contains a proof of concept python server which replicates this issue.
