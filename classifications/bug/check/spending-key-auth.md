---
tags:
  - check/spending-key-auth
  - sector/zk
  - sector/privacy
---
Is the spending authorization key derived and validated in a way that prevents replay, phishing, and cross-domain signature theft? Verify that EIP-712 domains include chainId and verifyingContract, that derived keys are bound to a specific context or expiry, and that the derivation cannot be replicated by an attacker controlling a lookalike domain.
