---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/access-control/proxy-storage-collision
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/upgrade-dependency
  - sector/infra
protocol: "[[ink!]]"
auditors:
  - "[[OpenZeppelin]]"
report: https://blog.openzeppelin.com/security-review-ink-cargo-contract/
genome:
  - "[[proxy-storage-collision]]"
  - "[[variant]]"
  - "[[admin-takeover]]"
  - "[[access-roles]]"
  - "[[upgrade-safety]]"
---
# Custom Selectors could facilitate proxy selector clashing attack

- id: 10298
- impact: HIGH
- protocol: Security Review – ink! & cargo-contract
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/security-review-ink-cargo-contract/

## Summary


ink! is a feature that enables developers to hardcode the selector for a given function, allowing function name-changing while maintaining the same selector and creating language-agnostic contract standards. However, this feature can lead to proxy selector clashing, allowing malicious backdoors to be created more easily. Third-party monitoring and indexing services may also be confused by custom selectors, leading to errors.

For these reasons, it is worth considering an alternative to handle language-agnostic contract standards or removing custom selectors altogether if the benefits are not greater than the potential risks. The progress of this issue can be tracked on issue 1643 of the “ink” repository.

## Details

ink! has a feature that allows developers to hardcode the selector for a given function. This capability enables function name-changing while maintaining the same selector and also facilitates the creation of language-agnostic contract standards.


However, allowing custom selectors in contracts can lead to proxy selector clashing. When a user calls a specific function on an implementation, a matching selector in the proxy can cause unintended execution of code within the proxy. This issue makes it easier for scam projects to create malicious backdoors that are difficult to detect. In contrast to ink!, Solidity requires finding function signatures with matching selectors before taking advantage of this vulnerability, which is not trivial. If such function signatures are found and added, they are likely to raise red flags because the name usually does not make sense to the codebase.


Custom selectors can also confuse third-party monitoring or indexing services that use function selectors to identify specific functions. These services may rely on standard selectors, which are part of standards or belong to community databases such as the 4byte directory. If contracts use custom selectors, these services may fail to recognize and monitor transactions, leading to errors.


Given the potential dangers outlined, it is worth rethinking this feature and looking for an alternative to handle language-agnostic contract standards. Alternatively, requiring the metadata of the implementation contract to build the proxy and preventing the code from being compiled if selector clashing occurs with the implementation may be a viable solution. If the benefits of using custom selectors are not greater than the potential risks, consider removing them.


***Update:** Acknowledged, will resolve. The progress can be tracked on [issue 1643](https://github.com/paritytech/ink/issues/1643) of the “ink” repository.*
