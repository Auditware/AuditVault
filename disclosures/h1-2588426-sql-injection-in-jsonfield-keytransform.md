---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/python
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2025-09-12
submitted: 2024-07-07T08:20:30.305Z
bounty_usd: null
votes: 68
cve: "CVE-2024-42005"
program: "[[programs/django|Django]]"
reporter: "eyalsec"
source: "https://hackerone.com/reports/2588426"
title: "SQL injection in JSONField KeyTransform"
---
# SQL injection in JSONField KeyTransform

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 68 | **Program:** Django | **Disclosed:** 2025-09-12

- Report: [https://hackerone.com/reports/2588426](https://hackerone.com/reports/2588426)
- CWE: SQL Injection | CVE: CVE-2024-42005
- Submitted: 2024-07-07T08:20:30.305Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Triaged**
- **2024-07-15** @eyalsec: Ty very much! :)

Yes

I would like to offer a patch.
let me think about it, and look more at the code and what i think the solution can be.
- **2024-07-17** @eyalsec: I still look at the code and try to create a patch.

I don't think that regex is the best solution for SQL injection.
The best way to handle SQL injection is by using a prepared statement, if there is a way to use a prepared statement then it would be the optimal thing.

I will give you an example why i don't like regex:
```
...
check_alias(sql_statment)
sql_statment = sql_statment.replace("value", user_controled_var)
...
```
maybe this code is not that common but when we use prepared statement for user input there is less room for mistakes.

Regex can solve the SQL injection, but solve it with prepared statement is more secure.
- **2024-07-17** @timgraham: No, Django [doesn't support prepared statements](https://code.djangoproject.com/ticket/20516).

The example code you gave shouldn't happen in Django. Generally, user input should always go to SQL `params` so it's escaped.
- **2024-07-17** @eyalsec: If there is no need for spaciel charecters in `field_names` then this maybe can be the fix.

I added this code to the `add_fields` function in https://github.com/django/django/blob/main/django/db/models/sql/query.py#L2188
```
import string

for field_name in field_names:
    for letter in field_name:
         if letter not in string.ascii_letters + "_":
              raise ValueError(
                   f"field_name %s can contain only letters and \"_\" (underscore)" % field_name
              )
```
{F3445296}
- **2024-07-17** @timgraham: I think we should use a prohibited characters regex as in the other patch I linked to. I believe there are no restrictions on what characters can be used in a JSON key, and we don't want to prevent the user from being able to query their data. If you run the Django test suite with your patch, you'll see that fields with numbers are being rejected. I'm going to create an issue in our security tracker so the entire Django security team can give their input.
- **2024-07-17** @eyalsec: If the problem is numbers we can add `string.digits`:

```
import string

for field_name in field_names:
    for letter in field_name:
         if letter not in string.ascii_letters + "_" + string.digits:
              raise ValueError(
                   f"field_name %s can contain only letters and \"_\" (underscore)" % field_name
              )
```

I am still not recommanding to use regex, I did big research on regex vulnerabilities, and regex is not known to be good at solving vulnerabilities.
I created an example of how i would do it.
The way I suggest is faster, easier to understand, and no import needed.
{F3447134}

This is what i would change the `check_alias` function to (just an idea for improvements).
```
def check_alias(self, alias):
    blacklist = ["'", "\"", "`", "[", "]", ";", " ", "--", '/*', "*/", "\n", "\t"]

    if any([i in alias for i in blacklist]):
        raise ValueError(
            "Column aliases cannot contain whitespace characters, quotation marks, "
            "semicolons, or SQL comments."
        )
```
I think the solution the you want to do is to add the below code to the `add_fields` function.
```
for field_name in field_names:
    self.check_alias(field_name)
```
{F3447164}
- **2024-07-24** @eyalsec: hi any update?
- **2024-07-25** @timgraham: The security team came up with the same fix. Here is the patch:
```diff
diff --git a/django/db/models/sql/query.py b/django/db/models/sql/query.py
index f00eb1e5a5..98704b47f4 100644
--- a/django/db/models/sql/query.py
+++ b/django/db/models/sql/query.py
@@ -2463,6 +2463,8 @@ def set_values(self, fields):
 
         selected = {}
         if fields:
+            for field in fields:
+                self.check_alias(field)
             field_names = []
             extra_names = []
             annotation_names = []
diff --git a/tests/expressions/models.py b/tests/expressions/models.py
index 31891a13d7..39f8104c52 100644
--- a/tests/expressions/models.py
+++ b/tests/expressions/models.py
@@ -45,6 +45,7 @@ class Company(models.Model):
         null=True,
     )
     based_in_eu = models.BooleanField(default=False)
+    metadata = models.JSONField(null=True)
 
     def __str__(self):
         return self.name
diff --git a/tests/expressions/test_queryset_values.py b/tests/expressions/test_queryset_values.py
index 80addef37b..183c42d3fa 100644
--- a/tests/expressions/test_queryset_values.py
+++ b/tests/expressions/test_queryset_values.py
@@ -40,6 +40,8 @@ def test_values_expression_alias_sql_injection(self):
             "Column aliases cannot contain whitespace characters, quotation marks, "
             "semicolons, or SQL comments."
         )
+        with self.assertRaisesMessage(ValueError, msg):
+            Company.objects.values(f"metadata__{crafted_alias}")
         with self.assertRaisesMessage(ValueError, msg):
             Company.objects.values(**{crafted_alias: F("ceo__salary")})

```
Would you like to be publicly credited when we disclose and fix this? Is your full name Eyal Gabay? Thanks.
- **2024-07-25** @eyalsec: Yes I want it to be public.
My name is Eyal Gabay and you can also add my business name EyalSec.

Also what is the severty of the vulnerability?

Thank you very much! :)
- **2024-07-25** @timgraham: SQL injection is severity level "high" as per https://docs.djangoproject.com/en/5.0/internals/security/#how-django-discloses-security-issues.
- **2024-07-26** @eyalsec: I want to add that the vulnerability work also on `values_list` method.

The fix is fixing the `values_list` method too, so no additional work required.
- **2024-08-03** @eyalsec: When do i get cve?
When can i report to IBB (internet bug bounty)?
Is there anything else that i can help you with this report?
- **2024-08-03** @timgraham: This will be disclosed and fixed on Tuesday with Django versions 5.0.8 and 4.2.15.
- **Cve Id Added**
- **2024-08-23** @eyalsec: Is there a way in django to get a critical severity vulnerability, or "High" is the biggest severity?
If i find RCE 0 click as root will it be "High" as well?
- **2024-08-23** @timgraham: Django's own severity levels are documented at https://docs.djangoproject.com/en/dev/internals/security/#how-django-discloses-security-issues. We do not decide the CVSS severity.
- **Report Severity Updated**
- **Report Resolved**
- **2025-03-23** @eyalsec: Yes I did :)
Thank You very much!
- **2025-03-23** @eyalsec: Yes I did :)
Thank You very much!
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
