---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
  - vuln/xss
  - fix/csp
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2023-02-19
submitted: 2022-08-10T15:47:55.453Z
bounty_usd: null
votes: 169
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "yvvdwf"
source: "https://hackerone.com/reports/1665658"
title: "Stored-XSS with CSP-bypass via labels' color"
---
# Stored-XSS with CSP-bypass via labels' color

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 169 | **Program:** GitLab | **Disclosed:** 2023-02-19

- Report: [https://hackerone.com/reports/1665658](https://hackerone.com/reports/1665658)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2022-08-10T15:47:55.453Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Gitlab allows to import a project from Github. It imports also the labels whose colors are not sanitized. This leads to Stored-XSS. 


# Step to reproduce

To reproduce, we need the following prerequisite: 

- Github does not allow neither to create arbitrary label colors. You can find in the attachment a dummy Github server
- A VM/machine to host the dummy server above with an public IP though that gitlab.com can access to.
- I created the dummy server using nodejs, so you need to have also nodejs on the machine
- A Gitlab personal access token. Go [here](https://gitlab.com/-/profile/personal_access_tokens?name=test&scopes=api) to create a new token with within `api` scope.


# Step 1: run the dummy server

- Copy the attachment file on your machine and decompress it to any folder, e.g., `/tmp/dummy-server`
- Go to `/tmp/dummy-server` then run this command: `node ./index.js YOUR_IP YOUR_PORT` in which, you should replace `IP` and `PORT` with the one you have. For example, `sudo node index.js 51.75.74.52 80`

# Step 2: trigger Gitlab import

- Open a new terminal, then run the following command in which:

   + `YOUR_IP` and `YOUR_PORT` by the values in the previous step
   + `YOUR_GITLAB_TOKEN` is the api token you've created in the pre-requirement
   + `YOUR_GITLAB_USERNAME` is the target namespace you want to import the project to. It can be your username, or a group name

```bash
curl -kv "https://gitlab.com/api/v4/import/github" \
  --request POST \
  --header "content-type: application/json" \
  --header "PRIVATE-TOKEN: YOUR_GITLAB_TOKEN" \
  --data '{
    "personal_access_token": "ghp_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "repo_id": "523303538",
    "target_namespace": "YOUR_GITLAB_USERNAME",
    "new_name": "xss-on-label-color",
    "github_hostname": "http://YOUR_IP:YOUR_PORT"
}'
```

For example:

```bash
curl -kv "https://gitlab.com/api/v4/import/github" \
  --request POST \
  --header "content-type: application/json" \
  --header "PRIVATE-TOKEN: AAAAAAAAAAAAAYYYYabc" \
  --data '{
    "personal_access_token": "ghp_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "repo_id": "523303538",
    "target_namespace": "yvvdwf",
    "new_name": "xss-on-label-color",
    "github_hostname": "http://51.75.74.52:80"
}'
```

After finishing, you can view the list of the labels of the imported project. You should see an popup created by this js `alert(document.domain)`

An example is available here (private project): https://gitlab.com/yvvdwf/xss-on-label-color/-/labels


# Impact

Stored-XSS with CSP-bypass allows attackers to execute arbitrary actions on behalf of victims at the client side.

## Impact

Stored-XSS with CSP-bypass allows attackers to execute arbitrary actions on behalf of victims at the client side.

## Timeline

- **Report Filed**
- **2022-08-11** @yvvdwf: Hi, I found that the XSS occurs also on the description of an issue or a merge-request by mentioning the label in the description: `~"yvvdwf-label-name"`{F1863006}

[F1863006]

Example: 
- https://gitlab.com/yvvdwf/xss-on-label-color/-/issues/1
- https://gitlab.com/yvvdwf/xss-on-label-color/-/merge_requests/1
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Pending Program Review**
- **Report Severity Updated**
- **Report Triaged**
- **2022-08-17** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2022-09-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-08-18** @yvvdwf: Hi @galfaro,

> Changed `PR` to low since this involves creating a repo. The attack scenario that I'm modeling  (instead of self exploitation via importing a poisoned repo) is that the attacker is in a group for which the attacker has maintainer access and is able to import a bad repo to elevate privileges. 

A side note: The XSS occurs on Issues/MR pages that are not only in the project being imported by the attackers but also on a project attackers can create an Issue or MR. Indeed, by using a [cross-project reference](https://docs.gitlab.com/ee/user/markdown.html#gitlab-specific-references) the attacker may mention its malicious Label on another project, [an example](https://gitlab.com/yvvdwe/test/-/issues/3)

Beside that, I would like to clarify some other metrics in the CVSS (the text in **bold** is copied from [your cvss calculator](https://gitlab-com.gitlab.io/gl-security/appsec/cvss-calculator) )

- `AC:L`: **Stored XSS on a page that's part of the user's normal workflow (issue or merge request page)**: As I mentioned above the store-XSS is on the issue/MR requests of a project the attack may create an issue/MR
- `PR:N`: **The attacker is logged out - PR:N - but the victim is logged in**: The stored-XSS still exist even the attacker is logged out. 
- `C:H`: **Access tokens, runner tokens. Private repositories**: Indeed the XSS allows to execute any Rest API on behalf of the victim to get almost arbitrary private information of the victim (unless his password). It can even perform a *fake* account-take-over by changing the victim's username and immediately register a new account within the victim's username (as changing username does not require to confirm password)
- `A:L`: This Store-XSS with CSP-bypass can easily create DoS at the client side by exhausting CPU and RAM of the victim's Web browser. It can also send as much as possible the post/put/get requests to the server. The number of requests can increase by the number of victims who are viewing the XSS.

Best regards,
- **Report Severity Updated**
- **2022-08-18** @galfaro: Hi @yvvdwf,
Thank you for noticing that. The only thing that I recall changing from your original report CVSS was the privileges required stat. I'm going to keep it at `PR:L` because the attacker needs access to the project in some sort of privileged role (any role other than guest) in order to execute the attack. `PR:N` would imply that a completely unauthenticated attacker would be able to accomplish this, and that doesn't appear to be the case. Hope this helps.

Best,
Greg Alfaro
GitLab Security Team
- **Report Severity Updated**
- **2022-08-19** @yvvdwf: > User interaction is required for all XSS per [first.org](https://www.first.org/cvss/v3.1/examples)

Hi @galfaro , 

Apologies to bother you again about the cvss score, but it seems that you forgot the `Availability` metric, `A:L` as  I proposed above. (Although it should be `A:H` as in the example [first.org](https://www.first.org/cvss/v3.1/examples): *in worst case, an attacker can obtain admin permission, thus he can even shutdown Gitlab, e.g., by putting it in `Maintenance Mode` or otherwise disrupt service for all users*.)

Best regards,
- **2022-09-06** @yvvdwf: Hi @galfaro ,

I saw that the issue was mitigated in [Gitlab 15.3.2](https://about.gitlab.com/releases/2022/08/30/critical-security-release-gitlab-15-3-2-released/#stored-xss-via-labels-color). However it is not enough because it missed the case of [scoped label](https://gitlab.com/gitlab-org/gitlab/-/blob/85041966ed3eba23ee530a20c2eee374ef6e8617/ee/app/helpers/ee/labels_helper.rb#L33) (the XSS is still exploitable when the label's title containing `::`)

Best regards,
- **2022-09-06** @galfaro: Hi @yvvdwf,
That sounds really interesting. Please go ahead and submit a report about this (helps with tracking purposes) and we can take a look.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
