---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2020-08-26
submitted: 2020-06-09T15:53:22.000Z
bounty_usd: 12000
votes: 307
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "u3mur4"
source: "https://hackerone.com/reports/894569"
title: "An attacker can run pipeline jobs as arbitrary user"
---
# An attacker can run pipeline jobs as arbitrary user

> **Severity:** Critical | **Bounty:** 12,000 USD | **Votes:** 307 | **Program:** GitLab | **Disclosed:** 2020-08-26

- Report: [https://hackerone.com/reports/894569](https://hackerone.com/reports/894569)
- CWE: Business Logic Errors
- Submitted: 2020-06-09T15:53:22.000Z

## Timeline

- **Report Filed**
- **2020-06-09** @u3mur4: I’ll add a video version right away to make it more understandable.
- **2020-06-09** @gitlab-securitybot: Hi @u3mur4,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2020-06-09** @u3mur4: Here is the video version.
{F861141}

Also this behavior is intentional (but obviously not secure). I received an email while making the video.
```
The mirror user for test742/poc has been changed from Attacker Second Account to yourself because their account was deleted.

You can change this setting from the repository settings page.
```
- **2020-06-09** @u3mur4: I think this feature was introduced in the `4d52c01516c80f40520896809b9bf0da00ee6c7e` commit on 2018.03.05.
```diff
@@ -0,0 +1,34 @@
+module EE
+  module Users
+    module DestroyService
+      extend ::Gitlab::Utils::Override
+
+      override :execute
+      def execute(user, options = {})
+        super(user, options) do |delete_user|
+          mirror_cleanup(delete_user)
+        end
+      end
+
+      def mirror_cleanup(user)
+        user_mirrors = ::Project.where(mirror_user: user)
+
+        user_mirrors.find_each do |mirror|
+          new_mirror_user = first_mirror_owner(user, mirror)
+
+          mirror.update_attributes(mirror_user: new_mirror_user)
+          ::NotificationService.new.project_mirror_user_changed(new_mirror_user, user.name, mirror)
+        end
+      end
+
+      private
+
+      def first_mirror_owner(user, mirror)
+        mirror_owners = mirror.team.owners
+        mirror_owners -= [user]
+
+        mirror_owners.first
+      end
+    end
+  end
+end
```

https://gitlab.com/gitlab-org/gitlab/blob/master/ee/app/services/ee/users/destroy_service.rb#L19
- **2020-06-10** @gitlab-securitybot: ETA for fix:

Hi @u3mur4,

The issue you reported is currently scheduled to be fixed by 2020-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
