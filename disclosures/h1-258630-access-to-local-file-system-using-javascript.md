---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
date: 2017-11-18
submitted: 2017-08-10T14:59:01.413Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "cuso4"
source: "https://hackerone.com/reports/258630"
title: "Access to local file system using javascript"
---
# Access to local file system using javascript

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Tor | **Disclosed:** 2017-11-18

- Report: [https://hackerone.com/reports/258630](https://hackerone.com/reports/258630)
- CWE: Violation of Secure Design Principles
- Submitted: 2017-08-10T14:59:01.413Z

## Timeline

- **Report Filed**
- **2017-08-10** @cuso4: referance same vulnerability - https://hackerone.com/reports/175979
- **2017-08-11** @geko: Thanks for making us aware of this problem. Have you contacted the Mozilla people? It seems the underlying problem is  a Firefox bug and if it indeed is problematic I think all the Firefox users should benefit and not just Tor Browser users.
- **2017-08-11** @cuso4: @geko 

My all reports on tor #258629  #258633  are seems bugs on firefox as well tor (two of them are impactfull)
I didn't reported them any because I thought that firefox and tor have same origin .this is also seems critical because it looking lfi on TOR .

I am looking forward for your help .

regards
- **2017-08-11** @geko: Yes. So what I recommend is opening a bug at https://bugzilla.mozilla.org/ (for all the other Firefox affecting issues as well). There is the option to click on a checkbox to mark this bug as a security bug. If you believe that's in order then click the box. The Firefox security team will look at these reports. You can put me in Cc if you think that would be helpful (gk [@] torproject [.] org). Let' s see what they say.
- **2017-08-11** @cuso4: Thanks , Is it liable under TOR BBP?

i will report in mozilla ASAP .
- **2017-08-11** @geko: I am not sure yet. Let's see what the Mozilla folks are saying first. The kind of bugs you reported are usually eligible for Mozilla's bug bounty program if at all. And if Mozilla is rewarding you for the things you found then, looking at our policy and your bugs, we won't be able to offer you an additional bounty.

If Mozilla thinks these bugs are unproblematic I'd like to see their reasoning first and then I'd have to think about how your bugs could fit into one of our bounty categories.
- **2017-08-15** @cuso4: @geko 

They replied .

So a local file can read another local file (and in the testcase even in the same directory).
That is what our file:/// handling has been for years, yet we have tested in authorized handling and It seems impactfull ,we will fix it soon and will let you know .

I am unable to give you report id because they made it private .

As per their report they are going to resolve .so can you close this report as resolved by giving reputation points.(as you said that according to your policy i can get reward from only firefox:(

regards.
- **Report Resolved**
- **Not Eligible For Bounty**
- **2017-08-16** @cuso4: @geko 
I suggested them to add you in cc list and they replied that either they will add you or contact Tor directly after resolving.
Thank you.
- **2017-08-17** @cuso4: @geko 
█████

as per their reply they will test and will make secure like chrome.

thank you and sorry for late response.
- **2017-08-27** @cuso4: @geko  bug is looking fixed now ...as my end i am unable reproduce this ..greetz..
can  you please say that, is it something abnormal ? 

https://db.torproject.org/machines.cgi?host=admin

there are some Ip adress of onion websites ...

thanks.
- **2017-08-28** @geko: No, nothing unusual I think.
- **2017-08-28** @cuso4: @geko  thanks.
As this bugs fixed on Mozilla team ,they will be decide about bounty decision ,so as this bug was in both Mozilla and Tor ,as per your policy you wouldn't​ award with me bounty but can you please award that cool Tor swags ! I know I can't Buy those anywhere .......
- **2017-08-29** @geko: Do you have a link to a commit that contains the fix because I can't see it in Mozilla's main development repository, mozilla-central, yet.

That said, you mean a Tor t-shirt? (We don't have bug bounty related swag yet) Yes, I can make sure you get one. I'd need your size and the address where to ship it (feel free to send this info to me directly: gk [@] torproject [.] org and I'll pass it along).
- **2017-08-29** @cuso4: Do you have a link to a commit that contains the fix because I can't see it in Mozilla's main development repository, mozilla-central, yet.


As they made report public to private so , i am just thinking that may they don't revel in mozilla central......or may later ...but on my end i can confirm it's fix now ...

That said, you mean a Tor t-shirt? (We don't have bug bounty related swag yet) Yes, I can make sure you get one. I'd need your size and the address where to ship it (feel free to send this info to me directly: gk [@] torproject [.] org and I'll pass it along).

thank again ..i will send details to your mail....

best regards.
- **2017-08-29** @cuso4: while i was publically looking for a fingerprinting on tor i got a attack senarion ,in which if a victim open https://tor.triop.se/  then there is possible to fingerprinting ...i personally tested ...please look  and tell me ..if i should make a new receipt on hackerone .....
- **2017-08-30** @geko: Yes, that is known. There is no need to open a new hackerone bug, thanks.
- **2017-08-30** @cuso4: well ! thanks , i drop a mail to gk@torproject(.)org. please take a look
- **2017-09-13** @cuso4: @geko sorry for incoviance but can you please confirm that you received my mail about TOR tshirt and if i can track the swag !
- **2017-09-14** @geko: Nope I did not get the mail. Where did you send it too?
- **2017-09-14** @cuso4: I sent to gk@torproject(.)org
- **2017-09-14** @geko: Could you resend the mail? It might have  landed in my trash folder.
- **2017-09-14** @cuso4: okay i sent recently.please take a look
- **2017-09-14** @cuso4: @geko  is it possible to configure tor with burpsuite ?
- **2017-09-14** @cuso4: @geko , I can found many strange things like logs and many private things https://f4amtbsowhix7rrf.onion.link
should i open another h1 ticket for it ?
- **2017-09-15** @geko: Those are our public nightly builds, so having them available is intended.
- **Agreed On Going Public**
- **Report Became Public**
