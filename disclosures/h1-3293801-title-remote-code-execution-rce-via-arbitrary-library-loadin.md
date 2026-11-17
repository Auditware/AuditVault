---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "not-applicable"
weakness: "Code Injection"
enriched: true
date: 2025-08-10
submitted: 2025-08-10T18:26:22.967Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/curl|curl]]"
reporter: "z1andr4g0n"
source: "https://hackerone.com/reports/3293801"
title: "Title: Remote Code Execution (RCE) via Arbitrary Library Loading in `--engine` option"
---
# Title: Remote Code Execution (RCE) via Arbitrary Library Loading in `--engine` option

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 13 | **Program:** curl | **Disclosed:** 2025-08-10

- Report: [https://hackerone.com/reports/3293801](https://hackerone.com/reports/3293801)
- CWE: Code Injection
- Submitted: 2025-08-10T18:26:22.967Z

## Timeline

- **Report Filed**
- **2025-08-10** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-08-10** @bagder: I claim this is curl working as intended.

The OpenSSL engine system is their legacy system that is being replaced by "providers". Still a modern OpenSSL can be built with support for both. You can also opt to build OpenSSL without support for either.

curl supports loading a provided engine/provider into OpenSSL and then that will be used for crypto/certificate functionality.

An engine/provider is native code. A shared library loaded by OpenSSL and executed. That's what they do. That's how they work. It is a security problem if you let an attacker install an engine for a user to run, as that can execute code with the same rights as the user. That's not something curl can prevent.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2025-08-10** @z1andr4g0n: You're absolutely right, from a purely technical standpoint, `curl` is doing exactly what it was designed to do: providing a clean pass-through to OpenSSL's engine loading feature. It's "working as intended".

But the vulnerability I'm reporting isn't a bug in the *implementation*, it's a critical flaw in the *design of the command-line interface itself*. The problem is that `curl`, a tool used in countless automated, trusted environments, exposes this incredibly powerful, low-level functionality directly to user-supplied arguments without any safety rails.

Your argument rests on a threat model where an attacker must "install an engine for a user to run". That assumes the attacker already has significant filesystem access, at which point it's already game over.

The real, and much scarier, threat model is **Argument Injection**.

Think about the millions of places `curl` is executed from scripts: web application backends, CI/CD pipelines, automated testers, etc. In these scenarios, an attacker doesn't need to *install* anything. They just need the ability to control one of the arguments passed to `curl`. If they can inject `"--engine /tmp/payload.so"` (pointing to a file they uploaded via a completely separate feature), they achieve instant RCE.

This is the classic `include($_GET['page']);` problem from the PHP world. The `include` function is "working as intended", but exposing it raw to user input is a textbook critical vulnerability. `curl` is doing the exact same thing here with OpenSSL's dynamic library loading.

The `curl` project already understands this principle of protecting its users from dangerous features. The man page for `-J` (`--remote-header-name`) contains a **specific security warning** about the risk of a server providing a malicious filename. The `--engine` option is a thousand times more dangerous—it's not just creating a file, it's executing native code—yet the documentation gives no hint of this risk. It simply says it takes a `<name>`, while in reality, it accepts a full, arbitrary file path.

This isn't about whether OpenSSL's feature is dangerous. It is. It's about whether `curl`, as a ubiquitous and trusted tool, should be handing users a loaded gun without any safety on.

I strongly believe this should be reconsidered as a critical vulnerability in `curl`'s interface design. At a minimum, this feature needs a giant, flashing red warning in the docs. Ideally, it should be restricted to only load engines from a trusted, system-defined path, breaking this RCE vector completely.

Thanks for your time and for creating such an incredible tool. I'm looking forward to your thoughts.
- **2025-08-10** @bagder: I strongly disagree.

curl simply cannot protect itself from loading a backdoored engine. You have failed as a sysadmin when you allowed that engine to get installed. THAT is the problem.
- **Manually Disclosed**
- **2025-08-10** @bagder: If you want to discuss how we can improve curl in this and other regards, feel free to take that discussion to an open curl discussion forum. Not here. We love improving curl!
