---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2021-07-21
submitted: 2021-06-15T08:44:18.137Z
bounty_usd: null
votes: 278
cve: []
program: "[[programs/bumble|Bumble]]"
reporter: "robertheaton"
source: "https://hackerone.com/reports/1234406"
title: "Exfiltrating a victim's exact location (to within 5m)"
---
# Exfiltrating a victim's exact location (to within 5m)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 278 | **Program:** Bumble | **Disclosed:** 2021-07-21

- Report: [https://hackerone.com/reports/1234406](https://hackerone.com/reports/1234406)
- CWE: Information Disclosure
- Submitted: 2021-06-15T08:44:18.137Z

## Timeline

- **Report Filed**
- **2021-06-15** @robertheaton: (I just realized I forgot to redact user and session IDs before sending you my Python code! The sessions are expired so it's not the end of the world, but if you're able to delete the file from Hackerone then I can upload a redacted version)
- **2021-06-15** @41414141: Hi @robertheaton

Thanks for the report. We'll take a look on that. 

Regards.
- **2021-06-15** @41414141: Hi @robertheaton 

Will it be possible to rewrite your script without utilising the exact victim location knowledge?

Regards
- **2021-06-16** @robertheaton: Thanks for your reply, and sure thing. In the original the "scenarios" are arbitrarily chosen (and could be anything) so we are effectively just using the victim's location as a (0,0) reference point for convenience in the code. This means that I believe the original script already doesn't rely on any exact victim location knowledge.

Nonetheless you make a good point and it's a good idea to completely wall off the knowledge of the exact location from the attacker's portion of the script. In the modified version I've submitted we only ever use `actual_victim_lat` and `actual_victim_lon` to:

* Put the victim in their location
* Print this location to our output KML

The attacker's portion of the script only ever uses `guessed_victim_lat` and `guessed_victim_lon`, which is an arbitrary point approximately 2 miles away.

The new screenshots look a few metres less accurate, which might be chance or might be something systematic about starting at a point further away. If we suspect the latter then the attacker could repeat the attack with their new, almost-exact location as their starting point, increasing precision.
- **2021-06-16** @robertheaton: I was having trouble with the H1 file upload, here are the screenshots.
- **2021-06-16** @robertheaton: Actually weirdly it still won't upload them - let me know if you would like me to email them or send them to you some other way.
- **2021-06-16** @41414141: Hi @robertheaton 

Got you. I see you uploaded main-v2-submit.py. 
We are on it, please give us some time. 

Regards.
- **2021-06-17** @41414141: Hi @robertheaton 

We are implementing fix right now, would you mind to verify our solution as soon as it will appear in production? 

Regards.
- **2021-06-17** @41414141: Would you mind to provide your user ids (I assume they are hardcoded into initial script)? 

Regards.
- **2021-06-17** @robertheaton: Yep my user IDs are in the original script. Happy to test the fix, let me know when it's live! I'm on UK time though FWIW.
- **2021-06-17** @41414141: Sure I let you know asap.

Regards.
- **2021-06-18** @41414141: Hi @robertheaton 

May I ask you to check our fix? 

Regards.
- **2021-06-18** @robertheaton: I don't *think* it's worked. I was able to relocate the victim at 10 Downing Street, as before. I tried to re-run with a different location but I accidentally jumped my user too far and hit some sort of rate or distance limit so I may need to wait an hour or 2 for that to reset. I did get another attempt that worked, although my attacker accidentally started 15 miles away which I think made it less accurate. I can give you a more precise answer in an hour or 2, but I'm pretty sure that my script still works.

(See attached screenshots)

This may be what your fix is designed to do already, but I'd consider rounding each user's position to eg. 0.1 degree of lat/lon *before* calculating the distance between them. That way it's impossible to leak any information.
- **2021-06-18** @41414141: Did you upload any screenshots in your last post? Because I don't see any. 

Let us check once again
- **2021-06-18** @41414141: Yeah we found an issue, do you mind to check once again? 

Regards.
- **2021-06-18** @robertheaton: I did upload some screenshots but I think HackerOne isn't uploading them properly!

Anyway, it looks like you're adding some randomness somewhere which means that my script doesn't work anymore! I haven't made a detailed assessment of how the randomness is implemented and whether it is vulnerable, however - I think I tripped some rate limiting again!
- **2021-06-18** @41414141: Hey 

We believe the fix we provided addressed the issue. 
JFYI - the rate limits are in place and have been there for a long time, so it's not the fix I'm referring to.
Do you mind if I leave the report open till Monday? 

Feel free to explore this or other issues within our products.

Regards.
- **2021-06-18** @robertheaton: No problem - yep I've been tripping the rate limits constantly, I can see there's some extra sauce that's just been added :).
- **2021-06-18** @41414141: Yeah indeed, we learned our lessons.
tbh that's a good catch. 
Bril!
- **Report Triaged**
- **2021-06-21** @robertheaton: Thanks! Do you reckon we'll be able to close this out today? No massive rush but always nice to tie things up :)
- **2021-06-21** @41414141: Hi 

We need to check couple more things. I’ll let you know ASAP.

Regards
- **Bounty Awarded**
- **Report Resolved**
- **2021-06-21** @robertheaton: Thanks, much appreciated! Can we disclose this report?
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Became Public**
