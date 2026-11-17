---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privacy-violation
  - env/web
substate: "resolved"
weakness: "Privacy Violation"
enriched: true
date: 2017-11-02
submitted: 2017-10-02T05:59:23.608Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "eidelweiss"
source: "https://hackerone.com/reports/273698"
title: "Unauthorized Access to Protected Tweets via niche.co API"
---
# Unauthorized Access to Protected Tweets via niche.co API

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 22 | **Program:** X / xAI | **Disclosed:** 2017-11-02

- Report: [https://hackerone.com/reports/273698](https://hackerone.com/reports/273698)
- CWE: Privacy Violation
- Submitted: 2017-10-02T05:59:23.608Z

## Timeline

- **Report Filed**
- **2017-10-02** @eidelweiss: Hello @twitter 

i have an update here, after do more analysis i found another END POINT that can be used to view the private/protected tweets from victim account.

* so there is 2 END POINT that can be use to expose the protected tweets from victim
  1. `https://www.niche.co/api/v1//users/[user_id]/posts?accounts=identity_id`
  1. `https://www.niche.co/api/v1/identities/[identity_id]/posts/`

* the user_id & identity_id is easy to get via 
 `https://www.niche.co/api/v1/users/[victim_twitter_username]`
- **Report Triaged**
- **2017-10-13** @eidelweiss: Hello sir @mli and @twitter team,

I just check this again today , both of the end point now give zero data (no more show the content of protected tweets)
{F228941}
and the following URL `https://www.niche.co/api/v1/identities/162059/` now give a notice __invalidated_reason	"Account privacy is set to protected."__ in the response.
{F228942}

So i confirm this issue / vulnerability has been fix. Congrats and Great job.

Regards,
- **Report Resolved**
- **2017-10-20** @eidelweiss: Hello sir @andrewsorensen 

Sory for asking this, but is this eligible for bounty ?

Regards,
- **2017-10-20** @eidelweiss: Hello sir @andrewsorensen and @twitter team,

this one is similar to this #97161 report, but there is some point that make this report have a higher severity/impact 

* this #97161 report need to have an account and or login first to success exploited or reproduce  the vulnerability , this one (my report) no need to have account.
* this #97161 report is only can view per word and if the word is available in the protected tweet from victim, but on this one (my report) can show all protected tweet even from first tweets from victim.

Regards,
- **2017-10-20** @andrewsorensen: We'll review this issue as part of our weekly report review, but please keep in mind that Niche is not in scope for bounty per our [program rules](https://hackerone.com/twitter).

Thanks for thinking of Twitter security!
- **2017-10-20** @eidelweiss: Hello sir @andrewsorensen 

First, thanks for your reply..i know the niche is in scope target but not in scope for bounty..but the impact is effect to the twitter it self (about tweeting).i think we agree even from other component that can break the privacy setting (in this case is able to read or access protected tweets) is a dangerous and have high severity. Because its effect to the privacy from twitter user.

Regards,
- **2017-10-21** @eidelweiss: hello @twitter team,

any update regarding bounty decision ?

Regards,
- **Not Eligible For Bounty**
- **2017-10-21** @eidelweiss: Hello @Twitter

I am disappointed , this one is not eligible. even the fact this similar to this #97161 report but have a higher impact than that one like I have mentioned in my previous comment.

in your policy say `High impact vulnerabilities will be considered on a case by case basis.` and  __privacy violation__ like this is high/critical I guess.

 if this is the final decision , should I ask for mediation or we can just public disclosure this ?

regards,
- **2017-10-21** @eidelweiss: Please reconsider this again , I will really appreciated. but if still this is the final decision please just let me know.


Regards,
- **2017-10-21** @andrewsorensen: TweetDeck is a in-scope Twitter property listed on our program rules. Niche is clearly listed as being ineligible for bounty, and upon further review the payouts panel ruled that this report should be marked as ineligible.

Thanks for helping keep Twitter secure!
- **2017-10-21** @eidelweiss: hello sir @andrewsorensen and @twitter team ,

again thanks for your quick response, I really appreciated that. if that is the reason how about this one #129381 its niche property and no impact to __Twitter__ user account/privacy , but its eligible for bounty. this is not fair then. I believe people make mistake. so please review and reconsider this again.

Regards,
- **2017-10-21** @eidelweiss: this report is about niche property and no impact to __twitter user account and privacy__, and got bounty.
{F231316}
- **2017-10-23** @eidelweiss: hello @twitter 

if the problem is like sir @andrewsorensen explanation  about this is niche property and niche is not eligible for bounty, but before this @twitter give bounty to this #129381 report which is that report is about niche property and not even have impact to twitter user, this is not fair.

please review and reconsider this again. but if still no chance and this is the final decision, just let me know.

Regards,
- **2017-10-26** @eidelweiss: hello @twitter , sir @andrewsorensen ,

still no answer here ? jus let me know please.
- **2017-10-26** @andrewsorensen: As I previously mentioned, Niche is clearly listed as being ineligible for bounty, and upon further review the payouts panel ruled that this report should be marked as ineligible. I cannot comment on the details regarding #129381.

Thanks for helping keep Twitter secure!
- **Agreed On Going Public**
- **2017-10-28** @eidelweiss: Hello @twitter ,

there is any problem to disclose this report publicly ?

Regards,
- **Agreed On Going Public**
- **Report Became Public**
