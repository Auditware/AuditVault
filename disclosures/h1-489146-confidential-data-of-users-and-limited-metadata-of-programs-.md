---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2019-02-03
submitted: 2019-01-31T15:32:20.974Z
bounty_usd: null
votes: 1034
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "yashrs"
source: "https://hackerone.com/reports/489146"
title: "Confidential data of users and limited metadata of programs and reports accessible via GraphQL"
---
# Confidential data of users and limited metadata of programs and reports accessible via GraphQL

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 1034 | **Program:** HackerOne | **Disclosed:** 2019-02-03

- Report: [https://hackerone.com/reports/489146](https://hackerone.com/reports/489146)
- CWE: Information Disclosure
- Submitted: 2019-01-31T15:32:20.974Z

## Report summary

On January 31st, 2019 at 7:16pm PST, HackerOne confirmed that two reporters were able to query confidential data through a GraphQL endpoint. This vulnerability was introduced on December 17th, 2018 and was caused by a backend migration to a class-based implementation of GraphQL types, mutations, and connections. The [class-based implementation introduced](http://graphql-ruby.org/schema/class_based_api) the `nodes` field by default on all connections. The `nodes` field, in contrast with `edges`, didn’t leverage any of the defenses HackerOne has implemented to mitigate the exposure of sensitive information.

Our investigation concluded that malicious actors did not exploit the vulnerability. No confidential data was compromised. A short-term fix was released on January 31st, 2019 at 9:46 PM, a little over 2 hours after the vulnerability was reproduced.

# Timeline

| **Date** | **Time (PST)** | **Action** |
|-------------|----------------|------------------------------------------------------------------------------------------------------------------|
| 2018-12-17 | 9:07 AM | Software containing bug deployed to production. |
| 2019-01-31 | 7:32 AM | Vulnerability submitted to HackerOne’s bug bounty program. |
| 2019-01-31 | 7:21 PM | HackerOne validated the report and started incident response. |
| 2019-01-31 | 8:25 PM | HackerOne identified which code change introduced the security vulnerability and started work on a patch. |
| 2019-01-31 | 9:46 PM | A patch was released mitigating the identified vulnerability. |
| 2019-01-31 | 11:46 PM | HackerOne confirmed the vulnerability was not abused by any malicious actors. |
| 2019-02-01 | 6:18 AM | The root cause of the vulnerability was identified and a long term mitigation was proposed. |
| 2019-02-01 | 5:08 PM | Long term mitigation was deployed to production. |
| 2019-02-03 | 2:34 AM | Impacted users were alerted that their information was exposed to the reporters who submitted the vulnerability. |

# Root Cause
HackerOne has a number of defenses in place to reduce the risk of over-exposing data through our GraphQL layer. The first notable defense is a separate database schema that limits the set of rows a user can query based on their current role. This significantly reduces the impact in case, for example, the result of `Report.all`, would be serialized and returned to the user. The second notable defense is attribute-level authorization depending on the role of the requester. This makes sure that when an object is serialized, for example a publicly disclosed report, the user is not able to obtain internal metadata of the report.

*Why upgrade?*
On December 17th, when the code change was put up for review, engineers noticed the addition of the `nodes` field. An assumption was made that the field behaved like a shortcut for `edges { node }` — which, in hindsight, was not the case. No manual testing was performed to make sure that the authorization model for `nodes` was similar to other connection types.

HackerOne’s engineering team decided to upgrade to the class-based implementation of `graphql-ruby` because the old .define-based implementation was lazy-loaded. This caused problems when hot reloading pieces of code in a development environment. The class-based implementation also performs better in most situations. The .define-style implementation is also deprecated by the maintainers of the gem (to be removed with GraphQL 2.0).

*Why didn’t we notice?*
The `nodes` field is a helper field for Relay, which is used by the frontend. Even though the field was introduced, HackerOne engineers hadn’t started using this in our frontend. This caused the addition to fly under the radar of other engineers. The go-to way to query data through connection types at HackerOne is to go through the `edges` field. Because engineers outside of the specific team who upgraded to the class-based implementation did not deem the change important enough, there was no communication to other engineering teams.

*Why was it exploitable?*
When a GraphQL query is deconstructed and turned into one or multiple SQL queries, it will cast the result of it into an array of stale objects and use the attribute-level authorization to scrub all data the current user isn’t authorized to see. Root cause analysis showed that this code path was only followed when the nodes were queried through the `edges` field.

**Query that followed the expected code path**
```
query {
  users() {
    edges {
      node {
        email
      }
    }
  }
}
```

During the GraphQL gem upgrade on December 17th, all GraphQL types, connections, and mutations were rewritten to a class-based implementation. This introduced the `nodes` field on every connection type [in HackerOne’s GraphQL schema](https://github.com/arkadiyt/bounty-targets-data/commit/cc4ce27dc1c92996191374f46312e4da5b7099c0#diff-8f06618eaa831640dfc824ff0cc29ebd). Instead of casting the result to an array with stale objects, the `nodes` field would result in an `ActiveRecord::Relation` object. The attribute-level authorization instrumentation would then incorrectly assume that the result was safe to be serialized, as it assumes the parent of the GraphQL field had already been scrubbed.

**Query that followed the unexpected code path**
```
query {
  users() {
    nodes {
      email
    }
  }
}
```

In the team’s investigation to determine whether this was exploited by malicious actors, the team concluded that the current logging level enabled them to answer two crucial questions: which GraphQL queries were executed and what information was transferred to the people proving the security vulnerability in the first place. These questions confirmed it was not exploited.

# Resolution and Recovery
At 7:21 PM PST, HackerOne successfully reproduced the vulnerability as described by the reporter. The responding team identified the code change that introduced the vulnerability and started working on a short-term mitigation at 8:25 PM. This mitigation was released at 9:46 PM. The short-term mitigation was to disable the `nodes` field [from every connection type](https://github.com/arkadiyt/bounty-targets-data/commit/dd90f110609bff572f15b62d29701195a3c2b3bf#diff-8f06618eaa831640dfc824ff0cc29ebd). An internal code rule was deployed to alert the incident responders in case a new connection type was added that had the `nodes` field enabled. At the time, the root cause of the vulnerability was still unclear.

On February 1st at 6:18 AM, the team concluded the root cause analysis of the identified vulnerability. A long-term fix was put up for discussion. This fix addressed the underlying problem of the lack of attribute-level protection for the `nodes` field. Going forward any connection type that is introduced will either be sanitized through the attribute-level authorization or will stop processing the request in case of an unexpected object to be returned.

The minimum bounty award for a critical vulnerability on hackerone.com is currently set to $15,000. Even though this vulnerability exposed confidential information, it was limited to user information and metadata of programs and reports. None of the exposed information could have led to the compromise of confidential vulnerability information. It did, however, allow actors to query a significant amount of information. Because of that, the team decided to award the reporters with $20,000 for uncovering this vulnerability and working with us throughout the process.

# Vulnerability Impact on Data
Sensitive information of multiple objects was exposed. Due to the two notable defenses as described in the Root Cause section, the scope of the information that was exposed was limited. Below is an overview of the objects and the confidential data that a user was able to access.

*Connection: users*
The GraphQL schema enables anyone to query the users on the platform. This is an intentional design decision. However, because every User object could be accessed, a significant amount of confidential information was accessible.

Below is an overview of all sensitive attributes that could be queried for every user on hackerone.com.

| **Sensitive attribute** | **Note** |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| account_recovery_phone_number | The last two digits of a verified account recovery phone number. |
| account_recovery_unverified_phone_number | The complete unverified account recovery phone number. |
| address | Accessible when swag was awarded for a report the authenticated user had access to, regardless of their role (e.g. publicly disclosed report). |
| calendar_token | The secret calendar token that exposes when HackerOne challenges were scheduled for the user. [This does not expose customer names](https://hackerone.com/reports/488643). |
| duplicate_users | An array of possible duplicate accounts based on platform behavior. |
| email | The email address. |
| otp_backup_codes | An array of bcrypt-hashed OTP backup codes. |
| payout_preferences | A connection of the user’s payout preferences. This does **not** include bank account details. |
| reports | See Report connection for the scope and attributes that were exposed. |
| unconfirmed_email | The unconfirmed email address. |

*Connection: teams*
The secure database schema, by default, allows any user to query public programs (teams) and public external programs. Because of the relationship between external programs and HackerOne programs, this data set includes programs who may be running a private program. This means it was possible to obtain internal triage notes and the policy of a select number of private programs the user did not have access to. The reporters queried partial program information, but they did not obtain any sensitive information that warranted HackerOne to reach out to any customers.

| **Sensitive attribute** | **Note** |
|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| average_bounty_lower_amount | The lower bound of the average bounty range. |
| average_bounty_upper_amount | The higher bound of the average bounty range. |
| base_bounty | The minimum bounty of a program. |
| bounties_total | The sum of awarded bounties in the entire lifetime of the program. |
| bug_count | The total number of resolved reports. |
| child_teams | A connection containing the hierarchy of teams. |
| first_response_time | A float containing the average time to first response. |
| goal_valid_reports | The goal of valid vulnerabilities per month the program set. |
| grace_period_remaining_in_days | The number of days the program has to recover from too many SLA failures to avoid their program being taken off HackerOne. |
| new_staleness_threshold | The internal SLA until a report is marked as an SLA miss when it hasn’t received a first response. |
| new_staleness_threshold_limit | The internal SLA until a report is marked as an SLA fail when it hasn’t received a first response. |
| policy | The program policy in raw markdown. |
| policy_html | The rendered program policy. |
| product_edition | The product edition the program uses. |
| report_submission_form_intro | The submission form introduction in raw markdown. |
| report_submission_form_intro_html | The rendered submission form introduction. |
| report_template | The default report template in raw markdown. |
| reporters | An array of user objects who have reporter access to the program. |
| resolution_time | A float containing the average time to resolution. |
| resolved_staleness_threshold | The internal SLA until a report is marked as an SLA miss when it hasn’t been resolved. |
| sla_failed_count | The number of reports failing the internal SLA. |
| structured_policy | A structured representation of the program policy. |
| structured_scopes | A connection that only disclosed an internal `reference` in case the user was authorized to see the structured scopes on the program page. |
| target_signal | A float representing the targeted signal of the program. |
| triage_bounty_management | A text field containing instructions for HackerOne’s triage team on how to handle bounty payments. |
| triage_enabled | A boolean field indicating whether the program uses HackerOne’s triage services. |
| triage_note | Internal triage notes in raw markdown. |
| triage_note_html | The rendered triage notes. |
| triage_time | A float containing the average time to triage. |
| triaged_staleness_threshold | The internal SLA until a report is marked as an SLA miss when it hasn’t been triaged. |
| triaged_staleness_threshold_limit | The internal SLA until a report is marked as an SLA fail when it hasn’t been triaged. |
| whitelisted_hackers | See `reporters`. |

*Connection: reports*
The reports data hasn’t been fully migrated to the secure database schema yet, which means that at the time the vulnerability was reported, only fully publicly disclosed and all reports the user participated in were accessible. This significantly reduced the number of report information that was exposed.

| **Sensitive attribute** | **Note** |
|-----------------------------|-----------------------------------------------------------------------------------------------|
| anc_reasons | An array of strings containing flags why the report was submitted to the HackerOne Human-Augmented Signal queue. |
| mediation_requested_at | A date/time field when mediation was requested. |
| pre_submission_review_state | A flag representing how Human-Augmented Signal responded to the report. |
| reference | An optional internal reference. |
| reference_link | An optional link to an internal ticket. |

Even though the reporters confirmed that they did not query more information than necessary to prove the vulnerability and that they have deleted the information, HackerOne has reached out to the people for which sensitive information was downloaded by the reporters.

**If your data was accessed during this incident, you have received a separate notification from HackerOne.**

# Preventative Measures
As part of our incident response process, we are conducting an internal review and analysis of the incident. We are taking the following actions to address the underlying causes of issues and to help prevent future occurrence:
* Consider leveraging the `graphql-ruby` gem hooks for built-in authorization callbacks to catch more edge cases
* Break the execution flow when an unexpected object is returned in the resolution of a connection field
* Reduce the complexity of connection type resolution

## Timeline

- **Report Filed**
- **2019-01-31** @yashrs: After further research, we also found the following:

- User email addresses also leak the private program information
- Duplicate users can give info about actual users. For example:  (jobert -> ███████, Michiel -> ██████████)
██████

- Invitation preference:
█████████

- T_shirt size
- edit_unclaimed_profiles(true/false)
- Lufthansa account(what is it?)
- Next username update date

Similarly, the total count on Users is ███, so we are able to extract information for any user and also for all if an attacker wants to.

Thanks,
Yash
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2019-01-31** @pandaonair: For instance, we are able to extact information about a hackerone staff member @still by using the feature of graphql, **after cursor**,` users(after:"MzY4MDYw")`. 

**P.S We haven't saved any other information other than mentioned here.**
```
{
 id
 {
   id
   team
   {
     _id
     about
   }
   uuid
 }
 me{    
   _id #388246
   id  #gid://hackerone/User/388246
 }
   users(after:"MzY4MDYw")
 {
total_count 
   pageInfo
   {
     hasNextPage
     endCursor
     startCursor
   }
   nodes()
   {
     _id
     name
     username
     hackerone_triager
     email
     authentication_service
     created_at
     duplicate_users
     {
       total_count
       nodes
       {
         _id
         name
         username
         bio
         bounties
         {
           average_amount
         }
         account_recovery_phone_number
         hackerone_triager
       }
     }
account_recovery_phone_number
     account_recovery_unverified_phone_number
     bounties
     {
       total_amount
     }
     otp_backup_codes
     i_can_update_username
     location
     #year_in_review_published_at
     anc_triager
     #blacklisted_from_hacker_publish
     calendar_token
     facebook_user_id
   }
 }
}
```

████
- **2019-02-01** @jobert: Hi @yashrs and @milind1997 - thanks for this. We're looking into this now and we'll keep you posted.
- **Report Triaged**
- **2019-02-01** @yashrs: Additionally, we found out that `teams()` was also affected. So this further widens the impact and attack surface of this report.

The **triage_note** shouldn't be visible to anyone. It reveals information like test accounts for hackers, SAML credentials and other sensitive information that should be only visible to HackerOne Team.
██████████

Also, as seen in the above screenshot, other information like `max_number_of_team_mediation_requests`, `last_invitation_accepted_at_for_user`, etc. were found. There maybe more to this, but we haven't investigated 100%.

Thanks,
Yash :)
- **2019-02-01** @jobert: Hi @yashrs and @milind1997 - thanks for continuing to look into this. We're aware that this exposes more data that you initially reported. We will follow up with the data that was possible to be queried in a post mortem. We'd kindly like to ask to stop testing right now. Thanks for your cooperation!
- **2019-02-01** @yashrs: Hello @jobert, 

Thanks for your quick response. We were just assessing the attack surface searching for worst case scenarios. But, now that you are aware about all the risks, we will stop. 

Thanks
-Yash :)
- **2019-02-01** @jobert: Hi @yashrs and @milind1997 - thanks again! We just deployed a fix for the vulnerability you discovered. Can you confirm the fix? We are continuing with our investigation to determine whether this has been abused. Thanks!
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **2019-02-01** @yashrs: I can confirm that it is fixed. I get an error from GraphQL now. That was quick :)
- **Report Resolved**
- **2019-02-01** @yashrs: > Thanks for confirming, it's much appreciated! We'll wrap up our investigation, provide a summary in this report with our root cause analysis, and award a bounty soon.

Thanks, that is much appreciated :) I'm so excited, it's my first accepted bug on Hackerone

> Unrelated to the vulnerability itself: we noticed that you're both collaborators on this report and we want to make sure that the weights are set correctly. Can you confirm this?

Thanks for noticing that @jobert, but yes I can confirm that it's correctly set.
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Title Updated**
- **Report Title Updated**
- **2019-02-02** @pandaonair: We are glad we could help make Hackerone more secure.
- **2019-02-02** @yashrs: Thank you so much @jobert and @hackerone team for fixing this so quickly and awarding the bounty :D

Do you think we are eligible for some swag? Would love to have one!
- **Swag Awarded**
- **2019-02-02** @pandaonair: Hello team, 
Two researchers collaborated, so do you think that the other researcher is also eligible for some swag?
- **2019-02-02** @yashrs: @jobert @security 
Slightly related to this vuln: The user himself is able to read the otp_backup_codes hashes. I know this doesn't cause any harm in general but just wanted to confirm if it's intended before this report is disclosed
```
{
 me{    
    _id #388246
    id  #gid://hackerone/User/388246
    otp_backup_codes
    username   
  }
}
```
Resp:
{F416558}


Thanks,
Yash :)
- **2019-02-02** @yashrs: Also, just curious: What is the difference between edges[node] and nodes.. why are there two fields which do the same thing?
- **2019-02-02** @jobert: > Two researchers collaborated, so do you think that the other researcher is also eligible for some swag?

Yes, we'll make sure to send both of you swag.

> The user himself is able to read the otp_backup_codes hashes. I know this doesn't cause any harm in general but just wanted to confirm if it's intended before this report is disclosed

Thanks for asking! It is currently intentional, but when we worked on this incident we noticed that this could be implemented in a different way. We'll likely remove it from the schema in some time.

> What is the difference between edges[node] and nodes.. why are there two fields which do the same thing?

Great question! From what I could see [in the commit history of the gem](https://github.com/rmosolgo/graphql-ruby/commit/cc6ce94032f49b8d732a4a134d7ea484e86d9d05#diff-9d2aa305e6bee5b203288ca963d6d4d4), it is simply a shorthand for `edges { node }`. It wasn't supposed to be added by default though, and so for compatibility the maintainer later accepted [a pull request](https://github.com/rmosolgo/graphql-ruby/pull/1693) to make it configurable.
- **Agreed On Going Public**
- **2019-02-03** @pandaonair: Hello @reed, please redact the last screenshot posted by @yashrs. Then we can disclose it.

Thanks

-Milind
- **2019-02-03** @reed: @milindpurswani done! Please accept disclosure. :-)
- **Agreed On Going Public**
- **Report Became Public**
- **2019-02-03** @yashrs: Also, shoutout to @milindpurswani for being cool and helping me out on this report! Thanks again!
- **2019-03-14** @yashrs: Hi @security team, 

I was just wondering if both the swag packs were sent from your end. I am asking because we haven't received the swag and nor have I received any email regarding that.

Thanks,
Yash :)
- **2019-03-16** @bencode: Lemme check @yashrs and I'll get back to you.
- **2019-03-18** @bencode: @yashrs can you email us at support@hackerone.com so we can discuss this? I'll give the support team a heads up.
- **2019-03-18** @yashrs: @bencode, thanks for looking into this. I have mailed the support team.

Regards,
@yashrs
