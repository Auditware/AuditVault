---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - os/windows
substate: "informative"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2025-07-03
submitted: 2025-01-16T12:00:21.839Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/curl|curl]]"
reporter: "justlikebono_official"
source: "https://hackerone.com/reports/2941920"
title: "Elevation of Privileges (EoP) vulnerabilities related to the some easy_options on Windows"
---
# Elevation of Privileges (EoP) vulnerabilities related to the some easy_options on Windows

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** curl | **Disclosed:** 2025-07-03

- Report: [https://hackerone.com/reports/2941920](https://hackerone.com/reports/2941920)
- CWE: Privilege Escalation
- Submitted: 2025-01-16T12:00:21.839Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

An Elevation of Privileges (EoP) vulnerability can occur in a Windows privileged process that uses CURLOPT_COOKIEJAR, CURLOPT_HSTS, or CURLOPT_ALTSVC.
This vulnerability arises due to the differences in the implementation of the unlink function between Windows and Linux, as well as the behavior of MoveFileEx, which follows specially crafted links.
Given that many components, such as program updaters, frequently use curl with elevated privileges, this issue must be considered a serious concern.

## Affected version

libcurl latest version (8.11.1)

## Description

libcurl provides easy options such as `CURLOPT_COOKIEJAR`, `CURLOPT_HSTS`, and `CURLOPT_ALTSVC`. For example, when `CURLOPT_COOKIEJAR` is set, the library user can specify a file where cookie information will be stored.

Since libcurl is widely used for web communication, it is often utilized in privileged programs that need to communicate with web servers, such as program updaters.

The issue is that privileged programs using the aforementioned options may occur a Elevation of Privileges (EoP) vulnerability. Since all three options share a very similar code structure, this explanation will focus on `CURLOPT_COOKIEJAR`.

In the `cookie_output` function of `lib/cookie.c`, the output file's `FILE` pointer is obtained via `Curl_fopen`. The `Curl_fopen` function generates a random temporary file based on the file path specified by the library user through `CURLOPT_COOKIEJAR` and returns the `FILE` pointer to this temporary file.

Subsequently, `cookie_output` writes the cookie contents to the temporary file and then moves the temporary file to the user-specified file path using `Curl_rename`. Internally, `Curl_rename` calls the `MoveFileExA` API, and if this attempt fails, it tries to delete the temporary file using the `unlink` function.
(https://github.com/curl/curl/blob/c5bb4e77e414c1505d800a0091a6d57c7f75d416/lib/cookie.c#L1660)

If the file path for storing cookies is in a user-writable location, a specially crafted link in Windows can be used to redirect the calls to `MoveFileExA` or `unlink` to operate on an arbitrary file. The `MoveFileExA` function follows this special link as is, while the `unlink` function, which executes through the Windows C runtime (`unlink() -> remove() -> DeleteFile(WINAPI)`), also follows the link.

Through this mechanism, an attacker can leverage a privileged process to achieve **arbitrary file deletion**, which can ultimately lead to **escalation of privilege (EoP) to SYSTEM** using well-known exploitation techniques.

At first glance, it may seem that exploiting this issue requires a race condition. However, it can be exploited in a highly reliable manner using **oplocks**.

For more details on how arbitrary file deletion can be abused to escalate privileges, refer to the ZDI blog post linked below:
(https://www.thezdi.com/blog/2022/3/16/abusing-arbitrary-file-deletes-to-escalate-privilege-and-other-great-tricks)

To help understand this issue better, a proof-of-concept (PoC) demonstrating the vulnerability will be provided, along with step-by-step instructions on how to reproduce it in the next section.

## Steps To Reproduce:

  1. To reproduce the issue described above, I created a simple program (`curl_EoP.sln`) that sends a web request using libcurl and the `CURLOPT_COOKIEJAR` option.

     Additionally, `curl_EoP_Exp.sln` demonstrates how this program can be exploited to achieve **high-privilege arbitrary file deletion**.
      This exploit modifies the deletion of `"C:/ProgramData/curl_EoP/{temporary_file_name}.tmp"` to delete `"C:/Windows/test_file.txt"` instead.

     ### Steps to Reproduce:

     1. Open an **administrator CMD** and create `test_file.txt` by running the following command:

        ```cmd
        echo "tempfile" > C:/Windows/test_file.txt
        ```

     2. Use **Visual Studio C/C++ 2022** to build `curl_EoP_Exp.sln` and `curl_EoP.sln` (x64-Release).

        - **Note**: `curl_EoP.sln` requires **libcurl**.

     3. Run `curl_EoP_Exp.exe` **with normal user privileges**.

        - **Ignore** any stdout output.

     4. Run `curl_EoP.exe` **with administrator or SYSTEM privileges**.

     5. As a result of the exploit, **`C:/Windows/test_file.txt` will be deleted**.

## Patch Suggestion

The `GetFinalPathNameByHandle` API can be used to retrieve the final destination file path of a specific file handle.

By comparing this retrieved path with the expected file name, it is possible to determine whether the path has been manipulated via links.

Implement a secure wrapper around functions like `MoveFileExA` and `unlink` that incorporates this logic to prevent exploitation.

## Supporting Material/References:

  * curl_EoP.zip: source codes of curl_EoP.sln
  * curl_EoP_Exp.zip: source codes of curl_EoP_Exp.sln
  * PoC.mp4: A video of reproduce steps

## Impact

## Summary:
A medium-privileged attacker can achieve Escalation of Privilege (EoP) to SYSTEM by targeting any privileged program that uses the CURLOPT_COOKIEJAR, or  CURLOPT_HSTS, or CURLOPT_ALTSVC options with a user writable path.

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **2025-01-16** @dgustafsson: Thanks for your report, we will look into it and get back to you shortly.
- **Report Vulnerability Information Updated**
- **2025-01-16** @dfandrich: Using the suggested `GetFinalPathNameByHandle` workaround will prevent curl from writing cookies et al. to a location that *deliberately* follows a link, negating the whole purpose of link support in Windows. Is there really no better way to work around this Windows "feature"? Implementing this workaround could break people's perfectly-safe curl installations that utilize links when it's being run in non-privileged mode. It might be better to use this workaround only if curl is detected to be running with privileges, since that will break it for fewer people.
- **2025-01-16** @justlikebono_official: If you want to apply the mitigation only for privileged processes as you mentioned, you can refer to a part of the Chromium source code that determines whether a process is privileged.
(https://github.com/chromium/chromium/blob/master/base/process/process_info_win.cc#L71)
 I don't think there's a general way to distinguish whether a specific link was created by an attacker or intentionally generated by the library user.
Therefore, if you want to consider every cases where links are used functionally, the most accurate approach would be to provide an option that allows the user to specify whether to follow the link.
I will continue to consider whether there might be a better approach.
- **2025-01-16** @bagder: Allowing other users (attackers) write access to the same directory that you are saving files into with curl is a security problem in itself. curl cannot fully protect users who do that, which is why we have this mention in the `VULN-DISCLOSURE-POLICY.md` document's *Not security issues* section:

> curl cannot protect against attacks where an attacker has write access to the
> same directory where curl is directed to save files.

We have been down this path before and there are countless ways an attacker can trick applications, varying a little by platforms, when the attacker has that access.

I believe this is "just another case" in this category.
- **2025-01-17** @justlikebono_official: I partially agree with your opinion that, according to the content of VULN-DISCLOSURE-POLICY.md, this may not be considered a vulnerability. However, I do not believe that curl has no responsibility in this case.

For example, let's say a developer reads the documentation for CURLOPT_COOKIEJAR (https://curl.se/libcurl/c/CURLOPT_COOKIEJAR.html) and develops a program that uses this option in a privileged process. From the documentation alone, the developer would not be able to fully anticipate that using this feature with a user-writable path (e.g., ProgramData) could lead to a severe security issue.

The reason is that this file is only an out buffer (it does not read and use the cookie file contents for requests), and file write hijacking without an attacker being able to control the file contents generally does not escalate to Elevation of Privilege (EoP). (The file content consists of cookies generated during communication.)

The fundamental cause of this potential security issue is that curl uses temporary files when saving cookies and then deletes them. This is not intended behavior by the library users. A developer would not be aware of this unless they closely analyze the code.

I am not arguing that this issue must be considered a security vulnerability in curl. However, I do believe that it is very difficult for developers to recognize that using these options could introduce a potential security risk.

Therefore, I believe that either the code should be modified, or at the very least, the documentation should be updated to mention this concern.
- **2025-01-19** @bagder: I completely agree that we should improve the documentation for all these options regarding this so that libcurl users  don't miss out on important security aspects. I'll get started on a PR for this.

When it comes to the source code, I don't know how we can fix this any better than we already do. The create+rename pattern is used in these situations to make sure the saving becomes an atomic operation for the cases when multiple curl process all save to the same file name, so that we can make sure the the final result is one of the saves and not a broken one or a mix of then all.
- **2025-01-19** @bagder: https://github.com/curl/curl/pull/16051
- **2025-01-19** @justlikebono_official: You can consider storing temporary files under the %Temp% directory rather than the user-specified path.
This approach would prevent potential attacks involving files stored under the Administrator account or randomly named files in %windir%\Temp.
However, even without this change, the current measures performed in curl seem well thought out and appropriate.

If possible, I would appreciate it if you could add me as a contributor.
My GitHub ID is justlikebono.

Thanks
- **2025-01-20** @bagder: > You can consider storing temporary files under the %Temp% directory rather than the user-specified path

I've contemplated over that in the past as well, but that is also difficult and instead opens up for some other challenges and risks. It is not clear to me that it would end up a safer solution, just a different set of security properties.

> If possible, I would appreciate it if you could add me as a contributor.
> My GitHub ID is justlikebono.

I  will absolutely do that. Do you prefer me using your GitHub id to just **Donguk Kim** ?
- **2025-01-20** @justlikebono_official: Either way is fine.

Thanks
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
