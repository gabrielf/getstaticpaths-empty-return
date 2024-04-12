This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It demonstrates a bug(?) in `next-on-pages` which fails a build where `getStaticPaths` return an empty array.

Why would anyone want to return an empty array from `getStaticPaths`? Well, it's a way to not include a page in the build. 
This is useful when you want to conditionally include a page in the build for example a test page that should not be 
included in production.

## Building with `next build`

The `[maybe]` page is included by default.

```shell
npm run build && npm start

# In another terminal
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/maybe
```

The curl command will return `200`.

Setting `MAYBE=false` makes the `[maybe]` page disappear.

```shell
MAYBE=false npm run build && npm start

# In another terminal
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/maybe
```

The curl command will return `404`.


## Building with `next-on-pages`

Building with the `[maybe]` page included succeeds.

```shell
npx @cloudflare/next-on-pages@1 && npm run wrangler

# In another terminal
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/maybe
```

Building without the `[maybe]` page included fails.

```shell
MAYBE=false npx @cloudflare/next-on-pages@1
```

Fails with the error:

```
⚡️ Completed `npx vercel build`.

⚡️ ERROR: Failed to produce a Cloudflare Pages build from the project.
⚡️ 
⚡️ 	The following routes were not configured to run with the Edge Runtime:
⚡️ 	  - /[maybe]
⚡️ 
⚡️ 	Please make sure that all your non-static routes export the following edge runtime route segment config:
⚡️ 	  export const runtime = 'edge';
⚡️ 
⚡️ 	You can read more about the Edge Runtime on the Next.js documentation:
⚡️ 	  https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
```

If `export const runtime = 'edge';` is added then the build fails with the error:

```
▲  Error: Page /[maybe] provided runtime 'edge', the edge runtime for rendering is currently experimental. Use runtime 'experimental-edge' instead.
```

If `edge` is replaced with `experimental-edge` then the build succeeds but navigating to `/maybe` will lead to a 500 error.

The error message from wrangler:

```
✘ [ERROR] A hanging Promise was canceled. This happens when the worker runtime is waiting for a Promise from JavaScript to resolve, but has detected that the Promise cannot possibly ever resolve because all code and events related to the Promise's I/O context have already finished.

✘ [ERROR] Uncaught (in response) Error: The script will never generate a response.
```

The error message displayed in the browser:

```
Error: The script will never generate a response.
    at async Object.fetch (file:///Users/gabrielfalkenberg/.npm/_npx/32026684e21afda6/node_modules/miniflare/dist/src/workers/core/entry.worker.js:944:22)
```
