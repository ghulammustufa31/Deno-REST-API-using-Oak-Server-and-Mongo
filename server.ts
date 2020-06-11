import { Application, send } from "https://deno.land/x/oak/mod.ts";

const PORT = 8000;

const app = new Application();

app.use(async (context) => {
    await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}/public/`,
        index: 'index.html'
    });
});

await app.listen({ port: PORT });

