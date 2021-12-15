# emcc-frontend

Prerequisites: [Node.js](https://nodejs.org/en/), [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable).

Install packages

```
yarn
```

## Test locally (will run at http://localhost:3000)

```
yarn dev
```

## Deploy (run these commands on the server)

Build the static assets (i.e. html, css)

```
yarn build
```

Start the node process

```
pm2 start server/index.js
```

Restart the node process

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

Nginx files are located at `/etc/nginx`.
