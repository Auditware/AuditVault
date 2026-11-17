---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/encoding-error
  - env/web
  - os/windows
substate: "not-applicable"
weakness: "Encoding Error"
enriched: true
date: 2024-06-18
submitted: 2024-06-13T10:01:20.635Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/curl|curl]]"
reporter: "splitline"
source: "https://hackerone.com/reports/2550951"
title: "Unicode-to-ASCII conversion on Windows can lead to argument injection and more"
---
# Unicode-to-ASCII conversion on Windows can lead to argument injection and more

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** curl | **Disclosed:** 2024-06-18

- Report: [https://hackerone.com/reports/2550951](https://hackerone.com/reports/2550951)
- CWE: Encoding Error
- Submitted: 2024-06-13T10:01:20.635Z

## Timeline

- **Report Filed**
- **2024-06-13** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2024-06-13** @bagder: I'm struggling to see how this is a curl problem. It looks like a Windows "feature" to me. It is being "helpful" and helps users to convert ascii-looking double quotes to ASCII double quotes.

The security problem in your described scenarios above seem to be the applications that think they can pass in an argument like that if it contains random (user-provided) rubbish (like specific unicode characters). It seems similar to inserting backticks or single quotes etc in unix command lines: those are not curl issues either.
- **2024-06-13** @dgustafsson: I agree, curl is acting as expected given the input.
- **2024-06-13** @splitline: Yes, it’s a feature. But the problem is the feature is not what we really want. 

First we can throw the security issue behind. Let’s imagine if a user wants to put a fullwidth character into a whatever argument, let’s take `--output=輸出（版本１）.html` as an example (yes it can happen, CJK language users do use those characters), then that character is converted into another character.  This is indeed an unnecessary and unexpected behavior for them.

Also, this feature  doesn’t exist in most of the programs. For example if you execute `notepad.exe "a＂ ＂.txt` it would just open `a＂ ＂.txt` but not `a`.

Then let’s go back to security issues. Is this the problem of curl? Well the command line is parsed by the `curl.exe` itself, not by `cmd.exe` or `powershell.exe`. It’s totally different from UNIX system. We can refer to [`CreateProcess` API documents](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw), we can only pass a lpCommandLine string but not something like `const char *arg`. So yes, the arguments are only parsed as the application developers want, not Windows.

Finally, let’s take a look at how Microsoft officially hopes developers do the parsing. Here is a the C command line parsing rule we can refer to: https://learn.microsoft.com/en-us/cpp/c-language/parsing-c-command-line-arguments . It doesn’t mention about some special rules for Unicode characters, so I would say at least this parsing rule in curl is not in a standard way.
- **2024-06-13** @bagder: > the command line is parsed by the curl.exe itself, not by cmd.exe or powershell.exe. It’s totally different from UNIX system.

I don't understand where you are getting this from. It seems to be based on some misunderstanding. The arguments are separated and put into an array by the OS and passed to the `main()` function exactly the same on Windows as in just about every other system out there.

The Microsoft example program you show there is exactly how curl gets and uses the arguments. So that example is also "vulnerable" to this feature you are describing.
- **2024-06-13** @jimfuller2024: Tend to agree that it is hard to see how curl (and presumably lots of other utilities) would be expected to manage this MS feature ... at worst maybe we recommend disabling 'best fit' feature rather then attempt to deal with the ambiguity. 

One other observation - the non existence of specific parsing rules in https://learn.microsoft.com/en-us/cpp/c-language/parsing-c-command-line-arguments?view=msvc-170 , especially no mention of unicode, best fit algorithm or any formal grammar does not fill me with confidence that this 'spec' is comprehensive ... though admittedly I have never spelunked into Microsoft extensions to the ANSI C standard either.
- **External User Joined**
- **2024-06-14** @splitline: > The arguments are separated and put into an array by the OS and passed to the main() function exactly the same on Windows as in just about every other system out there.

Unfortunately that’s not the case. let me clarify the argument parsing process again:
```
[Windows]
cmdline: `curl.exe "example.com＂ ＂--output=out.html"`
↓ run
`CreateProcessW("curl.exe", "curl.exe \"example.com＂ ＂--output=out.html\"");`
↓ new process
-----------------------------
[curl.exe]
/*
Trying to get the command line using ANSI API... ohhh but the Windows gave me a WideChar string, not ANSI. So now I need to convert the WideChar string using "best-fit" to fit into ANSI API!
*/
GetCommandLineA() ---return---> `curl.exe "example.com" "--output=out.html"`
↓ parse
argv[]: {"curl.exe", "example.com", "--output=out.html"};
↓ run the main function
int main (argc, argv)
```
And again, of course we know you didn't write anything like `GetCommandLineA`, but the compiler implicitly does that during the compile time.

Here is also a great article described about that: https://daviddeley.com/autohotkey/parameters/parameters.htm#WIN (there is no mention of best-fit tho)
 
> at worst maybe we recommend disabling 'best fit' feature rather then attempt to deal with the ambiguity

So far I didn't find any way to "disable" the feature either globally or locally. But if you find it, it sounds also a great option. Also as I mentioned in the original report, you can switch your `main()` function to `wmain()` and compile it with `-municode` if you are using MinGW-w64 compiler to prevent this behaviour -- in this way the Windows APIs in your program would be WideChar, no best-fit behaviour is required.
- **2024-06-14** @raysatiro: Argument parsing in Windows is technically up to the application. In practice many applications use an entry point such as main or wmain so they require that the arguments are already parsed. To compensate for that the compiler will add its own code to parse the arguments in an internal hidden entry point and then call the application's entry point with the parsed arguments. Every compiler does this differently depending on the compiler's own parsing code *and* how the application is built. So it's inconsistent but it's not as bad as if every application has its own unique parsing code.

Somewhat related: David Deley has [documented the insanity](https://daviddeley.com/autohotkey/parameters/parameters.htm#WIN) of Windows argument parsing.

Applications that require strict conformity can add their own code to parse arguments from the command line or call [CommandLineToArgvW](https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-commandlinetoargvw). Compilers for Windows (such as Microsoft's cl and mingw-w64's build of gcc) have their own code that does not call CommandLineToArgvW to parse arguments. CommandLineToArgvW causes shell32.dll to be loaded by the application which can slow things down and IMO for many command line utilities it should be avoided.

I'd imagine it would be ideal if applications are built with _UNICODE defined (use the CRT Unicode), use an internal startup entry point that is for Unicode in that it parses Unicode arguments from a Unicode command line, and then pass those arguments on to the application's entry point as Unicode (wmain). It is possible to create a build of curl like that.

Microsoft's build of curl that is included with Windows is built for Unicode and a Unicode internal entry point and curl has a Unicode application entry point (wmain with wchar_t argv). And yet I still cannot be sure this vulnerability cannot happen.

On the other hand, the curl project's official build of curl for Windows is not built for Unicode so I guess it's likely to happen as it would any application built with an ansi entry point (main with char argv).

In my opinion, this is not a curl bug. My initial impression of this vulnerability is the only way to be sure it cannot occur is for every application to do their own argument parsing from a Unicode command line. Who's doing that though? We'd possibly create unexpected behavior or vulnerabilities by writing our own parsing.

That said, if curl security feels this issue should be addressed then maybe we could mitigate it by banning Unicode style quotes from non-Unicode builds of curl. We could do that by scanning the command line for those characters:
~~~
#ifndef _UNICODE
  {
    const wchar_t *p;
    for(p = GetCommandLineW(); *p && *p != (wchar_t)0xFF02; ++p)
    ;
    if(*p) {
      fprintf(stderr, "Fatal: Non-Unicode curl can't accept Unicode quote.\n");
      exit(1);
    }
  }
#endif
~~~
- **2024-06-14** @bagder: Something tells me that 0xff02 is not the only unicode character that can cause havoc like this so it seems like a futile attempt - not to mention that this is in fact a Windows feature, there might be any number of applications quite legitimately using this.

This issue reminds me a lot of the challenges with [unicode in IDN](https://daniel.haxx.se/blog/2022/12/14/idn-is-crazy/) that I have written about before.

> you can switch your main() function to wmain() and compile it with -municode if you are using MinGW-w64 compiler to prevent this behaviour

From what I understand, it is far easier said than done. We have struggled with Unicode builds on Windows on and off for years. It usually means some other vital feature stops working.

I still insist that this flaw/feature/effect is not *in* curl. It exists in the CRT or in Windows or as a combination.
- **Report Title Updated**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2024-06-15** @splitline: Yes, there are several characters would be converted to double quote, not only U+FF02.

> Unicode-to-ASCII double quote conversion on Windows can lead to argument injection. 

Sadly to say not only double quote conversion can cause this issue actually. Here is another example in Node.js that can lead to argument injection:
```javascript
child_process.spawnSync('curl.exe',['example.com', '--data', 'name=meow\u2000-o\u2000z.txt']);
// \u2000 can be converted to space
```
But anyway it doesn't matter, since banning specific characters can't be a long term solution. We might just need to prevent the best-fit behaviour getting triggered here.

> It exists in the CRT or in Windows or as a combination.

In my opinion, although it is quite easy to misuse (what can go wrong with a normal main function?), it is not entirely a problem of CRT -- but I do think they should document it in a better way. Besides, worth to mention that the build Microsoft doesn't have this kind of issue.

By the way I also played with IDNA compatibility processing [for a while](https://splitline.github.io/domain-obfuscator/), yeah quite a weird feature too...
- **2024-06-15** @bagder: > the build Microsoft doesn't have this kind of issue

I maintain that's a difference that is not terribly important here, but it is a sign of the depth of the confusion in this system and setup. The unicode-to-ascii replacements are not done by curl and therefore they are not curl's security problems. They may still be problematic, even security problems and certainly surprising to users. But they are done outside of curl.

Microsoft builds and ships curl with **Unicode** enabled (which makes it use `wmain`), our official windows builds do not (which makes it use `main`).
- **2024-06-16** @orange: Hi everyone, apologies for joining the discussion late. I have carefully read through your discussion.

After reading the above discussion, I believe we all agree that the root-cause occurs after `CreateProcess`, when the arguments are passed from the Windows kernel to the program's main function. The startup-code automatically added by the CRT-Runtime uses the ANSI Win32 API, which causes curl to be unable to fundamentally recognize the arguments passed by the user, leading to this security risk.

First of all, this might not have originally been an issue with the native curl codebase. However, when porting Unix-like programs to Windows, it is necessary to make some changes to accommodate Windows conventions. For example, Python has clearly recognized this issue:

> https://github.com/python/cpython/blob/main/Programs/python.c#L7

So does NodeJS:
> https://github.com/nodejs/node/blob/672e4ccf0507dd7893e36adb10929d99687dbcaa/src/node_main.cc#L34


Although their original intention might not have been to address this security issue (it was to resolve problems like garbled filenames), this still prevents them from this argument injection issues as described in this report.

We want to highlight this point to you because curl, being the most widely used HTTP client in the world, especially in the web ecosystems, has a diverse range of use cases. One can imagine how developers need to defend against the following program.

** normal.py **
```python
import subprocess
url = 'https://example.com/'
if startswith("https://example.com/"):
    subprocess.run(['curl.exe', url])
```

** abnormal.py **
```python
import subprocess
url = 'https://example.com/\u02ba \u02ba-V'
if startswith("https://example.com/"):
    subprocess.run(['curl.exe', url])
```

*P.S.The native `subprocess.run` in Python does not have command injection issues, such as backticks or semicolons.*
```bash
$ python3 normal.py
 <output of example.com>

$ python3 abnormal.py
 <output of curl -V>
```

So, by passing in a URL that starts with `https://example.com/`, a user can inject other curl arguments, visit other URLs, or even execute arbitrary code. Is this the expected behavior?



Or do developers need to write potentially several lines of code to filter `url`? This is not just a matter of filtering Unicode characters; there are also other non-Unicode characters that can "BEST-FIT" to other dangerous characters and cause other harm (although these are other minor issues).
- **2024-06-16** @bagder: "Python/node has clearly recognized this issue"

1. They may not be subject to this issue but that does not mean that they use wmain for this reason or that they were even aware of this replacement thing going on.
2. Even if they actually did acknowledge and use wmain only to  to suppress unicode-to-ascii-replacing on Windows, it does not imply that this issue is curl's. It merely suggests that there is a work-around or "fix" that can be applied in curl that stops it from happening.
3. We have tried to enable unicode in the curl builds several times over the years but always had to revert it because of various different problems that have been reported. It's a complicated problem and we cannot "just" use wmain without also addressing the fallout. And so far we have failed at that when tried in the past.

But all of this comes back to: curl does not do the replacement, it did not ask for it. This flaw, feature or vulnerability is not curl's.
- **Report Title Updated**
- **Report Not Applicable**
- **Agreed On Going Public**
- **2024-06-16** @orange: In fact, we tested several widely used CLI programs, and most of them handled this properly. However, since you think this is not a bug with curl, there won't be any workaround or patch released, is my understanding correct?

Does @splitline have any thought?
- **2024-06-16** @bagder: If we can mitigate this we should probably consider that, but it is a hard problem and it certainly is not going to be solved in the short term. curl is a victim here, not the responsible party.
- **Manually Disclosed**
