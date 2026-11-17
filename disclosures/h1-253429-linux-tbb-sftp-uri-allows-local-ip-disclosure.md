---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - os/linux
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2017-10-25
submitted: 2017-07-26T02:31:31.667Z
bounty_usd: 3000
votes: 71
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "rethink5807"
source: "https://hackerone.com/reports/253429"
title: "Linux TBB SFTP URI allows local IP disclosure"
---
# Linux TBB SFTP URI allows local IP disclosure

> **Severity:** Critical | **Bounty:** 3,000 USD | **Votes:** 71 | **Program:** Tor | **Disclosed:** 2017-10-25

- Report: [https://hackerone.com/reports/253429](https://hackerone.com/reports/253429)
- CWE: Information Disclosure
- Submitted: 2017-07-26T02:31:31.667Z

## Timeline

- **Report Filed**
- **2017-07-26** @rethink5807: To be clear, instead of local IP disclosure, this should just be disclosure of real IP address.
- **2017-07-26** @geko: Thanks for this report. I gave that a quick try on a Debian testing system but could not reproduce your report so far. Here is what I did:

1) I took a vanilla Tor Browser 7.0.2.
2) I started Wireshark to capture network traffic.
3) I entered sftp://104.131.180.179:80/index.php in the URL bar which lead me to  DuckDuckGo.
4) I looked at my Wireshark output and all traffic went through Tor.
5) After a while I visited http://104.131.180.179/ip.txt and my IP address did not show up.

I try to get my hands on some Ubuntu machines. Maybe I can reproduce your bug there.

Did you do step 3) as well or something different and did you get the same result (the URL getting passed to DuckDuckGo)?
- **2017-07-26** @geko: Okay, I found a machine where I could reproduce this bug. Thanks. We are investigating it right now and are working on a fix.
- **2017-07-26** @rethink5807: Step 3 on an gresh install of ubuntu on virtualbox does not forward me to duckduck go. The page times out instead.  On a windows box however I am redirected to duckduckgo. I can test this on the ubuntu live install if you want. I could also record a video of the poc if it would help.
- **2017-07-26** @rethink5807: Looks like I was typing my reply at the same time. Thanks and let me know if I can help!
- **2017-07-26** @geko: Okay, I think I have a workaround for your bug (but am still investigating what exactly is going wrong and whether it does not open up other holes). Could you test that one? Here are the steps:

1) In your Tor Browser open <code>about:config</code> and create a new preference (by right-clicking on the page). Select the boolean option.
2) The name of the new preference would be <code>network.protocol-handler.external.sftp</code> and the value would be <code>true</code>
3) Now visit your PoC-URL
4) The URL should get passed on to DuckDuckGo and you should see no leaks in Wireshark (nor your IP address in the ip.txt file).
- **2017-07-26** @geko: Alright, I think we have a better fix for your issue. I made a Tor Browser bundle containing it. Could you test the build on your machine(s) and report back if it fixes the problem for you:

https://people.torproject.org/~gk/testbuilds/tor-browser-bugXXXXX-test.tar.xz
https://people.torproject.org/~gk/testbuilds/tor-browser-bugXXXXX-test.tar.xz.asc
- **2017-07-26** @rethink5807: I tested this build and it does appear to fix this issue. I am redirected to duckduckgo and see no leakage in my network capture. Thanks for the quick resolution!
- **2017-07-26** @geko: We are still working on it. Thanks for your report, really appreciated. FWIW our current plan is to get new Tor Browser releases for Linux out tomorrow (there is still code review pending and then our reproducible build setup is waiting). Afterwards I'll get back to your report (doing the remaining admin things and rewarding you).
- **2017-07-26** @rethink5807: Thanks for the update.
- **2017-07-27** @rethink5807: It looks like you fixed the same issue with SMB URIs as well FYI.
- **2017-07-27** @geko: That was the plan, yes. Thanks for testing. I forgot one thing to ask yesterday: We plan to release blog posts announcing the new releases and thought about crediting you in them, too. Is that okay with you? If so what should we mention? Just your name or something else?
- **2017-07-27** @rethink5807: Yeah that's fine with me.
- **2017-07-27** @rethink5807: You could also add my twitter @atechdad if you want.
- **2017-07-28** @rethink5807: I see the new version has been released. I have confirmed the issue is fixed with it too.
- **2017-08-03** @geko: Thanks. I just wanted to let you know that we want to reward you for this bug report but we have some unanticipated difficulties which we are currently sorting out. Sorry if it takes longer than expected.
- **2017-08-03** @rethink5807: Thank you for the update. Let me know if there is anything I can do to help.

Any idea on what the turnaround may be? Just curious.
- **2017-08-10** @geko: You mean the bounty? I am trying to get you $3000 for this bug but we are still waiting on our balance being updated...
- **2017-08-10** @rethink5807: Wow- that's awesome! Thanks for the update.
- **2017-08-20** @rethink5807: Hi- I am just checking back. Can you give me an update please?
- **2017-08-22** @geko: I pinged the folks being in charge for updating our balance (it's not directly in our hands) but have not heard back if that is supposed to succeed any time soon. If I have not heard back by Thursday this week I'll try to get creative and get you the money on some other way. Not sure how that could work with the HackerOne platform, though. We'll see. Again, I am sorry for the hassle. :(
- **2017-08-22** @rethink5807: I greatly appreciate the update.  I have another one to submit but I am on the fence as to whether it is actually a security issue or not. In short, a person running another browser may be able to get the user name of a person who is running a tbb. However I don't think that the person would be able to tie this to the current tor session. Is this something i should submit or is it outside the guidelines?
- **2017-08-23** @geko: I think this is outside of this bug bounty program. However, it might be something we should have in our public bug tracker at https://trac.torproject.org/projects/tor. Would you care filing a ticket there and explaining your idea? There might be nothing we can do about that but maybe there is, hard to say. Thanks!
- **2017-08-24** @rethink5807: Thanks. Once I get the details worked out I will do that.
- **2017-08-28** @rethink5807: Hi- is there any update for this?
- **2017-08-28** @geko: Yes. I am trying to route around the bureaucracy that is currently blocking on getting our balance updated and I got green light to pay you the bug bounty directly from our money. The final thing I am trying to figure out is how this will be impact the HackerOne reputation system etc. as we are basically paying the bounty outside of their platform. I'll do that tomorrow and hope to have an answer to that question shortly. Barring any further surprises we can then try to get you the money you deserve. Would you, as kind of a compensation, like to get a Tor t-shirt as well? (We don't have special bug bounty swag yet, though, it would be a "normal" Tor t-shirt)
- **2017-08-28** @rethink5807: Sure that'd be cool to wear thanks for thinking of it. I won't be violating some kind of ToS by working around the hackerone platform will I? Is this something the hackerone folks could fix with moderation--or is there anything else I could do to help?
- **2017-08-29** @rethink5807: One more question-- how would that payout work? Would it be via paypal?
- **2017-08-30** @geko: No, we will probably transfer money directly to HackerOne and they would add it to our balance and then things are working normal (and we are reimbursing the folks paying our bug bounty program). We are close to getting this going.
- **2017-08-30** @rethink5807: That makes sense. Thanks for the information.
- **2017-09-05** @rethink5807: I hate to bug you, but is it possible to get an update?
- **2017-09-05** @geko: Sure, and I hate it to not be able to give you just the bounty you deserve and to close this bug. So, once I announced our alternative plan it turned out that the issue blocking the normal workflow got solved. I got told that the money should be on our HackerOne balance by the end of last week. It seems that did not happen and yesterday was Labor Day in the US. I'll ping them right now and see where we are. Thanks again for your patience.
- **2017-09-06** @rethink5807: Thank you for the information
- **2017-09-10** @rethink5807: Hey again- Just reaching back out.has there been any progress on this yet?
- **2017-09-12** @geko: Alright, to give a status update:

Plan A (just giving you the bounty you should get via the "normal" HackerOne channels) is still not working. There seems still to be some bureaucratic hurdle which is not easily surmountable which I don't understand.

Now, Plan B has been to give you the money direct from us but transfer it to the HackerOne  bank account to get it to our balance and continue with the "normal" HackerOne work flow. However, this fails currently as HackerOne does not seem to be able to get back to me with  their banking details. :(

Now, let me try a Plan C...
- **Report Resolved**
- **2017-09-12** @geko: Okay, Plan C failed as well: I thought I can force their hand by just setting the bounty despite our balance being low.

I try to nag HackerOne today to make progress on Plan B and if  that does not work this week I think about a final Plan D.

Again, thanks for your patience.
- **2017-09-15** @rethink5807: Thanks for the update. Is there anything I can do on my side?
- **2017-09-18** @geko: No. But I have some good news for you: the compliance folks at our billing contact should now have all the necessary info to wire the required money to our HackerOne account. If that still does not work out, then I got the HackerOne account details as well and am able to get money from us wired to that account. So either way, money will make its way to our HackerOne account this week. And then we can give you the bounty.
- **2017-09-20** @rethink5807: Thank you for the  updates.
- **2017-09-22** @rethink5807: Just curious if the money  made it into the account this week. Do you know?
- **2017-09-22** @geko: Alas not, which is why I asked our accountant folks a couple of hours ago to send the money directly from us to HackerOne. I don't want to wait anymore. If all goes well then the wiring gets done today and sometime next week I can give you your bounty.
- **2017-09-25** @rethink5807: Thank you for the update. Hopefully everything went well :)
- **2017-09-26** @geko: Okay, the money from our side is on its way. I'll keep a close look to make sure it actually lands on our balance (hopefully today/tomorrow).
- **2017-09-28** @rethink5807: Thank you for the update.
- **Bounty Awarded**
- **2017-09-29** @rethink5807: Thank you! It has been a pleasure to work with you on this. I have not yet dealt with a group that was as responsive and patient as you have been.
- **Agreed On Going Public**
- **Agreed On Going Public**

> 1 more activity entries not fetched (cap 50).
