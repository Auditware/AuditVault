---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/nft
  - sector/streaming
  - sector/token
  - sector/wallet
protocol: "[[Sablier]]"
auditors:
  - "[[Zach Obront]]"
report: "https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Malicious asset can be used to inject Javascript into [[Sablier]] front end 

- id: 54667
- impact: HIGH
- protocol: Sablier
- reporter: Zach Obront (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf

## Summary


The report discusses a bug in the Sablier NFT Descriptor contract that could potentially allow an attacker to inject malicious JavaScript into the Sablier front end. This is due to the lack of checks on the length and content of the symbol string returned from the `safeAssetSymbol()` function. The report recommends implementing sensible upper limits on the length of the string and adding input sanitation checks to prevent malicious code from being injected. The bug has been fixed in a recent update.

## Details

## Context
- [SablierV2NFTDescriptor.sol#L316-L325](https://example.com/SablierV2NFTDescriptor.sol#L316-L325)
- [SablierV2NFTDescriptor.sol#L63-L79](https://example.com/SablierV2NFTDescriptor.sol#L63-L79)
- [NFTSVG.sol#L120-L144](https://example.com/NFTSVG.sol#L120-L144)

## Description
The NFT Descriptor contract fetches the symbol from the asset contract using the `safeAssetSymbol()` function. As long as that symbol has a length of over 64 bytes (i.e., it is a string), it is returned as is.

```solidity
function safeAssetSymbol(address asset) internal view returns (string memory) {
    (bool success, bytes memory symbol) = asset.staticcall(abi.encodeCall(IERC20Metadata.symbol, ()));
    // Non-empty strings have a length greater than 64, and bytes32 has length 32.
    if (!success || symbol.length <= 64) {
        return "ERC20";
    }
    return abi.decode(symbol, (string));
}
```

This symbol is passed along to the SVG, where it is inserted directly into the SVG text that is returned to the front end to display.

```solidity
function generateFloatingText(
    string memory sablierAddress,
    string memory streamingModel,
    string memory assetAddress,
    string memory assetSymbol
) internal pure returns (string memory) {
    return string.concat(
        '<text text-rendering="optimizeSpeed">',
        SVGElements.floatingText({
            offset: "-100%",
            text: string.concat(sablierAddress, unicode" • ", "Sablier V2 ", streamingModel)
        }),
        SVGElements.floatingText({
            offset: "0%",
            text: string.concat(sablierAddress, unicode" • ", "Sablier V2 ", streamingModel)
        }),
        SVGElements.floatingText({ 
            offset: "-50%", 
            text: string.concat(assetAddress, unicode" ", assetSymbol)
        }),
        SVGElements.floatingText({ 
            offset: "50%", 
            text: string.concat(assetAddress, unicode" ", assetSymbol)
        }),
        "</text>"
    );
}
```

There are no checks on the value of this symbol, and it is passed directly to any front end displaying Sablier NFTs to display. However, SVGs can be used to execute arbitrary JavaScript (see: [Using JavaScript in SVG](https://example.com/Using-JavaScript-in-SVG) and [svg-xss-injection-attacks](https://example.com/svg-xss-injection-attacks)). This means that if an attacker were to create an asset with a symbol that contained malicious JavaScript, they could use this to inject JavaScript into the Sablier front end. This could be used, for example, to create a fake Metamask pop-up that asks a user to sign a message.

## Recommendation
Symbol strings are not typically longer than a few characters. Sensible upper limits should be placed on the maximum length of a string that can be returned from the `safeAssetSymbol()` function, which will prevent an attacker from including code with any complexity. To be extra safe, it may be worth adding an input sanitation check to the `safeAssetSymbol()` function so that only `A-Za-z`, `0-9` is allowed (preventing `<`, `/`, `>`, `'`, `;`).

- **Sablier:** Changes applied in PR 555.
- **Cantina:** Fixed.
