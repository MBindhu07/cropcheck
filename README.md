# CropCheck

A React Native (Expo) app that takes a farmer from a crop photo to a published produce listing: onboarding, demo login, a simulated quality assessment, and listings that persist on the device.

Built for the Curvvtech developer assignment.

## Running the app

Requirements: Node 20+ and the Expo Go app (SDK 58) on an Android or iOS phone.

```bash
npm install
npm start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). To run in a browser instead, use `npm run web`.

Other scripts:

| Command | Purpose |
| --- | --- |
| `npm test` | Unit tests (Jest with `jest-expo`) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint with the Expo config |
| `npm run android` / `npm run ios` | Start and open on an emulator or simulator |

**Demo login:** enter any 10-digit mobile number, then the code `123456`. No SMS is sent.

### Platforms tested

- Expo web (Chromium, phone-sized 390×690 viewport): full journey tested end to end.
- Android / iOS device via Expo Go: _add the device and OS version you tested on before submitting._

## What the app does

| Area | Behaviour |
| --- | --- |
| Onboarding | Three screens with Skip, Next and Get started. Shown only on first launch (flag persisted). |
| Demo login | Phone number (10-digit validation) then a 6-digit OTP. `123456` signs in; any other code shows an error. Session persists across restarts; sign out from Home. |
| Home | Listing cards with photo, crop, grade, quantity, price and status. An earnings card (money earned from sold listings, value still in stock, share sold), summary counts, crop and grade filters, and separate empty states for "no listings" and "no matches". |
| Add produce | Crop (Tomato, Potato, Onion), quantity in kg, price per kg, location and one gallery photo with preview. Required fields and positive numbers are validated. Denied photo access shows a message with "Try again" or "Open settings". |
| Assessment | "Assess quality" calls a separate mock service that waits about two seconds. Demo scenarios: Good (A, 5%), Average (B, 15%), Poor (C, 30%), Service failure (error with Retry). The result splits the defect total into bruising, discolouration and size variation. Everything is labelled as simulated. |
| Price check | Once the crop and grade are known, the form shows a sample market range for that crop and grade, where the farmer's price sits on it, and how far below or above the range it is. If it is outside the range, one tap applies the suggested price. Also shown on Review. |
| Review and publish | Summary of details, price check and assessment with "Edit details" and "Publish". Publishing returns to Home, where the listing appears immediately. |
| Listing details | Full listing and assessment. "Mark as sold" (with confirmation) updates the status on Home. Share sends a WhatsApp-friendly text summary through the system share sheet. Delete (with confirmation) removes the listing and its saved photo. |
| Feel | Crop illustrations in the crop picker, filters, onboarding and empty state. Custom app icon and splash. Haptic feedback on sign-in, assessment result, publish and mark as sold (Android/iOS only). |

## Project structure

Feature modules keep pages, components, hooks, services, schemas and types together. Route files in `src/app` stay thin and only re-export pages.

```text
src/
  app/                         Expo Router routes
    _layout.tsx                fonts, store hydration, protected route groups
    onboarding.tsx
    auth/                      sign-in and OTP screens
    (app)/                     home, produce/new, produce/review, listing/[id]
  modules/
    onboarding-feature/        slides and illustrations
    auth-feature/              auth.service.ts, auth.schema.ts, OTP input
    assessment-feature/        assessment.service.ts, scenarios, result card
    listing-feature/           pages, listing and draft stores, produce schema, hooks
    market-feature/            market-price.service.ts, price comparison, insight card
  components/                  shared UI (buttons, inputs, badges, crop icon, empty state, toast)
  constants/crops.ts           crop list, labels, colours and illustrations
  store/                       session, app flags, flash message
  lib/                         storage, photo persistence, formatting, confirm dialog, haptics
  theme/tokens.ts              colours, spacing, radius, typography
```

### Key decisions

- **Navigation guards.** The root stack uses `Stack.Protected` groups for onboarding, auth and the app. When onboarding finishes or the user signs in or out, the previous screens are removed from history. So Back cannot return to the OTP screen after login, or to onboarding after it is completed. After publishing, `router.dismissTo('/')` clears the add and review screens from the stack.
- **Persistence.** Zustand stores with the `persist` middleware on AsyncStorage hold the onboarding flag, session and listings. The root layout waits for all stores to hydrate before rendering, so there is no flash of the wrong screen.
- **Photos survive restarts.** Image picker URIs can point to a temporary cache the OS may clear. On publish, the photo is copied into the app's document directory (`expo-file-system`). The listing stores a relative path, because the absolute container path on iOS changes between app updates.
- **Assessment integrity.**
  - Each result is stored with the photo URI it was produced for. Changing the photo clears the result, and Review stays blocked until the new photo is assessed.
  - A ref guard stops duplicate requests, and the button and scenario chips are disabled while a request runs.
  - A failed assessment leaves the form untouched.
- **Draft state.** The form lives in an in-memory draft store, so going to Review and back, or a failed assessment, never loses entered data.
- **Price check.** The comparison logic (`comparePrice`) is a pure function, separate from the data. The rates come from a mock service and the card is labelled "Sample data". If the crop or grade changes while a lookup is in flight, the stale answer is ignored.
- **Earnings are derived, not stored.** Earned and in-stock totals are computed from the listings on every change, so they can never drift out of sync with the list.

## Replacing the mocks with real APIs

Both mocks are plain async functions with typed inputs and outputs. Screens only call these functions, so swapping them does not touch UI code.

**Login:** `src/modules/auth-feature/services/auth.service.ts`

- `requestOtp(phone)` would call an OTP provider (for example Firebase Phone Auth, MSG91 or Twilio Verify) or a backend endpoint that sends the SMS.
- `verifyOtp(phone, otp)` would verify the code server-side and return the real session (access and refresh tokens) in the same `AuthSession` shape.
- The session should then move from AsyncStorage to `expo-secure-store`, and an HTTP client would attach the token and handle refresh and expiry.

**Assessment:** `src/modules/assessment-feature/services/assessment.service.ts`

- `assessCropQuality({ photoUri, crop, scenario })` would upload the photo (multipart or a pre-signed URL) to the grading service and map its response to `CropAssessment`.
- The `scenario` argument and the scenario chips would be removed, and `isSimulated` would become `false`.
- Error responses would be thrown as `AssessmentServiceError`, so the existing retry UI keeps working.

**Market prices:** `src/modules/market-feature/services/market-price.service.ts`

- `getMarketRate(crop, grade)` would call a prices API (for example data.gov.in's Agmarknet feed, filtered to the farmer's nearest mandi) and return the same `MarketRate` shape. The comparison and UI stay as they are.

Listings would move from the local store to an API in the same way: `addListing`, `markAsSold` and `removeListing` become API calls (optionally with React Query for caching), and the photo is uploaded rather than copied locally.

## AI tools used

- **Cursor (AI agent)** was used to scaffold the project and draft most of the code: design tokens, shared components, stores, services and screens.
- It was also used to read the current Expo SDK 58 docs before using APIs that changed recently: the new `expo-file-system` `File`/`Paths` API, `Stack.Protected` and keyboard handling on edge-to-edge Android.
- It ran the typecheck, lint and unit tests and drove a browser to walk through the flow.
- The crop illustrations, app icon and splash image were generated with an AI image tool, then cleaned up (background removed, cropped and resized) with a small script.
- I reviewed the generated code and fixed problems found while testing. Fixes include:
  - a route-group redirect that landed on an unmatched route;
  - an input row that overflowed horizontally on web;
  - React Compiler lint errors, resolved by deriving state instead of syncing it in effects;
  - an OTP input that could not receive pasted codes.

## What I tested

On Expo web, at a phone-sized viewport:

- Onboarding: Next and Skip work; after completion it does not show again on reload.
- Phone validation error for a short number; the wrong OTP shows an error and clears the boxes; `123456` signs in.
- Session persists after reload; sign out returns to the sign-in screen.
- Add produce validation: missing crop, zero or invalid numbers, empty location, missing photo. Non-numeric characters are stripped from quantity and price.
- Service failure scenario shows the error with Retry, and the form data is kept. Retrying with Good quality returns Grade A, 5%.
- Changing the photo clears the assessment, and Review is blocked until it is re-run.
- Review shows the correct summary and estimated value. Publish shows a toast and the listing appears on Home.
- Grade filter with no matches shows the "No listings match" state; Clear filters restores the list.
- Mark as sold updates the details page and the Home card. Listings, photo and sold status survive a reload.
- Price check: ₹18/kg for grade A tomato shows "about 18% below"; "Use ₹25/kg" fills the price and the card switches to "in line with the market".
- With a sold listing, the earnings card shows the earned amount and 100% sold. Delete returns to Home, shows a toast and removes the listing from storage.

Automated (`npm test`, 17 tests):

- `assessment.service`: each scenario maps to the right grade and defect level, the breakdown adds up to the total, failure rejects, and nothing resolves before the delay.
- `produce.schema`: valid input is parsed to numbers; missing, zero, malformed and unknown values are rejected.
- Draft store: the assessment survives the same photo, is dropped when the photo changes, and a late result for an old photo is ignored.
- `comparePrice`: range edges count as within; below and above percentages are correct.

Typecheck, lint and `expo-doctor` pass with no errors.

## Known issues and unfinished work

- Not yet verified on a physical device in this write-up (see "Platforms tested"). Gallery permission prompts and the copy into the document directory only run on Android and iOS.
- On web, photos are stored as data URIs in local storage rather than copied to disk. Web is supported for development only.
- Listings cannot be edited after publishing (they can be marked as sold or deleted).
- The in-progress draft is kept in memory only, so closing the app mid-form discards it.
- Market rates are a static sample table, not live prices.
- Tests cover services, validation and store logic; there are no component or end-to-end tests yet.
- Selecting a different demo scenario after a successful assessment does not clear the result; the user has to tap "Assess again".

Next steps I would take: a Telugu/Hindi language toggle (most target users are more comfortable in their own language), editing a listing, and saving the draft so an interrupted form can be resumed.
