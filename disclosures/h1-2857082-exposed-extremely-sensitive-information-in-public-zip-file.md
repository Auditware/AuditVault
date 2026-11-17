---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
date: 2026-01-12
submitted: 2024-11-20T21:40:16.461Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "aldenpartridge"
source: "https://hackerone.com/reports/2857082"
title: "Exposed Extremely Sensitive Information in Public ZIP File"
---
# Exposed Extremely Sensitive Information in Public ZIP File

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/2857082](https://hackerone.com/reports/2857082)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2024-11-20T21:40:16.461Z

## Timeline

- **Report Filed**
- **2024-11-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2024-11-21** @aldenpartridge: The ZIP file contains a complete copy of the backend codebase, including PHP files and other resources. By analyzing these files, an attacker could gain a comprehensive understanding of the backend's functionality, logic, and configuration. This knowledge could be leveraged to identify vulnerabilities, misconfigurations, or exploitable code paths. In particular, it could allow an attacker to craft targeted payloads to achieve Remote Code Execution (RCE), leading to full compromise of the backend system.
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2024-11-22** @aldenpartridge: I can confirm that both sets of the credentials still work. I was able to successfully access both services, including BOTH us-gov-east-1 and us-gov-west-1 aws s3 regions. This gave me access to 25 buckets containing extremely sensitive government data. Additionally, I was able to use the SMTP credentials to successfully hijack support@██████████.org and email myself. Upon further inspection, I noticed that the AWS secret key is publicly accessible outside of the zip file, just right there in the javascript files!!!!! (https://██████████/scripts/i.js). This is HIGHLY sensitive information that should be dealt with ASAP.
████
███
- **2024-11-25** @aldenpartridge: To give another point as to how serious the SMTP access is by itself; I was able to fully access "support@█████.org".

Now, if I were a bad actor and wanted to conduct a phishing campaign against DoD employees or members of our military, I could take advantage of this seemingly trustable email address and send something like the following:

### Subject: Action Required: Complete Your ██████████ Partner Update  

#### Body:  

Dear [Recipient's Name],  

As a valued partner of the **DoD █████████ Program**, we are notifying you of an **urgent requirement** to update your organization's application materials to remain compliant with FY25 guidelines.  

To streamline the renewal process and ensure your continued access to the Partner CMS Portal, please download and complete the attached files:  

1. **██████_Update_Tool.exe**  
   - A simplified tool for reviewing and submitting application details.  

2. **FY25_Application_Form.xlsm**  
   - The updated application form, including embedded guidance for completion.  

#### Steps to Complete Your Update:  

1. **Download the necessary files:**  
   👉 [Download █████████ Update Tool](██████████_Update_Tool.exe)  
   👉 [Download FY25 Application Form]FY25_Application_Form.xlsm)  

2. **Open the `█████_Update_Tool.exe`** to initiate the partner update process.  
3. Fill out the required sections of the **FY25 Application Form** and enable macros for guided completion.  
4. Submit the completed form directly via the CMS portal or email it to **partner-updates@dod-██████████.com**.  

Failure to complete these steps by **1 December 2024** may result in the suspension of your ██████████ partnership privileges.  

If you have questions or encounter issues, please contact us at **support@██████████.com**.  

Thank you for your immediate attention to this matter and for supporting our transitioning service members.  

Warm regards,  
**The DoD ███████ Team**  
[DoD ████████ Program](https://██████)  


_______

With this example, I could have embedded malicious macros into an excel spreadsheet that would then execute when the target downloads and opens the file. In addition, I included a malicious "████████_Update_Tool.exe". All in all, this vulnerability demonstrates an extreme threat to DoD security.
- **Report Needs More Info**
- **Report New**
- **2024-11-25** @aldenpartridge: I would personally consider this very critical to the DoD and in a sense, national security. I would definitely make sure to check the AWS logs to see if any bad actors had previously accessed the data.
- **Report Severity Updated**
- **Report Triaged**
- **2024-11-25** @aldenpartridge: Awesome, thank you so much!
- **2024-11-26** @aldenpartridge: I also want to include that the S3 credentials are also publically available at https://████████/scripts/i.js
- **2024-11-27** @agent-p1: Greetings!
@aldenpartridge  Because of this report you have been selected as our Researcher of the Month. Would you like your name to be on the certificate that is tweeted out? If so, would you provide me your name for that? Do you have a twitter handle for us to tag you in? If you do not, or would not like to, then we would use you Hackerone username. Thank you!
Regards,
The DoD VDP team
- **2024-11-27** @aldenpartridge: Thank you so much! This is an honor!

My name is Kyan Macdonald but I don't have a twitter handle. Could you include my hackerone profile instead?
- **2024-11-27** @aldenpartridge: Actually, to make it easier I will create a twitter account.
I will reply back in a couple of minutes with the  handle.
- **2024-11-27** @aldenpartridge: Okay, I created a twitter account at https://x.com/0xKMac

Is  it possible to notify my school aswell? I go to Norwich University and am a member of the Corps of Cadets there. It would mean a lot if I could promote Norwich University and  our cybersecurity club "Unit 1819". I truly could not have developed my skillset without Norwich.
- **2024-11-27** @aldenpartridge: Also, am I allowed to discuss anything about this report with anyone from my school? They are going to ask questions. I completely understand if not.
- **2024-11-27** @aldenpartridge: Sorry for the message spam, but finally;
I have to wait for my cybersecurity cohort; the Cyber Leader Devlelopment Program (CLDP) to get the appropriate verbiage that they would want me to include.
- **2024-11-27** @agent-p1: Greetings, 

In order to discuss this report you will need to request disclosure after said report is resolved. Once approve and redacted you may share the details of this report minus the asset that is associated with the vulnerability. Please follow the legal guidelines of this program. Lastly we will not be able to provide a notification to your school, just a certification with the twitter write up at our DOD VDP twitter profile. 

Thank you for your time. 
The VDP Team
- **2024-11-27** @aldenpartridge: Okay, thank you. Would it at least be possible to include that I am  a part of the DoD Cyber Insitutes’ Cyber Leader Development Program?
- **2024-12-04** @aldenpartridge: Hello, I was wondering if there were any updates. I checked again and the credentials are still publicly accessible. I am very worried that the wrong person could get their hands on this and cause serious damage the United States.
- **Report Resolved**
- **2024-12-17** @aldenpartridge: Awesome, thank you! Can I request disclosure?
- **Agreed On Going Public**
- **2025-02-04** @aldenpartridge: I wanted to check back in on the program and while I am happy that █████████/data/███████.zip was removed, I am still able to access the s3 credentials by simply navigating to https://██████/scripts/i.js. I would highly, highly recommend a complete audit of the attack surface of ██████.mil.
- **Cancelled Disclosure Request**
- **2025-02-04** @aldenpartridge: █████████
- **2025-02-06** @aldenpartridge: █████
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
