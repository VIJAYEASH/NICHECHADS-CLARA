# Additive CLARA enhancement checklist

- [x] Add real QR image file-picker input with JPG, JPEG, PNG, and WEBP validation.
- [x] Add QR image preview, file name, remove/change controls, processing state, and integration-ready payload handler.
- [x] Add QR error states for unsupported files, processing failure, and no QR detected.
- [x] Add dynamic threat signals section to the existing link result card.
- [x] Add animated CLARA Explain dialog with dynamic explanation and keyboard/outside close behavior.
- [x] Add verdict-based Recommended Action copy.
- [x] Add expandable Threat Path redirect timeline with dynamic stages and sequential reveal.
- [x] Add visible additive micro-interactions and verify existing layouts remain intact.
- [x] Run typecheck, production build, browser interaction checks, and save a checkpoint.

## Focused image-state fix

- [x] Remove the visible failed-image dependency from the CLARA visual surface.
- [x] Replace it with a CLARA-branded visual treatment using the existing mark and cybercore styling.
- [x] Verify desktop and mobile previews and save a new checkpoint.

## Persistent image-failure debug

- [x] Trace the reported failure on the published domain and current preview.
- [x] Search source, build output, and loaded assets for stale generated-image failure references.
- [x] Remove or replace every remaining broken image path with a resilient CLARA fallback.
- [x] Restart, rebuild, checkpoint, and verify the published domain after the fix.

## Published failure and IST display fix

- [x] Inspect the published domain for the exact remaining failed-image state.
- [x] Convert the displayed status time to India Standard Time and label it `IST`, or remove the time if it is not useful.
- [x] Rebuild, verify the public domain, and save a new checkpoint.

## CLARA boot sequence

- [x] Add a pre-login boot/loading state with CLARA branding and staged progress.
- [x] Transition boot completion into the existing login page without changing the main workspace flow.
- [x] Add skip/replay-safe behavior, responsive layout, and reduced-motion handling.
- [x] Verify the full boot → login → main sequence and save a checkpoint.

## Boot animation polish

- [x] Add more visible staged motion to the CLARA logo, orbit, scanline, status lights, and progress meter.
- [x] Add a smoother boot-to-login transition without changing the existing login or main workspace.
- [x] Verify desktop, mobile, and reduced-motion behavior, then save a checkpoint.

## Centered boot layout fix

- [ ] Make the boot screen lock to the viewport and hide page overflow during loading.
- [ ] Center the animated core and rebalance desktop/mobile spacing to fit one screen.
- [ ] Verify the boot sequence at desktop and mobile sizes without scrolling, then save a checkpoint.

## Live Signal Feed interaction

- [x] Make the visible telemetry rows clickable and show selected event details.
- [x] Add an expanded feed view or drawer with a clear frontend demo status.
- [x] Preserve the current visual style and verify the feed interaction in the browser.

## Full control wiring

- [x] Make Google and Apple login buttons produce clear working feedback without changing the existing auth flow.
- [x] Make Edit profile and connected-app Manage controls open usable panels or dialogs with save/close behavior.
- [x] Surface the extension protection toggle on the front page and keep it synchronized with the three-line menu.
- [x] Add a dark/light mode control to the three-line menu with persisted preference and readable contrast.
- [x] Verify the requested buttons and controls across desktop/mobile, then save a checkpoint.
