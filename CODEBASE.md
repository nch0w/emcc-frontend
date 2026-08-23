# EMCC Frontend Codebase Guide

**CAUTION: This documentation was generated entirely via an agent. Contents of this document were not verified by a human yet, so please reference this with a grain of salt!**

**To deploy the codebase or test it in development, please reference the short guide and FAQ in [README](README.md)**

This document describes the current implementation of the Exeter Math Club Competition website in this repository. It is intentionally specific to the code as it exists now, including inactive features, historical scripts, configuration mismatches, and operational hazards.

## 1. What this repository contains

The repository is a Yarn Classic monorepo with two workspaces:

- `client/`: a Create React App frontend using React 16, `react-scripts@3.4.3`, Material-UI v4, `@reach/router`, Axios, `material-table`, styled-components, and SweetAlert2.
- `server/`: an Express API using Airtable as its application data store. It also contains Socket.IO setup, AWS SES email delivery, Google Sheets grading/operations scripts, and PDF certificate generation.
- Root `package.json`: starts the two workspaces together with `concurrently`, builds the client, and declares Yarn workspaces.
- `README.md`: setup and deployment notes.
- `yarn.lock`: the Yarn lockfile currently tracked at the repository root.
- `package-lock.json`: also present at the root. This means both npm and Yarn lockfiles exist; contributors should avoid changing dependency resolution with one package manager unless that is intentional.

There is no traditional database directory. Coach accounts, registration records, sessions, and published result data are stored in Airtable. Competition submissions, IDs, grading inputs, rankings, and many bulk-operation datasets are stored in Google Sheets.

## 2. Running the application

From the repository root:

```text
yarn              # install workspace dependencies
yarn dev         # start API and React development server together
yarn build       # build the client
```

The root scripts are:

- `yarn server` -> `yarn --cwd server start`
- `yarn client` -> `yarn --cwd client start`
- `yarn build` -> `yarn --cwd client build`
- `yarn dev` -> concurrently runs the server and client

`server/package.json` starts `nodemon --trace-warnings index.js`, so the API is normally available on port `3001`.

`client/package.json` starts `react-scripts start`, normally on port `3000`. Its development proxy is `http://localhost:3001`, so browser requests normally go to the API server through the CRA proxy when the frontend uses relative URLs. However, the current frontend configuration explicitly defaults `emccServerUrl` to `http://localhost:3000/api` in `client/src/config.js`; this should be checked before changing deployment or proxy behavior.

### Node/OpenSSL compatibility

The client is pinned to the old `react-scripts@3.4.3`/webpack 4 toolchain. Modern Node releases using OpenSSL 3 can fail during the client build with `ERR_OSSL_EVP_UNSUPPORTED`. On Windows PowerShell, the documented workaround is:

```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"
yarn dev
```

The README currently shows Unix `export` syntax, which is not the normal PowerShell syntax. A long-term fix is upgrading the client build toolchain and retesting the application; an older Node version is a temporary compatibility alternative.

## 3. Application startup and request pipeline

`server/index.js` is the server entry point:

1. Loads `.env` with `dotenv`.
2. Installs an `unhandledRejection` process handler that logs rejected promises.
3. Creates an Express app and an HTTP server.
4. Creates a Socket.IO server on the same HTTP server with path `/api/socket.io/`.
5. Enables permissive CORS with `app.use(cors())`.
6. Enables `cookie-parser` and JSON request parsing.
7. Installs `server/middleware/fetchUser.js` globally before the route modules.
8. Mounts `server/routes/auth.js` at `/api/auth`.
9. Mounts `server/routes/registration.js` at `/api/registration`.
10. Starts listening on port `3001`.

The middleware order matters. `fetchUser` runs for every request and may attach `req.user`; route handlers then use that value for authentication. There is no separate authorization middleware for each endpoint; route handlers perform their own checks.

### Socket.IO status

The server accepts Socket.IO connections and immediately emits the in-memory `cachedData` array using the `data transfer` event. Connected sockets are stored in `visitors`. The scheduled grading/collection block that would populate and broadcast this data is commented out in `server/index.js`. The frontend `client/src/pages/guts.js` is also almost entirely commented out. Therefore, the live Guts scoreboard is currently inactive even though Socket.IO remains installed and configured.

## 4. Frontend architecture

### Entry point and global state

`client/src/index.js` renders `<App />` inside `React.StrictMode`, imports global CSS, and explicitly calls `serviceWorker.unregister()`. The service worker implementation remains in `client/src/serviceWorker.js`, but it is not enabled by default.

`client/src/App.js` provides the main application shell:

- Material-UI theme: Lato typography and EMCC maroon primary color `#9B1D31`.
- Global `UserContext` containing authentication state and all coach/dashboard data.
- Fixed navigation from `EMCCNav` and footer from `EMCCFoot`.
- A centered `PageBox` with maximum width from `client/src/config.js`.
- `@reach/router` routes.

The context state consists of:

- `authStatus`: either `userStatus.NoUser` or `userStatus.UserLoaded`.
- `coachInfo`: name, phone, email, mailing address, and limits.
- `teams`: the current coach's team competitors.
- `individuals`: the current coach's individual competitors.
- `indivResults`: individual result rows.
- `teamResults`: team result rows.
- Setter functions for all of these values.

On initial mount, `App` sends `POST /api/auth/user`. If the server recognizes the cookies, it fills all context data and marks the user loaded. If no valid session exists, the catch handler only logs the error; the initial state remains `NoUser`.

### Frontend routes

Routes are declared in `client/src/App.js`:

| URL | Component | Access | Purpose |
|---|---|---|---|
| `/` | `pages/home.js` | Public | Current contest status, sponsor, and links to public information. |
| `/schedule` | `pages/schedule.js` | Public | Tentative competition-day schedule. |
| `/contest` | `pages/contest.js` | Public | Eligibility, format, rules, scoring, and tie-breaking. |
| `/travel` | `pages/travel.js` | Public | Campus address, parking, lodging, and travel information. |
| `/aboutus` | `pages/aboutus.js` | Public | Math Club description and director contact cards. |
| `/archives` | `pages/archives.js` | Public | Links to historical problem sets, solutions, answers, and results in `client/public/papers`. |
| `/login` | `pages/login.js` | Public | Coach login. |
| `/signup` | `pages/signup.js` | Public | Coach account creation and verification-email request. |
| `/verify/:tokenId` | `pages/verify.js` | Public token route | Verifies an email token and establishes a session. |
| `/forgotpassword` | `pages/passwordResetPages/forgotpassword.js` | Public | Requests a password reset email. |
| `/newpassword/:tokenId` | `pages/passwordResetPages/newpassword.js` | Public token route | Sets a new password and establishes a session. |
| `/dashboard` | `pages/dashboard.js` through `PrivateRoute` | Intended private route | Coach portal for competitors, payment link, coach information, and results. |
| `/guts` | `pages/guts.js` | Currently inactive | The route exists, but the component implementation is commented out. |

`PrivateRoute` is only a client-side gate. It checks `UserContext`; it does not replace server-side authentication. Every protected API endpoint must still verify `req.user`.

### Public pages and shared presentation

- `client/src/config.js` contains contest-year constants, display limits, server URL, contact-card data, archive links, and legacy check-payment instructions.
- `client/src/footNav.js` implements the fixed, shrinking top navigation and footer. Navigation uses `@reach/router`'s imperative `navigate`; the highlighted page is maintained in local state.
- `client/src/styled_components.js` contains shared Material-UI/styled-components wrappers such as `SHeading`, `SContent`, `SHero`, and `SContentHeading`.
- `client/src/homepageLogo.js` plus `homepageLogo.css` renders the animated three-dimensional EMCC cube. The CSS imports Lato font assets and contains the cube geometry.
- `client/src/index.css` defines global body, link, code, and archive-link styles. `App.css` is currently empty.
- `client/src/tshirt/` is an alternate copy of the homepage logo styling/component and is not imported by the active app.

## 5. Frontend-to-API calls

All active API calls use Axios and build URLs from `emccServerUrl` in `client/src/config.js`.

| Frontend action | HTTP request | Success behavior |
|---|---|---|
| Initial session check | `POST /auth/user` | Loads coach, competitors, and results into context. |
| Login | `POST /auth/login` with `{email, password}` | Cookies are set by the server; dashboard data is returned and dashboard navigation occurs. |
| Signup | `POST /auth/signup` with `{name, email, password, mail, phone}` | Displays success message; server responds before sending the verification email. |
| Verify email | `POST /auth/verify` with `{tokenId}` | Server creates a session cookie; client navigates to dashboard. |
| Request reset | `POST /auth/sendreset` with `{email}` | Client shows a generic success message and returns home. |
| Set password | `POST /auth/resetpassword` with `{tokenId, pwd}` | Server creates a session cookie; client navigates to dashboard. |
| Change password | `POST /auth/change-password` with `{oldPassword, newPassword}` | Shows success or server error. |
| Logout | `POST /auth/logout` | Server clears `id` and `sessionToken`; client clears context and returns home. |
| Update coach | `POST /registration/update-coach-info` with coach info | Server refreshes and returns dashboard data. |
| Add/update team | `POST /registration/update-team` with team fields and optional `id` | Server refreshes and returns dashboard data. |
| Add/update individual | `POST /registration/update-indiv` with student and optional `id` | Server refreshes and returns dashboard data. |
| Delete competitor | `POST /registration/delete-competitor` with `{id}` | Server refreshes and returns dashboard data. |

The frontend expects the mutation endpoints to return the full `updateUser` JSON response. This is why the server route handlers call `next()` into `updateUser` rather than ending with a simple success response.

## 6. Authentication and session lifecycle

### Session storage

`server/middleware/fetchUser.js` reads two HTTP cookies:

- `id`: the Airtable record ID for the coach.
- `sessionToken`: a random token stored in the coach's Airtable `Session` field.

If both cookies exist, the middleware retrieves the coach record from Airtable, parses `user.fields.Session` as JSON, and assigns the Airtable record to `req.user` when the cookie token appears in that array. Invalid, missing, malformed, or lookup-failing sessions simply leave `req.user` unset and request processing continues.

`httpOnly` is set when login, verification, and password reset create cookies. The code does not explicitly set `secure`, `sameSite`, `maxAge`, or `domain` attributes.

### Login

`POST /api/auth/login` in `server/routes/auth.js`:

1. Generates a 512-character hexadecimal session token using `crypto.randomBytes(256)`.
2. Validates email format and password presence.
3. Finds the coach by Airtable `Email` formula.
4. Compares the submitted password with the bcrypt hash in `Password`.
5. Appends the session token to the JSON array in `Session`.
6. Sets `id` and `sessionToken` HTTP-only cookies.
7. Sets `req.user` and passes the request to `updateUser`.

There is no explicit check for `Email Verified` during login; unverified accounts can authenticate, but registration mutation endpoints require verification.

### Signup and email verification

`POST /api/auth/signup` validates required fields, email syntax, and a six-character minimum password. It records the source IP using `x-forwarded-for` or the socket address and rejects signup when five existing coach records share that IP.

Passwords are hashed with bcrypt cost 10. Existing unverified records for the same email are overwritten; verified accounts are rejected. The record receives an `Email Verification Token` and an empty `Session` array. The API sends its success response before awaiting the SES email operation, so a successful HTTP response does not guarantee email delivery.

The email contains a URL of the form:

```text
${SITE_URL}/verify/${token}${airtableRecordId}
```

The token-generation functions deliberately avoid the substring `rec` because the verification/reset URLs split the combined value at the first `rec`, which is the beginning of an Airtable record ID.

`POST /api/auth/verify` splits `tokenId` into the token prefix and record ID, finds the coach, compares the stored verification token, sets `Email Verified`, appends a new session token, rotates the verification token, sets cookies, and returns the refreshed dashboard data through `updateUser`.

### Password reset

`POST /api/auth/sendreset` deliberately returns `200 good` when the email does not exist or is not verified, preventing a simple account-existence response. For a verified account, it replaces the verification-token field and clears all sessions before sending a reset email.

`POST /api/auth/resetpassword` validates the combined token, hashes the new password, appends a new session token, rotates the token, sets cookies, and returns refreshed dashboard data.

`POST /api/auth/change-password` requires `req.user`, verifies the old password, requires a six-character new password, and updates the bcrypt hash. It does not rotate or clear existing sessions.

`POST /api/auth/logout` clears the browser cookies but does not remove the session token from Airtable. Existing token values therefore remain in the Airtable session array until the account's sessions are reset by password-reset logic or other account updates.

## 7. `updateUser`: dashboard projection and authorization boundary

`server/middleware/updateUser.js` is both a response middleware and the central dashboard projection. It runs after successful login, verification, password reset, and registration mutations.

When `req.user` is present, it:

1. Refetches the coach from Airtable.
2. Queries `Competitors` for records whose `Coach Email` matches the authenticated coach's email.
3. Classifies records with a truthy `Individual` field as individuals; all other records become teams.
4. Returns team fields `Name`, `Student 1` through `Student 4`, and the Airtable record ID.
5. Queries `Individual Results` by coach email and adds result rows only when `Speed Rank` is present.
6. Collects team names from individual-result ownership rows.
7. Looks up each distinct team name in `Team Results` and returns team/guts/sweepstakes fields.
8. Returns coach contact information and effective limits.

The response shape is:

```text
{
  coachInfo: {
    name,
    phone,
    email,
    mail,
    teamLimit,
    indivLimit
  },
  teams: [{ id, name, student1, student2, student3, student4 }],
  individuals: [{ id, student }],
  indivResults: [...],
  teamResults: [...]
}
```

Effective limits use the values in `server/config.js` when a record-specific limit is `-1`. The current frontend display limits in `client/src/config.js` are `3` teams and `3` individuals, while `server/config.js` currently sets both server limits to `-1`; the commented-out limit enforcement in `registration.js` means the limits are not currently enforced.

## 8. Registration API behavior

All registration routes are in `server/routes/registration.js` and use Airtable tables/fields directly.

### `POST /api/registration/update-coach-info`

Requires `req.user` and nonempty `name`, `phone`, and `mail`. Updates the authenticated Airtable `Coaches` record fields `Name`, `Address`, and `Phone`, then calls `updateUser` to return the refreshed projection.

### `POST /api/registration/update-team`

Supports both creation and update:

- With no `id`, creates a `Competitors` record.
- With `id`, fetches the record, checks that its linked `Coach` contains the current coach's Airtable ID, and updates it.

Validation and policy checks:

- Rejects all changes when `registrationClosed` is true.
- Requires a verified email.
- Requires coach email and phone fields.
- Requires a team name of at most 100 characters.
- Requires at least `minTeamMembersPerTeam` students, currently 2.
- Checks global team-name uniqueness through an Airtable formula.
- New team creation is separately blocked by `signupClosed`.
- Existing commented-out code shows that team-limit enforcement was intentionally disabled.

The record stores `Name`, `Student 1` through `Student 4`, and a linked `Coach` field containing the coach record ID.

### `POST /api/registration/update-indiv`

Supports creation and update of an individual competitor:

- Requires registration to remain open.
- Requires a verified email and coach phone.
- Requires a nonempty student name.
- Queries the current coach's individual records and rejects a duplicate `Student 1` value.
- With `id`, updates the record and forces `Individual: true`.
- Without `id`, creates a record and is blocked when `signupClosed` is true.

### `POST /api/registration/delete-competitor`

Requires registration to remain open, an authenticated user, and an ID. It fetches the competitor, verifies the competitor's linked `Coach` list contains the authenticated coach ID, destroys the Airtable record, and returns the refreshed dashboard projection.

## 9. Airtable data model used by the active API

The active API assumes an Airtable base identified by `airtableLink` in `server/config.js` and uses these tables/fields:

### `Coaches`

Important fields include:

- `Name`
- `Email`
- `Password` (bcrypt hash)
- `Address`
- `Phone`
- `Email Verified`
- `Email Verification Token`
- `Session` (JSON string containing session tokens)
- `IP`
- linked competitor fields and optional per-user limits referenced by older code

### `Competitors`

Important fields include:

- `Name`
- `Student 1`, `Student 2`, `Student 3`, `Student 4`
- `Individual`
- `Coach` (linked coach record IDs)
- formula-derived `Coach Email`, used by dashboard queries

### `Individual Results`

Read by `updateUser` using `Coach Email`. Fields exposed to the client include `Individual`, speed/accuracy/overall ranks and scores, and speed/accuracy distributions.

### `Team Results`

Read by team name after the coach-owned individual-result query. Fields exposed include team/guts/sweepstakes ranks, scores, distributions, guts estimation scores, and cumulative individual scores.

Airtable formula strings are constructed with user-supplied email, team name, or student values. Some code escapes quote characters, but the approach remains fragile and should be reviewed before accepting arbitrary input or changing Airtable field formulas.

## 10. Email system

`server/mail/transporter.js` configures Nodemailer with AWS SDK v2 SES. It reads AWS credentials and region from `server/env.js`, then creates an SES-backed transporter.

Active authentication emails:

- `server/mail/signup.js`: email verification link.
- `server/mail/resetPassword.js`: password reset link.

Other mail modules are used by historical/bulk scripts:

- `competitors.js`: registered competitor list/update email.
- `competitionDay.js` and `competitonDay.js`: competition-day IDs/instructions; the misspelled duplicate is a historical variant.
- `indivTeam.js`: individual-team assignment message.
- `scores.js` and `scoreReports.js`: older and newer score-report formats.
- `participationCertificate.js`: attaches generated participation PDFs.
- `awardCertificate.js`: attaches generated award PDFs.
- `testmail.js`: test message helper.

`server/env.example.js` contains placeholders for Google configuration. `server/.env.example` currently lists `AIRTABLE_API_KEY`, `GMAIL_PASSWORD`, and `SITE_URL`, but the active transporter uses AWS fields from `server/env.js`; the environment documentation is therefore incomplete and should be reconciled before onboarding a new operator.

## 11. Google Sheets and competition operations

The scripts in `server/scripts/` are not Express routes. They are one-off or event-period operational programs that are mostly disabled by commented-out calls. They should be run only after reviewing their target sheet, recipient addresses, and whether they append, clear, or email data.

### ID generation: `allIDs.js`

Reads registration sheets (`Teams`, `Individuals`) and writes generated identifiers to `Individual_IDs`, `Team_IDs`, and `Indiv_Team_IDs` when enabled. Individual IDs begin with `S`; team IDs begin with `T`. It tries to avoid duplicates in the current process and avoids duplicate student names between team and individual registrations. The generator is not a durable global uniqueness service; its in-memory sets reset when the process exits.

### Form collection: `formsCollection.js`

- `collect_non_guts()` merges rows from `Speed_A` through `Speed_D`, `Accuracy_A` through `Accuracy_D`, and `Team_A` through `Team_D` into `Indiv_speed`, `Indiv_accuracy`, and `Team`.
- `collect_guts(ind)` merges one of the eight Guts source groups into the corresponding consolidated Guts sheet, clears that destination, rewrites its header, and appends merged rows.

Only `collect_guts` is exported. The server imports it, but the scheduled invocation is commented out in `server/index.js`.

### Grading: `gutsGrading.js`

Contains several grading/statistics implementations (`grade`, `grade_export`, `grade_stats`, and `grade_guts`). It loads answer keys and registration/ID sheets, grades raw submissions, computes score/tiebreak values, ranks individuals and teams, and writes ranking rows to result sheets. The active exported function is `grade_guts`; the main scheduled calls are commented out.

The file contains formulas and assumptions for historical scoring structures. Compare it carefully with the current public 2026 rules before reuse; the repository includes both old eight-set Guts logic and newer public text describing six sets.

### Email and certificate scripts

- `coachEmails.js`: prints coach emails with competitors.
- `competitorEmails.js`: iterates Airtable coaches and sends competitor-list emails after an interactive confirmation flow.
- `competitionTeamEmails.js`, `competitonDayEmails.js`, and `IDEmails.js`: build coach/team/student structures from Google Sheets and send competition-day messages.
- `indivTeamEmails.js`: sends individual-team assignment messages.
- `scoreEmails.js`: joins registration/score sheets by generated student/team IDs and sends score reports.
- `scores.js`: older score-email workflow.
- `participationCertificates.js`: groups competitor data by coach and sends participation certificate attachments.
- `awardCertificates.js`: joins award rankings to competitor IDs and emails award certificate attachments.
- `generalEmail.js`: prints or prepares a general coach email list; the mail function is currently empty.
- `duplicates.js`, `duplicateCompetitors.js`, and `helpme.js`: inspection and duplicate-detection utilities.
- `hashPassword.js`: interactive bcrypt hash helper for manual operations.
- `certificates.js`: a small manual certificate-generation test.

Many bulk scripts contain `DONT RUN AGAIN`, commented-out `run()` calls, hard-coded test recipients, historical dates, or recipient overrides. They are not safe to treat as ordinary repeatable CLI commands without cleanup.

## 12. PDF certificate generation

`server/scripts/generateCertificate.js` loads PDF templates from relative paths under `assets/` and uses `pdf-lib` to draw a centered italic name onto the first page. It exports:

- `genCertificate(name)`: participation certificate bytes.
- `genAwardCertificate(name, awardName)`: award certificate bytes.

The mail modules convert the returned bytes to Buffers and send them as attachments through SES. Because the template paths are relative strings such as `assets/EMCC-certificate.pdf`, scripts should be launched with the expected working directory; running them from another directory may fail to locate the templates.

## 13. Public/static assets

`client/public/index.html`, `manifest.json`, and `robots.txt` are Create React App public files. Historical problem PDFs are under `client/public/papers/` and are linked by the archive list. The archive component does not query the server; links are static paths served by the frontend host.

The client source assets include sponsor logos, club photos, placeholders, the EMCC logo, and Lato font files. The `manifest`/service-worker scaffolding comes from Create React App, but the service worker is unregistered.

## 14. Deployment model described by the repository

The root README describes a Linux server deployment:

1. Enter the project directory.
2. Pull from Git.
3. Run `yarn build`.
4. Start or restart `server/index.js` with PM2.
5. Use Nginx for front-door HTTPS/static routing.
6. Use Certbot to renew certificates.

The intended production API URL is referenced in a commented line in `client/src/config.js` as `https://exetermathclub.com/api`. Production deployment therefore depends on Nginx routing `/api` to the Node server and serving the client build. Verify the actual Nginx configuration before changing the client URL.

## 15. Important current inconsistencies and risks

These are observations from the current code, not assumptions about deployment:

1. **Client API URL/proxy mismatch:** `client/package.json` defines a CRA proxy to `http://localhost:3001`, while `client/src/config.js` defaults to `http://localhost:3000/api`. Confirm whether the development server, production build, or an environment variable supplies the intended API URL.
2. **Old frontend toolchain:** `react-scripts@3.4.3` is incompatible with some modern Node/OpenSSL combinations without `NODE_OPTIONS`.
3. **Mixed lockfiles:** both `yarn.lock` and `package-lock.json` are present. Use the project's chosen package manager consistently and commit lockfile changes when dependencies change.
4. **Authentication cookie hardening:** cookies are HTTP-only but do not explicitly set `secure` or `sameSite`; logout clears browser cookies but does not revoke the Airtable session token.
5. **Global permissive CORS:** `app.use(cors())` allows all origins. This should be restricted in production if the site has a known origin.
6. **Airtable-backed sessions:** sessions are stored as a JSON array in one Airtable field and are fetched/parsed on requests. The array can grow, and logout does not remove tokens.
7. **Token concatenation format:** verification/reset URLs depend on the token not containing `rec` and on Airtable record IDs beginning with `rec`. This is brittle and should eventually be replaced by separate URL parameters or a signed/expiring token.
8. **Error handling:** several async route handlers do not have complete `try/catch` coverage. Airtable/API failures can become rejected promises despite the global logging handler.
9. **Response-before-email behavior:** signup and reset respond before awaiting email delivery, so the client can show success even if SES fails afterward.
10. **Inactive live scoreboard:** Socket.IO and grading scheduling are present but commented out; `guts.js` is inactive.
11. **Historical scripts are mixed with current scripts:** dates, score weights, sheet names, recipient overrides, and commented-out calls vary by competition year. Review every script before execution.
12. **Certificate path dependence:** PDF templates are loaded relative to the process working directory rather than relative to `__dirname`.
13. **Public text/config drift:** current contest constants and public pages contain 2026 content, while server registration dates/costs in `server/config.js` still contain 2024/2025 values. Update both sides together each competition year.
14. **Frontend validation is advisory:** client-side competitor validation improves UX, but server validation is the authority. The client has disabled limit checks in comments, matching the currently disabled server limit checks.
15. **Potential stale state in update responses:** the API refreshes from Airtable after mutations, but frontend MaterialTable promises call `resolve()` immediately after starting Axios in some handlers. This may allow the table UI to finish its edit lifecycle before the response updates state.
16. **Broken/inactive links and legacy content:** `travel.js` links to `/payment`, but the active payment page is not registered and `client/src/pages/payment.js` is fully commented out. Several older email templates also contain historical dates and URLs.
17. **HTML email escaping:** mail templates interpolate names and other sheet data directly into HTML. Bulk-email data should be trusted/escaped before sending.
18. **Secrets and repository hygiene:** `server/.env`, service-account credentials, AWS credentials, and Airtable keys must remain outside Git. `server/env.js` should be checked carefully before committing because it contains credential-shaped configuration.

## 16. Suggested maintenance sequence

For future maintainers, the safest order is:

1. Confirm the actual production routing and correct `emccServerUrl` for local and production environments.
2. Reconcile current contest-year values in `client/src/config.js`, `server/config.js`, public pages, email templates, and Google Sheet names.
3. Add a documented, repeatable script runner for operational jobs instead of uncommenting one-off calls.
4. Replace token concatenation with separate token/user parameters and add expiry/revocation.
5. Harden cookies and CORS for production.
6. Move Airtable and Google configuration to a documented environment/configuration contract.
7. Upgrade the React build toolchain, then remove the OpenSSL legacy workaround.
8. Add API and frontend tests around authentication, registration ownership checks, result projection, and registration-close behavior.

## 17. File map

### Client

- `client/src/index.js`: React bootstrap and service-worker choice.
- `client/src/App.js`: theme, context, route table, private-route wrapper, initial session lookup.
- `client/src/config.js`: contest constants, API URL, contacts, archives, legacy payment instructions.
- `client/src/footNav.js`: navigation/footer.
- `client/src/homepageLogo.js`, `client/src/homepageLogo.css`: animated homepage logo.
- `client/src/styled_components.js`: shared visual components.
- `client/src/pages/`: public/auth/dashboard page components.
- `client/src/pages/dashboardTabs/`: dashboard tabs and table icons.
- `client/src/pages/passwordResetPages/`: reset request and reset completion forms.
- `client/src/serviceWorker.js`: CRA service-worker implementation, currently unregistered.

### Server

- `server/index.js`: Express/Socket.IO bootstrap.
- `server/config.js`: Airtable base ID and registration policy values.
- `server/env.js`, `server/env.example.js`, `server/.env.example`: runtime configuration/credential placeholders.
- `server/middleware/fetchUser.js`: cookie-to-Airtable session lookup.
- `server/middleware/updateUser.js`: dashboard projection response middleware.
- `server/routes/auth.js`: authentication and password routes.
- `server/routes/registration.js`: coach/competitor mutation routes.
- `server/mail/`: SES/Nodemailer transport and email templates.
- `server/scripts/`: Google Sheets, Airtable inspection, grading, email, and certificate operations.
- `server/assets/`: PDF/DOCX templates.
- `server/live.js`: currently empty.
