---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/buffer-underflow
  - env/web
substate: "not-applicable"
weakness: "Buffer Underflow"
enriched: true
date: 2024-11-07
submitted: 2024-11-06T01:50:16.189Z
bounty_usd: null
votes: 53
cve: []
program: "[[programs/curl|curl]]"
reporter: "rootgh0st"
source: "https://hackerone.com/reports/2823554"
title: "Buffer overflow in strcpy"
---
# Buffer overflow in strcpy

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 53 | **Program:** curl | **Disclosed:** 2024-11-07

- Report: [https://hackerone.com/reports/2823554](https://hackerone.com/reports/2823554)
- CWE: Buffer Underflow
- Submitted: 2024-11-06T01:50:16.189Z

## Timeline

- **Report Filed**
- **2024-11-06** @dfandrich: You've provided a stack trace that shows OpenSSL doing a strcpy, then say that it isn't accurate, then provide a generic exploit that doesn't involve curl, but you don't ever actually say what is actually faulty in curl. You haven't provided any evidence that there is actually any kind of problem in curl. This whole report is a generic description of a buffer overflow that could have come from a textbook. There are plenty of buffer overflows in program in this world; this tracker is intended for those that affect curl.
- **2024-11-06** @rootgh0st: The problem is in strcpy in the src files of curl.. have you seen the exploit code ??????
- **2024-11-06** @bagder: Please specify exactly where the vulnerable code is in curl and under which conditions that would overflow.
- **2024-11-06** @rootgh0st: Sorry, explaining it was difficult because i went though a lot of trial and error. I scanned the source files of curl. I found the strcpy overflow inside one of these.. :

VULN file: /home/gh0st/Desktop/curl/src/tool_progress.c - Function: strcpy( - Line number: 111                                                                        
VULN file: /home/gh0st/Desktop/curl/src/tool_main.c - Function: strcpy( - Line number: 115                                                                            
VULN file: /home/gh0st/Desktop/curl/src/tool_formparse.c - Function: scanf( - Line number: 506                                                                        
VULN file: /home/gh0st/Desktop/curl/src/tool_dirhie.c - Function: strcpy( - Line number: 145                                                                          
VULN file: /home/gh0st/Desktop/curl/src/tool_urlglob.c - Function: scanf( - Line number: 210                                                                          
VULN file: /home/gh0st/Desktop/curl/src/tool_getparam.c - Function: scanf( - Line number: 1518                                                                        
VULN file: /home/gh0st/Desktop/curl/src/tool_parsecfg.c - Function: fgets( - Line number: 312                                                                         
VULN file: /home/gh0st/Desktop/curl/src/tool_parsecfg.c - Function: gets( - Line number: 312   

I will have to dig deeper because I forget which one at the moment, I tried them all. Eventually I got one to work. The exploit does send a bof to curl and exploits the buffer... sorry for the generic report that looks like it came from a text book hah! Please review the exploit code....
- **2024-11-06** @bagder: You seemed to have missed this part: **and under which conditions that would overflow**

Those functions are not problematic to use when used correctly. Your job is not to grep the code and point out where those functions are used because we can do that already ourselves.

You have not identified any problem if you cannot tell us exactly what needs to be done to trigger a buffer overflow. Then you are just wasting our time.
- **2024-11-06** @rootgh0st: I believe its tool_main.c 

#ifdef CURLDEBUG
static void memory_tracking_init(void)
{
  char *env;
  /* if CURL_MEMDEBUG is set, this starts memory tracking message logging */
  env = curl_getenv("CURL_MEMDEBUG");
  if(env) {
    /* use the value as filename */
    char fname[CURL_MT_LOGFNAME_BUFSIZE];
    if(strlen(env) >= CURL_MT_LOGFNAME_BUFSIZE)
      env[CURL_MT_LOGFNAME_BUFSIZE-1] = '\0';
    strcpy(fname, env); <---------------------------------------------------------
    curl_free(env);
    curl_dbg_memdebug(fname);
    /* this weird stuff here is to make curl_free() get called before
       curl_dbg_memdebug() as otherwise memory tracking will log a free()
       without an alloc! */
  }
  /* if CURL_MEMLIMIT is set, this enables fail-on-alloc-number-N feature */
  env = curl_getenv("CURL_MEMLIMIT");
  if(env) {
    char *endptr;
    long num = strtol(env, &endptr, 10);
    if((endptr != env) && (endptr == env + strlen(env)) && (num > 0))
      curl_dbg_memlimit(num);
    curl_free(env);
  }
}
- **2024-11-06** @rootgh0st: Sorry didnt mean to waste anyones time Badger, I thought you would be happy about this.
- **2024-11-06** @rootgh0st: Badger, 
I think even though Im sending data to curl, it uses openssl internally for ssl, when openssl tries to duplicate or copy strings (such as during certificate handling or URL parsing), it causes the overflow due to improper mem handling inside openssl..

i believe the problem happens in memset(&global, 0, sizeof(global));
This doesn't seem to cause the overflow directly. However, the initialization step is crucial because it sets up the environment for subsequent operations.
The call stack shows that the program crashes inside __strcpy_evex (a specialized version of strcpy), which is part of CRYPTO_strdup.
CRYPTO_strdup is a function in the openssl library, and it duplicates a string. The function allocates memory (using CRYPTO_malloc) and then copies the string into this newly allocated memory. 
The crash is occurring at the strcpy function, specifically inside the openssl function CRYPTO_strdup.
The crash happens because the program tries to copy a string into a destination buffer, and this buffer is not large enough to accommodate the string being copied.
overflow is most likely caused by insufficient memory allocation for the destination buffer in CRYPTO_malloc. Specifically, strcpy attempts to copy a string into a buffer that is too small, resulting in a buffer overflow.
- **2024-11-06** @rootgh0st: mismatch between the allocated buffer size and the actual string length..

thanks
- **2024-11-06** @bagder: You still do not tell us **how** such an overflow can happen. You just point out that there are uses of those functions but that's far from enough for it to be a problem. You say there is an "improper mem handling" but without telling us in what ways it is improper and the condition needed for the code to perform an overflow.

This tells me you're just running grep on the code and you have not actually found any problems at all.

if your next comment is not trying to address this shortcoming in the report, I will just close this.
- **2024-11-06** @rootgh0st: Sorry Badger, that is all I know. I just showed you how. Not just running grep on the code and talking nonsense because as you can see i have provided proof of concept exploit code that shows that I can get a shell from exploiting curl..and pic.. I showed debug info..where in the stack is causing it and the functions causing it... not sure what else you need? Did you get the POC? did you run it? Between finding the vulnerable function and coding the exploit with trial and error this took me about 5 straight hours to get a working exploit. There is indeed a buffer overflow inside curl.. Im not sure what else to tell you.
- **2024-11-06** @bagder: The `<--------` in your comment above shows a copy done *after* a length check that makes sure the copy is ok.

Additionally, it is only done in debug code so even if it would be bad it would not be a security problem. But it isn't bad.

So no, you have not identified a buffer overflow in curl code yet.
- **2024-11-06** @rootgh0st: Then how am I spawning a shell from curl ? Ha! Ill be honest Badger that is all I know. I wish you would consider my findings, because the exploit code shows there is an overflow in that area with those functions. It seems silly to me to dismiss my (serious) findings with working exploit because I that is all I can provide ? 
strcpy inside open ssl crypto_strdup.
strcpy tries to copy a string into the crypto_malloc buffer, and this buffer is not large enough to accommodate the string being copied, its too small..
That is all I have for you...
Cheers sir.
- **2024-11-06** @bagder: If you found a buffer overflow in OpenSSL, then this is the wrong place to report it. We cannot take responsibility for issues in third party libraries. You need to contact the OpenSSL dev team for that.

I would however urge you to double-check and triple-check your findings, and if you are still certain, work on providing clear and accurate facts with a step-by-step description how the code can get exploited in the real world.

Based on what you have presented in here so far, I just don't trust that you have found any security problem anywhere.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
