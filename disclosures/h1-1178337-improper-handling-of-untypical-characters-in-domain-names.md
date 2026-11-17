---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-null-termination
  - env/web
  - stack/node
substate: "resolved"
weakness: "Improper Null Termination"
enriched: true
date: 2021-09-10
submitted: 2021-04-28T14:07:26.814Z
bounty_usd: null
votes: 4
cve: "CVE-2021-22931"
program: "[[programs/nodejs|Node.js]]"
reporter: "philippjeitner"
source: "https://hackerone.com/reports/1178337"
title: "Improper handling of untypical characters in domain names"
---
# Improper handling of untypical characters in domain names

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js | **Disclosed:** 2021-09-10

- Report: [https://hackerone.com/reports/1178337](https://hackerone.com/reports/1178337)
- CWE: Improper Null Termination | CVE: CVE-2021-22931
- Submitted: 2021-04-28T14:07:26.814Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-04-29** @philippjeitner: We have reproduced the issue with node version v10.19.0 as it is packaged by ubuntu and the current version 16.0.0 as it can be downloaded from https://nodejs.org/en/.

> are you saying you plan to disclose this on August 11, 2021?

Yes, this is part of a paper on issues in dns stub libraries, and node is one of the tested implementations.
- **2021-04-29** @philippjeitner: > I have not set up bind9 to reproduce, but it seems a legitimate concern.

You can also just try to resolve one of the public domains operated by us (ie. cnamezeroweb.test.xdi-attack.net) these are available to any resolver in the world, the zone file is just included for completeness.
- **2021-04-29** @jasnell: I just want to clarify the issue on this to make sure I understand...

The concern for the second issue is that because the `dns` module returns the results unfiltered/unmodified, applications may be at risk if they use the result directly without applying the necessary filtering and content checks?

On the first concern, I agree that it's an issue we should look at.

On the second, I'm not yet as convinced but we can look into it.
- **2021-04-30** @philippjeitner: >I just want to clarify the issue on this to make sure I understand...
>The concern for the second issue is that because the dns module returns the results unfiltered/unmodified, applications may be at risk if they use the result directly without applying the necessary filtering and content checks?

Yes, exactly. We are discussing this issue with developers of multiple libraries, our opinion on why stub resolvers should filter special characters is the following:

>The definition of "hostname" in RFC952 and RFC1123 are still very relevant up to today. Without this restriction what a "hostname" can be, Internationalized Domain Names [RC5890] would be unnecessary (since domain names could carry binary UTF-8 codepoints directly) and any standard which builds up on DNS assumes the same restrictions: For a recent RFC which still contains this restricted definition of "hostname", we refer to RFC8552, Section 1.1 from march 2019 which states:
>
>>    Because the DNS rules for a "host" (host name) do not allow use of
    the underscore character, the underscored name is distinguishable
    from all legal host names [RFC0952].
>
>The POSIX standard clearly mentions "hostnames" (renamed to "nodenames" in later versions), but fails to specify what a "hostname" or "nodename" is. In our view, the best reference therefore is the IETF definition of "hostname", which is derived from RFC952 in all later documents.
>
>Not filtering special characters in stub resolvers can create 2 issues:
>
> - Applications typically do not expect special characters inside hostnames. We conducted a study various applications and none of them sanitized hostnames before including them in potentially unsafe outputs, like HTML, shell output (ANSI escape codes) or newline-seperated pipes for inter-process-communication. Such behavior is ultimately caused by the application itself, but other that handling direct input from users, our results shows that application developers are not aware that values returned from stub resolvers essentially represent user input as well. This might be because they think that DNS does only support characters [a-z0-9-.] or because they trust the input because it seems to come from the operating system, not a remote peer. Anyway, we argue that fixing such behavior in all affected applications is unrealistic and therefore other ways of mitigating the issue should be taken.
>
> - Since there is no standard which defines how special characters should be handled by libraries, different libraries might handle special characters differently. For example, some libraries apply the same escaping as done in zone files (escaping characters like "@" with "\@"), but others only escape the bare minimum ("\000" and "\."). This different behavior itself can create issues when an application mixes library implementations, ie. when an application acquires a hostname on one system, sends it to another system as a string and this system then tries to process it further. Furthermore, special characters included directly in domain names might overlap with IDNA-domains, which can create a further risk of misinterpretation which can again, lead to vulnerabilities.
>
>These risks can only be addressed by a standardized handling of special characters in domain names in all libraries, otherwise developers might develop their application on one platform and assume that the behavior on this platform applies to other platforms as well, thereby risking the creation of a vulnerability when porting the application. We argue that the best way of doing this would be to stick to the IETF rules, and therefore filter special characters from hostnames.
- **2021-05-25** @jasnell: On the mishandling of the zero-byte in the cname record, it appears that c-ares is to blame here. A fix is going to be quite a bit more complicated in that we would need to either fix upstream or implement alternative parsing logic.
- **2021-05-25** @jasnell: Ok, yeah, confirmed that the zero-byte handling issue is in c-ares. I will explore an upstream fix but it's not clear what we're going to be able to do here yet.
- **2021-06-01** @jasnell: There are two issues, each with separate resolutions.

1. For the handling of null characters in record names, the fix must be done upstream in c-ares. I have not yet identified the specific fix. If someone wants to help with this, it would be appreciated.

2. For the second issue on use of names that are returned, I think the most appropriate mitigation is a warning in the docs that applications need to verify and potentially filter the results.
- **2021-06-02** @philippjeitner: Do you have contact to the c-ares developers to resolve the issue or should i contact them?
I think the fix should be in https://github.com/c-ares/c-ares/blob/fd890e92468d54fbed82e06206a35c5f11ef1add/src/lib/ares_expand_name.c#L114 , in the same place where the special condition "\." is handled.
- **2021-06-05** @mcollina: @philippjeitner go ahead and contact the c-ares developers, keep us in the loop!
- **2021-06-11** @philippjeitner: I've contacted the c-ares developers and will notify about the outcome.
- **2021-06-14** @philippjeitner: The issue (bad decoding of zero-bytes) has been fixed in c-ares commits [44c009b](https://github.com/c-ares/c-ares/commit/44c009b8e62ea1929de68e3f438181bea469ec14) and [362f91d](https://github.com/c-ares/c-ares/commit/362f91d807d293791008cdb7616d40f7784ece83). I'm still in contact with the developer, i guess there will also be an advisory and new release at some point.
- **2021-06-14** @mcollina: Awesome news! We'll integrate asap (as soon as a release is cut)
Could you please introduce me (matteo.collina@gmail.com) in the discussion with the C-Ares maintainer so that we could coordinate a date to announce those vulns.
- **External User Joined**
- **Cve Id Added**
- **Report Severity Updated**
- **2021-08-02** @mcollina: The CVE of c-ares for this vuln is CVE-2021-3672.
- **2021-08-10** @mcollina: c-ares has been released: https://c-ares.haxx.se/changelog.html#1_17_2
- **2021-08-10** @mhdawson: @philippjeitner does this sound good for attribution:

Thank to you to Philipp Jeitner from Fraunhofer SIT for reporting this vulnerability.
- **2021-08-11** @mhdawson: Published: https://nodejs.org/en/blog/vulnerability/aug-2021-security-releases/
- **Report Resolved**
- **Agreed On Going Public**
- **Not Eligible For Bounty**
- **Report Became Public**
