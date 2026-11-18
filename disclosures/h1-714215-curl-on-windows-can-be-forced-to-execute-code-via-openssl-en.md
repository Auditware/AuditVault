---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - os/windows
  - vuln/code-injection
substate: "informative"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2021-02-08
submitted: 2019-10-14T23:02:51.094Z
bounty_usd: null
votes: 2
cve: "CVE-2019-1552", "CVE-2019-5443"
program: "[[programs/curl|curl]]"
reporter: "supersausage"
source: "https://hackerone.com/reports/714215"
title: "curl on Windows can be forced to execute code via OpenSSL environment variables"
---
# curl on Windows can be forced to execute code via OpenSSL environment variables

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** curl | **Disclosed:** 2021-02-08

- Report: [https://hackerone.com/reports/714215](https://hackerone.com/reports/714215)
- CWE: Privilege Escalation | CVE: CVE-2019-1552, CVE-2019-5443
- Submitted: 2019-10-14T23:02:51.094Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Preface: While I have an interest in security, I am not a professional security researcher, so please be forgiving of any lack of convention in this submission. The intent is to help improve security of the OpenSSL and curl projects, their consumers and end users. I will be sending this same content to both projects, curl via hackerone, and OpenSSL via openssl-security@openssl.org, per directions at each maintainer website.

I'm writing with regard to:
 - OpenSSL CVE-2019-1552
 - curl CVE-2019-5443
 
Background:
 - The root of each of these is that a default path in the OpenSSL build system for Windows targets is a location writable by a non-privileged user, and that OpenSSL configuration files placed there can change the behavior of OpenSSL, including code execution and escalation of privilege.
 - A PoC for code execution and escalation of privilege was published at:
   https://hackerone.com/reports/608577
 - This PoC uses a dynamic engine definition in such an OpenSSL configuration file to load a DLL in the security context of the application integrating the OpenSSL library, whose DLL_PROCESS_ATTACH handler inside DllMain can execute code in that context. This permits a non-elevated user to deploy code that may be executed by an elevated application.
 
Context of this email:
 - I am currently working with OpenSSL 1.0.2t as a LTS solution.
 - I have not tested or substantially researched other branches at this time.
 
Summary of current status:
 - OpenSSL project appears to have:
   - Designated CVE-2019-1552 as "Low" severity, even though the issue allows for EoP and potentially degrading the communication security intent of integrating applications, e.g. via inserting CA certificates.
   - At a high level, stated as "Fixed in OpenSSL 1.0.2t" (https://www.openssl.org/news/vulnerabilities.html) by this commit:
     https://github.com/openssl/openssl/commit/d333ebaf9c77332754a9d5e111e2f53e1de54fdd
	 The fix is, however, a fix to documentation, and changes in the build script that add a sample  for --prefix that is similarly insecure.
 - curl project appears to have:
   - Recommended that users update to 7.65.1_2
   - Stated that this commit "completely disables curl's ability to load an OpenSSL config when invoked."
     https://github.com/curl/curl-for-win/commit/51b658a76594942cf1d6f227d8fc4732bb8ec277
	 

My contentions:

 (A) The statement that CVE-2019-1552 was "Fixed in OpenSSL 1.0.2t" is extremely misleading, and could likely lead to users of the project updating OpenSSL without realizing that additional changes are required on their part. 

 (B) The sample "--prefix=c:/some/openssl/dir" is equally as vulnerable as the default, but more significantly, it is difficult to conceive of a path that is actually safe to use, and this might not be obvious to all developers. For example:
 
  - C:\Windows\System32 - Windows may not always be installed on drive letter 'C', leaving a hard-coded path similarly vulnerable on some systems
  - C:\Program Files - This path can be localized (e.g. "Programmes" in French-native installations), leaving a hard-coded path similarly vulnerable on some systems
    
  The OpenSSL code does not support passing an environment variable for runtime resolution, which would be a still vulnerable option, not least because Configure.pl will modify any path that is not an absolute path with drive letter, or one beginning with "/":

    $openssldir=$prefix . "/" . $openssldir if $openssldir !~ /(^\/|^[a-zA-Z]:[\\\/])/;
    
  One of few "safer" options I could think of was passing --prefix=\NUL --openssldir=\NUL, which should lead to a path or compound path after Configure.pl that is guaranteed to be invalid or else contain no content under Windows.
    
  In fact, in the aforementioned hackerone thread, "vsz" alludes to the fact that the fix in curl is not guaranteed:
    
  "After further experiments, I managed to tweak the build so that engine support can be kept enabled, and OpenSSL be built with a secure prefix. The trick was to use C:/Windows/System32/OpenSSL. This location can be fairly assumed to be a restricted directory on majority of installs and on all default installs going back a long time."
    
  Per above, this in not true unless Windows is installed on the 'C' drive. These are supposed to be projects implementing security, potentially integrated into end products distributed to millions of users with varying OS configurations. I personally would not call this "fixed". "Hardened", perhaps.
  
  (C) This still does not make the OpenSSL library safe, and I believe curl CVE-2019-5443 is actually *not fixed*, because the OpenSSL will read the path to configuration data from the OPENSSL_CONF environment variable.
  
  I downloaded curl 7.66.0 from:

    https://curl.haxx.se/windows/dl-7.66.0_2/curl-7.66.0_2-win32-mingw.zip
    
  I could compile and execute the same PoC as provided in the hackerone thread simply by setting the user-level environment variable:

    OPENSSL_CONF=C:\test\openssl.cnf
    
  The OpenSSL library used by curl (and other third-party apps who integrate it), will read this environment variable before the hard-coded path. Windows does not elevation to set user-level environment variables, and child processes can inherit them. This means that any elevated application using the OpenSSL library started from a compromised user account can be used as a EoP technique in the same way as before. For example, if OPENSSL_CONF is set at the user level, and the user signs out and later signs in again, the shell (Explorer.exe) inherits this environment variable, as does any process the user elevates.
    
  I have not tested, but if, as the text on the OpenSSL vulnerabilities page alludes to, this also allows someone to "insert CA certificates, modify (or even replace) existing engine modules", this same issue potentially weakens the communications secrecy of integrating apps.
    
  Aside: I see various places in the OpenSSL library code where other environment variables are queried, and I do not have time to evaluate each for potential issues.

## Impact

The attacker could run code in the context of an elevated process if they can modify user-level environment variables, or when Windows is not installed on the C drive.

Essentially, this report is that issues similar to CVE-2019-5443 persist in curl 7.66.0.

## Timeline

- **Report Filed**
- **2019-10-15** @bagder: Thanks a lot for the report of your findings! We will start to investigate this and will be back with comments and possibly follow-up questions within shortly!
- **2019-10-15** @bagder: Doesn't the commit referenced above (made by @vsz) make sure that the curl binary build we offer doesn't load any config at all thus it avoids this flaw?

So the way you'd get a vulnerable curl is to build it yourself and leave the config-loading via OpenSSL like this?
- **2019-10-15** @vsz: My ultimate suggestion/hint to fix this fully, was to have a way to build OpenSSL that disables relying on any hard-coded directories _completely_, as there doesn't exist such a universal Windows path that is guaranteed to be user-protected on all systems, or in other words, there is no concept of `/etc/` on Windows, any Windows. As far as introducing vulnerabilities via user-defined environent variables, I believe the stance on this is they are not considered security issues, and features like `SSLKEYLOGFILE` seems to agree with this.

Anyhow, relying on hard-coded directories was not fixed and thus the mitigation indeed still has known holes in it. Thanks for pointing out that `Program Files` can be localized — I completely forgot about it.

- ATM OpenSSL still does break when passed a Windows-specific `--prefix` when cross-built (it's never recognized as absolute path, see [this report](https://github.com/openssl/openssl/issues/9520)).
- The new, hard-coded defaults for mingw will fail in various configurations (localized Windows version, or running a 32-bit build on a 64-bit Windows system. I [raised this](https://github.com/openssl/openssl/pull/9400#issuecomment-517784572) latter, but to no avail.)
- OpenSSL still cannot be cross-built even with the new hard-coded defaults, because the Unix make logic (used in cross-builds) isn't prepared for spaces in filesnames. For the latter I opened a [PR](https://github.com/openssl/openssl/pull/9864), which hasn't yet been merged even though it's proven to work and to be correct. I'm using this patch to build the latest OpenSSL 1.1.1d for curl.
- Also note that Visual Studio builds are vulnerable as well, as on Windows, binaries are typically not built from source on the same machine they are being run on, so even a build-time detection of `Program Files` will become vulnerable when the binary is run on a system with a different `Program Files` folder.

I'd estimate that my path used for mitigation (`C:\Windows\System32\SSL`) has a higher chance to be valid that the OpenSSL default (especially with `Program Files` being localized), but of course none is perfect.

With regards to curl, the problem of `OPENSSL_CONF` should be fixed by using the curl build-time option `CURL_DISABLE_OPENSSL_AUTO_LOAD_CONFIG`, which disables dynamic loading of configuration. And that's about all an OpenSSL user code can do.

The disabled (in curl) call to `CONF_modules_load_file()` is also being called by OpenSSL itself from the `libcrypto` init function, via `ossl_init_config()` → `openssl_config_int()`. Did you test it if this is still being executed in curl context (with a `.conf` actually loaded)?

Even in that case we cannot do much besides rolling more local OpenSSL patches to fix its problems, or reporting the issue to their team in the hope to develop an upstream fix for it. I believe the only ultimate solution to this can only be implemented inside OpenSSL, so that it gets fixed in all OpenSSL user apps, not just in curl.
- **2019-10-15** @bagder: Thanks @vsz! I think perhaps the shortest answer to the initial report would be exactly this:

**vulnerabilities via user-defined environment variables are not considered security issues**

If a user can set environment variables for another user there are plenty of ways to "own" that user. `SSLKEYLOGFILE` being a prime example and one that at least two of the major browsers still allow to be set this way - proving that others are also taking this stance.
- **2019-10-15** @supersausage: Hi vsz, Badger,

Thanks for your response.

I agree that ultimately this appears to be an issue that OpenSSL should address. I agree that there does not appear to be an easy way to fix this without customizing OpenSSL's code further during the build.

vsz wrote:
>"With regards to curl, the problem of OPENSSL_CONF should be fixed by using the curl build-time option CURL_DISABLE_OPENSSL_AUTO_LOAD_CONFIG, which disables dynamic loading of configuration. And that's about all an OpenSSL user code can do.
>
>The disabled (in curl) call to CONF_modules_load_file() is also being called by OpenSSL itself from the libcrypto init function, via ossl_init_config() → openssl_config_int(). Did you test it if this is still being executed in curl context (with a .conf actually loaded)?"

I don't exactly follow the question, I think you are stating that you can control the curl behavior but perhaps not OpenSSL's own behavior. The test I performed was to use the curl project's official 7.66 build, which should contain your fix, and forced it to load the PoC DLL with the OPENSSL_CONF environment variable method.

I am attaching a sample PoC which starts Notepad as admin per the same technique originally proposed, dropped by an NSIS executable that does not prompt for UAC, but whose dropped code will eventually run UAC elevated in the context of some other trusted process chain on the system.

Badger, you wrote:

> "vulnerabilities via user-defined environment variables are not considered security issues"

I have to say that I feel very uneasy about this. 

The original vulnerability, CVE-2019-5443, has this succinct description:
https://nvd.nist.gov/vuln/detail/CVE-2019-5443

> "A non-privileged user or program can put code and a config file in a known non-privileged path (under C:/usr/local/) that will make curl <= 7.65.1 automatically run the code (as an openssl "engine") on invocation. If that curl is invoked by a privileged user it can do anything it wants."

I think the same appears to be true in this case also, with a non-privileged program capable of creating an EoP that ultimately allows its code to be run elevated in the context of numerous other third-party trusted toolchains, through forcing module injection.

Attack scenario:
 - User is tricked into running a malicious program, with no UAC prompt
   - Non-elevated program drops .cnf file, DLL, and modifies a user-level environment variable
 - Later, the user invokes any privileged process chain, accepting its UAC prompt, or similarly an elevated task is started in the context of the current user e.g. via task scheduler -- perhaps an update-check utility that has rights to update privileged locations. This process chain at some point executes the official curl download or libcurl with OpenSSL engine.
 - The malicious code is now running unknown to the user as part of a trusted process that is UAC elevated with full admin access to the system
   - Potentially the privileged processes are already trusted e.g. by task scheduler or compatibility settings and may not require any interaction

Wouldn't a non-privileged program quietly gaining admin access and running in the context of privileged processes normally be considered a vulnerability? Certainly the Windows OS strives to prevent non-privileged processes interacting with privileged processes as part of the security model.
- **2019-10-15** @bagder: (For reading CVEs concerning curl, I urge you to read *our* documents instead of more or less confused summaries hosted elsewhere, since we wrote the originals. Like here: https://curl.haxx.se/docs/CVE-2019-5443.html)

In that particular flaw, we learned that user A (the attacker) could put code in a place on the system so that it would get executed by program B or even user C in a way we considered was a security problem. All it took was for user A to have access to an unprivileged directory. Not an uncommon situation.

If I understand this reported issue correctly, user A here needs to somehow trick user C to set an environment variable first and then invoke the program B. It is the **set an environment variable** part that is key. That's a rather major thing and if you can make user C do that, you can usually also do all sorts of other malicious things but perhaps more importantly set other environment variables that will have a much more detrimental effect to user C (such as the `SSLKEYLOGFILE` environment variable).
- **2019-10-15** @supersausage: Okay.

Yes, that sounds like we are on the same page as to the setup.
- **2019-10-15** @vsz: > I don't exactly follow the question, I think you are stating that you can control the curl behavior but perhaps > not OpenSSL's own behavior. The test I performed was to use the curl project's official 7.66 build, which
> should contain your fix, and forced it to load the PoC DLL with the OPENSSL_CONF environment variable
> method.

I was wondering if the function we disable in curl via `CURL_DISABLE_OPENSSL_AUTO_LOAD_CONFIG` is still being called in certain cases, i.e. in your tests.

I've now tried to replicate it by pointing `OPENSSL_CONF` to our test `openssl.cnf` with the latest [7.66.0](https://curl.haxx.se/windows/dl-7.66.0_2/curl-7.66.0_2-win64-mingw.zip) curl, but _cannot_ trigger the rogue `.dll` (I used `calc.dll` on a slightly outdated Win 10). (It triggers with an unpatched 7.65.1 though.). So in my tests, the OpenSSL config load logic appears to be correctly disabled and it stays disabled even with this envvar set.

Is there some other/special condition that needs to be present?
- **2019-10-15** @supersausage: There is no additional special setup. I booted up a clean system to check.

I used the download you linked and:
- Compiled PoC for x64 with /MT msvc build
- Launched CMD
- "Set OPENSSL_CONF=C:\test\openssl.cnf"
- curl "https://www.microsoft.com"

This triggered it immediately.

If I set the environment variable in the registry or via the control panel then I sometimes have to log out and log in to a new session before windows will pass it down through whatever process environment blocks it has all the way to curl.

The PoC I attached should do the same steps, but I built that for x86 so you'd have to use the x86 build of curl.
- **2019-10-16** @vsz: Thanks, I got it working: Had to give the VM internet access, as in the previous case the OpenSSL config was read *before* the connection, while in this new case it's triggered *after*.

Question if there is any way for curl to tell OpenSSL not to do it.
- **2019-10-16** @bagder: I grepped around the OpenSSL code and this environment variable-based functionality seems to be present unconditionally and can't be disabled at build-time easily:

https://github.com/openssl/openssl/blob/3d5a7578e09a984c6475b1c008f5c76f850328cb/crypto/conf/conf_mod.c#L491

It might be possible to switch it off at run-time though since the function that ultimately makes the `getenv()` call is only invoked if a `filename` is NULL, but the OpenSSL API is such a complicated maze I haven't (yet) figured out exactly how we can set that filename to something else before that point...
- **2019-10-16** @vsz: Yes, build-time don't seem to be an option.

As for run-time, one ugly solution is to delete `OPENSSL_CONF` from the local curl environment.

One other possible way is calling `OPENSSL_init_crypto(OPENSSL_INIT_NO_LOAD_CONFIG, NULL)`, where the first parameter may need further tweaks to avoid suppressing init important stuff.
- **2019-10-17** @bagder: Yes, `OPENSSL_init_crypto` looks like the key to switch it off completely but I find the documentation a bit lacking on what to do with the flag option if you want everything else to be default and only disable the config loading...

But if we agree that this issue isn't a security issue to begin with, we can take the work on what function call to invoke and how as a regular pull-request and continue from there in the public instead and get more eyeballs and people involved.
- **2019-10-17** @vsz: I can second your assessment. OpenSSL initialization is messy and it's under constant change. Agreeing on moving this to the public Issue/PR track.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
