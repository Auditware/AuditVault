---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/download-of-code-without-integrity-check
  - env/web
substate: "resolved"
weakness: "Download of Code Without Integrity Check"
enriched: true
body: true
date: 2021-02-09
submitted: 2020-07-29T10:18:34.275Z
bounty_usd: null
votes: 366
cve: []
program: "[[programs/yelp|Yelp]]"
reporter: "alexbirsan"
source: "https://hackerone.com/reports/946409"
title: "RCE on build server via misconfigured pip install"
---
# RCE on build server via misconfigured pip install

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 366 | **Program:** Yelp | **Disclosed:** 2021-02-09

- Report: [https://hackerone.com/reports/946409](https://hackerone.com/reports/946409)
- CWE: Download of Code Without Integrity Check
- Submitted: 2020-07-29T10:18:34.275Z

## Report summary

[Dependency Confusion: How I Hacked Into Apple, Microsoft and Dozens of Other Companies](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610?sk=991ef9a180558d25c5c6bc5081c99089)

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The following Python library has been installed on at least one Yelp owned build server directly from the public PyPI registry.

* https://pypi.org/project/yelp-cgeom/

This package should normally be downloaded from the internal Yelp registry, but a misconfiguration appears to have caused it to be downloaded from `pypi.org` instead.

This package name was previously unclaimed on PyPI. In order to detect such misconfigurations, I have uploaded my own code under the `yelp-cgeom` name.

Whenever `yelp-cgeom` is installed, my `setup.py` script is executed on the machine where it is downloaded. The script sends a callback to my server containing:

* the originating IP
* the machine's hostname
* the current working directory

To avoid breaching the program policy, no further actions are taken.

# Vulnerable machine

At `Wed jul 29 2020 04:27:23 GMT`, and again 20 seconds later, I have received the following callback:

* originating IP: `54.71.19.248`
* hostname: `10-81-21-60-uswest2bdevc.uswest2-devc.yelpcorp.com`
* home directory: `/nail/home/jenkins`
* directory: `/ephemeral/tmpdir/pip-install-o6jnSv/yelp-cgeom`

This indicates that my preinstall script was executed on the server above.

## Impact

If this package had been claimed by an attacker, this would have led to arbitrary code execution on the affected server, as well as allowing the attacker to add backdoors inside the affected project(s) during the build process.

## Timeline

- **Report Filed**
- **2020-07-29** @Yelp: Hi there!

Thanks for submitting your report to us! Please expect a response within a week.

Best,
The Yelp Security Team
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2020-07-30** @dchan: Hi @alexbirsan,

Thanks again for the report. We believe we have disabled all affected jobs. There should be no further installs of the affected packages. Our investigation is ongoing, but we did notice a couple additional installs today. We will update this ticket when we have additional information.

Thanks!
David
- **2020-07-30** @alexbirsan: Thank you for the update @dchan.

Additionally, based on the following callback information, would you be able to confirm whether this is a Google Cloud server belonging to Yelp?

* Time: `Wed Jul 29 2020 19:26:08 GMT`
* DNS IPs: `173.194.103.130,173.194.103.9,74.125.183.75,172.253.192.4` (Google)
* Installed package: `clusterman_metrics`
* Hostname: `localhost`
* Home path: `/home/travis`
* Current path: `/tmp/pip-install-jbvkab3_/clusterman-metrics`

Alex
- **2020-07-31** @calvinli: Hi @alexbirsan,

That would have been this Travis build: https://travis-ci.org/github/Yelp/Tron/jobs/712730210

(So that's a TravisCI-operated server, not ours.)

We've patched that repository: https://github.com/Yelp/Tron/commit/c3299d1304f10422715f70304ce56158ef995662


We're still working on completing remediations on internal repositories, we'll let you know once we have an update there.
- **2020-07-31** @alexbirsan: Thanks for tracking that one down @calvinli. I hadn't noticed that vulnerable command in the public repo, so I assumed all the affected repos would be private.
- **2020-08-03** @dchan: Hi @alexbirsan,

We're still remediating the issue internally and will provide updates as they become available.

Would it be possible to transfer ownership of the affected Yelp packages to our yelplabs account? 
https://pypi.org/user/yelplabs/
https://www.python.org/dev/peps/pep-0541/#how-to-request-a-name-transfer

Thanks,
David
- **2020-08-03** @alexbirsan: Hi @dchan,

Unfortunately, that is currently impossible, because PyPI itself is holding those package names and will not release them. ([see their reasoning here](https://github.com/pypa/pypi-support/issues/526))

In case you're wondering, relying on PyPI removing malicious packages is not at all an effective mitigation here. They fully rely on user reports for this, any basic attempt to hide the malicious code will make it fly under the radar. Malicious packages commonly stay undetected for months: https://www.bleepingcomputer.com/news/security/malicious-python-package-available-in-pypi-repo-for-a-year
- **2020-08-03** @dchan: Hi @alexbirsan,

Thanks for linking to the PyPi issue and the news article.

We agree that relying on PyPi to block / remove malicious packages isn't a scalable or maintainable approach. We will contact PyPi if we plan on using one of the blocked package names in the future.

David
- **2020-09-09** @alexbirsan: Hello,

Seeing as this type of vulnerability is rather new, not well-documented publicly, and quite critical, I am currently working on an article / blog post about my recent findings related to dependency management. You can consider this an early warning for public disclosure, but rest assured that I will not be publishing anything before a full fix is confirmed from your side.

In order to get a better understanding of dependency confusion issues, and to be able to publish accurate information, I would like you to answer a few questions. Please feel free to make the answers as detailed or as vague as you feel comfortable. "No comment" is a valid answer too :)


1. Would you be able to describe the root cause(s) of the specific vulnerability in this report? Was this a simple misuse of `--extra-index-url`, or something else entirely?

2. Have you discovered any variants or similar bugs during your internal investigation?

3. How did you end up fixing this behavior? Can you share any general mitigation/prevention advice?

4. Anything else you would like me to mention?


Thank you,
Alex
- **Bounty Awarded**
- **2020-09-11** @alexbirsan: Thank you for the generous reward!

I am currently aiming for mid-October, but there are still pending fix confirmations and responses from multiple affected companies, and I'd like to give them all a chance to prepare before publishing my research.

Alex
- **2020-09-25** @aaronloo: Hi Alex,

Yes, that’s accurate: the root cause of this specific vulnerability was that a subset of our services did not explicitly declare that they should fetch packages from our internal PyPi. We were able to mitigate this through pushing a change to configure the default index-server for PyPi at /etc/pip.conf in our Docker images, so that developers would need to explicitly fetch from the public index-server if desired.

We were able to work with our core teams and patch the immediate vulnerability within a day. We were also able to quickly identify erroneous traffic and non-conforming services through our telemetry systems across our hosts. Finally, we will be continuing to develop tooling and alerts to mitigate this set of supply chain attacks in the future.

Thank you for bringing this to our attention, and cooperating with us as we addressed this vulnerability.

Best,
The Yelp Security Team
- **Report Resolved**
- **2020-11-19** @alexbirsan: Hello @aaronloo @dchan,

Part of my research into dependency management is also focusing on NPM (node.js) packages. I have been using a similar technique to test these, and I have noticed the following callbacks today:

* package name: `yelp-js-infra` (https://www.npmjs.com/package/yelp-js-infra)
* external IP: `13.56.89.128`
* hostnames: `dev141-uswest1adevc`, `dev125-uswest1adevc`
* paths: `/nail/home/nchica/pg/hackathon/b2w/node_modules/yelp-js-infra`, `/nail/home/nlohana/mentor-mentee-matching/node_modules/yelp-js-infra`

Would you consider this a separate vulnerability? Please let me know if you would like me to submit a separate report.

Best regards,
Alex
- **2021-01-16** @alexbirsan: Hello and Happy New Year!

I am contacting you to let you know that a blog post about the type of attack in this report (dependency confusion) is due to be released soon. The post is currently scheduled for February 9th, but further delays may happen. (If you would like to be kept in the loop regarding the exact release date, please let me know)

Some information relevant to this report will be mentioned in the post, as outlined below.

* Yelp will be briefly mentioned as an affected company, with no further details
* the general `--extra-index-url` technique will be described without sharing any specifics from this report

If you have any concerns, requests for clarification, or anything else you would like me to mention, please reply to this message **before February 2nd**. If you agree with the details above being published, no further action is required.

Thank you for working with me to help raise awareness about this type of vulnerability.

Alex
- **2021-01-22** @dpopes: Hi Alex,

Thanks for the update. We will let you know by February 2nd if we have any concerns, clarifications etc. 

Unrelated to your blog post about python dependency confusion, I'd like to ask you about the npm packages that you claimed on npmjs.com. The packages we know that you claimed on npmjs.com include:

* yelp-js-infra
* yelp-bunsen-logger-js
* yelp_sitrep

Could you let us know how you identified those package names? As far as I'm aware, these packages are not referenced in any dependencies of open source projects or Yelp blog posts etc. 

Best,
The Yelp Security Team
- **2021-01-22** @alexbirsan: Hello @dpopes,

These names can be found inside javascript files, such as:

https://s3-media0.fl.yelpcdn.com/assets/public/module_biz_claim_pages_landing.yji-d31b8f13a3e9d210d83f.js

Just to clarify, the npm side of things and this method of finding package names within javascript files will also be covered in the post.

Also, after having a look at the file again, I believe it is a perfect and clear example illustrating leaked internal package names, and I would like to add a screenshot of the javascript file linked above to my post (something along the lines of the attached picture). I believe this is highly unlikely to pose any additional risk, as I have already claimed all the package names in it -- I can even transfer ownership of the packages to you if you'd like.

Alex
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-02-09** @dpopes: > I can even transfer ownership of the packages to you if you'd like.

@alexbirsan thanks! I'll take you up on your offer. Can you transfer them to https://www.npmjs.com/~dpopes at your earliest convenience?

Best,
The Yelp Security Team
- **2021-02-09** @alexbirsan: Hi @dpopes,

I've added you as a maintainer to all the packages in the screenshot. If you see any others I may have missed, please let me know.

And thank you for accepting full disclosure here, I hope the contents of this report are helpful to other members of the community :)

Alex
