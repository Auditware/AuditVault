---
tags:
  - severity/high
protocol: "[[Shieldflow]]"
auditors:
  - "[[Auditware]]"
  - sector/oracle
genome:
  - "[[access-roles]]"
  - "[[auth/signature-validation]]"
  - "[[privilege-escalation/admin-takeover]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-access-control]]"
  - "[[blast-radius/protocol-wide]]"
---
# **AW-H-05: Weak Authentication Mechanism Prone to Brute Force Attacks** {#aw-h-05:-weak-authentication-mechanism-prone-to-brute-force-attacks}

**Severity: High										Status: Fixed**

**Retest:**

During the audit performed in March 2026 it was found that the finding was **fixed**. It was verified that the vulnerable admin HTTP endpoint was removed and replaced with a **410 Gone** response, with admin operations moved to a CLI tool accessible only via AWS SSM Session Manager.

**Locations:**

* [**shieldflow-asp/src/routes/index.ts\#L281-L294**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/src/routes/index.ts#L281-L294)

**Description:**  
The ASP admin API authenticates requests using a static Bearer token compared with plain string equality against the **ADMIN\_API\_KEY** environment variable:

**const provided \= req.headers\['authorization'\]?.replace('Bearer ', '');**  
 **if (\!provided || provided \!== adminKey) {**  
   **res.status(401).json({ error: 'Unauthorized' });**  
   **return;**  
 **}**

  An attacker who knows the endpoint path faces no meaningful resistance:

* Every request returns a clean binary response \- 401 for a wrong token, 200 for the correct one \- making it a direct enumeration oracle.                    
* No rate limiting, lockout, or failed attempt tracking is applied specifically to admin routes.                                                             
* The only protection in place is a global limiter of 100 requests per minute per IP, trivially bypassed by distributing requests across multiple source Addresses.

An attacker can probe candidate tokens at scale with nothing on the server side to detect or interrupt the process. Once the correct key is recovered, they can call revoke-label \- removing legitimate depositors from the ASP Merkle tree and locking them out of the protocol entirely.

**Recommendations:**

* Replace **\!==** with **crypto.timingSafeEqual()** at line 289 to prevent timing-based enumeration.  
* Add a dedicated rate limiter on all admin routes (max 5 req/min per IP), independent of the global limiter, with lockout after repeated failures.
