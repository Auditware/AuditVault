---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2023-12-08
submitted: 2023-11-23T12:52:16.197Z
bounty_usd: 25000
votes: 531
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "megaman_"
source: "https://hackerone.com/reports/2262382"
title: "Server Side Request Forgery (SSRF) via Analytics Reports"
---
# Server Side Request Forgery (SSRF) via Analytics Reports

> **Severity:** Critical | **Bounty:** 25,000 USD | **Votes:** 531 | **Program:** HackerOne | **Disclosed:** 2023-12-08

- Report: [https://hackerone.com/reports/2262382](https://hackerone.com/reports/2262382)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2023-11-23T12:52:16.197Z

## Report summary

# Report Conclusion:

+ ## The Main Issue:
> I was able to access *AWS Credentials* using an *SSRF* vulnerability by injecting an `<iframe>` tag into `template` element when generating a `PDF` of analytics reports.
+ ## The potential impacts of this vulnerability:
> 1. Ability to read internal files.
> 2. Unauthorized Access to AWS Credentials.
> 3. Manipulating AWS resources.
> 4. Possibility of Data Loss.
> 5. Accounts Takeover.
> 7. Executing Arbitrary Commands.

+ ## What did I do when I found this vulnerability:
> I quickly reported this issue as soon as I found it, then I was trying to find the quickest way to alert Hackerone team as quickly as possible, especially because I know it could take some days for a response. then I thought about sending a message to some of the Hackerone triage team, I was expecting a response within a few hours but it doesn't happened. So I decided to send a message to @jobert, and I was really surprised by his quick and kind response.


+ ## How the Hackerone team was responsible for fixing this issue and how they responded:
> I was really surprised by Hackerone quick response, they have fixed the issue and let me retest it in less than 24 hours. They are a very collaborative team.

+ ## Supporting Material/References:
> + [What to Do If You Inadvertently Expose an AWS Access Key.](https://aws.amazon.com/blogs/security/what-to-do-if-you-inadvertently-expose-an-aws-access-key/)
> + [How to prevent server-side request forgery. (SSRF)](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
> + [How to prevent HTML injection.](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
> + [How to write high quality reports.](https://docs.hackerone.com/en/articles/8475116-quality-reports)
> + [How To: Server-Side Request Forgery (SSRF)](https://www.hackerone.com/application-security/how-server-side-request-forgery-ssrf)


Thanks for reading and have a nice day!

*Best Regards,*
*@Mega7*

We recently received a critical server-side request forgery (SSRF) vulnerability report through our bug bounty program. The issue allowed attackers to make internal requests from our application servers by exploiting a lack of output sanitization in an error message. By crafting malicious requests, an attacker could have accessed internal AWS services and obtained temporary credentials. 

Upon receiving the report, we were able to reproduce and verify the issue. We have implemented a fix that is now deployed in production. Below you can see that element[:template] wasn’t properly sanitized in the error message. The value being returned `html_without_layout` is being fed into a library that converts this into a PDF.

Diff: 

```ruby
             
html_without_layout = elements.map do |element|
  case element[:type]
  when 'template'
    path = template_path(element)
    if path
      ApplicationController.new.render_to_string(
        partial: path,
        layout: false,
        assigns: {
          include_css: true,
        },
        locals: {
          query_results:,
          constants: PSR_CONSTANTS,
          retesting_reports: retesting_reports,
          reporters: reporters,
          total_submission_count: total_submission_count,
          in_scope_asset_count: in_scope_asset_count,
          report_asset_count: report_asset_count,
        },
      )  
    else
-    "Missing template for element: #{element[:template]}"
+    "Missing template for element"

```

We have also added regression tests to prevent future occurrences of this vulnerability. 

Our forensic investigation concluded that there is no evidence this issue was exploited prior to the report.

We have rated this vulnerability CVSSv3 10 (Critical) based on the potential impact of exposed credentials: 

CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N/CR:H/IR:H/AR:H. 

We want to thank @mega7 for sending in their report; reports like this one are invaluable for us to continue enhancing our security posture. We also appreciate them for stopping at the right point in testing, demonstrating a responsible and ethical approach.

## Timeline

- **Report Filed**
- **2023-11-23** @megaman_: ### Steps:
1. Navigate to https://hackerone.com/organizations/ORG/analytics/reports
2. Create new report.
3. Choose some filters.
4. Click on "Apply". [intercept the request in this step]
5. in any `"template"` field; inject any HTML payload.
6. Now inject an `<Iframe>` to read internal files as shown in the above POC.

{F2878646}

Thanks!
- **2023-11-23** @megaman_: poc:
> 169.254.169.254/latest/meta-data/hostname : 
█████████download

> 169.254.169.254/latest/meta-data/ :
███
- **2023-11-23** @megaman_: Now this is Critical:
https://hackerone.com/organizations██████████_demo/analytics/reports/2836/download
██████████
- **2023-11-24** @megaman_: Hi all,
This is just a kind reminder,
This is a critical vulnerability and should be fixed as soon as possible!

 I think that I have the ability to takeover the whole HackerOne company using this secret access key!

> Based on this report, I suggest creating an option for”Urgent Security Reports”
So hackers can indicate that the reported security vulnerability is urgent, and needs to be looked at right now.

Thanks.
- **2023-11-24** @megaman_: I sent a message 10 minutes ago from `█████████` to :
> `████`, @h1_analyst_grace
`████`, @h1_analyst_alexander
`████`, @h1_analyst_lucas
`█████`, @h1_analyst_ivan
`█████████`, @h1_analyst_diego
`█████` @h1_analyst_oliver


I hope someone can see the report and take actions as soon as possible.
Thanks.

Best Regards,
@Mega7
- **2023-11-24** @h1_analyst_pranav: Hi @mega7 ,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_pranav
- **Report Severity Updated**
- **Report Pending Program Review**
- **2023-11-24** @h1_analyst_pranav: Final severity will be updated by internal team based on final review.
- **2023-11-24** @0daybookworm: Hello @mega7 ,

We have validated your submission and our team is working on a fix to remediate it. We appreciate your patience and team will discuss severity on Monday and will update you.

Thanks!
- **Report Triaged**
- **Report Retesting**
- **Report Title Updated**
- **2023-11-24** @0daybookworm: @mega7,

We want to extend our sincere gratitude for bringing the security issue to our attention.

We understood the importance of this issue and were committed to addressing it responsibly. To ensure we make the most accurate and informed decision, our team plans to discuss the severity of the reported vulnerability this Monday when all key members are available as we want to ensure that our response aligns with best practices and is fair to all parties involved.

Your patience in this matter is highly valued. We aim to update you promptly following our discussion, and rest assured, we are taking your report very seriously.

Thank you once again for your contribution to the security of our platform. We’re truly grateful to have engaged and skilled individuals like yourself assisting in keeping our digital environment secure.

~ HackerOne
- **User Completed Retest**
- **2023-11-25** @megaman_: Hello all,
Thanks for your kind and very fast responses! I hope you are all doing the best! I'm sure you are!
> I'm writing this comment to hopefully help and highlight some of the potential impacts to the team while discussing the severity of this reported vulnerability and the risks associated with it. 

By exploiting this vulnerability, an attacker can do the following:

+ **SSRF vulnerability:** 
> which allowed unauthorized access to internal files, including sensitive information located at “169.254.169.254”. This alone highlights the seriousness of the vulnerability.

+ **Unauthorized Access to AWS Credentials:**
> Through the exploitation of the SSRF vulnerability, I was able to obtain the AWS `AccessKeyId` and `SecretAccessKey`. which provide extensive control and access to your organization's AWS resources.

+ **Manipulating AWS resources:**
> This can result in perform any action in your account permitted by the policies associated with those credentials, such as launching an Amazon EC2 instance and storing objects in Amazon S3, etc.

+ **Potential for Data Loss:**
> There is a high risk of unauthorized modifications, data breach and loss, which could include sensitive customer data, intellectual property, or other valuable information.

+ **Takeover of User Accounts:**
> Another alarming consequence of this vulnerability is the ability to create malicious files which leads to stored XSS that can steal user tokens and gaining unauthorized access to personal information and perform actions on behalf of legitimate users, identity theft, financial loss. Also this vulnerability could also extend to the triage team, including administrators and employers involved in website management, so attackers could gain administrative privileges, effectively taking control of the triage team's accounts and their associated actions, make unauthorized changes, and potentially disrupt critical operations.

6. **Executing arbitrary commands:**
> Gaining complete control over the affected system, potentially leading to severe consequences, including unauthorized execution of commands, and even the possibility of obtaining a reverse shell, for example;
`aws ssm send-command --document-name "AWS-RunShellScript" --parameters 'commands=["curl ..."]' `

Please let me know if you want me to provide any additional information.
Thanks for your immediate attention to this issue  and have a nice day!

Best Regards,
@Mega7
- **2023-11-27** @z0x01: Just a quick update: we're still in the midst of our discussion. Due to the time zone differences among us, it might take a bit longer to finalize our response. Thanks for your patience, and we'll get back to you as soon as possible.
- **2023-11-28** @megaman_: Hello everyone, I really appreciate your immediate attention and kind responses,

I was just concerned about fixing this vulnerability;
> When I reported this issue, I was trying to find the quickest way to alert you as quickly as possible, especially because I know it could take days for a response. So I thought about sending a message to some of the Hackerone triage team, but I didn't hear back. then I decided to send a message to @jobert, and I was really surprised by his quick and kind response.
+ {F2887813}

+ So I just mean that I have no problem if it takes longer to respond, the most important thing here is that you have fixed the vulnerability very quickly.
So Please take your time.

> And again, this is just a kind suggestion; 
+ Based on this report, I suggest creating an option for ”Urgent Security Reports”
So hackers can indicate that the reported security vulnerability is urgent, and needs to be looked at right now.
+ {F2887830}

Thank you all and have a nice day!

*Best Regards*,
*@Mega7*
- **Report Severity Updated**
- **Report Retest Approved**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2023-11-28** @z0x01: We have received your request for disclosure and will discuss it with our team. 
Thank you for your patience; we will respond to you at the earliest opportunity.
- **2023-12-01** @megaman_: Hi @z0x01 ,
Thanks for your kind response.
I have tried to bypass this issue but I don't think this is possible any more.
So feel free to accept the disclosure request this week if possible.

Thanks!
- **2023-12-06** @megaman_: Hi all , @z0x01 , @0daybookworm , @h1_analyst_pranav ,
I hope you are well!

This is just a kind reminder about the disclosure request,
Is it possible to disclose this report?

Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
