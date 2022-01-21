# emcc-frontend

Prerequisites: [Node.js](https://nodejs.org/en/), [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable).

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
