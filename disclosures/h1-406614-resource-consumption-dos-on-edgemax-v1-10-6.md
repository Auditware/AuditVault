---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2019-08-04
submitted: 2018-09-06T21:13:32.532Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/ui|Ubiquiti Inc.]]"
reporter: "grampae"
source: "https://hackerone.com/reports/406614"
title: "Resource Consumption DOS on Edgemax v1.10.6"
---
# Resource Consumption DOS on Edgemax v1.10.6

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Ubiquiti Inc. | **Disclosed:** 2019-08-04

- Report: [https://hackerone.com/reports/406614](https://hackerone.com/reports/406614)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2018-09-06T21:13:32.532Z

## Timeline

- **Report Filed**
- **Report Informative**
- **2018-09-07** @grampae: Hi joystick, I had asked ubnt-rubens if I should submit this and I was told that I should.
- **2018-09-07** @grampae: Could you invite ubnt-rubens to the report to take a look?  Thanks!
- **Report Reopened**
- **Report Needs More Info**
- **Report New**
- **2018-09-09** @grampae: Hi @ubnt-rubens , hope your weekend is going well.

A little bit about the setup I used in the attached video.  First I attached a synology diskstation to the edgerouter x, and made it get an ip address by dhcp through the edgerouter.  Then as shown in the video I showed an active web connection to the edgerouter and diskstation.  The video shows the /run mount already at 50% and the var/log mount being actively filled with error logs.  I also show an active ssh connection to the edgerouter.  As time goes on in the video the active ssh connection becomes more and more sluggish until it is non responsive.  I can also not create a new ssh connection to the device.

In the video you will see that the diskstation and edgerouter web access becomes non responsive, at this time I unplugged the diskstation, waited a minute, and plugged it back in to see if the dhcp server was still actively handing out ip addresses.  no such luck, as you will see by my nmap scan which only shows the 192.168.1.1 (edgerouter), before that nmap would see the diskstation every time.  

So according to the nmap scan, it still shows, dns, dhcp, http, https as open ports.  As far as them actually working and returning data to requests.  that appears to break with this DOS.  

Let me know if you require more information.

Thanks!
- **2018-09-10** @ubnt-rubens: Thanks @grampae, I was able to reproduce, I believe it was my mistake, I probably didn't let the `/var/log` use to increase enough.

I'll consult with the DEVs about it, and give you a final response soon.
- **Report Triaged**
- **2018-09-10** @grampae: Thanks @ubnt-rubens  let me know if I can be of further help.
- **Report Severity Updated**
- **2018-09-10** @ubnt-rubens: @grampae Just something that I found: the router goes back to normal eventually, the stale sessions are deleted after a few minutes.
- **2018-09-10** @grampae: That is good news!  I think when I was testing it I had let the intruder session run in the background so I didn't notice.
- **Bounty Awarded**
- **2018-09-11** @grampae: Thanks!  Is this going to be fixed in the next firmware update or is a patch being made?
- **2018-09-11** @ubnt-rubens: Very likely will fixed in the next firmware release.
- **2018-09-16** @grampae: Hey I had a question, I wanted to do a write-up on this find.  I realize that I cannot disclose anything related to ubiquiti which is fine.  Would you prefer I show you a copy of the write up prior to release or are you fine if I just redact anything and everything that could be linked back to ubiquiti?  Let me know and thanks again!
- **2018-09-17** @ubnt-rubens: Hi @grampae, we will allow a partial-disclose in HackerOne one month after the problem is fixed, one month after that (two months after fixed) you can publish this finding.

Just let us review the content first.
- **2018-11-15** @grampae: hello all, just curious if this has been addressed in a firmware update yet.  i didn't notice anything in the changelog for October's firmware update.  thanks!
- **2018-11-20** @ubnt-rubens: Hi @grampae, This was not fixed yet in ERX, although this was mitigated in other models.
- **2019-01-11** @grampae: Thank you for the reply.  Do you know when this will be patched in the erx?
- **2019-01-14** @ubnt-rubens: Hi @grampae, the fix was not release in the version `2.0.0`, we are working to include the fix in future releases.
- **2019-05-07** @grampae: Hi @ubnt-rubens I realize that 2.0.1 was recalled however I was looking at the release notes (https://community.ubnt.com/t5/EdgeMAX-Updates-Blog/EdgeMAX-EdgeRouter-software-release-v2-0-1/ba-p/2730978) and I was curious if the section mentioning
[Logging] - Set 2Mb systemd log file limit on ER-X/ER-X-SFP/EP-R6
was in reference to this vulnerability as after /var/run/beaker/container_file/ fills up /var/log starts to fill up.
- **2019-05-14** @ubnt-rubens: Hi @grampae, this release don't fix the problem fully. Thanks
- **2019-05-30** @grampae: I hate to ask but it apoears from the changelog in this release 2.0.3 that this issue has been fixed.  Is this correct?  If so please.close.

https://community.ubnt.com/t5/EdgeMAX-Updates-Blog/New-EdgeRouter-firmware-2-0-3-has-been-released/ba-p/2799650
- **2019-05-30** @grampae: Specifically this item in the changelog:
[WebGUI] - Fix bug that caused WebGUI/UNMS to become inactive if aggressive network scanners opens lots of unauthorized sessions
- **Report Resolved**
- **2019-06-04** @grampae: Thanks @ubnt-rubens it was a pleasure!
- **Agreed On Going Public**
- **Report Became Public**
