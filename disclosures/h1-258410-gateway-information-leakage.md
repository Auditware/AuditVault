---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privacy-violation
  - env/network
  - vuln/info-disclosure
substate: "resolved"
weakness: "Privacy Violation"
enriched: true
body: true
date: 2019-07-30
submitted: 2017-08-09T20:52:01.353Z
bounty_usd: null
votes: 43
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "hackerfactor"
source: "https://hackerone.com/reports/258410"
title: "Gateway information leakage"
---
# Gateway information leakage

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-07-30

- Report: [https://hackerone.com/reports/258410](https://hackerone.com/reports/258410)
- CWE: Privacy Violation
- Submitted: 2017-08-09T20:52:01.353Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Many DoD systems use BlueCoat gateways. These gateways insert unique BlueCoat ids that permit tracking DoD users and gaining insight into the DoD network architecture when DoD users access the Internet.

**Description:**
I run a popular web service (FotoForensics.com -- it's around 150,000 in the Alexa list of top web sites).  My public web site is explicitly for research and gets visitors from all over, including from the DoD.  One of the research project collects non-standard HTTP headers.  The BlueCoat HTTP headers immediately stood out as non-standard.

Someone with a BlueCoat gateway will have headers that look like:

> POST /upload-file.php HTTP/1.1
> Host: www.fotoforensics.com
> Content-Length: 70869
> Cache-Control: max-age=0
> Origin: http://www.fotoforensics.com
> Upgrade-Insecure-Requests: 1
> User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36
> Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryPaSgeQQ5m6kh7aaZ
> Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
> Referer: http://www.fotoforensics.com/
> Accept-Language: en-█████████,en;q=0.8
> ██████████: ██████ (███) SC
> Connection: Keep-Alive
> █████████: █████████

(This example came from a user at the United States Patent and Trademark Office.)

The id found on the "██████████" line is unique to the Bluecoat device; it is not unique to the user. However, if this ID ever shows up at a different network address, then it permits a remote (outside of DoD) system to identify associated network addresses, multiple proxy exits, and potentially non-attributable networks. Similarly, if a single IP address is associated with multiple Bluecoat ids, then it denotes a single exit proxy and identifies the (minimum) number of subnets that use the proxy.

For example:

> █████████
> ██████
> ██████████
> █████████
> ████████
> ██████
> ██████████

My server has seen this one IP address associated with 7 different Bluecoat devices.

> ███
> ████
> █████████
> ██████████

This single bluecoat ID has been linked to four different network addresses.

> ███
> ████████

This bluecoat id (████) is interesting because it has been seen on two very different subnets.

> █████████
> ███

This bluecoat ID moved locations: it was seen in████ and in/near ███████. (Imagine what it could tell an observer if it were to suddenly appear in █████████...)

I have currently collected 243 bluecoat IDs associated with "████████". In addition, I've collected 120 bluecoat IDs from the █████████ Group, 71 ids from the "Headquarters, ██████████AISC", and ids from many other government organizations.

For example:
> ██████
> ███
> █████
> █████
> █████

This one bluecoat id has been observed with both the Department of the Interior and with ██████████GS. The first 3 ip addresses have hostnames that say "usgs.gov", but the others either lack hostnames or are from the national parks service (nps.gov). And this one id is from 5 IP addresses that span 4 different subnets.

## Impact
DoD uses Bluecoat gateways with unique IDs enabled. The unique IDs are supposed to prevent proxy forwarding loops between Bluecoat devices. However, they permit external observers from (1) determining that a Bluecoat device is in use, (2) tracking the device, and (3) gaining insight into the DoD network architecture.

When combined with user-agent strings and other distinct and unique identifiers, this combination of ID and IP address permits determining who likely works with whom.

(Let me know if you want the full list for DoD bluecoat devices. And if you want them for other ██████ Gov/Mil groups, let me know.)

## Suggested Mitigation/Remediation Actions
It varies by Bluecoat device, but buried in each system's configuration menu is an option to disable the unique ID. These should be disabled everywhere.

## Timeline

- **Report Filed**
- **2017-08-09** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Triaged**
- **2017-08-11** @hackerfactor: Thank you.  Let me know what else you need.
- **Report Severity Updated**
- **Report Severity Updated**
- **2018-04-07** @hackerfactor: It's been 8 months. Is there any update on this issue?
- **Report Needs More Info**
- **Report New**
- **2018-09-01** @hackerfactor: You asked for an endpoint to interact with.  How about: http://fotoforensics.com/tutorial-malware.php

This is my tutorial on how to detect malware-infected browsers via passive HTTP header inspection.  It includes a dump of the HTTP header that your browser sent to my server.  If you leak the bluecoat id, it will appear in the list as an HTTP X-Bluecoat-Id header.
- **2018-09-04** @ag3nt-j1: @hackerfactor thanks for the additional information, love your site by the way.  Could have used it a few months ago when I was looking for something to quickly get to exif data rather than the CLI tool in Kali.  So your report is unique as you gather the information disclosure from your server logs from DoD and ███G endpoints.  We're all back from the holiday weekend here and I will be discussing with the director on how best to address this.  As this is a misconfiguration with the Bluecoat from many sites including those within the ██████G and DoD I am not real sure how we are going to proceed.  Similar issues we've pushed up to an enterprise level for the system owners to make their own determiniations.  As this type of finding is outside of our scope there isn't much more we can do.  Give me a few days and I'll get a response back to you.
- **2018-09-17** @ag3nt-j7: @ag3nt-j1 ware we keeping this open
- **2018-09-18** @hackerfactor: Thanks. Let me know if you need anything else.
- **2018-12-19** @agent-0g: @ag3nt-j1 How do you want to proceed on this report?
- **2018-12-19** @hackerfactor: This bug report was marked as "high" by DoD, and hasn't been acted on in over a year. I don't mind writing it up publicly on my blog. But if you're going to fix it, or send out notices to every impacted group so they can deal with it, then I'll give you more time.

Last I heard (from Sep 17) was that DoD wanted to keep this bug open. However, I haven't seen anything to tell me that the DoD has acted on this issue.

I guess the real question is: How would DoD like to proceed?
A few options:

1. Pay me the bounty and you own the bug.

2. Send notices out to all DoD branches (and preferably all gov sysadmins) and give them time to address it. I can even send you a large list of ████ Gov IP-to-Bluecoat mappings.

3. Close it out as no fix and I blog about it. If I blog, I will be very detailed, with IP and bluecoat ID mappings. But I would do DoD as well as lots of foreign nations. E.g., I have a collection of Iranian bluecoat IDs. You can tell when an IP is from an Iranian gov user because they DO NOT have bluecoat IDs. (Iranian citizens go through Bluecoat; Iranian govies do not.)

I'm open to other options, if you have suggestions.

If I blog about it, then lots of admins will learn about it very quickly. Given the time of year, I'd probably blog about it as my 1st or 2nd blog entry of 2019. (IMHO, it's not polite to make everyone panic right before they head off for the holidays.)

How would you like to proceed on this report?
- **Report Triaged**
- **2019-01-04** @mrconfidential: Hey @hackerfactor,

Thank you for participating in the DoD Vulnerability Disclosure Program. My name is Jon Bottarini and I work with the Customer Success team here at HackerOne. It was brought to our attention that you were asking for a bounty for this submission, however **this is not a bug bounty program** where hackers are rewarded with a bounty for their submission.

As highlighted on The Department of Defense's policy, you will need to get written consent in order to publicly disclose the details of any vulnerabilities:

> However, public disclosure of vulnerabilities will only be authorized at the express written consent of DoD.

I apologize for the inconvenience and we hope to see more submissions from you in the future. If you have any questions or concerns about this policy, you can reach out to me here or via my email: jon@hackerone.com 

Thank you
- **2019-01-04** @hackerfactor: @ag3nt-j1 Thank you. Just as long as it isn't dropped, I don't mind.

@mrconfidential I didn't realize that it wasn't a bug bounty program. I'll still give them time to inform their people who are vulnerable. However, since they have repeatedly stated that this is out of their scope, I don't see the need to wait for written approval. I'm giving them time as a professional courtesy. But approaching 2 years seems like a lot of time, regardless of the vendor.
- **Report Needs More Info**
- **Report New**
- **2019-01-17** @hackerfactor: Hello @ag3nt-j1,

I found a few more.  My search missed an ASN for the United States Coast Guard. I also did a search for any ████████ Gov-related bluecoat ID has has appeared on any non-Gov networks. This identified some CenturyLink and Level3 addresses.  For example:

████████
███████
███

The same bluecoat device is associated with a DoD network address as well as CenturyLink and Level 3.  The new list only shows the non-DoD address, but you can grep the bluecoat ID in the first list and find the Gov network. (I guess I just blew someone's non-attrib network.)
- **2019-01-18** @ag3nt-j1: Thanks, just finished carving up the data and will be kicking this report over to the next org that needs to address this issue.
- **Report Triaged**
- **Report Resolved**
- **2019-02-05** @hackerfactor: Thank you, @ag3nt-j1.  I would like to blog about the vulnerability (not the █████████ gov portion; I want to call out the some Russian companies, Symantec, Microsoft, and a bunch of others). But I'd like to give the remaining gov groups time to resolve their issues.

Do you think 2 months (April) is enough time?
- **2019-02-06** @ag3nt-j1: Probably sooner I'd think as this fix will take time to propagate within the DoD and ███G isn't in scope of this program.  Though if you want to submit a similar for ██████████G assests, report to https://www.us-cert.gov/forms/report.  I'd suspect it'll take awhile to trickle through the system on that end as well.  Let me follow up with you on any additional details, pretty sure if you don't disclose any sensitive info (IPs, hostnames, etc) should be ok but I want to make sure of a few other details.  I'm also going to put this report into a disclose status, will take me some time to do the redactions and have the attachments removed...additionally when you blog about this we'd be happy to retweet it over here on the VDP twitter.  Give me a week or so, have a few items queued up in the disclose bucket.
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2019-02-07** @hackerfactor: Thank you. I'll wait. :-)
- **2019-07-08** @hackerfactor: I still haven't received a response about making this public. I would like to make this public either this month (July) or next month (August).
- **2019-07-08** @ag3nt-j1: I'm going to put in a request to H1 right now to have the attachments and some of the larger bodies of IP and AS numbers redacted.  Then I'll go in and touch up as needed before I disclose.  You're report (among several others) have been on my list to disclose but had to put the requests on the back burner.  Expect this to be completed by the end of the week or earlier.  When you make your blog post let us know and we'll tweet it out as well.  Sorry to have been keeping waiting on this.
- **2019-07-12** @ag3nt-j1: @hackerfactor we're ready to disclosure the report.  Could you please request the disclosure again in the dropdown?
- **2019-07-21** @hackerfactor: I don't mind the redactions, but it needs to be done consistently. In the initial description's HTTP header, the values for the "███" and "███████" needs to be redacted. (And I have no idea why you redacted the "Accept-Language" field, but it doesn't matter.)
- **Agreed On Going Public**
- **Manually Disclosed**
