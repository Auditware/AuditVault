---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2020-09-08
submitted: 2020-02-07T17:38:17.833Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "kryword"
source: "https://hackerone.com/reports/790786"
title: "Members from parent group keep their access level on a subgroup transfer and are invisible"
---
# Members from parent group keep their access level on a subgroup transfer and are invisible

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** GitLab | **Disclosed:** 2020-09-08

- Report: [https://hackerone.com/reports/790786](https://hackerone.com/reports/790786)
- CWE: Improper Access Control - Generic
- Submitted: 2020-02-07T17:38:17.833Z

## Timeline

- **2020-02-07** @kryword: As a side note: There's a workaround to remove this ghost members, and that requires adding all the "ghost members" that you want to remove permissions to members and remove them. That way they lose privileges on all nested subgroups and projects.

The problems is that's difficult to know what members have permissions but don't appear if a lot of time passed from the transfer of the project.
- **Report Filed**
- **2020-02-07** @kryword: To illustrate it better, this is before the transfer:
- **Main Group 1** (Members, all visible: User1, User2, Attacker)
  + **Subgroup 1** (No members, only inherited from Main Group 1)
     + **Project 1**  (No members, only inherited from Main Group 1)
- **Main Group 2** (Members: User1)

**User 1 transfers Subgroup 1 to Main Group 2.**

This is the structure after the transfer:
- **Main Group 1** (Members, all visible: User1, User2, Attacker)
- **Main Group 2** (Visible Members: User1. Invisible Members: User2, Attacker, they can only see what's inside this group)
  + **Subgroup 1** (Visible members: User1(Inherited from Main Group 1); **Invisible members**: User2, Attacker, they have the same permissions that they had before on the Main Group 1)
     * **Project 1** (Visible members: User1(Inherited from Main Group 1); **Invisible members**: User2, Attacker, they have same permissions that they had on Main Group 1)
- **2020-02-07** @gitlab-securitybot: Hi @kryword,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 7 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-02-07** @kryword: Also, tested with the gitlab API and ghost members don't appear there either, neither for groups or projects transferred. If you want to test, this is the script I used in python, you would have to add an API key to test it. As this groups/projects are public a normal user API Key should work.

Run this before in a terminal to get gitlab api library.
```
$ pip install python-gitlab
```

Programmed in Python 3.
```python
from gitlab import Gitlab

if __name__ == "__main__":
    g = Gitlab("https://gitlab.com", "API_KEY")
    #Project project3: https://gitlab.com/main_group2/subgroup1/project3
    project = g.projects.get(16765289)
    print("Project: ", project)
    members = g.projects.get(16765289).members.list()
    print("Those are the members: ", members)
    #Group subgroup1: https://gitlab.com/main_group2/subgroup1
    group = g.groups.get(7117623)
    print("Group:", group)
    members = group.members.list()
    print("Members of group: ")
    for member in members:
        print(member)
```

curl requests should give the same answers, but I'm not that good with curl and this was faster for me.

Result, only one member, "cristian.berner", but there's a ghost member not showing here(@kryword):
```
Members of group:
 {'id': 4984575, 'name': 'Cristian Berner', 'username': 'cristian.berner', 'state': 'active', 'avatar_url': 'https://assets.gitlab-static.net/uploads/-/system/user/avatar/4984575/avatar.png', 'web_url': 'https://gitlab.com/cristian.berner', 'access_level': 50, 'expires_at': None}
```
- **Report Triaged**
- **Bounty Awarded**
- **2020-02-10** @kryword: Thank you for the fast response. If you need more information from me, let me know, I'll be more than happy to help.
- **2020-02-12** @gitlab-securitybot: ETA for fix:

Hi @kryword,

The issue you reported is currently scheduled to be fixed by 2020-04-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-03-13** @gitlab-securitybot: ETA for fix:

Hi @kryword,

The issue you reported is currently scheduled to be fixed by 2020-05-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-04-15** @gitlab-securitybot: ETA for fix:

Hi @kryword,

The issue you reported is currently scheduled to be fixed by 2021-05-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-04-22** @kryword: Hello, are there any news regarding this issue in the last release on 22 april?
Thank you.
- **2020-04-23** @dcouture: Hello @kryword,

I am going to ask the engineering team and will update you with any news.

Best regards,
Dominic
GitLab Security Team
- **2020-04-30** @gitlab-securitybot: ETA for fix:

Hi @kryword,

The issue you reported has no milestone date at the current time.

We will update you as soon as this changes.

Best regards,
GitLab Security Team
- **2020-04-30** @dcouture: Hi @kryword, 

As the bot just posted, there is no precise ETA for this yet, however it has been re-prioritized and should be addressing this issue in a release coming soon.

As per policy, the remainder of the bounty will be paid when the report is resolved or 90 days after triage, whichever happens earlier.

Best regards,
Dominic
GitLab Security Team
- **2020-04-30** @kryword: Hi @dcouture,

Perfect, thank you for the update! If you need any extra information let me know. 

I think it should be prioritized because there could be users that have access to transfered projects without anyone knowing that they have access to those. Or at least handle this situation, updating all access to only the visible present members of each group/project.

Kind regards,
Cristian
- **Bounty Awarded**
- **2020-05-20** @kryword: Thank you for the bounty, I'll be waiting the update on the fix. If you need retesting after this, let me know.

Kind regards and thanks,
Cristian
- **2020-06-09** @gitlab-securitybot: ETA for fix:

Hi @kryword,

The issue you reported is currently scheduled to be fixed by 2020-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
