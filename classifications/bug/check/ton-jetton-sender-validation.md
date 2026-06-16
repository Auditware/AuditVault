---
tags:
  - check/ton-jetton-sender-validation
  - lang/func
  - blockchain/ton
---
In transfer_notification handlers, is sender_address compared against a stored, initialized Jetton wallet address - not the from_user field inside the payload body?
