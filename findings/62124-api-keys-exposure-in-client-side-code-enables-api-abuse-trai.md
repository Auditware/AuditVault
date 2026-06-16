---
tags:
  - platform/trailofbits
  - lang/solidity
  - has/github
  - severity/high
  - sector/wallet
protocol: "[[Gemini]]"
auditors:
  - "[[Coriolan Pinhas Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-08-gemini-smartwallet-securityreview.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# API keys exposure in client-side code enables API abuse

- id: 62124
- impact: HIGH
- protocol: [[Gemini]] Smart Wallet
- reporter: Coriolan Pinhas Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-08-gemini-smartwallet-securityreview.pdf

## Summary


This bug report discusses a security issue where the API keys are exposed in the client-side code, making it easy for malicious users to access and potentially abuse them. This can lead to unexpected costs for the service. The report recommends implementing security measures such as using different keys for debug and production builds, rotating keys regularly, and enabling rate-limiting or monitoring. In the long term, it suggests implementing an API gateway pattern to prevent abuse, but notes that this may slow down the connection.

## Details

## Security Analysis Report

## Difficulty: Low

## Type: Data Validation

## Description
The API keys are exposed in client-side code, allowing malicious users to extract and abuse them. The API keys are used to create a Pimlico client for bundling transactions and to get on-chain information using Alchemy. However, the API key is currently being sent to the client browser, where it can be accessed through browser developer tools. This enables unauthorized users to make API calls using Gemini’s API key, potentially exhausting the API quota or incurring unexpected costs.

```javascript
// Create Pimlico configuration for bundling transactions
const pimlicoUrl =
`https://api.pimlico.io/v2/${chainId}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`;
const pimlicoTransport = http(pimlicoUrl);
```

![Figure 4.1](https://example.com/pimlico_url) The Pimlico URL containing the API key is shared with the client.  
![Figure 4.2](https://example.com/chrome_dev_tools) Chrome developer tool on the client side.

## Exploit Scenario
A malicious user connects to the Gemini wallet and inspects the network requests or browser developer tools. They extract the Pimlico API key from the client-side code. Using this key, they can make direct API calls to Pimlico’s services, potentially exhausting the API quota or incurring unexpected costs for the Gemini wallet service.

## Recommendations
### Short Term
The following security measures should be implemented:
- Keys should have minimal privileges, if possible.
- Use different keys for debug and production builds.
- Rotate keys regularly.
- Enable rate-limiting or monitoring.

### Long Term
Implement a proper API gateway pattern where all third-party API calls are proxied through the SDK server, with appropriate rate limiting and monitoring to prevent abuse. Note that this recommendation has the side effect of slowing down the connection.
