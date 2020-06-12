import { Application, send } from "https://deno.land/x/oak/mod.ts";
import router from './routes.ts';

const PORT = 8000;
const HOST = "localhost";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server is now listening on ${HOST}:${PORT}`);

await app.listen({ port: PORT });

