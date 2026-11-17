---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/heap-overflow
  - env/web
substate: "informative"
weakness: "Heap Overflow"
enriched: true
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
