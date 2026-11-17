---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cryptographic-issues-generic
  - env/web
substate: "resolved"
weakness: "Cryptographic Issues - Generic"
enriched: true
date: 2019-12-13
submitted: 2019-03-05T03:05:54.116Z
bounty_usd: 280
votes: 9
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "jlleitschuh"
source: "https://hackerone.com/reports/505007"
title: "[Twitter Open Source] Releases were & are built/executed/tested/released in the context of insecure/untrusted code"
---
# [Twitter Open Source] Releases were & are built/executed/tested/released in the context of insecure/untrusted code

> **Severity:** High | **Bounty:** 280 USD | **Votes:** 9 | **Program:** X / xAI | **Disclosed:** 2019-12-13

- Report: [https://hackerone.com/reports/505007](https://hackerone.com/reports/505007)
- CWE: Cryptographic Issues - Generic
- Submitted: 2019-03-05T03:05:54.116Z

## Timeline

- **Report Filed**
- **2019-03-07** @bugtriage-alex: Thank you for your report @jlleitschuh.

We are evaluating the behavior that you described and will get back to you when we have more information.

Thank you for thinking of Twitter security.
- **Report Triaged**
- **Bounty Awarded**
- **2019-03-15** @jlleitschuh: > While this is not normally an inscope target for the program, we are accepting it in this case.

That is incredibly generous, thank you!

> As a reminder, please remember to keep the details of this report private until we have fully investigated and addressed the issue.

As a fair warning, this is what I've been telling the other security teams I've been in contact with about the public disclosure timeline:

> In line with the [Google Disclosure policy](https://www.google.com/about/appsecurity/) (again, I'm not an employee of Google), if all the security teams that I've reported this to don't have fixes after 90 days from initial disclosure, I plan to go public then. If all of the security teams that I've reported this to have fixed before then, I'll go public sooner. I'm more than happy to keep you and your team in the loop on this so we can coordinate publications. 
> 
> However, If any of the organizations that I've been in contact with finds evidence of malicious compromise in their artifacts, I'll need to push the deadline to a 7-day disclosure window and inform all the parties involved. If this vulnerability is being actively exploited maliciously it means it has become a Zero-Day.

I'm currently coordinating the public disclosure of this vulnerability with at least two other organizations (coordinated CVE and blog post releases).

## Larger Scala & SBT Ecosystem

As Twitter is a large corporate entity that heavily relies upon SBT/Scala, I'm going to rope you in a bit more on the larger industry issue I'm encountering.

I've been in contact with [Lightbend](https://www.lightbend.com/scala)'s security team. Lightbend is  the corporate entity backing Scala and SBT. I've informed them that the builds for SBT core, several official SBT plugins, and a few of the Scala core libraries are vulnerable to this.

Lightbend's security team has acknowledged the vulnerability and said that they will work on fixing it. However, they don't have the resources to audit previous releases to see if any of them were maliciously compromised.

This is from the Lightbend security team:
> I don't think auditing all previous releases is necessary, not without any evidence that we may have been targeted.
> We're a small company whose teams are already very stretched - we don't even have a full time team working on sbt. We need to spend our resources wisely, and doing an audit with no evidence that it's necessary is not feasible for us.

Given that some of these projects are used to build or are dependencies of the Scala compiler if any of these previous artifacts were compromised, they could have been used to maliciously compromise a previous compiler in such a way that the only way to detect the compromise is to audit the bytecode in the compiler. Such an attack could be used to compromise future compilers.
This is called the "Trusting Trust" attack:
https://www.archive.ece.cmu.edu/~ganger/712.fall02/papers/p761-thompson.pdf

During the Snowden Revelations, we learned about project Strawhorse, a CIA project to malicious compromise the XCode compiler: https://edwardsnowden.com/2015/03/10/strawhorse-attacking-the-macos-and-ios-software-development-kit/

We've also seen that a malicious version of the XCode compiler was created by Chinese hackers.
https://en.wikipedia.org/wiki/XcodeGhost

My point is that this isn't outside the realm of possibility, nor the capability of large state actors (or a malicious ISP).

## Plea to Twitter

I'm a single researcher doing this research as a part time project while also working a full time job.

I also don't have the resources to perform audits of previous releases of SBT and Scala's compiler. If the Twitter security team thinks that the possibility of compromise for SBT or the Scala Compiler is a valid concern, it would be incredible if Twitter could invest the resources to validate that SBT and the Scala compiler haven't been maliciously compromised by this attack vector.

If there is interest, I'm happy to CC someone from the Twitter security team into the ongoing email conversation I'm having with Lightbend.

If this is beyond what Twitter is capable of supporting, I also understand. I just feel like I have a moral obligation to ask for assistance with a problem that I can't solve alone.
- **2019-04-02** @jlleitschuh: Just wanted to check in to see if the Twitter Security team had any updates.

I just want to give you a heads up that, barring any show-stopping incidents, I plan to go public with this story about this industry-wide vulnerability on June 10th, 2019 or as close to that as possible.

Thanks,
Jonathan Leitschuh
- **2019-04-29** @jlleitschuh: Hi all,

Just checking in on the progress resolving this issue fully across twitter.

For example, joauth hasn't been resolved yet:

- https://github.com/twitter/joauth/blob/b4f6afb6be79ecb0bb8d04c76b17cfa51de4ffab/project/plugins/Plugins.scala#L10-L16

Also, will the Twitter security team handle filing for the CVE numbers for these projects or should I do that once this issue is resolved?
- **2019-04-29** @aarun: @jlleitschuh  - Hi! While going through our repository, we found more instances of this issue in our private repository and are currently still in the process of remediating them along with the ones outlined in this report. We'll get back to you as soon as the internal team finishes the fixes
- **2019-04-29** @jlleitschuh: Thanks for the update!

Just a friendly reminder about the June 10th, 2019 public disclosure.

Since this investigation has spanned far wider than just Twitter and involves external parties who are coordinating their own publications about the issue, changing that disclosure date at this point would be difficult.

RE my "Plea to Twitter" has there been any discussion in this area with respect to SBT? If the answer is simply "we don't have the time/resources", I totally understand.

Thanks!
- **2019-05-02** @jlleitschuh: Hi @aarun,

I just wanted to update you about a tool that was just made public by the Pivotal team.

https://github.com/spring-io/nohttp

The goal of the tool is to automatically go through all of your build infrastructure to update your repositories from HTTP to HTTPS.

They developed this tool after I responsibly disclosed this vulnerability in a huge swath of their open source projects (these details are embargoed until June 10th, 2019).
- **2019-05-03** @jlleitschuh: Hey @aarun,

Can I make a further request of the Twitter Security team?

I'm working on an initiative with Sonatype (Maven Central), JFrog (JCenter), Pivotal (Spring), JetBrains, RedHat, & Eclipse to try to stamp out this industry wide vulnerability.

Twitter offers an artifact server at: https://maven.twttr.com

As you can see from this search of GitHub, over ~3,000 projects are using this artifact server insecurely over HTTP by Twitter.

 - SBT: ~2k - https://github.com/search?l=Scala&q=http%3A%2F%2Fmaven.twttr.com&type=Code
 - Maven: ~700 - https://github.com/search?l=Maven+POM&q=http%3A%2F%2Fmaven.twttr.com&type=Code
 - Gradle: ~120 - https://github.com/search?l=Gradle&q=http%3A%2F%2Fmaven.twttr.com&type=Code

Currently, requests to http://maven.twttr.com redirect to https://maven.twttr.com but this redirect leaves projects vulnerable to a malicious MITM via a downgrade attack.

What I've been asking all of these organizations to do is to deprecate serving artifacts over HTTP by January 15th, 2020. So far, my initiative is bearing fruit, and the first organization will be announcing their depreciation plans on Monday.

Can I count on Twitter to join this initiative?

Thanks,
Jonathan Leitschuh
- **2019-05-03** @aarun: @jlleitschuh -  I've conveyed your requests to the team that has ownership over this issue, and will get back to you when they give me an answer :)
- **2019-06-07** @jlleitschuh: Hi Twitter,

Below is a link to the draft of the article that I will be publishing on June 10th.
https://medium.com/@jonathan.leitschuh/want-to-take-over-the-java-ecosystem-all-you-need-is-a-mitm-1fc329d898fb

Thanks,
Jonathan Leitschuh
- **2019-06-10** @jlleitschuh: Hi @aarun,

The full details about the scope of this vulnerability are now public here: [Want to take over the Java ecosystem? All you need is a MITM!](https://medium.com/@jonathan.leitschuh/want-to-take-over-the-java-ecosystem-all-you-need-is-a-mitm-1fc329d898fb?source=friends_link&sk=3c99970c55a899ad9ef41f126efcde0e)
- **2019-07-16** @jlleitschuh: Hi Twitter,
What is the current status of the resolution of this vulnerability?

Cheers,
Jonathan Leitschuh
(The Zoom Guy 😂)
- **2019-09-09** @jlleitschuh: Hi @aarun,
Just checking in to see what the status of this is. Has it been resolved? I'd love to disclose this but it can't be until it's closed.
Cheers,
Jonathan Leitschuh
- **2019-09-11** @jlleitschuh: Hi @aarun,

Did you ever hear back from the team managing http://maven.twttr.com ?

This is the Sonatype announcement about formally deprecating the use of HTTP to resolve dependencies.
https://central.sonatype.org/articles/2019/Apr/30/http-access-to-repo1mavenorg-and-repomavenapacheorg-is-being-deprecated/

I'm currently working on creating the release notes for Gradle 6.0 where we are formally performing this deprecation inside of Gradle. If you are planning on doing the same, we'd love to link to a blog post about your announcing doing this.

Cheers,
Jonathan Leitschuh
- **Hacker Requested Mediation**
- **2019-09-20** @andrewsorensen: Hi @jlleitschuh,

We're still working on a fix for this across all our repositories. As you can imagine, due to the number of open source assets we have, this is a considerably large project. Since I'm not driving this effort directly, I can't comment on whether we'll be able to participate in this timeline, but I'll see if we can get an answer for you.

Re disclosure, we can work out the details - what timeline are you looking for?

Thanks for thinking of Twitter security!
- **2019-09-20** @jlleitschuh: Hey @andrewsorensen,

Technically, this has already been disclosed publicly against your repositories.

> Other projects this vulnerability was discovered in include Grails, the Scala module for FasterJacksonXML & Ehcache3. Additionally, I found this vulnerability in the Open Source projects of Netflix, Google, **Twitter**, the National Security Agency (NSA), Stripe, Gluon (Scene Builder) PortSwigger, Black Duck, Snyk, LinkedIn, and PayPal. Ironically, when this was reported to PayPal’s security team, they closed it as they consider MITM attacks ‘out of scope’ for their HackerOne program.

I was hoping sometime in the next two weeks given that all the information is already public.

If you want the official Twitter announcement to be added to the Gradle release notes for Gradle 6.0 you are probably going to need to get that announcement published by next Friday or, at the latest, the following Monday.

Just a heads up, you need to fix these in all your repositories by January 15th, 2020 at the latest or your builds are going to start breaking. Here are the announcements for that:
 
https://gist.github.com/JLLeitschuh/789e49e3d34092a005031a0a1880af99

Cheers,
Jonathan Leitschuh
- **Report Resolved**
- **2019-11-20** @jlleitschuh: Hi @aarun,

Will the twitter security team be handling getting CVE numbers assigned for these vulnerabilities?

Also, any follow up on the formal drop of support of HTTP for the twitter artifact server?
It would be awesome to add Twitter to the list of organizations that are participating in this initiative:
https://gist.github.com/JLLeitschuh/789e49e3d34092a005031a0a1880af99

Cheers!
Jonathan
- **Agreed On Going Public**
- **2019-12-10** @jlleitschuh: Disclosure was requested 20 days ago. Any updates?

Any follow up with respect to the decommissioning of HTTP?
- **Agreed On Going Public**
- **Report Became Public**
