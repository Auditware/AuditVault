---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/desktop
  - os/windows
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2026-08-20
submitted: 2026-03-21T06:24:46.890Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/monero|Monero]]"
reporter: "qttps"
source: "https://hackerone.com/reports/3619409"
title: "Windows installer grants low-privileged users write access to executable P2Pool directory, enabling local code execution"
---
# Windows installer grants low-privileged users write access to executable P2Pool directory, enabling local code execution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Monero | **Disclosed:** 2026-08-20

- Report: [https://hackerone.com/reports/3619409](https://hackerone.com/reports/3619409)
- CWE: Improper Access Control - Generic
- Submitted: 2026-03-21T06:24:46.890Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

The Windows installer creates the P2Pool subdirectory inside the machine-wide install path with overly broad write permissions:

- `installers/windows/Monero.iss:59`
- `Name: "{app}\p2pool"; Permissions: users-full`

The GUI later trusts and executes `p2pool.exe` from that directory when the user starts P2Pool mining:

- `src/p2pool/P2PoolManager.cpp:124-129` (`isInstalled()` only checks file existence)
- `src/p2pool/P2PoolManager.cpp:154-210` (`start()` executes `p2pool.exe`)
- `src/p2pool/P2PoolManager.cpp:243-248` (Windows path is `{applicationDirPath()}/p2pool/p2pool.exe`)
- `pages/Mining.qml:295-318` and `pages/Mining.qml:654-656` (GUI path to starting P2Pool)

This creates a local binary planting issue: a low-privileged local user can replace or plant `p2pool.exe` in the writable P2Pool directory, and Monero GUI will later execute that attacker-controlled binary when a victim starts P2Pool from the GUI.

## Releases Affected

- Windows installer builds that include commit `432650008c4af92db138041d15b06e43fba0b7ab` dated **2022-05-28** (`Use "p2pool" folder for p2pool on Windows`)
- I have not yet confirmed the earliest tagged release containing this change
- I reviewed the local source tree on **2026-03-20**

## Why This Is Security-Relevant

The affected directory is part of a machine-wide installed application under `Program Files`, but the installer intentionally grants broad write access to ordinary users. That turns a trusted executable location into a user-writable code execution surface.

Because the GUI later launches `p2pool.exe` from that location, any low-privileged local attacker can cause attacker-controlled code to run in the context of whichever user later starts P2Pool from Monero GUI.

This is not a remote issue. It is a local privilege/trust-boundary issue.

## Steps To Reproduce

1. Install Monero GUI on Windows using the normal installer.
2. Confirm that the installer created a writable P2Pool directory:
   - Example target path: `%ProgramFiles%\Monero GUI Wallet\p2pool`
   - Collect ACLs with `icacls "%ProgramFiles%\Monero GUI Wallet\p2pool"`
3. From a low-privileged local user account, place a benign proof-of-concept executable at:
   - `%ProgramFiles%\Monero GUI Wallet\p2pool\p2pool.exe`
4. Use a harmless PoC executable that only creates a marker file such as:
   - `%TEMP%\monero_p2pool_poc.txt`
   - and writes a short message plus current username and timestamp
5. Launch Monero GUI as the victim user.
6. Go to the Mining screen and start P2Pool mining.
7. Observe that the planted `p2pool.exe` is executed instead of a trusted bundled binary.
8. Verify execution through:
   - the marker file
   - process creation logs
   - GUI behavior

## Expected Result

Low-privileged users should not be able to modify executables or executable search locations inside the machine-wide installed application directory.

## Actual Result

The installer grants broad write access to the executable P2Pool directory, and the GUI later executes `p2pool.exe` from that directory without any additional integrity check.

## Supporting Material / References

Code references:
- `installers/windows/Monero.iss:57-59`
- `src/p2pool/P2PoolManager.cpp:124-129`
- `src/p2pool/P2PoolManager.cpp:154-210`
- `src/p2pool/P2PoolManager.cpp:243-248`
- `pages/Mining.qml:295-318`
- `pages/Mining.qml:654-656`

Git history:
- Commit `432650008c4af92db138041d15b06e43fba0b7ab` dated **2022-05-28**
- Commit message: `Use "p2pool" folder for p2pool on Windows`

Planned attachments:
- `TODO: screenshot or text output of icacls on the p2pool directory`
- `TODO: SHA-256 of the benign planted p2pool.exe`
- `TODO: screenshot or recording of starting P2Pool from Monero GUI`
- `TODO: screenshot or contents of the marker file`
- `TODO: Sysmon / Procmon / Windows Event log process creation evidence showing execution of planted p2pool.exe`

## Novelty Check

I searched the public Monero GUI repository history, issue tracker, and public advisory surfaces for this behavior. I found the feature-introduction commit above, but I did not find a public security fix, advisory, or public duplicate specifically describing the installer-created writable executable P2Pool directory leading to local binary planting and execution.

## AI Assistance Disclosure

I used OpenAI Codex 5.4 with extra high reasoning to help review the local source code and draft this report. All findings, verification status, and final submission contents were reviewed by me before submission.

## Impact

A low-privileged local attacker can plant or replace `p2pool.exe` inside the writable P2Pool directory created by the Windows installer. When another user later starts P2Pool through Monero GUI, the attacker-controlled binary executes in that victim user's context.

This enables:

- cross-user local code execution
- persistence in a trusted application path
- compromise of the victim user's confidentiality, integrity, and availability
- possible privilege escalation if a higher-privileged user later runs Monero GUI and starts P2Pool

In practice, this means local malware or another unprivileged user on the same Windows system can turn Monero GUI's P2Pool feature into an execution trigger for arbitrary code.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2026-03-22** @qttps: Yes. I checked out PR #4575 locally and, based on source review, it appears to fix the issue I reported for Windows installer installs.

The original issue was that the installer created `{app}\p2pool` with overly broad write permissions, and the GUI later executed `p2pool.exe` from that directory.

PR #4575 appears to address that root cause by:
- removing the writable `{app}\p2pool` installer permission entry
- moving installed Windows P2Pool storage/execution to `%LocalAppData%` instead of the machine-wide install directory
- cleaning up the old installed `{app}\p2pool` path

So, for the installer-based Windows code path covered by my report, this appears to resolve the issue.

I have not rerun a full Windows runtime PoC against a built installer from this PR, so this confirmation is based on source review of the checked-out patch.
- **2026-04-06** @selsta: Do you want a bounty for this? If yes, you need to provide an address.
- **2026-04-13** @qttps: 479Zu6GkFNTfRcNkesCtHNJg37KE72PAG5VLFC1bQNBjLEi2ZqhUByff67M1KsHVpsEs5CBP6YgNwgrJTZRPmbRZUSVvtM6

Thanks!
- **2026-04-20** @luigi1111w: Sent 0.5 XMR: 86d31b2413525ccbe1858860bbac12caa323f0efc482bfb656e94fa1c8c4b201
- **Swag Awarded**
- **2026-04-21** @qttps: Thanks so much!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
