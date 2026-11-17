---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/relative-path-traversal
  - env/web
substate: "not-applicable"
weakness: "Relative Path Traversal"
enriched: true
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
