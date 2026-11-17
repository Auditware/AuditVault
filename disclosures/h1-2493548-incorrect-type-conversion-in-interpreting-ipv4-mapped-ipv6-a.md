---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/type-confusion
  - env/web
substate: "not-applicable"
weakness: "Type Confusion"
enriched: true
date: 2024-05-08
submitted: 2024-05-07T15:11:55.706Z
bounty_usd: null
votes: 20
cve: "CVE-2023-24329", "CVE-2024-22243"
program: "[[programs/curl|curl]]"
reporter: "z3r0yu"
source: "https://hackerone.com/reports/2493548"
title: "Incorrect Type Conversion in interpreting IPv4-mapped IPv6 addresses and below `curl` results in indeterminate SSRF vulnerabilities."
---
# Incorrect Type Conversion in interpreting IPv4-mapped IPv6 addresses and below `curl` results in indeterminate SSRF vulnerabilities.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 20 | **Program:** curl | **Disclosed:** 2024-05-08

- Report: [https://hackerone.com/reports/2493548](https://hackerone.com/reports/2493548)
- CWE: Type Confusion | CVE: CVE-2023-24329, CVE-2024-22243
- Submitted: 2024-05-07T15:11:55.706Z

## Timeline

- **Report Filed**
- **2024-05-07** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2024-05-07** @bagder: We generally never accept "URL inconsistencies" as security vulnerabilites because there is no single, fixed, known and established URL syntax to follow. Everyone does their own.

I can't reproduce this on Linux:
~~~
$ curl -g 'http://[::ffff:0127.0.0.1]/' -v -o /dev/null
* URL rejected: Bad IPv6 address
* Closing connection
curl: (3) URL rejected: Bad IPv6 address
~~~

On macOS it works, because inet_pton() there apparently strips those leading zeroes while on Linux/glibc it refuses such addresses. But since that's a libc function doing the conversion that way, it could be considered a fairly standard behavior.

I cannot find any mentions of using octal numbers in the IPv6 address (in a URL) in either of those RFCs you mention and not in RFC 3986. So, I think maybe inet_pton then trumps your opinion.

Severity "critical" really?

I think the worst problem this identifies is that there is an inconsistency between platforms that is annoying.
- **2024-05-07** @bagder: @icing mentioned to me that in RFC 4291 section 2.2 it says:
~~~
   3. An alternative form that is sometimes more convenient when dealing
      with a mixed environment of IPv4 and IPv6 nodes is
      x:x:x:x:x:x:d.d.d.d, where the 'x's are the hexadecimal values of
      the six high-order 16-bit pieces of the address, and the 'd's are
      the decimal values of the four low-order 8-bit pieces of the
      address (standard IPv4 representation). 
~~~
Let me emphasize **the decimal values**. There is no mention of other bases and certainly not octal.
- **2024-05-07** @icing: @z3r0yu do you have a case where the OS in `inet_pton()` converts the ipv4 parts with *octal* notation? That would be wrong.

In rfc 4291 ch 2.2, item 3 is says "the 'd's are the *decimal* values of the four low-order 8-bit". 

ipv4 embedded in ipv6 is therefore in *decimal* notation and '0127.0.0.1' would indeed be '127.0.0.1' - if leading zeros are allowed by the OS. It seems your validator is reading the address wrong?
- **2024-05-07** @bagder: Also: **none** of the four referenced CVEs are about this problem. They are all just about related problems with other kinds of URL parsing. Two of them are about parsing IPv4 numerical addresses, but I consider that a different matter as well.
- **2024-05-08** @z3r0yu: Thank you for your response.

In an RFC draft [1], it is mentioned that IPv4 addresses can be represented in octal or hexadecimal notation in the BSD standard. I have also observed that curl appears to follow this specification, actively converting octal IP addresses to decimal, as shown in Figure 1 of my report. However, this behavior is not observed in the case of IPv4 addresses embedded within IPv6 addresses. Therefore, I suspect that there might be inconsistencies in the handling of IPv4 addresses across different implementations. Inconsistencies like these can potentially lead to the emergence of security vulnerabilities.

```
 Meanwhile, a very popular implementation of IP networking went off in
   its own direction.  4.2BSD introduced a function inet_aton(), whose
   job was to interpret character strings as IP addresses.  It
   interpreted both of the syntaxes mentioned in [MTP] (see above): a
   single number giving the entire 32-bit address, and dot-separated
   octet values.  It also interpreted two intermediate syntaxes: octet-
   dot-octet-dot-16bits, intended for class B addresses, and octet-
   dot-24bits, intended for class A addresses.  It also allowed some
   flexibility in how the individual numeric parts were specified: it
   allowed octal and hexadecimal in addition to decimal, distinguishing
   these radices by using the C language syntax involving a prefix "0"
   or "0x", and allowed the numbers to be arbitrarily long.
```

[1] https://datatracker.ietf.org/doc/html/draft-main-ipaddr-text-rep-00
- **2024-05-08** @bagder: Your issue here is about specifying an **IPv6** address, not an IPv4 one.

If you specify an IPv4 address, it does not use brackets and it can feature decimal, octal or hexadecimal numbers in weirdo combinations indeed. This is not the case for IPv6 numbers.
- **2024-05-08** @z3r0yu: Thank you for your feedback.

My report specifically addresses IPv4-mapped IPv6 addresses. According to RFC 4291, IPv4-mapped IPv6 addresses are simply IPv4 addresses embedded in the lower 32 bits of an IPv6 address, allowing IPv4 addresses to be represented in IPv6 format.

The IPv4 portion embedded within an IPv4-mapped IPv6 address should still adhere to the standard IPv4 address format. Therefore, this portion should retain the same flexibility as IPv4 addresses, including the use of various unusual combinations.

I believe we both agree that IPv4 addresses can use a range of representations, and this behavior should also be consistent for the embedded IPv4 addresses in IPv4-mapped IPv6 addresses.

Thank you for considering this clarification.

Best regards,
- **2024-05-08** @bagder: > this behavior should also be consistent for the embedded IPv4 addresses in IPv4-mapped IPv6 addresses.

No. There are no standard documents saying this and the regular IPv6 parsing libc functions do not support it.
- **2024-05-08** @z3r0yu: Yes, the RFC documents may not provide clear enough descriptions, leading to different interpretations. We are conducting extensive tests and attempting to improve this issue. We have also noticed inconsistencies in how this problem is handled on Linux and macOS.
However, I have another question to ask you. Is curl's support for octal and hexadecimal formatted numbers in IPv4 a feature of libc or curl's own implementation?
- **Report Not Applicable**
- **2024-05-08** @z3r0yu: Thank you for your response. I would like to inquire whether it is permissible for me to share the report publicly.  I appreciate your guidance on this matter.
- **2024-05-08** @bagder: IPv4 numerical addresses in URLs are parsed and treated differently and seems to be off-topic for this issue. Let's not continue this thread with off-topic content. Please use a public forum for regular curl questions.
- **Agreed On Going Public**
- **2024-05-08** @z3r0yu: Okay, after continued testing, I'll discuss this in a public forum.
- **Manually Disclosed**
