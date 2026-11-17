---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/classic-buffer-overflow
  - env/web
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2020-03-25
submitted: 2019-04-18T17:36:32.186Z
bounty_usd: 10000
votes: 268
cve: []
program: "[[programs/valve|Valve]]"
reporter: "hunterstanton"
source: "https://hackerone.com/reports/542180"
title: "Malformed NAV file leads to buffer overflow and code execution in Left4Dead2.exe"
---
# Malformed NAV file leads to buffer overflow and code execution in Left4Dead2.exe

> **Severity:** Critical | **Bounty:** 10,000 USD | **Votes:** 268 | **Program:** Valve | **Disclosed:** 2020-03-25

- Report: [https://hackerone.com/reports/542180](https://hackerone.com/reports/542180)
- CWE: Classic Buffer Overflow
- Submitted: 2019-04-18T17:36:32.186Z

## Timeline

- **Report Filed**
- **2019-04-19** @pieceoftoast: Hi @hunterstanton,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@pieceoftoast
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **2019-04-19** @hunterstanton: @pieceoftoast,

I'd like to add that I've just tested this on the Left4Dead 2 Dedicated Server and it works there as well. I originally could not get it working, however I believe I just had my launch arguments incorrect as I did get it working and I can confirm that the buffer overflow is present in the srcds.exe shipped with the Left4Dead 2 dedicated server on Windows as well.

Thanks,
hunterstanton
- **2019-06-18** @hunterstanton: Is there any update on this?
- **2019-07-22** @hunterstanton: Apologies for a double comment, but is there any update on this?
- **2019-07-24** @hunterstanton: @pieceoftoast,

Apologies for my triple comment but the most recent Left4Dead 2 update that shipped today fixed the bug triggered by my initial PoC. It will now throw up an error dialog about an "Engine hunk overflow" and EIP no longer is controllable, so it appears to be resolved. That said, is there any update on this one? Again I sincerely apologize for asking for updates, but it has been over 3 months since I originally reported this and it now appears to be fixed.

Thanks,
hunterstanton
- **2019-07-24** @mikela: Hi @hunterstanton, thank you very much for the excellent report and I'm sorry for the delay in responding. It looks like this fix went out in the previous L4D2 release but we missed updating this issue. 

Thank you for validating that the issue is fixed. We should get back to you regarding the closing out of this issue shortly.
- **2019-07-24** @hunterstanton: @mikela,

Thanks for getting back to me with some more info! I am happy to have made L4D2/L4D2 dedicated server more secure. I play the game myself, and it's good to know this particular hole is closed up.

Thanks,
hunterstanton
- **2019-07-30** @hunterstanton: @mikela,

I sincerely apologize for asking for updates so frequently, but is there an update on this?

Thanks,
hunterstanton
- **2019-08-02** @rubikcube: The team is still looking into this report and will update you when we have additional information to share. Thanks for your patience!
- **2019-08-02** @hunterstanton: @rubikcube,

Thank you for the update!
- **2019-08-14** @hunterstanton: I apologize again for asking for another update, but is there any word on this? It has been three weeks since Valve acknowledged the issue was resolved. Will this ever get closed out? I am beginning to think this report has been forgotten again.

Thanks,
hunterstanton
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
