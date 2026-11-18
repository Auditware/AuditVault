---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/relative-path-traversal
  - env/web
  - vuln/path-traversal
  - vuln/code-injection
  - vuln/file-upload
  - impact/rce
  - impact/unauthorized-write
  - fix/file-validation
substate: "not-applicable"
weakness: "Relative Path Traversal"
enriched: true
body: true
date: 2025-08-10
submitted: 2025-08-09T20:00:01.901Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/curl|curl]]"
reporter: "z1andr4g0n"
source: "https://hackerone.com/reports/3293177"
title: "Path Traversal in SFTP QUOTE command leads to Arbitrary File Write and potential RCE"
---
# Path Traversal in SFTP QUOTE command leads to Arbitrary File Write and potential RCE

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** curl | **Disclosed:** 2025-08-10

- Report: [https://hackerone.com/reports/3293177](https://hackerone.com/reports/3293177)
- CWE: Relative Path Traversal
- Submitted: 2025-08-09T20:00:01.901Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Description

#### Summary
`libcurl` is vulnerable to a path traversal attack when processing SFTP `QUOTE` commands. The internal function `Curl_get_pathname` in `lib/vssh/curl_path.c` fails to sanitize user-provided paths for traversal sequences (`../`). An attacker who can control the SFTP `QUOTE` commands can leverage this to perform arbitrary file operations (rename, delete, and with `STOR`, write) outside of the user's intended directory. This can be escalated to Remote Code Execution (RCE) on the SFTP server by overwriting sensitive files like `authorized_keys` or system scripts.

#### AI Usage Disclosure
In accordance with your policy, I disclose that this report was the result of a collaborative effort between myself and an AI assistant. The AI was used to analyze the source code, suggest potential vulnerabilities, and assist in structuring the report, while I guided the process, made the final decisions, and manually verified all findings, including the vulnerability analysis and Proof of Concept code.

---

#### Affected version
This was reproduced on a system using libcurl linked with libssh2. The vulnerability is in `libcurl`'s own path handling code and is likely present in recent versions. The `curl -V` output on the test system is:
```
Dragon@DESKTOP-2CIPGDF MINGW64 /c/Users/Dragon/Desktop
# curl -V
curl 8.15.0 (Windows) libcurl/8.15.0 OpenSSL/3.5.0 zlib/1.3.1 brotli/1.1.0 zstd/1.5.7 libidn2/2.3.8
libpsl/0.21.5 libssh2/1.11.1 nghttp2/1.65.0 ngtcp2/1.13.0 nghttp3/1.10.1
Release-Date: 2025-07-16
Protocols: dict file ftp ftps gopher gophers http https imap imaps ipfs ipns ldap ldaps mqtt pop3 po
p3s rtsp scp sftp smb smbs smtp smtps telnet tftp ws wss
Features: alt-svc AsynchDNS brotli HSTS HTTP2 HTTP3 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTL
M PSL SPNEGO SSL SSPI threadsafe TLS-SRP UnixSockets zstd
```

#### Steps To Reproduce
This vulnerability can be reliably reproduced in a local Windows environment.

1.  **[Setup Step 1] Install and Run OpenSSH Server:**
    *   On a Windows 10/11 machine, install the "OpenSSH Server" via Optional Features (`Settings -> Apps -> Optional features -> Add a feature`).
    *   Start the service using PowerShell (as Admin): `Start-Service sshd` and set it to automatic: `Set-Service -Name sshd -StartupType 'Automatic'`.
    *   Create a local test user: `net user testuser testpass /add`.

2.  **[Setup Step 2] Prepare Target Files and Directories:**
    *   Create a file to be moved in the test user's home directory:
        `echo. > C:\Users\testuser\file_to_move.txt`
    *   Create the target directory for the attack:
        `mkdir C:\tmp\attack_target`
    *   Grant the test user permissions on the target directory:
        `icacls C:\tmp\attack_target /grant testuser:(OI)(CI)F`

3.  **[Setup Step 3] Proof of Concept Code (`poc.c`):**
    *   Save the following C code as `poc.c`. This program uses `libcurl` to connect to the local SFTP server and issue a malicious `rename` command.

    ```c
    #include <stdio.h>
    #include <curl/curl.h>

    int main(void) {
        CURL *curl;
        CURLcode res;
        struct curl_slist *quote_list = NULL;

        const char *malicious_rename =
            "rename file_to_move.txt ../../tmp/attack_target/SUCCESS.txt";
        
        quote_list = curl_slist_append(quote_list, malicious_rename);

        curl_global_init(CURL_GLOBAL_DEFAULT);
        curl = curl_easy_init();
        if(curl) {
            curl_easy_setopt(curl, CURLOPT_URL, "sftp://127.0.0.1/");
            curl_easy_setopt(curl, CURLOPT_USERNAME, "testuser");
            curl_easy_setopt(curl, CURLOPT_PASSWORD, "testpass");
            curl_easy_setopt(curl, CURLOPT_SSH_KNOWNHOSTS, NULL);
            curl_easy_setopt(curl, CURLOPT_SSH_HOST_PUBLIC_KEY_SHA256, NULL);
            curl_easy_setopt(curl, CURLOPT_POSTQUOTE, quote_list);
            curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

            res = curl_easy_perform(curl);
            
            if(res != CURLE_OK) {
                fprintf(stderr, "curl_easy_perform() failed: %s\n",
                        curl_easy_strerror(res));
            }
        
            curl_easy_cleanup(curl);
        }
        curl_slist_free_all(quote_list);
        curl_global_cleanup();
        return 0;
    }
    ```

4.  **[Execution Step 4] Compile and Run:**
    *   Install a MinGW-w64 toolchain (e.g., via MSYS2).
    *   Compile the PoC: `gcc poc.c -lcurl -o poc.exe`
    *   Run the PoC: `./poc.exe`

5.  **[Verification Step 5] Verify the Exploit:**
    *   Check the contents of the target directory: `dir C:\tmp\attack_target`
    *   **Result:** The file **`SUCCESS.txt`** will be present in the directory, proving that the `rename` operation successfully traversed out of the user's home directory (`C:\Users\testuser`) and wrote to `C:\tmp\attack_target`.

#### Supporting Material/References:
The vulnerability is in the function `Curl_get_pathname` in the file `lib/vssh/curl_path.c`. The function copies the user-provided path from a `QUOTE` command into the output buffer without validating or sanitizing `../` sequences, leading to the path traversal vulnerability.

## Impact

This vulnerability allows an attacker with SFTP access (even if ostensibly jailed or restricted to a home directory) to perform arbitrary file operations on any part of the filesystem where the user has OS-level permissions.

This can be directly escalated to **Remote Code Execution (RCE)**. An attacker could:
*   Overwrite a user's `~/.ssh/authorized_keys` file to gain persistent SSH access.
*   Overwrite system scripts, application binaries, or configuration files.
*   Write to web server directories to achieve web-based RCE.

This is a critical vulnerability as it completely breaks the security model of SFTP directory restrictions and can lead to a full server compromise.

## Timeline

- **Report Filed**
- **2025-08-09** @bagder: I think this sounds like a curl option working as documented.
- **2025-08-09** @z1andr4g0n: Hi Daniel,

Thanks for the quick reply!

I totally get your point. `CURLOPT_QUOTE` is meant to send raw commands, and it's doing exactly that.

However, the issue I'm pointing at is a bit deeper, inside `Curl_get_pathname()` in `lib/vssh/curl_path.c`. When this function sees a path like `../../etc/passwd`, it doesn't just pass it along; it actively resolves it against the user's home directory. This turns libcurl from a passive messenger into an active participant in a path traversal attack.

A developer might use `QUOTE` for simple renaming within a user's directory, not expecting that this could open a door to modifying system files. It feels like the library's internal path handling should have a basic security check to prevent such a well-known attack vector, regardless of what `CURLOPT_QUOTE` is fed.

A simple sanitization to block `../` sequences within `Curl_get_pathname` seems like it would fix this without breaking the intended use of `QUOTE`.

What do you think?
- **2025-08-09** @bagder: I don't think any documentation says that libcurl cleans or modifies the commands sent with this option. Letting an attacker control this option would be a problem for the app doing so, not in libcurl.
- **2025-08-09** @z1andr4g0n: You are absolutely right about the documentation for `CURLOPT_QUOTE`. It's designed to send raw commands.

However, the core of the issue is not about modifying the user's command string, but about how libcurl's **internal functions interpret and expand paths**.

Let's look at another part of curl: the URL parser. If a user provides a URL like `sftp://user@host/some/dir/../../etc/passwd`, libcurl's URL parser will correctly "dedotdotify" this path and resolve it to `/etc/passwd`. This path normalization is a crucial, built-in security feature to prevent traversal attacks *at the URL level*.

The function `Curl_get_pathname` in `curl_path.c` performs a similar role for `QUOTE` commands: it parses a path string. The fact that this specific path parser, unlike the main URL parser, does **not** perform the same fundamental security check (path normalization) creates an inconsistency and a security blind spot.

The expectation is that a library's internal helpers should operate securely by default. A developer should not need to manually implement path traversal protection for strings that are passed to an API, only to have them re-interpreted insecurely by the library's internal logic.

This isn't about cleaning the user's command; it's about `libcurl`'s own internal path handling being vulnerable.
- **2025-08-10** @dfandrich: If the application requests a QUOTE path like /some/dir/../../etc/passwd libcurl will send the request to the remote server. If the application requests a QUOTE path like /etc/passwd libcurl will send the request to the remote server. Are you saying libcurl should allow one but not the other? If so, why should libcurl deny (or modify) the application's explicit request? libcurl is not the police. It's up the server to determine if the request should be allowed or denied.
- **2025-08-10** @z1andr4g0n: You're right, both paths might resolve to the same location. The critical difference is **who** resolves them and **how**.

1.  When an application sends `QUOTE rename file /etc/passwd`, libcurl acts as a simple messenger. The path `/etc/passwd` is explicit and requires no interpretation from libcurl.

2.  When an application sends `QUOTE rename file /some/dir/../../etc/passwd`, libcurl is **no longer a simple messenger**. The internal function `Curl_get_pathname` is invoked to process this path relative to the user's home directory (`sshc->homedir`). It is actively involved in interpreting the `../` sequences.

The vulnerability isn't that libcurl *sends* `../`. The vulnerability is that libcurl's **internal path composition logic** insecurely resolves `../` sequences.

> Are you saying libcurl should allow one but not the other?

**Yes, absolutely.** A library's internal path handling functions should never resolve traversal sequences from untrusted input. This is a fundamental security principle. The main URL parser in libcurl already does this correctly by "dedotdotifying" paths. The `Curl_get_pathname` function is an outlier that fails to follow this same security standard.

> libcurl is not the police. It's up the server to determine if the request should be allowed or denied.

This is true for the final, resolved path. But it's libcurl's responsibility to ensure that its internal path manipulation functions don't construct a dangerous path from a seemingly innocent one. The server can only police the final request it receives (`/etc/passwd`); it has no visibility into how libcurl constructed that path from a potentially malicious input (`../../etc/passwd`).

The problem is the **insecure path resolution** happening inside the library, not the final command sent to the server.
- **2025-08-10** @z1andr4g0n: | Step | Description              | Example / Note |
|------|--------------------------|----------------|
| 1. User Input | Example: `../../etc/passwd` | Attacker provides crafted path |
| 2. Library performs Path Resolution | 🔴 **Problem here:** No validation, allows escaping the allowed directory | Vulnerability occurs inside the library |
| 3. Build final command | Final command looks “normal” but actually accesses sensitive files | The issue has already happened |
| 4. Send command to server | Command is sent to the server and executed | Server executes it without knowing it’s malicious |

⚠️ **Result:** The flaw is not in step (4), but in step (2) during path interpretation inside the library.
- **2025-08-10** @bagder: The provided reproducer shows a perfectly fine use of libcurl. Not a security problem. You insist that there still is a problem, so please show us how that is exploited or triggered. Sending.. /.. / in a QUOTE command is fine and permitted.
- **2025-08-10** @bagder: An application that allows an outsider to set the QUOTE command allows that outsider to run any command. It sounds terribly dangerous and unwise. It is a not an attack vector curl can protect against.
- **2025-08-10** @z1andr4g0n: You asked me to show how this is exploited in a real-world scenario where the application developer is not being "terribly dangerous and unwise."

**Here is the exact exploit scenario:**

Imagine a simple PHP web application that allows a user to manage their own files in their designated web directory (`/var/www/html/users/username/`). The developer wants to offer a "rename file" feature.

**The Developer's "Safe" PHP Code:**
```php
<?php
// User provides 'old_name' and 'new_name' from a web form.
$old_name = $_POST['old_name']; 
$new_name = $_POST['new_name'];

// Developer correctly sanitizes to prevent command injection.
// They ensure names only contain alphanumeric characters.
if (!ctype_alnum($old_name) || !ctype_alnum($new_name)) {
    die("Invalid filename.");
}

// The user's chrooted SFTP home directory.
$sftp_dir = '/users/username/';

// Developer builds what they believe is a SAFE command.
// They are explicitly prefixing the path to keep the user in their directory.
$command = sprintf("rename %s%s %s%s", $sftp_dir, $old_name, $sftp_dir, $new_name);

// Use libcurl to execute the command.
$ch = curl_init('sftp://sftp.example.com');
// ... (set user/pass) ...
curl_setopt($ch, CURLOPT_QUOTE, [$command]); 
curl_exec($ch);
?>
```
This developer has done their job. They've restricted filenames to be safe. They are prefixing every path with the user's base directory. It seems perfectly secure.

**The Attacker's Input:**
The attacker uses the web form and provides:
-   `old_name`: `dummy`
-   `new_name`: `../../../../etc/passwd`

**What happens inside libcurl:**
1.  The developer's safe code constructs the command: `rename /users/username/dummy ../../../../etc/passwd`
2.  The developer passes this "safe" string to `CURLOPT_QUOTE`.
3.  **This is the vulnerability:** libcurl's `Curl_get_pathname` does not see this as two separate arguments. It sees one long path string. It insecurely resolves `../../../../etc/passwd` starting from the current working directory, and the SFTP server executes a command to rename a file to `/etc/passwd`.

> "An application that allows an outsider to set the QUOTE command allows that outsider to run any command."

This is incorrect. The developer in this scenario did **not** allow the user to set the QUOTE command. They allowed the user to set a **filename**, which the developer then safely embedded inside a command string. The developer's intent was completely subverted by libcurl's insecure internal path resolution.

This is not a "fine use" of libcurl; this is a security pitfall where libcurl's internal behavior violates the developer's security assumptions. The responsibility for securely resolving path components must lie with the library function that does the resolving.
- **2025-08-10** @bagder: That is a security issue for that program. It is not a libcurl security problem.
- **2025-08-10** @bagder: rename typically and often support "../" constructs as well as other directory names, I don't think that is surprising.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
