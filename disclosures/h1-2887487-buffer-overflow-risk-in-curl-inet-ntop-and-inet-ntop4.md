---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "not-applicable"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2024-12-08
submitted: 2024-12-08T07:15:39.266Z
bounty_usd: null
votes: 39
cve: []
program: "[[programs/curl|curl]]"
reporter: "b3fbcf5debe00185bbe06c0"
source: "https://hackerone.com/reports/2887487"
title: "Buffer Overflow Risk in Curl_inet_ntop and inet_ntop4"
---
# Buffer Overflow Risk in Curl_inet_ntop and inet_ntop4

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 39 | **Program:** curl | **Disclosed:** 2024-12-08

- Report: [https://hackerone.com/reports/2887487](https://hackerone.com/reports/2887487)
- CWE: Classic Buffer Overflow
- Submitted: 2024-12-08T07:15:39.266Z

## Timeline

- **Report Filed**
- **2024-12-08** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2024-12-08** @dfandrich: The `if (strlen(tmp) >= size)` clause in `Curl_inet_ntop` prevents the kind of overflow you describe. Running your first PoC shows no buffer overflow errors, with ASAN nor with valgrind. Have you actually tried these PoC yourself?
- **2024-12-08** @bagder: You mention "risk" here. Does this mean that you cannot point to a real security flaw on a specific line of curl code?

How about showing us exact step-by-step how to trigger said security problem when using curl?
- **2024-12-08** @b3fbcf5debe00185bbe06c0: Thank you for your feedback. You're absolutely right that the `if (strlen(tmp) >= size)` clause in the `Curl_inet_ntop` function does check the size and prevents overflow from occurring in that specific context. Based on this check, it ensures that the data in `tmp` doesn't exceed the size of the destination buffer, and this would indeed prevent a buffer overflow when properly validated.

As for the Point of Concept (PoC) tests I described, I understand your point that running these tests with **AddressSanitizer (ASAN)** and **Valgrind** might show no buffer overflow errors due to this safety check. 

You're correct that in the context of the provided code, the check prevents overflow, and I didn't fully account for the situation where the buffer is large enough to hold the data. I appreciate your clarification, and I will review the test cases more carefully to ensure that they align with the correct understanding of the function's behavior.

That being said, in cases where the check may be bypassed or in a different implementation scenario, similar vulnerabilities can still appear. However, for the specific code you've provided, the current checks are sufficient to avoid overflow.

Thank you for pointing this out, and I appreciate the opportunity to review the tests with better consideration.
- **2024-12-08** @bagder: I call slop
- **2024-12-08** @b3fbcf5debe00185bbe06c0: ### **Why Buffer Overflow Can Still Occur**
Although the `strlen(tmp) >= size` check is performed beforehand, **`strcpy`** does not check the size of the destination buffer (`dst`). If the size of `dst` is smaller than the size of `tmp`, `strcpy` will copy the data beyond the bounds of `dst`, resulting in **buffer overflow**.

### **Example Issue**:
For example, if `tmp` contains `"255.255.255.255"` (which has 15 characters, plus the null terminator, making it 16 bytes), and if `dst` is allocated only 15 bytes or less, calling `strcpy(dst, tmp)` would cause a buffer overflow.

### **Safe Fix Using `strncpy`**:
To prevent the buffer overflow, you should use `strncpy` or `snprintf` instead of `strcpy` to ensure that the copy operation respects the buffer size and does not exceed its boundaries:
```c
#include <stdio.h>
#include <string.h>
#include <errno.h>

static char *inet_ntop4(const unsigned char *src, char *dst, size_t size) {
    char tmp[sizeof("255.255.255.255")];

    // Format the IPv4 address
    snprintf(tmp, sizeof(tmp), "%d.%d.%d.%d", src[0], src[1], src[2], src[3]);

    if (strlen(tmp) >= size) {
        errno = ENOSPC;
        return NULL;
    }

    // Safely copy using strncpy, ensuring null termination
    strncpy(dst, tmp, size - 1);
    dst[size - 1] = '\0';  // Ensure null termination

    return dst;
}
```

### **Summary**:
The check for `strlen(tmp) >= size` is a good safeguard, but buffer overflow can still occur with **`strcpy`** if `dst` is not large enough. Using **`strncpy`** or **`snprintf`** ensures that the data is copied safely without exceeding the buffer size.

If `dst` is large enough, everything will work as expected. Thanks again for taking the time to point this out.
- **Report Spam**
- **2024-12-08** @b3fbcf5debe00185bbe06c0: I understand you're upset, but let's keep the conversation respectful. If you need to discuss something, I'm happy to listen.
- **2024-12-08** @jimfuller2024: Once I got through 'the wall of text'  which appears comprehensive but does not contain a reproducer or concrete steps to vulnerability - as far as I can tell we have another report with no risk of vulnerability ... if the op wants to suggest a code change then I would suggest to raise a PR.
- **2024-12-08** @b3fbcf5debe00185bbe06c0: I used to love using curl; it was a tool I deeply respected and recommended to others. However, after engaging with its creator, I felt disrespected, met with a lack of empathy, and faced unprofessional behavior. This experience has unfortunately made me reconsider my support for curl, and I no longer feel enthusiastic about using or advocating for it. Respect and professionalism are key in any community, and this interaction has been disappointing.
- **2024-12-08** @jimfuller2024: The curl project strives to (usefully) respond to all security requests within a 24 hour period ... it is a Sunday and you have sent an aspirational vulnerability report which is far from actionable. There may indeed be problems in curl/libcurl (there always is) but the lack of crispness in your comms means we are forced to guess what vulnerability in curl/libcurl  you might be referring to.  I am sorry you feel disrespected ... but that has more to do with the accuracy and quality of your submission  - perhaps in the future this kind of theoretical vulnerability is better discussed in the project itself or if you make submissions here then make sure to include concrete steps (in libcurl/curl context) with code that reproduces the vulnerability.
- **2024-12-08** @bagder: @napol-webug I'm sorry you feel that way, but you need to realize your own role here. We receive AI slop like this regularly and at volume. You contribute to unnecessary load of curl maintainers and I refuse to take that lightly and I am determined to act swiftly against it. Now and going forward.

You submitted what seems to be an obvious AI slop "report" where you say there is a security problem, probably because an AI tricked you into believing this. You then waste our time by not telling us that an AI did this for you and you then continue the discussion with even more crap responses - seemingly also generated by AI.

By all means, use AI to learn things and to figure out **potential** problems, but when you just blindly assume that a silly tool is automatically right just because it sounds plausible, then you're doing us all (the curl project, the world, the open source community) a huge disservice. You should have studied the claim and verified it before you reported it. You should have told us an AI reported this to you. You should have provided an exact source code location or steps-to-reproduce when asked to - because when you failed to, you proved that your "report" had no particular value.

What tells me this is AI slop;

1. The wall of text that is too long and unspecific, talking about a *potential* problem
2. The over-politeness when asked to clarify and provide more info. Humans rarely speak like that.
3. The inability to become specific when asked. It can't point out the flaw exactly, because it does not actually know about any flaw.

I'm sorry you feel less enthusiastic about curl now because of this. I hope you after some time in a future will come to reassess what happened here and maybe even understand why we act the way we do.

Now, let's go back to improving curl.

Thanks
- **Comments Closed**
- **Report Reopened**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
- **External User Joined**
