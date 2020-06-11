import { Router, send } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router
    .get('/', async (ctx) => {
        await send(ctx, ctx.request.url.pathname, {
            root: `${Deno.cwd()}/public/`,
            index: 'index.html'
        });
    });


export default router;