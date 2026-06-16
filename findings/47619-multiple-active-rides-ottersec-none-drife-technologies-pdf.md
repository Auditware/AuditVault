---
tags:
  - platform/ottersec
  - has/github
  - lang/move
  - severity/high
  - sector/infra
protocol: "[[Drife]]"
auditors:
  - "[[Michał Bochnak]]"
report: "https://github.com/DrifeTechnologies/mysten-labs/"
genome:
  - "[[wrong-condition]]"
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# Multiple Active Rides

- id: 47619
- impact: HIGH
- protocol: [[Drife]] Technologies
- reporter: Michał Bochnak (OtterSec)
- source: https://github.com/DrifeTechnologies/mysten-labs/

## Summary


The program has a bug where a rider can request multiple rides at the same time, causing issues with the ride-sharing service. This happens because the program doesn't properly check or update the ride status. A rider can exploit this by repeatedly calling the request_ride function and selecting multiple rides without the program checking if they already have an active ride. Additionally, the rider can also use the rider_cancel_ride function to cancel one ride and keep other active ones. To fix this, the program needs to limit the number of active rides a rider can have at once and check their status before allowing them to accept a new ride. This bug has been fixed in the latest updates of the program.

## Details

## Ride Request Vulnerability

The program does not properly check or update the ride status, enabling a single rider to request multiple rides simultaneously before actually starting any particular ride. A malicious user may call `request_ride` multiple times to accept multiple rides at once, resulting in situations where a single rider is associated with multiple active rides, disrupting the normal functioning of the ride-sharing service. 

This occurs as `request_ride` checks if `on_ride` is false before executing a request. However, `on_ride` is only updated after selecting a ride, thus enabling the rider to call `request_ride` repeatedly and choose more than one ride via `choose_ride`, which does not check the status of `on_ride`. 

Furthermore, a rider may exploit `rider_cancel_ride`, which allows riders to cancel a ride and set their `on_ride` status to false to cancel one ride, thereby setting that particular rider’s `ride_state` to false while potentially retaining other active rides.

## Remediation

Implement a mechanism to limit the number of active rides a rider may have simultaneously by checking the rider’s status before allowing them to accept a new ride.

## Patch

Fixed in commits `d655054` and `17e4d91`.
