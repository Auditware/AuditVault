---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
substate: "informative"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2018-12-11
submitted: 2018-11-05T06:45:41.903Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "csanuragjain"
source: "https://hackerone.com/reports/434202"
title: "Opportunity to post hidden comments"
---
# Opportunity to post hidden comments

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** X / xAI | **Disclosed:** 2018-12-11

- Report: [https://hackerone.com/reports/434202](https://hackerone.com/reports/434202)
- CWE: Business Logic Errors
- Submitted: 2018-11-05T06:45:41.903Z

## Report summary

I reported an issue using which Attacker posted messages on victim's tweet cannot be seen by victim but can be observed by any other twitter user.

An example for this is:

Attacker login to Twitter
Attacker blocks victim using Block@victim button at https://twitter.com/<victim>
Attacker opens any popular tweet of victim
Attacker abuses victim in the tweet reply
Victim cannot see the tweet reply posted by Attacker but any other user can see that reply.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Twitter allows to comment on anyone's tweet. While testing this feature, observed that one can post comment on tweet which will be invisible to the victim whom the reply was posted and would be visible to any other twitter user.
This can allow an Attacker to abuse victim on a tweet. The catch here is victim cannot even know that attacker posted on his tweet but any other twitter user can see that tweet.

**Steps to reproduce**

1. Attacker login to Twitter
2. Attacker blocks victim using Block@victim button at https://twitter.com/<victim>
3. Attacker opens any popular tweet of victim
4. Attacker abuses victim in the tweet reply
5. Victim cannot see the tweet reply posted by Attacker but any other user can see that reply.

**Recommendation**
If a person blocks a twitter user then he/she should not be allowed to post on any of the blocked user tweets.

## Impact

This can allow an Attacker to abuse victim on a tweet. The catch here is victim cannot even know that attacker posted on his tweet but any other twitter user can see that tweet.

## Timeline

- **Report Filed**
- **Report Informative**
- **2018-11-06** @csanuragjain: @bugtriage-josh 
I think their is a misunderstanding.

**What I wanted to report is:**
1.  As mentioned by you, If User A blocks User B then User A will not get any message or notification from User B, which is correct
2. But one more thing is happening here, after blocking, User B cannot see any posts/notfication from User A, even though User A posted on User B status, which is not expected.
3. So in this POC, attacker is using the blocked feature instead of victim

**One example:**
1. I login to twitter and block your twitter handle in my profile
2.  I can still see your tweets and can reply on any of your tweets
3. I open any of your tweet and reply with some spam which you would never want on your profile tweet
4. My reply successfully posts
5. When you open your twitter and goto that tweet, you will not see my reply. But any other twitter user will see my reply on that tweet.

**What happens on other platforms:**
If User A blocks User B then User A must also not be allowed to post reply on User B tweets
- **2018-11-06** @csanuragjain: Not sure, if u received the follow up comment explaining why this is not the expected behavior. Waiting for your response.
- **Hacker Requested Mediation**
- **2018-11-09** @csanuragjain: Waiting for the update on this issue from the product team
- **2018-11-10** @csanuragjain: Requesting you to kindly let me know the final say from product team
- **2018-11-20** @csanuragjain: Any update on the mediation request?
- **2018-11-21** @csanuragjain: @twitter Its more than 2 weeks since i raised request mediation on this issue. Just hoping to get final decision from your side on this issue.
- **2018-11-29** @csanuragjain: @twitter @security Request you to kindly look in the mediation request. Its already 22 days and I have got no response.
- **2018-12-07** @csanuragjain: @andrewsorensen @twitter Request you to kindly look in the mediation request. Its already more than a month and I have got no response.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-12-12** @csanuragjain: As mentioned already, Disallowing blocker from posting is expected but still doubtful on why the person who has blocked someone is allowed to post on that someone's wall. (Specially when the blocked person won't be able to see the comment from the blocking person and rest of the world can)
