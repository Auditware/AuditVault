---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/open-redirect
  - env/web
  - vuln/open-redirect
  - impact/financial
  - impact/sensitive-data
  - trigger/social-engineering
substate: "resolved"
weakness: "Open Redirect"
enriched: true
body: true
date: 2023-06-08
submitted: 2023-04-14T02:48:43.133Z
bounty_usd: null
votes: 148
cve: "CVE-2023-28364"
program: "[[programs/brave|Brave Software]]"
reporter: "roland_hack"
source: "https://hackerone.com/reports/1946534"
title: "Open redirect due to scanning QR code via brave browser"
---
# Open redirect due to scanning QR code via brave browser

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 148 | **Program:** Brave Software | **Disclosed:** 2023-06-08

- Report: [https://hackerone.com/reports/1946534](https://hackerone.com/reports/1946534)
- CWE: Open Redirect | CVE: CVE-2023-28364
- Submitted: 2023-04-14T02:48:43.133Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please fill all sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to verify and then potentially issue a bounty.

## Summary:
This vulnerability was discovered in Brave's QR code scanner, which allows users to read QR codes and open corresponding links. Exploitation of this vulnerability allows attackers to direct users to malicious sites without their consent or knowledge. This vulnerability can put the security of Brave users at risk and allow them to be exposed to phishing, phishing and malware attacks. In this report, we'll describe the vulnerability in more detail, assess its severity, and provide recommendations to address it.



## Products affected: 

Brave 1.50.114, Chromium 112.0.5615.49 on Android 11; Build/RP1A.200720.011

## Steps To Reproduce:

{F2291837}

The QR code above is the one I generated to replicate the attack.
To create my QR code, I used the site https://app.qr-code-generator.com.
 I included a malicious link in this QR code. As an example link, I used www.evil.com

#  Steps To Reproduce

 -  Open the browser 
- Then in your browser you can click on the "scan a QR code" option and scan the QR code in which I have included my malicious link. 
This will automatically redirect you to the malicious site I inserted in the QR code, without even asking your opinion.
- However, some QR code scanners do not automatically redirect the user to the malicious site, but rather display the link with the "Go to site" option. Other scanners don't even show this option. 
- However, in the case of Brave, the browser automatically redirects the user to the malicious site without their consent, which poses a significant security risk to users.


## Supporting Material/References:

https://resources.infosecinstitute.com/topic/security-attacks-via-malicious-qr-codes/
https://shahjerry33.medium.com/open-redirection-qr-code-magic-18ace1a0170f

## Impact

Here are some potential business impacts that this security vulnerability could have in Brave 1.50.114, Chromium 112.0.5615.49 on Android 11; Build/RP1A.200720.011:

The fact that Brave's QR code scanner opens the link without the user's notice has a big impact on user security. This vulnerability allows an attacker to redirect a Brave user to a malicious site without the user being able to see the link and make an informed decision. This can lead to exposure to malware or phishing attacks that can compromise user data.

The actual impact depends on the nature of the malicious link to which the user is redirected. In the worst case, the link may be designed to steal sensitive information, such as credit card information, credentials, or other personal information. This can lead to loss of privacy and financial damage to the user.

Moreover, if the user is redirected to a malicious site that contains malware, then it can compromise the security of the user's device and lead to loss of important data. Overall, the fact that Brave's QR code scanner automatically opens malicious links without user's notice poses a significant risk to user security and should be fixed as soon as possible.

    Increased Risk of Phishing: Exploiting this vulnerability could allow attackers to direct Brave users to malicious sites that can be used to steal sensitive information such as usernames, passwords, banking and other personal information.

    Exposure to malware: Malicious sites that users are redirected to may also contain malware that can infect Brave users' devices with malicious programs such as viruses, Trojans or ransomware.

    Privacy loss: Brave users may also be at risk of privacy loss if sensitive information is stolen as a result of the exploitation of this vulnerability.

    Loss of user trust: If Brave users fall victim to attacks as a result of exploiting this vulnerability, they may lose trust in the application and seek out more secure alternatives, which could impact reputation of the application and the company.

    Financial costs: If users fall victim to attacks as a result of this vulnerability, they may suffer financial losses, which may lead to legal action and financial costs to the company responsible for the application.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2023-04-14** @kdenhar: Thanks, we'll take a look at this and get back to you.
- **2023-04-14** @roland_hack: With this vulnerability we can even download any file of our choice to a target without his authorization, without him even clicking on download, I will attach two QR codes, one to download a pdf file and the 'one to download an application of my choice insert in the QR code
- **2023-04-14** @roland_hack: QR code from pdf file
{F2293076}
- **2023-04-14** @roland_hack: QR code to download the application to the target
In this case I did not put a malicious application, just to show you an example I put the application Make Money - Cash Earning App

Link leading to the application
https://apkpure.com/make-money-cash-earning-app/com.tvtwo.highest.paying.cash.app.make.money.surveys.rewards.free.income

QR code I generated that automatically downloads the app:
{F2293096}
- **2023-04-14** @roland_hack: link that I put in the QR code which automatically downloads the application

https://d.apkpure.com/b/APK/com.tvtwo.highest.paying.cash.app.make.money.surveys.rewards.free.income?version=latest
- **2023-04-14** @roland_hack: {F2293728}
- **2023-04-14** @roland_hack: In the video you will see that once the QR code has been scanned even without showing the user what it is, it will start by automatically downloading the application
- **2023-04-14** @diracdeltas: @roland_hack have you tested this on chrome android? does it behave the same?
- **2023-04-14** @roland_hack: Hello @diracdeltas 
yes I tested with chrome on Android it's not the same
- **Report Triaged**
- **2023-04-15** @roland_hack: It's not just on Android, even on IOS too, please review for all versions whether on Android or IOS
- **2023-04-15** @roland_hack: Good evening @artem_chaikin @diracdeltas  @kdenhar 
 I would like to request a reassessment of the criticality of the open redirect present in the Brave application, which I previously rated as "high". After carefully reviewing this vulnerability, I believe it poses a high risk to users' security and privacy, especially when using the built-in QR code scanner. Therefore, I recommend reviewing the criticality and classifying it as "critical". 

Thank you for your attention and cooperation
 Cordially @roland_hack
- **2023-04-21** @roland_hack: Good morning @artem_chaikin @diracdeltas  @kdenhar 

It's been 5 days since I made a severity update request, and I still haven't had any feedbacks. Could you look into it and tell me what the status is or what is holding up my request?
Thank you
cordially @roland_hack
- **2023-04-21** @artem_chaikin: Hi @roland_hack
Thank you for your response and for providing additional information regarding your report. After further consideration and review, we have determined that the severity rating of the issue you reported will remain at high, rather than being raised to critical.
One of the main factors that influenced our decision is the fact that an attacked user would need to interact with the browser for the exploit to be successful. While we acknowledge that this vulnerability could be used to harm users in certain scenarios, we believe that the level of interaction required from the user reduces the overall risk and impact of the vulnerability.
- **2023-04-22** @roland_hack: Hello @artem_chaikin @diracdeltas  @kdenhar 

I thank you for your feedback. Although the severity rating cannot be raised to "critical", I am reassured to see that you take this vulnerability seriously.
Thank you for your commitment to providing a safe and secure product for all users. I'm interested to know if I will be able to get a CVE after this vulnerability is fixed because I really care about this
Thanks you 
cordially @roland_hack
- **Report Resolved**
- **Bounty Awarded**
- **2023-04-29** @roland_hack: Hello @diracdeltas  @kdenhar  @artem_chaikin 
In the Brave Software program policy it says: hacker swag is available upon request, I would like to request the swag

Cordially @roland_hack
- **2023-04-29** @diracdeltas: @roland_hack please email your shirt size and shipping address to ██████
- **2023-04-29** @roland_hack: THANKS 
Ok it's done, I just sent him a message by email
Cordially @roland_hack
- **2023-05-16** @roland_hack: Hello @diracdeltas  @kdenhar  @artem_chaikin 

I want to thank you for the swag,However, I would like to know if you had already concluded the version in which the vulnerability will be fixed please quickly patch this vulnerability because it endangers brave browser users 
Cordially @roland_hack
- **2023-05-16** @artem_chaikin: Hi @roland_hack. iOS and Android patches were merged, but it's not on the release channel yet. We expect these fixes to be included in 1.52 for Android and 1.51 for iOS
- **2023-05-16** @roland_hack: ok great, since you already knew the versions in which the patches will be applied you can now request the CVE for me
- **2023-05-16** @diracdeltas: Like I said, we can't issue the CVE until it's in the release channel.
- **2023-05-17** @roland_hack: Hello @diracdeltas  @artem_chaikin  @kdenhar 

OK it is understood
 THANKS You
Cordially @roland_hack
- **2023-06-01** @diracdeltas: requesting the CVE now since it's in 1.52.117
- **2023-06-01** @roland_hack: Hello @diracdeltas  @kdenhar @artem_chaikin 
Thanks you 😊
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
