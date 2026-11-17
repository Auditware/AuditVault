---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/forced-browsing
  - env/mobile
  - os/android
substate: "informative"
weakness: "Forced Browsing"
enriched: true
date: 2017-08-21
submitted: 2017-07-22T20:32:06.453Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "bagipro"
source: "https://hackerone.com/reports/252626"
title: "[Android org.torproject.android] Possible to force list of bridges"
---
# [Android org.torproject.android] Possible to force list of bridges

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Tor | **Disclosed:** 2017-08-21

- Report: [https://hackerone.com/reports/252626](https://hackerone.com/reports/252626)
- CWE: Forced Browsing
- Submitted: 2017-07-22T20:32:06.453Z

## Timeline

- **Report Filed**
- **2017-07-22** @bagipro: These settings will be picked up in service ```org.torproject.android.service.TorService```

```java
                        for (String bridgeConfigLine : str.split("\\r?\\n")) {
                            if (!TextUtils.isEmpty(bridgeConfigLine)) {
                                extraLines.append("Bridge ");
                                StringTokenizer stringTokenizer = new StringTokenizer(bridgeConfigLine, " ");
                                while (stringTokenizer.hasMoreTokens()) {
                                    extraLines.append(stringTokenizer.nextToken()).append(' '); // added here in format "Bridge xxx"
                                }
                                extraLines.append("\n");
                            }
                        }
```

and after that appended to ```/data/data/org.torproject.android/app_bin/torrc.custom```
{F205687}
- **2017-07-24** @geko: Thanks for this report. This bug bounty program does only cover Tor (the network daemon) and Tor Browser. Orbot is an application written by the Guardianproject and not the Tor Project and thus not covered by the program.
- **Report Informative**
- **Agreed On Going Public**
- **2017-07-24** @geko: Hey bagipro!
Could we coordinate the disclosure of this with the Guardianproject? I thought about writing them about the issues you reported to us trying to figure out what they want to do with them. I heard some folks will be on vacation this week but they should be able to get back to us early next week. Does that sound like a reasonable plan forward?
- **2017-07-24** @bagipro: Hi. Will I be rewarded if they consider it a high-severe issue?
- **2017-07-24** @geko: That's to say for me as I am not part of the Guardianproject and don't know how they deal with high-severe issues brought to them before going public. But I feel it might be worth finding out approaching them with the bugs you found as mentioned in my previous comment.
- **2017-07-24** @bagipro: Okay, let’s report to them and look what they say
- **2017-07-25** @geko: I just mailed them the two bug reports you submitted and will get back to you (in this ticket) once I hear back from them. Thanks.
- **2017-08-01** @geko: The Guardian Project people got back to me and wrote:

"As for supporting intents to change bridge values, this is also a feature not a bug. This is how you can scan a QR code for bridges and have it setup in Orbot. I will see if there is some particular problem with our implementation of this. " 

And 

"It is interesting that these new "instant apps" cause some drive-by hacking type vulnerabilities that weren't possible simple from going to a web page before. I need to look into that."
- **2017-08-01** @bagipro: @geko bridge can be setup without user interaction. I believe app should ask the user instead to install a bridge
- **2017-08-04** @geko: That might be an option, yes.
- **2017-08-11** @bagipro: I asked to disclose the bug, because you just closed it and didn't provide any options. Since the guys are fixing it, no any reason to disclose it :)
- **2017-08-11** @geko: I'll ask anyway whether they think that can be disclosed or at least disclosed partially. Thanks for the reminder.
- **Agreed On Going Public**
- **Report Became Public**
- **2017-08-21** @bagipro: I see that the app wasn't updated. They decided to don't apply any fixes?
- **2017-08-22** @geko: As far as I understand it they don't see it as a vulnerability at least not a critical one. However they are open to reviewing the idea that the user could get easily fooled into approving something and that the UX needs to get better for the configuration step.
