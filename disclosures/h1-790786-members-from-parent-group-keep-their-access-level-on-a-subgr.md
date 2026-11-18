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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

There's an option that allows to transfer groups from one namespace to another, it doesn't work as intended when transferring subgroups from inside a parent group to another group. Users that were part of the first parent group from where the subgroup has been transfered, keep their permissions and access level on the subgroup, wherever it was transfered and without being explicit members of the subgroup.

Not only that, they don't appear as members. They have access without appearing on the members tab. They also get some sort of access to the new parent group where the subgroup has been transfered, without being members of that new group even when it's private.

### Steps to reproduce

1. Create 2 different private groups (so you can instantly see when you get a 404 no access). GroupA, and GroupB.
2. Invite to some members to GroupA and give them maintainer/owner(for testing high privileges) access.
3. Don't invite anyone except yourself to groupB (this makes testing easier).
4. Create a subgroup in groupA, subgroupA
5. Create a project in subgroupA, project-test.

Now, you'll see that members from groupA have access to both subgroupA and project-test, as they are members of the main group groupA.

6. Transfer subgroupA to groupB.
7. Recheck with a user that's not a member of groupB and you'll see he keeps his permission on the transferred subgroup and it's related projects.
8. Also check the members tab and you'll see they don't appear there, and they have permissions to see and if they where owner/maintainer on the previous main group, they have access to settings and that sort of things.

### Impact

It affects all the transferred subgroups and their projects if those were transferred from a main group to another group. Members from that main group are still ghost members and can still access and modify those groups.

Not sure how much of the users have transferred groups to other groups, but it could be a lot.

### Examples

I've made 2 private projects for the tests, I'm making them public but you'll not be able to see the members directly, as one of the members doesn't even appear on the members tab.

Group1 (Added 2 users as members):
https://gitlab.com/groups/main_group1

Group2 (Only cristian.berner is a member of this group):
https://gitlab.com/groups/main_group2

From Group1 I created and transfered subgroup1 with an inner project called project3 to Group2:
https://gitlab.com/main_group1/subgroup1/project3 (This would redirect to https://gitlab.com/main_group2/subgroup1/project3 as it was transferred there)

Now look at members from subgroup1 and members of project3, there's no @kryword in there, still I have full access with that account there to remove/add members or even delete the project.

I attached two screenshots showing this.

### What is the current *bug* behavior?

Members from parent group are also transferred as ghost members(they're not showing in members menu) when a subgroup with projects is transferred to another group.

### What is the expected *correct* behavior?

Members from parent group should not be transferred or if the intended behaviour is that they also get transfered, they should show up in the members menu.

### Output of checks

This bug happens on GitLab.com

## Impact

Members that have been part of a parent group when a transfer happened, they have the same privileges that they had on those subgroups transferred and if they were owners for that moment, they are still owners and not even showing as members on those transfered subgroups/projects.

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
