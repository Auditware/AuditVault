---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2019-04-02
submitted: 2019-03-08T07:49:04.488Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "verichains"
source: "https://hackerone.com/reports/506654"
title: "[typeorm] SQL Injection"
---
# [typeorm] SQL Injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2019-04-02

- Report: [https://hackerone.com/reports/506654](https://hackerone.com/reports/506654)
- CWE: SQL Injection
- Submitted: 2019-03-08T07:49:04.488Z

## Timeline

- **Report Filed**
- **2019-03-08** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2019-03-08** @ronperris: Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as a vulnerability.

I invited the package maintainer to this issue.
- **Report Triaged**
- **2019-03-08** @verichains: Thank you!
- **External User Joined**
- **2019-03-08** @pleerock: Thank you for your report. It is by design. Function syntax, e.g. `() => string` is used to inject sql statements across your code / into your final sql string. It is supposed to bring sql support in the place It is by design. E.g. `{ name: 'safe-sql-string' }` is injection-free, but `{ name: () => 'unsafe-sql-string' }` isn't injection free and used to build sql strings. This particular syntax doesn't make sense in query builder (just like using function in there) but it does in some different places, and this conception just followed by query builder.
- **2019-03-08** @ronperris: @pleerock Thanks for the quick response.

I couldn't find any tests for escapeQueryWithParameters but I did find this documentation on its API.

```
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
```
https://github.com/typeorm/typeorm/blob/d9f5581b22c4cccfab55ee23fad699e1c8acadf8/src/driver/mysql/MysqlDriver.ts#L368

The comment above and the function name containing the word `escapeQuery` would make me think that this function escapes queries.

 I know you said that this is "by design" but that isn't clear from the the source code, tests or documentation.

We will continue to triage this as a vulnerability.
- **2019-03-08** @pleerock: Your resolution on continuing this to triage as a vulnerability based on the provided arguments is doubtful.

Based on your arguments first thing I thought on how to resolve this issue is to append additional docs to the escapeQueryWithParameters method. But it won't change anything, because:

* this method itself isn't publicly used a lot, its hard for a user to get to this method and read its docs. By isn't used publicly I mean 99% of users most probably won't ever use this method directly.
* its being supporting a function that leads to sql instead of escaping is an implementation detail (treat it as something that still allows you to use sql in some your exceptional scenarios), its name can't be `escapeQueryButResolveFunctionSpecificallyAndAlsoCoverXandYExceptionalScenarios`.
* also what if it was a nameless function? It's not right to make a final thoughts just based on a function name.
* code itself is a documentation, what if it was missing documentation block at all just like any other lib.

This feature is covered many times in github issues (and github issues is another source of documentation), here is example on how this can be used:

```ts
createQueryBuilder()
    .update({
          name: 'Timber', // this one is escaped
          age: () => `age + 1` // this one isn't and its because we have a specific, but very important use case. We want to just increment age, but we can't resolve it using escaped parameter
    })
```
- **2019-03-08** @ronperris: @pleerock 

Thanks for the additional information.

How about updating this section of the docs with an example showing the function syntax and explaining that this is a way to opt out of escaping?

https://github.com/typeorm/typeorm/blob/d9f5581b22c4cccfab55ee23fad699e1c8acadf8/docs/select-query-builder.md#using-parameters-to-escape-data
- **2019-03-09** @verichains: I agree with @ronperris, I think it's better to document within query builder section, in complex codebase people can by mistake provide a getter function and it still work for numeric input so they do not realize anything, even if they read all the document on https://typeorm.io/.
- **2019-03-09** @verichains: I think you can do like DB::raw in Laravel for this purpose
https://laravel.com/docs/5.8/queries#raw-expressions
So instead of using function you can use a typed expression like:

```ts
createQueryBuilder()
    .update({
          name: 'Timber', // this one is escaped
          age: Raw(`age + 1`)
    })
```

This way will help coder know exactly what they do.
- **2019-03-09** @pleerock: @h3dx thanks for your suggestion, but Laravel has its own syntax and TypeORM has its own. But we already have Raw operator that behaves this way but in a different place, we might use it everywhere in the future.

@ronperris I decided to remove this functionality from SelectQueryBuilder since it doesn't make a lot sense, however this functionality still persist in the InsertQueryBuilder and UpdateQueryBuilder. You can take a look changes [here](https://github.com/typeorm/typeorm/pull/3787). I'm going to release a new version in next few days.
- **2019-03-09** @verichains: Seems great @pleerock.
For the Raw operator i mean something like `value instanceof Raw` instead of `value instanceof Function` and `Raw('expression')` instead of `()=>'expression'` which is minimal that is compatible with your Function approach and also verbose enough so that developer must sure what they are doing. Anyway, your approach also solved these, that's great.
- **2019-03-09** @pleerock: @h3dx yes I've got your point. Not sure it may already work (we already have Raw operator). But anyway function operator will persist for now.
- **Report Title Updated**
- **2019-03-15** @pleerock: @ronperris PR with docs is merged and new version is released btw
- **2019-03-18** @verichains: Great work @pleerock, can we disclosure now?
- **2019-03-23** @verichains: @ronperris any update?
- **Report Resolved**
- **2019-03-30** @ronperris: @pleerock Can you point me to the PR that fixed the issue?
- **2019-03-30** @verichains: @ronperris I think it's this one https://github.com/typeorm/typeorm/pull/3787, @pleerock added documenting and tests.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-05-19** @verichains: @ronperris any update with the CVE?
