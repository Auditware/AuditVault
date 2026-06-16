---
tags:
  - blockchain/evm
  - lang/solidity
  - platform/auditware
  - severity/high
  - sector/staking
  - sector/token
protocol: "[[Swapboard]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[missing]]"
  - "[[reward-accounting]]"
---
# **AW-H-01: Insufficient Input Validation** {#aw-h-01:-insufficient-input-validation}

**Severity:** High									**Status:**Fixed

**Retest notes:**  
Fixed by adding forward slash escaping to \`**escapeHtml()**\` and replacing all \`**innerHTML**\` usage with safe \`**textContent**\` / \`**createTextNode**\` methods.

**Locations:**

* [**https://ethcf.github.io/swapboard/\#revoke-list**](https://ethcf.github.io/swapboard/#revoke-list) **(source)**  
* [**ETHCF/swapboard/frontend/app.js\#L2796**](https://github.com/ETHCF/swapboard/blob/9b4eed2444947d465b5e0e31e65d72b03f21320e/frontend/app.js#L2796) **(source)**  
* [**ETHCF/swapboard/frontend/app.js\#L1134**](https://github.com/ETHCF/swapboard/blob/9b4eed2444947d465b5e0e31e65d72b03f21320e/frontend/app.js#L1134) **(sink)**

**Description:**

During the audit, it was found that the protocol deploys a simple html/js/css setup as the protocol’s frontend.

Although standard UI frameworks such as React, Vue, or others are not mandatory for secure development, and sometimes present their own risks, they do provide a high level of built-in input sanitization, and control over when input sanitization is dangerous (e.g. via “**dangerouslySetInnerHTML**”). The swapboard implementation accommodates for this by its internal html escaping mechanism [escapeHtml](https://github.com/ETHCF/swapboard/blob/9b4eed2444947d465b5e0e31e65d72b03f21320e/frontend/lib.js#L49-L59), however, two issues were found:

* Although most of the characters to escape according to the [OWASP XSS prevention cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) are implemented, escaping of forward slash “/” is missing.  
* We found a user-controlled input instance (source), passed in the code until being parsed inside an innerHTML method (sink) insecurely.

To describe the latter’s risk, an attacker would follow this scenario:

* Attacker deploys a malicious ERC20 token with symbol name (e.g. **"EVIL\<img src=x onerror=alert(document.cookie)\>..."**)  
* Swapboard is a permissionless protocol and anyone can call **createOrder** to list any ERC20 token without approval  
* Victim views the orderbook and the attacker’s malicious order  
* Victim clicks “Revoke”, which triggers the unescaped symbol XSS payload within the vulnerable showToast function:  
  **![][image2]**

An attacker manages to exploit a scenario like portrayed above would be able to execute malicious JavaScript in the user’s browser context, allowing him top perform actions in that context like stealing session cookies, sign unauthorized transactions to drain tokens, replace the entire UI with fake wallet prompts to phish seed phrases, etc.

**Recommendation:**

* Default to **textContent** for all dynamic content unless HTML rendering is explicitly required  
* Do a sweep (now and periodically) of the code and ensure that all user input is escaped and sanitized all over the codebase. Especially always escape values before **innerHTML**.  
* Ensure full compliance with the specifications of [OWASP XSS prevention cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) on the escapeHtml method.  
* Implement Content-Security-Policy security header in responses returning from the frontend server to create a browser-enforced security boundary that blocks JavaScript execution from untrusted sources, blocking potential XSS payloads even when input sanitization fails.

# 

# **AW-M-01: Forced Browsing** {#aw-m-01:-forced-browsing}

**Severity:** Medium								**Status:** **Status:**Fixed

**Retest notes:**  
Fixed by implementing whitelist-based deployments that copy only production files to a \`**dist/**\` directory, excluding all development files (tests, configs, package.json).

**Locations:**

* [**ETHCF/swapboard/.github/workflows/pages.yml\#L6-L8**](https://github.com/ETHCF/swapboard/blob/9b4eed2444947d465b5e0e31e65d72b03f21320e/.github/workflows/pages.yml#L6-L8)   
* [**ETHCF/swapboard/deploy.sh\#L231**](https://github.com/ETHCF/swapboard/blob/9b4eed2444947d465b5e0e31e65d72b03f21320e/deploy.sh#L231)   
* [**https://ethcf.github.io/swapboard/package.json**](https://ethcf.github.io/swapboard/package.json)  
* [**https://ethcf.github.io/swapboard/pnpm-lock.yaml**](https://ethcf.github.io/swapboard/pnpm-lock.yaml)   
* [**https://ethcf.github.io/swapboard/test.setup.js**](https://ethcf.github.io/swapboard/test.setup.js) 

**Description:**  
During the audit it was found that both of Swapboard’s deployment mechanisms (GitHub Pages and IPFS) expose development files due to unfiltered directory uploads. The GitHub Actions workflow uses **path: frontend** which uploads the entire frontend directory, while the deployment script uses **ipfs add \-r .** which recursively adds all files in the current directory.  
![][image3]

Example of exposed files found:

* package.json, pnpm-lock.yaml (exact package versions used)  
* test.js, lib.unit.test.js, test.setup.js (implementation logic)  
* test.config.js, stryker.config.json (configuration fileS)  
* \_\_mocks\_\_/ethers.js (test wallet addresses, mock patterns)  
* mutation-report.html (code coverage insights)

Although no current secret was found during the audit as a result of these files being exposed, they open up a point of failure in the future, example risks:

* Developer adds .env files, or writes secrets to package.json, setup scripts, etc.  
* Revealing implementation and security testing logic  
* Providing attack surface intelligence \- when exposing exact package versions such are the ones on package.json and pnpm-lock.yaml, it increases the risk of attackers from the internet to actively find and target the website for CVE exploitation before the protocol owner is even aware of a CVE on its technical stack.

**Recommendation:**

* Create a proper build script that generates a clean distribution directory. The build should copy only production files (like index.html, app.js, lib.js, style.css, manifest.json, sw.js, API.html, mock.js), exclude all development artifacts automatically, and handle environment-specific configurations.

# **AW-M-02: Insufficient Contract Security Tests** {#aw-m-02:-insufficient-contract-security-tests}

**Severity:** Medium								**Status:** Fixed

**Retest notes:**  
Tests were re-organized into \`**exploit/**\` (defensive validation tests) vs \`**security-research/ProvenExploits.t.sol**\` (known vulnerability documentation) with clear headers and naming conventions. Proven exploits present in a contract still remain dangerous and a risk to the protocol, but as described above they were out of scope of this assessment.

**Locations:**

* [**ETHCF/swapboard/contracts/test/exploit/ExploitVectors.t.sol**](https://github.com/ETHCF/swapboard/blob/9b4eed2444947d465b5e0e31e65d72b03f21320e/contracts/test/exploit/ExploitVectors.t.sol)  
* [**ETHCF/swapboard/contracts/test/exploit/AdvancedExploits.t.sol**](https://github.com/ETHCF/swapboard/blob/9b4eed2444947d465b5e0e31e65d72b03f21320e/contracts/test/exploit/AdvancedExploits.t.sol)

**Description:**

During the audit it was found that Swapboard's test suite contains systematic flaws that create false security confidence. The testing infrastructure validates that exploitable vulnerabilities work as intended rather than testing that security protections prevent exploitation. The following insufficiencies were found:

* Tests that validate that exploitation **is** possible (**ExploitVectors.t.sol**):

  * **test\_exploit\_fot\_fillOrder\_makerReceivesLess** \- Confirms maker receives only 95 tokens instead of expected 100 due to 5% transfer fee. Test passes when maker loses funds rather than verifying protection exists.

  * **test\_exploit\_pausableToken\_blocksOperations** \- Validates that paused tokens block both fill and cancel operations. Misses the actual vulnerability: maker funds are permanently locked with no recovery mechanism during pause periods.
