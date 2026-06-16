---
tags:
  - platform/ottersec
  - has/poc
  - severity/high
  - sector/vault
protocol: "[[Tailwind]]"
auditors:
  - "[[Caue Obici]]"
report: "https://www.tailwind.zone/"
genome:
  - "[[access-roles]]"
  - "[[role-bypass]]"
---
# Authorization Header Leak

- id: 47560
- impact: HIGH
- protocol: [[Tailwind]]
- reporter: Caue Obici (OtterSec)
- source: https://www.tailwind.zone/

## Summary


The bug report discusses an issue with React Server Components leaking information about request headers to the Vercel backend server. This includes an authentication token for the Vercel internal cache server. A proof of concept is provided, and a potential solution is suggested by removing the use of the function 'headers()'. The issue has been fixed by removing the function in question.

## Details

## React Server Components Security Issue

React Server Components are being used on the website, and when requesting them, it leaks information about the request headers to the Vercel backend server, including an authentication token for the Vercel internal cache server.

## Proof of Concept

Open a raw HTTP editor and send this request:

```
GET / HTTP/2
Host: www.tailwind.zone
Rsc: 1
```

Notice that the response is a 404 Not Found with information about the request:

```
HTTP/2 404 Not Found
Age: 0
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
Content-Type: text/x-component
[...]
["x-vercel-sc-headers",
"{\"Authorization\":\"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50..."}"],
["x-vercel-sc-host","pdx1.suspense-cache.vercel-infra.com"],
```

## Remediation

This issue is a result of the React Server Components caching the dynamic function `headers()`. Consider removing the use of the function `headers()` here, as it is not necessary:

```tsx
const get_headers = cache(async () => headers());
```

## Patch

Fixed by removing the `get_headers` function in fb24d7f.

### layout.tsx DIFF

```diff
"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
};
-
- const get_headers = cache(async () => headers());
```

```tsx
export default function RootLayout({
  children,
}: {
```
