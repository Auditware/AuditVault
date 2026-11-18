---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-07-27
submitted: 2019-04-14T13:20:39.998Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "yuvraj_dighe"
source: "https://hackerone.com/reports/538008"
title: "Add users to groups who have restricted group invites"
---
# Add users to groups who have restricted group invites

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** WordPress | **Disclosed:** 2019-07-27

- Report: [https://hackerone.com/reports/538008](https://hackerone.com/reports/538008)
- CWE: Improper Access Control - Generic
- Submitted: 2019-04-14T13:20:39.998Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Description:

WordPress version: 5.2
BuddyPress version: 4.2.0

Through this vulnerability, an attacker could add users to groups who have set :
   `I want to restrict Group invites to my friends only.`

There is no proper validation of the personal settings of the user and thus the users with such privacy settings selected could be added.

#Steps to Reproduce:

Make 2 accounts A and B, make sure they are not friends.

  1. From account of user A, enable the setting `I want to restrict Group invites to my friends only.` from the following URL http://bbwordpress.esy.es/members/yuvraj/settings/invites/.
  2. From account of user B, make a POST request to : 

      `POST : http://bbwordpress.esy.es/wp-admin/admin-ajax.php`
       `BODY : message=&nonce=21f500cbfd&group_id=1&action=groups_send_group_invites&_wpnonce=7264177f51&users%5B%5D=3`

  3. Replace the value of users with the victims user id , i.e id of user A.
  4. Victim (user A) would receive an invitation from Attacker (user B) even though the privacy setting to restrict group invites has been enabled.

## Impact

An attacker who is not a friend of the victim can send him a group invite even though the victim has selected to restrict group invites from friends only.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-04-23** @boonebgorges: Hi @yuvraj_dighe - The BP team has prepared a patch to address the issue. If you've got a moment and would like to verify, the patch is attached.
- **2019-05-16** @yuvraj_dighe: Hi @boonebgorges,

When would a fix of this bug be released?

Thanks
Yuvraj Dighe
- **2019-05-16** @boonebgorges: @yuvraj_dighe We don't currently have a timeline for our next security release. I'll confer with the BuddyPress team about it.

In the meantime, please let me know whether you've had a chance to test the patch. Once you've done so (or let me know that you'd rather not) I can move this ticket along in the bounty queue.
- **2019-05-16** @yuvraj_dighe: Hi @boonebgorges,

I had already verified the patch but forgot to mention here. It has fixed the issue.
- **2019-05-27** @yuvraj_dighe: Hi @boonebgorges,

Hope you are doing well.
Have you moved this ticket along the bounty queue?

Thanks
Yuvraj
- **2019-05-28** @boonebgorges: Hi @yuvraj_dighe - Yes, I have. Thanks for your patience.
- **2019-07-07** @yuvraj_dighe: Hi @boonebgorges,

Hope you are doing good!

Any update on the bounty status since it has been more than 2 months since we had discussed last.

Thanks,
Yuvraj
- **External User Joined**
- **2019-07-23** @imath: Hi @yuvraj_dighe 

Thanks a lot for your contribution to BuddyPress. I just wanted to let you know we've included the fix to the vulnerability you discover into a new security release : https://buddypress.org/2019/07/buddypress-4-4-0-security-and-maintenance-release/

Have a nice day,
Mathieu.
- **Report Resolved**
- **Agreed On Going Public**
- **2019-07-25** @yuvraj_dighe: Hi @whyisjake,

Any ETA of payout?
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
