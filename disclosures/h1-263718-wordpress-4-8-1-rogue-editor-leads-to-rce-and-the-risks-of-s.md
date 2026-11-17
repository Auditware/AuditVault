---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/wordpress
substate: "informative"
weakness: null
enriched: true
date: 2017-10-04
submitted: 2017-08-27T01:55:26.996Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "skansing"
source: "https://hackerone.com/reports/263718"
title: "Wordpress 4.8.1 - Rogue editor leads to RCE. And the risks of same origin frame scripting in general"
---
# Wordpress 4.8.1 - Rogue editor leads to RCE. And the risks of same origin frame scripting in general

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** WordPress | **Disclosed:** 2017-10-04

- Report: [https://hackerone.com/reports/263718](https://hackerone.com/reports/263718)
- CWE: N/A
- Submitted: 2017-08-27T01:55:26.996Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Informative**
- **2017-09-06** @skansing: Hi @johnbillion ,

Thanks for reviewing this bug. I knew at the time of the writting that this was a known feature (unfilted_html) that you also get a lot of noise in on, dublicates etc, but thought a *clear RCE chain* would help asses this at a proper severity. 

The two links provided does not really have a proper security angle on it and hence are really useless to educate or handle the problem at hand.

Also my point on "X-Frame-Option" was not a suggestion to implement it, it was to point out that It would not migrate the problem completely as the attacker can do cross frame scripting from tab to tab via window.open.

It is nowhere known for consumers of WP that adding a editor is a open portal to RCE and *the dangers are down played* in the docs such as https://codex.wordpress.org/Hardening_WordPress , concepts such as "Least Privilege Principle" and "Defense in Depth" falls apart in light of such vector. I also read (cant find it know) a area that leaves the user the impression that the XSS from a editor cant do any really damage (which is ofc wrong (= )

When unfiltered html means RCE in 6 lines of JS then this is something consumers should be aware of and which  wp shouldnt neglect/accept in a time where a WP RCE pays 50.000 $ at zerodium. 



Let make this public, this way consumers have reference that role editor or anything that gives unfiltered_html is stone throw away from a RCE. This would also give new bug hunters the possibility to escalate to RCE on any XSS. 

So any XSS bug would be same bounty/severity as https://hackerone.com/reports/149589 I would presume, as the entry level is easier but the severity is harder.
- **Agreed On Going Public**
- **2017-09-06** @skansing: ```
If you are running security tests against WordPress, use a lesser privileged user so that all content is filtered. If you
 are concerned about an Administrator putting XSS into content and stealing cookies, note that all cookies are
 marked for HTTP only delivery, and are divided into privileged cookies used for admin pages, and unprivileged
 cookies used for public facing pages. Content is never displayed unfiltered within the admin dashboard. Regardless,
 an Administrator has wide-ranging super powers, among which unfiltered HTML is a lesser one.
```

Notice how this text misinforms the dangers of unfiltered html and XSS in general.  And we are really concerned with the *editor*, not a administrator. With the POC chain explained, the attacker can do anything in lieu of the victim, there is no need for the attacker to get their cookies or etc, they can perform an attack as the payload trigger that bypass any need for stealing cookies/sessions.
- **2017-09-06** @skansing: An example of a report which was deemed low severity but could have lead to a RCE (https://hackerone.com/reports/253313) could easily have been escalated to RCE as the XSS has a lot higher impact than described. From the docs and reports (severity given / impact given in bounties) I would say most are not aware of this.
- **Agreed On Going Public**
- **Report Became Public**
