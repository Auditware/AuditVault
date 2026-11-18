---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - trigger/admin-required
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2025-10-08
submitted: 2025-08-18T08:31:05.878Z
bounty_usd: null
votes: 77
cve: []
program: "[[programs/omise|Omise]]"
reporter: "mantu1738"
source: "https://hackerone.com/reports/3303136"
title: "Pending invites remain valid even after the inviter is removed."
---
# Pending invites remain valid even after the inviter is removed.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 77 | **Program:** Omise | **Disclosed:** 2025-10-08

- Report: [https://hackerone.com/reports/3303136](https://hackerone.com/reports/3303136)
- CWE: Privilege Escalation
- Submitted: 2025-08-18T08:31:05.878Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
When an admin (A) invites another user (B) with admin privileges, removing the inviter (A) does not invalidate the pending invite for B. Furthermore, if B has already accepted the invite, B remains in the team with admin privileges. This could allow unauthorized admin access even after the original inviter is removed.

##  Steps to Reproduce
1. Invite a user (A) to the team with **admin privileges**.  
2. A accepts the invitation and becomes an admin.  
3. A invites another user (B) to the team with **admin privileges**.  
4. Remove user A from the team.  
5. Observe:  
   - If B has not accepted the invite, the invite **remains valid**.  
   - If B has already accepted the invite, B **remains in the team** with admin privileges.

# # Expected Behavior
- Pending invites created by a removed admin should **become invalid**.  
- Members already added by the removed admin should either be **reviewed or removed** automatically, depending on platform policy.

# #Actual Behavior
- Pending invites remain valid and can be accepted.  
- Accepted members remain in the team with admin privileges.

##POC
{F4688873}

## Impact

- Unauthorized users may gain admin access after the inviter has been removed.  
- Violation of least privilege principles and potential for **privilege escalation**.  
- Security audit and compliance issues, as removed admins cannot fully revoke their influence.

## Timeline

- **Report Filed**
- **2025-08-27** @mantu1738: hello
Just following up to see if there are any updates on this report. Thank you!
- **Report Resolved**
- **2025-09-02** @mantu1738: Thank you @hardymansen  for the clarification,
 I understand that the platform may consider this behavior “by design” in some contexts. However, I’d like to emphasize that the report highlights a       security concern:
 - Pending invites created by a removed admin remain valid.
-  Users already added by the removed admin retain admin privileges.

This can allow unauthorized admin access and violates the principle of least privilege, which is a standard security practice. Even if the original invite was valid at the time it was sent, the ability for removed admins to leave lingering admin privileges or valid invites represents a potential access control issue so, I believe this issue warrants further consideration for a reward.

Thank you for your time and consideration. I look forward to your response.

Thanks,
@mantu1738
- **Agreed On Going Public**
- **Not Eligible For Bounty**
- **2025-09-08** @hardymansen: Again,  with the risk of repeating myself. The invite was valid at the time. This is not something about least privilige. The admin have the permission to create new user accounts. Admin have full permission for  that account. If he want to create another admin account, he is allowed to. I understand your point and as i mentioned maybe you could argue it is around best practise but it is very obscure and don't fall under this program.
- **2025-09-08** @mantu1738: Thank you @hardymansen for the response. Can we discolse this report ?

Regards,
@mantu1738
- **Report Became Public**
