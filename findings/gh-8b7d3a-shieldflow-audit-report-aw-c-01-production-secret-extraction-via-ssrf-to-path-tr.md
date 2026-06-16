---
tags:
  - severity/high
protocol: "[[Shieldflow]]"
auditors:
  - "[[Auditware]]"
  - sector/bridge
genome:
  - "[[access-roles]]"
  - "[[access-control/secret-exposure]]"
  - "[[privilege-escalation/admin-takeover]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# **AW-C-01: Production Secret Extraction via SSRF to Path Traversal in Relayer Proxy** {#aw-c-01:-production-secret-extraction-via-ssrf-to-path-traversal-in-relayer-proxy}

**Severity:** ***Critical***									**Status:** **Fixed**

**Retest:**  
During the audit performed in March 2026 it was found that the finding was **fixed**. It was verified that **localhost** and **127.0.0.1** were removed from **ALLOWED\_HOSTS** and path validation was tightened. Note that **isPrivateUrl** does not yet cover all loopback variants \- **169.254.169.254** (AWS metadata), IPv4-mapped IPv6, and short-form loopbacks such as **127.1** remain unblocked and should be added.

**Locations:**

* [**shieldflow-website/src/app/api/relayer-proxy/route.ts\#L24-L29**](https://github.com/shieldflow-dev/shieldflow-website/blob/ce3bcb41b4e875b9fd99e370b0e1ef6368fd710e/src/app/api/relayer-proxy/route.ts#L24-L29) 

* [**shieldflow-website/src/app/api/relayer-proxy/route.ts\#L31-L33**](https://github.com/shieldflow-dev/shieldflow-website/blob/ce3bcb41b4e875b9fd99e370b0e1ef6368fd710e/src/app/api/relayer-proxy/route.ts#L31-L33) 


**Description:**  
The relayer proxy endpoint **/api/relayer-proxy** is a server-side Next.js API route deployed on Vercel that forwards browser requests to ShieldFlow's relayer services. The endpoint accepts **url** and **path** query parameters from the caller, and proxies the request to the specified destination.

During the audit, two independent input-validation flaws (Server Side Request Forgery, leading to Path Traversal) allowed any unauthenticated attacker to attain a potential complete compromise of the protocol via the following way:

* Attackers either discover shieldflow as a highly valuable target, or even just globally scan the internet for common attack heuristics using large-scale automation.  
* Attacker sends a GET to [https://shieldflow.co/api/relayer-proxy?**url=http://localhost:9001**\&path=/health](https://shieldflow.co/api/relayer-proxy?url=http://localhost:9001&path=/health) as localhost is explicitly whitelisted. Port 9001 responds with a **Go HTTP 404** (Which among other services may indicate use of Vercel Node Bridge Runtime), confirming an internal service is reachable on loopback. This SSRF vulnerability is possible due to the **ALLOWED\_HOSTS** set, that allowed for localhost addresses (assumed for local staging but dragged over to prod):  
  **const ALLOWED\_HOSTS \= new Set(\[**  
   **'relayer.shieldflow.co',**  
   **'testnet-relayer.shieldflow.co',**  
   **'localhost',**  
   **'127.0.0.1',**  
  **\]);**

* The path parameter is validated with **startsWith('/health')**, which is bypassed using URL-encoded dot-segments: path=/health/**%2e%2e/2018-06-01/runtime/invocation/next**. Node.js **fetch()** normalises the path before sending, resolving it to **/2018-06-01/runtime/invocation/next** which is the Vercel Lambda "next invocation" internal API. This Path Traversal (%2e%2e resolving to ../../ i.e. backward path), is possible due to the insufficiently designed **isAllowedPath** function that only validates that the path starts with “health” and approves anything beyond that.  
  **function isAllowedPath(path: string): boolean {**  
  **return ALLOWED\_PATHS.some((prefix) \=\> path.startsWith(prefix));**  
  **}**

* The attacker gets back a response that contains a live RS256-signed JWT issued by oidc.vercel.com scoped to the production shieldflow-website project. If any downstream service (e.g. an AWS IAM role) trusts this OIDC issuer, the token is directly usable for authentication.  
* Each response also contains a per-invocation **responseCallbackCipherKey**, **responseCallbackCipherIV**, and **responseCallbackUrl** (an internal AWS TCP endpoint). With these, an attacker can encrypt a crafted HTTP response and deliver it to Vercel's internal callback, injecting arbitrary content into the response of the intercepted invocation.  
* The payload exposes Vercel **deploymentId**, **projectId**, **ownerId**, AWS account ID, internal TCP IPs, and all internal routing tokens \- providing an attacker persistent knowledge of the production infrastructure for further lateral movement.

Effectively this means any unauthenticated attacker on the internet can exfiltrate live production credentials and internal infrastructure secrets from ShieldFlow's Vercel deployment in a single HTTP request. Moreover, only this vector was investigated before the vulnerability was mitigated, and an advanced attacker might’ve mapped more local services for extended abuse surface leading to complete compromise of the AWS infrastructure etc.

PoC used:

**curl \-sv "[https://shieldflow.co/api/relayer-proxy?url=http://localhost:9001\&path=/health/%2e%2e/2018-06-01/runtime/invocation/next](https://shieldflow.co/api/relayer-proxy?url=http://localhost:9001&path=/health/%2e%2e/2018-06-01/runtime/invocation/next)"**

Confirmed extracted in production:

* Signed Vercel OIDC token  
* Internal AES encryption keys  
* Internal response callback URLs

**Recommendations:**

* Remove localhost and 127.0.0.1 from **ALLOWED\_HOSTS** \- No legitimate production use case exists for proxying browser requests to loopback. These entries should be deleted entirely, local development should use the real staging URL.  
* Apply thorough input validation on sensitive paths to not allow for path traversal (e.g. ../../ type attacks, encoded payloads etc)  
* Replace **startsWith** path validation with exact match \- Change **ALLOWED\_PATHS.some((prefix) \=\> path.startsWith(prefix))** to **ALLOWED\_PATHS**.includes(path).
