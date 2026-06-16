---
tags:
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/options
protocol: "[[Pontem (Liquidswap)]]"
auditors:
  - "[[Maher Azzouzi]]"
report: "https://pontem.network/"
genome:
  - "[[missing-modifier]]"
  - "[[admin-takeover]]"
  - "[[access-roles]]"
---
# React Keychain Weak Access Control

- id: 48335
- impact: HIGH
- protocol: [[Pontem Mobile Wallet]]
- reporter: Maher Azzouzi (OtterSec)
- source: https://pontem.network/

## Summary


The bug report is about a function called setGenericPassword in the react-native-keychain library that is used by an app called Pontem to store the user's password and address on their device. The function has an option called Keychain.ACCESS_CONTROL which allows for different levels of security to access the stored data, such as requiring a password or touch ID. However, by default, there is no access control set, which means anyone can access the data without any security measures. The report recommends specifying the desired access control option when using the function to ensure the data is protected. A patch has been added to address this issue.

## Details

## Pontem Keychain Access Control

Pontem uses the `setGenericPassword` function from the `react-native-keychain` library to store the user’s password and address on the device. This function has different options, one being `Keychain.ACCESS_CONTROL`, which provides many access control choices that require a password or touch ID to access the keychain data. However, by default, there is no access control when accessing the keychain data.

## Keychain Access Control in Java

```java
/** Get access control value from options or fallback to {@link AccessControl#NONE}. */
@AccessControl
@NonNull
private static String getAccessControlOrDefault(@Nullable final ReadableMap options) {
    return getAccessControlOrDefault(options, AccessControl.NONE);
}
```

## Remediation

It is recommended to specify the desired access control from the available options.

### JavaScript Example

```javascript
await setGenericPassword(address, password, {
    accessControl: <SUITABLE OPTION>
});
```

## Patch Details

Patch added in commit `62d7365`.

### Diff for `src/components/auth/importAccount/form/index.js`

```diff
- await setGenericPassword(address, password);
+ await setGenericPassword(address, password, {
+     accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
+ });
```
