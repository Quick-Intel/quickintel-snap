# @quickintel/quickintel-snap

A MetaMask Snap that can detect risks of token when users initiate a swap transaction on a DEX, supported by Quick Intel.

## Installation and Usage Guide

Please visit https://quickintel.io/snap for all information related to the Quick Intel Snap.

After installation of the snap, navigate to a DEX of your choice, initiate a swap, and the Quick Intel Snap tab will appear, where you can review the token audit results.

## Audit

The `snap` package has been audited by [Veridise.](https://veridise.com/audits/)

You can view the [full audit report findings here.](https://github.com/Quick-Intel/quickintel-snap/blob/main/VAR_quickintel_snap.pdf)

## Permissions

This Snap requires several permissions to properly access the necessary APIs for proper functionality.

    - "snap_dialog"
    - "endowment:network-access"
    - "endowment:transaction-insight"

## Testing

The snap comes with some basic tests, to demonstrate how to write tests for
snaps. To test the snap, run `yarn test` in this directory. This will use
[`@metamask/snaps-jest`](https://github.com/MetaMask/snaps/tree/main/packages/snaps-jest)
to run the tests in `src/index.test.ts`.
