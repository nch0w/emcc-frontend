# emcc-frontend

Prerequisites: [Node.js](https://nodejs.org/en/), [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable).

Tested on Node v23.1.0.

Install packages

```
yarn
```

Set up `server/.env` like `server/.env.example`

## Test locally (will run at http://localhost:3000)

```
yarn dev
```

## Deploy (run these commands on the server)

Enter the project directory

```
cd emcc-frontend
```

Pull from github

```
git pull
```

Build the static assets (i.e. html, css)

```
yarn build
```

Start the node process (if never started before)

```
pm2 start server/index.js
```

OR Restart the node process (if it's already running)

```
pm2 restart 0 --update-env
```

## Server management

Reboot the server (only if needed)

```
sudo reboot
```

Renew certificates (only if needed)

```
sudo certbot renew
```

Manually set an environment variable

```
set -Ux SITE_URL "https://exetermathclub.com"
```

Nginx files are located at `/etc/nginx`.

## Scripts

These are used for mailing and automated tasks.

- `node scripts/coachEmails.js`: lists all coach emails. Useful for mass emailing coaches, but make sure to BCC.

## Installing new npm packages

In `server/` (run from root directory)

```
yarn --cwd server add {package}
```

In `client/` (run from root directory)

```
yarn --cwd client add {package}
```

# FAQ

Q. How to fix an error like this:

```
[CLIENT] Error: error:0308010C:digital envelope routines::unsupported
[CLIENT]     at new Hash (node:internal/crypto/hash:79:19)
[CLIENT]     at Object.createHash (node:crypto:139:10)
[CLIENT]     at module.exports (/Users/neil/code/emcc-frontend/node_modules/webpack/lib/util/createHash.js:135:53)
[CLIENT]     at NormalModule._initBuildHash (/Users/neil/code/emcc-frontend/node_modules/webpack/lib/NormalModule.js:417:16)
[CLIENT]     at /Users/neil/code/emcc-frontend/node_modules/webpack/lib/NormalModule.js:452:10
[CLIENT]     at /Users/neil/code/emcc-frontend/node_modules/webpack/lib/NormalModule.js:323:13
[CLIENT]     at /Users/neil/code/emcc-frontend/node_modules/loader-runner/lib/LoaderRunner.js:367:11
[CLIENT]     at /Users/neil/code/emcc-frontend/node_modules/loader-runner/lib/LoaderRunner.js:233:18
[CLIENT]     at context.callback (/Users/neil/code/emcc-frontend/node_modules/loader-runner/lib/LoaderRunner.js:111:13)
[CLIENT]     at /Users/neil/code/emcc-frontend/node_modules/react-scripts/node_modules/babel-loader/lib/index.js:59:103 {
[CLIENT]   opensslErrorStack: [
```

A. run `export NODE_OPTIONS=--openssl-legacy-provider` in the terminal, then run the command again.

Q. how to fix node heap out of memory error on the server, when running `yarn build`?

A. run `export NODE_OPTIONS='--max-old-space-size=4096 --openssl-legacy-provider'` in the terminal, then run the command again.
